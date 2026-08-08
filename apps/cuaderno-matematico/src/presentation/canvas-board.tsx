import { useEffect, useRef } from 'react'
import type { InkPoint, InkStroke } from '../domain/equation'

type CanvasBoardProps = {
  canvasId?: string
  strokes: InkStroke[]
  tool?: 'pencil' | 'highlighter' | 'eraser'
  brushSize?: number
  readOnly?: boolean
  onCommit?: (strokes: InkStroke[]) => void
}

type DrawingSession = {
  pointerId: number
  mode: 'draw' | 'erase'
  stroke: InkStroke | null
  workingStrokes: InkStroke[] | null
}

function distanceToSegment(point: InkPoint, start: InkPoint, end: InkPoint): number {
  const deltaX = end.x - start.x
  const deltaY = end.y - start.y
  const lengthSquared = deltaX * deltaX + deltaY * deltaY
  if (lengthSquared === 0) return Math.hypot(point.x - start.x, point.y - start.y)
  const projection = Math.max(0, Math.min(1, ((point.x - start.x) * deltaX + (point.y - start.y) * deltaY) / lengthSquared))
  const closestX = start.x + projection * deltaX
  const closestY = start.y + projection * deltaY
  return Math.hypot(point.x - closestX, point.y - closestY)
}

function strokeHitsPoint(stroke: InkStroke, point: InkPoint, radius: number): boolean {
  if (stroke.points.length === 1) return Math.hypot(stroke.points[0].x - point.x, stroke.points[0].y - point.y) <= radius
  return stroke.points.some((currentPoint, index) => {
    if (index === 0) return Math.hypot(currentPoint.x - point.x, currentPoint.y - point.y) <= radius
    return distanceToSegment(point, stroke.points[index - 1], currentPoint) <= radius
  })
}

function renderCanvas(canvas: HTMLCanvasElement, strokes: InkStroke[], activeStroke: InkStroke | null, dpr: number): void {
  const context = canvas.getContext('2d')
  if (!context) return
  context.setTransform(1, 0, 0, 1, 0, 0)
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.setTransform(dpr, 0, 0, dpr, 0, 0)
  context.lineCap = 'round'
  context.lineJoin = 'round'

  for (const stroke of [...strokes, ...(activeStroke ? [activeStroke] : [])]) {
    const firstPoint = stroke.points[0]
    if (!firstPoint) continue
    context.globalAlpha = stroke.kind === 'highlighter' ? 0.34 : 0.94
    context.strokeStyle = stroke.color
    context.fillStyle = stroke.color
    context.lineWidth = stroke.size
    if (stroke.points.length === 1) {
      context.beginPath()
      context.arc(firstPoint.x, firstPoint.y, stroke.size / 2, 0, Math.PI * 2)
      context.fill()
      continue
    }
    context.beginPath()
    context.moveTo(firstPoint.x, firstPoint.y)
    for (const point of stroke.points.slice(1)) context.lineTo(point.x, point.y)
    context.stroke()
  }
  context.globalAlpha = 1
}

function getPoint(event: React.PointerEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement): InkPoint {
  const bounds = canvas.getBoundingClientRect()
  return { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
}

export function CanvasBoard({ canvasId, strokes, tool = 'pencil', brushSize = 3, readOnly = false, onCommit }: CanvasBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const strokesRef = useRef(strokes)
  const drawingRef = useRef<DrawingSession | null>(null)
  const dprRef = useRef(1)

  useEffect(() => {
    strokesRef.current = strokes
    const canvas = canvasRef.current
    if (!canvas || drawingRef.current) return
    renderCanvas(canvas, strokes, null, dprRef.current)
  }, [strokes])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      dprRef.current = dpr
      canvas.width = Math.max(1, Math.round(bounds.width * dpr))
      canvas.height = Math.max(1, Math.round(bounds.height * dpr))
      renderCanvas(canvas, strokesRef.current, drawingRef.current?.stroke ?? null, dpr)
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

  const finishDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const drawing = drawingRef.current
    if (!drawing || drawing.pointerId !== event.pointerId) return
    drawingRef.current = null
    if (typeof event.currentTarget.hasPointerCapture === 'function' && event.currentTarget.hasPointerCapture(event.pointerId) && typeof event.currentTarget.releasePointerCapture === 'function') event.currentTarget.releasePointerCapture(event.pointerId)
    if (drawing.mode === 'draw' && drawing.stroke && drawing.stroke.points.length > 0) {
      onCommit?.([...strokesRef.current, drawing.stroke])
    } else if (drawing.mode === 'erase' && drawing.workingStrokes) {
      onCommit?.(drawing.workingStrokes)
    }
    renderCanvas(event.currentTarget, strokesRef.current, null, dprRef.current)
  }

  return (
    <canvas
      id={canvasId}
      ref={canvasRef}
      className={`ink-canvas ${readOnly ? 'ink-canvas-readonly' : ''}`}
      aria-label={readOnly ? 'Vista de la escritura manuscrita' : 'Superficie para escribir una ecuación con el puntero'}
      role="img"
      tabIndex={readOnly ? -1 : 0}
      onPointerDown={(event) => {
        if (readOnly) return
        const point = getPoint(event, event.currentTarget)
        if (typeof event.currentTarget.setPointerCapture === 'function') event.currentTarget.setPointerCapture(event.pointerId)
        if (tool === 'eraser') {
          const workingStrokes = strokesRef.current.filter((stroke) => !strokeHitsPoint(stroke, point, Math.max(14, brushSize * 2.5)))
          drawingRef.current = { pointerId: event.pointerId, mode: 'erase', stroke: null, workingStrokes }
          renderCanvas(event.currentTarget, workingStrokes, null, dprRef.current)
          return
        }
        const stroke: InkStroke = {
          id: `trazo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          kind: tool,
          color: tool === 'highlighter' ? '#F4C95D' : '#17213B',
          size: tool === 'highlighter' ? Math.max(12, brushSize * 3) : brushSize,
          points: [point],
        }
        drawingRef.current = { pointerId: event.pointerId, mode: 'draw', stroke, workingStrokes: null }
        renderCanvas(event.currentTarget, strokesRef.current, stroke, dprRef.current)
      }}
      onPointerMove={(event) => {
        const drawing = drawingRef.current
        if (readOnly || !drawing || drawing.pointerId !== event.pointerId) return
        const point = getPoint(event, event.currentTarget)
        if (drawing.mode === 'erase' && drawing.workingStrokes) {
          drawing.workingStrokes = drawing.workingStrokes.filter((stroke) => !strokeHitsPoint(stroke, point, Math.max(14, brushSize * 2.5)))
          renderCanvas(event.currentTarget, drawing.workingStrokes, null, dprRef.current)
          return
        }
        if (!drawing.stroke) return
        const previous = drawing.stroke.points.at(-1)
        if (previous && Math.hypot(previous.x - point.x, previous.y - point.y) < 1.2) return
        drawing.stroke.points.push(point)
        renderCanvas(event.currentTarget, strokesRef.current, drawing.stroke, dprRef.current)
      }}
      onPointerUp={finishDrawing}
      onPointerCancel={finishDrawing}
      onContextMenu={(event) => event.preventDefault()}
    />
  )
}
