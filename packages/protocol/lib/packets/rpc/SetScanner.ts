import { RpcMessageTag } from "@skeldjs/constant";
import { HazelReader, HazelWriter } from "@skeldjs/util";
import { BaseRpcMessage } from "./BaseRpcMessage";

export class SetScanner extends BaseRpcMessage {
    static tag = RpcMessageTag.StartMeeting as const;
    tag = RpcMessageTag.StartMeeting as const;

    scanning: boolean;
    sequenceid: number;

    constructor(scanning: boolean, sequenceid: number) {
        super();

        this.scanning = scanning;
        this.sequenceid = sequenceid;
    }

    static Deserialize(reader: HazelReader) {
        const scanning = reader.bool();
        const sequenceid = reader.uint8();

        return new SetScanner(scanning, sequenceid);
    }

    Serialize(writer: HazelWriter) {
        writer.bool(this.scanning);
        writer.uint8(this.sequenceid);
    }
}
