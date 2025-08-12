// Tests for the instances for `TxInfo`
import * as V1 from "../../Lib/V1.js";
import { describe, it } from "node:test";
import * as TestUtils from "../TestUtils.js";
import fc from "fast-check";

import * as TestTxInInfo from "./TxInInfoInstances-test.js";
import * as TestValue from "./ValueInstances-test.js";
import * as TestDCert from "./DCertInstances-test.js";
import * as TestStakingCredential from "./StakingCredentialInstances-test.js";
import * as TestInterval from "./IntervalInstances-test.js";
import * as TestPubKeyHash from "./PubKeyHashInstances-test.js";
import * as TestDatumHash from "./DatumHashInstances-test.js";
import * as TestDatum from "./DatumInstances-test.js";
import * as TestTxId from "./TxIdInstances-test.js";
import * as TestTxOut from "./TxOutInstances-test.js";

export function fcTxInfo(): fc.Arbitrary<V1.TxInfo> {
  return fc.record(
    {
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
      txInfoData: fc.array(
        fc.tuple(TestDatumHash.fcDatumHash(), TestDatum.fcDatum()),
      ),
      txInfoId: TestTxId.fcTxId(),
    },
    { noNullPrototype: true },
  );
}

describe("TxInfo tests", () => {
  describe("Eq TxInfo tests", () => {
    const dict = V1.eqTxInfo;

    // TODO(jaredponn): put some hard coded unit tests in

    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(fcTxInfo(), fcTxInfo(), (l, r) => {
          TestUtils.negationTest(dict, l, r);
        }),
        {
          examples: [],
        },
      );
    });
  });

  describe("Json TxInfo tests", () => {
    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(fcTxInfo(), (data) => {
          TestUtils.toJsonFromJsonRoundTrip(V1.jsonTxInfo, data);
        }),
        {
          examples: [],
        },
      );
    });
  });

  describe("IsPlutusData TxInfo tests", () => {
    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(fcTxInfo(), (data) => {
          TestUtils.isPlutusDataRoundTrip(V1.isPlutusDataTxInfo, data);
        }),
        {
          examples: [],
        },
      );
    });
  });
});
