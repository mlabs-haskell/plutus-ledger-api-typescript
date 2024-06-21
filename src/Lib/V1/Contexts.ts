/**
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.16.0.0/plutus-ledger-api/src/PlutusLedgerApi/V1/Contexts.hs}
 */

import { type Eq, type Integer, type Json, JsonError } from "prelude";
import * as Prelude from "prelude";
import * as PreludeInstances from "../Prelude/Instances.js";

import type { TxId, TxOut, TxOutRef } from "./Tx.js";
import * as LbTx from "./Tx.js";

import type { CurrencySymbol, Value } from "./Value.js";
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
    return (
      LbTx.eqTxOutRef.eq(l.txInInfoOutRef, r.txInInfoOutRef) &&
      LbTx.eqTxOut.eq(l.txInInfoResolved, r.txInInfoResolved)
    );
  },
  neq: (l, r) => {
    return (
      LbTx.eqTxOutRef.neq(l.txInInfoOutRef, r.txInInfoOutRef) ||
      LbTx.eqTxOut.neq(l.txInInfoResolved, r.txInInfoResolved)
    );
  },
};

/**
 * {@link Json} instance for {@link TxInInfo}
 */
export const jsonTxInInfo: Json<TxInInfo> = {
  toJson: (txInInfo) => {
    return {
      output: LbTx.jsonTxOut.toJson(txInInfo.txInInfoResolved),
      reference: LbTx.jsonTxOutRef.toJson(txInInfo.txInInfoOutRef),
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
      fields: [
        0n,
        [
          LbTx.isPlutusDataTxOutRef.toData(txInInfo.txInInfoOutRef),
          LbTx.isPlutusDataTxOut.toData(txInInfo.txInInfoResolved),
        ],
      ],
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
    return (
      Prelude.eqList(eqTxInInfo).eq(l.txInfoInputs, r.txInfoInputs) &&
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
      Prelude.eqList(
        Prelude.eqPair(LbScripts.eqDatumHash, LbScripts.eqDatum),
      ).eq(l.txInfoData, r.txInfoData) &&
      LbTx.eqTxId.eq(l.txInfoId, r.txInfoId)
    );
  },
  neq: (l, r) => {
    return (
      Prelude.eqList(eqTxInInfo).neq(l.txInfoInputs, r.txInfoInputs) ||
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
      Prelude.eqList(
        Prelude.eqPair(LbScripts.eqDatumHash, LbScripts.eqDatum),
      ).neq(l.txInfoData, r.txInfoData) ||
      LbTx.eqTxId.neq(l.txInfoId, r.txInfoId)
    );
  },
};

/**
 * {@link Json} instance for {@link TxInfo}
 */
export const jsonTxInfo: Json<TxInfo> = {
  toJson: (txInfo) => {
    return {
      d_cert: Prelude.jsonList(LbDCert.jsonDCert).toJson(txInfo.txInfoDCert),
      datums: Prelude.jsonList(
        Prelude.jsonPair(LbScripts.jsonDatumHash, LbScripts.jsonDatum),
      ).toJson(txInfo.txInfoData),
      fee: LbValue.jsonValue.toJson(txInfo.txInfoFee),
      id: LbTx.jsonTxId.toJson(txInfo.txInfoId),
      inputs: Prelude.jsonList(jsonTxInInfo).toJson(txInfo.txInfoInputs),
      mint: LbValue.jsonValue.toJson(txInfo.txInfoMint),
      outputs: Prelude.jsonList(LbTx.jsonTxOut).toJson(txInfo.txInfoOutputs),
      signatories: Prelude.jsonList(LbCrypto.jsonPubKeyHash).toJson(
        txInfo.txInfoSignatories,
      ),
      valid_range: LbTime.jsonPOSIXTimeRange.toJson(txInfo.txInfoValidRange),
      wdrl: Prelude.jsonList(
        Prelude.jsonPair(
          LbCredential.jsonStakingCredential,
          Prelude.jsonInteger,
        ),
      ).toJson(txInfo.txInfoWdrl),
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
      fields: [
        0n,
        [
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
          PreludeInstances.isPlutusDataList(
            LbCrypto.isPlutusDataPubKeyHash,
          ).toData(txInfo.txInfoSignatories),
          PreludeInstances.isPlutusDataList(
            PreludeInstances.isPlutusDataPairWithTag(
              LbScripts.isPlutusDataDatumHash,
              LbScripts.isPlutusDataDatum,
            ),
          ).toData(txInfo.txInfoData),
          LbTx.isPlutusDataTxId.toData(txInfo.txInfoId),
        ],
      ],
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

/**
 * {@link ScriptPurpose} Purpose of the script that is currently running
 *
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.16.0.0/plutus-ledger-api/src/PlutusLedgerApi/V1/Contexts.hs#L79-L84 }
 */
export type ScriptPurpose =
  | { name: "Minting"; fields: CurrencySymbol }
  | { name: "Spending"; fields: TxOutRef }
  | { name: "Rewarding"; fields: StakingCredential }
  | { name: "Certifying"; fields: DCert };

/**
 * {@link Eq} instance for {@link ScriptPurpose}
 */
export const eqScriptPurpose: Eq<ScriptPurpose> = {
  eq: (l, r) => {
    if (l.name === "Minting" && r.name === "Minting") {
      return LbValue.eqCurrencySymbol.eq(l.fields, r.fields);
    } else if (l.name === "Spending" && r.name === "Spending") {
      return LbTx.eqTxOutRef.eq(l.fields, r.fields);
    } else if (l.name === "Rewarding" && r.name === "Rewarding") {
      return LbCredential.eqStakingCredential.eq(l.fields, r.fields);
    } else if (l.name === "Certifying" && r.name === "Certifying") {
      return LbDCert.eqDCert.eq(l.fields, r.fields);
    } else {
      return false;
    }
  },
  neq: (l, r) => {
    if (l.name === "Minting" && r.name === "Minting") {
      return LbValue.eqCurrencySymbol.neq(l.fields, r.fields);
    } else if (l.name === "Spending" && r.name === "Spending") {
      return LbTx.eqTxOutRef.neq(l.fields, r.fields);
    } else if (l.name === "Rewarding" && r.name === "Rewarding") {
      return LbCredential.eqStakingCredential.neq(l.fields, r.fields);
    } else if (l.name === "Certifying" && r.name === "Certifying") {
      return LbDCert.eqDCert.neq(l.fields, r.fields);
    } else {
      return true;
    }
  },
};

/**
 * {@link Json} instance for {@link ScriptPurpose}
 */
export const jsonScriptPurpose: Json<ScriptPurpose> = {
  toJson: (scriptPurpose) => {
    switch (scriptPurpose.name) {
      case "Minting":
        return Prelude.jsonConstructor(scriptPurpose.name, [
          LbValue.jsonCurrencySymbol.toJson(scriptPurpose.fields),
        ]);
      case "Spending":
        return Prelude.jsonConstructor(scriptPurpose.name, [
          LbTx.jsonTxOutRef.toJson(scriptPurpose.fields),
        ]);
      case "Rewarding":
        return Prelude.jsonConstructor(scriptPurpose.name, [
          LbCredential.jsonStakingCredential.toJson(scriptPurpose.fields),
        ]);
      case "Certifying":
        return Prelude.jsonConstructor(scriptPurpose.name, [
          LbDCert.jsonDCert.toJson(scriptPurpose.fields),
        ]);
    }
  },
  fromJson: (value) => {
    return Prelude.caseJsonConstructor<ScriptPurpose>(
      "Plutus,V1.ScriptPurpose",
      {
        Minting: (ctorFields) => {
          if (ctorFields.length !== 1) {
            throw new JsonError("Expected one field");
          }
          return {
            fields: LbValue.jsonCurrencySymbol.fromJson(ctorFields[0]!),
            name: "Minting",
          };
        },
        Spending: (ctorFields) => {
          if (ctorFields.length !== 1) {
            throw new JsonError("Expected one field");
          }
          return {
            fields: LbTx.jsonTxOutRef.fromJson(ctorFields[0]!),
            name: "Spending",
          };
        },
        Rewarding: (ctorFields) => {
          if (ctorFields.length !== 1) {
            throw new JsonError("Expected one field");
          }
          return {
            fields: LbCredential.jsonStakingCredential.fromJson(ctorFields[0]!),
            name: "Rewarding",
          };
        },
        Certifying: (ctorFields) => {
          if (ctorFields.length !== 1) {
            throw new JsonError("Expected one field");
          }
          return {
            fields: LbDCert.jsonDCert.fromJson(ctorFields[0]!),
            name: "Certifying",
          };
        },
      },
      value,
    );
  },
};

/**
 * {@link IsPlutusData} instance for {@link ScriptPurpose}
 */
export const isPlutusDataScriptPurpose: IsPlutusData<ScriptPurpose> = {
  toData: (scriptPurpose) => {
    switch (scriptPurpose.name) {
      case "Minting":
        return {
          fields: [
            0n,
            [LbValue.isPlutusDataCurrencySymbol.toData(scriptPurpose.fields)],
          ],
          name: "Constr",
        };
      case "Spending":
        return {
          fields: [
            1n,
            [LbTx.isPlutusDataTxOutRef.toData(scriptPurpose.fields)],
          ],
          name: "Constr",
        };
      case "Rewarding":
        return {
          fields: [
            2n,
            [
              LbCredential.isPlutusDataStakingCredential.toData(
                scriptPurpose.fields,
              ),
            ],
          ],
          name: "Constr",
        };
      case "Certifying":
        return {
          fields: [
            3n,
            [LbDCert.isPlutusDataDCert.toData(scriptPurpose.fields)],
          ],
          name: "Constr",
        };
    }
  },

  fromData: (plutusData) => {
    switch (plutusData.name) {
      case "Constr": {
        if (
          plutusData.fields.length === 2 &&
          plutusData.fields[1].length === 1
        ) {
          const field = plutusData.fields[1][0]!;

          switch (plutusData.fields[0]) {
            case 0n:
              return {
                fields: LbValue.isPlutusDataCurrencySymbol.fromData(field),
                name: "Minting",
              };
            case 1n:
              return {
                fields: LbTx.isPlutusDataTxOutRef.fromData(field),
                name: "Spending",
              };
            case 2n:
              return {
                fields: LbCredential.isPlutusDataStakingCredential.fromData(
                  field,
                ),
                name: "Rewarding",
              };
            case 3n:
              return {
                fields: LbDCert.isPlutusDataDCert.fromData(field),
                name: "Certifying",
              };
          }
        }
      }
    }
    throw new IsPlutusDataError("Unexpected data");
  },
};

/**
 * The context that the currently-executing script can access.
 *
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.16.0.0/plutus-ledger-api/src/PlutusLedgerApi/V1/Contexts.hs#L130-L134 }
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
        eqScriptPurpose.eq(l.scriptContextPurpose, r.scriptContextPurpose)
    );
  },
  neq: (l, r) => {
    return (
      eqTxInfo.neq(l.scriptContextTxInfo, r.scriptContextTxInfo),
        eqScriptPurpose.neq(l.scriptContextPurpose, r.scriptContextPurpose)
    );
  },
};

/**
 * {@link Json} instance for {@link ScriptContext}
 */
export const jsonScriptContext: Json<ScriptContext> = {
  toJson: (scriptContext) => {
    return {
      tx_info: jsonTxInfo.toJson(scriptContext.scriptContextTxInfo),
      purpose: jsonScriptPurpose.toJson(scriptContext.scriptContextPurpose),
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
      jsonScriptPurpose.fromJson,
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
          isPlutusDataScriptPurpose.toData(scriptContext.scriptContextPurpose),
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
          const scriptContextPurpose = isPlutusDataScriptPurpose.fromData(
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
