import { legalRoute } from "@/components/legal/legal-route"

const route = legalRoute("cookie-policy", "/cookie-richtlinie")

export const generateMetadata = route.generateMetadata
export default route.LegalPageRoute
