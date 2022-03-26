// Imports
import Constructor, {
  type Any,
  type ConstructorIntializeObject,
} from "./deps/constructor.ts";
import type { EventLike, EventTargetLike } from "./types.ts";
import { ReadonlyDate } from "./ReadonlyDate.ts";

export class Event<
  // deno-lint-ignore ban-types
  Init extends {} = {},
  Target extends EventTargetLike = EventTargetLike,
  Event extends string = string,
  OmitKeys extends string = "",
  OmitTypes extends Any = never,
> extends Constructor<Init, OmitKeys | keyof EventLike, OmitTypes>
  implements EventLike<Target, Event> {
  target!: Target;
  event!: Event;
  at = new ReadonlyDate();
  defaultPrevented = false;
  bubbles = true;
  cancelled = false;
  preventDefault() {
    this.defaultPrevented = true;
    return this;
  }
  cancelBubbles() {
    this.bubbles = false;
    return this;
  }
  cancel() {
    this.cancelled = true;
    return this;
  }
  protected init(): void {}
  public constructor(
    ...args: (
      Extract<
        ConstructorIntializeObject<Init, OmitKeys | keyof EventLike, OmitTypes>,
        undefined
      > extends never ? [
        value: ConstructorIntializeObject<
          Init,
          OmitKeys | keyof EventLike,
          OmitTypes
        >,
      ]
        : [
          value?: ConstructorIntializeObject<
            Init,
            OmitKeys | keyof EventLike,
            OmitTypes
          >,
        ]
    )
  ) {
    super(...args as Any);
    this.init();
  }
  public static defaultAction(_event: EventLike): unknown {
    return;
  }
  public static hasDefaultAction = false;
}

export default Event;
