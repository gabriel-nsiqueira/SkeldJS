import { BasicEvent } from "@skeldjs/events";

import { Hostable } from "../../Hostable";
import { PlayerData } from "../../PlayerData";
import { RoomEvent } from "../RoomEvent";
import { PlayerEvent } from "./PlayerEvent";

/**
 * Emitted when a player leaves the room.
 */
export class PlayerLeaveEvent extends BasicEvent implements RoomEvent, PlayerEvent {
    static eventName = "player.leave" as const;
    eventName = "player.leave" as const;

    constructor(
        public readonly room: Hostable,
        public readonly player: PlayerData
    ) {
        super();
    }
}
