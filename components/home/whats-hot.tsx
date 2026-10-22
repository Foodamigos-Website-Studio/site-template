import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/ui/section-heading"
import { formatPrice } from "@/lib/format"
import { FORMAT_LOCALE, ORDER_PATH, type FeaturedProduct } from "@/lib/restaurant"

import { ProductSlider } from "./product-slider"

export function WhatsHot({ products, orderOn }: { products: FeaturedProduct[]; orderOn: boolean }) {
  if (!products.length) return null
  const items = products.map((product) => ({
    id: product.id,
    name: product.name,
    imageUrl: product.imageUrl,
    price: product.price && product.price > 0 ? formatPrice(product.price, product.currency, FORMAT_LOCALE) : null,
  }))
  return (
    <section className="texture-dots relative overflow-x-clip py-20 text-background sm:py-28">
      <div className="mx-auto max-w-[1160px] px-6">
        <Reveal>
          <SectionHeading sparkleClassName="text-primary">{"What's hot"}</SectionHeading>
        </Reveal>
      </div>
      <Reveal className="mt-12">
        <ProductSlider items={items} href={orderOn ? ORDER_PATH : "/our-menu"} />
      </Reveal>
    </section>
  )
}
