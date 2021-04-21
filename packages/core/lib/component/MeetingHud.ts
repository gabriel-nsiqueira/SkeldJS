import { HazelBuffer, HazelReader, HazelWriter } from "@skeldjs/util";

import {
    ChatNoteType,
    RpcMessageTag,
    SpawnType,
    VoteState,
} from "@skeldjs/constant";

import { Networkable, NetworkableEvents } from "../Networkable";
import { PlayerDataResolvable, Hostable } from "../Hostable";
import { PlayerVoteState } from "../misc/PlayerVoteState";
import { PlayerData } from "../PlayerData";
import { Heritable } from "../Heritable";
import { RpcMessage } from "@skeldjs/protocol";

export interface MeetingHudData {
    dirtyBit: number;
    states: Map<number, PlayerVoteState>;
}

/**
 * Represents a room object that holds voting states.
 *
 * See {@link MeetingHudEvents} for events to listen to.
 */
export interface MeetingHudEvents extends NetworkableEvents {
    /**
     * Emitted when a player casts a vote.
     */
    "meetinghud.votecast": {
        /**
         * The player that cast the vote.
         */
        voter: PlayerData;
        /**
         * The suspect that the player voted for.
         */
        suspect: PlayerData | "skip";
    };
    /**
     * Emitted when a player's vote is cleared.
     */
    "meetinghud.voteclear": {
        /**
         * The player that had their vote cleared.
         */
        player: PlayerData;
    };
    /**
     * Emitted when voting is completed.
     */
    "meetinghud.votingcomplete": {
        /**
         * Whether or not the votes ended in a tie.
         */
        tie: boolean;
        /**
         * The player that got voted out.
         */
        ejected: PlayerData;
        /**
         * The vote states of each player in the meeting.
         */
        voteStates: PlayerVoteState[];
    };
    /**
     * Emitted when the meeting hud is closed.
     */
    "meetinghud.close": {};
}

export class MeetingHud extends Networkable<MeetingHudData, MeetingHudEvents> {
    static type = SpawnType.MeetingHud as const;
    type = SpawnType.MeetingHud as const;

    static classname = "MeetingHud" as const;
    classname = "MeetingHud" as const;

    /**
     * The dirty vote states to be updated on the next fixed update.
     */
    dirtyBit: number;

    /**
     * The vote states in the meeting hud.
     */
    states: Map<number, PlayerVoteState>;

    constructor(
        room: Hostable<any>,
        netid: number,
        ownerid: number,
        data?: HazelBuffer | MeetingHudData
    ) {
        super(room, netid, ownerid, data);
    }

    get owner() {
        return super.owner as Heritable;
    }

    Deserialize(reader: HazelReader, spawn: boolean = false) {
        if (spawn) {
            this.dirtyBit = 0;
            this.states = new Map();

            for (let i = 0; i < this.states.size; i++) {
                this.states.set(
                    i,
                    new PlayerVoteState(this.room, i, reader.byte())
                );
            }
        } else {
            const mask = reader.upacked();

            for (let i = 0; i < this.states.size; i++) {
                if (mask & (1 << i)) {
                    this.states.set(
                        i,
                        new PlayerVoteState(this.room, i, reader.byte())
                    );
                }
            }
        }
    }

    Serialize(writer: HazelWriter, spawn: boolean = false) {
        if (spawn) {
            for (const [, player] of this.states) {
                writer.upacked(player.state);
            }
        } else {
            writer.upacked(this.dirtyBit);

            for (const [playerId, player] of this.states) {
                if (this.dirtyBit & (1 << playerId)) {
                    writer.upacked(player.state);
                }
            }
        }
        this.dirtyBit = 0;
        return true;
    }

    HandleRpc(callid: RpcMessageTag, reader: HazelReader) {
        switch (callid) {
            case RpcMessageTag.Close:
                this._close();
                break;
            case RpcMessageTag.VotingComplete:
                const states = reader.list((r) => r.upacked());
                const exiled = reader.uint8();
                const tie = reader.bool();

                this._completeVoting(states, exiled, tie);
                break;
            case RpcMessageTag.CastVote:
                const votingid = reader.uint8();
                const suspectid = reader.uint8();

                this._castVote(votingid, suspectid);
                break;
            case RpcMessageTag.ClearVote:
                this._clearVote(this.room.me.playerId);
                break;
        }
    }

    private _close() {
        this.emit("meetighud.close", {});
    }

    /**
     * Close the meeting hud for all clients.
     */
    close() {
        this._close();

        this.room.stream.push(
            new RpcMessage(this.netid, RpcMessageTag.Close, Buffer.alloc(0))
        );
    }

    private _castVote(votingid: number, suspectid: number) {
        const voting = this.states.get(votingid);

        const resolved_suspect = this.room.getPlayerByPlayerId(suspectid);

        if (voting && (resolved_suspect || suspectid === 0xff)) {
            if (suspectid !== 0xff)
                voting.state |= (suspectid & VoteState.VotedFor) + 1;

            voting.state |= VoteState.DidVote;
            this.dirtyBit |= 1 << votingid;

            if (this.room.amhost) {
                this.room.host.control.sendChatNote(ChatNoteType.DidVote);
            }

            this.emit("meetinghud.votecast", {
                voter: voting,
                suspect: resolved_suspect || "skip",
            });
        }
    }

    private _clearVote(voterid: number) {
        const voting = this.states.get(voterid);
        const resolved = this.room.getPlayerByPlayerId(voterid);

        if (voting) {
            voting.state ^= 0xf;
            voting.state ^= VoteState.DidVote;
            this.dirtyBit |= 1 << voterid;

            this.emit("meetinghud.voteclear", {
                player: resolved,
            });
        }
    }

    /**
     * Remove someone's vote (usually due to their suspect getting disconnected).
     * @param resolvable The player to remove the vote of.
     */
    async clearVote(resolvable: PlayerDataResolvable) {
        const voter = this.room.resolvePlayer(resolvable);

        if (voter) {
            // this.players.get(voter.playerId).votedFor = 0;
            await this.room.broadcast(
                [
                    new RpcMessage(
                        this.netid,
                        RpcMessageTag.ClearVote,
                        Buffer.alloc(0)
                    ),
                ],
                true,
                voter
            );
        }
    }

    /**
     * Cast a vote on behalf of a user (or yourself).
     * @param voting The player who is voting.
     * @param suspect The player to vote for.
     * @example
     *```typescript
     * // Make everyone vote a certain player.
     * for ([ clientid, player ] of room.players) {
     *   if (player !== suspect) {
     *     room.meetinghud.castVote(player, suspect);
     *   }
     * }
     * ```
     */
    async castVote(
        voting: PlayerDataResolvable,
        suspect: PlayerDataResolvable | "skip"
    ) {
        const votingid = this.room.resolvePlayer(voting).playerId;
        const suspectid =
            suspect === "skip"
                ? 0xff
                : this.room.resolvePlayer(suspect).playerId;

        this._castVote(votingid, suspectid);

        if (!this.room.amhost) {
            const writer = HazelWriter.alloc(2);
            writer.uint8(votingid);
            writer.uint8(suspectid);

            await this.room.broadcast(
                [
                    new RpcMessage(
                        this.netid,
                        RpcMessageTag.CastVote,
                        writer.buffer
                    ),
                ],
                true,
                this.room.host
            );
        }
    }

    private _completeVoting(states: number[], exiled: number, tie: boolean) {
        const resolved =
            tie || exiled === 0xff
                ? null
                : this.room.getPlayerByPlayerId(exiled);

        const votes = new Map(
            states.map((state, i) => [
                i,
                new PlayerVoteState(this.room, i, state),
            ])
        );

        this.emit("meetinghud.votingcomplete", {
            tie,
            ejected: resolved,
            voteStates: votes,
        });
    }
}