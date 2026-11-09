import { checkRole } from '@/access/utilities'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { getServerSideURL } from '@/utilities/getURL'
export const metadata = { title: 'Connect your AI | Inbirr Ecom' }
export default async function AIConnections() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/login?redirect=/account/ai')
  if (!checkRole(['admin'], user)) notFound()
  return (
    <section className="prose py-8 max-w-3xl">
      <p className="inbirr-kicker">INBIRR ECOM OPEN SOURCE</p>
      <h1>Connect your AI</h1>
      <p>
        Manage products and view orders from an MCP-compatible assistant. Code customization uses
        your repository and its agent instructions.
      </p>
      <p>
        Endpoint: <code>{getServerSideURL()}/api/mcp</code>
      </p>
      <p>
        Status:{' '}
        {process.env.MCP_ENABLED === 'true'
          ? 'Enabled'
          : 'Disabled — set MCP_ENABLED=true and restart.'}
      </p>
      <ol>
        <li>Create an AI access key linked to your own store-manager account.</li>
        <li>
          Enable API access and select only the tools this assistant needs. All capabilities start
          off.
        </li>
        <li>
          Add this endpoint to your client with an Authorization header containing Bearer followed
          by your key.
        </li>
        <li>
          Try “Find my products” or “Create a product draft.” Keep credentials in your client’s
          secret storage.
        </li>
      </ol>
      <p>
        <Link href="/admin/collections/payload-mcp-api-keys">Manage AI access keys →</Link>
      </p>
      <p>
        <Link href="/admin/collections/mcp-audit">Review AI activity →</Link>
      </p>
      <p>
        Set an expiry date or disable a key to revoke it. This release uses bearer keys;
        browser-based OAuth connection is not included yet.
      </p>
    </section>
  )
}
