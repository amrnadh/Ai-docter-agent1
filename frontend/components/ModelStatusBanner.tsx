'use client'

import { useEffect, useState } from 'react'
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react'

type SpaceState = 'ready' | 'waking' | 'down' | 'checking'
type Space = 'pytorch' | 'tensorflow'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const POLL_MS = 10_000
const MAX_POLLS = 18 // ~3 minutes

/**
 * Pings the backend's /ml/status on mount. That ping also wakes a sleeping
 * free-tier model host, so by the time the user picks an image the model
 * is usually warm. Shows a small banner only while it isn't ready.
 */
export default function ModelStatusBanner({ space }: { space: Space }) {
    const [state, setState] = useState<SpaceState>('checking')

    useEffect(() => {
        let cancelled = false
        let polls = 0
        let timer: ReturnType<typeof setTimeout>

        const check = async () => {
            try {
                const res = await fetch(`${API_URL}/api/v1/ml/status`, { cache: 'no-store' })
                const data = await res.json()
                if (cancelled) return
                const next: SpaceState = data?.[space] ?? 'down'
                if (next === 'ready' || next === 'down') return setState(next)
                setState(++polls < MAX_POLLS ? 'waking' : 'down')
                if (polls < MAX_POLLS) timer = setTimeout(check, POLL_MS)
            } catch {
                if (cancelled) return
                // Backend itself may be cold-starting too; keep polling.
                setState(++polls < MAX_POLLS ? 'waking' : 'down')
                if (polls < MAX_POLLS) timer = setTimeout(check, POLL_MS)
            }
        }
        check()
        return () => {
            cancelled = true
            clearTimeout(timer)
        }
    }, [space])

    if (state === 'ready') {
        return (
            <div role="status" className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
                Model online and ready
            </div>
        )
    }

    if (state === 'down') {
        return (
            <div role="alert" className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
                The imaging model is currently unavailable. Please try again later.
            </div>
        )
    }

    return (
        <div role="status" className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
            <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
            {state === 'checking'
                ? 'Checking model status…'
                : 'Warming up the model (free hosting sleeps when idle). This usually takes under a minute.'}
        </div>
    )
}
