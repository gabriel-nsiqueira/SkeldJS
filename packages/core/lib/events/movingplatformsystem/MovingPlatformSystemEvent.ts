import { Hostable } from "../../Hostable";
import { MovingPlatformSystem } from "../../system";
import { RoomEvent } from "../RoomEvent";

export class MovingPlatformSystemEvent extends RoomEvent {
    system: MovingPlatformSystem;

    constructor(room: Hostable, system: MovingPlatformSystem) {
        super(room);

        this.system = system;
    }
}
