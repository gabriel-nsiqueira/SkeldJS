import fs from "fs";
import path from "path";

import { Vector2 } from "@skeldjs/util";

import {
    CustomNetworkTransform,
    PlayerData,
    PlayerDataResolvable,
    TheSkeldVent,
    MiraHQVent,
    PolusVent,
    MapVentData,
    Hostable,
} from "@skeldjs/core";

import { EventEmitter, ExtractEventTypes } from "@skeldjs/events";

import { PathfinderConfig } from "./interface/PathfinderConfig";
import { Grid } from "./util/Grid";
import { Node } from "./util/Node";

import { getShortestPath } from "./engine";

import {
    PathfinderEndEvent,
    EngineMoveEvent,
    PathfinderPauseEvent,
    EngineRecalculateEvent,
    PathfinderStartEvent,
    PathfinderStopEvent
} from "./events";
import { PlayerLeaveEvent, PlayerMoveEvent } from "@skeldjs/core/lib/events";

export type SkeldjsPathfinderEvents = ExtractEventTypes<[
    PathfinderEndEvent,
    EngineMoveEvent,
    PathfinderPauseEvent,
    EngineRecalculateEvent,
    PathfinderStartEvent,
    PathfinderStopEvent
]>;

/**
 * Represents a pathfinding utility for the {@link SkeldjsClient SkeldJS Client}.
 *
 * See {@link SkeldjsPathfinderEvents} for events to listen to.
 */
export class SkeldjsPathfinder extends EventEmitter<SkeldjsPathfinderEvents> {
    private _tick: number;
    private _moved: boolean;
    private _paused: boolean;

    /**
     * The destination of the pathfinder.
     */
    destination: Vector2;

    /**
     * The grid of nodes for the pathfinder engine.
     */
    grid: Grid;

    /**
     * The current intended path of the pathfinder.
     */
    path: Node[];

    /**
     * The player that the pathfinder is currently finding.
     */
    following: PlayerData;

    constructor(
        private client: Hostable,
        public config: PathfinderConfig = {}
    ) {
        super();

        this._tick = 0;
        this.client.on("room.fixedupdate", this._ontick.bind(this));
        this.client.on("player.move", this._handleMove.bind(this));
        this.client.on("player.leave", this._handleLeave.bind(this));
    }

    private get snode() {
        if (!this.position) return null;

        return this.grid.nearest(this.position.x, this.position.y);
    }

    private get dnode() {
        if (!this.destination) return null;

        return this.grid.nearest(this.destination.x, this.destination.y);
    }

    get position() {
        return this.transform?.position;
    }

    get transform(): CustomNetworkTransform {
        return this.me?.transform;
    }

    get me() {
        return this.room?.me;
    }

    get room() {
        return this.client?.room;
    }

    get map() {
        return this.room?.settings?.map;
    }

    get paused() {
        return this._paused;
    }

    private async _ontick() {
        this._tick++;

        if (this._tick % SkeldjsPathfinder.MovementInterval !== 0) return;

        if (typeof this.map === "undefined") return;

        if (!this.grid) {
            const buff = fs.readFileSync(
                path.resolve(__dirname, "../../data/build", "" + this.map)
            );
            this.grid = Grid.fromBuffer(buff);
        }

        if (!this.snode || !this.dnode) return;

        if (
            this._moved ||
            !this.path ||
            this._tick % (this.config.recalculateEvery || 1) === 0
        ) {
            await this.recalculate();
            this._moved = false;
        }

        if (this._paused) return;

        const next = this.path.shift();

        if (next) {
            const pos = this.grid.actual(next.x, next.y);
            const dist = Vector2.dist(this.position, pos);
            const ev = await this.emit(
                new EngineMoveEvent(pos)
            );
            if (!ev.canceled) {
                this.transform.move(pos, new Vector2(dist * this.client.settings.playerSpeed));
            }

            if (this.path.length === 0) {
                this._stop(true);
            }
        } else {
            this.destination = null;
            this.path = null;
        }
    }

    async recalculate() {
        this.grid.reset();
        this.path = getShortestPath(this.grid, this.snode, this.dnode);
        await this.emit(
            new EngineRecalculateEvent(
                this.path.map((node) => this.grid.actual(node.x, node.y))
            )
        );
    }

    pause() {
        this._paused = true;
        this.emit(
            new PathfinderPauseEvent
        );
    }

    start() {
        this._paused = false;
        this.emit(
            new PathfinderStartEvent(this.destination)
        );
    }

    private _stop(reached: boolean) {
        this.destination = null;
        if (!reached) this._moved = true;

        this.emit(
            new PathfinderStopEvent(reached)
        );
        if (reached) {
            this.emit(
                new PathfinderEndEvent
            );
        }
    }

    stop() {
        this._stop(false);
    }

    private _go(dest: Vector2) {
        this.destination = new Vector2(dest);
        this._moved = true;
        this.start();
    }

    go(pos: PlayerDataResolvable | Vector2 | Node) {
        const vec = pos as Vector2;

        if (vec.x) {
            this._go(vec);
            return;
        }

        if (pos instanceof Node) {
            return this.grid.actual(pos.x, pos.y);
        }

        const resolved = this.client?.room?.resolvePlayer(
            pos as PlayerDataResolvable
        );

        if (resolved && resolved.spawned) {
            const position = resolved.transform.position;

            return this.go(position);
        }
    }

    vent(ventid: TheSkeldVent | MiraHQVent | PolusVent) {
        if (!this.map) return;

        const coords = MapVentData[this.map][ventid];

        this.go(new Vector2(coords.position));
    }

    private _handleMove(ev: PlayerMoveEvent) {
        if (ev.player === this.following) {
            this.destination = new Vector2(ev.position);
            this._moved = true;
        }
    }

    private _handleLeave(ev: PlayerLeaveEvent) {
        if (ev.player === this.following) {
            this._stop(false);
            this.following = null;
        }
    }

    follow(player: PlayerDataResolvable) {
        const resolved = this.client?.room?.resolvePlayer(player);

        if (resolved && resolved.spawned) {
            this.following = resolved;
        }
    }

    static MovementInterval = 6 as const;
}