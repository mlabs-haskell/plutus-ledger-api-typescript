/**
 * @see {@link https://github.com/input-output-hk/plutus/blob/1.16.0.0/plutus-ledger-api/src/PlutusLedgerApi/V1/Time.hs}
 */
import type { Interval } from "./Interval.js";
import * as LbInterval from "./Interval.js";
import type { Integer } from "prelude";
import * as Prelude from "prelude";
import * as PreludeInstances from "../Prelude/Instances.js";

/**
 * {@link POSIXTime} wraps {@link Integer} and measures the number of
 * milliseconds since 1970-01-01T00:00:00Z.
 *
 * @see {@link https://github.com/input-output-hk/plutus/blob/1.16.0.0/plutus-ledger-api/src/PlutusLedgerApi/V1/Time.hs#L38-L44}
 */
export type POSIXTime = Integer;

export const eqPOSIXTime = Prelude.eqInteger;
export const jsonPOSIXTime = Prelude.jsonInteger;
export const isPlutusDataPOSIXTime = PreludeInstances.isPlutusDataInteger;

/**
 * {@link POSIXTimeRange} is an {@link Interval} of {@link POSIXTime}.
 *
 * @see {@link https://github.com/input-output-hk/plutus/blob/1.16.0.0/plutus-ledger-api/src/PlutusLedgerApi/V1/Time.hs#L51-L52}
 */
export type POSIXTimeRange = Interval<POSIXTime>;

export const eqPOSIXTimeRange = LbInterval.eqInterval(eqPOSIXTime);
export const jsonPOSIXTimeRange = LbInterval.jsonInterval(jsonPOSIXTime);
export const isPlutusDataPOSIXTimeRange = LbInterval.isPlutusDataInterval(
  isPlutusDataPOSIXTime,
);
