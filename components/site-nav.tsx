'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CircleHelp, FlaskConical, History, ListChecks } from 'lucide-react'

/**
 * One nav for every screen. Extracted because the links used to be hardcoded
 * anchors on a single page that went nowhere.
 */
export function SiteNav() {
  const path = usePathname()
  const active = (href: string) => (path === href ? 'active' : undefined)

  return (
    <header className="topbar">
      <Link href="/" className="brand-lockup">
        <div className="brand-mark">
          <FlaskConical size={17} strokeWidth={2.2} />
        </div>
        <span>product-coach</span>
        <span className="beta-pill">BETA</span>
      </Link>
      <nav className="topnav" aria-label="Main navigation">
        <Link href="/review" className={active('/review')}>
          Review
        </Link>
        <Link href="/history" className={active('/history')}>
          <History size={14} /> Team history
        </Link>
        <Link href="/record" className={active('/record')}>
          <ListChecks size={14} /> The record
        </Link>
      </nav>
      <div className="top-actions">
        <button className="icon-button" aria-label="Help" type="button">
          <CircleHelp size={17} />
        </button>
        <div className="avatar">JS</div>
      </div>
    </header>
  )
}
