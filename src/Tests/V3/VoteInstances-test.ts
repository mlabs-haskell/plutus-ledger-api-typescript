import * as V3 from "../../Lib/V3.js";
import { describe, it } from "node:test";
import * as TestUtils from "../TestUtils.js";
import fc from "fast-check";

export function fcVote(): fc.Arbitrary<V3.Vote> {
  return fc.oneof(
    fc.record(
      {
        name: fc.constant("VoteNo"),
      },
      { noNullPrototype: true },
    ),
    fc.record(
      {
        name: fc.constant("VoteYes"),
      },
      { noNullPrototype: true },
    ),
    fc.record(
      {
        name: fc.constant("Abstain"),
      },
      { noNullPrototype: true },
    ),
  ) as fc.Arbitrary<V3.Vote>;
}

describe("Vote tests", () => {
  describe("Eq Vote tests", () => {
    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(fcVote(), fcVote(), (l, r) => {
          TestUtils.negationTest(V3.eqVote, l, r);
        }),
        { examples: [] },
      );
    });
  });
  describe("Json Vote tests", () => {
    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(fcVote(), (data) => {
          TestUtils.toJsonFromJsonRoundTrip(V3.jsonVote, data);
        }),
        { examples: [] },
      );
    });
  });
  describe("IsPlutusData Vote tests", () => {
    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(fcVote(), (data) => {
          TestUtils.isPlutusDataRoundTrip(V3.isPlutusDataVote, data);
        }),
        { examples: [] },
      );
    });
  });
});
