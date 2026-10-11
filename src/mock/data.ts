import type {
  AIAnswer,
  AIQueryAnswer,
  AIQuerySuggestion,
  ComparisonPair,
  DynastyId,
  DynastyInfo,
  Porcelain,
  ReconstructionResult,
} from '../types/porcelain'

/* ------------------------------------------------------------------ */
/* 朝代信息                                                            */
/* ------------------------------------------------------------------ */

export const dynasties: DynastyInfo[] = [
  {
    id: 'tang',
    name: '唐',
    years: '618 — 907',
    intro: '越窑青瓷成熟，瓷器从实用器逐步走向兼具审美功能的器物，为后世奠定技术基础。',
    porcelainId: 'tang-yueyao',
    evolutionNote: '青瓷一脉初成，器型浑圆饱满，尚带唐代的雍容气象。',
  },
  {
    id: 'song',
    name: '宋',
    years: '960 — 1279',
    intro: '中国瓷器审美的高峰，汝、官、哥、钧、定五大名窑并立，崇尚釉色与线条的极致。',
    porcelainId: 'song-ruyao',
    evolutionNote: '由"釉色取胜"，器型趋于修长秀美，颈部更细，轮廓更具书卷气。',
  },
  {
    id: 'yuan',
    name: '元',
    years: '1271 — 1368',
    intro: '青花瓷走向成熟，钴料绘制使瓷器装饰由釉色转向绘画，器型趋大而雄健。',
    porcelainId: 'yuan-qinghua',
    evolutionNote: '青花兴起，装饰性增强，器身更显厚重敦实。',
  },
  {
    id: 'ming',
    name: '明',
    years: '1368 — 1644',
    intro: '景德镇成为全国瓷业中心，永乐、宣德青花与釉里红交相辉映，工艺高度规范化。',
    porcelainId: 'ming-qinghua',
    evolutionNote: '梅瓶比例由秀挺转向敦实，最大腹径上移，轮廓更显雄浑。',
  },
  {
    id: 'qing',
    name: '清',
    years: '1644 — 1912',
    intro: '制瓷工艺集大成，粉彩、珐琅彩色彩绚烂，器型繁多，装饰繁缛而精巧。',
    porcelainId: 'qing-fencai',
    evolutionNote: '彩瓷大盛，器型向大而圆发展，长颈天球瓶为典型。',
  },
]

/* ------------------------------------------------------------------ */
/* 器物数据                                                            */
/* ------------------------------------------------------------------ */

const songParts: Porcelain['parts'] = [
  {
    id: 'mouth',
    name: '器口',
    yMin: 30.5,
    yMax: 32.5,
    formDescription:
      '撇口微外卷，唇沿圆润轻薄，转折处过渡柔和，是宋代玉壶春瓶口部的典型处理。',
    history:
      '宋代玉壶春瓶的口沿多作撇口，形制较唐代更为内敛，体现宋人含蓄的审美取向。',
    knowledge:
      '撇口便于斟注与持握，同时让器物轮廓在口部自然收束，与颈部共同构成完整的 S 形曲线。',
  },
  {
    id: 'neck',
    name: '器颈',
    yMin: 26.5,
    yMax: 30.5,
    formDescription:
      '颈部细长而挺拔，向下渐次展宽，与腹部衔接自然，整体比例修长优雅。',
    history:
      '汝窑器物以线条取胜，细长颈是宋代瓶类器物的标志性特征，强调竖向的轻盈感。',
    knowledge:
      '瓶颈的收束程度是区分唐、宋、明、清瓶类器型的重要指标——宋颈最细，明清渐趋粗壮。',
  },
  {
    id: 'decoration',
    name: '纹饰',
    yMin: 16,
    yMax: 23,
    formDescription:
      '通体施天青釉，素面不饰纹样，以釉色本身作为最主要的"纹饰"表达。',
    history:
      '汝窑崇尚"雨过天青云破处"的釉色美学，多用素面，偶有开片（冰裂纹）作为天然肌理。',
    knowledge:
      '开片本为釉面缺陷，却被宋人发展为一种美学，称作"金丝铁线""冰裂纹"。',
  },
  {
    id: 'body',
    name: '器身',
    yMin: 6,
    yMax: 24,
    formDescription:
      '腹部圆鼓，最大腹径偏下，向下渐收、向上渐展，整体呈饱满的梨形。',
    history:
      '玉壶春瓶的"垂腹"造型源自唐代，宋代将其比例调整得更为秀美、重心下移。',
    knowledge:
      '最大腹径的位置（偏上、居中或偏下）是判断瓷器年代的重要形制依据。',
  },
  {
    id: 'foot',
    name: '器足',
    yMin: 0,
    yMax: 3,
    formDescription: '圈足规整，足墙直立，露胎处呈香灰色，支烧痕清晰可辨。',
    history: '汝窑多采用"芝麻钉"支烧工艺，底足留有细小支钉痕，是重要鉴定特征。',
    knowledge: '"支钉烧"使器物得以满釉而底部仅留几处极小的支钉痕迹，工艺极为讲究。',
  },
]

/**
 * 生成一套通用的模拟部位讲解，用于个性化模式下的上传器物。
 * 所有描述均为基于器型常识的模拟内容，并非对上传对象的真实识别。
 */
export function makeGenericParts(height: number): Porcelain['parts'] {
  const h = height
  return [
    {
      id: 'mouth',
      name: '器口',
      yMin: h * 0.9,
      yMax: h,
      formDescription:
        '器物口沿区域。以下为基于器型常识的模拟讲解，并非对上传对象的精确识别。',
      history: '不同历史时期的器口处理方式各异，观察口沿形状与厚度是断代的线索之一。',
      knowledge: '口沿常作撇口、直口或敛口，直接影响器物整体轮廓的起点与比例感。',
    },
    {
      id: 'neck',
      name: '器颈',
      yMin: h * 0.72,
      yMax: h * 0.9,
      formDescription: '连接器口与器身的过渡区域。以下为模拟讲解，供学习参考。',
      history: '颈部的长短粗细随时代审美变化，宋器颈部多修长，明清则或粗短或细长。',
      knowledge: '瓶颈的收束程度是判断器型年代的重要形制指标之一。',
    },
    {
      id: 'decoration',
      name: '纹饰',
      yMin: h * 0.45,
      yMax: h * 0.62,
      formDescription: '器物主体装饰区域。当前纹饰为程序化模拟示意，非真实纹样识别。',
      history: '纹饰反映时代审美与工艺：青花、粉彩等不同装饰技法代表不同历史时期。',
      knowledge: '通过纹饰题材与布局，可辅助判断瓷器的年代与窑口。',
    },
    {
      id: 'body',
      name: '器身',
      yMin: h * 0.18,
      yMax: h * 0.6,
      formDescription: '器身主体区域。以下为模拟讲解，最大腹径位置体现时代审美。',
      history: '器身比例随时代演变，最大腹径偏上或偏下是判断年代的重要依据。',
      knowledge: '器身的饱满程度与轮廓曲线，是区分唐宋明清器型的直观线索。',
    },
    {
      id: 'foot',
      name: '器足',
      yMin: 0,
      yMax: h * 0.1,
      formDescription: '器物底足区域。以下为模拟讲解，圈足等特征需结合实物判断。',
      history: '底足形式（圈足、玉璧底、卧足等）是重要的工艺与断代特征。',
      knowledge: '底足露胎处的胎质与支烧痕迹，是鉴定瓷器的重要依据。',
    },
  ]
}

export const porcelains: Porcelain[] = [
  {
    id: 'tang-yueyao',
    name: '越窑青瓷四系罐',
    dynasty: 'tang',
    dynastyName: '唐代',
    period: '唐 · 越窑（约 8—9 世纪）',
    summary: '唐代越窑青瓷的典型代表，器型浑圆饱满，釉色青中泛黄。',
    description:
      '越窑青瓷是中国最早的成熟青瓷体系，唐代达到高峰，胎质细腻、釉层均匀，被誉为"类冰似玉"。',
    shape: [
      [3.4, 0],
      [3.8, 1.0],
      [4.2, 2.0],
      [6.0, 5],
      [8.0, 8],
      [8.8, 10],
      [8.4, 13],
      [7.0, 15.5],
      [5.6, 17],
      [5.4, 18],
      [6.6, 20],
    ],
    glaze: { color: '#8a9b7a', roughness: 0.42, metalness: 0.05, clearcoat: 0.3, decoration: 'celadon' },
    params: { height: 20, maxBellyDiameter: 17.6, mouthDiameter: 13.2, footDiameter: 7.6 },
    formFeatures: ['短颈、丰肩、鼓腹', '重心偏下，器身浑圆', '四系便于穿绳提携'],
    decorationFeatures: ['通体青釉，素面无纹', '釉面温润，类冰似玉'],
    craftFeatures: ['龙窑烧制', '胎质细腻坚致', '釉层均匀、满釉裹足'],
    history:
      '唐代越窑青瓷成熟，与邢窑白瓷形成"南青北白"格局，青瓷从此成为南方瓷业的重要传统。',
    parts: makeGenericParts(20),
  },
  {
    id: 'song-ruyao',
    name: '汝窑天青釉玉壶春瓶',
    dynasty: 'song',
    dynastyName: '宋代',
    period: '北宋 · 汝窑（约 11—12 世纪）',
    summary: '五大名窑之首，天青釉色温润如玉，器型修长秀美。',
    description:
      '汝窑为北宋宫廷烧造，存世稀少，天青釉色如雨过天青，被后世推为宋代瓷器的审美极致。',
    shape: [
      [3.2, 0],
      [3.6, 1.2],
      [4.0, 2.5],
      [4.8, 5],
      [6.6, 9],
      [8.4, 13],
      [9.1, 17],
      [8.3, 21],
      [6.0, 24],
      [4.2, 26],
      [2.8, 28],
      [2.3, 30],
      [2.9, 31],
      [4.1, 32.5],
    ],
    glaze: { color: '#86a6a6', roughness: 0.38, metalness: 0.05, clearcoat: 0.5, decoration: 'celadon' },
    params: { height: 32.5, maxBellyDiameter: 18.2, mouthDiameter: 8.2, footDiameter: 7.2 },
    formFeatures: ['撇口、细长颈、垂腹', '最大腹径偏下，重心下沉', '轮廓呈流畅 S 形曲线'],
    decorationFeatures: ['通体天青釉', '素面为主，偶有冰裂纹开片'],
    craftFeatures: ['芝麻钉支烧', '满釉裹足', '玛瑙入釉，釉质温润'],
    history:
      '汝窑为五大名窑之首，烧造时间短暂，传世不足百件，天青釉色成为后世青瓷难以逾越的审美标杆。',
    parts: songParts,
  },
  {
    id: 'yuan-qinghua',
    name: '青花缠枝牡丹纹梅瓶',
    dynasty: 'yuan',
    dynastyName: '元代',
    period: '元 · 景德镇（约 13—14 世纪）',
    summary: '元代青花成熟期的代表作，器身雄健，青花纹饰浓艳。',
    description:
      '元青花以进口钴料绘制，发色浓艳，题材丰富，器型硕大雄健，开启了中国瓷器彩绘装饰的新纪元。',
    shape: [
      [3.4, 0],
      [3.8, 1.0],
      [4.4, 2.0],
      [5.6, 4],
      [8.0, 8],
      [9.8, 12],
      [10.4, 15],
      [9.6, 19],
      [7.6, 23],
      [4.8, 26],
      [3.0, 27.2],
      [3.6, 28],
    ],
    glaze: { color: '#f6f3ea', roughness: 0.32, metalness: 0.03, clearcoat: 0.55, decoration: 'bluewhite' },
    params: { height: 28, maxBellyDiameter: 20.8, mouthDiameter: 7.2, footDiameter: 7.6 },
    formFeatures: ['小口、短颈、丰肩、瘦底', '最大腹径偏高，器身雄健'],
    decorationFeatures: ['缠枝牡丹纹为主', '青花发色浓艳，层次丰富'],
    craftFeatures: ['进口钴料绘制', '瓷胎厚重致密', '釉下彩高温一次烧成'],
    history:
      '元代景德镇青花成熟，中国瓷器装饰由"以色取胜"转向"以画取胜"，为明清彩瓷奠定基础。',
    parts: makeGenericParts(28),
  },
  {
    id: 'ming-qinghua',
    name: '永乐青花缠枝莲纹梅瓶',
    dynasty: 'ming',
    dynastyName: '明代',
    period: '明 · 永乐（1403—1424）',
    summary: '永乐青花色泽深沉，梅瓶比例敦实，是明初官窑的典范。',
    description:
      '永乐青花采用"苏麻离青"钴料，发色浓艳而带晕散，纹饰疏朗典雅，梅瓶器型较元代更显敦实稳重。',
    shape: [
      [3.8, 0],
      [4.2, 1.2],
      [4.6, 2.5],
      [5.8, 5],
      [8.0, 10],
      [9.8, 15],
      [10.7, 18],
      [10.2, 22],
      [8.2, 26],
      [5.4, 30],
      [3.4, 32],
      [3.6, 33],
      [4.55, 35.1],
    ],
    glaze: { color: '#f5f2e9', roughness: 0.3, metalness: 0.03, clearcoat: 0.6, decoration: 'bluewhite' },
    params: { height: 35.1, maxBellyDiameter: 21.4, mouthDiameter: 9.1, footDiameter: 9.2 },
    formFeatures: ['小口外撇、短颈、丰肩', '最大腹径上移，器身敦实'],
    decorationFeatures: ['缠枝莲纹', '苏麻离青，发色带晕散'],
    craftFeatures: ['景德镇官窑烧造', '釉面肥润如脂', '釉下青花工艺规范'],
    history:
      '永乐年间景德镇设立御窑厂，青花成为明初官窑主流，造型与纹饰均高度规范化。',
    parts: makeGenericParts(35.1),
  },
  {
    id: 'qing-fencai',
    name: '乾隆粉彩缠枝莲纹天球瓶',
    dynasty: 'qing',
    dynastyName: '清代',
    period: '清 · 乾隆（1736—1795）',
    summary: '粉彩色彩柔丽，天球瓶器型硕大圆润，是清代彩瓷工艺的集大成者。',
    description:
      '粉彩在雍正、乾隆年间达到鼎盛，色彩柔和雅致、层次细腻，天球瓶长颈圆腹，器型雄浑华贵。',
    shape: [
      [4.2, 0],
      [4.6, 1.2],
      [5.0, 2.5],
      [6.5, 5],
      [9.0, 9],
      [11.0, 13],
      [12.0, 16],
      [12.2, 19],
      [11.6, 22],
      [9.6, 26],
      [7.0, 29],
      [4.0, 31],
      [3.6, 33],
      [3.6, 35],
      [4.2, 36.5],
    ],
    glaze: { color: '#f7f4ed', roughness: 0.28, metalness: 0.03, clearcoat: 0.6, decoration: 'fencai' },
    params: { height: 36.5, maxBellyDiameter: 24.4, mouthDiameter: 8.4, footDiameter: 10 },
    formFeatures: ['直口、长颈、圆腹', '腹部浑圆如球，器型硕大'],
    decorationFeatures: ['粉彩缠枝莲纹', '色彩柔和，层次细腻'],
    craftFeatures: ['景德镇御窑烧造', '粉彩低温二次入窑', '装饰繁缛、工致精巧'],
    history:
      '乾隆朝制瓷工艺达到古代高峰，粉彩、珐琅彩绚烂多彩，器型繁多，尽显盛世气象。',
    parts: makeGenericParts(36.5),
  },
]

/* ------------------------------------------------------------------ */
/* 查询辅助                                                            */
/* ------------------------------------------------------------------ */

export function getPorcelainById(id: string): Porcelain {
  const found = porcelains.find((p) => p.id === id)
  if (!found) throw new Error(`Porcelain not found: ${id}`)
  return found
}

export function getDynastyPorcelain(dynasty: DynastyId): Porcelain {
  const info = dynasties.find((d) => d.id === dynasty)
  return getPorcelainById(info ? info.porcelainId : 'song-ruyao')
}

/* ------------------------------------------------------------------ */
/* 形态对比数据                                                        */
/* ------------------------------------------------------------------ */

export const comparisonPair: ComparisonPair = {
  id: 'song-vs-ming',
  leftId: 'song-ruyao',
  rightId: 'ming-qinghua',
  rows: [
    { label: '高度 (cm)', left: '32.5', right: '35.1' },
    { label: '最大腹径 (cm)', left: '18.2', right: '21.4' },
    { label: '口径 (cm)', left: '8.2', right: '9.1' },
    { label: '高 / 腹径', left: '1.78', right: '1.64' },
  ],
  insight:
    '从宋代到明代，梅瓶比例由修长趋于敦实——高度增加而最大腹径上移，整体轮廓由"秀挺"转向"雄浑"，反映了两代审美取向与装烧工艺的变迁。',
}

/* ------------------------------------------------------------------ */
/* AI 讲解数据                                                         */
/* ------------------------------------------------------------------ */

export function getPartAnswer(porcelainId: string, partId: string): AIAnswer {
  const porcelain = getPorcelainById(porcelainId)
  const part = porcelain.parts.find((p) => p.id === partId)
  if (!part) {
    return {
      partId,
      partName: partId,
      formDescription: '该区域暂无详细讲解。',
      history: '请选择器口、器颈、器身、器足或纹饰查看讲解。',
      knowledge: '点击器物对应部位可获取形制、历史与相关知识。',
    }
  }
  return {
    partId: part.id,
    partName: part.name,
    formDescription: part.formDescription,
    history: part.history,
    knowledge: part.knowledge,
  }
}

export const aiQuerySuggestions: AIQuerySuggestion[] = [
  { id: 'q1', question: '为什么宋代的瓶颈更细？' },
  { id: 'q2', question: '这种纹饰有什么特点？' },
  { id: 'q3', question: '汝窑为什么以天青色著称？' },
  { id: 'q4', question: '宋瓷和明清瓷器有什么区别？' },
]

export function getAIQueryAnswer(question: string): AIQueryAnswer {
  const bank: Record<string, string> = {
    q1: '宋人审美崇尚含蓄内敛，细长的瓶颈能强化器物竖向的轻盈感与书卷气；同时宋代单件装烧工艺成熟，也让更修长、重心更高的器型得以稳定烧成。相较之下，明清器型渐趋敦实，瓶颈相应变粗。',
    q2: '这件汝窑器物以素面天青釉取胜，纹饰并非绘制的图案，而是釉面自然形成的冰裂纹开片——它本是釉层与胎体收缩率不同产生的"缺陷"，却被宋人发展为一种独特的美学语言。',
    q3: '汝窑以玛瑙入釉，在还原气氛下烧成，呈现出"雨过天青云破处"般的天青色。这种介于蓝与绿之间的釉色温润如玉，被视为宋代瓷器审美的最高境界。',
    q4: '宋瓷追求釉色与线条的极致，以单色釉、素面为主，器型修长含蓄；明清瓷器则转向彩绘装饰，青花、粉彩等色彩丰富，器型更趋敦实硕大。简言之：宋瓷"以釉为美"，明清瓷"以画为美"。',
  }
  return { question, answer: bank[question] ?? '这个问题我还在学习中，换一个问我试试吧。' }
}

/* ------------------------------------------------------------------ */
/* 三维复原 Mock 结果                                                  */
/* ------------------------------------------------------------------ */

export function mockReconstruct(_image?: File | string): ReconstructionResult {
  // 模拟"上传图片 → AI 复原"，返回一件示例器物的程序化 3D 轮廓
  return {
    id: 'recon-demo',
    status: 'done',
    porcelain: getPorcelainById('yuan-qinghua'),
    note: '当前为 AI 数字复原示意结果，后续将由真实重建算法返回 GLB 模型地址。',
  }
}
