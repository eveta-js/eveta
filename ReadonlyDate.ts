export class ReadonlyDate implements Date {
  #date: Date;
  public constructor(value: string | number | Date);
  public constructor();
  public constructor(value: string | number);
  public constructor(
    year: number,
    month: number,
    date?: number | undefined,
    hours?: number | undefined,
    minutes?: number | undefined,
    seconds?: number | undefined,
    ms?: number | undefined,
  );
  public constructor(...args: (string | number | Date | undefined)[]) {
    // deno-lint-ignore no-explicit-any
    this.#date = new (Date as any)(...args);
  }
  [Symbol.toPrimitive](hint: "default"): string;
  [Symbol.toPrimitive](hint: "string"): string;
  [Symbol.toPrimitive](hint: "number"): number;
  [Symbol.toPrimitive](hint: string): string | number;
  [Symbol.toPrimitive](hint: string): string | number {
    return this.#date[Symbol.toPrimitive](hint);
  }
  // deno-lint-ignore no-explicit-any
  toJSON(key?: any): string {
    return this.#date.toJSON(key);
  }
  toISOString(): string {
    return this.#date.toISOString();
  }
  toUTCString(): string {
    return this.#date.toUTCString();
  }

  /** Returns a string representation of a date. The format of the string depends on the locale. */
  toString(): string {
    return this.#date.toString();
  }
  /** Returns a date as a string value. */
  toDateString(): string {
    return this.#date.toDateString();
  }
  /** Returns a time as a string value. */
  toTimeString(): string {
    return this.#date.toTimeString();
  }
  /** Returns a value as a string value appropriate to the host environment's current locale. */
  toLocaleString(): string {
    return this.#date.toLocaleString();
  }
  /** Returns a date as a string value appropriate to the host environment's current locale. */
  toLocaleDateString(): string {
    return this.#date.toLocaleDateString();
  }
  /** Returns a time as a string value appropriate to the host environment's current locale. */
  toLocaleTimeString(): string {
    return this.#date.toLocaleTimeString();
  }
  /** Returns the stored time value in milliseconds since midnight, January 1, 1970 UTC. */
  valueOf(): number {
    return this.#date.valueOf();
  }
  /** Gets the time value in milliseconds. */
  getTime(): number {
    return this.#date.getTime();
  }
  /** Gets the year, using local time. */
  getFullYear(): number {
    return this.#date.getFullYear();
  }
  /** Gets the year using Universal Coordinated Time (UTC). */
  getUTCFullYear(): number {
    return this.#date.getUTCFullYear();
  }
  /** Gets the month, using local time. */
  getMonth(): number {
    return this.#date.getMonth();
  }
  /** Gets the month of a Date object using Universal Coordinated Time (UTC). */
  getUTCMonth(): number {
    return this.#date.getUTCMonth();
  }
  /** Gets the day-of-the-month, using local time. */
  getDate(): number {
    return this.#date.getDate();
  }
  /** Gets the day-of-the-month, using Universal Coordinated Time (UTC). */
  getUTCDate(): number {
    return this.#date.getUTCDate();
  }
  /** Gets the day of the week, using local time. */
  getDay(): number {
    return this.#date.getDay();
  }
  /** Gets the day of the week using Universal Coordinated Time (UTC). */
  getUTCDay(): number {
    return this.#date.getUTCDay();
  }
  /** Gets the hours in a date, using local time. */
  getHours(): number {
    return this.#date.getHours();
  }
  /** Gets the hours value in a Date object using Universal Coordinated Time (UTC). */
  getUTCHours(): number {
    return this.#date.getUTCHours();
  }
  /** Gets the minutes of a Date object, using local time. */
  getMinutes(): number {
    return this.#date.getMinutes();
  }
  /** Gets the minutes of a Date object using Universal Coordinated Time (UTC). */
  getUTCMinutes(): number {
    return this.#date.getUTCMinutes();
  }
  /** Gets the seconds of a Date object, using local time. */
  getSeconds(): number {
    return this.#date.getSeconds();
  }
  /** Gets the seconds of a Date object using Universal Coordinated Time (UTC). */
  getUTCSeconds(): number {
    return this.#date.getUTCSeconds();
  }
  /** Gets the milliseconds of a Date, using local time. */
  getMilliseconds(): number {
    return this.#date.getMilliseconds();
  }
  /** Gets the milliseconds of a Date object using Universal Coordinated Time (UTC). */
  getUTCMilliseconds(): number {
    return this.#date.getUTCMilliseconds();
  }
  /** Gets the difference in minutes between the time on the local computer and Universal Coordinated Time (UTC). */
  getTimezoneOffset(): number {
    return this.#date.getTimezoneOffset();
  }

  // #region setters
  setUTCFullYear(_year: number, _month?: number, _date?: number): number {
    throw new Error("Cannot perform this action on a readonly date!");
  }
  setFullYear(_year: number, _month?: number, _date?: number): number {
    throw new Error("Cannot perform this action on a readonly date!");
  }
  setUTCMonth(_month: number, _date?: number): number {
    throw new Error("Cannot perform this action on a readonly date!");
  }
  setMonth(_month: number, _date?: number): number {
    throw new Error("Cannot perform this action on a readonly date!");
  }
  setUTCDate(_date: number): number {
    throw new Error("Cannot perform this action on a readonly date!");
  }
  setDate(_date: number): number {
    throw new Error("Cannot perform this action on a readonly date!");
  }
  setUTCHours(
    _hours: number,
    _min?: number,
    _sec?: number,
    _ms?: number,
  ): number {
    throw new Error("Cannot perform this action on a readonly date!");
  }
  setHours(_hours: number, _min?: number, _sec?: number, _ms?: number): number {
    throw new Error("Cannot perform this action on a readonly date!");
  }
  setUTCMinutes(_min: number, _sec?: number, _ms?: number): number {
    throw new Error("Cannot perform this action on a readonly date!");
  }
  setMinutes(_min: number, _sec?: number, _ms?: number): number {
    throw new Error("Cannot perform this action on a readonly date!");
  }
  setUTCSeconds(_sec: number, _ms?: number): number {
    throw new Error("Cannot perform this action on a readonly date!");
  }
  setSeconds(_sec: number, _ms?: number): number {
    throw new Error("Cannot perform this action on a readonly date!");
  }
  setUTCMilliseconds(_ms: number): number {
    throw new Error("Cannot perform this action on a readonly date!");
  }
  setMilliseconds(_ms: number): number {
    throw new Error("Cannot perform this action on a readonly date!");
  }
  setTime(_time?: number): number {
    throw new Error("Cannot perform this action on a readonly date!");
  }
  // #endregion
}
