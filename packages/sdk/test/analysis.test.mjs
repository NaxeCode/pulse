import assert from "node:assert/strict";
import test from "node:test";

process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:8080";
const { getSymbols, runAnalysis } = await import("../src/index.ts");

test("a disabled queue is surfaced as an SDK error", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch", async () =>
    Response.json({ error: "analysis queue is unavailable" }, { status: 503 })
  );

  await assert.rejects(runAnalysis("AAPL"), /503.*analysis queue is unavailable/);
  assert.equal(fetch.mock.callCount(), 1);
});

test("a lost response to a POST does not submit the analysis again", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch", async () => {
    throw new TypeError("connection closed");
  });

  await assert.rejects(runAnalysis("AAPL"), /connection closed/);
  assert.equal(fetch.mock.callCount(), 1);
});

test("a localhost GET can still fall back to the IPv4 loopback address", async (t) => {
  const urls = [];
  t.mock.method(globalThis, "fetch", async (url) => {
    urls.push(url);
    if (urls.length === 1) throw new TypeError("connection refused");
    return Response.json([{ ticker: "MSFT" }]);
  });

  assert.deepEqual(await getSymbols(), [{ ticker: "MSFT" }]);
  assert.deepEqual(urls, [
    "http://localhost:8080/api/v1/symbols",
    "http://127.0.0.1:8080/api/v1/symbols"
  ]);
});
