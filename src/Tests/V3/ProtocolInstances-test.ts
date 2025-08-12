import * as V3 from "../../Lib/V3.js";
import { describe, it } from "node:test";
import * as TestUtils from "../TestUtils.js";
import fc from "fast-check";

export function fcProtocolVersion(): fc.Arbitrary<V3.ProtocolVersion> {
  return fc.record(
    { pvMajor: fc.bigInt(), pvMinor: fc.bigInt() },
    { noNullPrototype: true },
  );
}

describe("ProtocolVersion tests", () => {
  describe("Eq Constitution tests", () => {
    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(fcProtocolVersion(), fcProtocolVersion(), (l, r) => {
          TestUtils.negationTest(V3.eqProtocolVersion, l, r);
        }),
        { examples: [] },
      );
    });
  });
  describe("Json ProtocolVersion tests", () => {
    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(fcProtocolVersion(), (data) => {
          TestUtils.toJsonFromJsonRoundTrip(V3.jsonProtocolVersion, data);
        }),
        { examples: [] },
      );
    });
  });
  describe("IsPlutusData ProtocolVersion tests", () => {
    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(fcProtocolVersion(), (data) => {
          TestUtils.isPlutusDataRoundTrip(V3.isPlutusDataProtocolVersion, data);
        }),
        { examples: [] },
      );
    });
  });
});
