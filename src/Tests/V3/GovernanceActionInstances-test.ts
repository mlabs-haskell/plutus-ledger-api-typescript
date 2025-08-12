import * as V3 from "../../Lib/V3.js";
import { describe, it } from "node:test";
import * as TestUtils from "../TestUtils.js";
import fc from "fast-check";
import { fcGovernanceActionId } from "./GovernanceActionIdInstances-test.js";
import { fcMaybe } from "../Prelude/MaybeInstances-test.js";
import { fcPlutusData } from "../PlutusDataInstances-test.js";
import { fcScriptHash } from "../V1/ScriptHashInstances-test.js";
import { fcProtocolVersion } from "./ProtocolInstances-test.js";
import { fcAssocMap } from "../AssocMap-test.js";
import { eqCredential } from "../../Lib/V1.js";
import { fcCredential } from "../V1/CredentialInstances-test.js";
import { fcConstitution } from "./ConstitutionInstances-test.js";
import { fcRational } from "../RatioInstances-test.js";
import { bigUint } from "../TestUtils.js";

export function fcGovernanceAction(): fc.Arbitrary<V3.GovernanceAction> {
  const { governanceAction } = fc.letrec((tie) => ({
    governanceAction: fc.oneof(
      {},
      tie("ParameterChange"),
      tie("HardForkInitiation"),
      tie("TreasuryWithdrawal"),
      tie("NoConfidence"),
      tie("UpdateCommittee"),
      tie("NewConstitution"),
      tie("InfoAction"),
    ),
    ParameterChange: fc.record(
      {
        name: fc.constant("ParameterChange"),
        fields: fc.tuple(
          fcMaybe(fcGovernanceActionId()),
          fcPlutusData(),
          fcMaybe(fcScriptHash()),
        ),
      },
      { noNullPrototype: true },
    ),
    HardForkInitiation: fc.record(
      {
        name: fc.constant("HardForkInitiation"),
        fields: fc.tuple(fcMaybe(fcGovernanceActionId()), fcProtocolVersion()),
      },
      { noNullPrototype: true },
    ),
    TreasuryWithdrawal: fc.record(
      {
        name: fc.constant("TreasuryWithdrawal"),
        fields: fc.tuple(
          fcAssocMap(eqCredential, fcCredential(), fc.bigInt()),
          fcMaybe(fcScriptHash()),
        ),
      },
      { noNullPrototype: true },
    ),
    NoConfidence: fc.record(
      {
        name: fc.constant("NoConfidence"),
        fields: fcMaybe(fcGovernanceActionId()),
      },
      { noNullPrototype: true },
    ),
    UpdateCommittee: fc.record(
      {
        name: fc.constant("UpdateCommittee"),
        fields: fc.tuple(
          fcMaybe(fcGovernanceActionId()),
          fc.array(fcCredential()),
          fcAssocMap(eqCredential, fcCredential(), bigUint()),
          fcRational(),
        ),
      },
      { noNullPrototype: true },
    ),
    NewConstitution: fc.record(
      {
        name: fc.constant("NewConstitution"),
        fields: fc.tuple(fcMaybe(fcGovernanceActionId()), fcConstitution()),
      },
      { noNullPrototype: true },
    ),
    InfoAction: fc.record(
      { name: fc.constant("InfoAction") },
      { noNullPrototype: true },
    ),
  }));

  return governanceAction as fc.Arbitrary<V3.GovernanceAction>;
}

describe("GovernanceAction tests", () => {
  describe("Eq GovernanceAction tests", () => {
    it(`eq is not neq property based tests`, () => {
      fc.assert(
        fc.property(fcGovernanceAction(), fcGovernanceAction(), (l, r) => {
          TestUtils.negationTest(V3.eqGovernanceAction, l, r);
        }),
        { examples: [] },
      );
    });
  });
  describe("Json GovernanceAction tests", () => {
    it(`toJson/fromJson property based tests`, () => {
      fc.assert(
        fc.property(fcGovernanceAction(), (data) => {
          TestUtils.toJsonFromJsonRoundTrip(V3.jsonGovernanceAction, data);
        }),
        { examples: [] },
      );
    });
  });
  describe("IsPlutusData GovernanceAction tests", () => {
    it(`toData/fromData property based tests`, () => {
      fc.assert(
        fc.property(fcGovernanceAction(), (data) => {
          TestUtils.isPlutusDataRoundTrip(
            V3.isPlutusDataGovernanceAction,
            data,
          );
        }),
        { examples: [] },
      );
    });
  });
});
