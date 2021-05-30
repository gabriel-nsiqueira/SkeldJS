import { HazelReader, HazelWriter } from "@skeldjs/util";
import { BasicEvent, EventEmitter, ExtractEventTypes } from "@skeldjs/events";

import { AutoDoorsSystem, DoorsSystem, ElectricalDoorsSystem} from "../system";
import { DoorsDoorCloseEvent, DoorsDoorOpenEvent } from "../events";

export type DoorEvents = ExtractEventTypes<
    [DoorsDoorOpenEvent, DoorsDoorCloseEvent]
>;

/**
 * Represents a manual door for the {@link DoorsSystem} or {@link ElectricalDoorsSystem}.
 *
 * See {@link DoorEvents} for events to listen to.
 */
export class Door extends EventEmitter<DoorEvents> {
    isOpen: boolean;

    constructor(
        protected system: AutoDoorsSystem|DoorsSystem|ElectricalDoorsSystem,
        readonly id: number,
        isOpen: boolean
    ) {
        super();

        this.isOpen = isOpen;
    }

    async emit<Event extends BasicEvent>(
        event: Event
    ): Promise<Event> {
        if (this.system) {
            this.system.emit(event);
        }

        return super.emit(event);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Deserialize(reader: HazelReader, spawn: boolean) {
        this.isOpen = reader.bool(); // Use setter to emit events.
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Serialize(writer: HazelWriter, spawn: boolean) {
        writer.bool(this.isOpen);
    }

    /**
     * Force the door open.
     */
    async open() {
        await this.system.openDoor(this.id);
    }

    /**
     * Force the door to close.
     */
    async close() {
        await this.system.closeDoor(this.id);
    }
}
