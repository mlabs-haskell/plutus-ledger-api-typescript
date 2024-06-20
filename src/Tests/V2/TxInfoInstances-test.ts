// Tests for the instances for `TxInfo`
import * as V2 from "../../Lib/V2.js";

import * as TestUtils from "../TestUtils.js";
import fc from "fast-check";

import { describe, it } from "node:test";

import * as TestTxInInfo from "./TxInInfoInstances-test.js";
import * as TestTxOut from "./TxOutInstances-test.js";
import * as TestValue from "../V1/ValueInstances-test.js";
import * as TestDCert from "../V1/DCertInstances-test.js";
import * as TestStakingCredential from "../V1/StakingCredentialInstances-test.js";
import * as TestInterval from "../V1/IntervalInstances-test.js";
import * as TestPubKeyHash from "../V1/PubKeyHashInstances-test.js";
import * as TestDatumHash from "../V1/DatumHashInstances-test.js";
import * as TestDatum from "../V1/DatumInstances-test.js";
import * as TestTxId from "../V1/TxIdInstances-test.js";
import * as TestScriptPurpose from "../V1/ScriptPurposeInstances-test.js";
import * as TestRedeemer from "../V1/RedeemerInstances-tes.js";

export function fcTxInfo(): fc.Arbitrary<V2.TxInfo> {
  return fc.record({
    txInfoInputs: fc.array(TestTxInInfo.fcTxInInfo()),
    txInfoOutputs: fc.array(TestTxOut.fcTxOut()),
    txInfoFee: TestValue.fcValue(),
    txInfoMint: TestValue.fcValue(),
    txInfoDCert: fc.array(TestDCert.fcDCert()),
    txInfoWdrl: fc.array(
      fc.tuple(TestStakingCredential.fcStakingCredential(), fc.bigInt()),
    ),
    txInfoValidRange: TestInterval.fcInterval(fc.bigInt()),
    txInfoSignatories: fc.array(TestPubKeyHash.fcPubKeyHash()),
    txInfoRedeemers: fc.array(
      fc.tuple(TestScriptPurpose.fcScriptPurpose(), TestRedeemer.fcRedeemer()),
    ),
    txInfoData: fc.array(
      fc.tuple(TestDatumHash.fcDatumHash(), TestDatum.fcDatum()),
    ),
    txInfoId: TestTxId.fcTxId(),
  });
}

describe("TxInfo tests", () => {
  describe("Eq TxInfo tests", () => {
    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(fcTxInfo(), fcTxInfo(), (l, r) => {
          TestUtils.negationTest(V2.eqTxInfo, l, r);
        }),
      );
    });
  });
  describe("Json TxInfo tests", () => {
    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(fcTxInfo(), (data) => {
          TestUtils.toJsonFromJsonRoundTrip(V2.jsonTxInfo, data);
        }),
      );
    });
  });
  describe("IsPlutusData TxInfo tests", () => {
    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(fcTxInfo(), (data) => {
          TestUtils.isPlutusDataRoundTrip(V2.isPlutusDataTxInfo, data);
        }),
      );
    });
  });
});
