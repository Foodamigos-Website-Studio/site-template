// The promo bar at the top of every page (F-PB): the restaurant's active promo codes from the site API, linking to
// /menu. Nothing while the online shop is off or there is no code. Keep it in the root layout above the header.
import { PromoBarView } from "@/components/site/promo-bar-view"
import { SITE_LANGUAGE } from "@/lib/config"
import { promoBarCodes, promoBarTexts } from "@/lib/promo-bar"
import { getProject, getPromoCodes } from "@/lib/studio-api"

export async function PromoBar() {
  const [project, codes] = await Promise.all([getProject(), getPromoCodes()])
  const visible = promoBarCodes(codes, project)
  if (visible.length === 0) return null
  return <PromoBarView codes={visible} texts={promoBarTexts(SITE_LANGUAGE)} />
}
