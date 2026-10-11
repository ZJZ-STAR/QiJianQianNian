import { getPorcelainById } from '../mock/data'
import type { ModelInfo, ReconstructTask, TaskStatus } from '../types/porcelain'

/**
 * PorcelainReconstructionService —— 三维重建服务接口。
 *
 * 默认调用真实后端（Python + TripoSR，地址见 VITE_RECONSTRUCT_BASE）。
 * 设置 VITE_USE_MOCK=true 时回退到前端 Mock（用于无后端演示）。
 */

const BASE: string = import.meta.env.VITE_RECONSTRUCT_BASE ?? 'http://localhost:8000'
const USE_MOCK: boolean = import.meta.env.VITE_USE_MOCK === 'true'

const MOCK_DURATION = 2400
const mockTasks = new Map<string, { status: TaskStatus; model?: ModelInfo }>()
let mockSeq = 0
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function httpJson<T>(url: string, options?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(url, options)
  } catch {
    throw new Error('无法连接三维重建服务，请确认后端已启动（http://localhost:8000）')
  }
  if (!res.ok) {
    let detail = ''
    try {
      const body = await res.json()
      detail = body?.detail ?? ''
    } catch {
      /* ignore */
    }
    throw new Error(detail || `HTTP ${res.status}`)
  }
  return (await res.json()) as T
}

interface BackendModelResponse {
  modelUrl: string
  heatmapUrl: string
  report: ModelInfo['report']
  shape: ModelInfo['shape']
  note: string
}

export const PorcelainReconstructionService = {
  async reconstruct(image: File | string): Promise<ReconstructTask> {
    if (USE_MOCK) {
      const taskId = `task-${Date.now()}-${++mockSeq}`
      mockTasks.set(taskId, { status: 'processing' })
      setTimeout(() => {
        const s = mockTasks.get(taskId)
        if (s) {
          s.status = 'success'
          s.model = {
            porcelain: getPorcelainById('yuan-qinghua'),
            modelUrl: null,
            note: 'Mock 示意结果（未运行真实重建）。',
          }
        }
      }, MOCK_DURATION)
      return { taskId, status: 'processing' }
    }

    const form = new FormData()
    form.append('file', image instanceof File ? image : new Blob([image], { type: 'image/png' }))
    return httpJson<ReconstructTask>(`${BASE}/api/reconstruct`, { method: 'POST', body: form })
  },

  async getTaskStatus(taskId: string): Promise<TaskStatus> {
    if (USE_MOCK) {
      await delay(60)
      return mockTasks.get(taskId)?.status ?? 'error'
    }
    const res = await httpJson<{ status: TaskStatus }>(`${BASE}/api/task/${taskId}`)
    return res.status
  },

  async getModel(taskId: string): Promise<ModelInfo> {
    if (USE_MOCK) {
      await delay(60)
      const s = mockTasks.get(taskId)
      if (!s?.model) throw new Error('模型尚未生成或生成失败')
      return s.model
    }
    const data = await httpJson<BackendModelResponse>(`${BASE}/api/model/${taskId}`)
    return {
      porcelain: getPorcelainById('yuan-qinghua'),
      modelUrl: data.modelUrl,
      heatmapUrl: data.heatmapUrl,
      shape: data.shape,
      report: data.report,
      note: data.note,
    }
  },
}

export default PorcelainReconstructionService
