import { Vector2, HazelBuffer, HazelReader, HazelWriter } from "@skeldjs/util";

import { DataMessage, RpcMessage } from "@skeldjs/protocol";
import { RpcMessageTag, SpawnType } from "@skeldjs/constant";
import { ExtractEventTypes } from "@skeldjs/events";

import { Networkable, NetworkableEvents } from "../Networkable";
import { PlayerData } from "../PlayerData";
import { Hostable } from "../Hostable";
import { NetworkUtils } from "../utils/net";

import { PlayerMoveEvent, PlayerSnapToEvent } from "../events";

export interface CustomNetworkTransformData {
    seqId: number;
    position: Vector2;
    velocity: Vector2;
}

export type CustomNetworkTransformEvents =
    NetworkableEvents &
ExtractEventTypes<[
    PlayerMoveEvent, PlayerSnapToEvent
]>;

/**
 * Represents player component for networking movement.
 *
 * See {@link CustomNetworkTransformEvents} for events to listen to.
 */
export class CustomNetworkTransform extends Networkable<
    CustomNetworkTransformData,
    CustomNetworkTransformEvents
> {
    static type = SpawnType.Player as const;
    type = SpawnType.Player as const;

    static classname = "CustomNetworkTransform" as const;
    classname = "CustomNetworkTransform" as const;

    /**
     * The previous sequence ID.
     */
    oldSeqId: number;

    /**
     * The current sequence ID.
     */
    seqId: number;

    /**
     * The current position of the player.
     */
    position: Vector2;

    /**
     * The velocity of the player.
     */
    velocity: Vector2;

    constructor(
        room: Hostable<any>,
        netid: number,
        ownerid: number,
        data?: HazelBuffer | CustomNetworkTransformData
    ) {
        super(room, netid, ownerid, data);
    }

    get player() {
        return this.owner as PlayerData;
    }

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Deserialize(reader: HazelReader, spawn: boolean = false) {
        const newSeqId = reader.uint16();

        if (!NetworkUtils.seqIdGreaterThan(newSeqId, this.seqId)) {
            return;
        }

        this.seqId = newSeqId;

        this.position = reader.vector();
        this.velocity = reader.vector();

        this.emit(
            new PlayerMoveEvent(
                this.room,
                this.player,
                {
                    x: this.position.x,
                    y: this.position.y,
                },
                {
                    x: this.velocity.x,
                    y: this.velocity.y,
                }
            )
        );
    }

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Serialize(writer: HazelWriter, spawn: boolean = false) {
        writer.uint16(this.seqId);
        writer.vector(this.position);
        writer.vector(this.velocity);
        this.dirtyBit = 0;
        return true;
    }

    HandleRpc(callid: RpcMessageTag, reader: HazelReader) {
        switch (callid) {
            case RpcMessageTag.SnapTo:
                const seqId = reader.uint16();
                const position = reader.vector();

                if (NetworkUtils.seqIdGreaterThan(seqId, this.seqId)) {
                    this.seqId = seqId;
                    this.position = position;
                    this.velocity = { x: 0, y: 0 };
                    this.emit(
                        new PlayerSnapToEvent(this.room, this.player, {
                            x: this.position.x,
                            y: this.position.y,
                        })
                    );
                }
                break;
        }
    }

    /**
     * Move to a position (lerps towards).
     * @param position The position to move towards.
     * @param velocity The velocity to display moving at.
     * @example
     *```typescript
     * // Follow the host
     * host.transform.on("player.move", ev => {
     *   player.transform.move(ev.data.position);
     * });
     * ```
     */
    async move(position: Vector2, velocity: Vector2 = { x: 0, y: 0 }) {
        this.seqId += 1;

        if (this.seqId > 2 ** 16 - 1) {
            this.seqId = 1;
        }

        this.position = position;
        this.velocity = velocity;

        this.dirtyBit = 1;
        const writer = HazelWriter.alloc(10);
        this.Serialize(writer, false);

        await this.room.broadcast(
            [new DataMessage(this.netid, writer.buffer)],
            false
        );

        this.emit(
            new PlayerMoveEvent(
                this.room,
                this.player,
                {
                    x: this.position.x,
                    y: this.position.y,
                },
                {
                    x: this.velocity.x,
                    y: this.velocity.y,
                }
            )
        );
    }

    /**
     * Instantly snap to a position (no lerping).
     * @param position The position to snap to.
     * @example
     *```typescript
     * // Instantly teleport to wherever the host moves.
     * host.transform.on("player.move", ev => {
     *   player.transform.snapTo(ev.data.position);
     * });
     * ```
     */
    async snapTo(position: Vector2) {
        this.seqId += 1;

        if (this.seqId > 2 ** 16 - 1) {
            this.seqId = 1;
        }

        this.position = position;
        this.dirtyBit = 0;

        const writer = HazelWriter.alloc(4);
        writer.vector(this.position);

        await this.room.stream.push(
            new RpcMessage(this.netid, RpcMessageTag.SnapTo, writer.buffer)
        );

        this.emit(
            new PlayerSnapToEvent(this.room, this.player, {
                x: this.position.x,
                y: this.position.y,
            })
        );
    }
}
