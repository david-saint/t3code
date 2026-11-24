# Product analytics

This fork collects no product analytics. Keep it that way when syncing upstream.

- [`AnalyticsService`](../../apps/server/src/telemetry/AnalyticsService.ts) is a no-op kept only so
  upstream call sites compile: `record` returns false, and nothing is buffered or sent. Do not
  restore its HTTP delivery, its PostHog key, or the identity reads that came from `Identify.ts`.
- [`RelayTracing.layer`](../../packages/shared/src/relayTracing.ts) never builds an exporter, so
  build-time relay tracing credentials are ignored on every surface.
- Clients send no `clientOwner` or `clientDevice` hashes
  ([`readClientOwnerParams`](../../packages/client-runtime/src/authorization/remote.ts)).
- Mobile crash reporting is off: the native Observe endpoint is `observe.invalid` and
  `crashReportingAvailable` is false.

After an upstream sync, grep for new network egress (`ingest.`, `posthog`, `OtlpTracer`,
`Axiom`, `Observe.configure`) before merging.
