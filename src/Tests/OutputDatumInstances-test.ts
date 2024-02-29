// Tests for the instances for `OutputDatum`
import * as V1 from "../Lib/V1.js";
import * as V2 from "../Lib/V2.js";
import * as LbPlutusData from "../Lib/PlutusData.js";
import * as Prelude from "prelude";

import { describe, it } from "node:test";

import * as TestUtils from "./TestUtils.js";
import fc from "fast-check";

import * as TestDatum from "./DatumInstances-test.js";
import * as TestDatumHash from "./DatumHashInstances-test.js";

export const datumHash1: V1.DatumHash = Prelude.fromJust(
  V1.datumHashFromBytes(
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
      29,
      30,
      31,
      32,
    ]),
  ),
);

export function fcOutputDatum(): fc.Arbitrary<V2.OutputDatum> {
  const { outputDatum } = fc.letrec((tie) => ({
    outputDatum: fc.oneof(
      {},
      tie("NoOutputDatum"),
      tie("OutputDatumHash"),
      tie("OutputDatum"),
    ),
    NoOutputDatum: fc.record({
      name: fc.constant("NoOutputDatum"),
    }),
    OutputDatumHash: fc.record({
      name: fc.constant("OutputDatumHash"),
      fields: TestDatumHash.fcDatumHash(),
    }),
    OutputDatum: fc.record({
      name: fc.constant("OutputDatum"),
      fields: TestDatum.fcDatum(),
    }),
  }));

  return outputDatum as fc.Arbitrary<V2.OutputDatum>;
}

describe("OutputDatum tests", () => {
  describe("Eq OutputDatum tests", () => {
    const dict = V2.eqOutputDatum;

    // Same arguments
    TestUtils.eqIt(
      dict,
      { name: "NoOutputDatum" },
      { name: "NoOutputDatum" },
      true,
    );
    TestUtils.neqIt(
      dict,
      { name: "NoOutputDatum" },
      { name: "NoOutputDatum" },
      false,
    );

    TestUtils.eqIt(dict, { name: "OutputDatumHash", fields: datumHash1 }, {
      name: "OutputDatumHash",
      fields: datumHash1,
    }, true);
    TestUtils.neqIt(dict, { name: "OutputDatumHash", fields: datumHash1 }, {
      name: "OutputDatumHash",
      fields: datumHash1,
    }, false);

    TestUtils.eqIt(
      dict,
      { name: "OutputDatum", fields: { name: "Integer", fields: 69n } },
      { name: "OutputDatum", fields: { name: "Integer", fields: 69n } },
      true,
    );
    TestUtils.neqIt(
      dict,
      { name: "OutputDatum", fields: { name: "Integer", fields: 69n } },
      { name: "OutputDatum", fields: { name: "Integer", fields: 69n } },
      false,
    );

    // Mixing the arguments
    TestUtils.eqIt(dict, { name: "NoOutputDatum" }, {
      name: "OutputDatumHash",
      fields: datumHash1,
    }, false);
    TestUtils.neqIt(dict, { name: "NoOutputDatum" }, {
      name: "OutputDatumHash",
      fields: datumHash1,
    }, true);

    TestUtils.eqIt(dict, { name: "OutputDatumHash", fields: datumHash1 }, {
      name: "OutputDatum",
      fields: { name: "Integer", fields: 69n },
    }, false);
    TestUtils.neqIt(dict, { name: "OutputDatumHash", fields: datumHash1 }, {
      name: "OutputDatum",
      fields: { name: "Integer", fields: 69n },
    }, true);

    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(
          fcOutputDatum(),
          fcOutputDatum(),
          (l, r) => {
            TestUtils.negationTest(dict, l, r);
          },
        ),
        { examples: [] },
      );
    });
  });

  describe("Json OutputDatum tests", () => {
    TestUtils.toJsonAndFromJsonIt(V2.jsonOutputDatum, {
      name: "NoOutputDatum",
    }, { fields: [], name: "NoOutputDatum" });

    TestUtils.toJsonAndFromJsonIt(V2.jsonOutputDatum, {
      name: "OutputDatumHash",
      fields: datumHash1,
    }, {
      fields: [V1.jsonDatumHash.toJson(datumHash1)],
      name: "OutputDatumHash",
    });

    TestUtils.toJsonAndFromJsonIt(V2.jsonOutputDatum, {
      name: "OutputDatum",
      fields: { name: "Integer", fields: 69n },
    }, {
      fields: [
        LbPlutusData.jsonPlutusData.toJson({ name: "Integer", fields: 69n }),
      ],
      name: "OutputDatum",
    });

    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(
          fcOutputDatum(),
          (data) => {
            TestUtils.toJsonFromJsonRoundTrip(V2.jsonOutputDatum, data);
          },
        ),
        { examples: [] },
      );
    });
  });

  describe("IsPlutusData Credential tests", () => {
    TestUtils.isPlutusDataIt(
      V2.isPlutusDataOutputDatum,
      { name: "NoOutputDatum" },
      { name: "Constr", fields: [0n, []] },
    );

    TestUtils.isPlutusDataIt(
      V2.isPlutusDataOutputDatum,
      { name: "OutputDatumHash", fields: datumHash1 },
      {
        name: "Constr",
        fields: [1n, [V1.isPlutusDataDatumHash.toData(datumHash1)]],
      },
    );

    TestUtils.isPlutusDataIt(
      V2.isPlutusDataOutputDatum,
      { name: "OutputDatum", fields: { name: "Integer", fields: 69n } },
      {
        name: "Constr",
        fields: [2n, [
          LbPlutusData.isPlutusDataPlutusData.toData({
            name: "Integer",
            fields: 69n,
          }),
        ]],
      },
    );

    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(
          fcOutputDatum(),
          (data) => {
            TestUtils.isPlutusDataRoundTrip(
              V2.isPlutusDataOutputDatum,
              data,
            );
          },
        ),
        { examples: [] },
      );
    });
  });
});
