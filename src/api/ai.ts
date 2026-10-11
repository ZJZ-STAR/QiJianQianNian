import { delay, request, USE_MOCK } from './client'
import { aiQuerySuggestions, getAIQueryAnswer, getPartAnswer } from '../mock/data'
import type { AIAnswer, AIQueryAnswer, AIQuerySuggestion } from '../types/porcelain'

/** 获取器物某部位的 AI 讲解。未来对接 `POST /api/ask`。 */
export async function fetchPartExplanation(porcelainId: string, partId: string): Promise<AIAnswer> {
  if (USE_MOCK) {
    await delay(400)
    return getPartAnswer(porcelainId, partId)
  }
  return request<AIAnswer>('/ask', {
    method: 'POST',
    body: JSON.stringify({ porcelainId, partId }),
  })
}

/** 获取推荐问题列表。 */
export async function fetchSuggestions(): Promise<AIQuerySuggestion[]> {
  if (USE_MOCK) {
    await delay(80)
    return aiQuerySuggestions
  }
  return request<AIQuerySuggestion[]>('/ask/suggestions')
}

/** 自由提问。未来对接 `POST /api/ask`。 */
export async function askQuestion(question: string): Promise<AIQueryAnswer> {
  if (USE_MOCK) {
    await delay(700)
    return getAIQueryAnswer(question)
  }
  return request<AIQueryAnswer>('/ask', {
    method: 'POST',
    body: JSON.stringify({ question }),
  })
}
