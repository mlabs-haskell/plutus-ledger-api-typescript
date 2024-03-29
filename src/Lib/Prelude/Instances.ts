/**
 * {@link IsPlutusData} instances for Prelude types.
 *
 * @module plutus-ledger-api/Prelude/Instances.js
 */
import { IsPlutusDataError } from "../PlutusData.js";
import type { IsPlutusData } from "../PlutusData.js";

import type { Bool, Either, Integer, List, Maybe, Pair } from "prelude";

/**
 * {@link IsPlutusData} instance for {@link Bool}
 */
export const isPlutusDataBool: IsPlutusData<Bool> = {
  toData: (arg) => {
    if (arg) {
      return { fields: [1n, []], name: "Constr" };
    } else {
      return { fields: [0n, []], name: "Constr" };
    }
  },

  fromData: (plutusData) => {
    switch (plutusData.name) {
      case "Constr": {
        if (plutusData.fields[0] === 0n && plutusData.fields[1].length === 0) {
          return false;
        } else if (
          plutusData.fields[0] === 1n && plutusData.fields[1].length === 0
        ) {
          return true;
        } else {
          throw new IsPlutusDataError("Malformed Constr but got " + plutusData);
        }
      }
      default:
        throw new IsPlutusDataError("Expected Constr but got " + plutusData);
    }
  },
};

/**
 * {@link IsPlutusData} instance for {@link Integer}
 */
export const isPlutusDataInteger: IsPlutusData<Integer> = {
  toData: (arg) => {
    return { fields: arg, name: "Integer" };
  },

  fromData: (plutusData) => {
    switch (plutusData.name) {
      case "Integer":
        return plutusData.fields;
      default:
        throw new IsPlutusDataError("Expected Integer but got " + plutusData);
    }
  },
};

/**
 * {@link IsPlutusData} instance for {@link Maybe}
 */
export function isPlutusDataMaybe<A>(
  dict: IsPlutusData<A>,
): IsPlutusData<Maybe<A>> {
  return {
    toData: (arg) => {
      if (arg.name === "Nothing") {
        return { fields: [1n, []], name: "Constr" };
      } else {
        return { fields: [0n, [dict.toData(arg.fields)]], name: "Constr" };
      }
    },

    fromData: (plutusData) => {
      switch (plutusData.name) {
        case "Constr":
          if (plutusData.fields[0] == 1n) {
            return { name: "Nothing" };
          } else if (plutusData.fields[0] == 0n) {
            if (plutusData.fields[1].length !== 1) {
              throw new IsPlutusDataError("Malformed Constr" + plutusData);
            }
            return {
              fields: dict.fromData(plutusData.fields[1][0]!),
              name: "Just",
            };
          } else {
            throw new IsPlutusDataError("Malformed Constr" + plutusData);
          }
        default:
          throw new IsPlutusDataError("Expected Constr but got " + plutusData);
      }
    },
  };
}

/**
 * {@link IsPlutusData} instance for {@link List}
 */
export function isPlutusDataList<A>(
  dict: IsPlutusData<A>,
): IsPlutusData<List<A>> {
  return {
    toData: (arg) => {
      return { fields: arg.map(dict.toData), name: "List" };
    },
    fromData: (plutusData) => {
      switch (plutusData.name) {
        case "List":
          return plutusData.fields.map(dict.fromData);
        default:
          throw new IsPlutusDataError("Expected List but got " + plutusData);
      }
    },
  };
}

/**
 * {@link IsPlutusData} instance for {@link Either}
 */
export function isPlutusDataEither<A, B>(
  dictA: IsPlutusData<A>,
  dictB: IsPlutusData<B>,
): IsPlutusData<Either<A, B>> {
  return {
    toData: (arg) => {
      switch (arg.name) {
        case "Left":
          return { fields: [0n, [dictA.toData(arg.fields)]], name: "Constr" };
        case "Right":
          return { fields: [1n, [dictB.toData(arg.fields)]], name: "Constr" };
      }
    },

    fromData: (plutusData) => {
      switch (plutusData.name) {
        case "Constr":
          if (
            plutusData.fields[0] === 0n && plutusData.fields[1].length === 1
          ) {
            return {
              name: "Left",
              fields: dictA.fromData(plutusData.fields[1][0]!),
            };
          } else if (
            plutusData.fields[0] === 1n && plutusData.fields[1].length === 1
          ) {
            return {
              name: "Right",
              fields: dictB.fromData(plutusData.fields[1][0]!),
            };
          } else {
            throw new IsPlutusDataError(
              "Malformed Constr but got " + plutusData,
            );
          }
        default:
          throw new IsPlutusDataError("Expected Constr but got " + plutusData);
      }
    },
  };
}

/**
 * A {@link IsPlutusData} instance for {@link Pair} which encodes elements `A` and
 * `B` as `Constr 0 [A,B]` where we note the `0` "tag".
 *
 * @remarks many encodings of opaque types are encoded with the `0` tag
 */
export function isPlutusDataPairWithTag<A, B>(
  dictA: IsPlutusData<A>,
  dictB: IsPlutusData<B>,
): IsPlutusData<Pair<A, B>> {
  return {
    toData: (arg) => {
      return {
        fields: [0n, [dictA.toData(arg[0]), dictB.toData(arg[1])]],
        name: "Constr",
      };
    },

    fromData: (plutusData) => {
      switch (plutusData.name) {
        case "Constr":
          if (
            plutusData.fields[0] === 0n && plutusData.fields[1].length === 2
          ) {
            return [
              dictA.fromData(plutusData.fields[1][0]!),
              dictB.fromData(plutusData.fields[1][1]!),
            ];
          } else {
            throw new IsPlutusDataError(
              "Malformed Constr but got " + plutusData,
            );
          }
        default:
          throw new IsPlutusDataError("Expected Constr but got " + plutusData);
      }
    },
  };
}

/**
 * A {@link IsPlutusData} instance for {@link Pair} which encodes elements `A` and
 * `B` as just `[A,B]`.
 */
export function isPlutusDataPairWithoutTag<A, B>(
  dictA: IsPlutusData<A>,
  dictB: IsPlutusData<B>,
): IsPlutusData<Pair<A, B>> {
  return {
    toData: (arg) => {
      return {
        fields: [dictA.toData(arg[0]), dictB.toData(arg[1])],
        name: "List",
      };
    },
    fromData: (plutusData) => {
      switch (plutusData.name) {
        case "List":
          if (plutusData.fields.length === 2) {
            return [
              dictA.fromData(plutusData.fields[0]!),
              dictB.fromData(plutusData.fields[1]!),
            ];
          }
          break;
        default:
          break;
      }
      throw new IsPlutusDataError(
        `Expected List of size 2 but got ${plutusData}`,
      );
    },
  };
}
