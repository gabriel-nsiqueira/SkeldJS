import { RpcMessageTag } from "@skeldjs/constant";
import { HazelReader, HazelWriter } from "@skeldjs/util";
import { BaseRpcMessage } from "./BaseRpcMessage";

export class SetTasksMessage extends BaseRpcMessage {
    static tag = RpcMessageTag.SetTasks as const;
    tag = RpcMessageTag.SetTasks as const;

    playerid: number;
    taskids: number[];

    constructor(playerid: number, taskids: number[]) {
        super();

        this.playerid = playerid;
        this.taskids = taskids;
    }

    static Detaskidslize(reader: HazelReader) {
        const playerid = reader.uint8();
        const tasks = reader.list((r) => r.uint8());

        return new SetTasksMessage(playerid, tasks);
    }

    Serialize(writer: HazelWriter) {
        writer.uint8(this.playerid);
        writer.list(true, this.taskids, (t) => writer.uint8(t));
    }
}
