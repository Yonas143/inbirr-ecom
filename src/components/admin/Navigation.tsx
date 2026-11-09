'use client'

import { useAuth, useNav } from '@payloadcms/ui'
import {
  ArrowUpRight,
  Box,
  ClipboardList,
  CreditCard,
  FileText,
  FolderTree,
  Home,
  Image,
  LayoutTemplate,
  ListFilter,
  LogOut,
  MapPin,
  PanelBottom,
  PanelTop,
  Settings2,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { User } from '@/payload-types'
import { Brand } from './Brand'

const groups: { title: string; items: [string, string, LucideIcon][] }[] = [
  {
    title: 'Workspace',
    items: [
      ['Overview', '/admin', Home],
      ['Products', '/admin/collections/products', ShoppingBag],
      ['Orders', '/admin/collections/orders', ClipboardList],
      ['Customers', '/admin/collections/users', Users],
    ],
  },
  {
    title: 'Catalogue',
    items: [
      ['Inventory & variants', '/admin/collections/variants', Box],
      ['Categories', '/admin/collections/categories', FolderTree],
      ['Variant types', '/admin/collections/variantTypes', SlidersHorizontal],
      ['Variant options', '/admin/collections/variantOptions', ListFilter],
    ],
  },
  {
    title: 'Store operations',
    items: [
      ['Transactions', '/admin/collections/transactions', CreditCard],
      ['Carts', '/admin/collections/carts', ShoppingCart],
      ['Addresses', '/admin/collections/addresses', MapPin],
    ],
  },
  {
    title: 'Content',
    items: [
      ['Media library', '/admin/collections/media', Image],
      ['Pages', '/admin/collections/pages', LayoutTemplate],
      ['Forms', '/admin/collections/forms', FileText],
      ['Form submissions', '/admin/collections/form-submissions', ClipboardList],
    ],
  },
  {
    title: 'Settings',
    items: [
      ['Store header', '/admin/globals/header', PanelTop],
      ['Store footer', '/admin/globals/footer', PanelBottom],
      ['AI connections', '/account/ai', Settings2],
      ['AI access keys', '/admin/collections/payload-mcp-api-keys', Settings2],
    ],
  },
]

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logOut } = useAuth<User>()
  const { hydrated, navOpen, navRef, setNavOpen, shouldAnimate } = useNav()
  const [signingOut, setSigningOut] = useState(false)
  const [error, setError] = useState('')
  if (!user?.roles?.includes('admin')) return null
  const closeMobile = () => {
    if (window.matchMedia('(max-width: 767px)').matches) setNavOpen(false)
  }
  const logout = async () => {
    setSigningOut(true)
    setError('')
    try {
      const success = await logOut()
      if (success) {
        router.push('/admin/login')
        router.refresh()
      } else throw new Error()
    } catch {
      setError('Could not sign out. Try again.')
      setSigningOut(false)
    }
  }
  return (
    <aside
      className={[
        'nav',
        'inbirr-sidebar',
        navOpen && 'nav--nav-open',
        hydrated && 'nav--nav-hydrated',
        shouldAnimate && 'nav--nav-animate',
      ]
        .filter(Boolean)
        .join(' ')}
      inert={!navOpen || undefined}
    >
      <div className="nav__scroll inbirr-sidebar__scroll" ref={navRef}>
        <button type="button" className="inbirr-mobile-close" aria-label="Close navigation" onClick={() => setNavOpen(false)}>
          <X size={18} />
        </button>
        <Link
          href="/admin"
          className="inbirr-sidebar__brand"
          onClick={closeMobile}
          aria-label="Inbirr admin overview"
        >
          <Brand />
        </Link>
        <div className="inbirr-workspace">
          <span className="inbirr-workspace__avatar">E</span>
          <div>
            <strong>Inbirr Ecom</strong>
            <span>Store workspace</span>
          </div>
          <span className="inbirr-status-dot" aria-label="Workspace available" />
        </div>
        <nav aria-label="Store administration" className="inbirr-sidebar__links">
          {groups.map((group) => (
            <section key={group.title} className="inbirr-nav-group">
              <h2>{group.title}</h2>
              {group.items.map(([label, href, Icon]) => {
                const active =
                  href === '/admin'
                    ? pathname === href
                    : pathname.startsWith(href) && ['/', undefined].includes(pathname[href.length])
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`inbirr-nav-item${active ? ' is-active' : ''}`}
                    aria-current={active ? 'page' : undefined}
                    onClick={closeMobile}
                  >
                    <Icon size={17} strokeWidth={1.7} />
                    <span>{label}</span>
                    {active && <span className="inbirr-nav-item__dot" />}
                  </Link>
                )
              })}
            </section>
          ))}
        </nav>
        <div className="inbirr-sidebar__footer inbirr-admin-ui">
          <a href="/shop" target="_blank" rel="noopener noreferrer" className="inbirr-nav-item">
            <ArrowUpRight size={17} />
            <span>View storefront</span>
          </a>
          <Link href="/admin/account" className="inbirr-user" onClick={closeMobile}>
            <span className="inbirr-user__avatar">
              {(user.name || user.email || 'A').slice(0, 1).toUpperCase()}
            </span>
            <span>
              <strong>{user.name || 'Administrator'}</strong>
              <small>{user.email}</small>
            </span>
            <Settings2 size={16} />
          </Link>
          <Button variant="outline" className="inbirr-signout" onClick={logout} disabled={signingOut}>
            <LogOut size={15} />
            {signingOut ? 'Signing out…' : 'Sign out'}
          </Button>
          {error && (
            <p role="alert" className="inbirr-inline-error">
              {error}
            </p>
          )}
        </div>
      </div>
    </aside>
  )
}
