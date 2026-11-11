import { useEffect, useRef, useState } from 'react'
import { quizById } from '../data/quizzes.js'
import { addEvent } from '../lib/store.js'
import { speak } from '../lib/speech.js'
import { Icon, Choices, Ltr, burstAt, SpeakBtn } from '../components/ui.jsx'

const clean = (s) => s.trim().toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, ' ').replace(/[.!?]$/, '')

export default function Quiz({ id }) {
  const qz = quizById(id)
  const [i, setI] = useState(-1)
  const [ans, setAns] = useState([])
  const [val, setVal] = useState('')
  const [picked, setPicked] = useState(null)
  const [left, setLeft] = useState(qz ? qz.minutes * 60 : 0)
  const ref = useRef()
  const finished = qz && i >= qz.items.length
  useEffect(() => {
    if (!qz || i < 0 || finished) return
    const t = setInterval(() => setLeft((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [i, finished])
  useEffect(() => { if (left <= 0 && i >= 0 && !finished) finish(ans) }, [left])
  useEffect(() => { const it = qz?.items[i]; if (it?.t === 'listen') setTimeout(() => speak(it.say), 350) }, [i])
  if (!qz) return <div className="gate"><h2>الاختبار غير موجود</h2><a className="btn primary" href="#/quizzes">كل الاختبارات</a></div>

  function finish(a) {
    const score = a.filter((x) => x.ok).length
    addEvent('quiz', qz.id, score, qz.items.length, { answers: a.map((x) => x.v) })
    setI(qz.items.length)
    if (score / qz.items.length >= 0.7) setTimeout(() => burstAt(ref.current), 200)
  }
  const record = (ok, v) => {
    const a = [...ans, { ok, v }]; setAns(a); setPicked({ ok, v })
    setTimeout(() => { setPicked(null); setVal(''); if (i + 1 < qz.items.length) setI(i + 1); else finish(a) }, 1000)
  }

  if (i < 0) return (
    <section className="sec"><div className="wrap narrow">
      <div className="quiz-intro">
        <span className="big-emoji">{qz.challenge ? '🚀' : '📝'}</span>
        <Ltr as="h1">{qz.title}</Ltr><p>{qz.ar}</p>
        <ul className="qi-meta"><li><b>{qz.items.length}</b> سؤال</li><li><b>{qz.minutes}</b> دقائق</li><li><b>4</b> أنواع: اختيار، صح وخطأ، كتابة، استماع</li></ul>
        <p className="muted small">في أسئلة الاستماع تُنطق الجملة تلقائيًا، ويمكنك إعادتها.</p>
        <button className="btn primary big" onClick={() => setI(0)}>Start <Icon n="arrow" /></button>
      </div>
    </div></section>
  )

  if (finished) {
    const score = ans.filter((x) => x.ok).length, p = Math.round((score / qz.items.length) * 100)
    return (
      <section className="sec"><div className="wrap narrow" ref={ref}>
        <div className="result">
          <div className="score-ring big" style={{ '--p': p }}><b dir="ltr">{p}%</b></div>
          <Ltr as="h2">{p >= 90 ? 'Outstanding!' : p >= 70 ? 'Well done!' : p >= 50 ? 'Good effort!' : 'Keep practicing!'}</Ltr>
          <p>{score} إجابة صحيحة من {qz.items.length} · +{Math.round(p / 10)} ⭐</p>
          <div className="review">
            {qz.items.map((it, k) => (
              <div key={k} className={`rv-row ${ans[k]?.ok ? 'ok' : 'no'}`}>
                <span className="rv-ic">{ans[k]?.ok ? <Icon n="check" size={16} sw={3} /> : <Icon n="x" size={16} sw={3} />}</span>
                <div dir="ltr"><p>{it.q}</p>{!ans[k]?.ok && <small>Answer: <b>{Array.isArray(it.a) ? it.a[0] : it.a}</b>{ans[k]?.v ? <> · You: {ans[k].v}</> : ' · (time up)'}</small>}</div>
              </div>
            ))}
          </div>
          <div className="row-btns"><button className="btn primary" onClick={() => { setI(0); setAns([]); setLeft(qz.minutes * 60) }}><Icon n="refresh" />أعد الاختبار</button><a className="btn ghost" href="#/quizzes">كل الاختبارات</a></div>
        </div>
      </div></section>
    )
  }

  const it = qz.items[i]
  const mm = String(Math.floor(left / 60)).padStart(2, '0'), ss = String(left % 60).padStart(2, '0')
  return (
    <section className="sec"><div className="wrap narrow" ref={ref}>
      <div className="quiz-top">
        <div className="qbar"><i style={{ width: (i / qz.items.length) * 100 + '%' }} /></div>
        <span dir="ltr" className="qcount">{i + 1}/{qz.items.length}</span>
        <span dir="ltr" className={`timer ${left < 60 ? 'low' : ''}`}>⏱ {mm}:{ss}</span>
      </div>
      <div className="qcard">
        <span className="qtype">{it.t === 'mcq' ? 'اختر الإجابة' : it.t === 'tf' ? 'صح أم خطأ؟' : it.t === 'type' ? 'اكتب الإجابة' : 'استمع ثم اختر'}</span>
        {it.t === 'listen' && <div className="q-listen"><SpeakBtn text={it.say} label="أعد الاستماع" /><SpeakBtn text={it.say} slow label="ببطء" /></div>}
        <Ltr as="h2">{it.q}</Ltr>
        {(it.t === 'mcq' || it.t === 'listen') && <Choices key={i} opts={it.opts} answer={it.a} shuffle onDone={record} disabled={!!picked} />}
        {it.t === 'tf' && <Choices key={i} opts={['True', 'False']} answer={it.a} onDone={record} />}
        {it.t === 'type' && (
          <form onSubmit={(e) => { e.preventDefault(); if (!val.trim() || picked) return; record(it.a.some((a) => clean(a) === clean(val)), val.trim()) }} className="type-q">
            <input className={`input ${picked ? (picked.ok ? 'ok' : 'no') : ''}`} dir="ltr" lang="en" value={val} onChange={(e) => setVal(e.target.value)} autoFocus autoComplete="off" autoCapitalize="off" spellCheck="false" placeholder="Your answer" />
            <button className="btn primary" disabled={!val.trim() || !!picked}>تأكيد</button>
            {picked && !picked.ok && <p className="fix" dir="ltr">Correct: <b>{it.a[0]}</b></p>}
          </form>
        )}
      </div>
    </div></section>
  )
}
