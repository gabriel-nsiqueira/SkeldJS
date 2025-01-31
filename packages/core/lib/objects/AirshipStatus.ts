import { HazelReader, Vector2 } from "@skeldjs/util";
import { SpawnType, SystemType } from "@skeldjs/constant";

import { ShipStatusData, InnerShipStatus } from "./InnerShipStatus";

import { Hostable } from "../Hostable";

import {
    AutoDoorsSystem,
    HudOverrideSystem,
    SabotageSystem,
    SecurityCameraSystem,
    SwitchSystem,
    ElectricalDoorsSystem,
    MovingPlatformSide,
    MovingPlatformSystem,
} from "../systems";

import { Networkable, NetworkableConstructor } from "../Networkable";

/**
 * Represents a room object for the Airship map.
 *
 * See {@link ShipStatusEvents} for events to listen to.
 */
export class AirshipStatus<RoomType extends Hostable = Hostable> extends InnerShipStatus<RoomType> {
    static roomDoors = {
        [SystemType.Communications]: [0, 1, 2, 3],
        [SystemType.Brig]: [4, 5, 6],
        [SystemType.Kitchen]: [7, 8, 9],
        [SystemType.MainHall]: [10, 11],
        [SystemType.Records]: [12, 13, 14],
        [SystemType.Lounge]: [15, 16, 17],
        [SystemType.Medical]: [19, 20]
    }

    initialSpawnCenter = new Vector2(50, 50);
    meetingSpawnCenter = new Vector2(50, 50);

    constructor(
        room: RoomType,
        spawnType: SpawnType,
        netid: number,
        ownerid: number,
        flags: number,
        data?: HazelReader | ShipStatusData
    ) {
        super(room, spawnType, netid, ownerid, flags, data);
    }

    getComponent<T extends Networkable>(
        component: NetworkableConstructor<T>
    ): T|undefined {
        if (component === AirshipStatus as NetworkableConstructor<any>) {
            return this.components[0] as unknown as T;
        }

        return super.getComponent(component);
    }

    Setup() {
        this.systems.set(SystemType.Electrical, new SwitchSystem(this, {
            expected: [false, false, false, false, false],
            actual: [false, false, false, false, false],
            brightness: 255,
        }));

        this.systems.set(SystemType.Security, new SecurityCameraSystem(this, {
            players: new Set,
        }));

        this.systems.set(SystemType.Communications, new HudOverrideSystem(this, {
            sabotaged: false,
        }));

        this.systems.set(SystemType.Decontamination, new ElectricalDoorsSystem(this, {
            doors: [],
        }));

        this.systems.set(SystemType.Decontamination2, new AutoDoorsSystem(this, {
            dirtyBit: 0,
            doors: [],
        }));

        this.systems.set(SystemType.Sabotage, new SabotageSystem(this, {
            cooldown: 0,
        }));

        this.systems.set(SystemType.GapRoom, new MovingPlatformSystem(this, {
            target: undefined,
            side: MovingPlatformSide.Left,
            useId: 0,
        }));
    }
}
