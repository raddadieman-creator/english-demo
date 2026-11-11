import { useState } from 'react'
import { useData } from '../App.jsx'
import { me, best, starsOf } from '../lib/store.js'
import { leaderboard } from '../lib/badges.js'
import { UNITS } from '../data/units.js'
import { QUIZZES } from '../data/quizzes.js'
import { Icon, SpeakBtn, Ltr } from '../components/ui.jsx'

export function unitProgress(key, u) {
  if (!key) return 0
  const parts = [best(key, 'vocab', u.id), ...u.grammar.map((g) => best(key, 'grammar', g.id)), best(key, 'sound', u.id), best(key, 'quiz', 'q' + u.no)]
  return Math.round((parts.filter(Boolean).length / parts.length) * 100)
}

const SKILLS = [
  { k: 'listening', en: 'Listening', ar: 'الاستماع', ic: 'headphones', c: 'sky', d: 'استمعي واختاري، واكتبي ما تسمعينه، وتابعي حوارات قصيرة' },
  { k: 'speaking', en: 'Speaking', ar: 'المحادثة', ic: 'mic', c: 'pink', d: 'اقرئي بصوتك ويقيس الموقع نطقك، وسجّلي إجاباتك' },
  { k: 'reading', en: 'Reading', ar: 'القراءة', ic: 'book', c: 'mint', d: 'نصوص قصيرة، اضغطي أي كلمة ملوّنة لترين معناها' },
  { k: 'writing', en: 'Writing', ar: 'الكتابة', ic: 'pen', c: 'sun', d: 'رتّبي الجمل، واكتبي فقرة تصلها معلمتك وتقيّمها' },
]

function WordOfDay() {
  const all = UNITS.flatMap((u) => u.vocab)
  const w = all[Math.floor(Date.now() / 864e5) % all.length]
  const [flip, setFlip] = useState(false)
  return (
    <div className={`wod ${flip ? 'flip' : ''}`} role="button" tabIndex={0} onClick={() => setFlip(!flip)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlip(!flip) } }} aria-label="كلمة اليوم: اضغطي لترين المعنى">
      <span className="wod-tag">Word of the day</span>
      <span className="wod-e" aria-hidden="true">{w.e}</span>
      <Ltr as="b" className="wod-w">{w.en}</Ltr>
      {flip ? <span className="wod-ar">{w.ar}<Ltr as="small">{w.ex}</Ltr></span> : <span className="wod-hint">اضغطي لترين المعنى</span>}
      <span className="wod-spk"><SpeakBtn text={w.en} small /></span>
    </div>
  )
}

export default function Home({ onEnter }) {
  const d = useData()
  const m = me()
  const ann = d.announcements[0]
  const top = leaderboard().slice(0, 3)
  const words = UNITS.flatMap((u) => u.vocab.map((v) => v.en))
  return (
    <>
      {ann && <div className="ann"><div className="wrap"><Icon n="bell" size={18} /><span>{ann.text}</span></div></div>}

      <section className="hero">
        <div className="wrap hero-in">
          <div className="hero-txt">
            <p className="kicker">English 2 · Super Goal 2</p>
            <h1 dir="ltr" lang="en"><span className="l1">Speak it.</span> <span className="l2">Play it.</span> <span className="l3">Love it.</span></h1>
            <p className="lead">منصة الإنجليزي لطالبات ثاني متوسط: الوحدتان الرابعة والخامسة، بكلمات تُسمع، وقواعد تُلعب، ومهارات أربع تتدرّبين عليها بصوتك.</p>
            <div className="cta">
              {m ? <a className="btn primary big" href="#/unit/u4">أكملي رحلتك <Icon n="arrow" /></a> : <button className="btn primary big" onClick={onEnter}>ابدئي الرحلة <Icon n="arrow" /></button>}
              <a className="btn ghost big" href="#/skills">مختبر المهارات</a>
            </div>
            {m && <p className="hello">مرحبًا {m.name.split(' ')[0]}، معك <b dir="ltr">⭐ {starsOf(m.key)}</b> نجمة.</p>}
          </div>
          <div className="hero-art" aria-hidden="false">
            <span className="sticker s-grape float1" dir="ltr">How often? 🔁</span>
            <span className="sticker s-coral float2" dir="ltr">Is there any? 🍦</span>
            <span className="sticker s-mint float3" dir="ltr">I know how to ⛸️</span>
            <WordOfDay />
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true"><div className="mq-track" dir="ltr">{[...words, ...words].map((w, i) => <span key={i}>{w}<i>✦</i></span>)}</div></div>

      <section className="sec">
        <div className="wrap">
          <div className="sec-h"><h2>اختاري وحدتك</h2><p>كل وحدة فيها: كلمات، وقواعد، وأصوات، وإثراء، واختبار.</p></div>
          <div className="units">
            {UNITS.map((u) => {
              const p = unitProgress(m?.key, u)
              return (
                <a key={u.id} className={`poster c-${u.color}`} href={`#/unit/${u.id}`}>
                  <span className="p-no" dir="ltr">Unit {u.no}</span>
                  <span className="p-emoji" aria-hidden="true">{u.emoji}</span>
                  <Ltr as="h3">{u.title}</Ltr>
                  <span className="p-ar">{u.ar}</span>
                  <Ltr as="p" className="p-hook">“{u.hook}”</Ltr>
                  <span className="p-meta"><span>{u.vocab.length} كلمة</span><span>{u.grammar.length} دروس قواعد</span><span>إثراء</span></span>
                  <span className="p-bar"><i style={{ width: p + '%' }} /></span>
                  <span className="p-go">{p ? `أنجزتِ ${p}%` : 'ابدئي الوحدة'}<Icon n="arrow" /></span>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      <section className="sec band-grape">
        <div className="wrap">
          <div className="sec-h light"><h2 dir="ltr">Skills Lab</h2><p>مختبر المهارات الأربع: لكل مهارة قسم خاص وتمارين بصوت إنجليزي حقيقي.</p></div>
          <div className="skill-grid">
            {SKILLS.map((s) => (
              <a key={s.k} className={`skill c-${s.c}`} href={`#/skills/${s.k}`}>
                <span className="sk-ic"><Icon n={s.ic} size={30} /></span>
                <Ltr as="h3">{s.en}</Ltr><span className="sk-ar">{s.ar}</span>
                <p>{s.d}</p>
                <span className="sk-go"><Icon n="arrow" /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap two-col">
          <div>
            <div className="sec-h start"><h2>اختبري نفسك</h2><p>اختبار لكل وحدة، وتحدٍّ ختامي بالوقت.</p></div>
            <div className="qlist">
              {QUIZZES.map((q) => {
                const b = m && best(m.key, 'quiz', q.id)
                return (
                  <a key={q.id} className={`qrow ${q.challenge ? 'hot' : ''}`} href={`#/quiz/${q.id}`}>
                    <span className="q-ic">{q.challenge ? '🚀' : '📝'}</span>
                    <span><Ltr as="b">{q.title}</Ltr><small>{q.ar} · {q.items.length} سؤال · {q.minutes} دقائق</small></span>
                    <span className="q-best" dir="ltr">{b ? Math.round((b.score / b.max) * 100) + '%' : 'Start'}</span>
                  </a>
                )
              })}
            </div>
          </div>
          <div className="podium-card">
            <h3><Icon n="trophy" />نجمات الأسبوع</h3>
            <ol className="podium">
              {top.map((s, i) => <li key={s.key} className={'pd' + (i + 1)}><span className="pd-av">{s.name[0]}</span><b>{s.name}</b><small dir="ltr">{s.cls}</small><span className="pd-st" dir="ltr">⭐ {s.stars}</span></li>)}
            </ol>
            <a className="btn ghost" href="#/stars">لوحة النجوم كاملة</a>
          </div>
        </div>
      </section>

      {d.links.length > 0 && (
        <section className="sec tight">
          <div className="wrap">
            <div className="sec-h start"><h2>روابط من معلمتك</h2></div>
            <div className="links-grid">{d.links.map((l) => <a key={l.id} className="lnk" href={l.url} target="_blank" rel="noopener"><Icon n="link" /><span>{l.title}</span></a>)}</div>
          </div>
        </section>
      )}
    </>
  )
}
