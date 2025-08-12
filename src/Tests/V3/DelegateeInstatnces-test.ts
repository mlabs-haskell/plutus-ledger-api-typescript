import * as V3 from "../../Lib/V3.js";
import { describe, it } from "node:test";
import * as TestUtils from "../TestUtils.js";
import fc from "fast-check";
import { fcPubKeyHash } from "../V1/PubKeyHashInstances-test.js";
import { fcDRep } from "./DRepInstances-test.js";

export function fcDelegatee(): fc.Arbitrary<V3.Delegatee> {
  const { delegatee } = fc.letrec((tie) => ({
    delegatee: fc.oneof({}, tie("Stake"), tie("Vote"), tie("StakeVote")),
    Stake: fc.record(
      {
        name: fc.constant("Stake"),
        fields: fcPubKeyHash(),
      },
      { noNullPrototype: true },
    ),
    Vote: fc.record(
      {
        name: fc.constant("Vote"),
        fields: fcDRep(),
      },
      { noNullPrototype: true },
    ),
    StakeVote: fc.record(
      {
        name: fc.constant("StakeVote"),
        fields: fc.tuple(fcPubKeyHash(), fcDRep()),
      },
      { noNullPrototype: true },
    ),
  }));

  return delegatee as fc.Arbitrary<V3.Delegatee>;
}

describe("Delegatee tests", () => {
  describe("Eq Delegatee tests", () => {
    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(fcDelegatee(), fcDelegatee(), (l, r) => {
          TestUtils.negationTest(V3.eqDelegatee, l, r);
        }),
        { examples: [] },
      );
    });
  });
  describe("Json Delegatee tests", () => {
    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(fcDelegatee(), (data) => {
          TestUtils.toJsonFromJsonRoundTrip(V3.jsonDelegatee, data);
        }),
        { examples: [] },
      );
    });
  });
  describe("IsPlutusData Delegatee tests", () => {
    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(fcDelegatee(), (data) => {
          TestUtils.isPlutusDataRoundTrip(V3.isPlutusDataDelegatee, data);
        }),
        { examples: [] },
      );
    });
  });
});
