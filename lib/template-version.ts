// The site template's version: package.json's "version" (x.y.z, no "v"), the one value code and tests read. A build
// reads it from package.json at the template commit it builds from, and Website Studio records it (TP.5, TP.9). An MR
// that adds something a backend capability needs bumps the minor version; SEO_PAGES_MIN_TEMPLATE_VERSION (TP.9) names
// the first version that has it. 0.2.0 is the first with the dish pages (/tags/[slug]) and the home FAQ (SiteFaq).
import packageJson from "../package.json"

export const SITE_TEMPLATE_VERSION: string = packageJson.version
