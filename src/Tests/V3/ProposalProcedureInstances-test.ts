import * as V3 from "../../Lib/V3.js";
import { describe, it } from "node:test";
import * as TestUtils from "../TestUtils.js";
import fc from "fast-check";
import { fcCredential } from "../V1/CredentialInstances-test.js";
import { fcGovernanceAction } from "./GovernanceActionInstances-test.js";
import { bigUint } from "../TestUtils.js";

export function fcProposalProcedure(): fc.Arbitrary<V3.ProposalProcedure> {
  return fc.record(
    {
      ppDeposit: bigUint(),
      ppReturnAddr: fcCredential(),
      ppGovernanceAction: fcGovernanceAction(),
    },
    { noNullPrototype: true },
  );
}

describe("ProposalProcedure tests", () => {
  describe("Eq Delegatee tests", () => {
    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(fcProposalProcedure(), fcProposalProcedure(), (l, r) => {
          TestUtils.negationTest(V3.eqProposalProcedure, l, r);
        }),
        { examples: [] },
      );
    });
  });
  describe("Json ProposalProcedure tests", () => {
    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(fcProposalProcedure(), (data) => {
          TestUtils.toJsonFromJsonRoundTrip(V3.jsonProposalProcedure, data);
        }),
        { examples: [] },
      );
    });
  });
  describe("IsPlutusData ProposalProcedure tests", () => {
    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(fcProposalProcedure(), (data) => {
          TestUtils.isPlutusDataRoundTrip(
            V3.isPlutusDataProposalProcedure,
            data,
          );
        }),
        { examples: [] },
      );
    });
  });
});
