import { checkRole } from '@/access/utilities'
import React from 'react'
import Link from 'next/link'
import type { AdminViewServerProps } from 'payload'
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  Check,
  Circle,
  Image as ImageIcon,
  Package,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Users,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

async function getRangeStart() {
  return new Date(Date.now() - 30 * 86400000).toISOString()
}

export async function Dashboard({ initPageResult }: AdminViewServerProps) {
  const { req } = initPageResult
  if (!checkRole(['admin'], req.user)) return <p>Administrator access is required.</p>
  const payload = req.payload
  const since = await getRangeStart()
  // Payload's Local API mutates req; never reuse the server component's request.
  const scoped = () => ({
    req: { ...req, context: { ...req.context }, query: { ...req.query } },
    overrideAccess: false,
  }) as const
  const [products, orders, customers, lowProducts, lowVariants, recent, stock, media] =
    await Promise.all([
      payload.count({ ...scoped(), collection: 'products' }),
      payload.count({
        ...scoped(),
        collection: 'orders',
        where: { createdAt: { greater_than_equal: since } },
      }),
      payload.count({ ...scoped(), collection: 'users', where: { roles: { contains: 'customer' } } }),
      payload.count({
        ...scoped(),
        collection: 'products',
        where: {
          and: [{ enableVariants: { not_equals: true } }, { inventory: { less_than_equal: 5 } }],
        },
      }),
      payload.count({
        ...scoped(),
        collection: 'variants',
        where: { inventory: { less_than_equal: 5 } },
      }),
      payload.find({ ...scoped(), collection: 'orders', sort: '-createdAt', limit: 6, depth: 1 }),
      payload.find({
        ...scoped(),
        collection: 'variants',
        sort: 'inventory',
        limit: 4,
        depth: 1,
        where: { inventory: { less_than_equal: 5 } },
      }),
      payload.count({ ...scoped(), collection: 'media' }),
    ])
  const metrics = [
    {
      label: 'Total products',
      value: products.totalDocs,
      hint: 'Your complete catalogue',
      icon: ShoppingBag,
      href: '/admin/collections/products',
    },
    {
      label: 'Orders',
      value: orders.totalDocs,
      hint: 'Created in the last 30 days',
      icon: ShoppingCart,
      href: '/admin/collections/orders',
    },
    {
      label: 'Customers',
      value: customers.totalDocs,
      hint: 'Registered customer accounts',
      icon: Users,
      href: '/admin/collections/users',
    },
    {
      label: 'Low stock',
      value: lowProducts.totalDocs + lowVariants.totalDocs,
      hint: 'Products / variants with ≤ 5 units',
      icon: Box,
      href: '/admin/collections/variants',
    },
  ]
  const paymentReady = Boolean(
    process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_',
  )
  const checks = [
    {
      name: 'Product catalogue',
      ready: products.totalDocs > 0,
      detail: `${products.totalDocs} products`,
      href: '/admin/collections/products',
    },
    {
      name: 'Media library',
      ready: media.totalDocs > 0,
      detail: `${media.totalDocs} assets`,
      href: '/admin/collections/media',
    },
    {
      name: 'Payments',
      ready: paymentReady,
      detail: paymentReady ? 'Provider configured' : 'Not connected',
      href: '/admin/collections/transactions',
    },
    { name: 'Email delivery', ready: false, detail: 'Not connected', href: '/admin/account' },
  ]
  return (
    <div className="inbirr-dashboard inbirr-admin-ui">
      <header className="inbirr-dashboard__heading">
        <div>
          <p className="inbirr-eyebrow">YOUR STORE, AT A GLANCE</p>
          <h1>
            Overview<span className="inbirr-heading-dot">.</span>
          </h1>
          <p>Welcome back. Here’s what’s happening in your store.</p>
        </div>
        <div className="inbirr-heading-actions">
          <Button asChild variant="outline">
            <a href="/shop" target="_blank" rel="noopener noreferrer">
              View store
              <ArrowUpRight size={15} />
            </a>
          </Button>
          <Button asChild>
            <Link href="/admin/collections/products/create">
              <Plus size={16} />
              Add product
            </Link>
          </Button>
        </div>
      </header>
      {!paymentReady && (
        <div className="inbirr-preview-note">
          <span className="inbirr-preview-note__icon">
            <Circle size={16} />
          </span>
          <div>
            <strong>Your store is in preview</strong>
            <span>
              Configure your catalog, payments and email before taking customer orders.
            </span>
          </div>
          <span className="inbirr-badge">Preview</span>
        </div>
      )}
      <div className="inbirr-metrics">
        {metrics.map(({ label, value, hint, icon: Icon, href }) => (
          <Card key={label} className="inbirr-metric">
            <CardHeader>
              <CardDescription>{label}</CardDescription>
              <Icon size={17} strokeWidth={1.6} />
            </CardHeader>
            <CardContent>
              <strong>{value.toLocaleString()}</strong>
              <p>{hint}</p>
              <Link
                href={href}
                aria-label={`View ${label.toLowerCase()}`}
                className="inbirr-metric__link"
              >
                <ArrowUpRight size={17} />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="inbirr-dashboard__columns">
        <div className="inbirr-dashboard__main">
          <Card>
            <CardHeader className="inbirr-panel-heading">
              <div>
                <CardTitle>Recent orders</CardTitle>
                <CardDescription>The latest activity across your store.</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/collections/orders">
                  View all
                  <ArrowRight size={14} />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="inbirr-table-content">
              <div className="inbirr-table-scroll">
                <table className="inbirr-orders-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Customer</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th className="inbirr-number">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.docs.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <Link
                            href={`/admin/collections/orders/${order.id}`}
                            className="inbirr-order-id"
                          >
                            #{String(order.id).padStart(4, '0')}
                          </Link>
                        </td>
                        <td>
                          <span className="inbirr-customer-name">
                            {typeof order.customer === 'object' && order.customer
                              ? order.customer.name || order.customer.email
                              : order.customerEmail || 'Guest customer'}
                          </span>
                          <small>{order.customerEmail}</small>
                        </td>
                        <td>
                          <span
                            className={`inbirr-badge inbirr-badge--${order.status || 'processing'}`}
                          >
                            <span />
                            {order.status || 'processing'}
                          </span>
                        </td>
                        <td className="inbirr-muted">
                          {new Intl.DateTimeFormat('en', {
                            day: 'numeric',
                            month: 'short',
                            timeZone: 'Africa/Addis_Ababa',
                          }).format(new Date(order.createdAt))}
                        </td>
                        <td className="inbirr-number">
                          {new Intl.NumberFormat('en', {
                            style: 'currency',
                            currency: order.currency || 'USD',
                          }).format((order.amount || 0) / 100)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {recent.docs.length === 0 && (
                <div className="inbirr-empty">
                  <Package size={28} />
                  <h3>No orders yet</h3>
                  <p>New orders will appear here.</p>
                </div>
              )}
            </CardContent>
            <div className="inbirr-panel-footnote">
              Amounts are recorded order values. Sample orders are not live sales.
            </div>
          </Card>
          <Card className="inbirr-quick-panel">
            <CardHeader>
              <CardTitle>Make it yours</CardTitle>
              <CardDescription>A few shortcuts to keep your store moving.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/collections/products/create">
                <span className="inbirr-shortcut-icon">
                  <ShoppingBag size={19} />
                </span>
                <span>
                  <strong>Add a product</strong>
                  <small>Build your next collection</small>
                </span>
                <ArrowUpRight size={17} />
              </Link>
              <Link href="/admin/collections/media">
                <span className="inbirr-shortcut-icon">
                  <ImageIcon size={19} />
                </span>
                <span>
                  <strong>Manage photos</strong>
                  <small>Upload and organize your media</small>
                </span>
                <ArrowUpRight size={17} />
              </Link>
              <Link href="/admin/collections/pages">
                <span className="inbirr-shortcut-icon">
                  <Package size={19} />
                </span>
                <span>
                  <strong>Edit storefront</strong>
                  <small>Update your pages and content</small>
                </span>
                <ArrowUpRight size={17} />
              </Link>
            </CardContent>
          </Card>
        </div>
        <div className="inbirr-dashboard__aside">
          <Card>
            <CardHeader>
              <CardTitle>Store checklist</CardTitle>
              <CardDescription>A little preparation goes a long way.</CardDescription>
            </CardHeader>
            <CardContent className="inbirr-checklist">
              {checks.map((check) => (
                <Link key={check.name} href={check.href}>
                  <span className={`inbirr-check ${check.ready ? 'is-ready' : ''}`}>
                    {check.ready ? <Check size={13} /> : <Circle size={13} />}
                  </span>
                  <span>
                    <strong>{check.name}</strong>
                    <small>{check.detail}</small>
                  </span>
                  <ArrowUpRight size={14} />
                </Link>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="inbirr-panel-heading">
              <div>
                <CardTitle>Inventory watch</CardTitle>
                <CardDescription>Variants that could use attention.</CardDescription>
              </div>
              <Box size={18} />
            </CardHeader>
            <CardContent className="inbirr-stock-list">
              {stock.docs.length ? (
                stock.docs.map((variant) => (
                  <Link href={`/admin/collections/variants/${variant.id}`} key={variant.id}>
                    <span className="inbirr-stock-icon">
                      <Box size={17} />
                    </span>
                    <span>
                      <strong>
                        {variant.title ||
                          (typeof variant.product === 'object' && variant.product
                            ? variant.product.title
                            : `Variant #${variant.id}`)}
                      </strong>
                      <small>
                        {variant.inventory === 0
                          ? 'Out of stock'
                          : `${variant.inventory} units remaining`}
                      </small>
                    </span>
                    <span
                      className={`inbirr-stock-number ${variant.inventory === 0 ? 'is-zero' : ''}`}
                    >
                      {variant.inventory}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="inbirr-stock-healthy">
                  <Check size={18} />
                  <span>No low-stock variants</span>
                </div>
              )}
            </CardContent>
            <Link className="inbirr-panel-bottom-link" href="/admin/collections/variants">
              Manage inventory
              <ArrowRight size={15} />
            </Link>
          </Card>
        </div>
      </div>
      <footer className="inbirr-dashboard__footer">
        <span>Inbirr Ecom · Store workspace</span>
        <span>Made for the details.</span>
      </footer>
    </div>
  )
}
