import { brand } from '@/brand'
import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import { ArrowUpRight, Flower2 } from 'lucide-react'

export async function Footer() {
  const footer = await getCachedGlobal('footer', 1)()
  return (
    <footer className="inbirr-footer">
      <div className="inbirr-wrap">
        <div className="inbirr-footer__top">
          <div>
            <Link href="/" className="inbirr-wordmark">
              {brand.name}
              <span>OPEN SOURCE</span>
            </Link>
            <p>{brand.tagline}</p>
          </div>
          <div>
            <p className="inbirr-kicker">EXPLORE</p>
            <Link href="/shop">
              The collection <ArrowUpRight size={14} />
            </Link>
            <Link href="/#our-story">
              Our story <ArrowUpRight size={14} />
            </Link>
          </div>
          <div>
            <p className="inbirr-kicker">YOUR INBIRR</p>
            <Link href="/account">
              My account <ArrowUpRight size={14} />
            </Link>
            <Link href="/orders">
              My orders <ArrowUpRight size={14} />
            </Link>
            {footer.navItems
              ?.filter(
                (item) =>
                  item.link.type === 'custom' &&
                  item.link.url?.startsWith('/') &&
                  item.link.url !== '/admin',
              )
              .map((item) => (
                <Link key={item.id} href={item.link.url!}>
                  {item.link.label}
                  <ArrowUpRight size={14} />
                </Link>
              ))}
          </div>
          <Flower2 className="inbirr-footer__flower" strokeWidth={0.6} />
        </div>
        <div className="inbirr-footer__bottom">
          <span>© {new Date().getFullYear()} Inbirr Ecom. All rights reserved.</span>
          <span>Made for the moments you keep.</span>
        </div>
      </div>
    </footer>
  )
}
