// Imports
import { Event } from "../mod.ts";
import { ReadonlyDate } from "../ReadonlyDate.ts";
import {
  assert,
  assertStrictEquals,
} from "https://deno.land/std@0.129.0/testing/asserts.ts";

Deno.test("Create event, check values.", () => {
  const event = new Event();

  // This check is rather obvious, an event should be an event.
  assert(event instanceof Event, "Event is not an instance of Event");

  // When an event is created manually the event target
  // will be undefined, but its type specifies an
  // EventTarget-like.
  assertStrictEquals(event.target, undefined);

  // The built-in Event object uses ReadonlyDate which
  // is a utility class (not exported by Eveta).
  assert(
    event.at instanceof ReadonlyDate,
    "<Event>.at is not an instance of ReadonlyDate",
  );
});
