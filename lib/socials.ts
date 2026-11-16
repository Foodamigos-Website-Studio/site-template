// The restaurant's social profiles (SO.4): the site API's `socials` {instagram, facebook, tiktok}, only the ones set.
// The footer and the menu show an icon link for each; the restaurant JSON-LD lists them as sameAs. Nothing set:
// nothing renders.

export type SocialNetwork = "instagram" | "facebook" | "tiktok"

export type SocialLink = { network: SocialNetwork; label: string; href: string }

const NETWORKS: readonly { network: SocialNetwork; label: string }[] = [
  { network: "instagram", label: "Instagram" },
  { network: "facebook", label: "Facebook" },
  { network: "tiktok", label: "TikTok" },
]

/** The set profiles in a fixed order (Instagram, Facebook, TikTok); only https links, anything else is left out. */
export function socialLinks(socials: Record<string, string> | null | undefined): SocialLink[] {
  return NETWORKS.flatMap(({ network, label }) => {
    const href = socials?.[network]?.trim()
    return href && href.startsWith("https://") ? [{ network, label, href }] : []
  })
}

/** schema.org sameAs: the profile URLs, or undefined when there are none (so the key is left out). */
export function sameAs(socials: Record<string, string> | null | undefined): string[] | undefined {
  const links = socialLinks(socials).map((link) => link.href)
  return links.length > 0 ? links : undefined
}
