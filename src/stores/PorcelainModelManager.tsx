import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { CurrentPorcelain } from '../types/porcelain'

/**
 * PorcelainModelManager —— 瓷器模型统一管理模块。
 *
 * 通过 React Context 共享"当前瓷器"信息（上传对象 / 演示对象），
 * 四个业务页面读取同一份状态；页面切换不会丢失，清除后各页同步恢复默认。
 * 只保存 URL、标识与元数据，不把大型模型文件存入全局状态。
 */

interface PorcelainModelManagerValue {
  current: CurrentPorcelain | null
  setCurrent: (c: CurrentPorcelain) => void
  clearCurrent: () => void
}

const PorcelainModelContext = createContext<PorcelainModelManagerValue | null>(null)

export function PorcelainModelManagerProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<CurrentPorcelain | null>(null)

  const value = useMemo<PorcelainModelManagerValue>(
    () => ({
      current,
      setCurrent: (c) => setCurrent(c),
      clearCurrent: () => setCurrent(null),
    }),
    [current],
  )

  return <PorcelainModelContext.Provider value={value}>{children}</PorcelainModelContext.Provider>
}

export function usePorcelainModel(): PorcelainModelManagerValue {
  const ctx = useContext(PorcelainModelContext)
  if (!ctx) {
    throw new Error('usePorcelainModel 必须在 PorcelainModelManagerProvider 内使用')
  }
  return ctx
}

export default PorcelainModelManagerProvider
