import * as V3 from "../../Lib/V3.js";
import { describe, it } from "node:test";
import * as TestUtils from "../TestUtils.js";
import fc from "fast-check";
import { fcTxId } from "../V1/TxIdInstances-test.js";
import { bigUint } from "../TestUtils.js";

export function fcGovernanceActionId(): fc.Arbitrary<V3.GovernanceActionId> {
  return fc.record(
    {
      gaidTxId: fcTxId(),
      gaidGovActionIx: bigUint(),
    },
    { noNullPrototype: true },
  );
}

describe("GovernanceActionId tests", () => {
  describe("Eq GovernanceActionId tests", () => {
    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(fcGovernanceActionId(), fcGovernanceActionId(), (l, r) => {
          TestUtils.negationTest(V3.eqGovernanceActionId, l, r);
        }),
        { examples: [] },
      );
    });
  });
  describe("Json GovernanceActionId tests", () => {
    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(fcGovernanceActionId(), (data) => {
          TestUtils.toJsonFromJsonRoundTrip(V3.jsonGovernanceActionId, data);
        }),
        { examples: [] },
      );
    });
  });
  describe("IsPlutusData GovernanceActionId tests", () => {
    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(fcGovernanceActionId(), (data) => {
          TestUtils.isPlutusDataRoundTrip(
            V3.isPlutusDataGovernanceActionId,
            data,
          );
        }),
        { examples: [] },
      );
    });
  });
});
