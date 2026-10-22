import { legalRoute } from "@/components/legal/legal-route"

const route = legalRoute("privacy-policy", "/datenschutzerklaerung")

export const generateMetadata = route.generateMetadata
export default route.LegalPageRoute
