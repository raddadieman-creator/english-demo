import { useRef, useState, Fragment } from 'react'
import { useData } from '../App.jsx'
import { READING } from '../data/skills.js'
import { addEvent, best, me } from '../lib/store.js'
import { Icon, SpeakBtn, Choices, Ltr, burstAt } from '../components/ui.jsx'
import { LabHead } from './Skills.jsx'

// يلوّن كلمات المسرد داخل النص، والضغط عليها يُظهر معناها
function Glossed({ text, gloss, onWord }) {
  const keys = Object.keys(gloss).sort((a, b) => b.length - a.length)
  const re = new RegExp('\\b(' + keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\b', 'gi')
  const parts = text.split(re)
  return parts.map((p, i) => {
    const k = keys.find((x) => x.toLowerCase() === p.toLowerCase())
    return k ? <button key={i} className="gw" onClick={(e) => onWord(k, e.currentTarget)}>{p}</button> : <Fragment key={i}>{p}</Fragment>
  })
}

function Reader({ r, onEnter }) {
  const [tip, setTip] = useState(null)
  const [ans, setAns] = useState({})
  const ref = useRef()
  const m = me()
  const b = m && best(m.key, 'read', r.id)
  const done = Object.keys(ans).length === r.qs.length
  const score = Object.values(ans).filter(Boolean).length
  return (
    <>
      <section className="skill-hero c-mint"><div className="wrap">
        <a className="back" href="#/skills/reading"><Icon n="back" size={18} />كل النصوص</a>
        <Ltr as="h1">{r.title}</Ltr><p className="sh-ar">{r.ar} · المستوى {r.level === 1 ? 'الأول' : 'الثاني'}</p>
      </div></section>
      <section className="sec"><div className="wrap reader">
        <article className="paper" onClick={(e) => { if (!e.target.classList.contains('gw')) setTip(null) }}>
          <div className="paper-top"><SpeakBtn text={r.text.join(' ')} label="استمعي للنص" /><span className="muted small">اضغطي أي كلمة ملوّنة لترين معناها</span></div>
          <div dir="ltr" lang="en" className="paper-body">
            {r.text.map((p, i) => <p key={i}><Glossed text={p} gloss={r.gloss} onWord={(k, el) => { const rc = el.getBoundingClientRect(), pr = el.closest('.paper').getBoundingClientRect(); setTip({ k, x: rc.left - pr.left + rc.width / 2, y: rc.bottom - pr.top + 8 }) }} /></p>)}
          </div>
          {tip && <div className="gtip" style={{ left: tip.x, top: tip.y }}><Ltr as="b">{tip.k}</Ltr><span>{r.gloss[tip.k]}</span><SpeakBtn text={tip.k} small /></div>}
        </article>
        <aside className="rq" ref={ref}>
          <h3 dir="ltr">Check your understanding</h3>
          {b && <span className="best-tag" dir="ltr">Best: {b.score}/{b.max}</span>}
          {r.qs.map((q, k) => <div key={k} className="try-q"><Ltr as="p">{k + 1}. {q.q}</Ltr><Choices opts={q.opts} answer={q.a} onDone={(c) => setAns((a) => { const n = { ...a, [k]: c }; if (Object.keys(n).length === r.qs.length) { if (m) addEvent('read', r.id, Object.values(n).filter(Boolean).length, r.qs.length); burstAt(ref.current) } return n })} /></div>)}
          {done && <p className="try-res">{score} / {r.qs.length} {score === r.qs.length ? 'Perfect! 🎉' : ''}</p>}
          {!m && <button className="btn ghost" onClick={onEnter}>ادخلي لتُحفظ نتيجتك</button>}
        </aside>
      </div></section>
    </>
  )
}

export default function Reading({ id, onEnter }) {
  useData()
  const r = READING.find((x) => x.id === id)
  if (r) return <Reader r={r} onEnter={onEnter} />
  const m = me()
  return (
    <>
      <LabHead en="Reading" ar="القراءة: نصوص قصيرة مرتبطة بالوحدتين، بمستويين" c="mint" />
      <section className="sec"><div className="wrap books">
        {READING.map((x) => {
          const b = m && best(m.key, 'read', x.id)
          return (
            <a key={x.id} className={`book c-${x.u === 'u4' ? 'grape' : 'coral'}`} href={`#/skills/reading/${x.id}`}>
              <span className="book-spine" />
              <span className="book-u" dir="ltr">Unit {x.u.slice(1)} · Level {x.level}</span>
              <Ltr as="h3">{x.title}</Ltr>
              <span className="book-ar">{x.ar}</span>
              <span className="book-meta">{x.qs.length} أسئلة · {Object.keys(x.gloss).length} كلمات بمعانيها</span>
              <span className="book-go">{b ? <span dir="ltr">✓ {b.score}/{b.max}</span> : 'اقرئي'}<Icon n="arrow" /></span>
            </a>
          )
        })}
      </div></section>
    </>
  )
}
