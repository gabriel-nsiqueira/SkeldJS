import { HazelReader, HazelWriter } from "@skeldjs/util";
import { RpcMessageTag, SpawnType, SystemType } from "@skeldjs/constant";
import { ExtractEventTypes } from "@skeldjs/events";
import { BaseRpcMessage, RepairSystemMessage } from "@skeldjs/protocol";

import {
    AutoDoorsSystemEvents,
    DeconSystemEvents,
    DoorsSystemEvents,
    ElectricalDoorsSystemEvents,
    HqHudSystemEvents,
    HudOverrideSystemEvents,
    LifeSuppSystemEvents,
    MedScanSystemEvents,
    MovingPlatformSystemEvents,
    ReactorSystemEvents,
    SabotageSystemEvents,
    SecurityCameraSystemEvents,
    SwitchSystemEvents,
    SystemStatus,
} from "../system";

import { SystemStatusEvents } from "../system/events";

import { Networkable, NetworkableEvents } from "../Networkable";
import { Hostable } from "../Hostable";
import { PlayerData } from "../PlayerData";
import { RoomSelectImpostorsEvent } from "../events";

type AllSystems = Partial<Record<SystemType, SystemStatus<any, any>>>;

export interface ShipStatusData {
    systems: AllSystems;
}

export type ShipStatusEvents = NetworkableEvents &
    DoorsSystemEvents &
    SystemStatusEvents &
    AutoDoorsSystemEvents &
    DeconSystemEvents &
    ElectricalDoorsSystemEvents &
    HqHudSystemEvents &
    HudOverrideSystemEvents &
    LifeSuppSystemEvents &
    MedScanSystemEvents &
    MovingPlatformSystemEvents &
    ReactorSystemEvents &
    SabotageSystemEvents &
    SecurityCameraSystemEvents &
    SwitchSystemEvents &
    ExtractEventTypes<[ RoomSelectImpostorsEvent ]>;

export type ShipStatusType =
    | SpawnType.ShipStatus
    | SpawnType.Headquarters
    | SpawnType.PlanetMap
    | SpawnType.AprilShipStatus
    | SpawnType.Airship;

export type ShipStatusClassname =
    | "ShipStatus"
    | "Headquarters"
    | "PlanetMap"
    | "AprilShipStatus"
    | "Airship";

export class InnerShipStatus extends Networkable<
    ShipStatusData,
    ShipStatusEvents
> {
    static type: ShipStatusType;
    type!: ShipStatusType;

    static classname: ShipStatusClassname;
    classname!: ShipStatusClassname;

    systems!: AllSystems;

    constructor(
        room: Hostable<any>,
        netid: number,
        ownerid: number,
        data?: HazelReader | ShipStatusData
    ) {
        super(room, netid, ownerid, data);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    Setup() {}

    Deserialize(reader: HazelReader, spawn: boolean = false) {
        if (!this.systems) this.Setup();

        while (reader.left) {
            const [tag, mreader] = reader.message();
            const system = this.systems[tag as SystemType] as SystemStatus;

            if (system) {
                system.Deserialize(mreader, spawn);
            }
        }
    }

    /* eslint-disable-next-line */
    Serialize(writer: HazelWriter, spawn: boolean = false) {
        if (!this.systems) this.Setup();
        const systems = Object.values(this.systems);
        for (let i = 0; i < systems.length; i++) {
            const system = systems[i];

            if (system?.dirty) {
                writer.begin(i);
                system.Serialize(writer, spawn);
                writer.end();
            }
        }

        this.dirtyBit = 0;
        return true;
    }

    async HandleRpc(rpc: BaseRpcMessage) {
        switch (rpc.tag) {
            case RpcMessageTag.RepairSystem:
                this._handleRepairSystem(rpc as RepairSystemMessage);
                break;
        }
    }

    FixedUpdate(delta: number) {
        if (!this.systems) this.Setup();

        const systems = Object.values(this.systems);
        for (let i = 0; i < systems.length; i++) {
            const system = systems[i];

            system?.Detoriorate(delta);
        }
    }

    private _handleRepairSystem(rpc: RepairSystemMessage) {
        const system = this.systems[rpc.systemid as SystemType] as SystemStatus;
        const player = this.room.getPlayerByNetId(rpc.netid);

        if (system && player) {
            system.HandleRepair(player, rpc.amount);
        }
    }

    async selectImpostors() {
        const available = [...this.room.players.values()].filter(
            (player) =>
                player.data && !player.data.disconnected && !player.data.dead
        );
        const max = available.length < 7 ? 1 : available.length < 9 ? 2 : 3;
        const impostors: PlayerData[] = [];

        for (
            let i = 0;
            i < Math.min(this.room.settings.numImpostors, max);
            i++
        ) {
            const random = ~~(available.length - 1);
            impostors.push(available[random]);
            available.splice(random, 1);
        }

        const ev = await this.emit(
            new RoomSelectImpostorsEvent(
                this.room,
                impostors
            )
        );

        if (!ev.canceled) {
            this.room.host?.control?.setImpostors(ev.impostors);
        }
    }
}
