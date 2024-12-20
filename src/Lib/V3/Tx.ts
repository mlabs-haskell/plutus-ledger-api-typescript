/**
 * @see {@link https://github.com/input-output-hk/plutus/blob/1.36.0.0/plutus-ledger-api/src/PlutusLedgerApi/V1/Tx.hs}
 */

import type { Eq, Integer, Json, Maybe } from "prelude";
import type { IsPlutusData } from "../PlutusData.js";
import { IsPlutusDataError } from "../PlutusData.js";
import * as PreludeInstances from "../Prelude/Instances.js";
import * as Prelude from "prelude";
import { JsonError } from "prelude";
import * as LbBytes from "../V1/Bytes.js";

/**
 * {@link TxId} is a transaction id i.e., the hash of a transaction. 32 bytes.
 *
 * @see {@link https://github.com/input-output-hk/plutus/blob/1.36.0.0/plutus-ledger-api/src/PlutusLedgerApi/V3/Tx.hs#L42-L54}
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
 * Note this uses a more efficient encoding, without the Constr
 */
export const isPlutusDataTxId: IsPlutusData<TxId> = {
  toData: (txid) => {
    return LbBytes.isPlutusDataLedgerBytes.toData(txid);
  },

  fromData: (plutusData) => {
    const res = txIdFromBytes(
      LbBytes.isPlutusDataLedgerBytes.fromData(plutusData),
    );
    if (res.name === "Nothing") {
      throw new IsPlutusDataError("Invalid data");
    }
    return res.fields;
  },
};

/**
 * {@link TxOutRef} is a reference to a transaction output.
 *
 * @see {@link https://github.com/input-output-hk/plutus/blob/1.36.0.0/plutus-ledger-api/src/PlutusLedgerApi/V3/Tx.hs#L66-L73}
 */
export type TxOutRef = { txOutRefId: TxId; txOutRefIdx: Integer };

/**
 *  {@link Eq} instance for {@link TxOutRef}
 */
export const eqTxOutRef: Eq<TxOutRef> = {
  eq: (l, r) => {
    return (
      eqTxId.eq(l.txOutRefId, r.txOutRefId) &&
      Prelude.eqInteger.eq(l.txOutRefIdx, r.txOutRefIdx)
    );
  },
  neq: (l, r) => {
    return (
      eqTxId.neq(l.txOutRefId, r.txOutRefId) ||
      Prelude.eqInteger.neq(l.txOutRefIdx, r.txOutRefIdx)
    );
  },
};

/**
 *  {@link Json} instance for {@link TxOutRef}
 */
export const jsonTxOutRef: Json<TxOutRef> = {
  toJson: (txoutRef) => {
    return {
      index: Prelude.jsonInteger.toJson(txoutRef.txOutRefIdx),
      transaction_id: jsonTxId.toJson(txoutRef.txOutRefId),
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
      fields: [
        0n,
        [
          isPlutusDataTxId.toData(txoutref.txOutRefId),
          PreludeInstances.isPlutusDataInteger.toData(txoutref.txOutRefIdx),
        ],
      ],
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
