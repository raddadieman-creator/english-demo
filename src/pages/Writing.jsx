import { useMemo, useRef, useState } from 'react'
import { useData } from '../App.jsx'
import { WRITING } from '../data/skills.js'
import { addEvent, me, submitWriting, load } from '../lib/store.js'
import { Icon, Ltr, burstAt, Score, Mixed } from '../components/ui.jsx'
import { LabHead, SubTabs } from './Skills.jsx'

function Builder({ onEnter }) {
  const items = WRITING.builder
  const [i, setI] = useState(0)
  const [ok, setOk] = useState(0)
  const [picked, setPicked] = useState([])
  const [res, setRes] = useState(null)
  const [done, setDone] = useState(false)
  const ref = useRef()
  const it = items[i]
  const pool = useMemo(() => it.words.map((w, k) => ({ w, k })).sort(() => Math.random() - 0.5), [i])
  if (!me()) return <div className="game-card"><p>سجّل دخولك لتُحفظ نتيجتك.</p><button className="btn primary" onClick={onEnter}>ادخل</button></div>
  if (done) return <Score score={ok} max={items.length} onRetry={() => { setI(0); setOk(0); setPicked([]); setRes(null); setDone(false) }} />
  const sentence = (ws) => ws.join(' ').replace(/ \?/g, '?')
  const check = () => {
    const c = picked.map((p) => p.w).join(' ') === it.words.join(' ')
    setRes(c); if (c) { setOk(ok + 1); burstAt(ref.current) }
  }
  const next = () => { if (i + 1 < items.length) { setI(i + 1); setPicked([]); setRes(null) } else { setDone(true); addEvent('build', 'all', ok, items.length) } }
  return (
    <div className="game-card" ref={ref}>
      <div className="g-top"><b dir="ltr">Sentence Builder</b><span dir="ltr">{i + 1} / {items.length}</span></div>
      <p className="g-q">رتّب الكلمات لتكوّن الجملة: <b>{it.ar}</b></p>
      <div className={`slot ${res === true ? 'ok' : res === false ? 'no' : ''}`} dir="ltr">
        {picked.length ? picked.map((p) => <button key={p.k} className="tile on" disabled={res !== null} onClick={() => setPicked(picked.filter((x) => x.k !== p.k))}>{p.w}</button>) : <span className="slot-ph">Tap the words…</span>}
      </div>
      <div className="tiles" dir="ltr">{pool.map((p) => <button key={p.k} className="tile" disabled={picked.some((x) => x.k === p.k) || res !== null} onClick={() => setPicked([...picked, p])}>{p.w}</button>)}</div>
      {res === false && <p className="fix" dir="ltr">Correct: <b>{sentence(it.words)}</b></p>}
      {res === null ? <button className="btn primary" disabled={picked.length !== it.words.length} onClick={check}>تحقّق</button> : <button className="btn primary" onClick={next}>التالي <Icon n="arrow" /></button>}
    </div>
  )
}

function Task({ t, onEnter }) {
  const [txt, setTxt] = useState('')
  const [sent, setSent] = useState(false)
  const ref = useRef()
  const m = me()
  const words = txt.trim() ? txt.trim().split(/\s+/).length : 0
  const passed = t.checks.filter((c) => c.test(txt))
  const mine = m ? load().writings.filter((w) => w.key === m.key && w.task === t.id).sort((a, b) => b.at - a.at) : []
  const send = () => {
    if (!m) return onEnter()
    submitWriting(t.id, txt.trim()); addEvent('write', t.id, passed.length, t.checks.length); setSent(true); setTxt(''); burstAt(ref.current)
  }
  return (
    <article className="task" ref={ref}>
      <header><span className="u-tag" dir="ltr">Unit {t.u.slice(1)}</span><Ltr as="h3">{t.title}</Ltr><span className="task-ar">{t.ar}</span></header>
      <Ltr as="p" className="prompt">{t.prompt}</Ltr>
      <div className="frame"><b>إطار مساعد</b><Ltr as="p">{t.frame}</Ltr></div>
      <div className="task-body">
        <div className="paper-area">
          <textarea className="input" dir="ltr" lang="en" rows={9} value={txt} onChange={(e) => { setTxt(e.target.value); setSent(false) }} placeholder="Start writing here…" spellCheck="true" />
          <span className="wc" dir="ltr">{words} words</span>
        </div>
        <ul className="checklist">
          <li className="cl-h">قائمة التحقق ({passed.length}/{t.checks.length})</li>
          {t.checks.map((c) => { const on = c.test(txt); return <li key={c.id} className={on ? 'on' : ''}><span className="ck">{on ? <Icon n="check" size={14} sw={3} /> : null}</span><span><Mixed text={c.ar} /></span></li> })}
        </ul>
      </div>
      {sent && <p className="ok-msg">وصلت كتابتك لمعلمك 💌 ستجد تقييمه هنا.</p>}
      <button className="btn primary" disabled={words < 15} onClick={send}><Icon n="arrow" />أرسل لمعلمك</button>
      {mine.length > 0 && (
        <div className="mine">
          <h4>كتاباتي السابقة</h4>
          {mine.map((w) => (
            <div key={w.id} className="mine-row">
              <Ltr as="p">{w.text}</Ltr>
              {w.feedback ? <div className="fb"><span dir="ltr">{'★'.repeat(w.feedback.stars)}{'☆'.repeat(5 - w.feedback.stars)}</span><p>{w.feedback.comment}</p></div> : <span className="pending">بانتظار تقييم المعلم</span>}
            </div>
          ))}
        </div>
      )}
    </article>
  )
}

export default function Writing({ onEnter }) {
  useData()
  const [t, setT] = useState('build')
  return (
    <>
      <LabHead en="Writing" ar="الكتابة: من ترتيب الجملة إلى فقرة كاملة يقيّمها معلمك" c="sun" />
      <section className="sec"><div className="wrap narrow">
        <SubTabs tabs={[['build', 'Sentence Builder', 'رتّب الجملة'], ['w1', 'My Pastime', 'هوايتي'], ['w2', 'My Recipe', 'وصفتي']]} val={t} set={setT} />
        {t === 'build' && <Builder onEnter={onEnter} />}
        {t !== 'build' && <Task key={t} t={WRITING.tasks.find((x) => x.id === t)} onEnter={onEnter} />}
      </div></section>
    </>
  )
}
