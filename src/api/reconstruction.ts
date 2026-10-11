import { delay, request, USE_MOCK } from './client'
import { mockReconstruct } from '../mock/data'
import type { ReconstructionResult } from '../types/porcelain'

/** 上传图片并触发三维复原。未来对接 `POST /api/reconstruction`。 */
export async function reconstructFromImage(image: File | string): Promise<ReconstructionResult> {
  if (USE_MOCK) {
    await delay(2400)
    return mockReconstruct(image)
  }

  const form = new FormData()
  if (image instanceof File) {
    form.append('image', image)
  } else {
    form.append('imageUrl', image)
  }
  return request<ReconstructionResult>('/reconstruction', {
    method: 'POST',
    body: form,
  })
}
