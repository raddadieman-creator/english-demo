import { useRef, useState } from 'react'
import { useData } from '../App.jsx'
import { LISTENING } from '../data/skills.js'
import { addEvent, me } from '../lib/store.js'
import { speak, stopSpeak, canSpeak } from '../lib/speech.js'
import { Icon, SpeakBtn, Choices, Ltr, burstAt, Score } from '../components/ui.jsx'
import { LabHead, SubTabs } from './Skills.jsx'

const NeedIn = ({ onEnter }) => <div className="game-card"><p>سجّل دخولك لتُحفظ نتيجتك.</p><button className="btn primary" onClick={onEnter}>ادخل</button></div>

function BigPlay({ text, slow, setSlow }) {
  const [on, setOn] = useState(false)
  const play = async () => { setOn(true); await speak(text, slow); setOn(false) }
  return (
    <div className="bigplay">
      <button className={`play-disc ${on ? 'on' : ''}`} onClick={play} aria-label="تشغيل"><Icon n="speaker" size={34} /><span className="ripple" /></button>
      <label className="slow-toggle"><input type="checkbox" checked={slow} onChange={(e) => setSlow(e.target.checked)} /><Icon n="turtle" size={18} />ببطء</label>
    </div>
  )
}

function Pick({ onEnter }) {
  const items = LISTENING.pick
  const [i, setI] = useState(0)
  const [ok, setOk] = useState(0)
  const [slow, setSlow] = useState(false)
  const [done, setDone] = useState(false)
  const ref = useRef()
  if (!me()) return <NeedIn onEnter={onEnter} />
  if (done) return <Score score={ok} max={items.length} onRetry={() => { setI(0); setOk(0); setDone(false) }} />
  const it = items[i]
  return (
    <div className="game-card" ref={ref}>
      <div className="g-top"><b dir="ltr">Listen & Choose</b><span dir="ltr">{i + 1} / {items.length}</span></div>
      <BigPlay text={it.say} slow={slow} setSlow={setSlow} />
      <Ltr as="p" className="g-q">{it.q}</Ltr>
      <Choices key={i} opts={it.opts} answer={it.a} shuffle onDone={(c) => {
        const n = ok + (c ? 1 : 0); if (c) { setOk(n); burstAt(ref.current) }
        setTimeout(() => { stopSpeak(); if (i + 1 < items.length) setI(i + 1); else { setDone(true); addEvent('listen', 'pick', n, items.length) } }, 1100)
      }} />
    </div>
  )
}

function Dictation({ onEnter }) {
  const items = LISTENING.dictation
  const [i, setI] = useState(0)
  const [val, setVal] = useState('')
  const [res, setRes] = useState(null)
  const [ok, setOk] = useState(0)
  const [slow, setSlow] = useState(false)
  const [done, setDone] = useState(false)
  const ref = useRef()
  if (!me()) return <NeedIn onEnter={onEnter} />
  if (done) return <Score score={ok} max={items.length} onRetry={() => { setI(0); setOk(0); setDone(false); setRes(null); setVal('') }} />
  const it = items[i]
  const check = (e) => {
    e.preventDefault(); if (res !== null) return
    const c = val.trim().toLowerCase().replace(/\s+/g, ' ') === it.say.toLowerCase()
    setRes(c); if (c) { setOk(ok + 1); burstAt(ref.current) }
  }
  const next = () => { const n = ok; if (i + 1 < items.length) { setI(i + 1); setVal(''); setRes(null) } else { setDone(true); addEvent('dict', 'all', n, items.length) } }
  return (
    <form className="game-card" ref={ref} onSubmit={check}>
      <div className="g-top"><b dir="ltr">Dictation</b><span dir="ltr">{i + 1} / {items.length}</span></div>
      <BigPlay text={it.say} slow={slow} setSlow={setSlow} />
      <input className={`input dict ${res === true ? 'ok' : res === false ? 'no' : ''}`} dir="ltr" lang="en" value={val} onChange={(e) => setVal(e.target.value)} placeholder="Type what you hear…" autoComplete="off" autoCapitalize="off" spellCheck="false" />
      {res === false && <p className="fix" dir="ltr">Correct: <b>{it.say}</b></p>}
      {res === null ? <button className="btn primary">تحقّق</button> : <button type="button" className="btn primary" onClick={next}>التالي <Icon n="arrow" /></button>}
    </form>
  )
}

function Dialog({ d, onEnter }) {
  const [line, setLine] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [show, setShow] = useState(false)
  const [ans, setAns] = useState({})
  const stop = useRef(false)
  const ref = useRef()
  const playAll = async () => {
    stop.current = false; setPlaying(true)
    for (let k = 0; k < d.lines.length; k++) { if (stop.current) break; setLine(k); await speak(d.lines[k][1]); await new Promise((r) => setTimeout(r, 250)) }
    setLine(-1); setPlaying(false)
  }
  const halt = () => { stop.current = true; stopSpeak(); setPlaying(false); setLine(-1) }
  const done = Object.keys(ans).length === d.qs.length
  const score = Object.values(ans).filter(Boolean).length
  return (
    <article className="dialog-card" ref={ref}>
      <header><div><Ltr as="h3">{d.title}</Ltr><span>{d.ar}</span></div>
        {playing ? <button className="btn ghost" onClick={halt}><Icon n="stop" />إيقاف</button> : <button className="btn primary" onClick={playAll}><Icon n="play" />استمع للحوار</button>}
      </header>
      <label className="slow-toggle"><input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />أظهر النص</label>
      <div className="bubbles" dir="ltr">
        {d.lines.map(([who, t], k) => (
          <div key={k} className={`bubble ${k % 2 ? 'r' : 'l'} ${line === k ? 'live' : ''}`}>
            <b>{who}</b><span className={show ? '' : 'blur'}>{t}</span>
          </div>
        ))}
      </div>
      <div className="dq">
        {d.qs.map((q, k) => <div key={k} className="try-q"><Ltr as="p">{q.q}</Ltr><Choices opts={q.opts} answer={q.a} shuffle onDone={(c) => setAns((a) => { const n = { ...a, [k]: c }; if (Object.keys(n).length === d.qs.length) { if (me()) addEvent('dialog', d.id, Object.values(n).filter(Boolean).length, d.qs.length); burstAt(ref.current) } return n })} /></div>)}
        {done && <p className="try-res">{score} / {d.qs.length} {score === d.qs.length ? '🎉' : ''}</p>}
        {!me() && <button className="btn ghost" onClick={onEnter}>ادخل لتُحفظ نتيجتك</button>}
      </div>
    </article>
  )
}

export default function Listening({ onEnter }) {
  useData()
  const [t, setT] = useState('pick')
  return (
    <>
      <LabHead en="Listening" ar="الاستماع: صوت إنجليزي يُنطق لك، ويمكنك إبطاؤه" c="sky" />
      <section className="sec"><div className="wrap narrow">
        {!canSpeak() && <p className="warn">متصفحك لا يدعم النطق الصوتي. جرّب Chrome أو Safari.</p>}
        <SubTabs tabs={[['pick', 'Listen & Choose', 'استمع واختر'], ['dict', 'Dictation', 'إملاء'], ['dialog', 'Dialogues', 'حوارات']]} val={t} set={setT} />
        {t === 'pick' && <Pick onEnter={onEnter} />}
        {t === 'dict' && <Dictation onEnter={onEnter} />}
        {t === 'dialog' && <div className="stack">{LISTENING.dialogs.map((d) => <Dialog key={d.id} d={d} onEnter={onEnter} />)}</div>}
      </div></section>
    </>
  )
}
