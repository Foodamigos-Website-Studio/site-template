import { seoPageRoute } from "@/components/seo/seo-page-route"

const route = seoPageRoute("coupons", "/angebote")

export const generateMetadata = route.generateMetadata
export default route.SeoPageRoute
