// Imports
import type { Any } from "./deps/constructor.ts";
import type {
  EventLike,
  EventListener,
  EventTargetLike,
  EventWaiterLike,
} from "./types.ts";
import { type Deferred, deferred } from "./deps/deferred.ts";

export class EventWaiter<
  EventName extends string | number | symbol,
  T extends EventLike<EventTargetLike, EventName>,
> implements EventWaiterLike {
  #target: EventTargetLike;
  #event: EventName;
  #promise?: Promise<T>;
  #data: T[] = [];
  #next?: Deferred<{ done: false; value: T }>;
  #listener?: EventListener<T>;
  public constructor(event: EventName, target: EventTargetLike) {
    this.#event = event;
    this.#target = target;
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
  ): Promise<TResult1 | TResult2> {
    if (this.#promise) return this.#promise as Any;
    return this.#promise = new Promise<TResult1>((resolve) => {
      if (typeof onfulfilled === "function") {
        this.#target.once(
          this.#event as Any,
          (event) => resolve(onfulfilled(event as Any)),
        );
      }
    }) as Any;
  }

  next() {
    if (this.#promise) return this.return();
    if (this.#data.length > 0) {
      return Promise.resolve({ done: false, value: this.#data.shift()! });
    }
    if (this.#next) return this.#next;
    this.#next = deferred<{ done: false; value: T }>();
    return this.#next;
  }

  close() {
    this.#data = [];
    if (this.#next) this.#next.resolve({ done: true } as Any);
    this.#next = undefined;
    if (this.#listener) {
      this.#target.off(this.#event as Any, this.#listener as Any);
    }
  }

  return(): Promise<IteratorResult<T, undefined>> {
    this.close();
    return Promise.resolve({ value: undefined, done: true });
  }

  [Symbol.asyncIterator](): AsyncIterableIterator<T> {
    if (this.#listener) return this;
    (this.#target as Any).addListener(
      this.#event as Any,
      {
        listener: (this.#listener = (value: T) => {
          if (this.#next) {
            const promise = this.#next;
            this.#next = undefined;
            return promise.resolve({ done: false, value });
          }
          this.#data.push(value);
          return;
        }) as Any,
        closer: () => this.close(),
      },
    );
    return this;
  }
}

export default EventWaiter;
