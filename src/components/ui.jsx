import { useEffect, useState } from 'react'
import { speak, stopSpeak } from '../lib/speech.js'

const P = {
  speaker: <><path d="M4 9v6h4l5 4V5L8 9H4z" /><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" /></>,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>,
  play: <path d="M7 5v14l12-7z" />,
  stop: <rect x="6" y="6" width="12" height="12" rx="2" />,
  check: <path d="M20 6 9 17l-5-5" />,
  x: <path d="M18 6 6 18M6 6l12 12" />,
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  back: <path d="M19 12H5M11 6l-6 6 6 6" />,
  home: <><path d="M3 11 12 4l9 7" /><path d="M5 10v10h14V10" /></>,
  book: <><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 19V5" /></>,
  pen: <><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="m13.5 6.5 4 4" /></>,
  headphones: <><path d="M3 15v-3a9 9 0 0 1 18 0v3" /><rect x="3" y="14" width="5" height="7" rx="2" /><rect x="16" y="14" width="5" height="7" rx="2" /></>,
  trophy: <><path d="M8 4h8v5a4 4 0 0 1-8 0z" /><path d="M8 6H4a4 4 0 0 0 4 4M16 6h4a4 4 0 0 1-4 4M12 13v4M8 21h8M9 17h6" /></>,
  logout: <><path d="M15 4h4v16h-4" /><path d="M10 8l-4 4 4 4M6 12h10" /></>,
  refresh: <><path d="M20 11a8 8 0 1 0-2.3 5.7" /><path d="M20 4v7h-7" /></>,
  turtle: <><path d="M4 15c0-4 3.6-7 8-7s8 3 8 7z" /><path d="M20 13h2M6 15l-1 3M18 15l1 3M9 9l1 6M15 9l-1 6M4 15h16" /></>,
  lock: <><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
  link: <><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>,
  grid: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6" /></>,
  chart: <><path d="M4 20h16" /><rect x="5" y="11" width="3" height="6" rx="1" /><rect x="10.5" y="7" width="3" height="10" rx="1" /><rect x="16" y="4" width="3" height="13" rx="1" /></>,
  download: <><path d="M12 4v12M7 11l5 5 5-5" /><path d="M5 20h14" /></>,
  trash: <><path d="M4 7h16M10 11v6M14 11v6" /><path d="M6 7l1 13h10l1-13M9 7V4h6v3" /></>,
  bulb: <><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" /></>,
}
export function Icon({ n, size = 20, sw = 2, style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={n === 'play' || n === 'star' || n === 'stop' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">{P[n]}</svg>
}

export function SpeakBtn({ text, slow = false, label, small, className = '' }) {
  const [on, setOn] = useState(false)
  useEffect(() => () => stopSpeak(), [])
  const go = async (e) => { e.stopPropagation(); setOn(true); await speak(text, slow); setOn(false) }
  return (
    <button type="button" className={`spk ${small ? 'sm' : ''} ${on ? 'on' : ''} ${className}`} onClick={go} aria-label={label || ('Listen: ' + text)} title={slow ? 'ببطء' : 'استمعي'}>
      <Icon n={slow ? 'turtle' : 'speaker'} size={small ? 16 : 20} />{label && <span>{label}</span>}
    </button>
  )
}

// أزرار اختيار مع تصحيح فوري
export function Choices({ opts, answer, onDone, ltr = true, shuffle = false, disabled }) {
  const [pick, setPick] = useState(null)
  const [list] = useState(() => (shuffle ? [...opts].sort(() => Math.random() - 0.5) : opts))
  const choose = (o) => { if (pick !== null || disabled) return; setPick(o); onDone && onDone(o === answer, o) }
  return (
    <div className={`choices ${opts.some((o) => o.length > 16) ? 'long' : ''}`} dir={ltr ? 'ltr' : 'rtl'}>
      {list.map((o) => {
        const st = pick === null ? '' : o === answer ? 'right' : o === pick ? 'wrong' : 'dim'
        return <button key={o} type="button" className={`choice ${st}`} onClick={() => choose(o)} disabled={pick !== null && st === 'dim'}>{o}{st === 'right' && <Icon n="check" size={18} sw={3} />}{st === 'wrong' && <Icon n="x" size={18} sw={3} />}</button>
      })}
    </div>
  )
}

export function burst(x, y) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const colors = ['#FFD23F', '#FF6F59', '#22C3A6', '#7B61FF', '#3FB8F0', '#FF8AC9']
  for (let i = 0; i < 22; i++) {
    const s = document.createElement('i'); s.className = 'confetti'
    const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 110
    s.style.cssText = `left:${x}px;top:${y}px;background:${colors[i % colors.length]};--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 40}px;--r:${Math.random() * 540}deg`
    document.body.appendChild(s); setTimeout(() => s.remove(), 900)
  }
}
export const burstAt = (el) => { if (!el) return; const r = el.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2) }

export function Score({ score, max, onRetry, children }) {
  const p = Math.round((score / max) * 100)
  const msg = p >= 90 ? ['Excellent!', 'ممتاز، أداء رائع'] : p >= 70 ? ['Great job!', 'أحسنتِ'] : p >= 50 ? ['Good try!', 'محاولة جيدة، أعيديها لترتفع نجومك'] : ['Keep going!', 'لا بأس، راجعي ثم أعيدي المحاولة']
  return (
    <div className="score-card">
      <div className="score-ring" style={{ '--p': p }}><b dir="ltr">{score}/{max}</b></div>
      <div><h3 dir="ltr">{msg[0]}</h3><p>{msg[1]}</p><p className="muted">+{Math.round((score / max) * 10)} ⭐</p>{children}
        {onRetry && <button className="btn ghost" onClick={onRetry}><Icon n="refresh" />أعيدي المحاولة</button>}</div>
    </div>
  )
}

export const Ltr = ({ children, as: T = 'span', ...p }) => <T dir="ltr" lang="en" {...p}>{children}</T>

// نص عربي فيه مقاطع إنجليزية: نعزل الإنجليزي حتى لا تنقلب الأقواس والرموز
export function Mixed({ text }) {
  const parts = text.split(/([(‑-]*[A-Za-z][A-Za-z0-9 ,/'’+.()‑-]*[A-Za-z0-9.)])/g)
  return parts.map((p, i) => (i % 2 ? <bdi key={i} dir="ltr">{p}</bdi> : p))
}
