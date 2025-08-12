import * as V3 from "../../Lib/V3.js";
import { describe, it } from "node:test";
import * as TestUtils from "../TestUtils.js";
import fc from "fast-check";
import { fcPubKeyHash } from "../V1/PubKeyHashInstances-test.js";
import { fcCredential } from "../V1/CredentialInstances-test.js";
import { fcMaybe } from "../Prelude/MaybeInstances-test.js";
import { fcDelegatee } from "./DelegateeInstatnces-test.js";
import { bigUint } from "../TestUtils.js";

export function fcTxCert(): fc.Arbitrary<V3.TxCert> {
  const { txCert } = fc.letrec((tie) => ({
    txCert: fc.oneof(
      {},
      tie("RegStaking"),
      tie("UnRegStaking"),
      tie("DelegStaking"),
      tie("RegDeleg"),
      tie("RegDRep"),
      tie("UpdateDRep"),
      tie("UnRegDRep"),
      tie("PoolRegister"),
      tie("PoolRetire"),
      tie("AuthHotCommittee"),
      tie("ResignColdCommittee"),
    ),
    RegStaking: fc.record(
      {
        name: fc.constant("RegStaking"),
        fields: fc.tuple(fcCredential(), fcMaybe(bigUint())),
      },
      { noNullPrototype: true },
    ),
    UnRegStaking: fc.record(
      {
        name: fc.constant("UnRegStaking"),
        fields: fc.tuple(fcCredential(), fcMaybe(bigUint())),
      },
      { noNullPrototype: true },
    ),
    DelegStaking: fc.record(
      {
        name: fc.constant("DelegStaking"),
        fields: fc.tuple(fcCredential(), fcDelegatee()),
      },
      { noNullPrototype: true },
    ),
    RegDeleg: fc.record(
      {
        name: fc.constant("RegDeleg"),
        fields: fc.tuple(fcCredential(), fcDelegatee(), fc.bigInt()),
      },
      { noNullPrototype: true },
    ),
    RegDRep: fc.record(
      {
        name: fc.constant("RegDRep"),
        fields: fc.tuple(fcCredential(), fc.bigInt()),
      },
      { noNullPrototype: true },
    ),
    UpdateDRep: fc.record(
      {
        name: fc.constant("UpdateDRep"),
        fields: fcCredential(),
      },
      { noNullPrototype: true },
    ),
    UnRegDRep: fc.record(
      {
        name: fc.constant("UnRegDRep"),
        fields: fc.tuple(fcCredential(), fc.bigInt()),
      },
      { noNullPrototype: true },
    ),
    PoolRegister: fc.record(
      {
        name: fc.constant("PoolRegister"),
        fields: fc.tuple(fcPubKeyHash(), fcPubKeyHash()),
      },
      { noNullPrototype: true },
    ),
    PoolRetire: fc.record(
      {
        name: fc.constant("PoolRetire"),
        fields: fc.tuple(fcPubKeyHash(), fc.bigInt()),
      },
      { noNullPrototype: true },
    ),
    AuthHotCommittee: fc.record(
      {
        name: fc.constant("AuthHotCommittee"),
        fields: fc.tuple(fcCredential(), fcCredential()),
      },
      { noNullPrototype: true },
    ),
    ResignColdCommittee: fc.record(
      {
        name: fc.constant("ResignColdCommittee"),
        fields: fcCredential(),
      },
      { noNullPrototype: true },
    ),
  }));

  return txCert as fc.Arbitrary<V3.TxCert>;
}

describe("TxCert tests", () => {
  describe("Eq TxCert tests", () => {
    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(fcTxCert(), fcTxCert(), (l, r) => {
          TestUtils.negationTest(V3.eqTxCert, l, r);
        }),
        { examples: [] },
      );
    });
  });
  describe("Json TxCert tests", () => {
    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(fcTxCert(), (data) => {
          TestUtils.toJsonFromJsonRoundTrip(V3.jsonTxCert, data);
        }),
        { examples: [] },
      );
    });
  });
  describe("IsPlutusData TxCert tests", () => {
    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(fcTxCert(), (data) => {
          TestUtils.isPlutusDataRoundTrip(V3.isPlutusDataTxCert, data);
        }),
        { examples: [] },
      );
    });
  });
});
