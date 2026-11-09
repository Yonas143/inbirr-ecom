import React from 'react'
import { ArrowUpRight } from 'lucide-react'

export function HeaderActions() {
  return (
    <a className="inbirr-header-store" href="/shop" target="_blank" rel="noopener noreferrer">
      View store
      <ArrowUpRight size={14} />
    </a>
  )
}
