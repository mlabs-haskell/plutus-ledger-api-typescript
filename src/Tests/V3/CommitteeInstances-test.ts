import * as V3 from "../../Lib/V3.js";
import { describe, it } from "node:test";
import * as TestUtils from "../TestUtils.js";
import fc from "fast-check";
import { fcAssocMap } from "../AssocMap-test.js";
import { fcCredential } from "../V1/CredentialInstances-test.js";
import { eqCredential } from "../../Lib/V1.js";
import { fcRational } from "../RatioInstances-test.js";
import { bigUint } from "../TestUtils.js";

export function fcCommittee(): fc.Arbitrary<V3.Committee> {
  return fc.record(
    {
      committeeMembers: fcAssocMap(eqCredential, fcCredential(), bigUint()),
      committeeQuorum: fcRational(),
    },
    { noNullPrototype: true },
  );
}

describe("Eq Committee tests", () => {
  it(`eq is not neq property based tests`, () => {
    fc.assert(
      fc.property(fcCommittee(), fcCommittee(), (l, r) => {
        TestUtils.negationTest(V3.eqCommittee, l, r);
      }),
      { examples: [] },
    );
  });
});
describe("Json Committee tests", () => {
  it(`toJson/fromJson property based tests`, () => {
    fc.assert(
      fc.property(fcCommittee(), (data) => {
        TestUtils.toJsonFromJsonRoundTrip(V3.jsonCommittee, data);
      }),
      { examples: [] },
    );
  });
});
describe("IsPlutusData Committee tests", () => {
  it(`toData/fromData property based tests`, () => {
    fc.assert(
      fc.property(fcCommittee(), (data) => {
        TestUtils.isPlutusDataRoundTrip(V3.isPlutusDataCommittee, data);
      }),
      { examples: [] },
    );
  });
});
