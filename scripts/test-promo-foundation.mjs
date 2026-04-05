import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";

const PORT = process.env.PROMO_TEST_PORT ?? "3107";
const HOST = "http://127.0.0.1:" + PORT;
const AASA_APP_ID = "TESTTEAM.com.barrelbook.app";
const TESTFLIGHT_URL = "https://testflight.apple.com/join/TESTFNF";
const FNF_SANDBOX_CODE = "FNF-SANDBOX-CODE";
const BASE_FORBIDDEN_HTML_SNIPPETS = [
  "Have a promo code?",
  "fallback code",
  "keep this page handy in Safari",
  "blue OPEN button at the top",
  "Enter GARYSPLUS.",
  "BarrelBook promo code",
];

const PAGE_EXPECTATIONS = {
  "/p/fnf": {
    expectedText: "FNFFREEPLUSYEAR",
    required: [
      "Family Offer",
      "Get the app",
      "Open BarrelBook",
      "App Store Code",
      "Then tap Open BarrelBook",
      "Fallback if Open BarrelBook doesn't work",
      "Enter FNFFREEPLUSYEAR.",
    ],
    forbidden: [TESTFLIGHT_URL, FNF_SANDBOX_CODE],
    appArgument: "barrelbook://promo/fnf",
    openHref: 'href="barrelbook://promo/fnf"',
  },
  "/p/garysplus": {
    expectedText: "GARYSFREEYEARPLUS",
    required: [
      "Gary's free year of BarrelBook Plus",
      "Get the app",
      "Open BarrelBook",
      "App Store Code",
      "Then tap Open BarrelBook",
      "Continue in App Store.",
      "Fallback if Open BarrelBook doesn't work",
    ],
    forbidden: [TESTFLIGHT_URL, FNF_SANDBOX_CODE],
    appArgument: "barrelbook://promo/garysplus",
    openHref: 'href="barrelbook://promo/garysplus"',
  },
  "/qa/fnf": {
    expectedText: FNF_SANDBOX_CODE,
    required: [
      "Family QA Offer",
      "Open TestFlight",
      "Open BarrelBook",
      "Sandbox App Store Code",
      "fresh BarrelBook account",
      "Then tap Open BarrelBook",
      "canonical /p/fnf in-app offer flow",
      "Fallback if Open BarrelBook doesn't work",
      "Enter FNF-SANDBOX-CODE.",
    ],
    forbidden: ["FNFFREEPLUSYEAR"],
    appArgument: "barrelbook://promo/fnf",
    openHref: 'href="barrelbook://promo/fnf"',
  },
};

async function readRedirects() {
  const rawJson = await readFile(new URL("../vercel.json", import.meta.url), "utf8");
  const config = JSON.parse(rawJson);
  return config.redirects ?? [];
}

async function assertRedirectConfig() {
  const redirects = await readRedirects();
  const expected = new Map([
    ["/fnf", "/p/fnf"],
    ["/garysplus", "/p/garysplus"],
  ]);

  for (const [source, destination] of expected.entries()) {
    const match = redirects.find((redirect) => redirect.source === source);
    assert.ok(match, "Missing redirect for " + source);
    assert.equal(match.destination, destination, "Unexpected destination for " + source);
    assert.equal(match.permanent, true, "Expected " + source + " redirect to stay permanent");
  }
}

function startDevServer() {
  const child = spawn(
    "npm",
    ["run", "dev", "--", "--hostname", "127.0.0.1", "--port", PORT],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        BARRELBOOK_AASA_APP_IDS: AASA_APP_ID,
        BARRELBOOK_TESTFLIGHT_URL: TESTFLIGHT_URL,
        BARRELBOOK_FNF_SANDBOX_CODE: FNF_SANDBOX_CODE,
      },
      stdio: ["ignore", "pipe", "pipe"],
    }
  );

  const output = [];
  const appendOutput = (chunk) => {
    output.push(chunk.toString());
    if (output.length > 40) {
      output.shift();
    }
  };

  child.stdout.on("data", appendOutput);
  child.stderr.on("data", appendOutput);

  return { child, output };
}

async function waitForServer(server) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (server.child.exitCode !== null) {
      throw new Error("Next dev server exited early.\n" + server.output.join(""));
    }

    try {
      const response = await fetch(HOST + "/p/fnf", { redirect: "manual" });
      if (response.ok) {
        return;
      }
    } catch {
      // Server is still starting up.
    }

    await delay(1000);
  }

  throw new Error("Timed out waiting for " + HOST + ".\n" + server.output.join(""));
}

async function stopServer(server) {
  if (server.child.exitCode !== null) {
    return;
  }

  server.child.kill("SIGTERM");

  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (server.child.exitCode !== null) {
      return;
    }

    await delay(250);
  }

  server.child.kill("SIGKILL");
}

async function assertPromoPage(pathname) {
  const response = await fetch(HOST + pathname);
  const html = await response.text();
  const expectations = PAGE_EXPECTATIONS[pathname];

  assert.equal(response.status, 200, "Expected " + pathname + " to render");
  assert.ok(
    html.includes(expectations.expectedText),
    "Expected " + pathname + " to include " + expectations.expectedText
  );

  for (const snippet of expectations.required) {
    assert.ok(html.includes(snippet), "Expected " + pathname + " to include \"" + snippet + "\"");
  }

  for (const snippet of BASE_FORBIDDEN_HTML_SNIPPETS.concat(expectations.forbidden)) {
    assert.ok(
      !html.toLowerCase().includes(snippet.toLowerCase()),
      "Expected " + pathname + " to avoid \"" + snippet + "\""
    );
  }

  assert.ok(
    html.includes('name="apple-itunes-app"') && html.includes("app-argument=" + expectations.appArgument),
    "Expected " + pathname + " to expose a Smart App Banner for " + expectations.appArgument
  );
  assert.ok(
    html.includes(expectations.openHref),
    "Expected " + pathname + " to expose a direct Open BarrelBook CTA for " + expectations.openHref
  );
  assert.ok(
    !html.includes('data-open-barrelbook="true"'),
    "Expected " + pathname + " to avoid JavaScript-only Open BarrelBook rewrites"
  );
}

async function assertNotFound(pathname) {
  const response = await fetch(HOST + pathname);
  const html = await response.text();

  assert.equal(response.status, 404, "Expected " + pathname + " to return 404");
  assert.match(html, /not found/i, "Expected " + pathname + " to render a 404 page");
}

async function assertAasaEndpoints() {
  const rootResponse = await fetch(HOST + "/apple-app-site-association");
  const rootPayload = await rootResponse.json();
  const wellKnownResponse = await fetch(HOST + "/.well-known/apple-app-site-association");
  const wellKnownPayload = await wellKnownResponse.json();

  assert.equal(rootResponse.status, 200, "Expected root AASA endpoint to render");
  assert.equal(wellKnownResponse.status, 200, "Expected .well-known AASA endpoint to render");
  assert.equal(
    rootResponse.headers.get("content-type"),
    "application/json; charset=utf-8",
    "Expected root AASA content type to be explicit JSON"
  );
  assert.equal(
    wellKnownResponse.headers.get("content-type"),
    "application/json; charset=utf-8",
    "Expected .well-known AASA content type to be explicit JSON"
  );
  assert.deepEqual(
    wellKnownPayload,
    rootPayload,
    "Expected both AASA endpoints to serve the same payload"
  );

  const details = rootPayload?.applinks?.details ?? [];
  assert.ok(details.length > 0, "Expected applinks details in AASA payload");
  assert.deepEqual(details[0].appIDs, [AASA_APP_ID], "Expected test AASA app ID to be present");
  assert.ok(
    Array.isArray(details[0].components),
    "Expected applinks components to be an array"
  );
  assert.ok(
    details[0].components.some(
      (component) =>
        component?.["/"] === "/p/*" &&
        component?.comment === "Canonical BarrelBook promo links"
    ),
    "Expected promo AASA component to be present"
  );
}

async function main() {
  await assertRedirectConfig();

  const server = startDevServer();

  try {
    await waitForServer(server);
    await assertPromoPage("/p/fnf");
    await assertPromoPage("/p/garysplus");
    await assertPromoPage("/qa/fnf");
    await assertNotFound("/p/unknown-slug");
    await assertAasaEndpoints();
    console.log("Promo website foundation checks passed.");
  } finally {
    await stopServer(server);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
