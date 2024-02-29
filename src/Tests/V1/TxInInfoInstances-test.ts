// Tests for the instances for `DCert`
import * as V1 from "../../Lib/V1.js";
import { describe, it } from "node:test";
import * as TestUtils from "../TestUtils.js";
import fc from "fast-check";

import * as TestTxOutRef from "./TxOutRefInstances-test.js";
import * as TestTxOut from "./TxOutInstances-test.js";

export function fcTxInInfo(): fc.Arbitrary<V1.TxInInfo> {
  return fc.record(
    {
      txInInfoOutRef: TestTxOutRef.fcTxOutRef(),
      txInInfoResolved: TestTxOut.fcTxOut(),
    },
  ) as fc.Arbitrary<V1.TxInInfo>;
}

describe("TxInInfo tests", () => {
  describe("Eq TxInInfo tests", () => {
    const dict = V1.eqTxInInfo;

    // TODO(jaredponn): put some hard coded unit tests in

    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(
          fcTxInInfo(),
          fcTxInInfo(),
          (l, r) => {
            TestUtils.negationTest(dict, l, r);
          },
        ),
        {
          examples: [],
        },
      );
    });
  });

  describe("Json TxInInfo tests", () => {
    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(
          fcTxInInfo(),
          (data) => {
            TestUtils.toJsonFromJsonRoundTrip(V1.jsonTxInInfo, data);
          },
        ),
        {
          examples: [],
        },
      );
    });
  });

  describe("IsPlutusData TxInInfo tests", () => {
    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(
          fcTxInInfo(),
          (data) => {
            TestUtils.isPlutusDataRoundTrip(
              V1.isPlutusDataTxInInfo,
              data,
            );
          },
        ),
        {
          examples: [],
        },
      );
    });
  });
});
