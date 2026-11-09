'use client'
import { brand } from '@/brand'
import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import Link from 'next/link'
import React, { Suspense, useState } from 'react'
import type { Header } from '@/payload-types'
import { Menu, Search, UserRound, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function HeaderClient({ header }: { header: Header }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const links = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Collection' },
    { href: '/#our-story', label: 'Our story' },
  ]
  const extraLinks = (header.navItems || []).filter(
    (item) => item.link.url && !['/', '/shop', '/search'].includes(item.link.url),
  )
  return (
    <header className="inbirr-header">
      <a className="inbirr-skip" href="#main-content">
        Skip to content
      </a>
      <nav className="inbirr-nav" aria-label="Main navigation">
        <Link href="/" className="inbirr-wordmark" aria-label="Inbirr Ecom home">
          {brand.name}
          <span>OPEN SOURCE</span>
        </Link>
        <div className="inbirr-nav__links">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
          {extraLinks.slice(0, 2).map((item) => (
            <Link key={item.id} href={item.link.url!}>
              {item.link.label}
            </Link>
          ))}
        </div>
        <div className="inbirr-nav__actions">
          <Link href="/shop" aria-label="Search the collection" className="inbirr-nav__icon">
            <Search size={19} strokeWidth={1.5} />
          </Link>
          <Link
            href="/account"
            aria-label="My account"
            className="inbirr-nav__icon inbirr-nav__account"
          >
            <UserRound size={19} strokeWidth={1.5} />
          </Link>
          <Suspense fallback={<OpenCartButton />}>
            <Cart />
          </Suspense>
          <button
            className="inbirr-nav__menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="store-menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="inbirr-mobile-menu" id="store-menu">
          {[...links, { href: '/account', label: 'My account' }].map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
