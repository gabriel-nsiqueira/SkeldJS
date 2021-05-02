import dgram from "dgram";

import { EventEmitter, ExtractEventTypes } from "@skeldjs/events";

import { VersionInfo } from "@skeldjs/util";

import { DisconnectReason } from "@skeldjs/constant";

import {
    AcknowledgePacket,
    BaseRootPacket,
    DisconnectPacket,
    GameDataMessage,
    JoinGameMessage,
    ReliablePacket,
    RemovePlayerMessage,
} from "@skeldjs/protocol";

import { SkeldjsServer } from "./server";
import { Room } from "./Room";

import {
    RemoteClientConnectEvent,
    RemoteClientDisconnectEvent,
    RemoteClientJoinRoomEvent
} from "./events";

export interface SentPacket {
    nonce: number;
    ackd: boolean;
}

export type RemoteClientEvents = ExtractEventTypes<[
    RemoteClientConnectEvent,
    RemoteClientDisconnectEvent,
    RemoteClientJoinRoomEvent
]>;

/**
 * Represents a remotely connected client.
 *
 * See {@link RemoteClientEvents} for events to listen to.
 */
export class RemoteClient extends EventEmitter<RemoteClientEvents> {
    private _nonce: number;

    /**
     * The version of the remote client's game client.
     */
    version: VersionInfo;

    /**
     * The username of the remote client.
     */
    username: string;

    /**
     * Whether or not the remote client has identified with the server.
     */
    identified: boolean;

    /**
     * Whether or not the remote client has disconnected.
     */
    disconnected: boolean;

    /**
     * The room that the remote client is currently in.
     */
    room: Room;

    /**
     * An array of the last 8 packets that have been sent to the remote client.
     */
    packets_sent: SentPacket[];

    /**
     * An array of the last 8 packets that have been received from the remote client.
     */
    packets_recv: number[];

    /**
     * The message stream to be sent on fixed update.
     */
    stream: GameDataMessage[];

    constructor(
        private server: SkeldjsServer,
        public readonly remote: dgram.RemoteInfo,
        public readonly clientid: number
    ) {
        super();

        this._nonce = 0;
        this.room = null;

        this.packets_sent = [];
        this.packets_recv = [];
        this.stream = [];
    }

    /**
     * An incrementing unique packet ID for the client.
     */
    get nonce() {
        this._nonce++;

        if (this._nonce > 2 ** 16 - 1) {
            this._nonce = 1;
        }

        return this._nonce;
    }

    async emit<Event extends RemoteClientEvents[keyof RemoteClientEvents]>(
        event: Event
    ): Promise<Event> {
        this.server.emit(event);

        return super.emit(event);
    }

    identify(username: string, version: string | number | VersionInfo) {
        this.username = username;

        if (version instanceof VersionInfo) {
            this.version = version;
        } else {
            this.version = VersionInfo.from(version);
        }
    }

    async send(packet: BaseRootPacket) {
        return await this.server.send(this, packet);
    }

    async ack(nonce: number) {
        await this.send(
            new AcknowledgePacket(
                nonce,
                this.packets_sent.filter((p) => p.ackd).map((_, i) => i)
            )
        );
    }

    async disconnect(reason: DisconnectReason = -1, message?: string) {
        if (this.room) {
            await this.room.handleLeave(this.clientid);
            for (const [, remote] of this.room.remotes) {
                remote.send(
                    new ReliablePacket(remote.nonce, [
                        new RemovePlayerMessage(
                            this.room.code,
                            this.clientid,
                            this.room.options.SaaH
                                ? remote.clientid
                                : this.room.hostid,
                            DisconnectReason.None
                        ),
                    ])
                );
            }
            this.room = null;
        }

        if (reason === -1) {
            this.send(new DisconnectPacket(DisconnectReason.None));
        } else {
            this.send(new DisconnectPacket(reason, message, true));
        }
        this.disconnected = true;
    }

    async joinError(reason: DisconnectReason, message?: string) {
        this.send(
            new ReliablePacket(this.nonce, [
                new JoinGameMessage(reason, message),
            ])
        );
    }
}
