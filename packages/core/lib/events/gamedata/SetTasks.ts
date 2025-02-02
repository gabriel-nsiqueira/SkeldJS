import { BasicEvent } from "@skeldjs/events";
import { RoomEvent } from "../RoomEvent";
import { GameData } from "../../objects";
import { Hostable } from "../../Hostable";
import { PlayerInfo } from "../../misc/PlayerInfo";
import { GameDataEvent } from "./GameDataEvent";

/**
 * Emitted when a player's tasks are set.
 */
export class GameDataSetTasksEvent<RoomType extends Hostable = Hostable> extends BasicEvent implements RoomEvent, GameDataEvent {
    static eventName = "gamedata.settasks" as const;
    eventName = "gamedata.settasks" as const;

    private _alteredTasks: number[];

    constructor(
        public readonly room: RoomType,
        public readonly gamedata: GameData<RoomType>,
        /**
         * Information about the player that had their tasks set.
         */
        public readonly player: PlayerInfo<RoomType>,
        /**
         * The player's old tasks.
         */
        public readonly oldTasks: number[],
        /**
         * The player's new tasks that were just set.
         */
        public readonly newTasks: number[]
    ) {
        super();

        this._alteredTasks = newTasks;
    }

    /**
     * The alternate tasks to set the player, if changed.
     */
    get alteredTasks() {
        return this._alteredTasks;
    }

    /**
     * Set the tasks to the tasks that the player had before this event.
     * @returns
     */
    revert() {
        return this.setTasks(this.oldTasks);
    }

    /**
     * Change the tasks of the player that were set.
     * @param tasks The tasks to set the player.
     */
    setTasks(tasks: number[]) {
        this._alteredTasks = tasks;
    }
}
