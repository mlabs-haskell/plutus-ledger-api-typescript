import * as V3 from "../../Lib/V3.js";
import { describe, it } from "node:test";
import * as TestUtils from "../TestUtils.js";
import fc from "fast-check";
import { fcMaybe } from "../Prelude/MaybeInstances-test.js";
import { fcScriptHash } from "../V1/ScriptHashInstances-test.js";

export function fcConstitution(): fc.Arbitrary<V3.Constitution> {
  return fc.record({
    constitutionScript: fcMaybe(fcScriptHash()),
  });
}

describe("Constitution tests", () => {
  describe("Eq Constitution tests", () => {
    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(fcConstitution(), fcConstitution(), (l, r) => {
          TestUtils.negationTest(V3.eqConstitution, l, r);
        }),
        { examples: [] },
      );
    });
  });
  describe("Json Constitution tests", () => {
    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(fcConstitution(), (data) => {
          TestUtils.toJsonFromJsonRoundTrip(V3.jsonConstitution, data);
        }),
        { examples: [] },
      );
    });
  });
  describe("IsPlutusData GovernanceActionId tests", () => {
    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(fcConstitution(), (data) => {
          TestUtils.isPlutusDataRoundTrip(V3.isPlutusDataConstitution, data);
        }),
        { examples: [] },
      );
    });
  });
});
