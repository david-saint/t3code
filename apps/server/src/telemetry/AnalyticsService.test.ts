import { assert, it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as HttpClient from "effect/http/HttpClient";
import * as HttpClientResponse from "effect/http/HttpClientResponse";

import * as AnalyticsService from "./AnalyticsService.ts";

it.effect("never queues or sends an event", () => {
  const requests: Array<string> = [];
  const recordingClient = HttpClient.make((request) => {
    requests.push(request.url);
    return Effect.succeed(HttpClientResponse.fromWeb(request, new Response(null, { status: 200 })));
  });

  return Effect.gen(function* () {
    const analytics = yield* AnalyticsService.AnalyticsService;
    const queued = yield* analytics.record("server.boot.heartbeat", { projectCount: 1 });
    yield* analytics.recordOwners([{ source: "claude", ownerId: "a".repeat(64) }], "server");
    yield* analytics.flush;

    assert.isFalse(queued);
    assert.deepStrictEqual(requests, []);
  }).pipe(
    Effect.provide(
      AnalyticsService.layer.pipe(
        Layer.provideMerge(Layer.succeed(HttpClient.HttpClient, recordingClient)),
      ),
    ),
  );
});
