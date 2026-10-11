/**
 * 统一请求层。
 *
 * 后端尚未实现时，通过 `VITE_USE_MOCK` 环境变量切换：
 *   - 未设置（默认）：走 Mock 数据
 *   - 设置 `VITE_USE_MOCK=false`：走真实后端接口
 *
 * 各模块的 api 文件均通过 `USE_MOCK` 判断分支，页面层无需关心数据来源。
 */

const API_BASE: string = import.meta.env.VITE_API_BASE ?? '/api'

export const USE_MOCK: boolean = import.meta.env.VITE_USE_MOCK !== 'false'

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status}`)
  }
  return (await res.json()) as T
}
