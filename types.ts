// Imports
import type { Any } from "./deps/constructor.ts";

/** An object that creates a new event-like object. */
export interface EventConstructorLike {
  new (...args: Any[]): EventLike;
}

/**
 * An event object.
 * @param T The event target, for instance a window or button.
 * @param EventName The name of the event.
 */
export interface EventLike<
  T extends EventTargetLike = Any,
  EventName extends string | number | symbol = Any,
> {
  /** The event target. */
  target: T;
  /** The name of the  */
  event: EventName;
  /** The timestamp the event was initiated. */
  at: Date;
  /** Whether or not the default event action is prevented. */
  defaultPrevented: boolean;
  /** Whether or not the event will continue to bubble up to its parent when all listeners have been prcoessed. */
  bubbles: boolean;
  /** Whether or not the event has been cancelled. */
  cancelled: boolean;
  /** Prevent the default action from being executed. */
  preventDefault(): this;
  /** Prevent the event from bubbling up to its parent. */
  cancelBubbles(): this;
  /** Stop executing listeners. */
  cancel(): this;
}

/**
 * An object used to wait for an event to fire, either in the result
 * of resolving a promise or writing to an iterator.
 */
export type EventWaiterLike<
  T extends EventTargetLike = Any,
  EventName extends string | number | symbol = Any,
> =
  & PromiseLike<EventLike<T, EventName>>
  & AsyncIterable<EventLike<T, EventName>>;

export type EventListenerLike<
  T extends EventTargetLike = Any,
  EventName extends string = Any,
> = (event: EventLike<T, EventName>) => unknown;

export interface EventTargetConstructorLike {
  new (events: Record<string, EventConstructorLike>): EventTargetLike;
}

export interface EventTargetLike {
  createEvent<Event extends string>(
    event: Event,
    init: Record<string | number | symbol, Any>,
  ): EventLike<this, Event>;
  dispatch(event: EventLike<this, Any>, execDefault?: boolean): Promise<void>;
  createAndDispatch<Event extends string>(
    event: Event,
    init: Record<string | number | symbol, Any>,
  ): Promise<EventLike<this, Event>>;
  on<Event extends string>(event: Event): EventWaiterLike<this, Event>;
  on<Event extends string>(
    event: Event,
    listener: EventListenerLike<this, Event>,
  ): this;
  on<Event extends string>(listener: EventListenerLike<this, Event>): this;
  once<Event extends string>(
    event: Event,
    listener: EventListenerLike<this, Event>,
  ): this;
  once<Event extends string>(listener: EventListenerLike<this, Event>): this;
  off(): this;
  off(event: string): this;
  off(event: string, listener: EventListenerLike): this;
  off(listener: EventListenerLike): this;
}

export type EventListener<T extends EventLike> = (event: T) => unknown;

export type InferEventPrototype<E extends EventConstructorLike> = E extends
  { new (...args: Any[]): infer P } ? P : never;

export type EventListenerData = {
  listener: EventListener<Any>;
  once?: true;
  close?: () => void;
};
