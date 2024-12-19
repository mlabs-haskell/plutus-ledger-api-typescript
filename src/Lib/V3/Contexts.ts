/**
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.36.0.0/plutus-ledger-api/src/PlutusLedgerApi/V3/Contexts.hs}
 */
import {
  caseFieldWithValue,
  caseJsonConstructor,
  type Eq,
  eqInteger,
  eqList,
  eqMaybe,
  type Integer,
  type Json,
  jsonConstructor,
  JsonError,
  jsonInteger,
  jsonList,
  jsonMaybe,
  type List,
  type Maybe,
} from "prelude";
import * as Prelude from "prelude";

import type { Credential } from "../V1/Credential.js";
import * as V1Credential from "../V1/Credential.js";

import * as LbPlutusData from "../PlutusData.js";

import type { Map } from "../AssocMap.js";
import * as AssocMap from "../AssocMap.js";

import * as V1Scripts from "../V1/Scripts.js";
import type { Datum, DatumHash, Redeemer, ScriptHash } from "../V1/Scripts.js";

import type { PubKeyHash } from "../V1/Crypto.js";
import * as V1Crypto from "../V1/Crypto.js";

import type { CurrencySymbol, Lovelace, Value } from "../V1/Value.js";
import * as V1Value from "../V1/Value.js";

import {
  eqPlutusData,
  type IsPlutusData,
  IsPlutusDataError,
  isPlutusDataPlutusData,
  jsonPlutusData,
  type PlutusData,
} from "../PlutusData.js";
import {
  eqRational,
  isPlutusDataRational,
  jsonRational,
  type Rational,
} from "../Ratio.js";

import type { TxId, TxOutRef } from "../V3/Tx.js";
import * as V3Tx from "../V3/Tx.js";

import * as V2Contexts from "../V2/Contexts.js";

import type { TxOut } from "../V2/Tx.js";
import * as V2Tx from "../V2/Tx.js";

import type { POSIXTimeRange } from "../V1/Time.js";
import * as V1Time from "../V1/Time.js";

import {
  isPlutusDataInteger,
  isPlutusDataList,
  isPlutusDataMaybe,
} from "../V1.js";

/**
 * Cold credential of a constitutional committee.
 *
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.36.0.0/plutus-ledger-api/src/PlutusLedgerApi/V3/Contexts.hs#L78}
 */
export type ColdCommitteeCredential = Credential;

export const eqColdCommitteeCredential: Eq<ColdCommitteeCredential> =
  V1Credential.eqCredential;
export const jsonColdCommitteeCredential: Json<ColdCommitteeCredential> =
  V1Credential.jsonCredential;
export const isPlutusDataColdCommitteeCredential: IsPlutusData<
  ColdCommitteeCredential
> = V1Credential.isPlutusDataCredential;

/**
 * Hot credential of a constitutional committee.
 *
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.36.0.0/plutus-ledger-api/src/PlutusLedgerApi/V3/Contexts.hs#L102}
 */
export type HotCommitteeCredential = Credential;

export const eqHotCommitteeCredential: Eq<HotCommitteeCredential> =
  V1Credential.eqCredential;
export const jsonHotCommitteeCredential: Json<HotCommitteeCredential> =
  V1Credential.jsonCredential;
export const isPlutusDataHotCommitteeCredential: IsPlutusData<
  HotCommitteeCredential
> = V1Credential.isPlutusDataCredential;

/**
 * Credential of a delegated representative.
 *
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.36.0.0/plutus-ledger-api/src/PlutusLedgerApi/V3/Contexts.hs#L126}
 */
export type DRepCredential = Credential;

export const eqDRepCredential: Eq<DRepCredential> = V1Credential.eqCredential;
export const jsonDRepCredential: Json<DRepCredential> =
  V1Credential.jsonCredential;
export const isPlutusDataDRepCredential: IsPlutusData<DRepCredential> =
  V1Credential.isPlutusDataCredential;

/**
 * Delegated representative, or the two predefined voting options.
 *
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.36.0.0/plutus-ledger-api/src/PlutusLedgerApi/V3/Contexts.hs#L150-L153}
 */
export type DRep =
  | { name: "DRep"; fields: DRepCredential }
  | { name: "AlwaysAbstain" }
  | { name: "AlwaysNoConfidence" };

/**
 * {@link Eq} instance for {@link DRep}
 */
export const eqDRep: Eq<DRep> = {
  eq: (l, r) => {
    if (l.name === "DRep" && r.name === "DRep") {
      return V1Credential.eqCredential.eq(l.fields, r.fields);
    } else if (l.name == "AlwaysAbstain" && r.name == "AlwaysAbstain") {
      return true;
    } else if (
      l.name == "AlwaysNoConfidence" &&
      r.name == "AlwaysNoConfidence"
    ) {
      return true;
    } else {
      return false;
    }
  },
  neq: (l, r) => {
    if (l.name == "DRep" && r.name == "DRep") {
      return V1Credential.eqCredential.neq(l.fields, r.fields);
    } else if (l.name === "AlwaysAbstain" && r.name === "AlwaysAbstain") {
      return false;
    } else if (
      l.name === "AlwaysNoConfidence" &&
      r.name === "AlwaysNoConfidence"
    ) {
      return false;
    } else {
      return true;
    }
  },
};

/**
 * {@link Json} instance for {@link DRep}
 */
export const jsonDRep: Json<DRep> = {
  toJson: (dRep) => {
    switch (dRep.name) {
      case "DRep":
        return jsonConstructor(dRep.name, [
          V1Credential.jsonCredential.toJson(dRep.fields),
        ]);
      case "AlwaysAbstain":
        return jsonConstructor(dRep.name, []);
      case "AlwaysNoConfidence":
        return jsonConstructor(dRep.name, []);
    }
  },
  fromJson: (value) => {
    return caseJsonConstructor<DRep>(
      "Plutus.V3.DRep",
      {
        DRep: (fields) => {
          if (fields.length != 1) {
            throw new JsonError(`Expected one field`);
          }
          return {
            fields: V1Credential.jsonCredential.fromJson(fields[0]!),
            name: "DRep",
          };
        },
        AlwaysAbstain: (fields) => {
          if (fields.length != 0) {
            throw new JsonError(`Expected no field`);
          }
          return {
            name: "AlwaysAbstain",
          };
        },
        AlwaysNoConfidence: (fields) => {
          if (fields.length != 0) {
            throw new JsonError(`Expected no field`);
          }
          return {
            name: "AlwaysNoConfidence",
          };
        },
      },
      value,
    );
  },
};

/**
 * {@link IsPlutusData} instance for {@link DRep}
 */
export const isPlutusDataDRep: IsPlutusData<DRep> = {
  toData: (dRep) => {
    switch (dRep.name) {
      case "DRep": {
        return {
          fields: [
            0n,
            [V1Credential.isPlutusDataCredential.toData(dRep.fields)],
          ],
          name: "Constr",
        };
      }
      case "AlwaysAbstain":
        return {
          fields: [1n, []],
          name: "Constr",
        };
      case "AlwaysNoConfidence":
        return {
          fields: [2n, []],
          name: "Constr",
        };
    }
  },
  fromData: (value) => {
    switch (value.name) {
      case "Constr": {
        const [tag, fields] = value.fields;

        if (tag === 0n && fields.length === 1) {
          return {
            fields: V1Credential.isPlutusDataCredential.fromData(fields[0]!),
            name: "DRep",
          };
        } else if (tag === 1n && fields.length === 0) {
          return {
            name: "AlwaysAbstain",
          };
        } else if (tag === 2n && fields.length === 0) {
          return {
            name: "AlwaysNoConfidence",
          };
        } else break;
      }
    }
    throw new IsPlutusDataError("Unexpected data");
  },
};

/**
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.36.0.0/plutus-ledger-api/src/PlutusLedgerApi/V3/Contexts.hs#L165-L168}
 */
export type Delegatee =
  | { name: "Stake"; fields: PubKeyHash }
  | { name: "Vote"; fields: DRep }
  | { name: "StakeVote"; fields: [PubKeyHash, DRep] };

/**
 * {@link Eq} instance for {@link Delegatee}
 */
export const eqDelegatee: Eq<Delegatee> = {
  eq: (l, r) => {
    if (l.name == "Stake" && r.name == "Stake") {
      return V1Crypto.eqPubKeyHash.eq(l.fields, r.fields);
    } else if (l.name == "Vote" && r.name == "Vote") {
      return eqDRep.eq(l.fields, r.fields);
    } else if (l.name == "StakeVote" && r.name == "StakeVote") {
      return (
        V1Crypto.eqPubKeyHash.eq(l.fields[0], r.fields[0]) &&
        eqDRep.eq(l.fields[1], r.fields[1])
      );
    } else return false;
  },
  neq: (l, r) => {
    if (l.name == "Stake" && r.name == "Stake") {
      return V1Crypto.eqPubKeyHash.neq(l.fields, r.fields);
    } else if (l.name == "Vote" && r.name == "Vote") {
      return eqDRep.neq(l.fields, r.fields);
    } else if (l.name == "StakeVote" && r.name == "StakeVote") {
      return (
        V1Crypto.eqPubKeyHash.neq(l.fields[0], r.fields[0]) ||
        eqDRep.neq(l.fields[1], r.fields[1])
      );
    } else return true;
  },
};

/**
 * {@link Json} instance for {@link Delegatee}
 */
export const jsonDelegatee: Json<Delegatee> = {
  toJson: (delegatee) => {
    switch (delegatee.name) {
      case "Stake":
        return jsonConstructor(delegatee.name, [
          V1Crypto.jsonPubKeyHash.toJson(delegatee.fields),
        ]);
      case "Vote":
        return jsonConstructor(delegatee.name, [
          jsonDRep.toJson(delegatee.fields),
        ]);
      case "StakeVote":
        return jsonConstructor(delegatee.name, [
          V1Crypto.jsonPubKeyHash.toJson(delegatee.fields[0]),
          jsonDRep.toJson(delegatee.fields[1]!),
        ]);
    }
  },
  fromJson: (value) => {
    return caseJsonConstructor<Delegatee>(
      "Plutus.V3.Delegatee",
      {
        Stake: (fields) => {
          if (fields.length != 1) {
            throw new JsonError(`Expected one field`);
          }
          return {
            fields: V1Crypto.jsonPubKeyHash.fromJson(fields[0]!),
            name: "Stake",
          };
        },
        Vote: (fields) => {
          if (fields.length != 1) {
            throw new JsonError(`Expected one field`);
          }
          return {
            fields: jsonDRep.fromJson(fields[0]!),
            name: "Vote",
          };
        },
        StakeVote: (fields) => {
          if (fields.length != 2) {
            throw new JsonError(`Expected two fields`);
          }
          return {
            fields: [
              V1Crypto.jsonPubKeyHash.fromJson(fields[0]!),
              jsonDRep.fromJson(fields[1]!),
            ],
            name: "StakeVote",
          };
        },
      },
      value,
    );
  },
};

/**
 * {@link IsPlutusData} instance for {@link Delegatee}
 */
export const isPlutusDataDelegatee: IsPlutusData<Delegatee> = {
  toData: (delegatee) => {
    switch (delegatee.name) {
      case "Stake":
        return {
          fields: [
            0n,
            [V1Crypto.isPlutusDataPubKeyHash.toData(delegatee.fields)],
          ],
          name: "Constr",
        };
      case "Vote":
        return {
          fields: [1n, [isPlutusDataDRep.toData(delegatee.fields)]],
          name: "Constr",
        };
      case "StakeVote":
        return {
          fields: [
            2n,
            [
              V1Crypto.isPlutusDataPubKeyHash.toData(delegatee.fields[0]!),
              isPlutusDataDRep.toData(delegatee.fields[1]!),
            ],
          ],
          name: "Constr",
        };
    }
  },
  fromData: (value) => {
    switch (value.name) {
      case "Constr": {
        if (value.fields[0] === 0n && value.fields[1].length === 1) {
          return {
            fields: V1Crypto.isPlutusDataPubKeyHash.fromData(
              value.fields[1][0]!,
            ),
            name: "Stake",
          };
        } else if (value.fields[0] === 1n && value.fields[1].length === 1) {
          return {
            fields: isPlutusDataDRep.fromData(value.fields[1][0]!),
            name: "Vote",
          };
        } else if (value.fields[0] === 2n && value.fields[1].length === 2) {
          return {
            fields: [
              V1Crypto.isPlutusDataPubKeyHash.fromData(value.fields[1][0]!),
              isPlutusDataDRep.fromData(value.fields[1][1]!),
            ],
            name: "StakeVote",
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
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.36.0.0/plutus-ledger-api/src/PlutusLedgerApi/V3/Contexts.hs#L181-L207}
 */
export type TxCert =
  | {
    name: "RegStaking";
    fields: [Credential, Maybe<Lovelace>];
  }
  | {
    name: "UnRegStaking";
    fields: [Credential, Maybe<Lovelace>];
  }
  | {
    name: "DelegStaking";
    fields: [Credential, Delegatee];
  }
  | {
    name: "RegDeleg";
    fields: [Credential, Delegatee, Lovelace];
  }
  | {
    name: "RegDRep";
    fields: [DRepCredential, Lovelace];
  }
  | {
    name: "UpdateDRep";
    fields: DRepCredential;
  }
  | {
    name: "UnRegDRep";
    fields: [DRepCredential, V1Value.Lovelace];
  }
  | {
    name: "PoolRegister";
    fields: [PubKeyHash, PubKeyHash];
  }
  | {
    name: "PoolRetire";
    fields: [PubKeyHash, Integer];
  }
  | {
    name: "AuthHotCommittee";
    fields: [ColdCommitteeCredential, HotCommitteeCredential];
  }
  | {
    name: "ResignColdCommittee";
    fields: ColdCommitteeCredential;
  };

/**
 * {@link Eq} instance for {@link TxCert}
 */
export const eqTxCert: Eq<TxCert> = {
  eq: (l, r) => {
    if (l.name === "RegStaking" && r.name === "RegStaking") {
      return (
        V1Credential.eqCredential.eq(l.fields[0], r.fields[0]) &&
        eqMaybe(eqInteger).eq(l.fields[1], r.fields[1])
      );
    } else if (l.name === "UnRegStaking" && r.name === "UnRegStaking") {
      return (
        V1Credential.eqCredential.eq(l.fields[0], r.fields[0]) &&
        eqMaybe(eqInteger).eq(l.fields[1], r.fields[1])
      );
    } else if (l.name === "DelegStaking" && r.name === "DelegStaking") {
      return (
        V1Credential.eqCredential.eq(l.fields[0], r.fields[0]) &&
        eqDelegatee.eq(l.fields[1], r.fields[1])
      );
    } else if (l.name === "RegDeleg" && r.name === "RegDeleg") {
      return (
        V1Credential.eqCredential.eq(l.fields[0], r.fields[0]) &&
        eqDelegatee.eq(l.fields[1], r.fields[1]) &&
        eqInteger.eq(l.fields[2], r.fields[2])
      );
    } else if (l.name === "RegDRep" && r.name === "RegDRep") {
      return (
        V1Credential.eqCredential.eq(l.fields[0], r.fields[0]) &&
        eqInteger.eq(l.fields[1], r.fields[1])
      );
    } else if (l.name === "UpdateDRep" && r.name === "UpdateDRep") {
      return V1Credential.eqCredential.eq(l.fields, r.fields);
    } else if (l.name === "UnRegDRep" && r.name === "UnRegDRep") {
      return (
        V1Credential.eqCredential.eq(l.fields[0], r.fields[0]) &&
        eqInteger.eq(l.fields[1], r.fields[1])
      );
    } else if (l.name === "PoolRegister" && r.name === "PoolRegister") {
      return (
        V1Crypto.eqPubKeyHash.eq(l.fields[0], r.fields[0]) &&
        V1Crypto.eqPubKeyHash.eq(l.fields[1], r.fields[1])
      );
    } else if (l.name === "AuthHotCommittee" && r.name === "AuthHotCommittee") {
      return (
        V1Credential.eqCredential.eq(l.fields[0], r.fields[0]) &&
        V1Credential.eqCredential.eq(l.fields[1], r.fields[1])
      );
    } else if (
      l.name === "ResignColdCommittee" &&
      r.name === "ResignColdCommittee"
    ) {
      return V1Credential.eqCredential.eq(l.fields, r.fields);
    } else {
      return false;
    }
  },
  neq: (l, r) => {
    if (l.name === "RegStaking" && r.name === "RegStaking") {
      return (
        V1Credential.eqCredential.neq(l.fields[0], r.fields[0]) ||
        eqMaybe(eqInteger).neq(l.fields[1], r.fields[1])
      );
    } else if (l.name === "UnRegStaking" && r.name === "UnRegStaking") {
      return (
        V1Credential.eqCredential.neq(l.fields[0], r.fields[0]) ||
        eqMaybe(eqInteger).neq(l.fields[1], r.fields[1])
      );
    } else if (l.name === "DelegStaking" && r.name === "DelegStaking") {
      return (
        V1Credential.eqCredential.neq(l.fields[0], r.fields[0]) ||
        eqDelegatee.neq(l.fields[1], r.fields[1])
      );
    } else if (l.name === "RegDeleg" && r.name === "RegDeleg") {
      return (
        V1Credential.eqCredential.neq(l.fields[0], r.fields[0]) ||
        eqDelegatee.neq(l.fields[1], r.fields[1]) ||
        eqInteger.neq(l.fields[2], r.fields[2])
      );
    } else if (l.name === "RegDRep" && r.name === "RegDRep") {
      return (
        V1Credential.eqCredential.neq(l.fields[0], r.fields[0]) ||
        eqInteger.neq(l.fields[1], r.fields[1])
      );
    } else if (l.name === "UpdateDRep" && r.name === "UpdateDRep") {
      return V1Credential.eqCredential.neq(l.fields, r.fields);
    } else if (l.name === "UnRegDRep" && r.name === "UnRegDRep") {
      return (
        V1Credential.eqCredential.neq(l.fields[0], r.fields[0]) ||
        eqInteger.neq(l.fields[1], r.fields[1])
      );
    } else if (l.name === "PoolRegister" && r.name === "PoolRegister") {
      return (
        V1Crypto.eqPubKeyHash.neq(l.fields[0], r.fields[0]) ||
        V1Crypto.eqPubKeyHash.neq(l.fields[1], r.fields[1])
      );
    } else if (l.name === "AuthHotCommittee" && r.name === "AuthHotCommittee") {
      return (
        V1Credential.eqCredential.neq(l.fields[0], r.fields[0]) ||
        V1Credential.eqCredential.neq(l.fields[1], r.fields[1])
      );
    } else if (
      l.name === "ResignColdCommittee" &&
      r.name === "ResignColdCommittee"
    ) {
      return V1Credential.eqCredential.neq(l.fields, r.fields);
    } else {
      return true;
    }
  },
};

/**
 * {@link Json} instance for {@link TxCert}
 */
export const jsonTxCert: Json<TxCert> = {
  toJson: (txCert) => {
    switch (txCert.name) {
      case "RegStaking":
        return jsonConstructor(txCert.name, [
          V1Credential.jsonCredential.toJson(txCert.fields[0]),
          jsonMaybe(jsonInteger).toJson(txCert.fields[1]),
        ]);
      case "UnRegStaking":
        return jsonConstructor(txCert.name, [
          V1Credential.jsonCredential.toJson(txCert.fields[0]),
          jsonMaybe(jsonInteger).toJson(txCert.fields[1]),
        ]);
      case "DelegStaking":
        return jsonConstructor(txCert.name, [
          V1Credential.jsonCredential.toJson(txCert.fields[0]),
          jsonDelegatee.toJson(txCert.fields[1]),
        ]);
      case "RegDeleg":
        return jsonConstructor(txCert.name, [
          V1Credential.jsonCredential.toJson(txCert.fields[0]),
          jsonDelegatee.toJson(txCert.fields[1]),
          jsonInteger.toJson(txCert.fields[2]),
        ]);
      case "RegDRep":
        return jsonConstructor(txCert.name, [
          V1Credential.jsonCredential.toJson(txCert.fields[0]),
          jsonInteger.toJson(txCert.fields[1]),
        ]);
      case "UpdateDRep":
        return jsonConstructor(txCert.name, [
          V1Credential.jsonCredential.toJson(txCert.fields),
        ]);
      case "UnRegDRep":
        return jsonConstructor(txCert.name, [
          V1Credential.jsonCredential.toJson(txCert.fields[0]),
          jsonInteger.toJson(txCert.fields[1]),
        ]);
      case "PoolRegister":
        return jsonConstructor(txCert.name, [
          V1Crypto.jsonPubKeyHash.toJson(txCert.fields[0]),
          V1Crypto.jsonPubKeyHash.toJson(txCert.fields[1]),
        ]);
      case "PoolRetire":
        return jsonConstructor(txCert.name, [
          V1Crypto.jsonPubKeyHash.toJson(txCert.fields[0]),
          jsonInteger.toJson(txCert.fields[1]),
        ]);
      case "AuthHotCommittee":
        return jsonConstructor(txCert.name, [
          V1Credential.jsonCredential.toJson(txCert.fields[0]),
          V1Credential.jsonCredential.toJson(txCert.fields[1]),
        ]);
      case "ResignColdCommittee":
        return jsonConstructor(txCert.name, [
          V1Credential.jsonCredential.toJson(txCert.fields),
        ]);
    }
  },
  fromJson: (value) => {
    return caseJsonConstructor<TxCert>(
      "Plutus.V3.TxCert",
      {
        RegStaking: (fields) => {
          if (fields.length != 2) {
            throw new JsonError(`Expected two fields`);
          }

          return {
            fields: [
              V1Credential.jsonCredential.fromJson(fields[0]!),
              jsonMaybe(jsonInteger).fromJson(fields[1]!),
            ],
            name: "RegStaking",
          };
        },
        UnRegStaking: (fields) => {
          if (fields.length != 2) {
            throw new JsonError(`Expected two fields`);
          }

          return {
            fields: [
              V1Credential.jsonCredential.fromJson(fields[0]!),
              jsonMaybe(jsonInteger).fromJson(fields[1]!),
            ],
            name: "UnRegStaking",
          };
        },
        DelegStaking: (fields) => {
          if (fields.length != 2) {
            throw new JsonError(`Expected two fields`);
          }

          return {
            fields: [
              V1Credential.jsonCredential.fromJson(fields[0]!),
              jsonDelegatee.fromJson(fields[1]!),
            ],
            name: "DelegStaking",
          };
        },
        RegDeleg: (fields) => {
          if (fields.length != 3) {
            throw new JsonError(`Expected three fields`);
          }

          return {
            fields: [
              V1Credential.jsonCredential.fromJson(fields[0]!),
              jsonDelegatee.fromJson(fields[1]!),
              jsonInteger.fromJson(fields[2]!),
            ],
            name: "RegDeleg",
          };
        },
        RegDRep: (fields) => {
          if (fields.length != 2) {
            throw new JsonError(`Expected three fields`);
          }

          return {
            fields: [
              V1Credential.jsonCredential.fromJson(fields[0]!),
              jsonInteger.fromJson(fields[1]!),
            ],
            name: "RegDRep",
          };
        },
        UpdateDRep: (fields) => {
          if (fields.length != 1) {
            throw new JsonError(`Expected one field`);
          }

          return {
            fields: V1Credential.jsonCredential.fromJson(fields[0]!),
            name: "UpdateDRep",
          };
        },
        UnRegDRep: (fields) => {
          if (fields.length != 2) {
            throw new JsonError(`Expected two fields`);
          }

          return {
            fields: [
              V1Credential.jsonCredential.fromJson(fields[0]!),
              jsonInteger.fromJson(fields[1]!),
            ],
            name: "UnRegDRep",
          };
        },
        PoolRegister: (fields) => {
          if (fields.length != 2) {
            throw new JsonError(`Expected two fields`);
          }

          return {
            fields: [
              V1Crypto.jsonPubKeyHash.fromJson(fields[0]!),
              V1Crypto.jsonPubKeyHash.fromJson(fields[1]!),
            ],
            name: "PoolRegister",
          };
        },
        PoolRetire: (fields) => {
          if (fields.length != 2) {
            throw new JsonError(`Expected two fields`);
          }

          return {
            fields: [
              V1Crypto.jsonPubKeyHash.fromJson(fields[0]!),
              jsonInteger.fromJson(fields[1]!),
            ],
            name: "PoolRetire",
          };
        },
        AuthHotCommittee: (fields) => {
          if (fields.length != 2) {
            throw new JsonError(`Expected two fields`);
          }

          return {
            fields: [
              V1Credential.jsonCredential.fromJson(fields[0]!),
              V1Credential.jsonCredential.fromJson(fields[1]!),
            ],
            name: "AuthHotCommittee",
          };
        },
        ResignColdCommittee: (fields) => {
          if (fields.length != 1) {
            throw new JsonError(`Expected one field`);
          }

          return {
            fields: V1Credential.jsonCredential.fromJson(fields[0]!),
            name: "ResignColdCommittee",
          };
        },
      },
      value,
    );
  },
};

/**
 * {@link IsPlutusData} instance for {@link TxCert}
 */
export const isPlutusDataTxCert: IsPlutusData<TxCert> = {
  toData: (txCert) => {
    switch (txCert.name) {
      case "RegStaking":
        return {
          fields: [
            0n,
            [
              V1Credential.isPlutusDataCredential.toData(txCert.fields[0]),
              isPlutusDataMaybe(isPlutusDataInteger).toData(txCert.fields[1]),
            ],
          ],
          name: "Constr",
        };
      case "UnRegStaking":
        return {
          fields: [
            1n,
            [
              V1Credential.isPlutusDataCredential.toData(txCert.fields[0]),
              isPlutusDataMaybe(isPlutusDataInteger).toData(txCert.fields[1]),
            ],
          ],
          name: "Constr",
        };
      case "DelegStaking":
        return {
          fields: [
            2n,
            [
              V1Credential.isPlutusDataCredential.toData(txCert.fields[0]),
              isPlutusDataDelegatee.toData(txCert.fields[1]),
            ],
          ],
          name: "Constr",
        };
      case "RegDeleg":
        return {
          fields: [
            3n,
            [
              V1Credential.isPlutusDataCredential.toData(txCert.fields[0]),
              isPlutusDataDelegatee.toData(txCert.fields[1]),
              isPlutusDataInteger.toData(txCert.fields[2]),
            ],
          ],
          name: "Constr",
        };
      case "RegDRep":
        return {
          fields: [
            4n,
            [
              V1Credential.isPlutusDataCredential.toData(txCert.fields[0]),
              isPlutusDataInteger.toData(txCert.fields[1]),
            ],
          ],
          name: "Constr",
        };
      case "UpdateDRep":
        return {
          fields: [
            5n,
            [V1Credential.isPlutusDataCredential.toData(txCert.fields)],
          ],
          name: "Constr",
        };
      case "UnRegDRep":
        return {
          fields: [
            6n,
            [
              V1Credential.isPlutusDataCredential.toData(txCert.fields[0]),
              isPlutusDataInteger.toData(txCert.fields[1]),
            ],
          ],
          name: "Constr",
        };
      case "PoolRegister":
        return {
          fields: [
            7n,
            [
              V1Crypto.isPlutusDataPubKeyHash.toData(txCert.fields[0]),
              V1Crypto.isPlutusDataPubKeyHash.toData(txCert.fields[1]),
            ],
          ],
          name: "Constr",
        };

      case "PoolRetire":
        return {
          fields: [
            8n,
            [
              V1Crypto.isPlutusDataPubKeyHash.toData(txCert.fields[0]),
              isPlutusDataInteger.toData(txCert.fields[1]),
            ],
          ],
          name: "Constr",
        };
      case "AuthHotCommittee":
        return {
          fields: [
            9n,
            [
              V1Credential.isPlutusDataCredential.toData(txCert.fields[0]),
              V1Credential.isPlutusDataCredential.toData(txCert.fields[1]),
            ],
          ],
          name: "Constr",
        };
      case "ResignColdCommittee":
        return {
          fields: [
            10n,
            [V1Credential.isPlutusDataCredential.toData(txCert.fields)],
          ],
          name: "Constr",
        };
    }
  },
  fromData: (value) => {
    switch (value.name) {
      case "Constr": {
        const [tag, fields] = value.fields;
        if (tag === 0n && fields.length == 2) {
          return {
            fields: [
              V1Credential.isPlutusDataCredential.fromData(fields[0]!),
              isPlutusDataMaybe(isPlutusDataInteger).fromData(fields[1]!),
            ],
            name: "RegStaking",
          };
        } else if (tag === 1n && fields.length == 2) {
          return {
            fields: [
              V1Credential.isPlutusDataCredential.fromData(fields[0]!),
              isPlutusDataMaybe(isPlutusDataInteger).fromData(fields[1]!),
            ],
            name: "UnRegStaking",
          };
        } else if (tag === 2n && fields.length == 2) {
          return {
            fields: [
              V1Credential.isPlutusDataCredential.fromData(fields[0]!),
              isPlutusDataDelegatee.fromData(fields[1]!),
            ],
            name: "DelegStaking",
          };
        } else if (tag === 3n && fields.length == 3) {
          return {
            fields: [
              V1Credential.isPlutusDataCredential.fromData(fields[0]!),
              isPlutusDataDelegatee.fromData(fields[1]!),
              isPlutusDataInteger.fromData(fields[2]!),
            ],
            name: "RegDeleg",
          };
        } else if (tag === 4n && fields.length == 2) {
          return {
            fields: [
              V1Credential.isPlutusDataCredential.fromData(fields[0]!),
              isPlutusDataInteger.fromData(fields[1]!),
            ],
            name: "RegDRep",
          };
        } else if (tag === 5n && fields.length == 1) {
          return {
            fields: V1Credential.isPlutusDataCredential.fromData(fields[0]!),
            name: "UpdateDRep",
          };
        } else if (tag === 6n && fields.length == 2) {
          return {
            fields: [
              V1Credential.isPlutusDataCredential.fromData(fields[0]!),
              isPlutusDataInteger.fromData(fields[1]!),
            ],
            name: "UnRegDRep",
          };
        } else if (tag === 7n && fields.length == 2) {
          return {
            fields: [
              V1Crypto.isPlutusDataPubKeyHash.fromData(fields[0]!),
              V1Crypto.isPlutusDataPubKeyHash.fromData(fields[1]!),
            ],
            name: "PoolRegister",
          };
        } else if (tag === 8n && fields.length == 2) {
          return {
            fields: [
              V1Crypto.isPlutusDataPubKeyHash.fromData(fields[0]!),
              isPlutusDataInteger.fromData(fields[1]!),
            ],
            name: "PoolRetire",
          };
        } else if (tag === 9n && fields.length == 2) {
          return {
            fields: [
              V1Credential.isPlutusDataCredential.fromData(fields[0]!),
              V1Credential.isPlutusDataCredential.fromData(fields[1]!),
            ],
            name: "AuthHotCommittee",
          };
        } else if (tag === 10n && fields.length == 1) {
          return {
            fields: V1Credential.isPlutusDataCredential.fromData(fields[0]!),
            name: "ResignColdCommittee",
          };
        } else break;
      }
      default:
        break;
    }

    throw new IsPlutusDataError("Unexpected data");
  },
};

/**
 * {@link Voter} represents a body with voting power.
 *
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.36.0.0/plutus-ledger-api/src/PlutusLedgerApi/V3/Contexts.hs#L234-L237}
 */
export type Voter =
  | { name: "CommitteeVoter"; fields: HotCommitteeCredential }
  | { name: "DRepVoter"; fields: DRepCredential }
  | { name: "StakePoolVoter"; fields: PubKeyHash };

/**
 * {@link Eq} instance for {@link Voter}
 */
export const eqVoter: Eq<Voter> = {
  eq: (l, r) => {
    if (l.name === "CommitteeVoter" && r.name === "CommitteeVoter") {
      return V1Credential.eqCredential.eq(l.fields, r.fields);
    } else if (l.name === "DRepVoter" && r.name === "DRepVoter") {
      return V1Credential.eqCredential.eq(l.fields, r.fields);
    } else if (l.name === "StakePoolVoter" && r.name === "StakePoolVoter") {
      return V1Crypto.eqPubKeyHash.eq(l.fields, r.fields);
    } else return false;
  },
  neq: (l, r) => {
    if (l.name === "CommitteeVoter" && r.name === "CommitteeVoter") {
      return V1Credential.eqCredential.neq(l.fields, r.fields);
    } else if (l.name === "DRepVoter" && r.name === "DRepVoter") {
      return V1Credential.eqCredential.neq(l.fields, r.fields);
    } else if (l.name === "StakePoolVoter" && r.name === "StakePoolVoter") {
      return V1Crypto.eqPubKeyHash.neq(l.fields, r.fields);
    } else return true;
  },
};

/**
 * {@link Json} instance for {@link Voter}
 */
export const jsonVoter: Json<Voter> = {
  toJson: (voter) => {
    switch (voter.name) {
      case "CommitteeVoter":
        return jsonConstructor(voter.name, [
          V1Credential.jsonCredential.toJson(voter.fields),
        ]);
      case "DRepVoter":
        return jsonConstructor(voter.name, [
          V1Credential.jsonCredential.toJson(voter.fields),
        ]);
      case "StakePoolVoter":
        return jsonConstructor(voter.name, [
          V1Crypto.jsonPubKeyHash.toJson(voter.fields),
        ]);
    }
  },
  fromJson: (value) => {
    return caseJsonConstructor<Voter>(
      "Plutus.V3.Voter",
      {
        CommitteeVoter: (fields) => {
          if (fields.length !== 1) {
            throw new JsonError(`Expected one field`);
          }
          return {
            fields: V1Credential.jsonCredential.fromJson(fields[0]!),
            name: "CommitteeVoter",
          };
        },
        DRepVoter: (fields) => {
          if (fields.length !== 1) {
            throw new JsonError(`Expected one field`);
          }
          return {
            fields: V1Credential.jsonCredential.fromJson(fields[0]!),
            name: "DRepVoter",
          };
        },
        StakePoolVoter: (fields) => {
          if (fields.length !== 1) {
            throw new JsonError(`Expected one field`);
          }
          return {
            fields: V1Crypto.jsonPubKeyHash.fromJson(fields[0]!),
            name: "StakePoolVoter",
          };
        },
      },
      value,
    );
  },
};

/**
 * {@link IsPlutusData} instance for {@link Voter}
 */
export const isPlutusDataVoter: IsPlutusData<Voter> = {
  toData: (voter) => {
    switch (voter.name) {
      case "CommitteeVoter":
        return {
          name: "Constr",
          fields: [
            0n,
            [V1Credential.isPlutusDataCredential.toData(voter.fields)],
          ],
        };
      case "DRepVoter":
        return {
          name: "Constr",
          fields: [
            1n,
            [V1Credential.isPlutusDataCredential.toData(voter.fields)],
          ],
        };
      case "StakePoolVoter":
        return {
          name: "Constr",
          fields: [2n, [V1Crypto.isPlutusDataPubKeyHash.toData(voter.fields)]],
        };
    }
  },
  fromData: (value) => {
    switch (value.name) {
      case "Constr": {
        const [tag, fields] = value.fields;
        if (fields.length !== 1) break;

        if (tag == 0n) {
          return {
            fields: V1Credential.isPlutusDataCredential.fromData(fields[0]!),
            name: "CommitteeVoter",
          };
        } else if (tag == 1n) {
          return {
            fields: V1Credential.isPlutusDataCredential.fromData(fields[0]!),
            name: "DRepVoter",
          };
        } else if (tag == 2n) {
          return {
            fields: V1Crypto.isPlutusDataPubKeyHash.fromData(fields[0]!),
            name: "StakePoolVoter",
          };
        } else break;
      }
      default:
        break;
    }
    throw new IsPlutusDataError("Unexpected data");
  },
};

/**
 * {@link Voter} represents the different voting options: yes, no or abstain.
 *
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.36.0.0/plutus-ledger-api/src/PlutusLedgerApi/V3/Contexts.hs#L234-L237}
 */
export type Vote =
  | { name: "VoteNo" }
  | { name: "VoteYes" }
  | { name: "Abstain" };

/**
 * {@link Eq} instance for {@link Vote}
 */
export const eqVote: Eq<Vote> = {
  eq: (l, r) => {
    return l.name === r.name;
  },
  neq: (l, r) => {
    return l.name !== r.name;
  },
};

/**
 * {@link Json} instance for {@link Vote}
 */
export const jsonVote: Json<Vote> = {
  toJson: (vote) => {
    return jsonConstructor(vote.name, []);
  },
  fromJson: (value) => {
    return caseJsonConstructor<Vote>(
      "Plutus.V3.Vote",
      {
        VoteNo: (fields) => {
          if (fields.length !== 0) {
            throw new JsonError("Expected no field");
          }
          return {
            name: "VoteNo",
          };
        },
        VoteYes: (fields) => {
          if (fields.length !== 0) {
            throw new JsonError("Expected no field");
          }
          return {
            name: "VoteYes",
          };
        },
        Abstain: (fields) => {
          if (fields.length !== 0) {
            throw new JsonError("Expected no field");
          }
          return {
            name: "Abstain",
          };
        },
      },
      value,
    );
  },
};

/**
 * {@link IsPlutusData} instance for {@link Vote}
 */
export const isPlutusDataVote: IsPlutusData<Vote> = {
  toData: (vote) => {
    switch (vote.name) {
      case "VoteNo":
        return {
          fields: [0n, []],
          name: "Constr",
        };
      case "VoteYes":
        return {
          fields: [1n, []],
          name: "Constr",
        };
      case "Abstain":
        return {
          fields: [2n, []],
          name: "Constr",
        };
    }
  },
  fromData: (value) => {
    switch (value.name) {
      case "Constr": {
        const [tag, fields] = value.fields;

        if (fields.length !== 0) break;

        if (tag === 0n) {
          return { name: "VoteNo" };
        }
        if (tag === 1n) {
          return { name: "VoteYes" };
        }
        if (tag === 2n) {
          return { name: "Abstain" };
        } else break;
      }
      default:
        break;
    }
    throw new IsPlutusDataError("Unexpected data");
  },
};

/**
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.36.0.0/plutus-ledger-api/src/PlutusLedgerApi/V3/Contexts.hs#L269-L272}
 */
export type GovernanceActionId = {
  gaidTxId: TxId;
  gaidGovActionIx: Integer;
};

/**
 * {@link Eq} instance for {@link GovernanceActionId}
 */
export const eqGovernanceActionId: Eq<GovernanceActionId> = {
  eq: (l, r) => {
    return (
      V3Tx.eqTxId.eq(l.gaidTxId, r.gaidTxId) &&
      eqInteger.eq(l.gaidGovActionIx, r.gaidGovActionIx)
    );
  },
  neq: (l, r) => {
    return (
      V3Tx.eqTxId.neq(l.gaidTxId, r.gaidTxId) ||
      eqInteger.neq(l.gaidGovActionIx, r.gaidGovActionIx)
    );
  },
};

/**
 * {@link Json} instance for {@link GovernanceActionId}
 */
export const jsonGovernanceActionId: Json<GovernanceActionId> = {
  toJson: (governanceActionId) => {
    return {
      gaidGovActionIx: jsonInteger.toJson(governanceActionId.gaidGovActionIx),
      gaidTxId: V3Tx.jsonTxId.toJson(governanceActionId.gaidTxId),
    };
  },
  fromJson: (value) => {
    const gaidGovActionIx = caseFieldWithValue(
      "gaidGovActionIx",
      jsonInteger.fromJson,
      value,
    );
    const gaidTxId = caseFieldWithValue(
      "gaidTxId",
      V3Tx.jsonTxId.fromJson,
      value,
    );

    return {
      gaidGovActionIx,
      gaidTxId,
    };
  },
};

/**
 * {@link IsPlutusData} instance for {@link GovernanceActionId}
 */
export const isPlutusDataGovernanceActionId: IsPlutusData<GovernanceActionId> =
  {
    toData: (governanceActionId) => {
      return {
        fields: [
          0n,
          [
            V3Tx.isPlutusDataTxId.toData(governanceActionId.gaidTxId),
            isPlutusDataInteger.toData(governanceActionId.gaidGovActionIx),
          ],
        ],
        name: "Constr",
      };
    },
    fromData: (value) => {
      switch (value.name) {
        case "Constr": {
          const [tag, fields] = value.fields;

          if (tag !== 0n) break;
          if (fields.length !== 2) break;

          return {
            gaidTxId: V3Tx.isPlutusDataTxId.fromData(fields[0]!),
            gaidGovActionIx: isPlutusDataInteger.fromData(fields[1]!),
          };
        }
      }

      throw new IsPlutusDataError("Unexpected data");
    },
  };

/**
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.36.0.0/plutus-ledger-api/src/PlutusLedgerApi/V3/Contexts.hs#L288-L293}
 */
export type Committee = {
  committeeMembers: Map<ColdCommitteeCredential, Integer>;
  committeeQuorum: Integer;
};

/**
 * {@link Eq} instance for {@link Committee}
 */
export const eqCommittee: Eq<Committee> = {
  eq: (l, r) => {
    return (
      AssocMap.eqMap(V1Credential.eqCredential, eqInteger).eq(
        l.committeeMembers,
        r.committeeMembers,
      ) && eqInteger.eq(l.committeeQuorum, r.committeeQuorum)
    );
  },
  neq: (l, r) => {
    return (
      AssocMap.eqMap(V1Credential.eqCredential, eqInteger).neq(
        l.committeeMembers,
        r.committeeMembers,
      ) || eqInteger.neq(l.committeeQuorum, r.committeeQuorum)
    );
  },
};

/**
 * {@link Json} instance for {@link Committee}
 */
export const jsonCommittee: Json<Committee> = {
  toJson: (committee) => {
    return {
      members: AssocMap.jsonMap(
        V1Credential.jsonCredential,
        jsonInteger,
      ).toJson(committee.committeeMembers),
      quorum: jsonInteger.toJson(committee.committeeQuorum),
    };
  },
  fromJson: (value) => {
    const committeeMembers = caseFieldWithValue(
      "members",
      AssocMap.jsonMap(V1Credential.jsonCredential, jsonInteger).fromJson,
      value,
    );
    const committeeQuorum = caseFieldWithValue(
      "quorum",
      jsonInteger.fromJson,
      value,
    );
    return {
      committeeMembers,
      committeeQuorum,
    };
  },
};

/**
 * {@link IsPlutusData} instance for {@link Committee}
 */
export const isPlutusDataCommittee: IsPlutusData<Committee> = {
  toData: (committee) => {
    return {
      fields: [
        0n,
        [
          AssocMap.isPlutusDataMap(
            V1Credential.isPlutusDataCredential,
            isPlutusDataInteger,
          ).toData(committee.committeeMembers),
          isPlutusDataInteger.toData(committee.committeeQuorum),
        ],
      ],
      name: "Constr",
    };
  },
  fromData: (value) => {
    switch (value.name) {
      case "Constr": {
        const [tag, fields] = value.fields;

        if (tag !== 0n) break;
        if (fields.length !== 2) break;

        return {
          committeeMembers: AssocMap.isPlutusDataMap(
            V1Credential.isPlutusDataCredential,
            isPlutusDataInteger,
          ).fromData(fields[0]!),
          committeeQuorum: isPlutusDataInteger.fromData(fields[1]!),
        };
      }
      default:
        break;
    }
    throw new IsPlutusDataError("Unexpected data");
  },
};

/**
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.36.0.0/plutus-ledger-api/src/PlutusLedgerApi/V3/Contexts.hs#L305}
 */
export type Constitution = {
  constitutionScript: Maybe<ScriptHash>;
};

/**
 * {@link Eq} instance for {@link Constitution}
 */
export const eqConstitution: Eq<Constitution> = {
  eq: (l, r) => {
    return eqMaybe(V1Scripts.eqScriptHash).eq(
      l.constitutionScript,
      r.constitutionScript,
    );
  },
  neq: (l, r) => {
    return eqMaybe(V1Scripts.eqScriptHash).neq(
      l.constitutionScript,
      r.constitutionScript,
    );
  },
};

/**
 * {@link Json} instance for {@link Constitution}
 */
export const jsonConstitution: Json<Constitution> = {
  toJson: (constitution) => {
    return {
      script: jsonMaybe(V1Scripts.jsonScriptHash).toJson(
        constitution.constitutionScript,
      ),
    };
  },
  fromJson: (value) => {
    const constitutionScript = caseFieldWithValue(
      "script",
      jsonMaybe(V1Scripts.jsonScriptHash).fromJson,
      value,
    );

    return {
      constitutionScript,
    };
  },
};

/**
 * {@link IsPlutusData} instance for {@link Constitution}
 */
export const isPlutusDataConstitution: IsPlutusData<Constitution> = {
  toData: (constitution) => {
    return {
      fields: [
        0n,
        [
          isPlutusDataMaybe(V1Scripts.isPlutusDataScriptHash).toData(
            constitution.constitutionScript,
          ),
        ],
      ],
      name: "Constr",
    };
  },
  fromData: (value) => {
    switch (value.name) {
      case "Constr": {
        const [tag, fields] = value.fields;

        if (tag !== 0n) break;
        if (fields.length !== 1) break;

        return {
          constitutionScript: isPlutusDataMaybe(
            V1Scripts.isPlutusDataScriptHash,
          ).fromData(fields[0]!),
        };
      }
    }
    throw new IsPlutusDataError("Unexpected data");
  },
};

/**
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.36.0.0/plutus-ledger-api/src/PlutusLedgerApi/V3/Contexts.hs#L319-L322}
 */
export type ProtocolVersion = {
  pvMajor: Integer;
  pvMinor: Integer;
};

/**
 * {@link Eq} instance for {@link ProtocolVersion}
 */
export const eqProtocolVersion: Eq<ProtocolVersion> = {
  eq: (l, r) => {
    return (
      eqInteger.eq(l.pvMajor, r.pvMajor) && eqInteger.eq(l.pvMinor, r.pvMinor)
    );
  },
  neq: (l, r) => {
    return (
      eqInteger.neq(l.pvMajor, r.pvMajor) || eqInteger.neq(l.pvMinor, r.pvMinor)
    );
  },
};

/**
 * {@link Json} instance for {@link ProtocolVersion}
 */
export const jsonProtocolVersion: Json<ProtocolVersion> = {
  toJson: (protocolVersion) => {
    return {
      major: jsonInteger.toJson(protocolVersion.pvMajor),
      minor: jsonInteger.toJson(protocolVersion.pvMinor),
    };
  },
  fromJson: (value) => {
    const pvMajor = caseFieldWithValue("major", jsonInteger.fromJson, value);
    const pvMinor = caseFieldWithValue("minor", jsonInteger.fromJson, value);
    return {
      pvMajor,
      pvMinor,
    };
  },
};

/**
 * {@link IsPlutusData} instance for {@link ProtocolVersion}
 */
export const isPlutusDataProtocolVersion: IsPlutusData<ProtocolVersion> = {
  toData: (protocolVersion) => {
    return {
      fields: [
        0n,
        [
          isPlutusDataInteger.toData(protocolVersion.pvMajor),
          isPlutusDataInteger.toData(protocolVersion.pvMinor),
        ],
      ],
      name: "Constr",
    };
  },
  fromData: (value) => {
    switch (value.name) {
      case "Constr": {
        const [tag, fields] = value.fields;

        if (tag !== 0n) break;
        if (fields.length !== 2) break;

        return {
          pvMajor: isPlutusDataInteger.fromData(fields[0]!),
          pvMinor: isPlutusDataInteger.fromData(fields[1]!),
        };
      }
    }
    throw new IsPlutusDataError("Unexpected data");
  },
};

/**
 * {@link ChangedParameters} is a Plutus Data object containing proposed parameter changes.
 *
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.36.0.0/plutus-ledger-api/src/PlutusLedgerApi/V3/Contexts.hs#L365}
 */
export type ChangedParameters = PlutusData;

export const eqChangedParameters: Eq<ChangedParameters> =
  LbPlutusData.eqPlutusData;
export const jsonChangedParameters: Json<ChangedParameters> =
  LbPlutusData.jsonPlutusData;
export const isPlutusDataChangedParameters: IsPlutusData<ChangedParameters> =
  LbPlutusData.isPlutusDataPlutusData;

/**
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.36.0.0/plutus-ledger-api/src/PlutusLedgerApi/V3/Contexts.hs#L381-L403}
 */
export type GovernanceAction =
  | {
    name: "ParameterChange";
    fields: [Maybe<GovernanceActionId>, ChangedParameters, Maybe<ScriptHash>];
  }
  | {
    name: "HardForkInitiation";
    fields: [Maybe<GovernanceActionId>, ProtocolVersion];
  }
  | {
    name: "TreasuryWithdrawal";
    fields: [Map<Credential, Lovelace>, Maybe<ScriptHash>];
  }
  | {
    name: "NoConfidence";
    fields: Maybe<GovernanceActionId>;
  }
  | {
    name: "UpdateCommittee";
    fields: [
      Maybe<GovernanceActionId>,
      List<ColdCommitteeCredential>,
      Map<ColdCommitteeCredential, Integer>,
      Rational,
    ];
  }
  | {
    name: "NewConstitution";
    fields: [Maybe<GovernanceActionId>, Constitution];
  }
  | { name: "InfoAction" };

/**
 * {@link Eq} instance for {@link GovernanceAction}
 */
export const eqGovernanceAction: Eq<GovernanceAction> = {
  eq: (l, r) => {
    if (l.name === "ParameterChange" && r.name === "ParameterChange") {
      return (
        eqMaybe(eqGovernanceActionId).eq(l.fields[0], r.fields[0]) &&
        eqPlutusData.eq(l.fields[1], r.fields[1]) &&
        eqMaybe(V1Scripts.eqScriptHash).eq(l.fields[2], r.fields[2])
      );
    } else if (
      l.name === "HardForkInitiation" &&
      r.name === "HardForkInitiation"
    ) {
      return (
        eqMaybe(eqGovernanceActionId).eq(l.fields[0], r.fields[0]) &&
        eqProtocolVersion.eq(l.fields[1], r.fields[1])
      );
    } else if (
      l.name === "TreasuryWithdrawal" &&
      r.name === "TreasuryWithdrawal"
    ) {
      return (
        AssocMap.eqMap(V1Credential.eqCredential, eqInteger).eq(
          l.fields[0],
          r.fields[0],
        ) && eqMaybe(V1Scripts.eqScriptHash).eq(l.fields[1], r.fields[1])
      );
    } else if (l.name === "NoConfidence" && r.name === "NoConfidence") {
      return eqMaybe(eqGovernanceActionId).eq(l.fields, r.fields);
    } else if (l.name === "UpdateCommittee" && r.name === "UpdateCommittee") {
      return (
        eqMaybe(eqGovernanceActionId).eq(l.fields[0], r.fields[0]) &&
        eqList(V1Credential.eqCredential).eq(l.fields[1], r.fields[1]) &&
        AssocMap.eqMap(V1Credential.eqCredential, eqInteger).eq(
          l.fields[2],
          r.fields[2],
        ) &&
        eqRational.eq(l.fields[3], r.fields[3])
      );
    } else if (l.name === "NewConstitution" && r.name === "NewConstitution") {
      return (
        eqMaybe(eqGovernanceActionId).eq(l.fields[0], r.fields[0]) &&
        eqConstitution.eq(l.fields[1], r.fields[1])
      );
    } else return false;
  },
  neq: (l, r) => {
    if (l.name === "ParameterChange" && r.name === "ParameterChange") {
      return (
        eqMaybe(eqGovernanceActionId).neq(l.fields[0], r.fields[0]) ||
        eqPlutusData.neq(l.fields[1], r.fields[1]) ||
        eqMaybe(V1Scripts.eqScriptHash).neq(l.fields[2], r.fields[2])
      );
    } else if (
      l.name === "HardForkInitiation" &&
      r.name === "HardForkInitiation"
    ) {
      return (
        eqMaybe(eqGovernanceActionId).neq(l.fields[0], r.fields[0]) ||
        eqProtocolVersion.neq(l.fields[1], r.fields[1])
      );
    } else if (
      l.name === "TreasuryWithdrawal" &&
      r.name === "TreasuryWithdrawal"
    ) {
      return (
        AssocMap.eqMap(V1Credential.eqCredential, eqInteger).neq(
          l.fields[0],
          r.fields[0],
        ) || eqMaybe(V1Scripts.eqScriptHash).neq(l.fields[1], r.fields[1])
      );
    } else if (l.name === "NoConfidence" && r.name === "NoConfidence") {
      return eqMaybe(eqGovernanceActionId).neq(l.fields, r.fields);
    } else if (l.name === "UpdateCommittee" && r.name === "UpdateCommittee") {
      return (
        eqMaybe(eqGovernanceActionId).neq(l.fields[0], r.fields[0]) ||
        eqList(V1Credential.eqCredential).neq(l.fields[1], r.fields[1]) ||
        (AssocMap.eqMap(V1Credential.eqCredential, eqInteger).neq(
          l.fields[2],
          r.fields[2],
        ) &&
          eqRational.neq(l.fields[3], r.fields[3]))
      );
    } else if (l.name === "NewConstitution" && r.name === "NewConstitution") {
      return (
        eqMaybe(eqGovernanceActionId).neq(l.fields[0], r.fields[0]) ||
        eqConstitution.neq(l.fields[1], r.fields[1])
      );
    } else return true;
  },
};

/**
 * {@link Json} instance for {@link GovernanceAction}
 */
export const jsonGovernanceAction: Json<GovernanceAction> = {
  toJson: (governanceAction) => {
    switch (governanceAction.name) {
      case "ParameterChange":
        return jsonConstructor(governanceAction.name, [
          jsonMaybe(jsonGovernanceActionId).toJson(governanceAction.fields[0]),
          jsonPlutusData.toJson(governanceAction.fields[1]),
          jsonMaybe(V1Scripts.jsonScriptHash).toJson(
            governanceAction.fields[2],
          ),
        ]);
      case "HardForkInitiation":
        return jsonConstructor(governanceAction.name, [
          jsonMaybe(jsonGovernanceActionId).toJson(governanceAction.fields[0]),
          jsonProtocolVersion.toJson(governanceAction.fields[1]),
        ]);
      case "TreasuryWithdrawal":
        return jsonConstructor(governanceAction.name, [
          AssocMap.jsonMap(V1Credential.jsonCredential, jsonInteger).toJson(
            governanceAction.fields[0],
          ),
          jsonMaybe(V1Scripts.jsonScriptHash).toJson(
            governanceAction.fields[1],
          ),
        ]);
      case "NoConfidence":
        return jsonConstructor(governanceAction.name, [
          jsonMaybe(jsonGovernanceActionId).toJson(governanceAction.fields),
        ]);
      case "UpdateCommittee":
        return jsonConstructor(governanceAction.name, [
          jsonMaybe(jsonGovernanceActionId).toJson(governanceAction.fields[0]),
          jsonList(V1Credential.jsonCredential).toJson(
            governanceAction.fields[1],
          ),
          AssocMap.jsonMap(V1Credential.jsonCredential, jsonInteger).toJson(
            governanceAction.fields[2],
          ),
          jsonRational.toJson(governanceAction.fields[3]),
        ]);
      case "NewConstitution":
        return jsonConstructor(governanceAction.name, [
          jsonMaybe(jsonGovernanceActionId).toJson(governanceAction.fields[0]),
          jsonConstitution.toJson(governanceAction.fields[1]),
        ]);
      case "InfoAction":
        return jsonConstructor(governanceAction.name, []);
    }
  },
  fromJson: (value) => {
    return caseJsonConstructor<GovernanceAction>(
      "Plutus.V3.GovernanceAction",
      {
        ParameterChange: (fields) => {
          if (fields.length != 3) throw new JsonError("Expected three fields");

          return {
            fields: [
              jsonMaybe(jsonGovernanceActionId).fromJson(fields[0]!),
              jsonPlutusData.fromJson(fields[1]!),
              jsonMaybe(V1Scripts.jsonScriptHash).fromJson(fields[2]!),
            ],
            name: "ParameterChange",
          };
        },
        HardForkInitiation: (fields) => {
          if (fields.length != 2) throw new JsonError("Expected two fields");

          return {
            fields: [
              jsonMaybe(jsonGovernanceActionId).fromJson(fields[0]!),
              jsonProtocolVersion.fromJson(fields[1]!),
            ],
            name: "HardForkInitiation",
          };
        },
        TreasuryWithdrawal: (fields) => {
          if (fields.length != 2) throw new JsonError("Expected two fields");

          return {
            fields: [
              AssocMap.jsonMap(
                V1Credential.jsonCredential,
                jsonInteger,
              ).fromJson(fields[0]!),
              jsonMaybe(V1Scripts.jsonScriptHash).fromJson(fields[1]!),
            ],
            name: "TreasuryWithdrawal",
          };
        },
        NoConfidence: (fields) => {
          if (fields.length != 1) throw new JsonError("Expected one field");

          return {
            fields: jsonMaybe(jsonGovernanceActionId).fromJson(fields[0]!),
            name: "NoConfidence",
          };
        },
        UpdateCommittee: (fields) => {
          if (fields.length != 4) throw new JsonError("Expected four fields");

          return {
            fields: [
              jsonMaybe(jsonGovernanceActionId).fromJson(fields[0]!),
              jsonList(V1Credential.jsonCredential).fromJson(fields[1]!),
              AssocMap.jsonMap(
                V1Credential.jsonCredential,
                jsonInteger,
              ).fromJson(fields[2]!),
              jsonRational.fromJson(fields[3]!),
            ],
            name: "UpdateCommittee",
          };
        },
        NewConstitution: (fields) => {
          if (fields.length != 2) throw new JsonError("Expected two fields");

          return {
            fields: [
              jsonMaybe(jsonGovernanceActionId).fromJson(fields[0]!),
              jsonConstitution.fromJson(fields[1]!),
            ],
            name: "NewConstitution",
          };
        },
        InfoAction: (fields) => {
          if (fields.length != 0) throw new JsonError("Expected no field");

          return {
            name: "InfoAction",
          };
        },
      },
      value,
    );
  },
};

/**
 * {@link IsPlutusData} instance for {@link GovernanceAction}
 */
export const isPlutusDataGovernanceAction: IsPlutusData<GovernanceAction> = {
  toData: (governanceAction) => {
    switch (governanceAction.name) {
      case "ParameterChange":
        return {
          fields: [
            0n,
            [
              isPlutusDataMaybe(isPlutusDataGovernanceActionId).toData(
                governanceAction.fields[0],
              ),
              isPlutusDataPlutusData.toData(governanceAction.fields[1]),
              isPlutusDataMaybe(V1Scripts.isPlutusDataScriptHash).toData(
                governanceAction.fields[2],
              ),
            ],
          ],
          name: "Constr",
        };
      case "HardForkInitiation":
        return {
          fields: [
            1n,
            [
              isPlutusDataMaybe(isPlutusDataGovernanceActionId).toData(
                governanceAction.fields[0],
              ),
              isPlutusDataProtocolVersion.toData(governanceAction.fields[1]),
            ],
          ],
          name: "Constr",
        };
      case "TreasuryWithdrawal":
        return {
          fields: [
            2n,
            [
              AssocMap.isPlutusDataMap(
                V1Credential.isPlutusDataCredential,
                isPlutusDataInteger,
              ).toData(governanceAction.fields[0]),
              isPlutusDataMaybe(V1Scripts.isPlutusDataScriptHash).toData(
                governanceAction.fields[1],
              ),
            ],
          ],
          name: "Constr",
        };
      case "NoConfidence":
        return {
          fields: [
            3n,
            [
              isPlutusDataMaybe(isPlutusDataGovernanceActionId).toData(
                governanceAction.fields,
              ),
            ],
          ],
          name: "Constr",
        };
      case "UpdateCommittee":
        return {
          fields: [
            4n,
            [
              isPlutusDataMaybe(isPlutusDataGovernanceActionId).toData(
                governanceAction.fields[0],
              ),
              isPlutusDataList(V1Credential.isPlutusDataCredential).toData(
                governanceAction.fields[1],
              ),
              AssocMap.isPlutusDataMap(
                V1Credential.isPlutusDataCredential,
                isPlutusDataInteger,
              ).toData(governanceAction.fields[2]),
              isPlutusDataRational.toData(governanceAction.fields[3]),
            ],
          ],
          name: "Constr",
        };
      case "NewConstitution":
        return {
          fields: [
            5n,
            [
              isPlutusDataMaybe(isPlutusDataGovernanceActionId).toData(
                governanceAction.fields[0],
              ),
              isPlutusDataConstitution.toData(governanceAction.fields[1]),
            ],
          ],
          name: "Constr",
        };
      case "InfoAction":
        return {
          fields: [6n, []],
          name: "Constr",
        };
    }
  },
  fromData: (value) => {
    switch (value.name) {
      case "Constr": {
        const [tag, fields] = value.fields;

        if (tag === 0n && fields.length === 3) {
          return {
            fields: [
              isPlutusDataMaybe(isPlutusDataGovernanceActionId).fromData(
                fields[0]!,
              ),
              isPlutusDataPlutusData.fromData(fields[1]!),
              isPlutusDataMaybe(V1Scripts.isPlutusDataScriptHash).fromData(
                fields[2]!,
              ),
            ],
            name: "ParameterChange",
          };
        } else if (tag === 1n && fields.length === 2) {
          return {
            fields: [
              isPlutusDataMaybe(isPlutusDataGovernanceActionId).fromData(
                fields[0]!,
              ),
              isPlutusDataProtocolVersion.fromData(fields[1]!),
            ],
            name: "HardForkInitiation",
          };
        } else if (tag === 2n && fields.length === 2) {
          return {
            fields: [
              AssocMap.isPlutusDataMap(
                V1Credential.isPlutusDataCredential,
                isPlutusDataInteger,
              ).fromData(fields[0]!),
              isPlutusDataMaybe(V1Scripts.isPlutusDataScriptHash).fromData(
                fields[1]!,
              ),
            ],
            name: "TreasuryWithdrawal",
          };
        } else if (tag === 3n && fields.length === 1) {
          return {
            fields: isPlutusDataMaybe(isPlutusDataGovernanceActionId).fromData(
              fields[0]!,
            ),

            name: "NoConfidence",
          };
        } else if (tag === 4n && fields.length === 4) {
          return {
            fields: [
              isPlutusDataMaybe(isPlutusDataGovernanceActionId).fromData(
                fields[0]!,
              ),
              isPlutusDataList(V1Credential.isPlutusDataCredential).fromData(
                fields[1]!,
              ),
              AssocMap.isPlutusDataMap(
                V1Credential.isPlutusDataCredential,
                isPlutusDataInteger,
              ).fromData(fields[2]!),
              isPlutusDataRational.fromData(fields[3]!),
            ],
            name: "UpdateCommittee",
          };
        } else if (tag === 5n && fields.length === 2) {
          return {
            fields: [
              isPlutusDataMaybe(isPlutusDataGovernanceActionId).fromData(
                fields[0]!,
              ),
              isPlutusDataConstitution.fromData(fields[1]!),
            ],
            name: "NewConstitution",
          };
        } else if (tag === 6n && fields.length === 0) {
          return {
            name: "InfoAction",
          };
        } else break;
      }
      default:
        break;
    }
    throw new IsPlutusDataError("Unexpected data");
  },
};

/**
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.36.0.0/plutus-ledger-api/src/PlutusLedgerApi/V3/Contexts.hs#L409-L413}
 */
export type ProposalProcedure = {
  ppDeposit: Lovelace;
  ppReturnAddr: Credential;
  ppGovernanceAction: GovernanceAction;
};

/**
 * {@link Eq} instance for {@link ProposalProcedure}
 */
export const eqProposalProcedure: Eq<ProposalProcedure> = {
  eq: (l, r) => {
    return (
      eqInteger.eq(l.ppDeposit, r.ppDeposit) &&
      V1Credential.eqCredential.eq(l.ppReturnAddr, r.ppReturnAddr) &&
      eqGovernanceAction.eq(l.ppGovernanceAction, r.ppGovernanceAction)
    );
  },
  neq: (l, r) => {
    return (
      eqInteger.neq(l.ppDeposit, r.ppDeposit) ||
      V1Credential.eqCredential.neq(l.ppReturnAddr, r.ppReturnAddr) ||
      eqGovernanceAction.neq(l.ppGovernanceAction, r.ppGovernanceAction)
    );
  },
};

/**
 * {@link Json} instance for {@link ProposalProcedure}
 */
export const jsonProposalProcedure: Json<ProposalProcedure> = {
  toJson: (proposalProcedure) => {
    return {
      deposit: jsonInteger.toJson(proposalProcedure.ppDeposit),
      governance_action: jsonGovernanceAction.toJson(
        proposalProcedure.ppGovernanceAction,
      ),
      return_addr: V1Credential.jsonCredential.toJson(
        proposalProcedure.ppReturnAddr,
      ),
    };
  },
  fromJson: (value) => {
    const ppDeposit = caseFieldWithValue(
      "deposit",
      jsonInteger.fromJson,
      value,
    );
    const ppGovernanceAction = caseFieldWithValue(
      "governance_action",
      jsonGovernanceAction.fromJson,
      value,
    );
    const ppReturnAddr = caseFieldWithValue(
      "return_addr",
      V1Credential.jsonCredential.fromJson,
      value,
    );

    return {
      ppDeposit,
      ppGovernanceAction,
      ppReturnAddr,
    };
  },
};

/**
 * {@link IsPlutusData} instance for {@link ProposalProcedure}
 */
export const isPlutusDataProposalProcedure: IsPlutusData<ProposalProcedure> = {
  toData: (protocolProcedure) => {
    return {
      fields: [
        0n,
        [
          isPlutusDataInteger.toData(protocolProcedure.ppDeposit),
          V1Credential.isPlutusDataCredential.toData(
            protocolProcedure.ppReturnAddr,
          ),
          isPlutusDataGovernanceAction.toData(
            protocolProcedure.ppGovernanceAction,
          ),
        ],
      ],
      name: "Constr",
    };
  },
  fromData: (value) => {
    switch (value.name) {
      case "Constr": {
        const [tag, fields] = value.fields;

        if (tag !== 0n) break;
        if (fields.length !== 3) break;

        return {
          ppDeposit: isPlutusDataInteger.fromData(fields[0]!),
          ppReturnAddr: V1Credential.isPlutusDataCredential.fromData(
            fields[1]!,
          ),
          ppGovernanceAction: isPlutusDataGovernanceAction.fromData(fields[2]!),
        };
      }
    }
    throw new IsPlutusDataError("Unexpected data");
  },
};

/**
 * {@link ScriptPurpose} uniquely identifies a Plutus script within a transaction.
 *
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.36.0.0/plutus-ledger-api/src/PlutusLedgerApi/V3/Contexts.hs#L426-L438}
 */
export type ScriptPurpose =
  | { name: "Minting"; fields: CurrencySymbol }
  | { name: "Spending"; fields: TxOutRef }
  | { name: "Rewarding"; fields: Credential }
  | { name: "Certifying"; fields: [Integer, TxCert] }
  | { name: "Voting"; fields: Voter }
  | { name: "Proposing"; fields: [Integer, ProposalProcedure] };

/**
 * {@link Eq} instance for {@link ScriptPurpose}
 */
export const eqScriptPurpose: Eq<ScriptPurpose> = {
  eq: (l, r) => {
    if (l.name === "Minting" && r.name === "Minting") {
      return V1Value.eqCurrencySymbol.eq(l.fields, r.fields);
    } else if (l.name === "Spending" && r.name === "Spending") {
      return V3Tx.eqTxOutRef.eq(l.fields, r.fields);
    } else if (l.name === "Rewarding" && r.name === "Rewarding") {
      return V1Credential.eqCredential.eq(l.fields, r.fields);
    } else if (l.name === "Certifying" && r.name === "Certifying") {
      return (
        eqInteger.eq(l.fields[0], r.fields[0]) &&
        eqTxCert.eq(l.fields[1], r.fields[1])
      );
    } else if (l.name === "Voting" && r.name === "Voting") {
      return eqVoter.eq(l.fields, r.fields);
    } else if (l.name === "Proposing" && r.name === "Proposing") {
      return (
        eqInteger.eq(l.fields[0], r.fields[0]) &&
        eqProposalProcedure.eq(l.fields[1], r.fields[1])
      );
    } else return false;
  },
  neq: (l, r) => {
    if (l.name === "Minting" && r.name === "Minting") {
      return V1Value.eqCurrencySymbol.neq(l.fields, r.fields);
    } else if (l.name === "Spending" && r.name === "Spending") {
      return V3Tx.eqTxOutRef.neq(l.fields, r.fields);
    } else if (l.name === "Rewarding" && r.name === "Rewarding") {
      return V1Credential.eqCredential.neq(l.fields, r.fields);
    } else if (l.name === "Certifying" && r.name === "Certifying") {
      return (
        eqInteger.neq(l.fields[0], r.fields[0]) ||
        eqTxCert.neq(l.fields[1], r.fields[1])
      );
    } else if (l.name === "Voting" && r.name === "Voting") {
      return eqVoter.neq(l.fields, r.fields);
    } else if (l.name === "Proposing" && r.name === "Proposing") {
      return (
        eqInteger.neq(l.fields[0], r.fields[0]) ||
        eqProposalProcedure.neq(l.fields[1], r.fields[1])
      );
    } else return true;
  },
};

/**
 * {@link Json} instance for {@link ScriptPurpose}
 */
export const jsonScriptPurpose: Json<ScriptPurpose> = {
  toJson: (scriptPurpose) => {
    switch (scriptPurpose.name) {
      case "Minting":
        return jsonConstructor(scriptPurpose.name, [
          V1Value.jsonCurrencySymbol.toJson(scriptPurpose.fields),
        ]);
      case "Spending":
        return jsonConstructor(scriptPurpose.name, [
          V3Tx.jsonTxOutRef.toJson(scriptPurpose.fields),
        ]);
      case "Rewarding":
        return jsonConstructor(scriptPurpose.name, [
          V1Credential.jsonCredential.toJson(scriptPurpose.fields),
        ]);
      case "Certifying":
        return jsonConstructor(scriptPurpose.name, [
          jsonInteger.toJson(scriptPurpose.fields[0]),
          jsonTxCert.toJson(scriptPurpose.fields[1]),
        ]);
      case "Voting":
        return jsonConstructor(scriptPurpose.name, [
          jsonVoter.toJson(scriptPurpose.fields),
        ]);
      case "Proposing":
        return jsonConstructor(scriptPurpose.name, [
          jsonInteger.toJson(scriptPurpose.fields[0]),
          jsonProposalProcedure.toJson(scriptPurpose.fields[1]),
        ]);
    }
  },
  fromJson: (value) => {
    return caseJsonConstructor<ScriptPurpose>(
      "Plutus,V3.ScriptPurpose",
      {
        Minting: (fields) => {
          if (fields.length !== 1) {
            throw new JsonError("Expected one field");
          }
          return {
            fields: V1Value.jsonCurrencySymbol.fromJson(fields[0]!),
            name: "Minting",
          };
        },
        Spending: (fields) => {
          if (fields.length !== 1) {
            throw new JsonError("Expected one field");
          }
          return {
            fields: V3Tx.jsonTxOutRef.fromJson(fields[0]!),
            name: "Spending",
          };
        },
        Rewarding: (fields) => {
          if (fields.length !== 1) {
            throw new JsonError("Expected one field");
          }
          return {
            fields: V1Credential.jsonCredential.fromJson(fields[0]!),
            name: "Rewarding",
          };
        },
        Certifying: (fields) => {
          if (fields.length !== 2) {
            throw new JsonError("Expected two fields");
          }
          return {
            fields: [
              jsonInteger.fromJson(fields[0]!),
              jsonTxCert.fromJson(fields[1]!),
            ],
            name: "Certifying",
          };
        },
        Voting: (fields) => {
          if (fields.length !== 1) {
            throw new JsonError("Expected one field");
          }

          return {
            fields: jsonVoter.fromJson(fields[0]!),
            name: "Voting",
          };
        },
        Proposing: (fields) => {
          if (fields.length !== 2) {
            throw new JsonError("Expected two fields");
          }

          return {
            fields: [
              jsonInteger.fromJson(fields[0]!),
              jsonProposalProcedure.fromJson(fields[1]!),
            ],
            name: "Proposing",
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
            [V1Value.isPlutusDataCurrencySymbol.toData(scriptPurpose.fields)],
          ],
          name: "Constr",
        };
      case "Spending":
        return {
          fields: [
            1n,
            [V3Tx.isPlutusDataTxOutRef.toData(scriptPurpose.fields)],
          ],
          name: "Constr",
        };
      case "Rewarding":
        return {
          fields: [
            2n,
            [V1Credential.isPlutusDataCredential.toData(scriptPurpose.fields)],
          ],
          name: "Constr",
        };
      case "Certifying":
        return {
          fields: [
            3n,
            [
              isPlutusDataInteger.toData(scriptPurpose.fields[0]),
              isPlutusDataTxCert.toData(scriptPurpose.fields[1]),
            ],
          ],
          name: "Constr",
        };
      case "Voting":
        return {
          fields: [4n, [isPlutusDataVoter.toData(scriptPurpose.fields)]],
          name: "Constr",
        };
      case "Proposing":
        return {
          fields: [
            5n,
            [
              isPlutusDataInteger.toData(scriptPurpose.fields[0]),
              isPlutusDataProposalProcedure.toData(scriptPurpose.fields[1]),
            ],
          ],
          name: "Constr",
        };
    }
  },
  fromData: (value) => {
    switch (value.name) {
      case "Constr": {
        const [tag, fields] = value.fields;

        if (tag === 0n && fields.length === 1) {
          return {
            fields: V1Value.isPlutusDataCurrencySymbol.fromData(fields[0]!),
            name: "Minting",
          };
        } else if (tag === 1n && fields.length === 1) {
          return {
            fields: V3Tx.isPlutusDataTxOutRef.fromData(fields[0]!),
            name: "Spending",
          };
        } else if (tag === 2n && fields.length === 1) {
          return {
            fields: V1Credential.isPlutusDataCredential.fromData(fields[0]!),
            name: "Rewarding",
          };
        } else if (tag === 3n && fields.length === 2) {
          return {
            fields: [
              isPlutusDataInteger.fromData(fields[0]!),
              isPlutusDataTxCert.fromData(fields[1]!),
            ],
            name: "Certifying",
          };
        } else if (tag === 4n && fields.length === 1) {
          return {
            fields: isPlutusDataVoter.fromData(fields[0]!),
            name: "Voting",
          };
        } else if (tag === 5n && fields.length === 2) {
          return {
            fields: [
              isPlutusDataInteger.fromData(fields[0]!),
              isPlutusDataProposalProcedure.fromData(fields[1]!),
            ],
            name: "Proposing",
          };
        } else break;
      }
      default:
        break;
    }
    throw new IsPlutusDataError("Unexpected data");
  },
};

/**
 * {@link ScriptInfo} is like {@link ScriptPurpose} but with an optional datum for spending scripts.
 *
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.36.0.0/plutus-ledger-api/src/PlutusLedgerApi/V3/Contexts.hs#L444-L456}
 */
export type ScriptInfo =
  | { name: "Minting"; fields: CurrencySymbol }
  | { name: "Spending"; fields: [TxOutRef, Maybe<Datum>] }
  | { name: "Rewarding"; fields: Credential }
  | { name: "Certifying"; fields: [Integer, TxCert] }
  | { name: "Voting"; fields: Voter }
  | { name: "Proposing"; fields: [Integer, ProposalProcedure] };

/**
 * {@link Eq} instance for {@link ScriptInfo}
 */
export const eqScriptInfo: Eq<ScriptInfo> = {
  eq: (l, r) => {
    if (l.name === "Minting" && r.name === "Minting") {
      return V1Value.eqCurrencySymbol.eq(l.fields, r.fields);
    } else if (l.name === "Spending" && r.name === "Spending") {
      return (
        V3Tx.eqTxOutRef.eq(l.fields[0], r.fields[0]) &&
        eqMaybe(V1Scripts.eqDatum).eq(l.fields[1], r.fields[1])
      );
    } else if (l.name === "Rewarding" && r.name === "Rewarding") {
      return V1Credential.eqCredential.eq(l.fields, r.fields);
    } else if (l.name === "Certifying" && r.name === "Certifying") {
      return (
        eqInteger.eq(l.fields[0], r.fields[0]) &&
        eqTxCert.eq(l.fields[1], r.fields[1])
      );
    } else if (l.name === "Voting" && r.name === "Voting") {
      return eqVoter.eq(l.fields, r.fields);
    } else if (l.name === "Proposing" && r.name === "Proposing") {
      return (
        eqInteger.eq(l.fields[0], r.fields[0]) &&
        eqProposalProcedure.eq(l.fields[1], r.fields[1])
      );
    } else return false;
  },
  neq: (l, r) => {
    if (l.name === "Minting" && r.name === "Minting") {
      return V1Value.eqCurrencySymbol.neq(l.fields, r.fields);
    } else if (l.name === "Spending" && r.name === "Spending") {
      return (
        V3Tx.eqTxOutRef.neq(l.fields[0], r.fields[0]) ||
        eqMaybe(V1Scripts.eqDatum).neq(l.fields[1], r.fields[1])
      );
    } else if (l.name === "Rewarding" && r.name === "Rewarding") {
      return V1Credential.eqCredential.neq(l.fields, r.fields);
    } else if (l.name === "Certifying" && r.name === "Certifying") {
      return (
        eqInteger.neq(l.fields[0], r.fields[0]) ||
        eqTxCert.neq(l.fields[1], r.fields[1])
      );
    } else if (l.name === "Voting" && r.name === "Voting") {
      return eqVoter.neq(l.fields, r.fields);
    } else if (l.name === "Proposing" && r.name === "Proposing") {
      return (
        eqInteger.neq(l.fields[0], r.fields[0]) ||
        eqProposalProcedure.neq(l.fields[1], r.fields[1])
      );
    } else return true;
  },
};

/**
 * {@link Json} instance for {@link ScriptInfo}
 */
export const jsonScriptInfo: Json<ScriptInfo> = {
  toJson: (scriptPurpose) => {
    switch (scriptPurpose.name) {
      case "Minting":
        return jsonConstructor(scriptPurpose.name, [
          V1Value.jsonCurrencySymbol.toJson(scriptPurpose.fields),
        ]);
      case "Spending":
        return jsonConstructor(scriptPurpose.name, [
          V3Tx.jsonTxOutRef.toJson(scriptPurpose.fields[0]),
          jsonMaybe(V1Scripts.jsonDatum).toJson(scriptPurpose.fields[1]),
        ]);
      case "Rewarding":
        return jsonConstructor(scriptPurpose.name, [
          V1Credential.jsonCredential.toJson(scriptPurpose.fields),
        ]);
      case "Certifying":
        return jsonConstructor(scriptPurpose.name, [
          jsonInteger.toJson(scriptPurpose.fields[0]),
          jsonTxCert.toJson(scriptPurpose.fields[1]),
        ]);
      case "Voting":
        return jsonConstructor(scriptPurpose.name, [
          jsonVoter.toJson(scriptPurpose.fields),
        ]);
      case "Proposing":
        return jsonConstructor(scriptPurpose.name, [
          jsonInteger.toJson(scriptPurpose.fields[0]),
          jsonProposalProcedure.toJson(scriptPurpose.fields[1]),
        ]);
    }
  },
  fromJson: (value) => {
    return caseJsonConstructor<ScriptInfo>(
      "Plutus,V3.ScriptPurpose",
      {
        Minting: (fields) => {
          if (fields.length !== 1) {
            throw new JsonError("Expected one field");
          }
          return {
            fields: V1Value.jsonCurrencySymbol.fromJson(fields[0]!),
            name: "Minting",
          };
        },
        Spending: (fields) => {
          if (fields.length !== 2) {
            throw new JsonError("Expected two fields");
          }
          return {
            fields: [
              V3Tx.jsonTxOutRef.fromJson(fields[0]!),
              jsonMaybe(V1Scripts.jsonDatum).fromJson(fields[1]!),
            ],
            name: "Spending",
          };
        },
        Rewarding: (fields) => {
          if (fields.length !== 1) {
            throw new JsonError("Expected one field");
          }
          return {
            fields: V1Credential.jsonCredential.fromJson(fields[0]!),
            name: "Rewarding",
          };
        },
        Certifying: (fields) => {
          if (fields.length !== 2) {
            throw new JsonError("Expected two fields");
          }
          return {
            fields: [
              jsonInteger.fromJson(fields[0]!),
              jsonTxCert.fromJson(fields[1]!),
            ],
            name: "Certifying",
          };
        },
        Voting: (fields) => {
          if (fields.length !== 1) {
            throw new JsonError("Expected one field");
          }

          return {
            fields: jsonVoter.fromJson(fields[0]!),
            name: "Voting",
          };
        },
        Proposing: (fields) => {
          if (fields.length !== 2) {
            throw new JsonError("Expected two fields");
          }

          return {
            fields: [
              jsonInteger.fromJson(fields[0]!),
              jsonProposalProcedure.fromJson(fields[1]!),
            ],
            name: "Proposing",
          };
        },
      },
      value,
    );
  },
};

/**
 * {@link IsPlutusData} instance for {@link ScriptInfo}
 */
export const isPlutusDataScriptInfo: IsPlutusData<ScriptInfo> = {
  toData: (scriptPurpose) => {
    switch (scriptPurpose.name) {
      case "Minting":
        return {
          fields: [
            0n,
            [V1Value.isPlutusDataCurrencySymbol.toData(scriptPurpose.fields)],
          ],
          name: "Constr",
        };
      case "Spending":
        return {
          fields: [
            1n,
            [
              V3Tx.isPlutusDataTxOutRef.toData(scriptPurpose.fields[0]),
              isPlutusDataMaybe(V1Scripts.isPlutusDataDatum).toData(
                scriptPurpose.fields[1],
              ),
            ],
          ],
          name: "Constr",
        };
      case "Rewarding":
        return {
          fields: [
            2n,
            [V1Credential.isPlutusDataCredential.toData(scriptPurpose.fields)],
          ],
          name: "Constr",
        };
      case "Certifying":
        return {
          fields: [
            3n,
            [
              isPlutusDataInteger.toData(scriptPurpose.fields[0]),
              isPlutusDataTxCert.toData(scriptPurpose.fields[1]),
            ],
          ],
          name: "Constr",
        };
      case "Voting":
        return {
          fields: [4n, [isPlutusDataVoter.toData(scriptPurpose.fields)]],
          name: "Constr",
        };
      case "Proposing":
        return {
          fields: [
            5n,
            [
              isPlutusDataInteger.toData(scriptPurpose.fields[0]),
              isPlutusDataProposalProcedure.toData(scriptPurpose.fields[1]),
            ],
          ],
          name: "Constr",
        };
    }
  },
  fromData: (value) => {
    switch (value.name) {
      case "Constr": {
        const [tag, fields] = value.fields;

        if (tag === 0n && fields.length === 1) {
          return {
            fields: V1Value.isPlutusDataCurrencySymbol.fromData(fields[0]!),
            name: "Minting",
          };
        } else if (tag === 1n && fields.length === 2) {
          return {
            fields: [
              V3Tx.isPlutusDataTxOutRef.fromData(fields[0]!),
              isPlutusDataMaybe(V1Scripts.isPlutusDataDatum).fromData(
                fields[1]!,
              ),
            ],
            name: "Spending",
          };
        } else if (tag === 2n && fields.length === 1) {
          return {
            fields: V1Credential.isPlutusDataCredential.fromData(fields[0]!),
            name: "Rewarding",
          };
        } else if (tag === 3n && fields.length === 2) {
          return {
            fields: [
              isPlutusDataInteger.fromData(fields[0]!),
              isPlutusDataTxCert.fromData(fields[1]!),
            ],
            name: "Certifying",
          };
        } else if (tag === 4n && fields.length === 1) {
          return {
            fields: isPlutusDataVoter.fromData(fields[0]!),
            name: "Voting",
          };
        } else if (tag === 5n && fields.length === 2) {
          return {
            fields: [
              isPlutusDataInteger.fromData(fields[0]!),
              isPlutusDataProposalProcedure.fromData(fields[1]!),
            ],
            name: "Proposing",
          };
        } else break;
      }
      default:
        break;
    }
    throw new IsPlutusDataError("Unexpected data");
  },
};

/**
 * {@link TxInfo} represents a pending transaction. This is the view as seen by
 * validator scripts, so some details are stripped out.
 *
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.36.0.0/plutus-ledger-api/src/PlutusLedgerApi/V3/Contexts.hs#L478-L499}
 */
export type TxInfo = {
  txInfoInputs: TxInInfo[];
  txInfoReferenceInputs: TxInInfo[];
  txInfoOutputs: TxOut[];
  txInfoFee: Lovelace;
  txInfoMint: Value;
  txInfoTxCerts: TxCert[];
  txInfoWdrl: Map<Credential, Lovelace>;
  txInfoValidRange: POSIXTimeRange;
  txInfoSignatories: PubKeyHash[];
  txInfoRedeemers: Map<ScriptPurpose, Redeemer>;
  txInfoData: Map<DatumHash, Datum>;
  txInfoId: TxId;
  txInfoVotes: Map<Voter, Map<GovernanceActionId, Vote>>;
  txInfoProposalProcedures: ProposalProcedure[];
  txInfoCurrentTreasuryAmount: Maybe<Lovelace>;
  txInfoTreasuryDonation: Maybe<Lovelace>;
};

/**
 * {@link Eq} instance for {@link TxInfo}
 */
export const eqTxInfo: Eq<TxInfo> = {
  eq: (l, r) => {
    return (
      eqList(V2Contexts.eqTxInInfo).eq(l.txInfoInputs, r.txInfoInputs) &&
      eqList(V2Contexts.eqTxInInfo).eq(
        l.txInfoReferenceInputs,
        r.txInfoReferenceInputs,
      ) &&
      eqList(V2Tx.eqTxOut).eq(l.txInfoOutputs, r.txInfoOutputs) &&
      eqInteger.eq(l.txInfoFee, r.txInfoFee) &&
      V1Value.eqValue.eq(l.txInfoMint, r.txInfoMint) &&
      eqList(eqTxCert).eq(l.txInfoTxCerts, r.txInfoTxCerts) &&
      AssocMap.eqMap(V1Credential.eqCredential, eqInteger).eq(
        l.txInfoWdrl,
        r.txInfoWdrl,
      ) &&
      V1Time.eqPOSIXTimeRange.eq(l.txInfoValidRange, r.txInfoValidRange) &&
      eqList(V1Crypto.eqPubKeyHash).eq(
        l.txInfoSignatories,
        r.txInfoSignatories,
      ) &&
      AssocMap.eqMap(eqScriptPurpose, V1Scripts.eqRedeemer).eq(
        l.txInfoRedeemers,
        r.txInfoRedeemers,
      ) &&
      AssocMap.eqMap(V1Scripts.eqDatumHash, V1Scripts.eqDatum).eq(
        l.txInfoData,
        r.txInfoData,
      ) &&
      V3Tx.eqTxId.eq(l.txInfoId, r.txInfoId) &&
      AssocMap.eqMap(eqVoter, AssocMap.eqMap(eqGovernanceActionId, eqVote)).eq(
        l.txInfoVotes,
        r.txInfoVotes,
      ) &&
      eqList(eqProposalProcedure).eq(
        l.txInfoProposalProcedures,
        r.txInfoProposalProcedures,
      ) &&
      eqMaybe(eqInteger).eq(
        l.txInfoCurrentTreasuryAmount,
        r.txInfoCurrentTreasuryAmount,
      ) &&
      eqMaybe(eqInteger).eq(l.txInfoTreasuryDonation, r.txInfoTreasuryDonation)
    );
  },
  neq: (l, r) => {
    return (
      eqList(V2Contexts.eqTxInInfo).neq(l.txInfoInputs, r.txInfoInputs) ||
      eqList(V2Contexts.eqTxInInfo).neq(
        l.txInfoReferenceInputs,
        r.txInfoReferenceInputs,
      ) ||
      eqList(V2Tx.eqTxOut).neq(l.txInfoOutputs, r.txInfoOutputs) ||
      eqInteger.neq(l.txInfoFee, r.txInfoFee) ||
      V1Value.eqValue.neq(l.txInfoMint, r.txInfoMint) ||
      eqList(eqTxCert).neq(l.txInfoTxCerts, r.txInfoTxCerts) ||
      AssocMap.eqMap(V1Credential.eqCredential, eqInteger).neq(
        l.txInfoWdrl,
        r.txInfoWdrl,
      ) ||
      V1Time.eqPOSIXTimeRange.neq(l.txInfoValidRange, r.txInfoValidRange) ||
      eqList(V1Crypto.eqPubKeyHash).neq(
        l.txInfoSignatories,
        r.txInfoSignatories,
      ) ||
      AssocMap.eqMap(eqScriptPurpose, V1Scripts.eqRedeemer).neq(
        l.txInfoRedeemers,
        r.txInfoRedeemers,
      ) ||
      AssocMap.eqMap(V1Scripts.eqDatumHash, V1Scripts.eqDatum).neq(
        l.txInfoData,
        r.txInfoData,
      ) ||
      V3Tx.eqTxId.neq(l.txInfoId, r.txInfoId) ||
      AssocMap.eqMap(eqVoter, AssocMap.eqMap(eqGovernanceActionId, eqVote)).neq(
        l.txInfoVotes,
        r.txInfoVotes,
      ) ||
      eqList(eqProposalProcedure).neq(
        l.txInfoProposalProcedures,
        r.txInfoProposalProcedures,
      ) ||
      eqMaybe(eqInteger).neq(
        l.txInfoCurrentTreasuryAmount,
        r.txInfoCurrentTreasuryAmount,
      ) ||
      eqMaybe(eqInteger).neq(l.txInfoTreasuryDonation, r.txInfoTreasuryDonation)
    );
  },
};

/**
 * {@link Json} instance for {@link TxInfo}
 */
export const jsonTxInfo: Json<TxInfo> = {
  toJson: (txInfo) => {
    return {
      current_treasury_amount: jsonMaybe(jsonInteger).toJson(
        txInfo.txInfoCurrentTreasuryAmount,
      ),
      datums: AssocMap.jsonMap(
        V1Scripts.jsonDatumHash,
        V1Scripts.jsonDatum,
      ).toJson(txInfo.txInfoData),
      fee: jsonInteger.toJson(txInfo.txInfoFee),
      id: V3Tx.jsonTxId.toJson(txInfo.txInfoId),
      inputs: jsonList(V2Contexts.jsonTxInInfo).toJson(txInfo.txInfoInputs),
      mint: V1Value.jsonValue.toJson(txInfo.txInfoMint),
      outputs: jsonList(V2Tx.jsonTxOut).toJson(txInfo.txInfoOutputs),
      proposal_procedures: jsonList(jsonProposalProcedure).toJson(
        txInfo.txInfoProposalProcedures,
      ),
      redeemers: AssocMap.jsonMap(
        jsonScriptPurpose,
        V1Scripts.jsonRedeemer,
      ).toJson(txInfo.txInfoRedeemers),
      reference_inputs: jsonList(V2Contexts.jsonTxInInfo).toJson(
        txInfo.txInfoReferenceInputs,
      ),
      signatories: jsonList(V1Crypto.jsonPubKeyHash).toJson(
        txInfo.txInfoSignatories,
      ),
      treasury_donation: jsonMaybe(jsonInteger).toJson(
        txInfo.txInfoTreasuryDonation,
      ),
      tx_certs: jsonList(jsonTxCert).toJson(txInfo.txInfoTxCerts),
      valid_range: V1Time.jsonPOSIXTimeRange.toJson(txInfo.txInfoValidRange),
      votes: AssocMap.jsonMap(
        jsonVoter,
        AssocMap.jsonMap(jsonGovernanceActionId, jsonVote),
      ).toJson(txInfo.txInfoVotes),
      wdrl: AssocMap.jsonMap(V1Credential.jsonCredential, jsonInteger).toJson(
        txInfo.txInfoWdrl,
      ),
    };
  },
  fromJson: (value) => {
    const txInfoInputs = caseFieldWithValue(
      "inputs",
      jsonList(V2Contexts.jsonTxInInfo).fromJson,
      value,
    );
    const txInfoReferenceInputs = caseFieldWithValue(
      "reference_inputs",
      jsonList(V2Contexts.jsonTxInInfo).fromJson,
      value,
    );
    const txInfoOutputs = caseFieldWithValue(
      "outputs",
      jsonList(V2Tx.jsonTxOut).fromJson,
      value,
    );
    const txInfoFee = caseFieldWithValue("fee", jsonInteger.fromJson, value);
    const txInfoMint = caseFieldWithValue(
      "mint",
      V1Value.jsonValue.fromJson,
      value,
    );
    const txInfoTxCerts = caseFieldWithValue(
      "tx_certs",
      jsonList(jsonTxCert).fromJson,
      value,
    );
    const txInfoWdrl = caseFieldWithValue(
      "wdrl",
      AssocMap.jsonMap(V1Credential.jsonCredential, jsonInteger).fromJson,
      value,
    );
    const txInfoValidRange = caseFieldWithValue(
      "valid_range",
      V1Time.jsonPOSIXTimeRange.fromJson,
      value,
    );

    const txInfoSignatories = caseFieldWithValue(
      "signatories",
      jsonList(V1Crypto.jsonPubKeyHash).fromJson,
      value,
    );

    const txInfoRedeemers = caseFieldWithValue(
      "redeemers",
      AssocMap.jsonMap(jsonScriptPurpose, V1Scripts.jsonRedeemer).fromJson,
      value,
    );

    const txInfoData = caseFieldWithValue(
      "datums",
      AssocMap.jsonMap(V1Scripts.jsonDatumHash, V1Scripts.jsonDatum).fromJson,
      value,
    );

    const txInfoId = caseFieldWithValue("id", V3Tx.jsonTxId.fromJson, value);

    const txInfoVotes = caseFieldWithValue(
      "votes",
      AssocMap.jsonMap(
        jsonVoter,
        AssocMap.jsonMap(jsonGovernanceActionId, jsonVote),
      ).fromJson,
      value,
    );

    const txInfoProposalProcedures = caseFieldWithValue(
      "proposal_procedures",
      jsonList(jsonProposalProcedure).fromJson,
      value,
    );

    const txInfoCurrentTreasuryAmount = caseFieldWithValue(
      "current_treasury_amount",
      jsonMaybe(jsonInteger).fromJson,
      value,
    );

    const txInfoTreasuryDonation = caseFieldWithValue(
      "treasury_donation",
      jsonMaybe(jsonInteger).fromJson,
      value,
    );

    return {
      txInfoInputs,
      txInfoReferenceInputs,
      txInfoOutputs,
      txInfoFee,
      txInfoMint,
      txInfoTxCerts,
      txInfoWdrl,
      txInfoValidRange,
      txInfoSignatories,
      txInfoRedeemers,
      txInfoData,
      txInfoId,
      txInfoVotes,
      txInfoProposalProcedures,
      txInfoCurrentTreasuryAmount,
      txInfoTreasuryDonation,
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
          isPlutusDataList(V2Contexts.isPlutusDataTxInInfo).toData(
            txInfo.txInfoInputs,
          ),
          isPlutusDataList(V2Contexts.isPlutusDataTxInInfo).toData(
            txInfo.txInfoReferenceInputs,
          ),
          isPlutusDataList(V2Tx.isPlutusDataTxOut).toData(txInfo.txInfoOutputs),
          isPlutusDataInteger.toData(txInfo.txInfoFee),
          V1Value.isPlutusDataValue.toData(txInfo.txInfoMint),
          isPlutusDataList(isPlutusDataTxCert).toData(txInfo.txInfoTxCerts),
          AssocMap.isPlutusDataMap(
            V1Credential.isPlutusDataCredential,
            isPlutusDataInteger,
          ).toData(txInfo.txInfoWdrl),
          V1Time.isPlutusDataPOSIXTimeRange.toData(txInfo.txInfoValidRange),
          isPlutusDataList(V1Crypto.isPlutusDataPubKeyHash).toData(
            txInfo.txInfoSignatories,
          ),
          AssocMap.isPlutusDataMap(
            isPlutusDataScriptPurpose,
            V1Scripts.isPlutusDataRedeemer,
          ).toData(txInfo.txInfoRedeemers),
          AssocMap.isPlutusDataMap(
            V1Scripts.isPlutusDataDatumHash,
            V1Scripts.isPlutusDataDatum,
          ).toData(txInfo.txInfoData),
          V3Tx.isPlutusDataTxId.toData(txInfo.txInfoId),
          AssocMap.isPlutusDataMap(
            isPlutusDataVoter,
            AssocMap.isPlutusDataMap(
              isPlutusDataGovernanceActionId,
              isPlutusDataVote,
            ),
          ).toData(txInfo.txInfoVotes),
          isPlutusDataList(isPlutusDataProposalProcedure).toData(
            txInfo.txInfoProposalProcedures,
          ),
          isPlutusDataMaybe(isPlutusDataInteger).toData(
            txInfo.txInfoCurrentTreasuryAmount,
          ),
          isPlutusDataMaybe(isPlutusDataInteger).toData(
            txInfo.txInfoTreasuryDonation,
          ),
        ],
      ],
      name: "Constr",
    };
  },

  fromData: (plutusData) => {
    switch (plutusData.name) {
      case "Constr": {
        if (plutusData.fields[0] === 0n && plutusData.fields[1].length === 16) {
          const txInfoInputs = isPlutusDataList(
            V2Contexts.isPlutusDataTxInInfo,
          ).fromData(plutusData.fields[1][0]!);
          const txInfoReferenceInputs = isPlutusDataList(
            V2Contexts.isPlutusDataTxInInfo,
          ).fromData(plutusData.fields[1][1]!);
          const txInfoOutputs = isPlutusDataList(
            V2Tx.isPlutusDataTxOut,
          ).fromData(plutusData.fields[1][2]!);
          const txInfoFee = isPlutusDataInteger.fromData(
            plutusData.fields[1][3]!,
          );
          const txInfoMint = V1Value.isPlutusDataValue.fromData(
            plutusData.fields[1][4]!,
          );
          const txInfoTxCerts = isPlutusDataList(isPlutusDataTxCert).fromData(
            plutusData.fields[1][5]!,
          );
          const txInfoWdrl = AssocMap.isPlutusDataMap(
            V1Credential.isPlutusDataCredential,
            isPlutusDataInteger,
          ).fromData(plutusData.fields[1][6]!);
          const txInfoValidRange = V1Time.isPlutusDataPOSIXTimeRange.fromData(
            plutusData.fields[1][7]!,
          );
          const txInfoSignatories = isPlutusDataList(
            V1Crypto.isPlutusDataPubKeyHash,
          ).fromData(plutusData.fields[1][8]!);
          const txInfoRedeemers = AssocMap.isPlutusDataMap(
            isPlutusDataScriptPurpose,
            V1Scripts.isPlutusDataRedeemer,
          ).fromData(plutusData.fields[1][9]!);
          const txInfoData = AssocMap.isPlutusDataMap(
            V1Scripts.isPlutusDataDatumHash,
            V1Scripts.isPlutusDataDatum,
          ).fromData(plutusData.fields[1][10]!);
          const txInfoId = V3Tx.isPlutusDataTxId.fromData(
            plutusData.fields[1][11]!,
          );
          const txInfoVotes = AssocMap.isPlutusDataMap(
            isPlutusDataVoter,
            AssocMap.isPlutusDataMap(
              isPlutusDataGovernanceActionId,
              isPlutusDataVote,
            ),
          ).fromData(plutusData.fields[1][12]!);
          const txInfoProposalProcedures = isPlutusDataList(
            isPlutusDataProposalProcedure,
          ).fromData(plutusData.fields[1][13]!);
          const txInfoCurrentTreasuryAmount = isPlutusDataMaybe(
            isPlutusDataInteger,
          ).fromData(plutusData.fields[1][14]!);
          const txInfoTreasuryDonation = isPlutusDataMaybe(
            isPlutusDataInteger,
          ).fromData(plutusData.fields[1][15]!);

          return {
            txInfoInputs,
            txInfoReferenceInputs,
            txInfoOutputs,
            txInfoFee,
            txInfoMint,
            txInfoTxCerts,
            txInfoWdrl,
            txInfoValidRange,
            txInfoSignatories,
            txInfoRedeemers,
            txInfoData,
            txInfoId,
            txInfoVotes,
            txInfoProposalProcedures,
            txInfoCurrentTreasuryAmount,
            txInfoTreasuryDonation,
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
      V3Tx.eqTxOutRef.eq(l.txInInfoOutRef, r.txInInfoOutRef) &&
      V2Tx.eqTxOut.eq(l.txInInfoResolved, r.txInInfoResolved)
    );
  },
  neq: (l, r) => {
    return (
      V3Tx.eqTxOutRef.neq(l.txInInfoOutRef, r.txInInfoOutRef) ||
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
      reference: V3Tx.jsonTxOutRef.toJson(txininfo.txInInfoOutRef),
    };
  },
  fromJson: (value) => {
    const outref = Prelude.caseFieldWithValue(
      "reference",
      V3Tx.jsonTxOutRef.fromJson,
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
          V3Tx.isPlutusDataTxOutRef.toData(txininfo.txInInfoOutRef),
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
            txInInfoOutRef: V3Tx.isPlutusDataTxOutRef.fromData(
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
 * The context that the currently-executing script can access.
 *
 * @see {@link https://github.com/IntersectMBO/plutus/blob/1.36.0.0/plutus-ledger-api/src/PlutusLedgerApi/V3/Contexts.hs#L525-L533}
 */
export type ScriptContext = {
  scriptContextTxInfo: TxInfo;
  scriptContextRedeemer: V1Scripts.Redeemer;
  scriptContextScriptInfo: ScriptInfo;
};

/**
 * {@link Eq} instance for {@link ScriptContext}
 */
export const eqScriptContext: Eq<ScriptContext> = {
  eq: (l, r) => {
    return (
      eqTxInfo.eq(l.scriptContextTxInfo, r.scriptContextTxInfo) &&
      V1Scripts.eqRedeemer.eq(
        l.scriptContextRedeemer,
        r.scriptContextRedeemer,
      ) &&
      eqScriptInfo.eq(l.scriptContextScriptInfo, r.scriptContextScriptInfo)
    );
  },
  neq: (l, r) => {
    return (
      eqTxInfo.neq(l.scriptContextTxInfo, r.scriptContextTxInfo) ||
      V1Scripts.eqRedeemer.neq(
        l.scriptContextRedeemer,
        r.scriptContextRedeemer,
      ) ||
      eqScriptInfo.neq(l.scriptContextScriptInfo, r.scriptContextScriptInfo)
    );
  },
};

/**
 * {@link Json} instance for {@link ScriptContext}
 */
export const jsonScriptContext: Json<ScriptContext> = {
  toJson: (scriptContext) => {
    return {
      redeemer: V1Scripts.jsonRedeemer.toJson(
        scriptContext.scriptContextRedeemer,
      ),
      script_info: jsonScriptInfo.toJson(scriptContext.scriptContextScriptInfo),
      tx_info: jsonTxInfo.toJson(scriptContext.scriptContextTxInfo),
    };
  },
  fromJson: (value) => {
    const scriptContextTxInfo = caseFieldWithValue(
      "tx_info",
      jsonTxInfo.fromJson,
      value,
    );
    const scriptContextRedeemer = caseFieldWithValue(
      "redeemer",
      V1Scripts.jsonRedeemer.fromJson,
      value,
    );
    const scriptContextScriptInfo = caseFieldWithValue(
      "script_info",
      jsonScriptInfo.fromJson,
      value,
    );

    return {
      scriptContextTxInfo,
      scriptContextRedeemer,
      scriptContextScriptInfo,
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
          V1Scripts.isPlutusDataRedeemer.toData(
            scriptContext.scriptContextRedeemer,
          ),
          isPlutusDataScriptInfo.toData(scriptContext.scriptContextScriptInfo),
        ],
      ],
      name: "Constr",
    };
  },
  fromData: (value) => {
    switch (value.name) {
      case "Constr": {
        const [tag, fields] = value.fields;

        if (tag !== 0n) break;
        if (fields.length != 3) break;

        return {
          scriptContextTxInfo: isPlutusDataTxInfo.fromData(fields[0]!),
          scriptContextRedeemer: V1Scripts.isPlutusDataRedeemer.fromData(
            fields[1]!,
          ),
          scriptContextScriptInfo: isPlutusDataScriptInfo.fromData(fields[2]!),
        };
      }
      default:
        break;
    }
    throw new IsPlutusDataError("Unexpected data");
  },
};
