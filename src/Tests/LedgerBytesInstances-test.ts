// Tests for the instances for `LedgerBytes`
import * as V1 from "../Lib/V1.js";

import { describe, it } from "node:test";

import * as TestUtils from "./TestUtils.js";
import fc from "fast-check";

describe("LedgerBytes tests", () => {
  describe("Eq LedgerBytes tests", () => {
    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(
          fc.uint8Array(),
          fc.uint8Array(),
          (l, r) => {
            TestUtils.negationTest(V1.eqLedgerBytes, l, r);
          },
        ),
        { examples: [] },
      );
    });
  });

  describe("Json LedgerBytes tests", () => {
    TestUtils.toJsonAndFromJsonIt(
      V1.jsonLedgerBytes,
      Uint8Array.from([0x00]),
      "00",
    );

    TestUtils.toJsonAndFromJsonIt(
      V1.jsonLedgerBytes,
      Uint8Array.from([0x00, 0xff]),
      "00ff",
    );

    TestUtils.toJsonAndFromJsonIt(
      V1.jsonLedgerBytes,
      Uint8Array.from([]),
      "",
    );
    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(
          fc.uint8Array(),
          (data) => {
            TestUtils.toJsonFromJsonRoundTrip(V1.jsonLedgerBytes, data);
          },
        ),
        { examples: [] },
      );
    });
  });

  describe("IsPlutusData LedgerBytes tests", () => {
    TestUtils.isPlutusDataIt(
      V1.isPlutusDataLedgerBytes,
      Uint8Array.from([0xff, 0x00]),
      { name: "Bytes", fields: Uint8Array.from([0xff, 0x00]) },
    );
    TestUtils.isPlutusDataIt(
      V1.isPlutusDataLedgerBytes,
      Uint8Array.from([0x00]),
      { name: "Bytes", fields: Uint8Array.from([0x00]) },
    );
    TestUtils.isPlutusDataIt(
      V1.isPlutusDataLedgerBytes,
      Uint8Array.from([]),
      { name: "Bytes", fields: Uint8Array.from([]) },
    );

    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(
          fc.uint8Array(),
          (data) => {
            TestUtils.isPlutusDataRoundTrip(
              V1.isPlutusDataLedgerBytes,
              data,
            );
          },
        ),
        { examples: [] },
      );
    });
  });
});
