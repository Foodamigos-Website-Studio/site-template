import { legalRoute } from "@/components/legal/legal-route"

const route = legalRoute("privacy-policy")

export const generateMetadata = route.generateMetadata
export default route.LegalPageRoute
