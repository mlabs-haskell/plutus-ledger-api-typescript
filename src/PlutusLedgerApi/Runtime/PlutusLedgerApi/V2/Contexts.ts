import type { TxOutRef } from "../V1/Tx.js";
import * as V1Tx from "../V1/Tx.js";
import type { IsPlutusData } from "../PlutusData.js";
import { IsPlutusDataError } from "../PlutusData.js";
import type { Eq, Json } from "prelude";
import * as Prelude from "prelude";
import type { TxOut } from "./Tx.js";
import * as V2Tx from "./Tx.js";

// https://github.com/input-output-hk/plutus/blob/1.16.0.0/plutus-ledger-api/src/PlutusLedgerApi/V2/Contexts.hs

/**
 * {@link TxInInfo} is an input of a pending transaction.
 *
 * @see {@link https://github.com/input-output-hk/plutus/blob/1.16.0.0/plutus-ledger-api/src/PlutusLedgerApi/V2/Contexts.hs#L58-L62}
 */
export type TxInInfo = { txInInfoOutRef: TxOutRef; txInInfoResolved: TxOut };

/**
 * {@link Eq} instance for {@link TxInInfo}
 */
export const eqTxInInfo: Eq<TxInInfo> = {
  eq: (l, r) => {
    return V1Tx.eqTxOutRef.eq(l.txInInfoOutRef, r.txInInfoOutRef) &&
      V2Tx.eqTxOut.eq(l.txInInfoResolved, r.txInInfoResolved);
  },
  neq: (l, r) => {
    return V1Tx.eqTxOutRef.neq(l.txInInfoOutRef, r.txInInfoOutRef) ||
      V2Tx.eqTxOut.neq(l.txInInfoResolved, r.txInInfoResolved);
  },
};

/**
 * {@link Json} instance for {@link TxInInfo}
 */
export const jsonTxInInfo: Json<TxInInfo> = {
  toJson: (txininfo) => {
    return {
      "reference": V1Tx.jsonTxOutRef.toJson(txininfo.txInInfoOutRef),
      "output": V2Tx.jsonTxOut.toJson(txininfo.txInInfoResolved),
    };
  },
  fromJson: (value) => {
    const outref = Prelude.caseFieldWithValue(
      "reference",
      V1Tx.jsonTxOutRef.fromJson,
      value,
    );
    const output = Prelude.caseFieldWithValue(
      "output",
      V2Tx.jsonTxOut.fromJson,
      value,
    );
    return { txInInfoOutRef: outref, txInInfoResolved: output };
  },
};

/**
 * {@link IsPlutusData} instance for {@link TxInInfo}
 */
export const isPlutusDataTxInInfo: IsPlutusData<TxInInfo> = {
  toData: (txininfo) => {
    return {
      name: "Constr",
      fields: [0n, [
        V1Tx.isPlutusDataTxOutRef.toData(txininfo.txInInfoOutRef),
        V2Tx.isPlutusDataTxOut.toData(txininfo.txInInfoResolved),
      ]],
    };
  },

  fromData: (plutusData) => {
    switch (plutusData.name) {
      case "Constr":
        if (plutusData.fields[0] === 0n && plutusData.fields[1].length === 2) {
          return {
            txInInfoOutRef: V1Tx.isPlutusDataTxOutRef.fromData(
              plutusData.fields[1][0]!,
            ),
            txInInfoResolved: V2Tx.isPlutusDataTxOut.fromData(
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
