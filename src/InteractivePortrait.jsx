import { useEffect, useRef, useState } from 'react'

export default function InteractivePortrait({ src, alt }) {
  const cardRef = useRef(null)
  const frameRef = useRef(0)
  const resetTimerRef = useRef(0)
  const [selected, setSelected] = useState(false)

  useEffect(() => () => {
    cancelAnimationFrame(frameRef.current)
    window.clearTimeout(resetTimerRef.current)
  }, [])

  function updatePointer(event) {
    const card = cardRef.current
    if (!card) return
    const bounds = card.getBoundingClientRect()
    const x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width))
    const y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height))

    cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      card.style.setProperty('--pointer-x', `${x * 100}%`)
      card.style.setProperty('--pointer-y', `${y * 100}%`)
      card.style.setProperty('--rotate-x', `${(0.5 - y) * 8}deg`)
      card.style.setProperty('--rotate-y', `${(x - 0.5) * 8}deg`)
      card.style.setProperty('--shift-x', `${(x - 0.5) * 10}px`)
      card.style.setProperty('--shift-y', `${(y - 0.5) * 10}px`)
    })
  }

  function resetPointer() {
    const card = cardRef.current
    if (!card) return
    card.style.setProperty('--pointer-x', '50%')
    card.style.setProperty('--pointer-y', '48%')
    card.style.setProperty('--rotate-x', '0deg')
    card.style.setProperty('--rotate-y', '0deg')
    card.style.setProperty('--shift-x', '0px')
    card.style.setProperty('--shift-y', '0px')
  }

  function selectPlayer() {
    setSelected(true)
    window.clearTimeout(resetTimerRef.current)
    resetTimerRef.current = window.setTimeout(() => setSelected(false), 1400)
  }

  function handleKeyDown(event) {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    selectPlayer()
  }

  return (
    <div
      ref={cardRef}
      className={`interactive-portrait${selected ? ' is-selected' : ''}`}
      role="button"
      tabIndex="0"
      aria-label={`${alt}，移动指针查看视差，点击选择角色`}
      onPointerMove={updatePointer}
      onPointerLeave={resetPointer}
      onPointerCancel={resetPointer}
      onClick={selectPlayer}
      onKeyDown={handleKeyDown}
    >
      <div className="portrait-stage">
        <img src={src} alt={alt} draggable="false" />
        <div className="portrait-light" aria-hidden="true" />
        <span className="portrait-corner corner-tl" aria-hidden="true" />
        <span className="portrait-corner corner-tr" aria-hidden="true" />
        <span className="portrait-corner corner-bl" aria-hidden="true" />
        <span className="portrait-corner corner-br" aria-hidden="true" />
        <span className="portrait-reticle" aria-hidden="true"><i /><i /></span>
        <span className="portrait-status" aria-hidden="true"><b />{selected ? 'PLAYER READY' : 'MOVE / CLICK'}</span>
        <span className="portrait-pixel pixel-a" aria-hidden="true" />
        <span className="portrait-pixel pixel-b" aria-hidden="true" />
        <span className="portrait-pixel pixel-c" aria-hidden="true" />
      </div>
    </div>
  )
}
