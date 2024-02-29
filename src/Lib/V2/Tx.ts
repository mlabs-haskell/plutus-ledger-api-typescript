/**
 * @see {@link  https://github.com/input-output-hk/plutus/blob/1.16.0.0/plutus-ledger-api/src/PlutusLedgerApi/V2/Tx.hs}
 */

import type { Datum, DatumHash, ScriptHash } from "../V1/Scripts.js";
import * as LbScripts from "../V1/Scripts.js";
import type { Eq, Json, Maybe } from "prelude";
import * as Prelude from "prelude";
import { JsonError } from "prelude";
import type { IsPlutusData } from "../PlutusData.js";
import { IsPlutusDataError } from "../PlutusData.js";
import * as PreludeInstances from "../Prelude/Instances.js";
import type { Address } from "../V1/Address.js";
import * as LbAddress from "../V1/Address.js";
import type { Value } from "../V1/Value.js";
import * as LbValue from "../V1/Value.js";

/**
 * {@link OutputDatum} the datum attached to an output.
 *
 * @see {@link https://github.com/input-output-hk/plutus/blob/1.16.0.0/plutus-ledger-api/src/PlutusLedgerApi/V2/Tx.hs#L51-L54}
 */
export type OutputDatum =
  | { name: "NoOutputDatum" }
  | { name: "OutputDatumHash"; fields: DatumHash }
  | { name: "OutputDatum"; fields: Datum };

/**
 * {@link Eq} instance for {@link OutputDatum}
 */
export const eqOutputDatum: Eq<OutputDatum> = {
  eq: (l, r) => {
    if (l.name === "NoOutputDatum" && r.name === "NoOutputDatum") {
      return true;
    } else if (l.name === "OutputDatumHash" && r.name === "OutputDatumHash") {
      return LbScripts.eqDatumHash.eq(l.fields, r.fields);
    } else if (l.name === "OutputDatum" && r.name === "OutputDatum") {
      return LbScripts.eqDatum.eq(l.fields, r.fields);
    } else {
      return false;
    }
  },
  neq: (l, r) => {
    if (l.name === "NoOutputDatum" && r.name === "NoOutputDatum") {
      return false;
    } else if (l.name === "OutputDatumHash" && r.name === "OutputDatumHash") {
      return LbScripts.eqDatumHash.neq(l.fields, r.fields);
    } else if (l.name === "OutputDatum" && r.name === "OutputDatum") {
      return LbScripts.eqDatum.neq(l.fields, r.fields);
    } else {
      return true;
    }
  },
};

/**
 * {@link Json} instance for {@link OutputDatum}
 */
export const jsonOutputDatum: Json<OutputDatum> = {
  toJson: (outputDatum) => {
    switch (outputDatum.name) {
      case "NoOutputDatum":
        return Prelude.jsonConstructor(outputDatum.name, []);
      case "OutputDatumHash":
        return Prelude.jsonConstructor(outputDatum.name, [
          LbScripts.jsonDatumHash.toJson(outputDatum.fields),
        ]);
      case "OutputDatum":
        return Prelude.jsonConstructor(outputDatum.name, [
          LbScripts.jsonDatum.toJson(outputDatum.fields),
        ]);
    }
  },
  fromJson: (value) => {
    return Prelude.caseJsonConstructor<OutputDatum>("Plutus.V2.OutputDatum", {
      "NoOutputDatum": (ctorfields) => {
        if (ctorfields.length !== 0) {
          throw new JsonError("Expected 0 fields");
        }
        return { name: "NoOutputDatum" };
      },
      "OutputDatumHash": (ctorfields) => {
        if (ctorfields.length !== 1) {
          throw new JsonError("Expected 1 field");
        }
        return {
          name: "OutputDatumHash",
          fields: LbScripts.jsonDatumHash.fromJson(ctorfields[0]!),
        };
      },
      "OutputDatum": (ctorfields) => {
        if (ctorfields.length !== 1) {
          throw new JsonError("Expected 1 field");
        }
        return {
          name: "OutputDatum",
          fields: LbScripts.jsonDatum.fromJson(ctorfields[0]!),
        };
      },
    }, value);
  },
};

/**
 * {@link IsPlutusData} instance for {@link OutputDatum}
 */
export const isPlutusDataOutputDatum: IsPlutusData<OutputDatum> = {
  toData: (outputDatum) => {
    switch (outputDatum.name) {
      case "NoOutputDatum":
        return { fields: [0n, []], name: "Constr" };
      case "OutputDatumHash":
        return {
          fields: [1n, [
            LbScripts.isPlutusDataDatumHash.toData(outputDatum.fields),
          ]],
          name: "Constr",
        };
      case "OutputDatum":
        return {
          fields: [2n, [
            LbScripts.isPlutusDataDatum.toData(outputDatum.fields),
          ]],
          name: "Constr",
        };
    }
  },

  fromData: (plutusData) => {
    switch (plutusData.name) {
      case "Constr":
        if (plutusData.fields[0] === 0n && plutusData.fields[1].length === 0) {
          return { name: "NoOutputDatum" };
        } else if (
          plutusData.fields[0] === 1n && plutusData.fields[1].length === 1
        ) {
          return {
            fields: LbScripts.isPlutusDataDatumHash.fromData(
              plutusData.fields[1][0]!,
            ),
            name: "OutputDatumHash",
          };
        } else if (
          plutusData.fields[0] === 2n && plutusData.fields[1].length === 1
        ) {
          return {
            fields: LbScripts.isPlutusDataDatum.fromData(
              plutusData.fields[1][0]!,
            ),
            name: "OutputDatum",
          };
        }
        break;
      default:
        break;
    }
    throw new IsPlutusDataError("Unexpected data");
  },
};

/**
 * {@link TxOut} a transaction output.
 *
 * @see {@link https://github.com/input-output-hk/plutus/blob/1.16.0.0/plutus-ledger-api/src/PlutusLedgerApi/V2/Tx.hs#L68-L77}
 */
export type TxOut = {
  txOutAddress: Address;
  txOutValue: Value;
  txOutDatum: OutputDatum;
  txOutReferenceScript: Maybe<ScriptHash>;
};

/**
 * {@link Eq} instance for {@link TxOut}
 */
export const eqTxOut: Eq<TxOut> = {
  eq: (l, r) => {
    return LbAddress.eqAddress.eq(l.txOutAddress, r.txOutAddress) &&
      LbValue.eqValue.eq(l.txOutValue, r.txOutValue) &&
      eqOutputDatum.eq(l.txOutDatum, r.txOutDatum) &&
      Prelude.eqMaybe(LbScripts.eqScriptHash).eq(
        l.txOutReferenceScript,
        r.txOutReferenceScript,
      );
  },
  neq: (l, r) => {
    return LbAddress.eqAddress.neq(l.txOutAddress, r.txOutAddress) ||
      LbValue.eqValue.neq(l.txOutValue, r.txOutValue) ||
      eqOutputDatum.neq(l.txOutDatum, r.txOutDatum) ||
      Prelude.eqMaybe(LbScripts.eqScriptHash).neq(
        l.txOutReferenceScript,
        r.txOutReferenceScript,
      );
  },
};

/**
 * {@link Json} instance for {@link TxOut}
 */
export const jsonTxOut: Json<TxOut> = {
  toJson: (txout) => {
    return {
      "address": LbAddress.jsonAddress.toJson(txout.txOutAddress),
      "datum": jsonOutputDatum.toJson(txout.txOutDatum),
      "reference_script": Prelude.jsonMaybe(LbScripts.jsonScriptHash).toJson(
        txout.txOutReferenceScript,
      ),
      "value": LbValue.jsonValue.toJson(txout.txOutValue),
    };
  },
  fromJson: (value) => {
    const address = Prelude.caseFieldWithValue(
      "address",
      LbAddress.jsonAddress.fromJson,
      value,
    );
    const ovalue = Prelude.caseFieldWithValue(
      "value",
      LbValue.jsonValue.fromJson,
      value,
    );
    const outputdatum = Prelude.caseFieldWithValue(
      "datum",
      jsonOutputDatum.fromJson,
      value,
    );
    const refscript = Prelude.caseFieldWithValue(
      "reference_script",
      Prelude.jsonMaybe(LbScripts.jsonScriptHash).fromJson,
      value,
    );

    return {
      txOutAddress: address,
      txOutValue: ovalue,
      txOutDatum: outputdatum,
      txOutReferenceScript: refscript,
    };
  },
};

/**
 * {@link IsPlutusData} instance for {@link TxOut}
 */
export const isPlutusDataTxOut: IsPlutusData<TxOut> = {
  toData: (txout) => {
    return {
      fields: [0n, [
        LbAddress.isPlutusDataAddress.toData(txout.txOutAddress),
        LbValue.isPlutusDataValue.toData(txout.txOutValue),
        isPlutusDataOutputDatum.toData(txout.txOutDatum),
        PreludeInstances.isPlutusDataMaybe(LbScripts.isPlutusDataScriptHash)
          .toData(
            txout.txOutReferenceScript,
          ),
      ]],
      name: "Constr",
    };
  },

  fromData: (plutusData) => {
    switch (plutusData.name) {
      case "Constr":
        if (plutusData.fields[0] === 0n && plutusData.fields[1].length === 4) {
          return {
            txOutAddress: LbAddress.isPlutusDataAddress.fromData(
              plutusData.fields[1][0]!,
            ),
            txOutValue: LbValue.isPlutusDataValue.fromData(
              plutusData.fields[1][1]!,
            ),
            txOutDatum: isPlutusDataOutputDatum.fromData(
              plutusData.fields[1][2]!,
            ),
            txOutReferenceScript: PreludeInstances.isPlutusDataMaybe(
              LbScripts.isPlutusDataScriptHash,
            ).fromData(plutusData.fields[1][3]!),
          };
        }
        break;
      default:
        break;
    }
    throw new IsPlutusDataError("Unexpected data");
  },
};
