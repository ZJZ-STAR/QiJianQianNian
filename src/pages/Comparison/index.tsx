import { useEffect, useState } from 'react'
import { CompareViewer } from '../../components/CompareViewer'
import { EvolutionModeSwitch } from '../../components/EvolutionModeSwitch'
import { fetchComparisonPair } from '../../api/comparison'
import { getPorcelainById } from '../../mock/data'
import { getPersonalizedComparison } from '../../mock/personalizedEvolutionData'
import { usePorcelainModel } from '../../stores/PorcelainModelManager'
import type { ComparisonPair, ComparisonRow, Porcelain } from '../../types/porcelain'

function paramRows(left: Porcelain, right: Porcelain): ComparisonRow[] {
  const ratio = (p: Porcelain) =>
    p.params.maxBellyDiameter > 0 ? (p.params.height / p.params.maxBellyDiameter).toFixed(2) : '-'
  return [
    { label: '高度 (cm)', left: left.params.height.toFixed(1), right: right.params.height.toFixed(1) },
    {
      label: '最大腹径 (cm)',
      left: left.params.maxBellyDiameter.toFixed(1),
      right: right.params.maxBellyDiameter.toFixed(1),
    },
    { label: '口径 (cm)', left: left.params.mouthDiameter.toFixed(1), right: right.params.mouthDiameter.toFixed(1) },
    { label: '高 / 腹径', left: ratio(left), right: ratio(right) },
  ]
}

function ParamsTable({
  rows,
  leftLabel,
  rightLabel,
}: {
  rows: ComparisonRow[]
  leftLabel: string
  rightLabel: string
}) {
  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-ink/10 px-6 py-4">
        <span className="eyebrow">关键参数对比</span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink/10 text-left text-ink-soft">
            <th className="px-6 py-3 font-medium">参数</th>
            <th className="px-6 py-3 font-medium">{leftLabel}</th>
            <th className="px-6 py-3 font-medium">{rightLabel}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-ink/5 last:border-0">
              <td className="px-6 py-3 text-ink-soft">{r.label}</td>
              <td className="px-6 py-3 font-display text-ink">{r.left}</td>
              <td className="px-6 py-3 font-display text-ink">{r.right}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Comparison() {
  const { current, clearCurrent } = usePorcelainModel()
  const personalized = !!current && !!current.porcelain

  const [pair, setPair] = useState<ComparisonPair | null>(null)
  useEffect(() => {
    fetchComparisonPair().then(setPair)
  }, [])

  if (personalized) {
    const uploaded = current.porcelain!
    const { reference, insight } = getPersonalizedComparison(uploaded)
    return (
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="font-display text-3xl font-semibold text-ink">跨时期形态对比</h1>
        <p className="mt-2 text-sm text-ink-soft">将上传瓷器与历史参考案例并置，观察形态差异。</p>

        <div className="mt-6">
          <EvolutionModeSwitch label="我的瓷器 · 形态对比" backLabel="返回经典对比" onBack={clearCurrent} />
        </div>

        <div className="mt-8 flex flex-col gap-8">
          <CompareViewer
            left={uploaded}
            right={reference}
            leftLabel="我的瓷器（上传）"
            rightLabel={`历史参考 · ${reference.dynastyName}`}
          />
          <ParamsTable
            rows={paramRows(uploaded, reference)}
            leftLabel="我的瓷器"
            rightLabel={reference.dynastyName}
          />
          <div className="border-l-2 border-gold/40 pl-4">
            <span className="eyebrow">差异洞察</span>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-soft">{insight}</p>
            <p className="mt-1 text-xs text-ink-soft/60">以上数值为模拟数据，非真实测量。</p>
          </div>
        </div>
      </div>
    )
  }

  const left = pair ? getPorcelainById(pair.leftId) : null
  const right = pair ? getPorcelainById(pair.rightId) : null

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink">跨时期形态对比</h1>
      <p className="mt-2 text-sm text-ink-soft">将两个时期的瓷器并置观察，直观感受形态比例的差异。</p>

      {pair && left && right ? (
        <div className="mt-8 flex flex-col gap-8">
          <CompareViewer left={left} right={right} />
          <ParamsTable rows={pair.rows} leftLabel={left.dynastyName} rightLabel={right.dynastyName} />
          <div className="border-l-2 border-gold/40 pl-4">
            <span className="eyebrow">差异洞察</span>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-soft">{pair.insight}</p>
          </div>
        </div>
      ) : (
        <div className="mt-8 flex h-64 items-center justify-center text-sm text-ink-soft">加载中…</div>
      )}
    </div>
  )
}
