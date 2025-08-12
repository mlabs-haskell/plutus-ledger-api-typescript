import * as V3 from "../../Lib/V3.js";
import { describe, it } from "node:test";
import * as TestUtils from "../TestUtils.js";
import fc from "fast-check";
import { fcPubKeyHash } from "../V1/PubKeyHashInstances-test.js";
import { fcCredential } from "../V1/CredentialInstances-test.js";

export function fcVoter(): fc.Arbitrary<V3.Voter> {
  const { voter } = fc.letrec((tie) => ({
    voter: fc.oneof(
      {},
      tie("CommitteeVoter"),
      tie("DRepVoter"),
      tie("DRepVoter"),
    ),
    CommitteeVoter: fc.record({
      name: fc.constant("CommitteeVoter"),
      fields: fcCredential(),
    }, { noNullPrototype: true }),
    DRepVoter: fc.record({
      fields: fcCredential(),
      name: fc.constant("DRepVoter"),
    }, { noNullPrototype: true }),
    StakePoolVoter: fc.record({
      name: fc.constant("DRepVoter"),
      fields: fcPubKeyHash(),
    }, { noNullPrototype: true }),
  }));

  return voter as fc.Arbitrary<V3.Voter>;
}

describe("Voter tests", () => {
  describe("Eq Voter tests", () => {
    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(fcVoter(), fcVoter(), (l, r) => {
          TestUtils.negationTest(V3.eqVoter, l, r);
        }),
        { examples: [] },
      );
    });
  });
  describe("Json Voter tests", () => {
    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(fcVoter(), (data) => {
          TestUtils.toJsonFromJsonRoundTrip(V3.jsonVoter, data);
        }),
        { examples: [] },
      );
    });
  });
  describe("IsPlutusData Voter tests", () => {
    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(fcVoter(), (data) => {
          TestUtils.isPlutusDataRoundTrip(V3.isPlutusDataVoter, data);
        }),
        { examples: [] },
      );
    });
  });
});
