import { brand } from '@/brand'
import { Gem } from 'lucide-react'
import React from 'react'

export function Brand() {
  return (
    <span className="inbirr-brand">
      <span className="inbirr-brand__mark">
        <Gem size={20} strokeWidth={1.6} />
      </span>
      <span>
        {brand.name}
        <span className="inbirr-brand__subtitle">OPEN SOURCE</span>
      </span>
    </span>
  )
}

export function BrandIcon() {
  return <Gem size={19} strokeWidth={1.6} className="inbirr-header-icon" />
}
