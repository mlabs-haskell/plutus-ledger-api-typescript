/**
 * TypeScript implementation for {@link https://github.com/IntersectMBO/plutus/blob/1.36.0.0/plutus-tx/src/PlutusTx/Ratio.hs}
 *
 * @module plutus-ledger-api/Ratio.js
 */
import {
  type Eq,
  eqInteger,
  type Integer,
  isJsonArray,
  type Json,
  JsonError,
  jsonInteger,
} from "prelude";
import type { IsPlutusData } from "./PlutusData.js";
import { isPlutusDataInteger, isPlutusDataPairWithTag } from "./V1.js";

// TODO(chfanghr): Maintain the invariants

/**
 * {@link Rational} represents an arbitrary-precision ratio.
 *
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.36.0.0/plutus-tx/src/PlutusTx/Ratio.hs#L69}
 */
export type Rational = {
  numerator: Integer;
  denominator: Integer;
};

/**
 * {@link Eq} instance for {@link Rational}
 */
export const eqRational: Eq<Rational> = {
  eq: (l, r) => {
    return (
      eqInteger.eq(l.numerator, r.numerator) &&
      eqInteger.eq(l.denominator, r.denominator)
    );
  },

  neq: (l, r) => {
    return (
      eqInteger.neq(l.numerator, r.numerator) ||
      eqInteger.neq(l.denominator, r.denominator)
    );
  },
};

/**
 * {@link Json} instance for {@link Rational}
 */
export const jsonRational: Json<Rational> = {
  toJson: (rational) => {
    return [
      jsonInteger.toJson(rational.numerator),
      jsonInteger.toJson(rational.denominator),
    ];
  },
  fromJson: (value) => {
    if (!isJsonArray(value)) {
      throw new JsonError("JSON Value is not an array");
    }

    if (value.length !== 2) {
      throw new JsonError("JSON Array length must be exactly 2");
    }

    return {
      numerator: jsonInteger.fromJson(value[0]!),
      denominator: jsonInteger.fromJson(value[1]!),
    };
  },
};

/**
 * {@link IsPlutusData} instance for {@link Rational}
 */
export const isPlutusDataRational: IsPlutusData<Rational> = {
  toData: (rational) => {
    return isPlutusDataPairWithTag(
      isPlutusDataInteger,
      isPlutusDataInteger,
    ).toData([rational.numerator, rational.denominator]);
  },
  fromData: (value) => {
    const [numerator, denominator] = isPlutusDataPairWithTag(
      isPlutusDataInteger,
      isPlutusDataInteger,
    ).fromData(value);

    return {
      numerator,
      denominator,
    };
  },
};
