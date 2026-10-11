import { getPorcelainById } from './data'
import type { PersonalizedMatch, Porcelain, RecognitionResult } from '../types/porcelain'

/**
 * 个性化演化 / 讲解 / 对比所需的模拟数据：
 * - 模拟器型识别结果
 * - 按朝代的同类历史案例匹配
 * - 个性化形态对比的参考案例
 */

/** 模拟识别：依据上传图片推断器型特征。仅为示例推断，非真实 AI 识别。 */
export function recognizeUploaded(p: Porcelain): RecognitionResult {
  return {
    category: '梅瓶',
    type: p.name,
    features: p.formFeatures,
    note: '模拟识别：以下器型特征为依据上传图片的示例推断，仅供学习参考，未经真实 AI 精确识别。',
  }
}

/** 以"梅瓶"器型为例，模拟不同朝代的同类 / 相近案例匹配结果。 */
export function getPersonalizedMatches(_category: string): PersonalizedMatch[] {
  return [
    {
      dynasty: 'tang',
      porcelainId: null,
      difference: '',
      emptyReason: '梅瓶器型出现于宋代，唐代暂无可靠的同类参考案例。',
    },
    {
      dynasty: 'song',
      porcelainId: 'song-ruyao',
      difference: '宋代相近瓶式（汝窑玉壶春瓶）颈部更细、腹径更小，比例更修长，整体气质秀挺内敛。',
    },
    {
      dynasty: 'yuan',
      porcelainId: 'yuan-qinghua',
      difference: '与上传器物同属元代青花梅瓶，器型最为接近，可作为同期参照。',
    },
    {
      dynasty: 'ming',
      porcelainId: 'ming-qinghua',
      difference: '明代梅瓶高度增加、最大腹径上移、口径略大，轮廓由秀挺转向敦实。',
    },
    {
      dynasty: 'qing',
      porcelainId: 'qing-fencai',
      difference: '清代天球瓶腹部更浑圆、颈部更细长，装饰转向粉彩，器型雄浑华贵。',
    },
  ]
}

/** 个性化形态对比：以明代青花梅瓶作为参考案例。 */
export function getPersonalizedComparison(p: Porcelain): { reference: Porcelain; insight: string } {
  return {
    reference: getPorcelainById('ming-qinghua'),
    insight: `将「${p.name}」（我的瓷器）与明代青花梅瓶并置，可观察同一器型在不同时期的比例与装饰差异。以下参数为模拟数据，非真实测量。`,
  }
}
