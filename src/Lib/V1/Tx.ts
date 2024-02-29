/**
 * @see {@link https://github.com/input-output-hk/plutus/blob/1.16.0.0/plutus-ledger-api/src/PlutusLedgerApi/V1/Tx.hs}
 */

import type { Eq, Integer, Json, Maybe } from "prelude";
import type { IsPlutusData } from "../PlutusData.js";
import { IsPlutusDataError } from "../PlutusData.js";
import * as PreludeInstances from "../Prelude/Instances.js";
import * as Prelude from "prelude";
import { JsonError } from "prelude";
import * as LbBytes from "./Bytes.js";

import type { Value } from "./Value.js";
import type { DatumHash } from "./Scripts.js";
import type { Address } from "./Address.js";

import * as LbValue from "./Value.js";
import * as LbScripts from "./Scripts.js";
import * as LbAddress from "./Address.js";

/**
 * {@link TxId} is a transaction id i.e., the hash of a transaction. 32 bytes.
 *
 * @see {@link https://github.com/input-output-hk/plutus/blob/1.16.0.0/plutus-ledger-api/src/PlutusLedgerApi/V1/Tx.hs#L51-L65}
 */
export type TxId = LbBytes.LedgerBytes & { __compileTimeOnlyTxId: TxId };

/**
 * {@link txIdFromBytes} checks if the bytes are 32 bytes long.
 */
export function txIdFromBytes(bytes: LbBytes.LedgerBytes): Maybe<TxId> {
  if (bytes.length === 32) {
    return { fields: bytes as TxId, name: "Just" };
  } else {
    return { name: "Nothing" };
  }
}

/**
 * {@link Eq} instance for {@link TxId}
 */
export const eqTxId: Eq<TxId> = LbBytes.eqLedgerBytes as Eq<TxId>;

/**
 * {@link Json} instance for {@link TxId}
 */
export const jsonTxId: Json<TxId> = {
  toJson: LbBytes.jsonLedgerBytes.toJson,
  fromJson: (value) => {
    const bs = txIdFromBytes(LbBytes.jsonLedgerBytes.fromJson(value));
    if (bs.name === "Nothing") {
      throw new JsonError(`TxId should be 32 bytes`);
    }
    return bs.fields;
  },
};

/**
 * {@link IsPlutusData} instance for {@link TxId}
 *
 * Note this includes the `0` tag.
 */
export const isPlutusDataTxId: IsPlutusData<TxId> = {
  toData: (txid) => {
    return {
      fields: [0n, [LbBytes.isPlutusDataLedgerBytes.toData(txid)]],
      name: "Constr",
    };
  },

  fromData: (plutusData) => {
    switch (plutusData.name) {
      case "Constr":
        if (plutusData.fields[0] === 0n && plutusData.fields[1].length === 1) {
          const res = txIdFromBytes(
            LbBytes.isPlutusDataLedgerBytes.fromData(plutusData.fields[1][0]!),
          );
          if (res.name === "Nothing") {
            break;
          }
          return res.fields;
        }
        break;
      default:
        break;
    }
    throw new IsPlutusDataError("Invalid data");
  },
};

/**
 * {@link TxOutRef} is a reference to a transaction output.
 *
 * @see {@link https://github.com/input-output-hk/plutus/blob/1.16.0.0/plutus-ledger-api/src/PlutusLedgerApi/V1/Tx.hs#L83-L91}
 */
export type TxOutRef = { txOutRefId: TxId; txOutRefIdx: Integer };

/**
 *  {@link Eq} instance for {@link TxOutRef}
 */
export const eqTxOutRef: Eq<TxOutRef> = {
  eq: (l, r) => {
    return eqTxId.eq(l.txOutRefId, r.txOutRefId) &&
      Prelude.eqInteger.eq(l.txOutRefIdx, r.txOutRefIdx);
  },
  neq: (l, r) => {
    return eqTxId.neq(l.txOutRefId, r.txOutRefId) ||
      Prelude.eqInteger.neq(l.txOutRefIdx, r.txOutRefIdx);
  },
};

/**
 *  {@link Json} instance for {@link TxOutRef}
 */
export const jsonTxOutRef: Json<TxOutRef> = {
  toJson: (txoutRef) => {
    return {
      "index": Prelude.jsonInteger.toJson(txoutRef.txOutRefIdx),
      "transaction_id": jsonTxId.toJson(txoutRef.txOutRefId),
    };
  },
  fromJson: (value) => {
    const txid = Prelude.caseFieldWithValue(
      "transaction_id",
      jsonTxId.fromJson,
      value,
    );
    const txidx = Prelude.caseFieldWithValue(
      "index",
      Prelude.jsonInteger.fromJson,
      value,
    );
    return { txOutRefId: txid, txOutRefIdx: txidx };
  },
};

/**
 *  {@link IsPlutusData} instance for {@link TxOutRef}
 */
export const isPlutusDataTxOutRef: IsPlutusData<TxOutRef> = {
  toData: (txoutref) => {
    return {
      fields: [0n, [
        isPlutusDataTxId.toData(txoutref.txOutRefId),
        PreludeInstances.isPlutusDataInteger.toData(txoutref.txOutRefIdx),
      ]],
      name: "Constr",
    };
  },
  fromData: (plutusData) => {
    switch (plutusData.name) {
      case "Constr":
        if (plutusData.fields[0] === 0n && plutusData.fields[1].length === 2) {
          return {
            txOutRefId: isPlutusDataTxId.fromData(plutusData.fields[1][0]!),
            txOutRefIdx: PreludeInstances.isPlutusDataInteger.fromData(
              plutusData.fields[1][1]!,
            ),
          };
        }
        break;
      default:
        break;
    }
    throw new IsPlutusDataError("Invalid data");
  },
};

//////////////////////////////////////////////////

/**
 * {@link TxOut} a transaction output consisting of a target address, a value,
 * and optionally a datum hash.
 *
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.16.0.0/plutus-ledger-api/src/PlutusLedgerApi/V1/Tx.hs#L102-L110}
 */
export type TxOut = {
  txOutAddress: Address;
  txOutValue: Value;
  txOutDatumHash: Maybe<DatumHash>;
};

/**
 *  {@link Eq} instance for {@link TxOut}
 */
export const eqTxOut: Eq<TxOut> = {
  eq: (l, r) => {
    return LbAddress.eqAddress.eq(l.txOutAddress, r.txOutAddress) &&
      LbValue.eqValue.eq(l.txOutValue, r.txOutValue) &&
      Prelude.eqMaybe(LbScripts.eqDatumHash).eq(
        l.txOutDatumHash,
        r.txOutDatumHash,
      );
  },
  neq: (l, r) => {
    return LbAddress.eqAddress.neq(l.txOutAddress, r.txOutAddress) ||
      LbValue.eqValue.neq(l.txOutValue, r.txOutValue) ||
      Prelude.eqMaybe(LbScripts.eqDatumHash).neq(
        l.txOutDatumHash,
        r.txOutDatumHash,
      );
  },
};

/**
 *  {@link Json} instance for {@link TxOut}
 */
export const jsonTxOut: Json<TxOut> = {
  toJson: (txOut) => {
    return {
      "address": LbAddress.jsonAddress.toJson(txOut.txOutAddress),
      "datum_hash": Prelude.jsonMaybe(LbScripts.jsonDatumHash).toJson(
        txOut.txOutDatumHash,
      ),
      "value": LbValue.jsonValue.toJson(txOut.txOutValue),
    };
  },
  fromJson: (value) => {
    const txOutAddress = Prelude.caseFieldWithValue(
      "address",
      LbAddress.jsonAddress.fromJson,
      value,
    );
    const txOutValue = Prelude.caseFieldWithValue(
      "value",
      LbValue.jsonValue.fromJson,
      value,
    );

    const txOutDatumHash = Prelude.caseFieldWithValue(
      "datum_hash",
      Prelude.jsonMaybe(LbScripts.jsonDatumHash).fromJson,
      value,
    );
    return { txOutAddress, txOutDatumHash, txOutValue };
  },
};

/**
 *  {@link IsPlutusData} instance for {@link TxOut}
 */
export const isPlutusDataTxOut: IsPlutusData<TxOut> = {
  toData: (txOut) => {
    return {
      fields: [0n, [
        LbAddress.isPlutusDataAddress.toData(txOut.txOutAddress),
        LbValue.isPlutusDataValue.toData(txOut.txOutValue),
        PreludeInstances.isPlutusDataMaybe(LbScripts.isPlutusDataDatumHash)
          .toData(txOut.txOutDatumHash),
      ]],
      name: "Constr",
    };
  },
  fromData: (plutusData) => {
    switch (plutusData.name) {
      case "Constr":
        if (plutusData.fields[0] === 0n && plutusData.fields[1].length === 3) {
          return {
            txOutAddress: LbAddress.isPlutusDataAddress.fromData(
              plutusData.fields[1][0]!,
            ),
            txOutDatumHash: PreludeInstances.isPlutusDataMaybe(
              LbScripts.isPlutusDataDatumHash,
            ).fromData(plutusData.fields[1][2]!),
            txOutValue: LbValue.isPlutusDataValue.fromData(
              plutusData.fields[1][1]!,
            ),
          };
        }
        break;
      default:
        break;
    }
    throw new IsPlutusDataError("Invalid data");
  },
};
