import { useMemo, useRef, useState } from 'react'
import { useData, Gate } from '../App.jsx'
import { UNITS, unitById } from '../data/units.js'
import { addEvent, best, me } from '../lib/store.js'
import { Icon, SpeakBtn, Choices, Ltr, burstAt, Score, Mixed } from '../components/ui.jsx'
import { unitProgress } from './Home.jsx'

const TABS = [['words', 'Words', 'الكلمات'], ['grammar', 'Grammar', 'القواعد'], ['sounds', 'Sounds', 'الأصوات'], ['enrich', 'Explore', 'الإثراء'], ['quiz', 'Quiz', 'الاختبار']]

function FlipCard({ v }) {
  const [f, setF] = useState(false)
  return (
    <div className={`fcard ${f ? 'flip' : ''}`}>
      <button className="fc-in" onClick={() => setF(!f)} aria-label={`${v.en}: اضغط للقلب`}>
        <span className="fc-front"><span className="fc-e" aria-hidden="true">{v.e}</span><Ltr as="b">{v.en}</Ltr></span>
        <span className="fc-back"><b>{v.ar}</b><Ltr as="small">{v.ex}</Ltr></span>
      </button>
      <span className="fc-spk"><SpeakBtn text={f ? v.ex : v.en} small /></span>
    </div>
  )
}

function MatchGame({ u, onEnter }) {
  const [round, setRound] = useState(0)
  const set = useMemo(() => [...u.vocab].sort(() => Math.random() - 0.5).slice(0, 6), [round])
  const [i, setI] = useState(0)
  const [ok, setOk] = useState(0)
  const [done, setDone] = useState(false)
  const ref = useRef()
  const w = set[i]
  const opts = useMemo(() => w ? [w.ar, ...u.vocab.filter((x) => x.en !== w.en).sort(() => Math.random() - 0.5).slice(0, 2).map((x) => x.ar)].sort(() => Math.random() - 0.5) : [], [w])
  if (!me()) return <div className="game-card"><p>سجّل دخولك لتلعب وتجمع النجوم.</p><button className="btn primary" onClick={onEnter}>ادخل</button></div>
  if (done) return <div className="game-card"><Score score={ok} max={set.length} onRetry={() => { setRound(round + 1); setI(0); setOk(0); setDone(false) }} /></div>
  return (
    <div className="game-card" ref={ref}>
      <div className="g-top"><b dir="ltr">Match it!</b><span dir="ltr">{i + 1} / {set.length}</span></div>
      <div className="g-word"><span aria-hidden="true">{w.e}</span><Ltr as="b">{w.en}</Ltr><SpeakBtn text={w.en} small /></div>
      <Choices key={w.en} opts={opts} answer={w.ar} ltr={false} onDone={(c) => {
        const n = ok + (c ? 1 : 0); if (c) { setOk(n); burstAt(ref.current) }
        setTimeout(() => { if (i + 1 < set.length) setI(i + 1); else { setDone(true); addEvent('vocab', u.id, n, set.length) } }, 800)
      }} />
    </div>
  )
}

function Words({ u, onEnter }) {
  return (
    <div className="stack">
      <div className="sub-h"><h2 dir="ltr">Words</h2><p>اضغط البطاقة لترى المعنى والمثال، واضغط السماعة لتسمع النطق.</p></div>
      <div className="fgrid">{u.vocab.map((v) => <FlipCard key={v.en} v={v} />)}</div>
      <MatchGame u={u} onEnter={onEnter} />
    </div>
  )
}

function GrammarCard({ g, color }) {
  const m = me()
  const [score, setScore] = useState(0)
  const [n, setN] = useState(0)
  const ref = useRef()
  const b = m && best(m.key, 'grammar', g.id)
  const answered = (c) => {
    const s = score + (c ? 1 : 0), k = n + 1; setScore(s); setN(k)
    if (c) burstAt(ref.current)
    if (k === g.practice.length && m) addEvent('grammar', g.id, s, g.practice.length)
  }
  return (
    <article className={`gcard c-${color}`} ref={ref}>
      <header><Ltr as="h3">{g.title}</Ltr><span>{g.ar}</span>{b && <span className="done-tag" dir="ltr">✓ {b.score}/{b.max}</span>}</header>
      <p className="rule"><Icon n="bulb" size={18} /><span><Mixed text={g.rule} /></span></p>
      {g.scale && (
        <div className="freq" dir="ltr">{g.scale.map(([w, p]) => <div key={w} className="fq"><span className="fq-bar"><i style={{ height: Math.max(p, 4) + '%' }} /></span><b>{w}</b><small>{p}%</small></div>)}</div>
      )}
      {g.table && <div className="gtable" dir="ltr">{g.table.map(([a, b2]) => <div key={a}><b>{a}</b><span>{b2}</span></div>)}</div>}
      <ul className="examples">{g.examples.map((e) => <li key={e}><SpeakBtn text={e.replace(/\(.*\)/, '')} small /><Ltr>{e}</Ltr></li>)}</ul>
      <div className="try">
        <h4><bdi dir="ltr">Try it!</bdi> <span>جرّب</span></h4>
        {g.practice.map((p, i) => (
          <div key={i} className="try-q"><Ltr as="p">{p.q}</Ltr><Choices opts={p.opts} answer={p.a} shuffle onDone={answered} /></div>
        ))}
        {n === g.practice.length && <p className="try-res">{score === n ? 'Perfect! ممتاز 🎉' : `${score} من ${n}، راجع القاعدة ثم أعد المحاولة لاحقًا`}</p>}
      </div>
    </article>
  )
}

function Sounds({ u, onEnter }) {
  const m = me()
  const ref = useRef()
  const [res, setRes] = useState({})
  if (u.pron.items) {
    return (
      <div className="stack">
        <div className="sub-h"><h2 dir="ltr">{u.pron.title}</h2><p>{u.pron.ar}</p></div>
        <div className="pron-list">{u.pron.items.map((s) => (
          <div key={s} className="pron-row"><Ltr as="b">{s}</Ltr><SpeakBtn text={s} label="عادي" /><SpeakBtn text={s} slow label="ببطء" /></div>
        ))}</div>
        <p className="tip">استمع بالسرعة العادية ثم البطيئة، ولاحظ كيف تندمج do you في الكلام السريع. ثم انتقل إلى <a href="#/skills/speaking">قسم المحادثة</a> وجرّب بصوتك.</p>
        {m ? <button className="btn primary" onClick={(e) => { addEvent('sound', u.id, 1, 1); burstAt(e.currentTarget) }}>تدرّبت عليها ✓</button> : <button className="btn primary" onClick={onEnter}>ادخل لتحفظ تقدمك</button>}
      </div>
    )
  }
  const words = u.pron.groups.flatMap(([s, ws]) => ws.map((w) => ({ w, s })))
  const done = Object.keys(res).length === words.length
  const right = Object.values(res).filter(Boolean).length
  return (
    <div className="stack" ref={ref}>
      <div className="sub-h"><h2 dir="ltr">{u.pron.title}</h2><p>{u.pron.ar}: استمع لكل كلمة ثم اختر صوت نهايتها.</p></div>
      <div className="sort-grid">
        {words.map(({ w, s }) => (
          <div key={w} className={`sort-item ${res[w] === true ? 'ok' : res[w] === false ? 'no' : ''}`}>
            <SpeakBtn text={w} small /><Ltr as="b">{w}</Ltr>
            <div className="sort-opts" dir="ltr">{['/s/', '/z/', '/ɪz/'].map((o) => (
              <button key={o} disabled={w in res} className={w in res && o === s ? 'ans' : ''} onClick={() => setRes((r) => { const n = { ...r, [w]: o === s }; if (Object.keys(n).length === words.length && m) addEvent('sound', u.id, Object.values(n).filter(Boolean).length, words.length); return n })}>{o}</button>
            ))}</div>
          </div>
        ))}
      </div>
      {done && <Score score={right} max={words.length} onRetry={() => setRes({})} />}
      {!m && <button className="btn primary" onClick={onEnter}>ادخل لتحفظ تقدمك</button>}
    </div>
  )
}

function Enrich({ u }) {
  const [open, setOpen] = useState({})
  return (
    <div className="stack">
      <div className="sub-h"><h2 dir="ltr">Explore more</h2><p>إثراء خارج الكتاب: حقائق، وتعابير، ومشروع. قراءة الكتاب في هذه الوحدة: <Ltr as="b">{u.bookReading}</Ltr></p></div>
      <div className="enrich">
        {u.enrich.map((x, i) => (
          <article key={i} className={`en-card t-${x.type}`}>
            <span className="en-tag">{x.type === 'fact' ? 'Did you know?' : x.type === 'idioms' ? 'Say it like a native' : 'Project'}</span>
            <Ltr as="h3">{x.title}</Ltr><span className="en-ar">{x.ar}</span>
            {x.text && <><Ltr as="p">{x.text}</Ltr><SpeakBtn text={x.text} small label="استمع" /></>}
            {x.tAr && <button className="link-btn" onClick={() => setOpen({ ...open, [i]: !open[i] })}>{open[i] ? 'إخفاء الترجمة' : 'عرض الترجمة'}</button>}
            {open[i] && <p className="en-tr"><Mixed text={x.tAr} /></p>}
            {x.list && <ul className="idioms">{x.list.map(([a, b]) => <li key={a}><SpeakBtn text={a} small /><Ltr as="b">{a}</Ltr><span>{b}</span></li>)}</ul>}
          </article>
        ))}
      </div>
    </div>
  )
}

export default function Unit({ id, tab = 'words', onEnter }) {
  useData()
  const u = unitById(id) || UNITS[0]
  const m = me()
  const p = unitProgress(m?.key, u)
  return (
    <>
      <section className={`u-hero c-${u.color}`}>
        <div className="wrap u-hero-in">
          <div>
            <div className="u-switch">{UNITS.map((x) => <a key={x.id} href={`#/unit/${x.id}/${tab}`} aria-current={x.id === u.id ? 'page' : undefined} dir="ltr">Unit {x.no}</a>)}</div>
            <Ltr as="h1">{u.title}</Ltr>
            <p className="u-ar">{u.ar}</p>
            <ul className="goals">{u.goals.map((g) => <li key={g}><Icon n="check" size={16} sw={3} /><span><Mixed text={g} /></span></li>)}</ul>
          </div>
          <div className="u-badge"><span aria-hidden="true">{u.emoji}</span><b dir="ltr">{p}%</b><small>إنجازك</small></div>
        </div>
      </section>
      <div className="tabs-bar"><div className="wrap tabs" role="tablist">
        {TABS.map(([k, en, ar]) => <a key={k} role="tab" aria-selected={tab === k} href={`#/unit/${u.id}/${k}`}><Ltr as="b">{en}</Ltr><span>{ar}</span></a>)}
      </div></div>
      <section className="sec">
        <div className="wrap">
          {tab === 'words' && <Words u={u} onEnter={onEnter} />}
          {tab === 'grammar' && <div className="stack"><div className="sub-h"><h2 dir="ltr">Grammar</h2><p>القاعدة، وأمثلة تسمعينها، وثلاثة أسئلة سريعة لكل درس.</p></div><div className="ggrid">{u.grammar.map((g) => <GrammarCard key={g.id} g={g} color={u.color} />)}</div></div>}
          {tab === 'sounds' && <Sounds u={u} onEnter={onEnter} />}
          {tab === 'enrich' && <Enrich u={u} />}
          {tab === 'quiz' && (
            <div className="quiz-cta">
              <span className="big-emoji">📝</span>
              <h2 dir="ltr">Unit {u.no} Quiz</h2>
              <p>12 سؤالًا: اختيار، وصح وخطأ، وكتابة، واستماع.</p>
              <a className="btn primary big" href={`#/quiz/q${u.no}`}>ابدأ الاختبار <Icon n="arrow" /></a>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
