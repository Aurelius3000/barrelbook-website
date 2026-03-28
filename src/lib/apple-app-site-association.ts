const PROMO_PATH_COMPONENT = {
  "/": "/p/*",
  comment: "Canonical BarrelBook promo links",
} as const;

const GOLDEN_TICKET_PATH_COMPONENT = {
  "/": "/gift/*",
  comment: "Canonical BarrelBook Golden Ticket links",
} as const;

export const AASA_RESPONSE_HEADERS = {
  "Cache-Control": "public, max-age=300, s-maxage=300",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
} as const;

function getConfiguredAppIds(): string[] {
  const rawValue = process.env.BARRELBOOK_AASA_APP_IDS ?? "";

  return rawValue
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

export function getAppleAppSiteAssociation() {
  return {
    applinks: {
      details: [
        {
          appIDs: getConfiguredAppIds(),
          components: [PROMO_PATH_COMPONENT, GOLDEN_TICKET_PATH_COMPONENT],
        },
      ],
    },
  };
}
