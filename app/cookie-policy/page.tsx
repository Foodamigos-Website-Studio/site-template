import { legalRoute } from "@/components/legal/legal-route"

const route = legalRoute("cookie-policy")

export const generateMetadata = route.generateMetadata
export default route.LegalPageRoute
