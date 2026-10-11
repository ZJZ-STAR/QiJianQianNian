import { delay, request, USE_MOCK } from './client'
import { dynasties, getDynastyPorcelain, getPorcelainById } from '../mock/data'
import type { DynastyId, DynastyInfo, Porcelain } from '../types/porcelain'

/** 获取时间轴朝代列表。未来对接 `GET /api/timeline`。 */
export async function fetchTimeline(): Promise<DynastyInfo[]> {
  if (USE_MOCK) {
    await delay(120)
    return dynasties
  }
  return request<DynastyInfo[]>('/timeline')
}

/** 获取单件瓷器详情。未来对接 `GET /api/porcelain/:id`。 */
export async function fetchPorcelain(id: string): Promise<Porcelain> {
  if (USE_MOCK) {
    await delay(120)
    return getPorcelainById(id)
  }
  return request<Porcelain>(`/porcelain/${id}`)
}

/** 获取某朝代的代表性瓷器。未来对接 `GET /api/timeline/:dynasty`。 */
export async function fetchDynastyPorcelain(dynasty: DynastyId): Promise<Porcelain> {
  if (USE_MOCK) {
    await delay(120)
    return getDynastyPorcelain(dynasty)
  }
  return request<Porcelain>(`/timeline/${dynasty}`)
}
