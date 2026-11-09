import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/access/adminOnly'
export const MCPAudit: CollectionConfig = {
  slug: 'mcp-audit',
  labels: { singular: 'AI Activity', plural: 'AI Activity' },
  admin: {
    group: 'MCP',
    useAsTitle: 'action',
    defaultColumns: ['action', 'actor', 'documentID', 'createdAt'],
  },
  access: { create: adminOnly, read: adminOnly, update: () => false, delete: () => false },
  fields: [
    { name: 'action', type: 'text', required: true, index: true },
    { name: 'actor', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'documentID', type: 'text', required: true },
  ],
}
