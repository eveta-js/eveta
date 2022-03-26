// Imports
import { ReadonlyDate } from "../ReadonlyDate.ts";
import {
  assert,
  assertStrictEquals,
} from "https://deno.land/std@0.129.0/testing/asserts.ts";

Deno.test("Readonly date exports same time as normal date.", () => {
  const date1 = new Date();
  const date2 = new ReadonlyDate(date1);

  // This check is rather obvious, date2 should be an
  // instance of ReadonlyDate.
  assert(
    date2 instanceof ReadonlyDate,
    "date2 is not an instanceof ReadonlyEvent",
  );
});
