// Dish pages (F-TP): /tags/{slug} on every site, whatever its language. components/seo/tag-page.tsx renders them.
import { generateTagPageMetadata, TagPageRoute } from "@/components/seo/tag-page"

export const generateMetadata = generateTagPageMetadata
export default TagPageRoute
