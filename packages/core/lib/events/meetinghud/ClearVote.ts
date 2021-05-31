import { BasicEvent } from "@skeldjs/events";
import { ClearVoteMessage } from "@skeldjs/protocol";

import { MeetingHud } from "../../component";
import { Hostable } from "../../Hostable";
import { PlayerVoteState } from "../../misc/PlayerVoteState";
import { ProtocolEvent } from "../ProtocolEvent";
import { RoomEvent } from "../RoomEvent";
import { MeetingHudEvent } from "./MeetingHudEvent";

/**
 * Emitted when a player's vote is cleared. Only emitted if the client is the
 * host or if the client is the player having their vote cleared.
 */
export class MeetingHudClearVoteEvent extends BasicEvent implements RoomEvent, MeetingHudEvent, ProtocolEvent {
    static eventName = "meeting.clearvote" as const;
    eventName = "meeting.clearvote" as const;

    constructor(
        public readonly room: Hostable,
        public readonly meetinghud: MeetingHud,
        public readonly message: ClearVoteMessage|undefined,
        /**
         * The player that had their vote cleared.
         */
        public readonly player: PlayerVoteState
    ) {
        super();
    }
}
