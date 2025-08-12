// Tests for the instances for `DCert`
import * as V1 from "../../Lib/V1.js";
import { describe, it } from "node:test";
import * as TestUtils from "../TestUtils.js";
import fc from "fast-check";

import * as TestStakingCredential from "./StakingCredentialInstances-test.js";
import * as TestPubKeyHash from "./PubKeyHashInstances-test.js";

export function fcDCert(): fc.Arbitrary<V1.DCert> {
  return fc.oneof(
    fc.record(
      {
        name: fc.constant("DelegRegKey"),
        fields: TestStakingCredential.fcStakingCredential(),
      },
      { noNullPrototype: true },
    ),
    fc.record(
      {
        name: fc.constant("DelegDeRegKey"),
        fields: TestStakingCredential.fcStakingCredential(),
      },
      { noNullPrototype: true },
    ),
    fc.record(
      {
        name: fc.constant("DelegDelegate"),
        fields: fc.tuple(
          TestStakingCredential.fcStakingCredential(),
          TestPubKeyHash.fcPubKeyHash(),
        ),
      },
      { noNullPrototype: true },
    ),
    fc.record(
      {
        name: fc.constant("PoolRegister"),
        fields: fc.tuple(
          TestPubKeyHash.fcPubKeyHash(),
          TestPubKeyHash.fcPubKeyHash(),
        ),
      },
      { noNullPrototype: true },
    ),
    fc.record(
      {
        name: fc.constant("PoolRetire"),
        fields: fc.tuple(TestPubKeyHash.fcPubKeyHash(), fc.bigInt()),
      },
      { noNullPrototype: true },
    ),
    fc.record({ name: fc.constant("Genesis") }, { noNullPrototype: true }),
    fc.record({ name: fc.constant("Mir") }, { noNullPrototype: true }),
  ) as fc.Arbitrary<V1.DCert>;
}

describe("DCert tests", () => {
  describe("Eq Credential tests", () => {
    const dict = V1.eqDCert;

    // TODO(jaredponn): put some hard coded unit tests in

    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(fcDCert(), fcDCert(), (l, r) => {
          TestUtils.negationTest(dict, l, r);
        }),
        {
          examples: [],
        },
      );
    });
  });

  describe("Json DCert tests", () => {
    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(fcDCert(), (data) => {
          TestUtils.toJsonFromJsonRoundTrip(V1.jsonDCert, data);
        }),
        {
          examples: [],
        },
      );
    });
  });

  describe("IsPlutusData DCert tests", () => {
    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(fcDCert(), (data) => {
          TestUtils.isPlutusDataRoundTrip(V1.isPlutusDataDCert, data);
        }),
        {
          examples: [],
        },
      );
    });
  });
});
