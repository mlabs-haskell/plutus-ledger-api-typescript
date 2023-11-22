// Tests for the instances for `Address`
import * as V1 from "../PlutusLedgerApi/Runtime/PlutusLedgerApi/V1.js";
import * as Prelude from "prelude";

import { describe, it } from "node:test";

import * as TestUtils from "./TestUtils.js";
import fc from "fast-check";

import * as TestCredential from "./CredentialInstances-test.js";
import * as TestStakingCredential from "./StakingCredentialInstances-test.js";
import * as TestMaybe from "./MaybeInstances-test.js";

const pubKeyHash1 = Prelude.fromJust(
  V1.pubKeyHashFromBytes(
    Uint8Array.from([
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
    ]),
  ),
);
export const scriptHash1: V1.ScriptHash = Prelude.fromJust(
  V1.scriptHashFromBytes(
    Uint8Array.from([
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
    ]),
  ),
);
const credential1: V1.Credential = {
  name: "PubKeyCredential",
  fields: pubKeyHash1,
};
const credential2: V1.Credential = {
  name: "ScriptCredential",
  fields: scriptHash1,
};

const stakingCredential1: V1.StakingCredential = {
  name: "StakingHash",
  fields: credential1,
};
const stakingCredential2: V1.StakingCredential = {
  name: "StakingHash",
  fields: credential2,
};
const stakingCredential3: V1.StakingCredential = {
  name: "StakingPtr",
  fields: [69n, 420n, -69n],
};

const address1: V1.Address = {
  addressCredential: credential1,
  addressStakingCredential: { name: "Just", fields: stakingCredential1 },
};
const address2: V1.Address = {
  addressCredential: credential1,
  addressStakingCredential: { name: "Just", fields: stakingCredential2 },
};
const address3: V1.Address = {
  addressCredential: credential1,
  addressStakingCredential: { name: "Just", fields: stakingCredential3 },
};
const address4: V1.Address = {
  addressCredential: credential1,
  addressStakingCredential: { name: "Nothing" },
};

export function fcAddress(): fc.Arbitrary<V1.Address> {
  return fc.record({
    addressCredential: TestCredential.fcCredential(),
    addressStakingCredential: TestMaybe.fcMaybe(
      TestStakingCredential.fcStakingCredential(),
    ),
  }) as fc.Arbitrary<V1.Address>;
}

describe("Address tests", () => {
  describe("Eq Credential tests", () => {
    const dict = V1.eqAddress;

    // Same address
    TestUtils.eqIt(dict, address1, address1, true);
    TestUtils.neqIt(dict, address1, address1, false);

    TestUtils.eqIt(dict, address2, address2, true);
    TestUtils.neqIt(dict, address2, address2, false);

    TestUtils.eqIt(dict, address3, address3, true);
    TestUtils.neqIt(dict, address3, address3, false);

    TestUtils.eqIt(dict, address4, address4, true);
    TestUtils.neqIt(dict, address4, address4, false);

    // Mixing the addresses
    TestUtils.eqIt(dict, address1, address2, false);
    TestUtils.neqIt(dict, address1, address2, true);

    TestUtils.eqIt(dict, address2, address1, false);
    TestUtils.neqIt(dict, address2, address1, true);

    TestUtils.eqIt(dict, address1, address3, false);
    TestUtils.neqIt(dict, address1, address3, true);

    TestUtils.eqIt(dict, address2, address3, false);
    TestUtils.neqIt(dict, address2, address3, true);

    TestUtils.eqIt(dict, address3, address2, false);
    TestUtils.neqIt(dict, address3, address2, true);

    TestUtils.eqIt(dict, address4, address2, false);
    TestUtils.neqIt(dict, address4, address2, true);

    TestUtils.eqIt(dict, address4, address1, false);
    TestUtils.neqIt(dict, address4, address1, true);

    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(
          fcAddress(),
          fcAddress(),
          (l, r) => {
            TestUtils.negationTest(dict, l, r);
          },
        ),
        {
          examples: [
            [address1, address1],
            [address2, address1],
            [address1, address2],
            [address3, address2],
            [address3, address3],
            [address4, address4],
          ],
        },
      );
    });
  });

  describe("Json Address tests", () => {
    TestUtils.toJsonAndFromJsonIt(V1.jsonAddress, address1, {
      credential: V1.jsonCredential.toJson(credential1),
      staking_credential: Prelude.jsonMaybe(V1.jsonStakingCredential)
        .toJson({ name: "Just", fields: stakingCredential1 }),
    });

    TestUtils.toJsonAndFromJsonIt(V1.jsonAddress, address2, {
      credential: V1.jsonCredential.toJson(credential1),
      staking_credential: Prelude.jsonMaybe(V1.jsonStakingCredential)
        .toJson({ name: "Just", fields: stakingCredential2 }),
    });

    TestUtils.toJsonAndFromJsonIt(V1.jsonAddress, address3, {
      credential: V1.jsonCredential.toJson(credential1),
      staking_credential: Prelude.jsonMaybe(V1.jsonStakingCredential)
        .toJson({ name: "Just", fields: stakingCredential3 }),
    });

    TestUtils.toJsonAndFromJsonIt(V1.jsonAddress, address4, {
      credential: V1.jsonCredential.toJson(credential1),
      staking_credential: Prelude.jsonMaybe(V1.jsonStakingCredential)
        .toJson({ name: "Nothing" }),
    });

    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(
          fcAddress(),
          (data) => {
            TestUtils.toJsonFromJsonRoundTrip(V1.jsonAddress, data);
          },
        ),
        { examples: [[address1], [address2], [address3], [address4]] },
      );
    });
  });

  describe("IsPlutusData Address tests", () => {
    TestUtils.isPlutusDataIt(
      V1.isPlutusDataAddress,
      address1,
      {
        name: "Constr",
        fields: [0n, [
          V1.isPlutusDataCredential.toData(credential1),
          V1.isPlutusDataMaybe(V1.isPlutusDataStakingCredential).toData({
            name: "Just",
            fields: stakingCredential1,
          }),
        ]],
      },
    );
    TestUtils.isPlutusDataIt(
      V1.isPlutusDataAddress,
      address2,
      {
        name: "Constr",
        fields: [0n, [
          V1.isPlutusDataCredential.toData(credential1),
          V1.isPlutusDataMaybe(V1.isPlutusDataStakingCredential).toData({
            name: "Just",
            fields: stakingCredential2,
          }),
        ]],
      },
    );

    TestUtils.isPlutusDataIt(
      V1.isPlutusDataAddress,
      address3,
      {
        name: "Constr",
        fields: [0n, [
          V1.isPlutusDataCredential.toData(credential1),
          V1.isPlutusDataMaybe(V1.isPlutusDataStakingCredential).toData({
            name: "Just",
            fields: stakingCredential3,
          }),
        ]],
      },
    );
    TestUtils.isPlutusDataIt(
      V1.isPlutusDataAddress,
      address4,
      {
        name: "Constr",
        fields: [0n, [
          V1.isPlutusDataCredential.toData(credential1),
          V1.isPlutusDataMaybe(V1.isPlutusDataStakingCredential).toData({
            name: "Nothing",
          }),
        ]],
      },
    );

    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(
          fcAddress(),
          (data) => {
            TestUtils.isPlutusDataRoundTrip(
              V1.isPlutusDataAddress,
              data,
            );
          },
        ),
        { examples: [[address1], [address2], [address3], [address4]] },
      );
    });
  });
});
