import { legalRoute } from "@/components/legal/legal-route"

const route = legalRoute("impressum", "/impressum")

export const generateMetadata = route.generateMetadata
export default route.LegalPageRoute
