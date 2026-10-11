import { useRef, useState } from 'react'
import type { DragEvent, ChangeEvent } from 'react'

interface UploadPanelProps {
  onReconstruct: (file: File) => void
  loading?: boolean
}

export function UploadPanel({ onReconstruct, loading }: UploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  const acceptFile = (f: File | undefined) => {
    if (!f || !f.type.startsWith('image/')) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    acceptFile(e.dataTransfer.files?.[0])
  }

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    acceptFile(e.target.files?.[0])
    e.target.value = ''
  }

  return (
    <div className="panel flex flex-col gap-5 p-6">
      <div>
        <span className="eyebrow">上传瓷器图片</span>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          支持 JPG / PNG，建议使用正面清晰、背景简洁的照片。
        </p>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={
          'flex min-h-[240px] cursor-pointer flex-col items-center justify-center gap-3 border border-dashed p-4 text-center transition-colors ' +
          (dragging ? 'border-gold bg-gold/5' : 'border-ink/25 hover:border-gold/60')
        }
      >
        {preview ? (
          <img src={preview} alt="预览" className="max-h-56 max-w-full object-contain" />
        ) : (
          <>
            <span className="text-3xl text-gold">＋</span>
            <span className="text-sm text-ink-soft">拖入图片，或点击选择文件</span>
          </>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" hidden onChange={onPick} />

      <button
        type="button"
        className="btn-gold justify-center disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!file || loading}
        onClick={() => file && onReconstruct(file)}
      >
        {loading ? '正在复原…' : '开始三维复原'}
      </button>
    </div>
  )
}

export default UploadPanel
