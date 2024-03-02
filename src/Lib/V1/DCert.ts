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
  | { name: "DCertDelegRegKey"; fields: StakingCredential }
  | { name: "DCertDelegDeRegKey"; fields: StakingCredential }
  | { name: "DCertDelegDelegate"; fields: [StakingCredential, PubKeyHash] }
  | { name: "DCertPoolRegister"; fields: [PubKeyHash, PubKeyHash] }
  | { name: "DCertPoolRetire"; fields: [PubKeyHash, Integer] }
  | { name: "DCertGenesis" }
  | { name: "DCertMir" };

/**
 * {@link Eq} instance for {@link DCert}
 */
export const eqDCert: Eq<DCert> = {
  eq: (l, r) => {
    if (l.name === "DCertDelegRegKey" && r.name === "DCertDelegRegKey") {
      return LbCredential.eqStakingCredential.eq(l.fields, r.fields);
    } else if (
      l.name === "DCertDelegDeRegKey" && r.name === "DCertDelegDeRegKey"
    ) {
      return LbCredential.eqStakingCredential.eq(l.fields, r.fields);
    } else if (
      l.name === "DCertDelegDelegate" && r.name === "DCertDelegDelegate"
    ) {
      return LbCredential.eqStakingCredential.eq(l.fields[0], r.fields[0]) &&
        LbCrypto.eqPubKeyHash.eq(l.fields[1], r.fields[1]);
    } else if (
      l.name === "DCertPoolRegister" && r.name === "DCertPoolRegister"
    ) {
      return LbCrypto.eqPubKeyHash.eq(l.fields[0], r.fields[0]) &&
        LbCrypto.eqPubKeyHash.eq(l.fields[1], r.fields[1]);
    } else if (l.name === "DCertPoolRetire" && r.name === "DCertPoolRetire") {
      return LbCrypto.eqPubKeyHash.eq(l.fields[0], r.fields[0]) &&
        Prelude.eqInteger.eq(l.fields[1], r.fields[1]);
    } else if (l.name === "DCertGenesis" && r.name === "DCertGenesis") {
      return true;
    } else if (l.name === "DCertMir" && r.name === "DCertMir") {
      return true;
    } else {
      return false;
    }
  },
  neq: (l, r) => {
    if (l.name === "DCertDelegRegKey" && r.name === "DCertDelegRegKey") {
      return LbCredential.eqStakingCredential.neq(l.fields, r.fields);
    } else if (
      l.name === "DCertDelegDeRegKey" && r.name === "DCertDelegDeRegKey"
    ) {
      return LbCredential.eqStakingCredential.neq(l.fields, r.fields);
    } else if (
      l.name === "DCertDelegDelegate" && r.name === "DCertDelegDelegate"
    ) {
      return LbCredential.eqStakingCredential.neq(l.fields[0], r.fields[0]) ||
        LbCrypto.eqPubKeyHash.neq(l.fields[1], r.fields[1]);
    } else if (
      l.name === "DCertPoolRegister" && r.name === "DCertPoolRegister"
    ) {
      return LbCrypto.eqPubKeyHash.neq(l.fields[0], r.fields[0]) ||
        LbCrypto.eqPubKeyHash.neq(l.fields[1], r.fields[1]);
    } else if (l.name === "DCertPoolRetire" && r.name === "DCertPoolRetire") {
      return LbCrypto.eqPubKeyHash.neq(l.fields[0], r.fields[0]) ||
        Prelude.eqInteger.neq(l.fields[1], r.fields[1]);
    } else if (l.name === "DCertGenesis" && r.name === "DCertGenesis") {
      return false;
    } else if (l.name === "DCertMir" && r.name === "DCertMir") {
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
    if (dcert.name === `DCertDelegRegKey`) {
      return PJson.jsonConstructor(dcert.name, [
        LbCredential.jsonStakingCredential.toJson(dcert.fields),
      ]);
    } else if (dcert.name === `DCertDelegDeRegKey`) {
      return PJson.jsonConstructor(dcert.name, [
        LbCredential.jsonStakingCredential.toJson(dcert.fields),
      ]);
    } else if (dcert.name === `DCertDelegDelegate`) {
      return PJson.jsonConstructor(dcert.name, [
        LbCredential.jsonStakingCredential.toJson(dcert.fields[0]),
        LbCrypto.jsonPubKeyHash.toJson(dcert.fields[1]),
      ]);
    } else if (dcert.name === `DCertPoolRegister`) {
      return PJson.jsonConstructor(dcert.name, [
        LbCrypto.jsonPubKeyHash.toJson(dcert.fields[0]),
        LbCrypto.jsonPubKeyHash.toJson(dcert.fields[1]),
      ]);
    } else if (dcert.name === `DCertPoolRetire`) {
      return PJson.jsonConstructor(dcert.name, [
        LbCrypto.jsonPubKeyHash.toJson(dcert.fields[0]),
        Prelude.jsonInteger.toJson(dcert.fields[1]),
      ]);
    } else if (dcert.name === `DCertGenesis`) {
      return PJson.jsonConstructor(dcert.name, []);
    } else {
      // else if (dcert.name === `DCertMir`) {
      return PJson.jsonConstructor(dcert.name, []);
    }
  },
  fromJson: (value) => {
    return PJson.caseJsonConstructor<DCert>("DCert", {
      "DCertDelegRegKey": (ctorFields) => {
        if (ctorFields.length === 1) {
          return {
            fields: LbCredential.jsonStakingCredential.fromJson(ctorFields[0]!),
            name: "DCertDelegRegKey",
          };
        } else {
          throw new JsonError(
            "Expected JSON Array with 1 fields but got" +
              PJson.stringify(value),
          );
        }
      },
      "DCertDelegDeRegKey": (ctorFields) => {
        if (ctorFields.length === 1) {
          return {
            fields: LbCredential.jsonStakingCredential.fromJson(ctorFields[0]!),
            name: "DCertDelegDeRegKey",
          };
        } else {
          throw new JsonError(
            "Expected JSON Array with 1 fields but got" +
              PJson.stringify(value),
          );
        }
      },
      "DCertDelegDelegate": (ctorFields) => {
        if (ctorFields.length === 2) {
          return {
            fields: [
              LbCredential.jsonStakingCredential.fromJson(ctorFields[0]!),
              LbCrypto.jsonPubKeyHash.fromJson(ctorFields[1]!),
            ],
            name: "DCertDelegDelegate",
          };
        } else {
          throw new JsonError(
            "Expected JSON Array with 1 fields but got" +
              PJson.stringify(value),
          );
        }
      },

      "DCertPoolRegister": (ctorFields) => {
        if (ctorFields.length === 2) {
          return {
            fields: [
              LbCrypto.jsonPubKeyHash.fromJson(ctorFields[0]!),
              LbCrypto.jsonPubKeyHash.fromJson(ctorFields[1]!),
            ],
            name: "DCertPoolRegister",
          };
        } else {
          throw new JsonError(
            "Expected JSON Array with 1 fields but got" +
              PJson.stringify(value),
          );
        }
      },

      "DCertPoolRetire": (ctorFields) => {
        if (ctorFields.length === 2) {
          return {
            fields: [
              LbCrypto.jsonPubKeyHash.fromJson(ctorFields[0]!),
              Prelude.jsonInteger.fromJson(ctorFields[1]!),
            ],
            name: "DCertPoolRetire",
          };
        } else {
          throw new JsonError(
            "Expected JSON Array with 1 fields but got" +
              PJson.stringify(value),
          );
        }
      },
      "DCertGenesis": (ctorFields) => {
        if (ctorFields.length === 0) {
          return { name: "DCertGenesis" };
        } else {
          throw new JsonError(
            "Expected JSON Array with 1 fields but got" +
              PJson.stringify(value),
          );
        }
      },
      "DCertMir": (ctorFields) => {
        if (ctorFields.length === 0) {
          return { name: "DCertMir" };
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
    if (dcert.name === `DCertDelegRegKey`) {
      return {
        fields: [0n, [
          LbCredential.isPlutusDataStakingCredential.toData(dcert.fields),
        ]],
        name: "Constr",
      };
    } else if (dcert.name === `DCertDelegDeRegKey`) {
      return {
        fields: [1n, [
          LbCredential.isPlutusDataStakingCredential.toData(dcert.fields),
        ]],
        name: "Constr",
      };
    } else if (dcert.name === `DCertDelegDelegate`) {
      return {
        fields: [2n, [
          LbCredential.isPlutusDataStakingCredential.toData(dcert.fields[0]),
          LbCrypto.isPlutusDataPubKeyHash.toData(dcert.fields[1]),
        ]],
        name: "Constr",
      };
    } else if (dcert.name === `DCertPoolRegister`) {
      return {
        fields: [3n, [
          LbCrypto.isPlutusDataPubKeyHash.toData(dcert.fields[0]),
          LbCrypto.isPlutusDataPubKeyHash.toData(dcert.fields[1]),
        ]],
        name: "Constr",
      };
    } else if (dcert.name === `DCertPoolRetire`) {
      return {
        fields: [4n, [
          LbCrypto.isPlutusDataPubKeyHash.toData(dcert.fields[0]),
          PreludeInstances.isPlutusDataInteger.toData(dcert.fields[1]),
        ]],
        name: "Constr",
      };
    } else if (dcert.name === `DCertGenesis`) {
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
            name: "DCertDelegRegKey",
          };
        } else if (
          plutusData.fields[0] === 1n && plutusData.fields[1].length === 1
        ) {
          return {
            fields: LbCredential.isPlutusDataStakingCredential.fromData(
              plutusData.fields[1][0]!,
            ),
            name: "DCertDelegDeRegKey",
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
            name: "DCertDelegDelegate",
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
            name: "DCertPoolRegister",
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
            name: "DCertPoolRetire",
          };
        } else if (
          plutusData.fields[0] === 5n && plutusData.fields[1].length === 0
        ) {
          return { name: "DCertGenesis" };
        } else if (
          plutusData.fields[0] === 6n && plutusData.fields[1].length === 0
        ) {
          return { name: "DCertMir" };
        }
        break;
    }
    throw new IsPlutusDataError("Expected Constr but got " + plutusData);
  },
};
