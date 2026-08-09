export const ANDROID_INTEREST_PLACEMENTS = [
  "android_page",
  "homepage_download",
] as const;

export type AndroidInterestPlacement =
  (typeof ANDROID_INTEREST_PLACEMENTS)[number];

export const ANDROID_EARLY_ACCESS_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSduUP2u6zIpyepCNcgUIggXS_j4_8B2WBNNN00DCkzlFIf_8Q/viewform?usp=publish-editor";
