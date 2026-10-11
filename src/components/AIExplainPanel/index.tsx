import { useEffect, useState } from 'react'
import { askQuestion, fetchPartExplanation, fetchSuggestions } from '../../api/ai'
import type { AIAnswer, AIQuerySuggestion, Porcelain } from '../../types/porcelain'

interface AIExplainPanelProps {
  porcelain: Porcelain
  selectedPartId: string
  onSelectPart: (id: string) => void
  /** 个性化模式：上传对象讲解（内容为模拟数据） */
  personalized?: boolean
}

interface QAItem {
  q: string
  a: string
}

function FeatureBlock({ title, items }: { title: string; items: string[] }) {
  if (!items || items.length === 0) return null
  return (
    <section>
      <h4 className="mb-1.5 font-medium text-gold">{title}</h4>
      <ul className="flex flex-col gap-1.5">
        {items.map((it) => (
          <li key={it} className="flex gap-2 text-sm leading-relaxed text-ink-soft">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold/60" />
            {it}
          </li>
        ))}
      </ul>
    </section>
  )
}

export function AIExplainPanel({ porcelain, selectedPartId, onSelectPart, personalized }: AIExplainPanelProps) {
  const [tab, setTab] = useState<'overview' | 'parts'>('parts')
  const [answer, setAnswer] = useState<AIAnswer | null>(null)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<AIQuerySuggestion[]>([])
  const [qa, setQa] = useState<QAItem[]>([])
  const [asking, setAsking] = useState(false)

  // 外部（点击 3D 模型）选中部位时，自动切到"部位讲解"视图
  useEffect(() => {
    setTab('parts')
  }, [selectedPartId])

  useEffect(() => {
    let alive = true
    setLoading(true)
    fetchPartExplanation(porcelain.id, selectedPartId).then((a) => {
      if (!alive) return
      setAnswer(a)
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [porcelain.id, selectedPartId])

  useEffect(() => {
    fetchSuggestions().then(setSuggestions)
  }, [])

  const handleAsk = async (s: AIQuerySuggestion) => {
    setAsking(true)
    const r = await askQuestion(s.question)
    setQa((prev) => [...prev, { q: s.question, a: r.answer }])
    setAsking(false)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* 视图切换 */}
      <div className="flex gap-6 border-b border-ink/10">
        {(['overview', 'parts'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={
              'relative pb-2 text-sm tracking-wide transition-colors ' +
              (tab === t ? 'text-gold' : 'text-ink-soft hover:text-ink')
            }
          >
            {t === 'overview' ? '整体介绍' : '部位讲解'}
            <span
              className={
                'absolute -bottom-px left-1/2 h-px -translate-x-1/2 bg-gold transition-all ' +
                (tab === t ? 'w-full' : 'w-0')
              }
            />
          </button>
        ))}
      </div>

      {tab === 'overview' ? (
        <div className="panel flex flex-col gap-4 p-5">
          <div>
            <span className="eyebrow">瓷器整体介绍</span>
            <h3 className="mt-1 font-display text-lg text-ink">{porcelain.name}</h3>
            {personalized && (
              <p className="mt-1 text-xs text-gold/80">以下为模拟介绍，非真实 AI 识别结果。</p>
            )}
          </div>
          <p className="text-sm leading-relaxed text-ink-soft">{porcelain.description}</p>
          <div className="grid grid-cols-1 gap-4">
            <FeatureBlock title="器型特点" items={porcelain.formFeatures} />
            <FeatureBlock title="纹饰特点" items={porcelain.decorationFeatures} />
            <FeatureBlock title="工艺知识" items={porcelain.craftFeatures} />
            <FeatureBlock title="历史背景" items={[porcelain.history]} />
          </div>
        </div>
      ) : (
        <div className="panel flex flex-col gap-4 p-5">
          {porcelain.parts.length > 0 && (
            <div>
              <span className="eyebrow">点击部位</span>
              <div className="mt-3 flex flex-wrap gap-2">
                {porcelain.parts.map((p) => {
                  const active = p.id === selectedPartId
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => onSelectPart(p.id)}
                      className={
                        'border px-4 py-1.5 text-sm tracking-wide transition-colors ' +
                        (active
                          ? 'border-gold bg-gold text-paper'
                          : 'border-ink/20 text-ink-soft hover:border-gold/60 hover:text-ink')
                      }
                    >
                      {p.name}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div>
            <span className="eyebrow">AI 瓷器导览</span>
            <h3 className="mt-1 font-display text-lg text-ink">
              当前部位：{answer?.partName ?? '—'}
            </h3>
            {personalized && (
              <p className="mt-1 text-xs text-gold/80">模拟讲解：非真实 AI 识别结果。</p>
            )}
          </div>

          {loading ? (
            <p className="text-sm text-ink-soft">正在讲解…</p>
          ) : (
            <div className="flex flex-col gap-4 text-sm leading-relaxed">
              <section>
                <h4 className="mb-1 font-medium text-gold">形制特点</h4>
                <p className="text-ink-soft">{answer?.formDescription}</p>
              </section>
              <section>
                <h4 className="mb-1 font-medium text-gold">历史背景</h4>
                <p className="text-ink-soft">{answer?.history}</p>
              </section>
              <section>
                <h4 className="mb-1 font-medium text-gold">相关知识</h4>
                <p className="text-ink-soft">{answer?.knowledge}</p>
              </section>
            </div>
          )}
        </div>
      )}

      {/* 你还可以问 */}
      <div>
        <span className="eyebrow">你还可以问</span>
        <div className="mt-3 flex flex-col gap-2">
          {suggestions.map((s) => (
            <button
              key={s.id}
              type="button"
              disabled={asking}
              onClick={() => handleAsk(s)}
              className="border-b border-dashed border-ink/15 pb-2 text-left text-sm text-blue transition-colors hover:text-gold disabled:opacity-50"
            >
              {s.question}
            </button>
          ))}
        </div>

        {qa.map((item, i) => (
          <div key={i} className="mt-4 border-l-2 border-gold/40 pl-3">
            <p className="text-sm font-medium text-ink">{item.q}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AIExplainPanel
