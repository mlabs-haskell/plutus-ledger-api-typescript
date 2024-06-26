/**
 * @see {@link https://github.com/input-output-hk/plutus/blob/1.16.0.0/plutus-ledger-api/src/PlutusLedgerApi/V2/Contexts.hs}
 */
import type { TxId, TxOutRef } from "../V1/Tx.js";
import * as V1Tx from "../V1/Tx.js";

import type { IsPlutusData } from "../PlutusData.js";
import { IsPlutusDataError } from "../PlutusData.js";

import type { Eq, Integer, Json } from "prelude";
import * as Prelude from "prelude";
import * as PreludeInstances from "../Prelude/Instances.js";

import type { TxOut } from "./Tx.js";
import * as V2Tx from "./Tx.js";

import type { Value } from "../V1/Value.js";
import * as V1Value from "../V1/Value.js";

import type { DCert } from "../V1/DCert.js";
import * as V1DCert from "../V1/DCert.js";

import type { StakingCredential } from "../V1/Credential.js";
import * as V1Credential from "../V1/Credential.js";

import type { POSIXTimeRange } from "../V1/Time.js";
import * as V1Time from "../V1/Time.js";

import type { PubKeyHash } from "../V1/Crypto.js";
import * as V1Crypto from "../V1/Crypto.js";

import type { Datum, DatumHash, Redeemer } from "../V1/Scripts.js";
import * as V1Scripts from "../V1/Scripts.js";

import type { ScriptPurpose } from "../V1/Contexts.js";
import * as V1Context from "../V1/Contexts.js";

import type { Map } from "../AssocMap.js";
import * as AssocMap from "../AssocMap.js";

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
    return (
      V1Tx.eqTxOutRef.eq(l.txInInfoOutRef, r.txInInfoOutRef) &&
      V2Tx.eqTxOut.eq(l.txInInfoResolved, r.txInInfoResolved)
    );
  },
  neq: (l, r) => {
    return (
      V1Tx.eqTxOutRef.neq(l.txInInfoOutRef, r.txInInfoOutRef) ||
      V2Tx.eqTxOut.neq(l.txInInfoResolved, r.txInInfoResolved)
    );
  },
};

/**
 * {@link Json} instance for {@link TxInInfo}
 */
export const jsonTxInInfo: Json<TxInInfo> = {
  toJson: (txininfo) => {
    return {
      output: V2Tx.jsonTxOut.toJson(txininfo.txInInfoResolved),
      reference: V1Tx.jsonTxOutRef.toJson(txininfo.txInInfoOutRef),
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
      fields: [
        0n,
        [
          V1Tx.isPlutusDataTxOutRef.toData(txininfo.txInInfoOutRef),
          V2Tx.isPlutusDataTxOut.toData(txininfo.txInInfoResolved),
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

/**
 * A pending transaction. This is the view as seen by validator scripts, so
 * some details are stripped out.
 *
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.16.0.0/plutus-ledger-api/src/PlutusLedgerApi/V2/Contexts.hs#L71-L87}
 */
export type TxInfo = {
  txInfoInputs: TxInInfo[];
  txInfoReferenceInputs: TxInInfo[];
  txInfoOutputs: TxOut[];
  txInfoFee: Value;
  txInfoMint: Value;
  txInfoDCert: DCert[];
  txInfoWdrl: Map<StakingCredential, Integer>;
  txInfoValidRange: POSIXTimeRange;
  txInfoSignatories: PubKeyHash[];
  txInfoRedeemers: Map<ScriptPurpose, Redeemer>;
  txInfoData: Map<DatumHash, Datum>;
  txInfoId: TxId;
};

/**
 * {@link Eq} instance for {@link TxInfo}
 */
export const eqTxInfo: Eq<TxInfo> = {
  eq: (l, r) => {
    return (
      Prelude.eqList(eqTxInInfo).eq(l.txInfoInputs, r.txInfoInputs) &&
      Prelude.eqList(eqTxInInfo).eq(
        l.txInfoReferenceInputs,
        r.txInfoReferenceInputs,
      ) &&
      Prelude.eqList(V2Tx.eqTxOut).eq(l.txInfoOutputs, r.txInfoOutputs) &&
      V1Value.eqValue.eq(l.txInfoFee, r.txInfoFee) &&
      V1Value.eqValue.eq(l.txInfoMint, r.txInfoMint) &&
      Prelude.eqList(V1DCert.eqDCert).eq(l.txInfoDCert, r.txInfoDCert) &&
      AssocMap.eqMap(V1Credential.eqStakingCredential, Prelude.eqInteger).eq(
        l.txInfoWdrl,
        r.txInfoWdrl,
      ) &&
      V1Time.eqPOSIXTimeRange.eq(l.txInfoValidRange, r.txInfoValidRange) &&
      Prelude.eqList(V1Crypto.eqPubKeyHash).eq(
        l.txInfoSignatories,
        r.txInfoSignatories,
      ) &&
      AssocMap.eqMap(V1Context.eqScriptPurpose, V1Scripts.eqRedeemer).eq(
        l.txInfoRedeemers,
        r.txInfoRedeemers,
      ) &&
      AssocMap.eqMap(V1Scripts.eqDatumHash, V1Scripts.eqDatum).eq(
        l.txInfoData,
        r.txInfoData,
      ) &&
      V1Tx.eqTxId.eq(l.txInfoId, r.txInfoId)
    );
  },
  neq: (l, r) => {
    return (
      Prelude.eqList(eqTxInInfo).neq(l.txInfoInputs, r.txInfoInputs) ||
      Prelude.eqList(eqTxInInfo).neq(
        l.txInfoReferenceInputs,
        r.txInfoReferenceInputs,
      ) ||
      Prelude.eqList(V2Tx.eqTxOut).neq(l.txInfoOutputs, r.txInfoOutputs) ||
      V1Value.eqValue.neq(l.txInfoFee, r.txInfoFee) ||
      V1Value.eqValue.neq(l.txInfoMint, r.txInfoMint) ||
      Prelude.eqList(V1DCert.eqDCert).neq(l.txInfoDCert, r.txInfoDCert) ||
      AssocMap.eqMap(V1Credential.eqStakingCredential, Prelude.eqInteger).neq(
        l.txInfoWdrl,
        r.txInfoWdrl,
      ) ||
      V1Time.eqPOSIXTimeRange.neq(l.txInfoValidRange, r.txInfoValidRange) ||
      Prelude.eqList(V1Crypto.eqPubKeyHash).neq(
        l.txInfoSignatories,
        r.txInfoSignatories,
      ) ||
      AssocMap.eqMap(V1Context.eqScriptPurpose, V1Scripts.eqRedeemer).neq(
        l.txInfoRedeemers,
        r.txInfoRedeemers,
      ) ||
      AssocMap.eqMap(V1Scripts.eqDatumHash, V1Scripts.eqDatum).neq(
        l.txInfoData,
        r.txInfoData,
      ) ||
      V1Tx.eqTxId.neq(l.txInfoId, r.txInfoId)
    );
  },
};

/**
 * {@link Json} instance for {@link TxInfo}
 */
export const jsonTxInfo: Json<TxInfo> = {
  toJson: (txInfo) => {
    return {
      d_cert: Prelude.jsonList(V1DCert.jsonDCert).toJson(txInfo.txInfoDCert),
      datums: AssocMap.jsonMap(
        V1Scripts.jsonDatumHash,
        V1Scripts.jsonDatum,
      ).toJson(txInfo.txInfoData),
      fee: V1Value.jsonValue.toJson(txInfo.txInfoFee),
      id: V1Tx.jsonTxId.toJson(txInfo.txInfoId),
      inputs: Prelude.jsonList(jsonTxInInfo).toJson(txInfo.txInfoInputs),
      mint: V1Value.jsonValue.toJson(txInfo.txInfoMint),
      outputs: Prelude.jsonList(V2Tx.jsonTxOut).toJson(txInfo.txInfoOutputs),
      redeemers: AssocMap.jsonMap(
        V1Context.jsonScriptPurpose,
        V1Scripts.jsonRedeemer,
      ).toJson(txInfo.txInfoRedeemers),
      reference_inputs: Prelude.jsonList(jsonTxInInfo).toJson(
        txInfo.txInfoReferenceInputs,
      ),
      signatories: Prelude.jsonList(V1Crypto.jsonPubKeyHash).toJson(
        txInfo.txInfoSignatories,
      ),
      valid_range: V1Time.jsonPOSIXTimeRange.toJson(txInfo.txInfoValidRange),
      wdrl: AssocMap.jsonMap(
        V1Credential.jsonStakingCredential,
        Prelude.jsonInteger,
      ).toJson(txInfo.txInfoWdrl),
    };
  },
  fromJson: (value) => {
    const txInfoInputs = Prelude.caseFieldWithValue(
      "inputs",
      Prelude.jsonList(jsonTxInInfo).fromJson,
      value,
    );
    const txInfoReferenceInputs = Prelude.caseFieldWithValue(
      "reference_inputs",
      Prelude.jsonList(jsonTxInInfo).fromJson,
      value,
    );
    const txInfoOutputs = Prelude.caseFieldWithValue(
      "outputs",
      Prelude.jsonList(V2Tx.jsonTxOut).fromJson,
      value,
    );
    const txInfoFee = Prelude.caseFieldWithValue(
      "fee",
      V1Value.jsonValue.fromJson,
      value,
    );
    const txInfoMint = Prelude.caseFieldWithValue(
      "mint",
      V1Value.jsonValue.fromJson,
      value,
    );
    const txInfoDCert = Prelude.caseFieldWithValue(
      "d_cert",
      Prelude.jsonList(V1DCert.jsonDCert).fromJson,
      value,
    );
    const txInfoWdrl = Prelude.caseFieldWithValue(
      "wdrl",
      AssocMap.jsonMap(V1Credential.jsonStakingCredential, Prelude.jsonInteger)
        .fromJson,
      value,
    );
    const txInfoValidRange = Prelude.caseFieldWithValue(
      "valid_range",
      V1Time.jsonPOSIXTimeRange.fromJson,
      value,
    );
    const txInfoSignatories = Prelude.caseFieldWithValue(
      "signatories",
      Prelude.jsonList(V1Crypto.jsonPubKeyHash).fromJson,
      value,
    );
    const txInfoRedeemers = Prelude.caseFieldWithValue(
      "redeemers",
      AssocMap.jsonMap(V1Context.jsonScriptPurpose, V1Scripts.jsonRedeemer)
        .fromJson,
      value,
    );
    const txInfoData = Prelude.caseFieldWithValue(
      "datums",
      AssocMap.jsonMap(V1Scripts.jsonDatumHash, V1Scripts.jsonDatum).fromJson,
      value,
    );
    const txInfoId = Prelude.caseFieldWithValue(
      "id",
      V1Tx.jsonTxId.fromJson,
      value,
    );

    return {
      txInfoInputs,
      txInfoReferenceInputs,
      txInfoOutputs,
      txInfoFee,
      txInfoMint,
      txInfoDCert,
      txInfoWdrl,
      txInfoValidRange,
      txInfoSignatories,
      txInfoRedeemers,
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
      fields: [
        0n,
        [
          PreludeInstances.isPlutusDataList(isPlutusDataTxInInfo).toData(
            txInfo.txInfoInputs,
          ),
          PreludeInstances.isPlutusDataList(isPlutusDataTxInInfo).toData(
            txInfo.txInfoReferenceInputs,
          ),
          PreludeInstances.isPlutusDataList(V2Tx.isPlutusDataTxOut).toData(
            txInfo.txInfoOutputs,
          ),
          V1Value.isPlutusDataValue.toData(txInfo.txInfoFee),
          V1Value.isPlutusDataValue.toData(txInfo.txInfoMint),
          PreludeInstances.isPlutusDataList(V1DCert.isPlutusDataDCert).toData(
            txInfo.txInfoDCert,
          ),
          AssocMap.isPlutusDataMap(
            V1Credential.isPlutusDataStakingCredential,
            PreludeInstances.isPlutusDataInteger,
          ).toData(txInfo.txInfoWdrl),
          V1Time.isPlutusDataPOSIXTimeRange.toData(txInfo.txInfoValidRange),
          PreludeInstances.isPlutusDataList(
            V1Crypto.isPlutusDataPubKeyHash,
          ).toData(txInfo.txInfoSignatories),
          AssocMap.isPlutusDataMap(
            V1Context.isPlutusDataScriptPurpose,
            V1Scripts.isPlutusDataRedeemer,
          ).toData(txInfo.txInfoRedeemers),
          AssocMap.isPlutusDataMap(
            V1Scripts.isPlutusDataDatumHash,
            V1Scripts.isPlutusDataDatum,
          ).toData(txInfo.txInfoData),
          V1Tx.isPlutusDataTxId.toData(txInfo.txInfoId),
        ],
      ],
      name: "Constr",
    };
  },

  fromData: (plutusData) => {
    switch (plutusData.name) {
      case "Constr": {
        if (plutusData.fields[0] === 0n && plutusData.fields[1].length === 12) {
          const txInfoInputs = PreludeInstances.isPlutusDataList(
            isPlutusDataTxInInfo,
          ).fromData(plutusData.fields[1][0]!);
          const txInfoReferenceInputs = PreludeInstances.isPlutusDataList(
            isPlutusDataTxInInfo,
          ).fromData(plutusData.fields[1][1]!);
          const txInfoOutputs = PreludeInstances.isPlutusDataList(
            V2Tx.isPlutusDataTxOut,
          ).fromData(plutusData.fields[1][2]!);
          const txInfoFee = V1Value.isPlutusDataValue.fromData(
            plutusData.fields[1][3]!,
          );
          const txInfoMint = V1Value.isPlutusDataValue.fromData(
            plutusData.fields[1][4]!,
          );
          const txInfoDCert = PreludeInstances.isPlutusDataList(
            V1DCert.isPlutusDataDCert,
          ).fromData(plutusData.fields[1][5]!);
          const txInfoWdrl = AssocMap.isPlutusDataMap(
            V1Credential.isPlutusDataStakingCredential,
            PreludeInstances.isPlutusDataInteger,
          ).fromData(plutusData.fields[1][6]!);
          const txInfoValidRange = V1Time.isPlutusDataPOSIXTimeRange.fromData(
            plutusData.fields[1][7]!,
          );
          const txInfoSignatories = PreludeInstances.isPlutusDataList(
            V1Crypto.isPlutusDataPubKeyHash,
          ).fromData(plutusData.fields[1][8]!);
          const txInfoRedeemers = AssocMap.isPlutusDataMap(
            V1Context.isPlutusDataScriptPurpose,
            V1Scripts.isPlutusDataRedeemer,
          ).fromData(plutusData.fields[1][9]!);
          const txInfoData = AssocMap.isPlutusDataMap(
            V1Scripts.isPlutusDataDatumHash,
            V1Scripts.isPlutusDataDatum,
          ).fromData(plutusData.fields[1][10]!);
          const txInfoId = V1Tx.isPlutusDataTxId.fromData(
            plutusData.fields[1][11]!,
          );

          return {
            txInfoInputs,
            txInfoReferenceInputs,
            txInfoOutputs,
            txInfoFee,
            txInfoMint,
            txInfoDCert,
            txInfoWdrl,
            txInfoValidRange,
            txInfoSignatories,
            txInfoRedeemers,
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

/**
 * The context that the currently-executing script can access.
 *
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.16.0.0/plutus-ledger-api/src/PlutusLedgerApi/V2/Contexts.hs#L112-L115}
 */
export type ScriptContext = {
  scriptContextTxInfo: TxInfo;
  scriptContextPurpose: ScriptPurpose;
};

/**
 * {@link Eq} instance for {@link ScriptContext}
 */
export const eqScriptContext: Eq<ScriptContext> = {
  eq: (l, r) => {
    return (
      eqTxInfo.eq(l.scriptContextTxInfo, r.scriptContextTxInfo),
        V1Context.eqScriptPurpose.eq(
          l.scriptContextPurpose,
          r.scriptContextPurpose,
        )
    );
  },
  neq: (l, r) => {
    return (
      eqTxInfo.neq(l.scriptContextTxInfo, r.scriptContextTxInfo),
        V1Context.eqScriptPurpose.neq(
          l.scriptContextPurpose,
          r.scriptContextPurpose,
        )
    );
  },
};

/**
 * {@link Json} instance for {@link ScriptContext}
 */
export const jsonScriptContext: Json<ScriptContext> = {
  toJson: (scriptContext) => {
    return {
      purpose: V1Context.jsonScriptPurpose.toJson(
        scriptContext.scriptContextPurpose,
      ),
      tx_info: jsonTxInfo.toJson(scriptContext.scriptContextTxInfo),
    };
  },
  fromJson: (value) => {
    const scriptContextTxInfo = Prelude.caseFieldWithValue(
      "tx_info",
      jsonTxInfo.fromJson,
      value,
    );
    const scriptContextPurpose = Prelude.caseFieldWithValue(
      "purpose",
      V1Context.jsonScriptPurpose.fromJson,
      value,
    );

    return {
      scriptContextTxInfo,
      scriptContextPurpose,
    };
  },
};

/**
 * {@link IsPlutusData} instance for {@link ScriptContext}
 */
export const isPlutusDataScriptContext: IsPlutusData<ScriptContext> = {
  toData: (scriptContext) => {
    return {
      fields: [
        0n,
        [
          isPlutusDataTxInfo.toData(scriptContext.scriptContextTxInfo),
          V1Context.isPlutusDataScriptPurpose.toData(
            scriptContext.scriptContextPurpose,
          ),
        ],
      ],
      name: "Constr",
    };
  },

  fromData: (plutusData) => {
    switch (plutusData.name) {
      case "Constr": {
        if (plutusData.fields[0] === 0n && plutusData.fields[1].length === 2) {
          const scriptContextTxInfo = isPlutusDataTxInfo.fromData(
            plutusData.fields[1][0]!,
          );
          const scriptContextPurpose = V1Context.isPlutusDataScriptPurpose
            .fromData(
              plutusData.fields[1][1]!,
            );

          return {
            scriptContextTxInfo,
            scriptContextPurpose,
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
