// Tests for the instances for `TxOut`
import * as LbAssocMap from "../../Lib/AssocMap.js";
import * as V1 from "../../Lib/V1.js";
import * as Prelude from "prelude";
import * as PreludeInstances from "../../Lib/Prelude/Instances.js";

import { describe, it } from "node:test";

import * as TestUtils from "../TestUtils.js";
import fc from "fast-check";

import * as TestAddress from "./AddressInstances-test.js";
import * as TestValue from "./ValueInstances-test.js";
import * as TestMaybe from "../Prelude/MaybeInstances-test.js";
import * as TestDatumHash from "./DatumHashInstances-test.js";

export function fcTxOut(): fc.Arbitrary<V1.TxOut> {
  return fc.record(
    {
      txOutAddress: TestAddress.fcAddress(),
      txOutValue: TestValue.fcValue(),
      txOutDatumHash: TestMaybe.fcMaybe(TestDatumHash.fcDatumHash()),
    },
    { noNullPrototype: true },
  ) as fc.Arbitrary<V1.TxOut>;
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

const maybeDatumHash1: Prelude.Maybe<V1.DatumHash> = {
  name: `Just`,
  fields: TestDatumHash.datumHash1,
};
const maybeDatumHash2: Prelude.Maybe<V1.DatumHash> = { name: `Nothing` };

const txOut1: V1.TxOut = {
  txOutAddress: address1,
  txOutValue: value1,
  txOutDatumHash: maybeDatumHash1,
};

const txOut2: V1.TxOut = {
  txOutAddress: address1,
  txOutValue: value1,
  txOutDatumHash: maybeDatumHash2,
};

describe("TxOut tests", () => {
  describe("Eq TxOut tests", () => {
    const dict = V1.eqTxOut;
    TestUtils.eqIt(dict, txOut1, txOut1, true);
    TestUtils.neqIt(dict, txOut1, txOut1, false);

    TestUtils.eqIt(dict, txOut2, txOut2, true);
    TestUtils.neqIt(dict, txOut2, txOut2, false);

    TestUtils.eqIt(dict, txOut2, txOut1, false);
    TestUtils.neqIt(dict, txOut2, txOut1, true);

    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(fcTxOut(), fcTxOut(), (l, r) => {
          TestUtils.negationTest(dict, l, r);
        }),
        { examples: [] },
      );
    });
  });

  describe("Json TxOut tests", () => {
    TestUtils.toJsonAndFromJsonIt(V1.jsonTxOut, txOut1, {
      address: V1.jsonAddress.toJson(address1),
      datum_hash: Prelude.jsonMaybe(V1.jsonDatumHash).toJson(maybeDatumHash1),
      value: [],
    });

    TestUtils.toJsonAndFromJsonIt(V1.jsonTxOut, txOut2, {
      address: V1.jsonAddress.toJson(address1),
      datum_hash: Prelude.jsonMaybe(V1.jsonDatumHash).toJson(maybeDatumHash2),
      value: [],
    });

    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(fcTxOut(), (data) => {
          TestUtils.toJsonFromJsonRoundTrip(V1.jsonTxOut, data);
        }),
        { examples: [] },
      );
    });
  });

  describe("IsPlutusData TxOut tests", () => {
    TestUtils.isPlutusDataIt(V1.isPlutusDataTxOut, txOut1, {
      name: "Constr",
      fields: [
        0n,
        [
          V1.isPlutusDataAddress.toData(address1),
          V1.isPlutusDataValue.toData(value1),
          PreludeInstances.isPlutusDataMaybe(V1.isPlutusDataDatumHash).toData(
            maybeDatumHash1,
          ),
        ],
      ],
    });

    TestUtils.isPlutusDataIt(V1.isPlutusDataTxOut, txOut2, {
      name: "Constr",
      fields: [
        0n,
        [
          V1.isPlutusDataAddress.toData(address1),
          V1.isPlutusDataValue.toData(value1),
          PreludeInstances.isPlutusDataMaybe(V1.isPlutusDataDatumHash).toData(
            maybeDatumHash2,
          ),
        ],
      ],
    });

    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(fcTxOut(), (data) => {
          TestUtils.isPlutusDataRoundTrip(V1.isPlutusDataTxOut, data);
        }),
        { examples: [] },
      );
    });
  });
});
