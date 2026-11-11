import { useRef, useState } from 'react'
import { useData } from '../App.jsx'
import { SPEAKING } from '../data/skills.js'
import { addEvent, best, me } from '../lib/store.js'
import { canListen, compare, listen, record } from '../lib/speech.js'
import { Icon, SpeakBtn, Ltr, burstAt } from '../components/ui.jsx'
import { LabHead, SubTabs } from './Skills.jsx'

function Mic({ target, refId, onEnter }) {
  const [st, setSt] = useState('idle') // idle | rec | done | err
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')
  const ref = useRef()
  const m = me()
  const b = m && best(m.key, 'speak', refId)
  const go = async () => {
    if (!m) return onEnter()
    setSt('rec'); setErr('')
    try {
      const heard = await listen()
      const r = compare(target, heard); setRes(r); setSt('done')
      addEvent('speak', refId, r.score, 100, { heard: r.heard })
      if (r.score >= 80) burstAt(ref.current)
    } catch (e) {
      setSt('err'); setErr(e.message === 'not-allowed' ? 'اسمحي للموقع باستخدام الميكروفون من إعدادات المتصفح.' : e.message === 'no-speech' ? 'لم نسمع صوتًا، اقتربي من الميكروفون وأعيدي.' : 'تعذّر التسجيل، أعيدي المحاولة.')
    }
  }
  return (
    <div className="mic-box" ref={ref}>
      <button className={`mic-btn ${st === 'rec' ? 'rec' : ''}`} onClick={go} disabled={st === 'rec'} aria-label="ابدئي التحدث"><Icon n="mic" size={30} /></button>
      <span className="mic-lbl">{st === 'rec' ? 'أسمعك الآن… تكلّمي' : 'اضغطي ثم اقرئي الجملة'}</span>
      {b && st !== 'done' && <span className="best-tag" dir="ltr">Best: {b.score}%</span>}
      {st === 'err' && <p className="err">{err}</p>}
      {st === 'done' && res && (
        <div className="mic-res">
          <div className="mic-score" style={{ '--p': res.score }}><b dir="ltr">{res.score}%</b></div>
          <p className="words" dir="ltr">{res.words.map((w, i) => <span key={i} className={w.ok ? 'ok' : 'miss'}>{w.w}</span>)}</p>
          <p className="muted small" dir="ltr">We heard: “{res.heard}”</p>
          <p className="small">{res.score >= 90 ? 'نطق ممتاز 🎉' : res.score >= 70 ? 'جيد جدًا، الكلمات الحمراء تحتاج تدريبًا' : 'استمعي للجملة ببطء ثم أعيدي'}</p>
        </div>
      )}
    </div>
  )
}

function Recorder() {
  const [st, setSt] = useState('idle')
  const [url, setUrl] = useState('')
  const [err, setErr] = useState('')
  const h = useRef(null)
  const start = async () => {
    setErr('')
    try { h.current = await record(30000); setSt('rec') } catch { setErr('اسمحي للموقع باستخدام الميكروفون.') }
  }
  const stop = async () => { const u = await h.current.stop(); setUrl(u); setSt('done') }
  return (
    <div className="recorder">
      {st !== 'rec' ? <button className="btn primary" onClick={start}><Icon n="mic" />{st === 'done' ? 'سجّلي مرة أخرى' : 'ابدئي التسجيل'}</button> : <button className="btn danger" onClick={stop}><Icon n="stop" />أوقفي (حتى 30 ثانية)</button>}
      {st === 'rec' && <span className="rec-dot">REC</span>}
      {url && st === 'done' && <audio controls src={url} />}
      {err && <p className="err">{err}</p>}
    </div>
  )
}

export default function Speaking({ onEnter }) {
  useData()
  const [t, setT] = useState('read')
  const [u, setU] = useState('all')
  const stt = canListen()
  const list = SPEAKING.read.map((x, i) => ({ ...x, i })).filter((x) => u === 'all' || x.u === u)
  return (
    <>
      <LabHead en="Speaking" ar="المحادثة: اقرئي بصوتك ويقيس الموقع نطقك" c="pink" />
      <section className="sec"><div className="wrap narrow">
        {!stt && <p className="warn">قياس النطق يعمل في متصفح Chrome على الحاسب أو الجوال. في المتصفحات الأخرى استخدمي «Talk Time» للتسجيل والاستماع لصوتك.</p>}
        <SubTabs tabs={[['read', 'Read Aloud', 'اقرئي بصوتك'], ['tw', 'Tongue Twisters', 'تحدّي اللسان'], ['talk', 'Talk Time', 'تحدّثي']]} val={t} set={setT} />
        {t === 'read' && (
          <div className="stack">
            <div className="seg center">{[['all', 'الكل'], ['u4', 'Unit 4'], ['u5', 'Unit 5']].map(([k, l]) => <button key={k} aria-pressed={u === k} onClick={() => setU(k)}>{l}</button>)}</div>
            {list.map((x) => (
              <div key={x.i} className="say-card">
                <div className="say-top"><SpeakBtn text={x.t} /><SpeakBtn text={x.t} slow /><Ltr as="b">{x.t}</Ltr></div>
                {stt ? <Mic target={x.t} refId={'r' + x.i} onEnter={onEnter} /> : <Recorder />}
              </div>
            ))}
          </div>
        )}
        {t === 'tw' && (
          <div className="stack">
            <p className="tip">اقرئيها ببطء أولًا ثم أسرع فأسرع. هل تستطيعين قولها ثلاث مرات دون خطأ؟</p>
            {SPEAKING.twisters.map((x, i) => (
              <div key={i} className="say-card tw">
                <div className="say-top"><SpeakBtn text={x} /><SpeakBtn text={x} slow /><Ltr as="b">{x}</Ltr></div>
                {stt ? <Mic target={x} refId={'t' + i} onEnter={onEnter} /> : <Recorder />}
              </div>
            ))}
          </div>
        )}
        {t === 'talk' && (
          <div className="stack">
            <p className="tip">اختاري سؤالًا، واستعيني بالجمل المساعدة، ثم سجّلي إجابتك واستمعي لنفسك. حاولي أن تتكلمي 20 ثانية على الأقل.</p>
            {SPEAKING.talk.map((x, i) => (
              <div key={i} className="say-card talk">
                <span className="u-tag" dir="ltr">Unit {x.u.slice(1)}</span>
                <div className="say-top"><SpeakBtn text={x.q} /><Ltr as="b">{x.q}</Ltr></div>
                <ul className="hints" dir="ltr">{x.hints.map((h) => <li key={h}>{h}</li>)}</ul>
                <Recorder />
              </div>
            ))}
          </div>
        )}
      </div></section>
    </>
  )
}
