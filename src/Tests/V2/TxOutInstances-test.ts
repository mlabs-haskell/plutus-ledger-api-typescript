// Tests for the instances for `TxOut`
import * as LbAssocMap from "../../Lib/AssocMap.js";
import * as V1 from "../../Lib/V1.js";
import * as V2 from "../../Lib/V2.js";
import * as Prelude from "prelude";

import { describe, it } from "node:test";

import * as TestUtils from "../TestUtils.js";
import fc from "fast-check";

import * as TestAddress from "../V1/AddressInstances-test.js";
import * as TestValue from "../V1/ValueInstances-test.js";
import * as TestOutputDatum from "./OutputDatumInstances-test.js";
import * as TestMaybe from "../Prelude/MaybeInstances-test.js";
import * as TestScriptHash from "../V1/ScriptHashInstances-test.js";

export function fcTxOut(): fc.Arbitrary<V2.TxOut> {
  return fc.record({
    txOutAddress: TestAddress.fcAddress(),
    txOutValue: TestValue.fcValue(),
    txOutDatum: TestOutputDatum.fcOutputDatum(),
    txOutReferenceScript: TestMaybe.fcMaybe(TestScriptHash.fcScriptHash()),
  }) as fc.Arbitrary<V2.TxOut>;
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

const scriptHash1: V1.ScriptHash = Prelude.fromJust(
  V1.scriptHashFromBytes(
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

const txOut2: V2.TxOut = {
  txOutAddress: address1,
  txOutValue: value1,
  txOutDatum: outputDatum1,
  txOutReferenceScript: { name: "Just", fields: scriptHash1 },
};

describe("TxOut tests", () => {
  describe("Eq TxOut tests", () => {
    const dict = V2.eqTxOut;
    TestUtils.eqIt(dict, txOut1, txOut1, true);
    TestUtils.neqIt(dict, txOut1, txOut1, false);

    TestUtils.eqIt(dict, txOut2, txOut2, true);
    TestUtils.neqIt(dict, txOut2, txOut2, false);

    TestUtils.eqIt(dict, txOut2, txOut1, false);
    TestUtils.neqIt(dict, txOut2, txOut1, true);

    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(
          fcTxOut(),
          fcTxOut(),
          (l, r) => {
            TestUtils.negationTest(dict, l, r);
          },
        ),
        { examples: [] },
      );
    });
  });

  describe("Json TxOut tests", () => {
    TestUtils.toJsonAndFromJsonIt(V2.jsonTxOut, txOut1, {
      address: V1.jsonAddress.toJson(address1),
      datum: V2.jsonOutputDatum.toJson(outputDatum1),
      reference_script: Prelude.jsonMaybe(V1.jsonScriptHash).toJson({
        name: "Nothing",
      }),
      value: [],
    });

    TestUtils.toJsonAndFromJsonIt(V2.jsonTxOut, txOut2, {
      address: V1.jsonAddress.toJson(address1),
      datum: V2.jsonOutputDatum.toJson(outputDatum1),
      reference_script: Prelude.jsonMaybe(V1.jsonScriptHash).toJson({
        name: "Just",
        fields: scriptHash1,
      }),
      value: [],
    });

    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(
          fcTxOut(),
          (data) => {
            TestUtils.toJsonFromJsonRoundTrip(V2.jsonTxOut, data);
          },
        ),
        { examples: [] },
      );
    });
  });

  describe("IsPlutusData TxOut tests", () => {
    TestUtils.isPlutusDataIt(
      V2.isPlutusDataTxOut,
      txOut1,
      {
        name: "Constr",
        fields: [0n, [
          V1.isPlutusDataAddress.toData(address1),
          V1.isPlutusDataValue.toData(value1),
          V2.isPlutusDataOutputDatum.toData(outputDatum1),
          V1.isPlutusDataMaybe(V1.isPlutusDataScriptHash).toData({
            name: "Nothing",
          }),
        ]],
      },
    );

    TestUtils.isPlutusDataIt(
      V2.isPlutusDataTxOut,
      txOut2,
      {
        name: "Constr",
        fields: [0n, [
          V1.isPlutusDataAddress.toData(address1),
          V1.isPlutusDataValue.toData(value1),
          V2.isPlutusDataOutputDatum.toData(outputDatum1),
          V1.isPlutusDataMaybe(V1.isPlutusDataScriptHash).toData({
            name: "Just",
            fields: scriptHash1,
          }),
        ]],
      },
    );

    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(
          fcTxOut(),
          (data) => {
            TestUtils.isPlutusDataRoundTrip(
              V2.isPlutusDataTxOut,
              data,
            );
          },
        ),
        { examples: [] },
      );
    });
  });
});
