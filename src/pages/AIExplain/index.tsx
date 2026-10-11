import { useState } from 'react'
import { PorcelainViewer } from '../../components/PorcelainViewer'
import { AIExplainPanel } from '../../components/AIExplainPanel'
import { EvolutionModeSwitch } from '../../components/EvolutionModeSwitch'
import { getPorcelainById } from '../../mock/data'
import { usePorcelainModel } from '../../stores/PorcelainModelManager'

const defaultPorcelain = getPorcelainById('song-ruyao')

export default function AIExplain() {
  const { current, clearCurrent } = usePorcelainModel()
  const [selectedPartId, setSelectedPartId] = useState('neck')

  const personalized = !!current && !!current.porcelain
  const porcelain = personalized ? current.porcelain! : defaultPorcelain

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink">AI 瓷器讲解</h1>
      <p className="mt-2 text-sm text-ink-soft">
        点击器物任意部位，AI 为你讲解该部位的形制、历史与相关知识。
      </p>

      {personalized && (
        <div className="mt-6 flex flex-col gap-4">
          <EvolutionModeSwitch label="我的瓷器 · AI 讲解" backLabel="返回示例讲解" onBack={clearCurrent} />
          {current.imageUrl && (
            <div className="panel flex items-center gap-4 p-4">
              <img
                src={current.imageUrl}
                alt="上传瓷器"
                className="h-20 w-20 shrink-0 rounded-sm border border-ink/10 object-cover"
              />
              <div>
                <span className="eyebrow">上传对象</span>
                <p className="font-display text-ink">{current.name}</p>
                <p className="mt-0.5 text-xs text-ink-soft/70">若有对应三维模型将优先展示。</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        <div className="panel h-[520px] overflow-hidden bg-ivory/40">
          <PorcelainViewer
            shape={porcelain.shape}
            glaze={porcelain.glaze}
            parts={porcelain.parts}
            selectedPartId={selectedPartId}
            onPartSelect={setSelectedPartId}
            className="h-full w-full"
          />
        </div>

        <AIExplainPanel
          porcelain={porcelain}
          selectedPartId={selectedPartId}
          onSelectPart={setSelectedPartId}
          personalized={personalized}
        />
      </div>
    </div>
  )
}
