// Tests for the instances for `ScriptContext`
import * as V1 from "../../Lib/V1.js";
import { describe, it } from "node:test";
import * as TestUtils from "../TestUtils.js";
import fc from "fast-check";

import * as TestScriptPurpose from "./ScriptPurposeInstances-test.js";
import * as TestTxInfo from "./TxInfoInstances-test.js";

export function fcScriptContext(): fc.Arbitrary<V1.ScriptContext> {
  return fc.record(
    {
      scriptContextTxInfo: TestTxInfo.fcTxInfo(),
      scriptContextPurpose: TestScriptPurpose.fcScriptPurpose(),
    },
    { noNullPrototype: true },
  );
}

describe("ScriptContext tests", () => {
  describe("Eq ScriptContext tests", () => {
    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(fcScriptContext(), fcScriptContext(), (l, r) => {
          TestUtils.negationTest(V1.eqScriptContext, l, r);
        }),
      );
    });
  });
  describe("Json ScriptContext tests", () => {
    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(fcScriptContext(), (data) => {
          TestUtils.toJsonFromJsonRoundTrip(V1.jsonScriptContext, data);
        }),
      );
    });
  });
  describe("IsPlutusData ScriptContext tests", () => {
    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(fcScriptContext(), (data) => {
          TestUtils.isPlutusDataRoundTrip(V1.isPlutusDataScriptContext, data);
        }),
      );
    });
  });
});
