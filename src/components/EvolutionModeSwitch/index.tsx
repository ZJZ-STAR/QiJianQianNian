interface EvolutionModeSwitchProps {
  label: string
  backLabel?: string
  onBack: () => void
}

/** 个性化模式标识 + 返回经典 / 示例模式的切换条。 */
export function EvolutionModeSwitch({ label, backLabel = '返回经典演化', onBack }: EvolutionModeSwitchProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border border-gold/30 bg-gold/5 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="h-2 w-2 rounded-full bg-gold" />
        <span className="font-display text-sm tracking-wide text-gold">{label}</span>
      </div>
      <button type="button" className="btn-ghost !px-3 !py-1.5 !text-xs" onClick={onBack}>
        {backLabel}
      </button>
    </div>
  )
}

export default EvolutionModeSwitch
