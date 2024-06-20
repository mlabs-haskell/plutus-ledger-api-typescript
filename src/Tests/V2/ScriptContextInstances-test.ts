// Tests for the instances for `ScriptContext`
import * as V2 from "../../Lib/V2.js";
import { describe, it } from "node:test";
import * as TestUtils from "../TestUtils.js";
import fc from "fast-check";

import * as TestScriptPurpose from "../V1/ScriptPurposeInstances-test.js";
import * as TestTxInfo from "./TxInfoInstances-test.js";

export function fcScriptContext(): fc.Arbitrary<V2.ScriptContext> {
  return fc.record({
    scriptContextTxInfo: TestTxInfo.fcTxInfo(),
    scriptContextPurpose: TestScriptPurpose.fcScriptPurpose(),
  });
}

describe("ScriptContext tests", () => {
  describe("Eq ScriptContext tests", () => {
    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(fcScriptContext(), fcScriptContext(), (l, r) => {
          TestUtils.negationTest(V2.eqScriptContext, l, r);
        }),
      );
    });
  });
  describe("Json ScriptContext tests", () => {
    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(fcScriptContext(), (data) => {
          TestUtils.toJsonFromJsonRoundTrip(V2.jsonScriptContext, data);
        }),
      );
    });
  });
  describe("IsPlutusData ScriptContext tests", () => {
    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(fcScriptContext(), (data) => {
          TestUtils.isPlutusDataRoundTrip(V2.isPlutusDataScriptContext, data);
        }),
      );
    });
  });
});
