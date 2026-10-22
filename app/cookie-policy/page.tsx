import { legalRoute } from "@/components/legal/legal-route"

const route = legalRoute("cookie-policy", "/cookie-policy")

export const generateMetadata = route.generateMetadata
export default route.LegalPageRoute
