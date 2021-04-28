import { CancelableEvent } from "@skeldjs/events";

import { Hostable } from "../Hostable";

export class RoomEvent extends CancelableEvent {
    room: Hostable;

    constructor(room: Hostable<any>) {
        super();

        this.room = room;
    }
}
