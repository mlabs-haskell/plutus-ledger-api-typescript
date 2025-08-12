// Tests for the instances for `TxInInfo`
import * as LbAssocMap from "../../Lib/AssocMap.js";
import * as V1 from "../../Lib/V1.js";
import * as V2 from "../../Lib/V2.js";
import * as Prelude from "prelude";

import { describe, it } from "node:test";

import * as TestUtils from "../TestUtils.js";
import fc from "fast-check";

import * as TestTxOutRef from "../V1/TxOutRefInstances-test.js";
import * as TestTxOut from "./TxOutInstances-test.js";

export function fcTxInInfo(): fc.Arbitrary<V2.TxInInfo> {
  return fc.record(
    {
      txInInfoOutRef: TestTxOutRef.fcTxOutRef(),
      txInInfoResolved: TestTxOut.fcTxOut(),
    },
    { noNullPrototype: true },
  ) as fc.Arbitrary<V2.TxInInfo>;
}

const pubKeyHash1 = Prelude.fromJust(
  V1.pubKeyHashFromBytes(
    Uint8Array.from([
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
    ]),
  ),
);

const credential1: V1.Credential = {
  name: "PubKeyCredential",
  fields: pubKeyHash1,
};
const address1: V1.Address = {
  addressCredential: credential1,
  addressStakingCredential: { name: "Nothing" },
};

const value1: V1.Value = LbAssocMap.fromList([]);

const outputDatum1: V2.OutputDatum = { name: "NoOutputDatum" };

const txOut1: V2.TxOut = {
  txOutAddress: address1,
  txOutValue: value1,
  txOutDatum: outputDatum1,
  txOutReferenceScript: { name: "Nothing" },
};

const txId1: V1.TxId = Prelude.fromJust(
  V1.txIdFromBytes(
    Uint8Array.from([
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
    ]),
  ),
);

const txOutRef1: V1.TxOutRef = { txOutRefId: txId1, txOutRefIdx: 69n };

const txOutRef2: V1.TxOutRef = { txOutRefId: txId1, txOutRefIdx: 420n };

const txInInfo1: V2.TxInInfo = {
  txInInfoOutRef: txOutRef1,
  txInInfoResolved: txOut1,
};

const txInInfo2: V2.TxInInfo = {
  txInInfoOutRef: txOutRef2,
  txInInfoResolved: txOut1,
};

describe("TxInInfo tests", () => {
  describe("Eq TxInInfo tests", () => {
    const dict = V2.eqTxInInfo;
    TestUtils.eqIt(dict, txInInfo1, txInInfo1, true);
    TestUtils.neqIt(dict, txInInfo1, txInInfo1, false);

    TestUtils.eqIt(dict, txInInfo2, txInInfo2, true);
    TestUtils.neqIt(dict, txInInfo2, txInInfo2, false);

    TestUtils.eqIt(dict, txInInfo1, txInInfo2, false);
    TestUtils.neqIt(dict, txInInfo1, txInInfo2, true);

    TestUtils.eqIt(dict, txInInfo2, txInInfo1, false);
    TestUtils.neqIt(dict, txInInfo2, txInInfo1, true);

    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(fcTxInInfo(), fcTxInInfo(), (l, r) => {
          TestUtils.negationTest(dict, l, r);
        }),
        { examples: [] },
      );
    });
  });

  describe("Json TxInInfo tests", () => {
    TestUtils.toJsonAndFromJsonIt(V2.jsonTxInInfo, txInInfo1, {
      output: V2.jsonTxOut.toJson(txOut1),
      reference: V1.jsonTxOutRef.toJson(txOutRef1),
    });

    TestUtils.toJsonAndFromJsonIt(V2.jsonTxInInfo, txInInfo2, {
      output: V2.jsonTxOut.toJson(txOut1),
      reference: V1.jsonTxOutRef.toJson(txOutRef2),
    });

    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(fcTxInInfo(), (data) => {
          TestUtils.toJsonFromJsonRoundTrip(V2.jsonTxInInfo, data);
        }),
        { examples: [] },
      );
    });
  });

  describe("IsPlutusData TxInInfo tests", () => {
    TestUtils.isPlutusDataIt(V2.isPlutusDataTxInInfo, txInInfo1, {
      name: "Constr",
      fields: [
        0n,
        [
          V1.isPlutusDataTxOutRef.toData(txOutRef1),
          V2.isPlutusDataTxOut.toData(txOut1),
        ],
      ],
    });

    TestUtils.isPlutusDataIt(V2.isPlutusDataTxInInfo, txInInfo2, {
      name: "Constr",
      fields: [
        0n,
        [
          V1.isPlutusDataTxOutRef.toData(txOutRef2),
          V2.isPlutusDataTxOut.toData(txOut1),
        ],
      ],
    });

    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(fcTxInInfo(), (data) => {
          TestUtils.isPlutusDataRoundTrip(V2.isPlutusDataTxInInfo, data);
        }),
        { examples: [] },
      );
    });
  });
});
