import { NextResponse } from "next/server";
import {
  AASA_RESPONSE_HEADERS,
  getAppleAppSiteAssociation,
} from "@/lib/apple-app-site-association";

export function GET() {
  return NextResponse.json(getAppleAppSiteAssociation(), {
    headers: AASA_RESPONSE_HEADERS,
  });
}
