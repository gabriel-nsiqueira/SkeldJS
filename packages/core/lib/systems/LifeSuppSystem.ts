import { HazelReader, HazelWriter } from "@skeldjs/util";
import { ExtractEventTypes } from "@skeldjs/events";
import { RepairSystemMessage } from "@skeldjs/protocol";
import { SystemType } from "@skeldjs/constant";

import { InnerShipStatus } from "../objects";
import { SystemStatus } from "./SystemStatus";
import { PlayerData } from "../PlayerData";

import {
    O2ConsolesClearEvent,
    O2ConsolesCompleteEvent,
    SystemRepairEvent,
    SystemSabotageEvent
} from "../events";
import { SystemStatusEvents } from "./events";
import { Hostable } from "../Hostable";

export interface LifeSuppSystemData {
    timer: number;
    completed: Set<number>;
}

export type LifeSuppSystemEvents<RoomType extends Hostable = Hostable> = SystemStatusEvents<RoomType> &
    ExtractEventTypes<[
        O2ConsolesClearEvent<RoomType>,
        O2ConsolesCompleteEvent<RoomType>
    ]>;

/**
 * Represents a system responsible for handling oxygen consoles.
 *
 * See {@link LifeSuppSystemEvents} for events to listen to.
 */
export class LifeSuppSystem<RoomType extends Hostable = Hostable> extends SystemStatus<
    LifeSuppSystemData,
    LifeSuppSystemEvents,
    RoomType
> implements LifeSuppSystemData {
    static systemType = SystemType.O2 as const;
    systemType = SystemType.O2 as const;

    private lastUpdate = 0;

    /**
     * The timer until oxygen runs out.
     */
    timer: number;

    /**
     * The completed consoles.
     */
    completed: Set<number>;

    constructor(
        ship: InnerShipStatus<RoomType>,
        data?: HazelReader | LifeSuppSystemData
    ) {
        super(ship, data);

        this.timer ??= 10000;
        this.completed ||= new Set;
    }

    get sabotaged() {
        return this.timer < 10000;
    }

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Deserialize(reader: HazelReader, spawn: boolean) {
        const timer = this.timer;
        this.timer = reader.float();

        const num_consoles = reader.upacked();
        if (this.completed.size > 0 && num_consoles === 0) {
            this._clearConsoles(undefined, undefined);
        } else {
            for (let i = 0; i < num_consoles; i++) {
                const consoleId = reader.upacked();
                this._completeConsole(consoleId, undefined, undefined);
            }
        }

        if (timer === 10000 && this.timer < 10000) {
            this.emit(
                new SystemSabotageEvent(
                    this.room,
                    this,
                    undefined,
                    undefined
                )
            );
        } else if (timer < 10000 && this.timer === 10000) {
            this.emit(
                new SystemRepairEvent(
                    this.room,
                    this,
                    undefined,
                    undefined
                )
            );
        }
    }

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Serialize(writer: HazelWriter, spawn: boolean) {
        writer.float(this.timer);

        writer.upacked(this.completed.size);
        for (const console of this.completed) {
            writer.upacked(console);
        }
    }

    async HandleSabotage(player: PlayerData<RoomType>|undefined, rpc: RepairSystemMessage|undefined) {
        this.timer = 45;
        const oldCompleted = this.completed;
        this._clearConsoles(player, rpc);

        const ev = await this.emit(
            new SystemSabotageEvent(
                this.room,
                this,
                rpc,
                player
            )
        );

        if (ev.reverted) {
            this.timer = 10000;
            this.completed = oldCompleted;
        }
    }

    private async _clearConsoles(player: PlayerData|undefined, rpc: RepairSystemMessage|undefined) {
        const completedBefore = new Set(this.completed);
        this.completed = new Set;
        this.dirty = true;

        const ev = await this.emit(
            new O2ConsolesClearEvent(
                this.room,
                this,
                rpc,
                player
            )
        );

        if (ev.reverted) {
            this.completed = completedBefore;
        }
    }

    /**
     * Clear the completed consoles. This is a host operation on official servers.
     */
    async clearConsoles() {
        await this._clearConsoles(this.room.myPlayer, undefined);
    }

    private async _completeConsole(consoleid: number, player: PlayerData|undefined, rpc: RepairSystemMessage|undefined): Promise<void> {
        this.completed.add(consoleid);
        this.dirty = true;

        const ev = await this.emit(
            new O2ConsolesCompleteEvent(
                this.room,
                this,
                undefined,
                player,
                consoleid
            )
        );

        if (ev.reverted) {
            this.completed.delete(ev.consoleId);
            return;
        }

        if (ev.alteredConsoleId !== consoleid) {
            this.completed.delete(consoleid);
            this.completed.add(ev.alteredConsoleId);
        }

        if (this.completed.size >= 2) {
            await this._repair(player, rpc);
        }
    }

    /**
     * Mark a console as being complete.
     * @param consoleId The ID of the console to mark as complete.
     */
    async completeConsole(consoleid: number) {
        if (this.room.hostIsMe) {
            await this._completeConsole(consoleid, this.room.myPlayer, undefined);
        } else {
            await this._sendRepair(0x40 | consoleid);
        }
    }

    private async _repair(player: PlayerData|undefined, rpc: RepairSystemMessage|undefined) {
        const oldTimer = this.timer;
        const oldCompleted = this.completed;
        this.timer = 10000;
        this.completed = new Set;
        this.dirty = true;

        const ev = await this.emit(
            new O2ConsolesClearEvent(
                this.room,
                this,
                rpc,
                player
            )
        );

        if (ev.reverted) {
            this.timer = oldTimer;
            this.completed = oldCompleted;
        }
    }

    async repair() {
        if (this.room.hostIsMe) {
            this._repair(this.room.myPlayer, undefined);
        } else {
            await this._sendRepair(0x10);
        }
    }

    async HandleRepair(player: PlayerData<RoomType>|undefined, amount: number, rpc: RepairSystemMessage|undefined) {
        const consoleId = amount & 0x3;

        if (amount & 0x40) {
            await this._completeConsole(consoleId, player, rpc);
        } else if (amount & 0x10) {
            await this._repair(player, rpc);
        }
    }

    Detoriorate(delta: number) {
        if (!this.sabotaged) return;

        this.timer -= delta;
        this.lastUpdate += delta;

        if (this.lastUpdate > 2) {
            this.lastUpdate = 0;
            this.dirty = true;
        }
    }
}
