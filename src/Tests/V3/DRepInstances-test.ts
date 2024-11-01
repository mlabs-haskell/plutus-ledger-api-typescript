import * as V3 from "../../Lib/V3.js";
import { describe, it } from "node:test";
import * as TestUtils from "../TestUtils.js";
import fc from "fast-check";
import { fcCredential } from "../V1/CredentialInstances-test.js";

export function fcDRep(): fc.Arbitrary<V3.DRep> {
  const { dRep } = fc.letrec((tie) => ({
    dRep: fc.oneof(
      {},
      tie("DRep"),
      tie("AlwaysAbstain"),
      tie("AlwaysNoConfidence"),
    ),
    DRep: fc.record({
      name: fc.constant("DRep"),
      fields: fcCredential(),
    }),
    AlwaysAbstain: fc.record({
      name: fc.constant("AlwaysAbstain"),
    }),
    AlwaysNoConfidence: fc.record({
      name: fc.constant("AlwaysNoConfidence"),
    }),
  }));

  return dRep as fc.Arbitrary<V3.DRep>;
}

describe("DRep tests", () => {
  describe("Eq DRep tests", () => {
    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(fcDRep(), fcDRep(), (l, r) => {
          TestUtils.negationTest(V3.eqDRep, l, r);
        }),
        { examples: [] },
      );
    });
  });
  describe("Json Rational tests", () => {
    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(fcDRep(), (data) => {
          TestUtils.toJsonFromJsonRoundTrip(V3.jsonDRep, data);
        }),
        { examples: [] },
      );
    });
  });
  describe("IsPlutusData DRep tests", () => {
    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(fcDRep(), (data) => {
          TestUtils.isPlutusDataRoundTrip(V3.isPlutusDataDRep, data);
        }),
        { examples: [] },
      );
    });
  });
});
