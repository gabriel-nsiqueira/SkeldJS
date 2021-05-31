import { RevertableEvent } from "@skeldjs/events";
import { RepairSystemMessage } from "@skeldjs/protocol";
import { Hostable } from "../../Hostable";
import { PlayerData } from "../../PlayerData";
import { LifeSuppSystem } from "../../system";
import { ProtocolEvent } from "../ProtocolEvent";
import { RoomEvent } from "../RoomEvent";
import { O2Event } from "./O2Event";

/**
 * Emitted when a oxygen console is completed.
 */
export class O2ConsoleCompleteEvent extends RevertableEvent implements RoomEvent, O2Event, ProtocolEvent {
    static eventName = "o2.consoles.complete" as const;
    eventName = "o2.consoles.complete" as const;

    private _alteredConsoleId: number;

    constructor(
        public readonly room: Hostable,
        public readonly oxygen: LifeSuppSystem,
        public readonly message: RepairSystemMessage|undefined,
        /**
         * The player that completed the console. Only available is the client is the host.
         */
        public readonly player: PlayerData|undefined,
        /**
         * The ID of the console that was completed.
         */
        public readonly consoleId: number
    ) {
        super();

        this._alteredConsoleId = consoleId;
    }

    /**
     * The ID of the altered console that will be completed instead, if changed.
     */
    get alteredConsoleId() {
        return this._alteredConsoleId;
    }

    /**
     * Change the console that was completed.
     * @param consoleId The ID of the console to complete.
     */
    setConsole(consoleId: number) {
        this._alteredConsoleId = consoleId;
    }
}
