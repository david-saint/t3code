// This fork sends no product analytics. The service stays as a no-op so upstream call sites
// keep compiling after a sync; it reads no identity files and makes no network requests.
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

export interface TelemetryOwner {
  readonly source: "connect" | "openai" | "claude" | "device";
  readonly ownerId: string;
}

export class AnalyticsService extends Context.Service<
  AnalyticsService,
  {
    /** Always false: no event is ever queued or sent. */
    readonly record: (
      event: string,
      properties?: Readonly<Record<string, unknown>>,
    ) => Effect.Effect<boolean>;

    readonly flush: Effect.Effect<void>;

    readonly recordOwners: (
      owners: ReadonlyArray<TelemetryOwner>,
      observedBy: "server" | "client",
    ) => Effect.Effect<void>;
  }
>()("t3/telemetry/AnalyticsService") {}

/** @public */
export const make = Effect.succeed(
  AnalyticsService.of({
    record: Effect.fn("AnalyticsService.record")(() => Effect.succeed(false)),
    flush: Effect.void,
    recordOwners: Effect.fn("AnalyticsService.recordOwners")(() => Effect.void),
  }),
);

export const layer = Layer.effect(AnalyticsService, make);
