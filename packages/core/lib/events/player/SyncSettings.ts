import { GameOptions } from "@skeldjs/protocol";

import { PlayerEvent } from "./PlayerEvent";
import { Hostable } from "../../Hostable";
import { PlayerData } from "../../PlayerData";

export class PlayerSyncSettingsEvent extends PlayerEvent {
    static eventName = "player.syncsettings" as const;
    eventName = "player.syncsettings" as const;

    options: GameOptions;

    constructor(room: Hostable<any>, player: PlayerData, options: GameOptions) {
        super(room, player);

        this.options = options;
    }
}
