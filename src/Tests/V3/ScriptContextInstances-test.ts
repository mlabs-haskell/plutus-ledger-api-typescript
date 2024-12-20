import * as V3 from "../../Lib/V3.js";
import { describe, it } from "node:test";
import * as TestUtils from "../TestUtils.js";
import fc from "fast-check";
import { fcTxInfo } from "./TxInfoInstances-test.js";
import { fcRedeemer } from "../V1/RedeemerInstances-test.js";
import { fcScriptInfo } from "./ScriptInfoInstances-test.js";

export function fcScriptContext(): fc.Arbitrary<V3.ScriptContext> {
  return fc.record({
    scriptContextTxInfo: fcTxInfo(),
    scriptContextRedeemer: fcRedeemer(),
    scriptContextScriptInfo: fcScriptInfo(),
  });
}

describe("ScriptContext tests", () => {
  describe("Eq ScriptContext tests", () => {
    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(fcScriptContext(), fcScriptContext(), (l, r) => {
          TestUtils.negationTest(V3.eqScriptContext, l, r);
        }),
      );
    });
  });
  describe("Json ScriptContext tests", () => {
    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(fcScriptContext(), (data) => {
          TestUtils.toJsonFromJsonRoundTrip(V3.jsonScriptContext, data);
        }),
      );
    });
  });
  describe("IsPlutusData ScriptContext tests", () => {
    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(fcScriptContext(), (data) => {
          TestUtils.isPlutusDataRoundTrip(V3.isPlutusDataScriptContext, data);
        }),
      );
    });
  });
});
