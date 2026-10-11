import * as THREE from 'three'
import type { DecorationStyle } from '../../types/porcelain'

type Ctx = CanvasRenderingContext2D

/**
 * 程序化生成釉色/纹饰贴图。无外部资源依赖，保证离线可运行。
 * 贴图水平方向 (u) 环绕器物一周，垂直方向 (v) 对应器物高度。
 */
export function createGlazeTexture(decoration: DecorationStyle): THREE.CanvasTexture {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // 白色基底：材质 color 与贴图相乘，青釉由 color 提供、彩绘由贴图提供
  ctx.fillStyle = '#fbfaf6'
  ctx.fillRect(0, 0, size, size)

  switch (decoration) {
    case 'celadon':
      drawCeladon(ctx, size)
      break
    case 'bluewhite':
      drawBlueWhite(ctx, size)
      break
    case 'fencai':
      drawFencai(ctx, size)
      break
    case 'sancai':
      drawSancai(ctx, size)
      break
    default:
      break
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  tex.anisotropy = 8
  tex.needsUpdate = true
  return tex
}

/* ------------------------------------------------------------------ */
/* 青瓷：素面 + 冰裂纹开片（淡）                                        */
/* ------------------------------------------------------------------ */

function drawCeladon(ctx: Ctx, s: number): void {
  // 轻微釉面晕染
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * s
    const y = Math.random() * s
    const r = 40 + Math.random() * 160
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, 'rgba(120,140,130,0.05)')
    g.addColorStop(1, 'rgba(120,140,130,0)')
    ctx.fillStyle = g
    ctx.fillRect(x - r, y - r, r * 2, r * 2)
  }
  // 冰裂纹
  ctx.strokeStyle = 'rgba(40,60,55,0.10)'
  ctx.lineWidth = 1
  const pts: Array<[number, number]> = []
  for (let i = 0; i < 60; i++) {
    pts.push([Math.random() * s, Math.random() * s])
  }
  for (let i = 0; i < pts.length; i++) {
    ctx.beginPath()
    ctx.moveTo(pts[i][0], pts[i][1])
    for (let j = 0; j < 3; j++) {
      const p = pts[(i + j * 7) % pts.length]
      ctx.lineTo(p[0], p[1])
    }
    ctx.stroke()
  }
}

/* ------------------------------------------------------------------ */
/* 青花：白底 + 钴蓝纹饰带                                              */
/* ------------------------------------------------------------------ */

const COBALT = '#2b4c7e'
const COBALT_DEEP = '#1f3b66'
const COBALT_LIGHT = '#3a5b8c'

function drawBlueWhite(ctx: Ctx, s: number): void {
  // 上下双弦纹
  ctx.strokeStyle = COBALT
  ctx.lineWidth = s * 0.006
  strokeLine(ctx, s * 0.055)
  strokeLine(ctx, s * 0.945)

  // 肩部如意云头 / 蕉叶纹带
  drawBand(ctx, s, s * 0.14, s * 0.14, (x, y, cell) => {
    drawCloudCollar(ctx, x, y, cell)
  })

  // 主体缠枝花带（牡丹 / 莲纹圆团）
  drawBand(ctx, s, s * 0.5, s * 0.34, (x, y, cell) => {
    drawMedallion(ctx, x, y, cell * 0.34)
  })

  // 底部莲瓣纹带
  drawBand(ctx, s, s * 0.86, s * 0.1, (x, y, cell) => {
    drawLotusPetal(ctx, x, y, cell)
  })
}

function strokeLine(ctx: Ctx, y: number): void {
  ctx.beginPath()
  ctx.moveTo(0, y)
  ctx.lineTo(ctx.canvas.width, y)
  ctx.stroke()
}

function drawBand(ctx: Ctx, s: number, y: number, h: number, motif: (x: number, y: number, cell: number) => void): void {
  const count = 6
  const cell = s / count
  for (let i = 0; i < count; i++) {
    motif(i * cell + cell / 2, y, cell)
  }
}

function drawCloudCollar(ctx: Ctx, cx: number, cy: number, w: number): void {
  ctx.fillStyle = COBALT_LIGHT
  ctx.beginPath()
  ctx.moveTo(cx, cy - w * 0.5)
  ctx.quadraticCurveTo(cx - w * 0.45, cy, cx, cy + w * 0.45)
  ctx.quadraticCurveTo(cx + w * 0.45, cy, cx, cy - w * 0.5)
  ctx.fill()
}

function drawMedallion(ctx: Ctx, cx: number, cy: number, r: number): void {
  // 外圈
  ctx.strokeStyle = COBALT
  ctx.lineWidth = r * 0.08
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()
  // 花瓣
  ctx.fillStyle = COBALT
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2
    const px = cx + Math.cos(a) * r * 0.62
    const py = cy + Math.sin(a) * r * 0.62
    ctx.beginPath()
    ctx.ellipse(px, py, r * 0.26, r * 0.16, a, 0, Math.PI * 2)
    ctx.fill()
  }
  // 花心
  ctx.fillStyle = COBALT_DEEP
  ctx.beginPath()
  ctx.arc(cx, cy, r * 0.22, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = COBALT_LIGHT
  ctx.lineWidth = r * 0.05
  ctx.beginPath()
  ctx.arc(cx, cy, r * 0.3, 0, Math.PI * 2)
  ctx.stroke()
}

function drawLotusPetal(ctx: Ctx, cx: number, cy: number, w: number): void {
  ctx.fillStyle = COBALT_LIGHT
  ctx.beginPath()
  ctx.moveTo(cx, cy + w * 0.45)
  ctx.quadraticCurveTo(cx - w * 0.5, cy, cx, cy - w * 0.4)
  ctx.quadraticCurveTo(cx + w * 0.5, cy, cx, cy + w * 0.45)
  ctx.fill()
}

/* ------------------------------------------------------------------ */
/* 粉彩：白底 + 粉花绿叶                                                */
/* ------------------------------------------------------------------ */

function drawFencai(ctx: Ctx, s: number): void {
  ctx.strokeStyle = '#c88b9a'
  ctx.lineWidth = s * 0.005
  strokeLine(ctx, s * 0.06)
  strokeLine(ctx, s * 0.94)

  // 散布花枝
  const flowers: Array<[number, number, number]> = []
  for (let i = 0; i < 14; i++) {
    flowers.push([0.1 + Math.random() * 0.8, 0.15 + Math.random() * 0.7, 0.02 + Math.random() * 0.04])
  }
  for (const [fx, fy, fr] of flowers) {
    const x = fx * s
    const y = fy * s
    const r = fr * s
    drawRose(ctx, x, y, r)
  }
  // 叶片
  ctx.fillStyle = '#7fa06b'
  for (let i = 0; i < 26; i++) {
    const x = Math.random() * s
    const y = Math.random() * s
    const r = 0.012 * s
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(Math.random() * Math.PI)
    ctx.beginPath()
    ctx.ellipse(0, 0, r * 1.6, r * 0.7, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

function drawRose(ctx: Ctx, cx: number, cy: number, r: number): void {
  ctx.fillStyle = '#e8a0b0'
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2
    const px = cx + Math.cos(a) * r
    const py = cy + Math.sin(a) * r
    ctx.beginPath()
    ctx.ellipse(px, py, r * 0.6, r * 0.4, a, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.fillStyle = '#c76f86'
  ctx.beginPath()
  ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2)
  ctx.fill()
}

/* ------------------------------------------------------------------ */
/* 唐三彩：米白底 + 褐/绿流釉（备用）                                    */
/* ------------------------------------------------------------------ */

function drawSancai(ctx: Ctx, s: number): void {
  ctx.fillStyle = '#f0e6cf'
  ctx.fillRect(0, 0, s, s)
  const colors = ['rgba(160,110,60,0.55)', 'rgba(90,140,90,0.5)', 'rgba(200,170,110,0.5)']
  for (let i = 0; i < 26; i++) {
    const x = Math.random() * s
    const y = Math.random() * s
    const r = 30 + Math.random() * 90
    const g = ctx.createRadialGradient(x, y, 0, x, y + r, r)
    g.addColorStop(0, colors[i % colors.length])
    g.addColorStop(1, 'rgba(240,230,207,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.ellipse(x, y, r * 1.4, r * 0.7, 0, 0, Math.PI * 2)
    ctx.fill()
  }
}
