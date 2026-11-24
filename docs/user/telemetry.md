# Product usage data

This fork of T3 Code sends no product usage data:

- **No product events.** Nothing is sent to `ingest.t3.codes` or PostHog. The server does not read
  `~/.claude.json` or `~/.codex/auth.json` to identify you, and clients do not send hashed account
  or device identifiers.
- **No relay connection traces.** The server, desktop, web, and mobile apps never export T3 Connect
  traces to Axiom, even when a build has tracing credentials configured.
- **No mobile crash reports or startup timings.** The iOS and Android apps never dispatch them, and
  the **Send crash reports** setting is hidden.
- **No agent feedback delivery.** Reports agents write are kept on your machine and never sent;
  `t3 feedback list` shows them.

`T3CODE_TELEMETRY_ENABLED` and the managed policy `telemetry` switch no longer change anything,
because there is nothing left for them to turn off.

## Agent activity for mobile notifications

When **Publish agent activity** is enabled on a host, it sends project and thread titles, model
names, activity status, and environment and thread identifiers to the T3 Connect relay for
[mobile notifications and live activities](./mobile-notifications.md). This is separate from
product events and relay diagnostics. The telemetry opt-out does not disable it.

To stop publishing, turn off **Publish agent activity** under **Settings > Sharing & access** on
the host. Turning off notifications on a phone controls that phone's alerts, not the host's
publishing setting.

## Export diagnostics to your own receiver

To send traces, metrics, or logs to an OpenTelemetry receiver, open
**Settings > Maintenance > Diagnostics**, select an environment, and enter each signal's OTLP HTTP
endpoint under **OpenTelemetry export** (for example `http://localhost:4318/v1/traces`). Save, then
restart that environment's server. The receiver must be reachable from the server's machine.
**Test** sends an empty export from the server to check an endpoint before or after you save it;
saved endpoints are checked when the section opens. Checks send authentication headers only to
the signal's currently running endpoint and do not follow redirects. To check a new endpoint
that requires authentication, save it and restart the server first.

`T3CODE_OTLP_*_URL` and standard `OTEL_EXPORTER_OTLP_*` environment variables override the saved
settings. An overridden signal shows **Set by environment** and names the variable that set it, and its
**Test** checks the running endpoint instead of the field. For endpoints saved here or set with `T3CODE_OTLP_*_URL`, set `T3CODE_OTLP_HEADERS` for
receivers that need authentication and `T3CODE_OTLP_PROTOCOL=http/protobuf` for receivers that do
not accept JSON. An endpoint set with `OTEL_EXPORTER_OTLP_*` takes its headers and protocol from
`OTEL_EXPORTER_OTLP_HEADERS` and `OTEL_EXPORTER_OTLP_PROTOCOL` instead.
