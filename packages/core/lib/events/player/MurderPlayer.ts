import { PlayerEvent } from "./PlayerEvent";
import { Hostable } from "../../Hostable";
import { PlayerData } from "../../PlayerData";

export class PlayerMurderPlayerEvent extends PlayerEvent {
    static eventName = "player.murder" as const;
    eventName = "player.murder" as const;

    victim: PlayerData;

    constructor(room: Hostable<any>, player: PlayerData, victim: PlayerData) {
        super(room, player);

        this.victim = victim;
    }
}
