import type { MetadataRoute } from "next"

import { getSiteUrl } from "@/lib/seo"

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await getSiteUrl()
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${origin}/sitemap.xml` }
}
