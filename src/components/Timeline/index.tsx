import type { DynastyId, DynastyInfo } from '../../types/porcelain'

interface TimelineProps {
  dynasties: DynastyInfo[]
  activeId: DynastyId
  onChange: (id: DynastyId) => void
}

export function Timeline({ dynasties, activeId, onChange }: TimelineProps) {
  return (
    <div className="relative px-4">
      <div className="absolute left-8 right-8 top-[11px] h-px bg-ink/15" />
      <div
        className="relative grid gap-2"
        style={{ gridTemplateColumns: `repeat(${dynasties.length}, minmax(0, 1fr))` }}
      >
        {dynasties.map((d) => {
          const active = d.id === activeId
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => onChange(d.id)}
              className="group flex flex-col items-center focus:outline-none"
            >
              <span
                className={
                  'flex h-6 w-6 items-center justify-center rounded-full border bg-ivory transition-colors ' +
                  (active ? 'border-gold' : 'border-ink/25 group-hover:border-gold/60')
                }
              >
                <span
                  className={
                    'h-2.5 w-2.5 rounded-full transition-all ' +
                    (active ? 'bg-gold' : 'bg-transparent')
                  }
                />
              </span>
              <span
                className={
                  'mt-3 font-display text-2xl transition-colors ' +
                  (active ? 'text-ink' : 'text-ink-soft group-hover:text-ink')
                }
              >
                {d.name}
              </span>
              <span className="mt-1 text-xs tracking-wide text-ink-soft/70">{d.years}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Timeline
