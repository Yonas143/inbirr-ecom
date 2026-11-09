import config from '@payload-config'
import { getPayload } from 'payload'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowRight, Flower2, Gem, Heart, Sparkles } from 'lucide-react'
import { ProductGridItem } from '@/components/ProductGridItem'

// Direct DB reads must not freeze the catalog into a build-time homepage.
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Inbirr Ecom | Open commerce. Your way.',
  description: 'An open-source commerce starter with a storefront, admin, and AI connections.',
}

export default async function HomePage() {
  const payload = await getPayload({ config })
  const products = await payload.find({
    collection: 'products',
    draft: false,
    overrideAccess: false,
    limit: 4,
    sort: '-createdAt',
    where: { _status: { equals: 'published' } },
    select: { title: true, slug: true, gallery: true, categories: true, priceInUSD: true },
  })
  return (
    <>
      <section className="inbirr-hero" aria-labelledby="hero-title">
        <div className="inbirr-hero__photo">
          <Image
            src="/images/studio.svg"
            alt="Illustrated tote, cup and everyday objects"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="inbirr-hero__shade" />
        <div className="inbirr-hero__content">
          <p className="inbirr-kicker">
            <span /> INBIRR ECOM OPEN SOURCE
          </p>
          <h1 id="hero-title">
            Your next chapter.
            <br />
            <em>Starts here.</em>
          </h1>
          <p className="inbirr-hero__intro">
            A storefront you can make your own.
            <br />A workspace your AI can help run.
          </p>
          <div className="inbirr-hero__actions">
            <Link className="inbirr-pill inbirr-pill--cream" href="/shop">
              Explore the collection <ArrowRight size={17} />
            </Link>
            <Link className="inbirr-hero__text-link" href="/#our-story">
              The Inbirr story <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <div className="inbirr-hero__bottom">
          <span>ROOTED IN MEANING. WORN YOUR WAY.</span>
          <a href="#collection" aria-label="Discover the collection">
            <ArrowDown size={20} />
          </a>
        </div>
      </section>

      <section className="inbirr-values inbirr-wrap" aria-labelledby="values-title">
        <div className="inbirr-section-heading">
          <div>
            <p className="inbirr-kicker">THE INBIRR SPIRIT</p>
            <h2 id="values-title">
              Small details.
              <br />
              <em>Deep meaning.</em>
            </h2>
          </div>
          <p>
            Start with the essentials. Make the experience your own, from the first product to your
            next collection.
          </p>
        </div>
        <div className="inbirr-values__grid">
          {[
            {
              icon: Gem,
              number: '01',
              title: 'In the details',
              copy: 'Pieces that invite a closer look.',
            },
            {
              icon: Heart,
              number: '02',
              title: 'Made meaningful',
              copy: 'A personal touch for your own story.',
            },
            {
              icon: Flower2,
              number: '03',
              title: 'Rooted in beauty',
              copy: 'A celebration of warmth and connection.',
            },
            {
              icon: Sparkles,
              number: '04',
              title: 'Worn your way',
              copy: 'Everyday moments. Special occasions. You.',
            },
          ].map(({ icon: Icon, number, title, copy }) => (
            <div className="inbirr-value" key={number}>
              <div>
                <Icon size={25} strokeWidth={1.25} />
                <span>{number}</span>
              </div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="inbirr-collection" id="collection">
        <div className="inbirr-wrap">
          <div className="inbirr-section-heading">
            <div>
              <p className="inbirr-kicker">THE COLLECTION</p>
              <h2>
                Find your
                <br />
                <em>next favourite.</em>
              </h2>
            </div>
            <div>
              <p>
                A new detail. A familiar feeling.
                <br />
                Explore what’s in store.
              </p>
              <Link className="inbirr-pill inbirr-pill--outline" href="/shop">
                View all pieces <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          {products.docs.length ? (
            <div className="inbirr-product-grid">
              {products.docs.map((product) => (
                <ProductGridItem key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="inbirr-empty-collection">
              <Gem size={28} />
              <h3>Something beautiful is on its way.</h3>
              <p>Our collection will appear here as new pieces arrive.</p>
            </div>
          )}
        </div>
      </section>

      <section className="inbirr-story inbirr-wrap" id="our-story">
        <div className="inbirr-story__art">
          <Image
            src="/images/studio.svg"
            alt="Illustrated collection of everyday products"
            width={1360}
            height={1130}
            sizes="(max-width: 767px) 100vw, 55vw"
          />
          <span className="inbirr-story__seal">
            A LITTLE
            <br />
            <Flower2 size={29} strokeWidth={1} />
            <em>meaning.</em>
          </span>
        </div>
        <div className="inbirr-story__copy">
          <p className="inbirr-kicker">THE INBIRR STORY</p>
          <h2>
            More than
            <br />
            <em>something beautiful.</em>
          </h2>
          <p>
            A store starts with an idea. Bring your own products, identity, and way of doing
            business.
          </p>
          <p>
            Inbirr Ecom is an open-source foundation for your store. Built for the details that make
            it yours.
          </p>
          <Link href="/shop" className="inbirr-pill inbirr-pill--green">
            Explore the collection <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <section className="inbirr-closing">
        <div className="inbirr-wrap">
          <p className="inbirr-kicker">YOURS TO MAKE MEANINGFUL</p>
          <h2>
            Keep a little
            <br />
            <em>beauty close.</em>
          </h2>
          <Link href="/shop" className="inbirr-pill inbirr-pill--cream">
            Discover Inbirr <ArrowRight size={17} />
          </Link>
          <Flower2 className="inbirr-closing__flower" strokeWidth={0.4} aria-hidden="true" />
        </div>
      </section>
    </>
  )
}
