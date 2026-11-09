import type { Product } from '@/payload-types'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { Price } from '@/components/Price'
import { ArrowUpRight, Gem } from 'lucide-react'

export const ProductGridItem = ({ product }: { product: Partial<Product> }) => {
  const image = product.gallery?.[0]?.image
  const category = product.categories?.find((category) => typeof category === 'object')
  return (
    <Link className="inbirr-product-card" href={`/products/${product.slug}`}>
      <div className="inbirr-product-card__image">
        {image && typeof image === 'object' ? (
          <Media
            resource={image}
            className="inbirr-product-card__media"
            imgClassName="inbirr-product-card__photo"
            size="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
          />
        ) : (
          <Gem size={48} strokeWidth={0.8} />
        )}
        <span className="inbirr-product-card__arrow">
          <ArrowUpRight size={19} />
        </span>
      </div>
      <div className="inbirr-product-card__info">
        <p className="inbirr-kicker">
          {typeof category === 'object' ? category.title : 'THE INBIRR COLLECTION'}
        </p>
        <h3>{product.title}</h3>
        <div>
          {typeof product.priceInUSD === 'number' ? (
            <Price amount={product.priceInUSD} />
          ) : (
            <span>View details</span>
          )}
        </div>
      </div>
    </Link>
  )
}
