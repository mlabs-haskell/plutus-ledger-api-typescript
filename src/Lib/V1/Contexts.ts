/**
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.16.0.0/plutus-ledger-api/src/PlutusLedgerApi/V1/Contexts.hs}
 */

import type { Eq, Integer, Json } from "prelude";
import * as Prelude from "prelude";
import * as PreludeInstances from "../Prelude/Instances.js";

import type { TxId, TxOut, TxOutRef } from "./Tx.js";
import * as LbTx from "./Tx.js";

import type { Value } from "./Value.js";
import * as LbValue from "./Value.js";

import type { StakingCredential } from "./Credential.js";
import * as LbCredential from "./Credential.js";

import { IsPlutusDataError } from "../PlutusData.js";
import type { IsPlutusData } from "../PlutusData.js";

import type { DCert } from "./DCert.js";
import * as LbDCert from "./DCert.js";

import type { POSIXTimeRange } from "./Time.js";
import * as LbTime from "./Time.js";

import type { Datum, DatumHash } from "./Scripts.js";
import * as LbScripts from "./Scripts.js";

import * as LbCrypto from "./Crypto.js";
import type { PubKeyHash } from "./Crypto.js";

/**
 * An input of a pending transaction.
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.16.0.0/plutus-ledger-api/src/PlutusLedgerApi/V1/Contexts.hs#L66-L70}
 */
export type TxInInfo = {
  txInInfoOutRef: TxOutRef;
  txInInfoResolved: TxOut;
};

/**
 * {@link Eq} instance for {@link TxInInfo}
 */
export const eqTxInInfo: Eq<TxInInfo> = {
  eq: (l, r) => {
    return LbTx.eqTxOutRef.eq(l.txInInfoOutRef, r.txInInfoOutRef) &&
      LbTx.eqTxOut.eq(l.txInInfoResolved, r.txInInfoResolved);
  },
  neq: (l, r) => {
    return LbTx.eqTxOutRef.neq(l.txInInfoOutRef, r.txInInfoOutRef) ||
      LbTx.eqTxOut.neq(l.txInInfoResolved, r.txInInfoResolved);
  },
};

/**
 * {@link Json} instance for {@link TxInInfo}
 */
export const jsonTxInInfo: Json<TxInInfo> = {
  toJson: (txInInfo) => {
    return {
      "output": LbTx.jsonTxOut.toJson(txInInfo.txInInfoResolved),
      "reference": LbTx.jsonTxOutRef.toJson(txInInfo.txInInfoOutRef),
    };
  },
  fromJson: (value) => {
    const txInInfoOutRef = Prelude.caseFieldWithValue(
      "reference",
      LbTx.jsonTxOutRef.fromJson,
      value,
    );
    const txInInfoResolved = Prelude.caseFieldWithValue(
      "output",
      LbTx.jsonTxOut.fromJson,
      value,
    );
    return { txInInfoOutRef, txInInfoResolved };
  },
};

/**
 * {@link IsPlutusData} instance for {@link TxInInfo}
 */
export const isPlutusDataTxInInfo: IsPlutusData<TxInInfo> = {
  toData: (txInInfo) => {
    return {
      fields: [0n, [
        LbTx.isPlutusDataTxOutRef.toData(txInInfo.txInInfoOutRef),
        LbTx.isPlutusDataTxOut.toData(txInInfo.txInInfoResolved),
      ]],
      name: "Constr",
    };
  },

  fromData: (plutusData) => {
    switch (plutusData.name) {
      case "Constr": {
        if (plutusData.fields[0] === 0n && plutusData.fields[1].length === 2) {
          return {
            txInInfoOutRef: LbTx.isPlutusDataTxOutRef.fromData(
              plutusData.fields[1][0]!,
            ),
            txInInfoResolved: LbTx.isPlutusDataTxOut.fromData(
              plutusData.fields[1][1]!,
            ),
          };
        } else {
          break;
        }
      }
      default:
        break;
    }
    throw new IsPlutusDataError("Unexpected data");
  },
};

/**
 * A pending transaction. This is the view as seen by validator scripts, so
 * some details are stripped out.
 *
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.16.0.0/plutus-ledger-api/src/PlutusLedgerApi/V1/Contexts.hs#L96-L108}
 */
export type TxInfo = {
  txInfoInputs: TxInInfo[];
  txInfoOutputs: TxOut[];
  txInfoFee: Value;
  txInfoMint: Value;
  txInfoDCert: DCert[];
  txInfoWdrl: [StakingCredential, Integer][];
  txInfoValidRange: POSIXTimeRange;
  txInfoSignatories: PubKeyHash[];
  txInfoData: [DatumHash, Datum][];
  txInfoId: TxId;
};

/**
 * {@link Eq} instance for {@link TxInfo}
 */
export const eqTxInfo: Eq<TxInfo> = {
  eq: (l, r) => {
    return Prelude.eqList(eqTxInInfo).eq(l.txInfoInputs, r.txInfoInputs) &&
      Prelude.eqList(LbTx.eqTxOut).eq(l.txInfoOutputs, r.txInfoOutputs) &&
      LbValue.eqValue.eq(l.txInfoFee, r.txInfoFee) &&
      LbValue.eqValue.eq(l.txInfoMint, r.txInfoMint) &&
      Prelude.eqList(LbDCert.eqDCert).eq(l.txInfoDCert, r.txInfoDCert) &&
      Prelude.eqList(
        Prelude.eqPair(LbCredential.eqStakingCredential, Prelude.eqInteger),
      ).eq(l.txInfoWdrl, r.txInfoWdrl) &&
      LbTime.eqPOSIXTimeRange.eq(l.txInfoValidRange, r.txInfoValidRange) &&
      Prelude.eqList(LbCrypto.eqPubKeyHash).eq(
        l.txInfoSignatories,
        r.txInfoSignatories,
      ) &&
      Prelude.eqList(Prelude.eqPair(LbScripts.eqDatumHash, LbScripts.eqDatum))
        .eq(l.txInfoData, r.txInfoData) &&
      LbTx.eqTxId.eq(l.txInfoId, r.txInfoId);
  },
  neq: (l, r) => {
    return Prelude.eqList(eqTxInInfo).neq(l.txInfoInputs, r.txInfoInputs) ||
      Prelude.eqList(LbTx.eqTxOut).neq(l.txInfoOutputs, r.txInfoOutputs) ||
      LbValue.eqValue.neq(l.txInfoFee, r.txInfoFee) ||
      LbValue.eqValue.neq(l.txInfoMint, r.txInfoMint) ||
      Prelude.eqList(LbDCert.eqDCert).neq(l.txInfoDCert, r.txInfoDCert) ||
      Prelude.eqList(
        Prelude.eqPair(LbCredential.eqStakingCredential, Prelude.eqInteger),
      ).neq(l.txInfoWdrl, r.txInfoWdrl) ||
      LbTime.eqPOSIXTimeRange.neq(l.txInfoValidRange, r.txInfoValidRange) ||
      Prelude.eqList(LbCrypto.eqPubKeyHash).neq(
        l.txInfoSignatories,
        r.txInfoSignatories,
      ) ||
      Prelude.eqList(Prelude.eqPair(LbScripts.eqDatumHash, LbScripts.eqDatum))
        .neq(l.txInfoData, r.txInfoData) ||
      LbTx.eqTxId.neq(l.txInfoId, r.txInfoId);
  },
};

/**
 * {@link Json} instance for {@link TxInfo}
 */
export const jsonTxInfo: Json<TxInfo> = {
  toJson: (txInfo) => {
    return {
      inputs: Prelude.jsonList(jsonTxInInfo).toJson(txInfo.txInfoInputs),
      outputs: Prelude.jsonList(LbTx.jsonTxOut).toJson(txInfo.txInfoOutputs),
      fee: LbValue.jsonValue.toJson(txInfo.txInfoFee),
      mint: LbValue.jsonValue.toJson(txInfo.txInfoMint),
      d_cert: Prelude.jsonList(LbDCert.jsonDCert).toJson(txInfo.txInfoDCert),
      wdrl: Prelude.jsonList(
        Prelude.jsonPair(
          LbCredential.jsonStakingCredential,
          Prelude.jsonInteger,
        ),
      ).toJson(txInfo.txInfoWdrl),
      valid_range: LbTime.jsonPOSIXTimeRange.toJson(txInfo.txInfoValidRange),
      signatories: Prelude.jsonList(LbCrypto.jsonPubKeyHash).toJson(
        txInfo.txInfoSignatories,
      ),
      datums: Prelude.jsonList(
        Prelude.jsonPair(LbScripts.jsonDatumHash, LbScripts.jsonDatum),
      ).toJson(txInfo.txInfoData),
      id: LbTx.jsonTxId.toJson(txInfo.txInfoId),
    };
  },
  fromJson: (value) => {
    const txInfoInputs = Prelude.caseFieldWithValue(
      "inputs",
      Prelude.jsonList(jsonTxInInfo).fromJson,
      value,
    );
    const txInfoOutputs = Prelude.caseFieldWithValue(
      "outputs",
      Prelude.jsonList(LbTx.jsonTxOut).fromJson,
      value,
    );
    const txInfoFee = Prelude.caseFieldWithValue(
      "fee",
      LbValue.jsonValue.fromJson,
      value,
    );
    const txInfoMint = Prelude.caseFieldWithValue(
      "mint",
      LbValue.jsonValue.fromJson,
      value,
    );
    const txInfoDCert = Prelude.caseFieldWithValue(
      "d_cert",
      Prelude.jsonList(LbDCert.jsonDCert).fromJson,
      value,
    );
    const txInfoWdrl = Prelude.caseFieldWithValue(
      "wdrl",
      Prelude.jsonList(
        Prelude.jsonPair(
          LbCredential.jsonStakingCredential,
          Prelude.jsonInteger,
        ),
      ).fromJson,
      value,
    );
    const txInfoValidRange = Prelude.caseFieldWithValue(
      "valid_range",
      LbTime.jsonPOSIXTimeRange.fromJson,
      value,
    );
    const txInfoSignatories = Prelude.caseFieldWithValue(
      "signatories",
      Prelude.jsonList(LbCrypto.jsonPubKeyHash).fromJson,
      value,
    );
    const txInfoData = Prelude.caseFieldWithValue(
      "datums",
      Prelude.jsonList(
        Prelude.jsonPair(LbScripts.jsonDatumHash, LbScripts.jsonDatum),
      ).fromJson,
      value,
    );
    const txInfoId = Prelude.caseFieldWithValue(
      "id",
      LbTx.jsonTxId.fromJson,
      value,
    );

    return {
      txInfoInputs,
      txInfoOutputs,
      txInfoFee,
      txInfoMint,
      txInfoDCert,
      txInfoWdrl,
      txInfoValidRange,
      txInfoSignatories,
      txInfoData,
      txInfoId,
    };
  },
};

/**
 * {@link IsPlutusData} instance for {@link TxInfo}
 */
export const isPlutusDataTxInfo: IsPlutusData<TxInfo> = {
  toData: (txInfo) => {
    return {
      fields: [0n, [
        PreludeInstances.isPlutusDataList(isPlutusDataTxInInfo).toData(
          txInfo.txInfoInputs,
        ),
        PreludeInstances.isPlutusDataList(LbTx.isPlutusDataTxOut).toData(
          txInfo.txInfoOutputs,
        ),
        LbValue.isPlutusDataValue.toData(txInfo.txInfoFee),
        LbValue.isPlutusDataValue.toData(txInfo.txInfoMint),
        PreludeInstances.isPlutusDataList(LbDCert.isPlutusDataDCert).toData(
          txInfo.txInfoDCert,
        ),
        PreludeInstances.isPlutusDataList(
          PreludeInstances.isPlutusDataPairWithTag(
            LbCredential.isPlutusDataStakingCredential,
            PreludeInstances.isPlutusDataInteger,
          ),
        ).toData(txInfo.txInfoWdrl),
        LbTime.isPlutusDataPOSIXTimeRange.toData(txInfo.txInfoValidRange),
        PreludeInstances.isPlutusDataList(LbCrypto.isPlutusDataPubKeyHash)
          .toData(txInfo.txInfoSignatories),
        PreludeInstances.isPlutusDataList(
          PreludeInstances.isPlutusDataPairWithTag(
            LbScripts.isPlutusDataDatumHash,
            LbScripts.isPlutusDataDatum,
          ),
        ).toData(txInfo.txInfoData),
        LbTx.isPlutusDataTxId.toData(txInfo.txInfoId),
      ]],
      name: "Constr",
    };
  },

  fromData: (plutusData) => {
    switch (plutusData.name) {
      case "Constr": {
        if (plutusData.fields[0] === 0n && plutusData.fields[1].length === 10) {
          const txInfoInputs = PreludeInstances.isPlutusDataList(
            isPlutusDataTxInInfo,
          ).fromData(plutusData.fields[1][0]!);
          const txInfoOutputs = PreludeInstances.isPlutusDataList(
            LbTx.isPlutusDataTxOut,
          ).fromData(plutusData.fields[1][1]!);
          const txInfoFee = LbValue.isPlutusDataValue.fromData(
            plutusData.fields[1][2]!,
          );
          const txInfoMint = LbValue.isPlutusDataValue.fromData(
            plutusData.fields[1][3]!,
          );
          const txInfoDCert = PreludeInstances.isPlutusDataList(
            LbDCert.isPlutusDataDCert,
          ).fromData(plutusData.fields[1][4]!);
          const txInfoWdrl = PreludeInstances.isPlutusDataList(
            PreludeInstances.isPlutusDataPairWithTag(
              LbCredential.isPlutusDataStakingCredential,
              PreludeInstances.isPlutusDataInteger,
            ),
          ).fromData(plutusData.fields[1][5]!);
          const txInfoValidRange = LbTime.isPlutusDataPOSIXTimeRange.fromData(
            plutusData.fields[1][6]!,
          );
          const txInfoSignatories = PreludeInstances.isPlutusDataList(
            LbCrypto.isPlutusDataPubKeyHash,
          ).fromData(plutusData.fields[1][7]!);
          const txInfoData = PreludeInstances.isPlutusDataList(
            PreludeInstances.isPlutusDataPairWithTag(
              LbScripts.isPlutusDataDatumHash,
              LbScripts.isPlutusDataDatum,
            ),
          ).fromData(plutusData.fields[1][8]!);
          const txInfoId = LbTx.isPlutusDataTxId.fromData(
            plutusData.fields[1][9]!,
          );

          return {
            txInfoInputs,
            txInfoOutputs,
            txInfoFee,
            txInfoMint,
            txInfoDCert,
            txInfoWdrl,
            txInfoValidRange,
            txInfoSignatories,
            txInfoData,
            txInfoId,
          };
        } else {
          break;
        }
      }
      default:
        break;
    }
    throw new IsPlutusDataError("Unexpected data");
  },
};
