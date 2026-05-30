import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";

const PORT = process.env.PROMO_TEST_PORT ?? "3107";
const HOST = "http://127.0.0.1:" + PORT;
const AASA_APP_ID = "TESTTEAM.com.barrelbook.app";
const APP_STORE_URL = "https://apps.apple.com/us/app/barrelbook-whiskey-catalog/id6751737898";
const TESTFLIGHT_URL = "https://testflight.apple.com/join/TESTFNF";
const FNF_SANDBOX_CODE = "FNF-SANDBOX-CODE";
const BLACKSHIRT_PLUS_CODE = "BLACKSHIRTPLUS20";
const BLACKSHIRT_PRO_CODE = "BLACKSHIRTPRO20";
const THE_BOURBON_TRAIL_PLUS_CODE = "THEBOURBONTRAILPLUS20";
const THE_BOURBON_TRAIL_PRO_CODE = "THEBOURBONTRAILPRO20";
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
    ["/blackshirt", "/p/blackshirt"],
    ["/thebourbontrail", "/p/thebourbontrail"],
  ]);

  for (const [source, destination] of expected.entries()) {
    const match = redirects.find((redirect) => redirect.source === source);
    assert.ok(match, "Missing redirect for " + source);
    assert.equal(match.destination, destination, "Unexpected destination for " + source);
    assert.equal(match.permanent, true, "Expected " + source + " redirect to stay permanent");
  }

  const blackshirtRedirect = redirects.find((redirect) => redirect.source === "/blackshirt");
  assert.ok(
    blackshirtRedirect && !String(blackshirtRedirect.destination).includes("apps.apple.com"),
    "Expected /blackshirt to avoid a direct Apple redeem redirect"
  );

  const bourbonTrailRedirect = redirects.find(
    (redirect) => redirect.source === "/thebourbontrail"
  );
  assert.ok(
    bourbonTrailRedirect && !String(bourbonTrailRedirect.destination).includes("apps.apple.com"),
    "Expected /thebourbontrail to avoid a direct Apple redeem redirect"
  );
}

async function assertRuntimeRedirect(source, destination) {
  const response = await fetch(HOST + source, { redirect: "manual" });
  const location = response.headers.get("location") || "";

  assert.equal(response.status, 308, "Expected " + source + " to redirect permanently");
  assert.ok(
    location.endsWith(destination),
    "Expected " + source + " to redirect to " + destination
  );
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

async function assertBlackshirtPromoPage() {
  const pathname = "/p/blackshirt";
  const response = await fetch(HOST + pathname);
  const html = await response.text();

  assert.equal(response.status, 200, "Expected " + pathname + " to render");

  const required = [
    "Black Shirt Bourbon Society x BarrelBook",
    "20% off the first year of BarrelBook",
    "Plus Annual",
    "$39.20 first year",
    "Pro Annual",
    "$79.20 first year",
    "Claim Plus Annual",
    "Claim Pro Annual",
    "Manual fallback",
    "Plus Annual App Store Code",
    "Pro Annual App Store Code",
  ];

  for (const snippet of required) {
    assert.ok(html.includes(snippet), "Expected " + pathname + " to include \"" + snippet + "\"");
  }

  assert.ok(
    html.includes('href="barrelbook://promo/blackshirt-plus"'),
    "Expected Plus CTA to deep-link to blackshirt-plus"
  );
  assert.ok(
    html.includes('href="barrelbook://promo/blackshirt-pro"'),
    "Expected Pro CTA to deep-link to blackshirt-pro"
  );
  assert.ok(
    !html.includes("apps.apple.com/redeem"),
    "Expected Black Shirt page to avoid direct Apple redeem URLs"
  );
  assert.ok(
    !html.includes("app-argument=barrelbook://promo/blackshirt"),
    "Expected Black Shirt parent page to avoid a single parent Smart App Banner handoff"
  );
  assert.ok(
    html.toLowerCase().includes("noindex") && html.toLowerCase().includes("nofollow"),
    "Expected Black Shirt page to emit noindex,nofollow metadata"
  );

  const fallbackIndex = html.indexOf('data-testid="creator-multi-offer-manual-fallback"');
  assert.ok(fallbackIndex > -1, "Expected Black Shirt page to include fallback disclosure");
  assert.ok(
    !html.slice(fallbackIndex, fallbackIndex + 300).includes(" open"),
    "Expected Black Shirt fallback disclosure to be closed by default"
  );
  assert.ok(
    !html.slice(0, fallbackIndex).includes(BLACKSHIRT_PLUS_CODE)
      && !html.slice(0, fallbackIndex).includes(BLACKSHIRT_PRO_CODE),
    "Expected Black Shirt codes to stay out of the primary page content"
  );
  assert.ok(
    html.indexOf(BLACKSHIRT_PLUS_CODE) > fallbackIndex
      && html.indexOf(BLACKSHIRT_PRO_CODE) > fallbackIndex,
    "Expected Black Shirt codes to be exposed inside the fallback disclosure"
  );
}

async function assertTheBourbonTrailPromoPage() {
  const pathname = "/p/thebourbontrail";
  const response = await fetch(HOST + pathname);
  const html = await response.text();

  assert.equal(response.status, 200, "Expected " + pathname + " to render");

  const required = [
    "thebourbontrail x BarrelBook",
    "20% off the first year of BarrelBook",
    "The Bourbon Trail audience gets 20% off",
    "Plus Annual",
    "$39.20 first year",
    "Pro Annual",
    "$79 first year",
    "Claim Plus Annual",
    "Claim Pro Annual",
    "Manual fallback",
    "Plus Annual App Store Code",
    "Pro Annual App Store Code",
  ];

  for (const snippet of required) {
    assert.ok(html.includes(snippet), "Expected " + pathname + " to include \"" + snippet + "\"");
  }

  assert.ok(
    html.includes('href="barrelbook://promo/thebourbontrail-plus"'),
    "Expected Plus CTA to deep-link to thebourbontrail-plus"
  );
  assert.ok(
    html.includes('href="barrelbook://promo/thebourbontrail-pro"'),
    "Expected Pro CTA to deep-link to thebourbontrail-pro"
  );
  assert.ok(
    !html.includes("apps.apple.com/redeem"),
    "Expected The Bourbon Trail page to avoid direct Apple redeem URLs"
  );
  assert.ok(
    !html.includes("app-argument=barrelbook://promo/thebourbontrail"),
    "Expected The Bourbon Trail parent page to avoid a single parent Smart App Banner handoff"
  );
  assert.ok(
    html.toLowerCase().includes("noindex") && html.toLowerCase().includes("nofollow"),
    "Expected The Bourbon Trail page to emit noindex,nofollow metadata"
  );

  const fallbackIndex = html.indexOf('data-testid="creator-multi-offer-manual-fallback"');
  assert.ok(fallbackIndex > -1, "Expected The Bourbon Trail page to include fallback disclosure");
  assert.ok(
    !html.slice(fallbackIndex, fallbackIndex + 300).includes(" open"),
    "Expected The Bourbon Trail fallback disclosure to be closed by default"
  );
  assert.ok(
    !html.slice(0, fallbackIndex).includes(THE_BOURBON_TRAIL_PLUS_CODE)
      && !html.slice(0, fallbackIndex).includes(THE_BOURBON_TRAIL_PRO_CODE),
    "Expected The Bourbon Trail codes to stay out of the primary page content"
  );
  assert.ok(
    html.indexOf(THE_BOURBON_TRAIL_PLUS_CODE) > fallbackIndex
      && html.indexOf(THE_BOURBON_TRAIL_PRO_CODE) > fallbackIndex,
    "Expected The Bourbon Trail codes to be exposed inside the fallback disclosure"
  );
}

async function assertNotFound(pathname) {
  const response = await fetch(HOST + pathname);
  const html = await response.text();

  assert.equal(response.status, 404, "Expected " + pathname + " to return 404");
  assert.match(html, /not found/i, "Expected " + pathname + " to render a 404 page");
}

async function assertBottleFallbackPage() {
  const sampleResponse = await fetch(HOST + "/bottles/testBottle123");
  const sampleHtml = await sampleResponse.text();

  assert.equal(sampleResponse.status, 200, "Expected /bottles/testBottle123 to render");

  for (const snippet of [
    "Open this bottle in BarrelBook",
    "This web page is an app handoff, not a public bottle page.",
    "signed-in BarrelBook account owns it",
    "Bottle details stay private and are not shown on the web.",
  ]) {
    assert.ok(
      sampleHtml.includes(snippet),
      "Expected /bottles/testBottle123 to include \"" + snippet + "\""
    );
  }

  assert.ok(
    sampleHtml.includes('href="barrelbook://bottles/testBottle123"'),
    "Expected /bottles/testBottle123 to expose the encoded bottle deep link"
  );
  assert.ok(
    sampleHtml.includes('href="' + APP_STORE_URL + '"'),
    "Expected /bottles/testBottle123 to expose the App Store CTA"
  );
  assert.ok(
    sampleHtml.includes('name="apple-itunes-app"')
      && sampleHtml.includes("app-argument=barrelbook://bottles/testBottle123"),
    "Expected /bottles/testBottle123 to expose a Smart App Banner for the bottle link"
  );

  for (const snippet of ["MSRP", "Secondary", "imageUrl", "userId", "accountId"]) {
    assert.ok(
      !sampleHtml.includes(snippet),
      "Expected /bottles/testBottle123 to avoid private bottle snippet \"" + snippet + "\""
    );
  }

  const encodedResponse = await fetch(HOST + "/bottles/test%20Bottle%20123");
  const encodedHtml = await encodedResponse.text();

  assert.equal(
    encodedResponse.status,
    200,
    "Expected /bottles/test%20Bottle%20123 to render"
  );
  assert.ok(
    encodedHtml.includes('href="barrelbook://bottles/test%20Bottle%20123"'),
    "Expected bottle IDs with spaces to stay URL-encoded in the deep link"
  );
}

async function assertRobotsDisallowsPromoPaths() {
  const response = await fetch(HOST + "/robots.txt");
  const text = await response.text();

  assert.equal(response.status, 200, "Expected robots.txt to render");

  for (const directive of [
    "Disallow: /p/",
    "Disallow: /qa/",
    "Disallow: /blackshirt",
    "Disallow: /thebourbontrail",
    "Disallow: /fnf",
    "Disallow: /garysplus",
  ]) {
    assert.ok(text.includes(directive), "Expected robots.txt to include " + directive);
  }
}

async function assertSitemapExcludesPromoPages() {
  const response = await fetch(HOST + "/sitemap.xml");
  const text = await response.text();

  assert.equal(response.status, 200, "Expected sitemap.xml to render");
  assert.ok(!text.includes("/p/"), "Expected sitemap.xml to exclude promo pages");
  assert.ok(!text.includes("blackshirt"), "Expected sitemap.xml to exclude Black Shirt alias");
  assert.ok(!text.includes("thebourbontrail"), "Expected sitemap.xml to exclude The Bourbon Trail alias");
  assert.ok(!text.includes("/bottles/"), "Expected sitemap.xml to exclude bottle pages");
}

function assertAasaComponent(components, path, comment) {
  assert.ok(
    components.some((component) => component?.["/"] === path && component?.comment === comment),
    "Expected " + path + " AASA component to be present"
  );
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
  assertAasaComponent(
    details[0].components,
    "/scan",
    "Universal link handoff to the BarrelBook scan experience"
  );
  assertAasaComponent(
    details[0].components,
    "/collection",
    "Universal link handoff to the BarrelBook collection experience"
  );
  assertAasaComponent(
    details[0].components,
    "/store-picks",
    "Universal link handoff to the BarrelBook store-picks experience"
  );
  assertAasaComponent(
    details[0].components,
    "/bottles/*",
    "Universal link handoff to private BarrelBook bottle links"
  );
  assertAasaComponent(
    details[0].components,
    "/p/*",
    "Canonical BarrelBook promo links"
  );
  assertAasaComponent(
    details[0].components,
    "/gift/*",
    "Canonical BarrelBook Golden Ticket links"
  );
}

async function main() {
  await assertRedirectConfig();

  const server = startDevServer();

  try {
    await waitForServer(server);
    await assertPromoPage("/p/fnf");
    await assertPromoPage("/p/garysplus");
    await assertBlackshirtPromoPage();
    await assertTheBourbonTrailPromoPage();
    await assertRuntimeRedirect("/blackshirt", "/p/blackshirt");
    await assertRuntimeRedirect("/thebourbontrail", "/p/thebourbontrail");
    await assertPromoPage("/qa/fnf");
    await assertBottleFallbackPage();
    await assertNotFound("/p/unknown-slug");
    await assertRobotsDisallowsPromoPaths();
    await assertSitemapExcludesPromoPages();
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
