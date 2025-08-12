import * as V3 from "../../Lib/V3.js";
import { describe, it } from "node:test";
import * as TestUtils from "../TestUtils.js";
import fc from "fast-check";
import { fcCurrencySymbol } from "../V1/ValueInstances-test.js";
import { fcTxOutRef } from "../V1/TxOutRefInstances-test.js";
import { fcCredential } from "../V1/CredentialInstances-test.js";
import { fcVoter } from "./VoterInstatnces-test.js";
import { fcProposalProcedure } from "./ProposalProcedureInstances-test.js";
import { fcTxCert } from "./TxCertInstances-test.js";
import { bigUint } from "../TestUtils.js";

export function fcScriptPurpose(): fc.Arbitrary<V3.ScriptPurpose> {
  const { scriptPurpose } = fc.letrec((tie) => ({
    scriptPurpose: fc.oneof(
      {},
      tie("Minting"),
      tie("Spending"),
      tie("Rewarding"),
      tie("Certifying"),
      tie("Voting"),
      tie("Proposing"),
    ),
    Minting: fc.record(
      {
        name: fc.constant("Minting"),
        fields: fcCurrencySymbol(),
      },
      { noNullPrototype: true },
    ),
    Spending: fc.record(
      {
        name: fc.constant("Spending"),
        fields: fcTxOutRef(),
      },
      { noNullPrototype: true },
    ),
    Rewarding: fc.record(
      {
        name: fc.constant("Rewarding"),
        fields: fcCredential(),
      },
      { noNullPrototype: true },
    ),
    Certifying: fc.record(
      {
        name: fc.constant("Certifying"),
        fields: fc.tuple(bigUint(), fcTxCert()),
      },
      { noNullPrototype: true },
    ),
    Voting: fc.record(
      {
        name: fc.constant("Voting"),
        fields: fcVoter(),
      },
      { noNullPrototype: true },
    ),
    Proposing: fc.record(
      {
        name: fc.constant("Proposing"),
        fields: fc.tuple(bigUint(), fcProposalProcedure()),
      },
      { noNullPrototype: true },
    ),
  }));

  return scriptPurpose as fc.Arbitrary<V3.ScriptPurpose>;
}

describe("ScriptPurpose tests", () => {
  describe("Eq ScriptPurpose tests", () => {
    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(fcScriptPurpose(), fcScriptPurpose(), (l, r) => {
          TestUtils.negationTest(V3.eqScriptPurpose, l, r);
        }),
      );
    });
  });
  describe("Json ScriptPurpose tests", () => {
    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(fcScriptPurpose(), (data) => {
          TestUtils.toJsonFromJsonRoundTrip(V3.jsonScriptPurpose, data);
        }),
      );
    });
  });
  describe("IsPlutusData ScriptPurpose tests", () => {
    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(fcScriptPurpose(), (data) => {
          TestUtils.isPlutusDataRoundTrip(V3.isPlutusDataScriptPurpose, data);
        }),
      );
    });
  });
});
