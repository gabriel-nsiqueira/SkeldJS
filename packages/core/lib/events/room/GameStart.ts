import { BasicEvent } from "@skeldjs/events";

import { Hostable } from "../../Hostable";
import { RoomEvent } from "../RoomEvent";

/**
 * Emitted when a game is started.
 */
export class RoomGameStartEvent extends BasicEvent implements RoomEvent {
    static eventName = "room.gamestart" as const;
    eventName = "room.gamestart" as const;

    constructor(
        public readonly room: Hostable
    ) {
        super();
    }
}
