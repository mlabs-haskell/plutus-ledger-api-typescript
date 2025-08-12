// Tests for the instances for `ScriptPurpose`
import * as V1 from "../../Lib/V1.js";

import { describe, it } from "node:test";

import * as TestUtils from "../TestUtils.js";
import fc from "fast-check";

import * as TestStakingCredential from "../V1/StakingCredentialInstances-test.js";
import * as TestTxOutRef from "../V1/TxOutRefInstances-test.js";
import * as TestValue from "../V1/ValueInstances-test.js";
import * as TestDCert from "../V1/DCertInstances-test.js";

export function fcScriptPurpose(): fc.Arbitrary<V1.ScriptPurpose> {
  const { scriptPurpose } = fc.letrec((tie) => ({
    scriptPurpose: fc.oneof(
      {},
      tie("Minting"),
      tie("Spending"),
      tie("Rewarding"),
      tie("Certifying"),
    ),
    Minting: fc.record(
      {
        name: fc.constant("Minting"),
        fields: TestValue.fcCurrencySymbol(),
      },
      { noNullPrototype: true },
    ),

    Spending: fc.record(
      {
        name: fc.constant("Spending"),
        fields: TestTxOutRef.fcTxOutRef(),
      },
      { noNullPrototype: true },
    ),

    Rewarding: fc.record(
      {
        name: fc.constant("Rewarding"),
        fields: TestStakingCredential.fcStakingCredential(),
      },
      { noNullPrototype: true },
    ),

    Certifying: fc.record(
      {
        name: fc.constant("Certifying"),
        fields: TestDCert.fcDCert(),
      },
      { noNullPrototype: true },
    ),
  }));

  return scriptPurpose as fc.Arbitrary<V1.ScriptPurpose>;
}

describe("ScriptPurpose tests", () => {
  describe("Eq ScriptPurpose tests", () => {
    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(fcScriptPurpose(), fcScriptPurpose(), (l, r) => {
          TestUtils.negationTest(V1.eqScriptPurpose, l, r);
        }),
      );
    });
  });
  describe("Json ScriptPurpose tests", () => {
    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(fcScriptPurpose(), (data) => {
          TestUtils.toJsonFromJsonRoundTrip(V1.jsonScriptPurpose, data);
        }),
      );
    });
  });
  describe("IsPlutusData ScriptPurpose tests", () => {
    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(fcScriptPurpose(), (data) => {
          TestUtils.isPlutusDataRoundTrip(V1.isPlutusDataScriptPurpose, data);
        }),
      );
    });
  });
});
