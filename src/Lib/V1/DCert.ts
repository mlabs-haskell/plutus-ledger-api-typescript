/**
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.16.0.0/plutus-ledger-api/src/PlutusLedgerApi/V1/DCert.hs}
 */

import * as LbCredential from "./Credential.js";
import type { StakingCredential } from "./Credential.js";
import * as LbCrypto from "./Crypto.js";
import type { PubKeyHash } from "./Crypto.js";
import type { Eq, Integer, Json } from "prelude";
import { JsonError } from "prelude";
import { IsPlutusDataError } from "../PlutusData.js";
import type { IsPlutusData } from "../PlutusData.js";
import * as Prelude from "prelude";
import * as PJson from "prelude/Json.js";
import * as PreludeInstances from "../Prelude/Instances.js";

/**
 * {@link DCert} a representation of the ledger DCert.
 *
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.16.0.0/plutus-ledger-api/src/PlutusLedgerApi/V1/DCert.hs#L22-L46}
 */
export type DCert =
  | { name: "DelegRegKey"; fields: StakingCredential }
  | { name: "DelegDeRegKey"; fields: StakingCredential }
  | { name: "DelegDelegate"; fields: [StakingCredential, PubKeyHash] }
  | { name: "PoolRegister"; fields: [PubKeyHash, PubKeyHash] }
  | { name: "PoolRetire"; fields: [PubKeyHash, Integer] }
  | { name: "Genesis" }
  | { name: "Mir" };

/**
 * {@link Eq} instance for {@link DCert}
 */
export const eqDCert: Eq<DCert> = {
  eq: (l, r) => {
    if (l.name === "DelegRegKey" && r.name === "DelegRegKey") {
      return LbCredential.eqStakingCredential.eq(l.fields, r.fields);
    } else if (
      l.name === "DelegDeRegKey" && r.name === "DelegDeRegKey"
    ) {
      return LbCredential.eqStakingCredential.eq(l.fields, r.fields);
    } else if (
      l.name === "DelegDelegate" && r.name === "DelegDelegate"
    ) {
      return LbCredential.eqStakingCredential.eq(l.fields[0], r.fields[0]) &&
        LbCrypto.eqPubKeyHash.eq(l.fields[1], r.fields[1]);
    } else if (
      l.name === "PoolRegister" && r.name === "PoolRegister"
    ) {
      return LbCrypto.eqPubKeyHash.eq(l.fields[0], r.fields[0]) &&
        LbCrypto.eqPubKeyHash.eq(l.fields[1], r.fields[1]);
    } else if (l.name === "PoolRetire" && r.name === "PoolRetire") {
      return LbCrypto.eqPubKeyHash.eq(l.fields[0], r.fields[0]) &&
        Prelude.eqInteger.eq(l.fields[1], r.fields[1]);
    } else if (l.name === "Genesis" && r.name === "Genesis") {
      return true;
    } else if (l.name === "Mir" && r.name === "Mir") {
      return true;
    } else {
      return false;
    }
  },
  neq: (l, r) => {
    if (l.name === "DelegRegKey" && r.name === "DelegRegKey") {
      return LbCredential.eqStakingCredential.neq(l.fields, r.fields);
    } else if (
      l.name === "DelegDeRegKey" && r.name === "DelegDeRegKey"
    ) {
      return LbCredential.eqStakingCredential.neq(l.fields, r.fields);
    } else if (
      l.name === "DelegDelegate" && r.name === "DelegDelegate"
    ) {
      return LbCredential.eqStakingCredential.neq(l.fields[0], r.fields[0]) ||
        LbCrypto.eqPubKeyHash.neq(l.fields[1], r.fields[1]);
    } else if (
      l.name === "PoolRegister" && r.name === "PoolRegister"
    ) {
      return LbCrypto.eqPubKeyHash.neq(l.fields[0], r.fields[0]) ||
        LbCrypto.eqPubKeyHash.neq(l.fields[1], r.fields[1]);
    } else if (l.name === "PoolRetire" && r.name === "PoolRetire") {
      return LbCrypto.eqPubKeyHash.neq(l.fields[0], r.fields[0]) ||
        Prelude.eqInteger.neq(l.fields[1], r.fields[1]);
    } else if (l.name === "Genesis" && r.name === "Genesis") {
      return false;
    } else if (l.name === "Mir" && r.name === "Mir") {
      return false;
    } else {
      return true;
    }
  },
};

/**
 * {@link Json} instance for {@link DCert}
 */
export const jsonDCert: Json<DCert> = {
  toJson: (dcert) => {
    if (dcert.name === `DelegRegKey`) {
      return PJson.jsonConstructor(dcert.name, [
        LbCredential.jsonStakingCredential.toJson(dcert.fields),
      ]);
    } else if (dcert.name === `DelegDeRegKey`) {
      return PJson.jsonConstructor(dcert.name, [
        LbCredential.jsonStakingCredential.toJson(dcert.fields),
      ]);
    } else if (dcert.name === `DelegDelegate`) {
      return PJson.jsonConstructor(dcert.name, [
        LbCredential.jsonStakingCredential.toJson(dcert.fields[0]),
        LbCrypto.jsonPubKeyHash.toJson(dcert.fields[1]),
      ]);
    } else if (dcert.name === `PoolRegister`) {
      return PJson.jsonConstructor(dcert.name, [
        LbCrypto.jsonPubKeyHash.toJson(dcert.fields[0]),
        LbCrypto.jsonPubKeyHash.toJson(dcert.fields[1]),
      ]);
    } else if (dcert.name === `PoolRetire`) {
      return PJson.jsonConstructor(dcert.name, [
        LbCrypto.jsonPubKeyHash.toJson(dcert.fields[0]),
        Prelude.jsonInteger.toJson(dcert.fields[1]),
      ]);
    } else if (dcert.name === `Genesis`) {
      return PJson.jsonConstructor(dcert.name, []);
    } else {
      // else if (dcert.name === `DCertMir`) {
      return PJson.jsonConstructor(dcert.name, []);
    }
  },
  fromJson: (value) => {
    return PJson.caseJsonConstructor<DCert>("DCert", {
      "DelegRegKey": (ctorFields) => {
        if (ctorFields.length === 1) {
          return {
            fields: LbCredential.jsonStakingCredential.fromJson(ctorFields[0]!),
            name: "DelegRegKey",
          };
        } else {
          throw new JsonError(
            "Expected JSON Array with 1 fields but got" +
              PJson.stringify(value),
          );
        }
      },
      "DelegDeRegKey": (ctorFields) => {
        if (ctorFields.length === 1) {
          return {
            fields: LbCredential.jsonStakingCredential.fromJson(ctorFields[0]!),
            name: "DelegDeRegKey",
          };
        } else {
          throw new JsonError(
            "Expected JSON Array with 1 fields but got" +
              PJson.stringify(value),
          );
        }
      },
      "DelegDelegate": (ctorFields) => {
        if (ctorFields.length === 2) {
          return {
            fields: [
              LbCredential.jsonStakingCredential.fromJson(ctorFields[0]!),
              LbCrypto.jsonPubKeyHash.fromJson(ctorFields[1]!),
            ],
            name: "DelegDelegate",
          };
        } else {
          throw new JsonError(
            "Expected JSON Array with 1 fields but got" +
              PJson.stringify(value),
          );
        }
      },

      "PoolRegister": (ctorFields) => {
        if (ctorFields.length === 2) {
          return {
            fields: [
              LbCrypto.jsonPubKeyHash.fromJson(ctorFields[0]!),
              LbCrypto.jsonPubKeyHash.fromJson(ctorFields[1]!),
            ],
            name: "PoolRegister",
          };
        } else {
          throw new JsonError(
            "Expected JSON Array with 1 fields but got" +
              PJson.stringify(value),
          );
        }
      },

      "PoolRetire": (ctorFields) => {
        if (ctorFields.length === 2) {
          return {
            fields: [
              LbCrypto.jsonPubKeyHash.fromJson(ctorFields[0]!),
              Prelude.jsonInteger.fromJson(ctorFields[1]!),
            ],
            name: "PoolRetire",
          };
        } else {
          throw new JsonError(
            "Expected JSON Array with 1 fields but got" +
              PJson.stringify(value),
          );
        }
      },
      "Genesis": (ctorFields) => {
        if (ctorFields.length === 0) {
          return { name: "Genesis" };
        } else {
          throw new JsonError(
            "Expected JSON Array with 1 fields but got" +
              PJson.stringify(value),
          );
        }
      },
      "Mir": (ctorFields) => {
        if (ctorFields.length === 0) {
          return { name: "Mir" };
        } else {
          throw new JsonError(
            "Expected JSON Array with 1 fields but got" +
              PJson.stringify(value),
          );
        }
      },
    }, value);
  },
};

/**
 * {@link IsPlutusData} instance for {@link DCert}
 */
export const isPlutusDataDCert: IsPlutusData<DCert> = {
  toData: (dcert) => {
    if (dcert.name === `DelegRegKey`) {
      return {
        fields: [0n, [
          LbCredential.isPlutusDataStakingCredential.toData(dcert.fields),
        ]],
        name: "Constr",
      };
    } else if (dcert.name === `DelegDeRegKey`) {
      return {
        fields: [1n, [
          LbCredential.isPlutusDataStakingCredential.toData(dcert.fields),
        ]],
        name: "Constr",
      };
    } else if (dcert.name === `DelegDelegate`) {
      return {
        fields: [2n, [
          LbCredential.isPlutusDataStakingCredential.toData(dcert.fields[0]),
          LbCrypto.isPlutusDataPubKeyHash.toData(dcert.fields[1]),
        ]],
        name: "Constr",
      };
    } else if (dcert.name === `PoolRegister`) {
      return {
        fields: [3n, [
          LbCrypto.isPlutusDataPubKeyHash.toData(dcert.fields[0]),
          LbCrypto.isPlutusDataPubKeyHash.toData(dcert.fields[1]),
        ]],
        name: "Constr",
      };
    } else if (dcert.name === `PoolRetire`) {
      return {
        fields: [4n, [
          LbCrypto.isPlutusDataPubKeyHash.toData(dcert.fields[0]),
          PreludeInstances.isPlutusDataInteger.toData(dcert.fields[1]),
        ]],
        name: "Constr",
      };
    } else if (dcert.name === `Genesis`) {
      return { fields: [5n, []], name: "Constr" };
    } else {
      // else if (dcert.name === `DCertMir`) {
      return { fields: [6n, []], name: "Constr" };
    }
  },

  fromData: (plutusData) => {
    switch (plutusData.name) {
      case "Constr":
        if (plutusData.fields[0] === 0n && plutusData.fields[1].length === 1) {
          return {
            fields: LbCredential.isPlutusDataStakingCredential.fromData(
              plutusData.fields[1][0]!,
            ),
            name: "DelegRegKey",
          };
        } else if (
          plutusData.fields[0] === 1n && plutusData.fields[1].length === 1
        ) {
          return {
            fields: LbCredential.isPlutusDataStakingCredential.fromData(
              plutusData.fields[1][0]!,
            ),
            name: "DelegDeRegKey",
          };
        } else if (
          plutusData.fields[0] === 2n && plutusData.fields[1].length === 2
        ) {
          return {
            fields: [
              LbCredential.isPlutusDataStakingCredential.fromData(
                plutusData.fields[1][0]!,
              ),
              LbCrypto.isPlutusDataPubKeyHash.fromData(
                plutusData.fields[1][1]!,
              ),
            ],
            name: "DelegDelegate",
          };
        } else if (
          plutusData.fields[0] === 3n && plutusData.fields[1].length === 2
        ) {
          return {
            fields: [
              LbCrypto.isPlutusDataPubKeyHash.fromData(
                plutusData.fields[1][0]!,
              ),
              LbCrypto.isPlutusDataPubKeyHash.fromData(
                plutusData.fields[1][1]!,
              ),
            ],
            name: "PoolRegister",
          };
        } else if (
          plutusData.fields[0] === 4n && plutusData.fields[1].length === 2
        ) {
          return {
            fields: [
              LbCrypto.isPlutusDataPubKeyHash.fromData(
                plutusData.fields[1][0]!,
              ),
              PreludeInstances.isPlutusDataInteger.fromData(
                plutusData.fields[1][1]!,
              ),
            ],
            name: "PoolRetire",
          };
        } else if (
          plutusData.fields[0] === 5n && plutusData.fields[1].length === 0
        ) {
          return { name: "Genesis" };
        } else if (
          plutusData.fields[0] === 6n && plutusData.fields[1].length === 0
        ) {
          return { name: "Mir" };
        }
        break;
    }
    throw new IsPlutusDataError("Expected Constr but got " + plutusData);
  },
};
