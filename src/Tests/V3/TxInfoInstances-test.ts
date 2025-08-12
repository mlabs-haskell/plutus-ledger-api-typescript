import * as V3 from "../../Lib/V3.js";
import { describe, it } from "node:test";
import * as TestUtils from "../TestUtils.js";
import fc from "fast-check";
import { fcValue } from "../V1/ValueInstances-test.js";
import { fcCredential } from "../V1/CredentialInstances-test.js";
import { fcVoter } from "./VoterInstatnces-test.js";
import { fcProposalProcedure } from "./ProposalProcedureInstances-test.js";
import { fcTxCert } from "./TxCertInstances-test.js";
import { fcTxInInfo } from "../V2/TxInInfoInstances-test.js";
import { fcTxOut } from "../V2/TxOutInstances-test.js";
import { fcAssocMap } from "../AssocMap-test.js";
import { eqCredential } from "../../Lib/V1/Credential.js";
import { fcInterval } from "../V1/IntervalInstances-test.js";
import { fcPubKeyHash } from "../V1/PubKeyHashInstances-test.js";
import { fcScriptPurpose } from "./ScriptPpurposeInstances-test.js";
import { fcRedeemer } from "../V1/RedeemerInstances-test.js";
import { eqDatumHash } from "../../Lib/V1/Scripts.js";
import { fcDatumHash } from "../V1/DatumHashInstances-test.js";
import { fcDatum } from "../V1/DatumInstances-test.js";
import { fcTxId } from "../V1/TxIdInstances-test.js";
import { fcGovernanceActionId } from "./GovernanceActionIdInstances-test.js";
import { fcVote } from "./VoteInstances-test.js";
import { fcMaybe } from "../Prelude/MaybeInstances-test.js";
import { bigUint } from "../TestUtils.js";

export function fcTxInfo(): fc.Arbitrary<V3.TxInfo> {
  return fc.record(
    {
      txInfoInputs: fc.array(fcTxInInfo()),
      txInfoReferenceInputs: fc.array(fcTxInInfo()),
      txInfoOutputs: fc.array(fcTxOut()),
      txInfoFee: bigUint(),
      txInfoMint: fcValue(),
      txInfoTxCerts: fc.array(fcTxCert()),
      txInfoWdrl: fcAssocMap(eqCredential, fcCredential(), fc.bigInt()),
      txInfoValidRange: fcInterval(fc.bigInt()),
      txInfoSignatories: fc.array(fcPubKeyHash()),
      txInfoRedeemers: fcAssocMap(
        V3.eqScriptPurpose,
        fcScriptPurpose(),
        fcRedeemer(),
      ),
      txInfoData: fcAssocMap(eqDatumHash, fcDatumHash(), fcDatum()),
      txInfoId: fcTxId(),
      txInfoVotes: fcAssocMap(
        V3.eqVoter,
        fcVoter(),
        fcAssocMap(V3.eqGovernanceActionId, fcGovernanceActionId(), fcVote()),
      ),
      txInfoProposalProcedures: fc.array(fcProposalProcedure()),
      txInfoCurrentTreasuryAmount: fcMaybe(bigUint()),
      txInfoTreasuryDonation: fcMaybe(bigUint()),
    },
    { noNullPrototype: true },
  );
}

describe("TxInfo tests", () => {
  describe("Eq TxInfo tests", () => {
    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(fcTxInfo(), fcTxInfo(), (l, r) => {
          TestUtils.negationTest(V3.eqTxInfo, l, r);
        }),
      );
    });
  });
  describe("Json TxInfo tests", () => {
    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(fcTxInfo(), (data) => {
          TestUtils.toJsonFromJsonRoundTrip(V3.jsonTxInfo, data);
        }),
      );
    });
  });
  describe("IsPlutusData TxInfo tests", () => {
    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(fcTxInfo(), (data) => {
          TestUtils.isPlutusDataRoundTrip(V3.isPlutusDataTxInfo, data);
        }),
      );
    });
  });
});
