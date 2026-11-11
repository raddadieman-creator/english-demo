import { useState } from 'react'
import { useData } from '../App.jsx'
import { SITE } from '../config.js'
import { me, starsOf, eventsOf } from '../lib/store.js'
import { BADGES, badgesOf, leaderboard, levelOf } from '../lib/badges.js'
import { Icon, Ltr } from '../components/ui.jsx'

const SK = [['listen', 'dict', 'dialog'], ['speak'], ['read'], ['build', 'write']]
const SKN = [['Listening', 'sky'], ['Speaking', 'pink'], ['Reading', 'mint'], ['Writing', 'sun']]

export default function Stars({ onOut }) {
  useData()
  const m = me()
  const [cls, setCls] = useState(m.cls)
  const st = starsOf(m.key)
  const lv = levelOf(st)
  const mine = badgesOf(m.key).map((b) => b.id)
  const ev = eventsOf(m.key)
  const board = leaderboard(cls).slice(0, 10)
  return (
    <>
      <section className="me-hero"><div className="wrap me-in">
        <div className="me-card">
          <span className="me-av">{m.name[0]}</span>
          <div><h1>{m.name}</h1><p dir="ltr">Class {m.cls} · {lv.name} <span>({lv.ar})</span></p></div>
          <div className="me-st"><b dir="ltr">⭐ {st}</b><small>نجمة</small></div>
          {lv.next && <div className="lv-bar"><i style={{ width: ((st - lv.from) / (lv.next - lv.from)) * 100 + '%' }} /><span>{lv.next - st} نجمة للمستوى التالي</span></div>}
          <button className="link-btn out" onClick={onOut}><Icon n="logout" size={16} />تسجيل الخروج</button>
        </div>
        <div className="skill-meters">
          {SK.map((ks, i) => {
            const xs = ev.filter((e) => ks.includes(e.kind)); const avg = xs.length ? Math.round(xs.reduce((a, e) => a + e.score / e.max, 0) / xs.length * 100) : 0
            return <div key={i} className={`smeter c-${SKN[i][1]}`}><Ltr as="b">{SKN[i][0]}</Ltr><span className="sm-bar"><i style={{ width: avg + '%' }} /></span><small dir="ltr">{xs.length ? avg + '%' : '—'}</small></div>
          })}
        </div>
      </div></section>
      <section className="sec"><div className="wrap two-col">
        <div>
          <div className="sec-h start"><h2>أوسمتي</h2><p>تُفتح الأوسمة من أنشطتك الفعلية.</p></div>
          <div className="badges">{BADGES.map((b) => <div key={b.id} className={`badge ${mine.includes(b.id) ? 'on' : ''}`}><span className="b-e">{mine.includes(b.id) ? b.e : '🔒'}</span><Ltr as="b">{b.en}</Ltr><small>{b.ar}</small></div>)}</div>
        </div>
        <div>
          <div className="sec-h start"><h2>لوحة النجوم</h2></div>
          <div className="seg">{['', ...SITE.classes].map((c) => <button key={c || 'all'} aria-pressed={cls === c} onClick={() => setCls(c)} dir="ltr">{c || 'الكل'}</button>)}</div>
          <ol className="board">{board.map((s, i) => <li key={s.key} className={s.key === m.key ? 'me' : ''}><span className="rk" dir="ltr">{i + 1}</span><span className="pd-av">{s.name[0]}</span><b>{s.name}</b><small dir="ltr">{s.cls}</small><span className="pd-st" dir="ltr">⭐ {s.stars}</span></li>)}</ol>
        </div>
      </div></section>
    </>
  )
}
