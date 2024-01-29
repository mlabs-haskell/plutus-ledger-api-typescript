import type { Bytes, Eq, Integer, Json, List } from "prelude";
import { JsonError } from "prelude";
import * as Prelude from "prelude";
import * as LbHex from "../Hex.js";

/**
 * {@link PlutusData} is a generic "data" type.
 *
 * @see {@link https://github.com/input-output-hk/plutus/blob/1.16.0.0/plutus-core/plutus-core/src/PlutusCore/Data.hs#L33-L48 | `Data`}
 */
export type PlutusData =
  | { name: "Constr"; fields: [Integer, List<PlutusData>] }
  | { name: "Map"; fields: List<[PlutusData, PlutusData]> }
  | { name: "List"; fields: List<PlutusData> }
  | { name: "Bytes"; fields: Bytes }
  | { name: "Integer"; fields: Integer };

/**
 * {@link IsPlutusDataError} is thrown when `fromData` fails in the type class {@link IsPlutusData}
 */
export class IsPlutusDataError extends Error {
  constructor(message: string) {
    super(message);
  }
}

/**
 * {@link IsPlutusData} is a type class to translate to {@link PlutusData}
 */
export interface IsPlutusData<A> {
  readonly toData: (arg: Readonly<A>) => PlutusData;
  readonly fromData: (arg: Readonly<PlutusData>) => A;
}

/**
 * {@link Eq} instance for {@link PlutusData}
 */
export const eqPlutusData: Eq<PlutusData> = {
  eq: (l, r) => {
    if (
      l.name === "Constr" && r.name === "Constr" &&
      Prelude.eqInteger.eq(l.fields[0], r.fields[0])
    ) {
      return Prelude.eqList(eqPlutusData).eq(l.fields[1], r.fields[1]);
    } else if (l.name === "Map" && r.name === "Map") {
      return Prelude.eqList(Prelude.eqList(eqPlutusData)).eq(
        l.fields,
        r.fields,
      );
    } else if (l.name === "List" && r.name === "List") {
      return Prelude.eqList(eqPlutusData).eq(l.fields, r.fields);
    } else if (l.name === "Bytes" && r.name === "Bytes") {
      return Prelude.eqBytes.eq(l.fields, r.fields);
    } else if (l.name === "Integer" && r.name === "Integer") {
      return Prelude.eqInteger.eq(l.fields, r.fields);
    } else {
      return false;
    }
  },
  neq: (l, r) => {
    if (
      l.name === "Constr" && r.name === "Constr" &&
      Prelude.eqInteger.eq(l.fields[0], r.fields[0])
    ) {
      return Prelude.eqList(eqPlutusData).neq(l.fields[1], r.fields[1]);
    } else if (l.name === "Map" && r.name === "Map") {
      return Prelude.eqList(Prelude.eqList(eqPlutusData)).neq(
        l.fields,
        r.fields,
      );
    } else if (l.name === "List" && r.name === "List") {
      return Prelude.eqList(eqPlutusData).neq(l.fields, r.fields);
    } else if (l.name === "Bytes" && r.name === "Bytes") {
      return Prelude.eqBytes.neq(l.fields, r.fields);
    } else if (l.name === "Integer" && r.name === "Integer") {
      return Prelude.eqInteger.neq(l.fields, r.fields);
    } else {
      return true;
    }
  },
};

/**
 * {@link IsPlutusData} instance for {@link PlutusData}
 */
export const isPlutusDataPlutusData: IsPlutusData<PlutusData> = {
  toData: (arg) => arg,
  fromData: (arg) => arg,
};

/**
 * {@link Json} instance for {@link PlutusData}
 */
export const jsonPlutusData: Json<PlutusData> = {
  toJson: (plutusData) => {
    switch (plutusData.name) {
      case "Constr": {
        const fields = Prelude.jsonList(jsonPlutusData).toJson(
          plutusData.fields[1],
        );
        return Prelude.jsonConstructor(plutusData.name, [{
          fields: fields,
          index: Prelude.jsonInteger.toJson(plutusData.fields[0]),
        }]);
      }
      case "Map": {
        const fields = Prelude.jsonList(Prelude.jsonList(jsonPlutusData))
          .toJson(plutusData.fields);
        return Prelude.jsonConstructor(plutusData.name, [fields]);
      }
      case "List": {
        const fields = Prelude.jsonList(jsonPlutusData).toJson(
          plutusData.fields,
        );
        return Prelude.jsonConstructor(plutusData.name, [fields]);
      }
      case "Bytes": {
        return Prelude.jsonConstructor(plutusData.name, [
          LbHex.bytesToHex(plutusData.fields),
        ]);
      }
      case "Integer": {
        return Prelude.jsonConstructor(plutusData.name, [
          Prelude.jsonInteger.toJson(plutusData.fields),
        ]);
      }
    }
  },
  fromJson: (value) => {
    return Prelude.caseJsonConstructor<PlutusData>("PlutusData.PlutusData", {
      "Constr": (ctorFields) => {
        if (ctorFields.length === 1) {
          const indexAndFields = ctorFields[0]!;

          if (!Prelude.isJsonObject(indexAndFields)) {
            throw new JsonError(
              `Expected JSON object but got ${Prelude.stringify(value)}`,
            );
          }

          const indexValue = indexAndFields["index"];
          if (indexValue === undefined) {
            throw new JsonError(
              `Expected index field but got ${Prelude.stringify(value)}`,
            );
          }

          const index = Prelude.jsonInteger.fromJson(indexValue);

          const fieldsValue = indexAndFields["fields"];

          if (fieldsValue === undefined) {
            throw new JsonError(
              `Expected fields field but got ${Prelude.stringify(value)}`,
            );
          }

          const fields = Prelude.jsonList(jsonPlutusData).fromJson(
            fieldsValue,
          );

          return {
            name: "Constr",
            fields: [index, fields],
          };
        } else {
          throw new JsonError(
            `Expected JSON Array with 1 field but got ${
              Prelude.stringify(value)
            }`,
          );
        }
      },
      "Map": (ctorFields) => {
        if (ctorFields.length === 1) {
          const elemsValue = ctorFields[0]!;
          return {
            name: "Map",
            fields: Prelude.caseJsonArray("Map", (arr) => {
              return arr.map((kv) => {
                if (!(Prelude.isJsonArray(kv) && kv.length == 2)) {
                  throw new JsonError(
                    `Expected JSON Array with 2 elements but got ${
                      Prelude.stringify(kv)
                    }`,
                  );
                }
                return Prelude.caseJsonArray(
                  "KeyValue",
                  (arr) => {
                    return arr.map(jsonPlutusData.fromJson);
                  },
                  kv,
                ) as [PlutusData, PlutusData];
              });
            }, elemsValue),
          };
        } else {
          throw new JsonError(
            `Expected JSON Array with 1 element but got ${
              Prelude.stringify(value)
            }`,
          );
        }
      },
      "List": (ctorFields) => {
        if (ctorFields.length === 1) {
          const listValue = ctorFields[0]!;
          return {
            name: "List",
            fields: Prelude.caseJsonArray(
              "List",
              (arr) => {
                return arr.map(jsonPlutusData.fromJson);
              },
              listValue,
            ),
          };
        } else {
          throw new JsonError(
            `Expected JSON Array with 1 element but got ${
              Prelude.stringify(value)
            }`,
          );
        }
      },
      "Bytes": (ctorFields) => {
        if (ctorFields.length === 1) {
          const bytesValue = ctorFields[0]!;
          if (Prelude.isJsonString(bytesValue)) {
            return { name: "Bytes", fields: LbHex.bytesFromHex(bytesValue) };
          } else {
            throw new JsonError(`JSON Value is not a string`);
          }
        } else {
          throw new JsonError(
            `Expected JSON Array with 1 element but got ${
              Prelude.stringify(value)
            }`,
          );
        }
      },
      "Integer": (ctorFields) => {
        if (ctorFields.length === 1) {
          const integerValue = ctorFields[0]!;
          return {
            name: "Integer",
            fields: Prelude.jsonInteger.fromJson(integerValue),
          };
        } else {
          throw new JsonError(
            `Expected JSON Array with 1 element but got ${
              Prelude.stringify(value)
            }`,
          );
        }
      },
    }, value);
  },
};
