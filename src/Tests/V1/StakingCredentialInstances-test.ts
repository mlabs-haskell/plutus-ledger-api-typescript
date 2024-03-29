// Tests for the instances for `StakingCredential`
import * as V1 from "../../Lib/V1.js";
import * as Prelude from "prelude";

import { describe, it } from "node:test";

import * as TestUtils from "../TestUtils.js";
import fc from "fast-check";

import * as TestCredential from "./CredentialInstances-test.js";

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

export function fcStakingCredential(): fc.Arbitrary<V1.StakingCredential> {
  const { stakingCredential } = fc.letrec((tie) => ({
    stakingCredential: fc.oneof({}, tie("StakingHash"), tie("StakingPtr")),
    StakingHash: fc.record({
      name: fc.constant("StakingHash"),
      fields: TestCredential.fcCredential(),
    }),
    StakingPtr: fc.record({
      name: fc.constant("StakingPtr"),
      fields: fc.tuple(fc.bigInt(), fc.bigInt(), fc.bigInt()),
    }),
  }));

  return stakingCredential as fc.Arbitrary<V1.StakingCredential>;
}

describe("StakingCredential tests", () => {
  /*
    // Some statistics on the generated data
        fc.statistics( fcStakingCredential(),
                        (stakingCredential) => {
                            return `${stakingCredential.name}`
                        }
                            ,
                            { numRuns: 100 },
                     );
    */

  describe("Eq Credential tests", () => {
    const dict = V1.eqStakingCredential;

    // Same credentials
    TestUtils.eqIt(dict, stakingCredential1, stakingCredential1, true);
    TestUtils.neqIt(dict, stakingCredential1, stakingCredential1, false);

    TestUtils.eqIt(dict, stakingCredential2, stakingCredential2, true);
    TestUtils.neqIt(dict, stakingCredential2, stakingCredential2, false);

    TestUtils.eqIt(dict, stakingCredential3, stakingCredential3, true);
    TestUtils.neqIt(dict, stakingCredential3, stakingCredential3, false);

    // Mixing the credentials
    TestUtils.eqIt(dict, stakingCredential1, stakingCredential2, false);
    TestUtils.neqIt(dict, stakingCredential1, stakingCredential2, true);

    TestUtils.eqIt(dict, stakingCredential2, stakingCredential1, false);
    TestUtils.neqIt(dict, stakingCredential2, stakingCredential1, true);

    TestUtils.eqIt(dict, stakingCredential3, stakingCredential2, false);
    TestUtils.neqIt(dict, stakingCredential3, stakingCredential2, true);

    TestUtils.eqIt(dict, stakingCredential2, stakingCredential3, false);
    TestUtils.neqIt(dict, stakingCredential2, stakingCredential3, true);

    TestUtils.eqIt(dict, stakingCredential1, stakingCredential3, false);
    TestUtils.neqIt(dict, stakingCredential1, stakingCredential3, true);

    TestUtils.eqIt(dict, stakingCredential3, stakingCredential1, false);
    TestUtils.neqIt(dict, stakingCredential3, stakingCredential1, true);

    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(
          fcStakingCredential(),
          fcStakingCredential(),
          (l, r) => {
            TestUtils.negationTest(dict, l, r);
          },
        ),
        {
          examples: [
            [stakingCredential1, stakingCredential1],
            [stakingCredential2, stakingCredential2],
            [stakingCredential3, stakingCredential3],
            [stakingCredential2, stakingCredential3],
            [stakingCredential1, stakingCredential3],
            [stakingCredential3, stakingCredential1],
          ],
        },
      );
    });
  });

  describe("Json StakingCredential tests", () => {
    TestUtils.toJsonAndFromJsonIt(
      V1.jsonStakingCredential,
      stakingCredential1,
      {
        fields: [V1.jsonCredential.toJson(credential1)],
        name: "StakingHash",
      },
    );

    TestUtils.toJsonAndFromJsonIt(
      V1.jsonStakingCredential,
      stakingCredential2,
      {
        fields: [V1.jsonCredential.toJson(credential2)],
        name: "StakingHash",
      },
    );
    TestUtils.toJsonAndFromJsonIt(
      V1.jsonStakingCredential,
      stakingCredential3,
      {
        fields: [{
          "certificate_index": new Prelude.Scientific(-69n),
          "slot_number": new Prelude.Scientific(69n),
          "transaction_index": new Prelude.Scientific(420n),
        }],
        name: "StakingPtr",
      },
    );

    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(
          fcStakingCredential(),
          (data) => {
            TestUtils.toJsonFromJsonRoundTrip(V1.jsonStakingCredential, data);
          },
        ),
        {
          examples: [[stakingCredential1], [stakingCredential2], [
            stakingCredential3,
          ]],
        },
      );
    });
  });

  describe("IsPlutusData StakingCredential tests", () => {
    TestUtils.isPlutusDataIt(
      V1.isPlutusDataStakingCredential,
      stakingCredential1,
      {
        name: "Constr",
        fields: [0n, [
          V1.isPlutusDataCredential.toData(credential1),
        ]],
      },
    );
    TestUtils.isPlutusDataIt(
      V1.isPlutusDataStakingCredential,
      stakingCredential2,
      {
        name: "Constr",
        fields: [0n, [
          V1.isPlutusDataCredential.toData(credential2),
        ]],
      },
    );
    TestUtils.isPlutusDataIt(
      V1.isPlutusDataStakingCredential,
      stakingCredential3,
      {
        name: "Constr",
        fields: [1n, [
          V1.isPlutusDataInteger.toData(69n),
          V1.isPlutusDataInteger.toData(420n),
          V1.isPlutusDataInteger.toData(-69n),
        ]],
      },
    );

    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(
          fcStakingCredential(),
          (data) => {
            TestUtils.isPlutusDataRoundTrip(
              V1.isPlutusDataStakingCredential,
              data,
            );
          },
        ),
        {
          examples: [[stakingCredential1], [stakingCredential2], [
            stakingCredential3,
          ]],
        },
      );
    });
  });
});
