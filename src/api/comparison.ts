import { delay, request, USE_MOCK } from './client'
import { comparisonPair } from '../mock/data'
import type { ComparisonPair } from '../types/porcelain'

/** 获取跨时期形态对比数据。未来对接 `POST /api/compare`。 */
export async function fetchComparisonPair(): Promise<ComparisonPair> {
  if (USE_MOCK) {
    await delay(120)
    return comparisonPair
  }
  return request<ComparisonPair>('/compare', { method: 'POST' })
}
