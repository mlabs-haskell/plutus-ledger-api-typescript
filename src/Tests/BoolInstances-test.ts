// // Tests for the instances for `Bool`
import * as Prelude from "prelude";
import * as PreludeInstances from "../Lib/Prelude/Instances.js";

import { describe, it } from "node:test";

import * as TestUtils from "./TestUtils.js";
import fc from "fast-check";

describe("Bool tests", () => {
  describe("Eq Bool tests", () => {
    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(
          fc.boolean(),
          fc.boolean(),
          (l, r) => {
            TestUtils.negationTest(Prelude.eqBool, l, r);
          },
        ),
        { examples: [] },
      );
    });
  });

  describe("Json Bool tests", () => {
    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(
          fc.boolean(),
          (data) => {
            TestUtils.toJsonFromJsonRoundTrip(Prelude.jsonBool, data);
          },
        ),
        { examples: [] },
      );
    });
  });

  describe("IsPlutusData Bool tests", () => {
    TestUtils.isPlutusDataIt(
      PreludeInstances.isPlutusDataBool,
      false,
      { name: "Constr", fields: [0n, []] },
    );

    TestUtils.isPlutusDataIt(
      PreludeInstances.isPlutusDataBool,
      true,
      { name: "Constr", fields: [1n, []] },
    );

    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(
          fc.boolean(),
          (data) => {
            TestUtils.isPlutusDataRoundTrip(
              PreludeInstances.isPlutusDataBool,
              data,
            );
          },
        ),
        { examples: [] },
      );
    });
  });
});
