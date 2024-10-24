/**
 * TypeScript implementation for {@link https://github.com/IntersectMBO/plutus/blob/1.36.0.0/plutus-tx/src/PlutusTx/Ratio.hs}
 *
 * @module plutus-ledger-api/Ratio.js
 */
import {
  caseFieldWithValue,
  type Eq,
  eqInteger,
  type Integer,
  type Json,
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
    return {
      numerator: jsonInteger.toJson(rational.numerator),
      denominator: jsonInteger.toJson(rational.denominator),
    };
  },
  fromJson: (value) => {
    const numerator = caseFieldWithValue(
      "numerator",
      jsonInteger.fromJson,
      value,
    );
    const denominator = caseFieldWithValue(
      "denominator",
      jsonInteger.fromJson,
      value,
    );

    return {
      numerator,
      denominator,
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
