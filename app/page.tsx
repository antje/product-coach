'use client'

import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, FlaskConical } from 'lucide-react'
import { EXPERIMENTS } from '@/lib/data/corpus'

/**
 * The front door.
 *
 * It exists to do one job before letting anyone in: say what this is. Someone
 * arriving cold on the review screen sees a form and a panel and has no idea
 * what they are looking at, which is a bad first ten seconds for a product
 * whose whole argument is a single sentence.
 *
 * The entire surface is clickable, Enter works, and there is a visible button,
 * so nobody has to guess which of the three it is.
 */
export default function Landing() {
  const router = useRouter()
  const enter = useCallback(() => router.push('/review'), [router])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        enter()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [enter])

  return (
    <main
      className="landing"
      onClick={enter}
      role="button"
      tabIndex={0}
      aria-label="Enter product-coach"
    >
      <div className="landing-inner">
        <div className="landing-mark">
          <FlaskConical size={40} strokeWidth={1.9} />
        </div>

        <h1 className="landing-word">product-coach</h1>

        <p className="landing-claim">
          A review layer for product decisions. It objects using your team&apos;s own numbers, then
          records whether it was right.
        </p>

        <button className="landing-enter" type="button" onClick={enter}>
          Enter <ArrowRight size={15} />
          <span className="shortcut">↵</span>
        </button>

        <div className="landing-meta">
          <span>{EXPERIMENTS.length} experiments indexed</span>
          <span className="meta-divider" />
          <Link href="/history" onClick={(e) => e.stopPropagation()}>
            Team history
          </Link>
          <span className="meta-divider" />
          <Link href="/record" onClick={(e) => e.stopPropagation()}>
            The record
          </Link>
        </div>
      </div>

      <p className="landing-foot">
        The coach is graded on its own objections. Its misses are on the record too.
      </p>
    </main>
  )
}
