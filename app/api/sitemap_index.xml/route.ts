/**
 * /sitemap_index.xml – Redirect legacy sitemap URL
 *
 * Google Search Console has /sitemap_index.xml registered from 2019.
 * This route permanently redirects it to the correct /sitemap.xml
 * so Google updates its record and stops reporting errors.
 */

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.redirect("https://transfersinbarcelona.com/sitemap.xml", {
    status: 301,
  });
}
