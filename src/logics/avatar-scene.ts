interface Point {
  x: number
  y: number
}

interface PatchRect extends Point {
  width: number
  height: number
}

interface SceneCallbacks {
  onReady: () => void
  onError: () => void
}

function surface(width: number, height = width, willReadFrequently = false) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d', { willReadFrequently })
  if (!context)
    throw new Error('Canvas 2D is unavailable')
  return { canvas, context }
}

function smooth(value: number) {
  const t = Math.max(0, Math.min(1, value))
  return t * t * (3 - 2 * t)
}

function patch(frame: HTMLCanvasElement, rect: PatchRect, feather: number) {
  const { canvas, context } = surface(rect.width, rect.height)
  context.drawImage(frame, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height)
  context.globalCompositeOperation = 'destination-in'
  for (const [length, x, y] of [[rect.width, rect.width, 0], [rect.height, 0, rect.height]]) {
    const gradient = context.createLinearGradient(0, 0, x, y)
    gradient.addColorStop(0, 'transparent')
    gradient.addColorStop(feather / length, 'white')
    gradient.addColorStop(1 - feather / length, 'white')
    gradient.addColorStop(1, 'transparent')
    context.fillStyle = gradient
    context.fillRect(0, 0, rect.width, rect.height)
  }
  return canvas
}

function displacement({ x, y }: Point, breath: number): Point {
  const head = Math.exp(-(((x - 246) / 121) ** 4) - ((y - 159) / 150) ** 4)
  const torso = Math.exp(-(((x - 307) / 114) ** 4) - ((y - 361) / 104) ** 4)
  return {
    x: x + head * breath * 0.2,
    y: y + head * breath * 0.75 + torso * breath * 0.35,
  }
}

function triangle(
  context: CanvasRenderingContext2D,
  source: HTMLCanvasElement,
  a: Point,
  b: Point,
  c: Point,
  da: Point,
  db: Point,
  dc: Point,
) {
  const determinant = a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)
  const xx = (da.x * (b.y - c.y) + db.x * (c.y - a.y) + dc.x * (a.y - b.y)) / determinant
  const xy = (da.y * (b.y - c.y) + db.y * (c.y - a.y) + dc.y * (a.y - b.y)) / determinant
  const yx = (da.x * (c.x - b.x) + db.x * (a.x - c.x) + dc.x * (b.x - a.x)) / determinant
  const yy = (da.y * (c.x - b.x) + db.y * (a.x - c.x) + dc.y * (b.x - a.x)) / determinant
  context.save()
  context.beginPath()
  context.moveTo(da.x, da.y)
  context.lineTo(db.x, db.y)
  context.lineTo(dc.x, dc.y)
  context.closePath()
  context.clip()
  context.transform(xx, xy, yx, yy, da.x - xx * a.x - yx * a.y, da.y - xy * a.x - yy * a.y)
  context.drawImage(source, 0, 0)
  context.restore()
}

export function createAvatarScene(output: HTMLCanvasElement, callbacks: SceneCallbacks) {
  const context = output.getContext('2d')
  if (!context)
    throw new Error('Canvas 2D is unavailable')
  const outputContext = context

  const source = surface(512)
  const breathing = surface(512)
  const columns = 110
  const rows = Math.round(columns / 1.42)
  const sample = surface(columns, rows, true)
  const chars = ' .,:;-=+xX08S#&@'
  const atlas = surface(chars.length * 32, 48)
  const avatar = new Image()
  const sprites = new Image()
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
  const handRect = { x: 104, y: 389, width: 151, height: 107 }
  const eyeRect = { x: 163, y: 246, width: 117, height: 34 }
  const handSequence = [0, 1, 0, 2, 1, 0, 1, 2]
  let handPatches: HTMLCanvasElement[] = []
  let blinkPatch: HTMLCanvasElement | undefined
  let ready = false
  let disposed = false
  let playing = !reducedMotion.matches
  let onscreen = false
  let time = 0
  let width = 0
  let request = 0
  let previousTick = 0

  function drawSource() {
    source.context.drawImage(avatar, 0, 0, 512, 512)
    const phase = time % 8.8
    const position = time * 6.1
    const index = Math.floor(position)
    const pose = (phase > 2.9 && phase < 3.8) || phase > 7.7
      ? 1
      : handSequence[(index + (smooth(position - index) < 0.5 ? 0 : 1)) % handSequence.length]
    source.context.drawImage(handPatches[pose], handRect.x, handRect.y)
    const blinkPhase = time % 13.6
    const blink = smooth(Math.max(...[2.5, 6.9, 11.2].map(center => 1 - Math.abs(blinkPhase - center) / 0.17)))
    if (blink > 0 && blinkPatch) {
      source.context.globalAlpha = blink
      source.context.drawImage(blinkPatch, eyeRect.x, eyeRect.y)
      source.context.globalAlpha = 1
    }

    // Warp only the character's head and torso; the laptop stays anchored.
    breathing.context.clearRect(0, 0, 512, 512)
    breathing.context.drawImage(source.canvas, 0, 0)
    const breath = Math.sin(time * Math.PI * 2 / 5.8) * 1.15
    const step = 512 / 12
    for (let row = 0; row < 12; row++) {
      for (let column = 0; column < 12; column++) {
        const a = { x: column * step, y: row * step }
        const b = { x: (column + 1) * step, y: row * step }
        const c = { x: column * step, y: (row + 1) * step }
        const d = { x: (column + 1) * step, y: (row + 1) * step }
        const da = displacement(a, breath)
        const db = displacement(b, breath)
        const dc = displacement(c, breath)
        const dd = displacement(d, breath)
        triangle(breathing.context, source.canvas, a, b, c, da, db, dc)
        triangle(breathing.context, source.canvas, d, c, b, dd, dc, db)
      }
    }
  }

  function render() {
    if (!ready || !width || disposed)
      return
    drawSource()
    outputContext.clearRect(0, 0, width, width)
    sample.context.drawImage(breathing.canvas, 0, 0, columns, rows)
    const pixels = sample.context.getImageData(0, 0, columns, rows).data
    const stepX = width / columns
    const stepY = width / rows
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const index = (row * columns + column) * 4
        const luminance = (0.299 * pixels[index] + 0.587 * pixels[index + 1] + 0.114 * pixels[index + 2]) / 255
        const tone = Math.max(0, Math.min(1, (luminance - 0.16) / 0.74 * 1.1))
        if (tone < 0.035)
          continue
        const glyph = Math.max(1, Math.round(tone ** 0.85 * (chars.length - 1)))
        outputContext.globalAlpha = Math.min(0.98, 0.12 + tone * 0.9)
        outputContext.drawImage(atlas.canvas, glyph * 32, 0, 32, 48, column * stepX - stepX * 0.2, row * stepY - stepY * 0.05, stepX * 1.4, stepY * 1.1)
      }
    }
    outputContext.globalAlpha = 1
  }

  function rebuild() {
    if (disposed)
      return
    width = output.getBoundingClientRect().width
    if (!width)
      return
    const ratio = Math.min(window.devicePixelRatio || 1, 1.6)
    output.width = output.height = Math.round(width * ratio)
    outputContext.setTransform(ratio, 0, 0, ratio, 0, 0)
    atlas.context.clearRect(0, 0, atlas.canvas.width, atlas.canvas.height)
    atlas.context.fillStyle = getComputedStyle(output).color
    atlas.context.font = '30px "DM Mono", monospace'
    atlas.context.textAlign = 'center'
    atlas.context.textBaseline = 'middle'
    ;[...chars].forEach((char, index) => atlas.context.fillText(char, index * 32 + 16, 24))
    render()
  }

  function schedule() {
    if (!request && ready && playing && onscreen && !document.hidden && !disposed)
      request = requestAnimationFrame(tick)
  }

  function stop() {
    cancelAnimationFrame(request)
    request = 0
    previousTick = 0
  }

  function tick(now: number) {
    request = 0
    if (!ready || !playing || !onscreen || document.hidden || disposed)
      return
    if (!previousTick || now - previousTick >= 1000 / 24) {
      time += previousTick ? Math.min(0.1, (now - previousTick) / 1000) : 0
      previousTick = now
      render()
    }
    schedule()
  }

  function visibilityChanged() {
    stop()
    schedule()
  }

  function motionChanged() {
    playing = !reducedMotion.matches
    visibilityChanged()
  }

  const resizeObserver = new ResizeObserver(rebuild)
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    onscreen = entry.isIntersecting
    visibilityChanged()
  })
  const themeObserver = new MutationObserver(rebuild)
  resizeObserver.observe(output)
  intersectionObserver.observe(output)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  document.addEventListener('visibilitychange', visibilityChanged)
  reducedMotion.addEventListener('change', motionChanged)

  function destroy() {
    disposed = true
    stop()
    resizeObserver.disconnect()
    intersectionObserver.disconnect()
    themeObserver.disconnect()
    document.removeEventListener('visibilitychange', visibilityChanged)
    reducedMotion.removeEventListener('change', motionChanged)
  }

  avatar.src = '/avatar.png'
  sprites.src = '/avatar-typing-sprites.webp'
  Promise.all([avatar.decode(), sprites.decode()]).then(() => {
    if (disposed)
      return
    const frames = Array.from({ length: 4 }, (_, index) => {
      const frame = surface(512)
      frame.context.drawImage(sprites, (index % 2) * sprites.naturalWidth / 2, Math.floor(index / 2) * sprites.naturalHeight / 2, sprites.naturalWidth / 2, sprites.naturalHeight / 2, 0, 0, 512, 512)
      return frame.canvas
    })
    handPatches = frames.slice(0, 3).map(frame => patch(frame, handRect, 11))
    blinkPatch = patch(frames[3], eyeRect, 4)
    ready = true
    rebuild()
    callbacks.onReady()
    schedule()
  }).catch(() => {
    if (disposed)
      return
    destroy()
    callbacks.onError()
  })
  document.fonts.ready.then(rebuild)

  return {
    destroy,
  }
}
