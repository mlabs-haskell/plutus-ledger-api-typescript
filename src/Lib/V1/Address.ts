/**
 * @see {@link https://github.com/input-output-hk/plutus/blob/1.16.0.0/plutus-ledger-api/src/PlutusLedgerApi/V1/Address.hs}
 */
import { IsPlutusDataError } from "../PlutusData.js";
import type { IsPlutusData } from "../PlutusData.js";
import type { Eq, Json, Maybe } from "prelude";
import * as Prelude from "prelude";
import * as PreludeInstances from "../Prelude/Instances.js";

import type { Credential, StakingCredential } from "./Credential.js";
import * as LbCredential from "./Credential.js";

/**
 * An {@link Address} that may contain two credentials.
 *
 * @see {@link https://github.com/input-output-hk/plutus/blob/1.16.0.0/plutus-ledger-api/src/PlutusLedgerApi/V1/Address.hs#L30-L36}
 */
export type Address = {
  addressCredential: Credential;
  addressStakingCredential: Maybe<StakingCredential>;
};

/**
 * {@link Eq} instance for {@link Address}
 */
export const eqAddress: Eq<Address> = {
  eq: (l, r) => {
    return LbCredential.eqCredential.eq(
      l.addressCredential,
      r.addressCredential,
    ) &&
      Prelude.eqMaybe(LbCredential.eqStakingCredential).eq(
        l.addressStakingCredential,
        r.addressStakingCredential,
      );
  },
  neq: (l, r) => {
    return LbCredential.eqCredential.neq(
      l.addressCredential,
      r.addressCredential,
    ) ||
      Prelude.eqMaybe(LbCredential.eqStakingCredential).neq(
        l.addressStakingCredential,
        r.addressStakingCredential,
      );
  },
};

/**
 * {@link Json} instance for {@link Address}
 */
export const jsonAddress: Json<Address> = {
  toJson: (address) => {
    return {
      "credential": LbCredential.jsonCredential.toJson(
        address.addressCredential,
      ),
      "staking_credential": Prelude.jsonMaybe(
        LbCredential.jsonStakingCredential,
      ).toJson(address.addressStakingCredential),
    };
  },
  fromJson: (value) => {
    const credential = Prelude.caseFieldWithValue(
      "credential",
      LbCredential.jsonCredential.fromJson,
      value,
    );
    const maybeStakingCredential = Prelude.caseFieldWithValue(
      "staking_credential",
      Prelude.jsonMaybe(LbCredential.jsonStakingCredential).fromJson,
      value,
    );
    return {
      addressCredential: credential,
      addressStakingCredential: maybeStakingCredential,
    };
  },
};

/**
 * {@link IsPlutusData} instance for {@link Address}
 */
export const isPlutusDataAddress: IsPlutusData<Address> = {
  toData: (address) => {
    return {
      fields: [0n, [
        LbCredential.isPlutusDataCredential.toData(address.addressCredential),
        PreludeInstances
          .isPlutusDataMaybe(LbCredential.isPlutusDataStakingCredential)
          .toData(address.addressStakingCredential),
      ]],
      name: "Constr",
    };
  },

  fromData: (plutusData) => {
    switch (plutusData.name) {
      case "Constr": {
        if (plutusData.fields[0] === 0n && plutusData.fields[1].length === 2) {
          return {
            addressCredential: LbCredential.isPlutusDataCredential.fromData(
              plutusData.fields[1][0]!,
            ),
            addressStakingCredential: PreludeInstances.isPlutusDataMaybe(
              LbCredential.isPlutusDataStakingCredential,
            ).fromData(plutusData.fields[1][1]!),
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
