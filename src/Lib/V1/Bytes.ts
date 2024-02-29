/**
 * @see {@link https://github.com/input-output-hk/plutus/blob/1.16.0.0/plutus-ledger-api/src/PlutusLedgerApi/V1/Bytes.hs}
 */
import * as Prelude from "prelude";
import { JsonError } from "prelude";
import { IsPlutusDataError } from "../PlutusData.js";
import * as LbHex from "../Hex.js";
import type { IsPlutusData } from "../PlutusData.js";
import type { Bytes, Eq, Json } from "prelude";

/**
 * {@link LedgerBytes}
 *
 * @see {@link https://github.com/input-output-hk/plutus/blob/1.16.0.0/plutus-ledger-api/src/PlutusLedgerApi/V1/Bytes.hs#L70-L74 }
 */
export type LedgerBytes = Bytes;

/**
 * {@link Eq} instance for {@link LedgerBytes}
 */
export const eqLedgerBytes: Eq<LedgerBytes> = Prelude.eqBytes;

/**
 * {@link Json} instance for {@link LedgerBytes}.
 *
 * @remarks
 * This encodes / decodes the bytes as a base16 (hexadecimal) string.
 */
export const jsonLedgerBytes: Json<LedgerBytes> = {
  toJson: (bytes) => LbHex.bytesToHex(bytes),
  fromJson: (value) => {
    if (typeof value === "string") {
      return LbHex.bytesFromHex(value);
    } else {
      throw new JsonError("JSON Value is not a string");
    }
  },
};

/**
 * {@link IsPlutusData} instance for {@link LedgerBytes}
 */
export const isPlutusDataLedgerBytes: IsPlutusData<LedgerBytes> = {
  toData: (bytes) => {
    return { fields: bytes, name: "Bytes" };
  },
  fromData: (plutusData) => {
    switch (plutusData.name) {
      case "Bytes":
        return plutusData.fields;
      default:
        throw new IsPlutusDataError("Expected bytes but got " + plutusData);
    }
  },
};
