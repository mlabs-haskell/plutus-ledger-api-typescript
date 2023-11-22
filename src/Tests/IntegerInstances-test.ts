// Tests for the instances for `Integer`
import * as Prelude from "prelude";
import * as PreludeInstances from "../PlutusLedgerApi/Runtime/Prelude/Instances.js";

import { describe, it } from "node:test";

import * as TestUtils from "./TestUtils.js";
import fc from "fast-check";

describe("Integer tests", () => {
  describe("Eq Integer tests", () => {
    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(
          fc.bigInt(),
          fc.bigInt(),
          (l, r) => {
            TestUtils.negationTest(Prelude.eqInteger, l, r);
          },
        ),
        { examples: [] },
      );
    });
  });

  describe("Json Integer tests", () => {
    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(
          fc.bigInt(),
          (data) => {
            TestUtils.toJsonFromJsonRoundTrip(Prelude.jsonInteger, data);
          },
        ),
        { examples: [] },
      );
    });
  });

  describe("IsPlutusData Integer tests", () => {
    TestUtils.isPlutusDataIt(
      PreludeInstances.isPlutusDataInteger,
      69n,
      { name: "Integer", fields: 69n },
    );
    TestUtils.isPlutusDataIt(
      PreludeInstances.isPlutusDataInteger,
      -69n,
      { name: "Integer", fields: -69n },
    );

    TestUtils.isPlutusDataIt(
      PreludeInstances.isPlutusDataInteger,
      0n,
      { name: "Integer", fields: 0n },
    );

    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(
          fc.bigInt(),
          (data) => {
            TestUtils.isPlutusDataRoundTrip(
              PreludeInstances.isPlutusDataInteger,
              data,
            );
          },
        ),
        { examples: [] },
      );
    });
  });
});
