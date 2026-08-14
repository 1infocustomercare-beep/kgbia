'use client'

import { Suspense, lazy, useMemo, Component, type ReactNode, type ErrorInfo } from 'react'
import { cn } from '@/lib/utils'

const Spline = lazy(() => import('@splinetool/react-spline'))

/**
 * Scene 3D curate per ogni verticale Empire.
 * Sostituibili con scene proprietarie hostate su prod.spline.design.
 *
 * NOTA: molte scene di esempio di Spline restituiscono 403 se non sono
 * pubbliche o se il piano è scaduto. Per questo motivo il componente
 * include un error boundary che non blocca mai la pagina.
 */
export const SECTOR_SCENES: Record<string, string> = {
  food: 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode',
  restaurant: 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode',
  beauty: 'https://prod.spline.design/kZ1IXp7Q3sLqf3sV/scene.splinecode',
  ncc: 'https://prod.spline.design/us3AdkbBcW8wIK6N/scene.splinecode',
  fitness: 'https://prod.spline.design/JzVrTrFtUmHGzqV3/scene.splinecode',
  hospitality: 'https://prod.spline.design/Ej8x9rH0sQpYpJ3J/scene.splinecode',
  // Fallback verificato (200). Sostituire con scena AI proprietaria quando disponibile.
  ai: 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode',
  default: 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode',
}

export type EmpireSector = keyof typeof SECTOR_SCENES

interface SplineSceneProps {
  /** URL diretto a .splinecode. Se omesso, usa la scena del sector. */
  scene?: string
  /** Verticale Empire: seleziona automaticamente una scena coerente. */
  sector?: EmpireSector | string
  className?: string
  /** Mostra un alone luxury (oro/smeraldo) dietro la scena. */
  glow?: boolean
}

interface SplineErrorBoundaryState {
  hasError: boolean
}

class SplineErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, SplineErrorBoundaryState> {
  state: SplineErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): SplineErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[SplineScene] 3D scene failed to render:', error?.message, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

export function SplineScene({ scene, sector = 'default', className, glow = true }: SplineSceneProps) {
  const sceneUrl = useMemo(
    () => scene ?? SECTOR_SCENES[sector as EmpireSector] ?? SECTOR_SCENES.default,
    [scene, sector],
  )

  const fallback = (
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[hsl(42_75%_55%)] border-r-[hsl(160_70%_45%)] animate-spin" />
          <div className="absolute inset-1 rounded-full border border-white/10" />
        </div>
        <span className="text-[11px] uppercase tracking-[0.3em] text-white/60">Loading scene</span>
      </div>
    </div>
  )

  return (
    <div className={cn('relative w-full h-full overflow-hidden', className)}>
      {glow && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-10 z-0 opacity-60 blur-3xl"
            style={{
              background:
                'radial-gradient(60% 50% at 30% 40%, hsl(160 70% 35% / 0.35), transparent 70%), radial-gradient(45% 40% at 75% 70%, hsl(42 75% 55% / 0.25), transparent 70%)',
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20"
            style={{
              background:
                'radial-gradient(120% 90% at 50% 50%, transparent 55%, hsl(162 30% 6% / 0.55) 100%)',
            }}
          />
        </>
      )}

      <Suspense fallback={fallback}>
        <SplineErrorBoundary fallback={null}>
          <Spline scene={sceneUrl} className={cn('relative z-10 !w-full !h-full', className)} />
        </SplineErrorBoundary>
      </Suspense>
    </div>
  )
}

export default SplineScene
