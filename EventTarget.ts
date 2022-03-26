// Imports
import type { Any } from "./deps/constructor.ts";
import type {
  EventConstructorLike,
  EventLike,
  EventListener,
  EventListenerData,
  EventListenerLike,
  EventTargetLike,
  InferEventPrototype,
} from "./types.ts";
import EventWaiter from "./EventWaiter.ts";

export class EventTarget<
  Events extends { [key: string]: EventConstructorLike },
> implements EventTargetLike {
  #events: Events;
  public constructor(events: Events) {
    this.#events = events;
  }
  public createEvent<
    EventName extends keyof Events,
  >(
    event: EventName,
    ...args: (
      Extract<ConstructorParameters<Events[EventName]>[0], undefined> extends
        never ? [value: ConstructorParameters<Events[EventName]>[0]]
        : [value?: ConstructorParameters<Events[EventName]>[0]]
    )
  ): EventLike<this, EventName> & InferEventPrototype<Events[EventName]> {
    const E = this.#events[event];
    const e = new E(args[0]);
    e.target = this;
    e.event = event;
    return e as Any;
  }

  public async dispatch(
    event: EventLike<this, keyof Events>,
    execDefault = true,
  ): Promise<void> {
    if (
      typeof this.#events[event.event] === "undefined" ||
      !(event instanceof this.#events[event.event])
    ) {
      return;
    }
    for (const data of [...(this.#eventListeners[event.event] || [])]) {
      if (data.once) this.removeListener(event.event, data.listener);
      await data.listener(event);
      if (event.cancelled) break;
    }
    if (event.bubbles && this.#parent) {
      await this.#parent.dispatch(event, false);
    }
    if (execDefault) {
      const defaultAction =
        Object.getPrototypeOf(event).constructor.defaultAction;
      if (typeof defaultAction === "function") {
        await defaultAction(event);
      }
    }
  }

  #parent?: EventTargetLike;

  protected setParent(parent?: EventTargetLike) {
    this.#parent = parent;
  }

  public async createAndDispatch<
    EventName extends keyof Events,
    _ extends EventTargetLike = this,
  >(
    event: EventName,
    ...args: (
      Extract<ConstructorParameters<Events[EventName]>[0], undefined> extends
        never ? [value: ConstructorParameters<Events[EventName]>[0]]
        : [value?: ConstructorParameters<Events[EventName]>[0]]
    )
  ): Promise<
    EventLike<_, EventName> & InferEventPrototype<Events[EventName]> & {
      event: EventName;
      target: _;
    }
  > {
    const e = this.createEvent(event, ...args);
    await this.dispatch(e);
    return e;
  }

  #eventListeners: Record<
    string | number | symbol,
    EventListenerData[]
  > = {};

  protected listenerIndex(
    name: string | number | symbol,
    listener: EventListenerLike,
  ) {
    if (!Array.isArray(this.#eventListeners[name])) return -1;
    return this.#eventListeners[name].findIndex((data) =>
      data.listener === listener
    );
  }

  protected hasListener(
    name: string | number | symbol,
    listener: EventListenerLike,
  ) {
    return this.listenerIndex(name, listener) !== -1;
  }

  protected addListener(
    name: string | number | symbol,
    data: EventListenerData,
  ) {
    if (!(name in this.#events)) {
      throw new Error("Unknown event " + String(name));
    }
    const arr = this.#eventListeners[name] ??= [];
    if (arr.findIndex((data) => data.listener === data.listener) !== -1) return;
    arr.push(data);
  }

  protected removeListener(
    name?: string | number | symbol | undefined,
    listener?: EventListenerLike,
  ): void {
    let events: EventListenerData[] | undefined = undefined;
    if (name && listener) {
      const index = this.listenerIndex(name, listener);
      if (index === -1) return;
      events = this.#eventListeners[name].splice(index, 1);
      if (this.#eventListeners[name].length === 0) {
        delete this.#eventListeners[name];
      }
    } else if (name) {
      events = this.#eventListeners[name];
      delete this.#eventListeners[name];
    } else {
      return Object.keys(this.#eventListeners).forEach((name) =>
        this.removeListener(name)
      );
    }
    if (events) {
      for (const event of events) {
        if (event.close) event.close();
      }
    }
  }

  protected getAllListeners() {
    return this.#eventListeners;
  }

  public on<EventName extends keyof Events, _ extends EventTargetLike = this>(
    event: EventName,
  ): EventWaiter<
    EventName,
    EventLike<_, EventName> & InferEventPrototype<Events[EventName]>
  >;
  public on<EventName extends keyof Events, _ extends EventTargetLike = this>(
    event: EventName,
    listener: EventListener<
      EventLike<_, EventName> & InferEventPrototype<Events[EventName]>
    >,
  ): this;
  public on<EventName extends keyof Events, _ extends EventTargetLike = this>(
    listener: EventListener<
      EventLike<_, EventName> & InferEventPrototype<Events[EventName]>
    >,
  ): this;
  public on<EventName extends keyof Events, _ extends EventTargetLike = this>(
    eventOrListener:
      | EventName
      | EventListener<
        EventLike<_, EventName> & InferEventPrototype<Events[EventName]>
      >,
    listener?: EventListener<
      EventLike<_, EventName> & InferEventPrototype<Events[EventName]>
    >,
  ): // deno-fmt-ignore
  (this | EventWaiter<EventName, EventLike<_, EventName> & InferEventPrototype<Events[EventName]>>) {
    if (typeof eventOrListener === "function") {
      listener = eventOrListener;
      eventOrListener = "*" as Any;
    }
    if (typeof listener !== "function") {
      return new EventWaiter(eventOrListener as Any, this);
    }
    this.addListener(eventOrListener as Any, { listener } as Any);
    return this;
  }

  public once<
    EventNames extends keyof Events,
    _ extends EventTargetLike = this,
  >(
    listener: {
      [key in EventNames]: EventListener<
        EventLike<_, key> & InferEventPrototype<Events[key]>
      >;
    }[EventNames],
  ): this;
  public once<EventName extends keyof Events, _ extends EventTargetLike = this>(
    event: EventName,
    listener: EventListener<
      EventLike<_, EventName> & InferEventPrototype<Events[EventName]>
    >,
  ): this;
  public once<EventName extends keyof Events, _ extends EventTargetLike = this>(
    eventOrListener:
      | EventName
      | {
        [key in EventName]: EventListener<
          EventLike<_, key> & InferEventPrototype<Events[key]>
        >;
      }[EventName],
    listener?: EventListener<
      EventLike<_, EventName> & InferEventPrototype<Events[EventName]>
    >,
  ): this {
    this.addListener(eventOrListener as Any, listener as Any);
    return this;
  }

  public off(): this;
  public off(event: keyof Events): this;
  public off(event: keyof Events, listener: EventListener<Any>): this;
  public off(listener: EventListener<Any>): this;
  public off(
    event?: keyof Events | EventListener<Any>,
    listener?: EventListener<Any>,
  ): this {
    this.removeListener(event as Any, listener);
    return this;
  }

  #promise?: Promise<Events[keyof Events]>;

  then<TResult1 = Events[keyof Events], TResult2 = never>(
    onfulfilled?:
      | ((value: Events[keyof Events]) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
  ): Promise<TResult1 | TResult2> {
    if (this.#promise) return this.#promise as Any;
    return this.#promise = new Promise<TResult1>((resolve) => {
      if (typeof onfulfilled === "function") {
        this.once(
          (event) => resolve(onfulfilled(event as Any)),
        );
      }
    }) as Any;
  }
}

export default EventTarget;
