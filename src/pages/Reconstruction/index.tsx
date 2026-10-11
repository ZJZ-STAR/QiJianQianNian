import { useState } from 'react'
import { PorcelainViewer } from '../../components/PorcelainViewer'
import { UploadPanel } from '../../components/UploadPanel'
import { PorcelainReconstructionService } from '../../services/PorcelainReconstructionService'
import { usePorcelainModel } from '../../stores/PorcelainModelManager'
import { recognizeUploaded } from '../../mock/personalizedEvolutionData'
import type { ModelInfo, TaskStatus } from '../../types/porcelain'

const steps = ['图像处理', '文物分割', '三维结构推理', '模型生成', '纹理生成', '模型加载']
const flow = ['上传一张瓷器图片', 'AI 三维复原', '查看 3D 模型']

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function Reconstruction() {
  const { setCurrent } = usePorcelainModel()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ModelInfo | null>(null)
  const [stepIndex, setStepIndex] = useState(0)
  const [viewMode, setViewMode] = useState<'texture' | 'heatmap'>('texture')

  const handleReconstruct = async (file: File) => {
    setLoading(true)
    setError(null)
    setResult(null)
    setStepIndex(0)
    try {
      const imageUrl = await readFileAsDataUrl(file)
      const task = await PorcelainReconstructionService.reconstruct(file)

      let status: TaskStatus = 'processing'
      for (let i = 0; i < 120; i++) {
        status = await PorcelainReconstructionService.getTaskStatus(task.taskId)
        setStepIndex(Math.min(i, steps.length - 1))
        if (status === 'success' || status === 'error') break
        await new Promise((r) => setTimeout(r, 1000))
      }

      if (status !== 'success') {
        setError('重建任务失败，请重试。')
        return
      }

      const model = await PorcelainReconstructionService.getModel(task.taskId)
      setResult(model)

      const recognition = recognizeUploaded(model.porcelain)
      setCurrent({
        id: model.porcelain.id,
        name: '我的瓷器（重建）',
        imageUrl,
        modelUrl: model.modelUrl,
        heatmapUrl: model.heatmapUrl ?? null,
        source: 'uploaded',
        status: 'success',
        dynasty: model.porcelain.dynasty,
        category: recognition.category,
        porcelain: model.porcelain,
        recognition,
        report: model.report ?? null,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : '重建失败，请确认后端服务已启动。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink">瓷器三维复原</h1>
      <p className="mt-2 text-sm text-ink-soft">
        上传一张瓷器照片，通过 TripoSR 生成可交互的三维模型（CPU 推理，单张约 1–3 分钟）。
      </p>

      <div className="mt-8 flex items-center gap-3">
        {flow.map((f, i) => (
          <div key={f} className="flex items-center gap-3">
            <span className="text-sm text-ink-soft">{f}</span>
            {i < flow.length - 1 && <span className="text-gold">↓</span>}
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[360px_1fr]">
        <UploadPanel onReconstruct={handleReconstruct} loading={loading} />

        <div className="panel relative h-[480px] overflow-hidden">
          {result && result.modelUrl ? (
            <>
              <PorcelainViewer
                modelUrl={result.modelUrl ?? undefined}
                heatmapUrl={result.heatmapUrl ?? undefined}
                showHeatmap={viewMode === 'heatmap'}
                shape={result.shape ?? result.porcelain.shape}
                glaze={result.porcelain.glaze}
                autoRotate
                showControls
                className="h-full w-full"
              />
              {result.heatmapUrl && (
                <div className="absolute right-4 top-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setViewMode('texture')}
                    className={
                      'btn-ghost !px-3 !py-1.5 !text-xs ' + (viewMode === 'texture' ? '!border-gold !text-gold' : '')
                    }
                  >
                    原始纹理
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('heatmap')}
                    className={
                      'btn-ghost !px-3 !py-1.5 !text-xs ' + (viewMode === 'heatmap' ? '!border-gold !text-gold' : '')
                    }
                  >
                    不确定性热力图
                  </button>
                </div>
              )}
            </>
          ) : result && result.porcelain ? (
            <PorcelainViewer
              shape={result.porcelain.shape}
              glaze={result.porcelain.glaze}
              autoRotate
              showControls
              className="h-full w-full"
            />
          ) : loading ? (
            <div className="flex h-full flex-col items-center justify-center gap-6 p-8 text-center">
              <span className="h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
              <p className="font-display text-lg text-ink">正在生成三维模型……</p>
              <div className="flex flex-wrap justify-center gap-2">
                {steps.map((s, i) => (
                  <span
                    key={s}
                    className={
                      'border px-3 py-1 text-xs transition-colors ' +
                      (i < stepIndex
                        ? 'border-gold/40 text-gold'
                        : i === stepIndex
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-ink/15 text-ink-soft/60')
                    }
                  >
                    {i < stepIndex ? '✓ ' : ''}
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
              <span className="text-3xl text-gold/40">⚠</span>
              <p className="text-sm text-ink-soft">{error}</p>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <span className="text-3xl text-gold/40">◌</span>
              <p className="text-sm text-ink-soft">上传图片后，三维模型将在此展示</p>
            </div>
          )}
        </div>
      </div>

      {result?.report && (
        <div className="mt-6 panel p-5">
          <span className="eyebrow">重建质量报告</span>
          <div className="mt-3 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <p className="text-ink-soft">顶点 / 面数</p>
              <p className="font-display text-ink">
                {result.report.vertices.toLocaleString()} / {result.report.faces.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-ink-soft">水密</p>
              <p className="font-display text-ink">{result.report.watertight ? '是' : '否'}</p>
            </div>
            <div>
              <p className="text-ink-soft">尺寸 (x·y·z)</p>
              <p className="font-display text-ink">{result.report.bbox.join(' · ')}</p>
            </div>
            <div>
              <p className="text-ink-soft">耗时</p>
              <p className="font-display text-ink">{(result.report.elapsedMs / 1000).toFixed(1)} s</p>
            </div>
            <div className="col-span-2 sm:col-span-4">
              <p className="text-ink-soft">
                可观测区域 {Math.round(result.report.observedRatio * 100)}% · 推断区域{' '}
                {Math.round(result.report.inferredRatio * 100)}%
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink-soft/70">{result.report.note}</p>
            </div>
          </div>
        </div>
      )}

      <p className="mt-6 text-xs text-ink-soft/70">
        说明：单张图片无法还原器物背面与内部结构，结果属于探索性数字复原；不确定性为基于可观测性的启发式估计，
        非真实概率置信度。正式展示建议采用多视角摄影测量或博物馆权威三维模型。
      </p>
    </div>
  )
}
