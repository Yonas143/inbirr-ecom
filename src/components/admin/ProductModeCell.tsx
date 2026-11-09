import React from 'react'

export function ProductModeCell({ cellData }: { cellData?: boolean | null }) {
  return <span className="inbirr-badge">{cellData ? 'Variants' : 'Single product'}</span>
}
