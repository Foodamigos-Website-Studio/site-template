// A thin bar along the top while the next page loads, so a click on a link shows at once that something happens (the
// draft preview compiles each page on its first visit). In the site's accent colour: --site-accent in app/globals.css.
"use client"

import NextTopLoader from "nextjs-toploader"

export function PageLoader() {
  return <NextTopLoader color="var(--site-accent, #1f1f1f)" height={3} showSpinner={false} shadow={false} speed={250} crawlSpeed={150} />
}
