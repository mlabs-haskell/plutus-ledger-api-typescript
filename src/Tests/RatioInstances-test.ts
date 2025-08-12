import * as LbRatio from "../Lib/Ratio.js";

import { describe, it } from "node:test";
import * as TestUtils from "./TestUtils.js";

import fc from "fast-check";

export function fcRational(): fc.Arbitrary<LbRatio.Rational> {
  return fc.record({
    numerator: fc.bigInt(),
    denominator: fc.bigInt().filter((n) => n !== 0n),
  }, { noNullPrototype: true });
}

describe("Ratio tests", () => {
  describe("Eq Rational tests", () => {
    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(fcRational(), fcRational(), (l, r) => {
          TestUtils.negationTest(LbRatio.eqRational, l, r);
        }),
        { examples: [] },
      );
    });
  });
  describe("Json Rational tests", () => {
    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(fcRational(), (data) => {
          TestUtils.toJsonFromJsonRoundTrip(LbRatio.jsonRational, data);
        }),
        { examples: [] },
      );
    });
  });
  describe("IsPlutusData Rational tests", () => {
    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(fcRational(), (data) => {
          TestUtils.isPlutusDataRoundTrip(LbRatio.isPlutusDataRational, data);
        }),
        { examples: [] },
      );
    });
  });
});
