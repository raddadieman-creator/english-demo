import { useState } from 'react'
import { useData, Logo } from '../App.jsx'
import { SITE } from '../config.js'
import { QUIZZES } from '../data/quizzes.js'
import { WRITING } from '../data/skills.js'
import { UNITS } from '../data/units.js'
import { addAnnouncement, delAnnouncement, addLink, delLink, giveFeedback, clearDemo, resetAll, starsOf } from '../lib/store.js'
import { Icon, Ltr, Mixed } from '../components/ui.jsx'

const pct = (e) => (e ? Math.round((e.score / e.max) * 100) : null)
const ago = (t) => { const d = (Date.now() - t) / 864e5; return d < 1 ? 'اليوم' : d < 2 ? 'أمس' : `قبل ${Math.floor(d)} أيام` }
const SKILLS = [['الاستماع', ['listen', 'dict', 'dialog'], 'sky'], ['المحادثة', ['speak'], 'pink'], ['القراءة', ['read'], 'mint'], ['الكتابة', ['build', 'write'], 'sun']]

function rows(d, cls) {
  return Object.entries(d.students).filter(([, s]) => !cls || s.cls === cls).map(([k, s]) => {
    const ev = d.events.filter((e) => e.key === k)
    const bestQ = (id) => ev.filter((e) => e.kind === 'quiz' && e.ref === id).reduce((b, e) => (!b || e.score / e.max > b.score / b.max ? e : b), null)
    const sk = SKILLS.map(([, ks]) => { const xs = ev.filter((e) => ks.includes(e.kind)); return xs.length ? Math.round(xs.reduce((a, e) => a + e.score / e.max, 0) / xs.length * 100) : null })
    const last = ev.reduce((a, e) => Math.max(a, e.at), s.joined)
    return { key: k, ...s, q: QUIZZES.map((q) => pct(bestQ(q.id))), sk, stars: starsOf(k), n: ev.length, last }
  }).sort((a, b) => b.stars - a.stars)
}

function Login({ onOk }) {
  const [p, setP] = useState(''), [e, setE] = useState('')
  return (
    <div className="t-login">
      <form className="modal-card" onSubmit={(ev) => { ev.preventDefault(); if (p === SITE.teacherPassword) { try { sessionStorage.setItem('ll-t', '1') } catch {} onOk() } else setE('كلمة المرور غير صحيحة') }}>
        <Logo />
        <h2>لوحة المعلمة</h2>
        <label className="field">كلمة المرور<input className="input" type="password" value={p} onChange={(x) => setP(x.target.value)} autoFocus /></label>
        <p className="muted small">النسخة التجريبية: 1234</p>
        {e && <p className="err">{e}</p>}
        <button className="btn primary big">دخول</button>
        <a href="#/" className="link-btn">العودة للمنصة</a>
      </form>
    </div>
  )
}

function Overview({ d, rs }) {
  const all = d.events
  const quizAvg = (id) => { const xs = rs.map((r) => r.q[QUIZZES.findIndex((q) => q.id === id)]).filter((x) => x !== null); return xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null }
  const pending = d.writings.filter((w) => !w.feedback).length
  const week = all.filter((e) => Date.now() - e.at < 7 * 864e5).length
  const skAvg = SKILLS.map((_, i) => { const xs = rs.map((r) => r.sk[i]).filter((x) => x !== null); return xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : 0 })
  // أصعب أسئلة القواعد: أقل متوسط
  const gram = UNITS.flatMap((u) => u.grammar.map((g) => { const xs = all.filter((e) => e.kind === 'grammar' && e.ref === g.id); return { t: g.title, u: u.no, n: xs.length, p: xs.length ? Math.round(xs.reduce((a, e) => a + e.score / e.max, 0) / xs.length * 100) : null } }))
  return (
    <div className="t-stack">
      <div className="kpis">
        <div className="kpi c-grape"><b>{rs.length}</b><span>طالبة مسجّلة</span></div>
        <div className="kpi c-mint"><b>{week}</b><span>نشاطًا هذا الأسبوع</span></div>
        <div className="kpi c-coral"><b>{pending}</b><span>كتابة بانتظار تقييمك</span></div>
        <div className="kpi c-sun"><b dir="ltr">{quizAvg('q4') ?? '—'}{quizAvg('q4') !== null && '%'}</b><span>متوسط اختبار الوحدة 4</span></div>
      </div>
      <div className="t-two">
        <section className="t-card">
          <h3>متوسط المهارات الأربع</h3>
          <div className="t-bars">{SKILLS.map(([n, , c], i) => <div key={n} className={`tb c-${c}`}><span>{n}</span><span className="tb-bar"><i style={{ width: skAvg[i] + '%' }} /></span><b dir="ltr">{skAvg[i]}%</b></div>)}</div>
        </section>
        <section className="t-card">
          <h3>الاختبارات</h3>
          <div className="t-bars">{QUIZZES.map((q) => { const a = quizAvg(q.id); const n = rs.filter((r) => r.q[QUIZZES.indexOf(q)] !== null).length; return <div key={q.id} className="tb c-grape"><Ltr>{q.title}</Ltr><span className="tb-bar"><i style={{ width: (a || 0) + '%' }} /></span><b dir="ltr">{a ?? '—'}{a !== null && '%'}</b><small>{n} طالبة</small></div> })}</div>
        </section>
      </div>
      <section className="t-card">
        <h3>دروس القواعد: أين تحتاج الطالبات دعمًا؟</h3>
        <div className="gram-grid">{gram.map((g) => <div key={g.t} className={`gg ${g.p === null ? '' : g.p < 60 ? 'low' : g.p < 80 ? 'mid' : 'hi'}`}><small dir="ltr">Unit {g.u}</small><Ltr as="b">{g.t}</Ltr><span>{g.p === null ? 'لا محاولات' : `${g.p}% · ${g.n} محاولة`}</span></div>)}</div>
      </section>
    </div>
  )
}

function Results({ rs }) {
  const csv = () => {
    const H = ['الاسم', 'الفصل', ...QUIZZES.map((q) => q.title), ...SKILLS.map((s) => s[0]), 'النجوم', 'عدد الأنشطة']
    const L = rs.map((r) => [r.name, r.cls, ...r.q.map((x) => x ?? ''), ...r.sk.map((x) => x ?? ''), r.stars, r.n])
    const txt = '﻿' + [H, ...L].map((l) => l.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'text/csv;charset=utf-8' })); a.download = 'lingo-lane-results.csv'; a.click()
  }
  const cell = (v) => <td className={v === null ? 'na' : v >= 85 ? 'hi' : v >= 60 ? 'mid' : 'low'} dir="ltr">{v === null ? '—' : v + '%'}</td>
  return (
    <section className="t-card">
      <div className="t-head"><h3>نتائج الطالبات</h3><button className="btn ghost sm" onClick={csv}><Icon n="download" size={16} />تصدير Excel (CSV)</button></div>
      <div className="t-table"><table>
        <thead><tr><th>الطالبة</th><th>الفصل</th>{QUIZZES.map((q) => <th key={q.id} dir="ltr">{q.title}</th>)}{SKILLS.map((s) => <th key={s[0]}>{s[0]}</th>)}<th>النجوم</th><th>آخر نشاط</th></tr></thead>
        <tbody>{rs.map((r) => <tr key={r.key}><td><b>{r.name}</b>{r.demo && <small className="demo">تجريبي</small>}</td><td dir="ltr">{r.cls}</td>{r.q.map((v, i) => <Fragment key={'q' + i}>{cell(v)}</Fragment>)}{r.sk.map((v, i) => <Fragment key={'s' + i}>{cell(v)}</Fragment>)}<td dir="ltr">⭐ {r.stars}</td><td className="muted">{ago(r.last)}</td></tr>)}</tbody>
      </table></div>
      {rs.length === 0 && <p className="empty">لا توجد طالبات في هذا الفصل بعد.</p>}
    </section>
  )
}
import { Fragment } from 'react'

function Writings({ d }) {
  const [sel, setSel] = useState(null)
  const [stars, setStars] = useState(4)
  const [c, setC] = useState('')
  const list = [...d.writings].sort((a, b) => (a.feedback ? 1 : 0) - (b.feedback ? 1 : 0) || b.at - a.at)
  const w = list.find((x) => x.id === sel)
  const task = (id) => WRITING.tasks.find((t) => t.id === id)
  return (
    <div className="t-two wide">
      <section className="t-card">
        <h3>الكتابات المرسلة ({list.length})</h3>
        <div className="w-list">{list.map((x) => (
          <button key={x.id} className={`w-item ${sel === x.id ? 'on' : ''}`} onClick={() => { setSel(x.id); setStars(x.feedback?.stars || 4); setC(x.feedback?.comment || '') }}>
            <b>{x.name}</b><small dir="ltr">{x.cls}</small><Ltr as="span">{task(x.task)?.title}</Ltr>
            {x.feedback ? <em className="done">✓ قُيّمت</em> : <em className="new">جديدة</em>}
          </button>
        ))}{list.length === 0 && <p className="empty">لا توجد كتابات بعد.</p>}</div>
      </section>
      <section className="t-card">
        {!w ? <p className="empty">اختاري كتابة لقراءتها وتقييمها.</p> : (
          <div className="w-view">
            <div className="t-head"><h3>{w.name} <small dir="ltr">{w.cls}</small></h3><span className="muted">{ago(w.at)}</span></div>
            <Ltr as="h4">{task(w.task)?.title}</Ltr>
            <Ltr as="p" className="w-text">{w.text}</Ltr>
            <p className="muted small">{w.text.split(/\s+/).length} كلمة</p>
            <div className="w-checks">{task(w.task)?.checks.map((ck) => <span key={ck.id} className={ck.test(w.text) ? 'on' : ''}>{ck.test(w.text) ? '✓' : '✗'} <Mixed text={ck.ar} /></span>)}</div>
            <div className="fb-form">
              <span>التقييم</span>
              <div className="stars-pick" dir="ltr">{[1, 2, 3, 4, 5].map((n) => <button key={n} className={n <= stars ? 'on' : ''} onClick={() => setStars(n)} aria-label={n + ' نجوم'}>★</button>)}</div>
              <textarea className="input" rows={3} value={c} onChange={(e) => setC(e.target.value)} placeholder="Great job! Next time…" dir="auto" />
              <button className="btn primary" onClick={() => giveFeedback(w.id, stars, c.trim())}>{w.feedback ? 'تحديث التقييم' : 'إرسال التقييم للطالبة'}</button>
              {w.feedback && <p className="ok-msg">وصل التقييم للطالبة.</p>}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

function Speaking({ d }) {
  const map = {}
  d.events.filter((e) => e.kind === 'speak').forEach((e) => { const s = d.students[e.key]; if (!s) return; (map[e.key] = map[e.key] || { name: s.name, cls: s.cls, xs: [] }).xs.push(e) })
  const list = Object.values(map).map((v) => ({ ...v, avg: Math.round(v.xs.reduce((a, e) => a + e.score, 0) / v.xs.length), last: v.xs.sort((a, b) => b.at - a.at)[0] })).sort((a, b) => b.avg - a.avg)
  return (
    <section className="t-card">
      <h3>المحادثة: دقة النطق في «اقرئي بصوتك»</h3>
      <p className="muted small">النسبة = الكلمات التي ميّزها المتصفح صحيحة من كلمات الجملة. مؤشر تدريبي يساعدك على معرفة من تحتاج دعمًا، وليس درجة نهائية.</p>
      <div className="t-table"><table>
        <thead><tr><th>الطالبة</th><th>الفصل</th><th>عدد المحاولات</th><th>متوسط الدقة</th><th>آخر ما سُمع</th></tr></thead>
        <tbody>{list.map((r) => <tr key={r.name + r.cls}><td><b>{r.name}</b></td><td dir="ltr">{r.cls}</td><td>{r.xs.length}</td><td className={r.avg >= 85 ? 'hi' : r.avg >= 60 ? 'mid' : 'low'} dir="ltr">{r.avg}%</td><td dir="ltr" className="muted">{r.last.detail?.heard || '—'}</td></tr>)}</tbody>
      </table></div>
      {list.length === 0 && <p className="empty">لا توجد محاولات بعد.</p>}
    </section>
  )
}

function Board({ d }) {
  const [t, setT] = useState('')
  const [lt, setLt] = useState(''), [lu, setLu] = useState(''), [lun, setLun] = useState('u4')
  const [err, setErr] = useState('')
  return (
    <div className="t-two">
      <section className="t-card">
        <h3><Icon n="bell" />إعلان للطالبات</h3>
        <p className="muted small">يظهر الإعلان الأحدث أعلى الصفحة الرئيسية.</p>
        <form onSubmit={(e) => { e.preventDefault(); if (t.trim()) { addAnnouncement(t.trim()); setT('') } }} className="t-form">
          <textarea className="input" rows={3} value={t} onChange={(e) => setT(e.target.value)} placeholder="مثل: اختبار الوحدة الخامسة يوم الأحد" />
          <button className="btn primary">نشر الإعلان</button>
        </form>
        <ul className="t-list">{d.announcements.map((a) => <li key={a.id}><span>{a.text}</span><small>{ago(a.at)}</small><button className="icon-btn" onClick={() => delAnnouncement(a.id)} aria-label="حذف"><Icon n="trash" size={16} /></button></li>)}</ul>
      </section>
      <section className="t-card">
        <h3><Icon n="link" />روابط للمذاكرة</h3>
        <p className="muted small">فيديو يوتيوب، أو Wordwall، أو Quizizz، أو أي صفحة مفيدة.</p>
        <form className="t-form" onSubmit={(e) => { e.preventDefault(); let u = lu.trim(); if (u && !/^https?:\/\//.test(u)) u = 'https://' + u; try { new URL(u) } catch { return setErr('اكتبي رابطًا صحيحًا') } if (!lt.trim()) return setErr('اكتبي عنوانًا'); setErr(''); addLink(lt.trim(), u, lun); setLt(''); setLu('') }}>
          <input className="input" value={lt} onChange={(e) => setLt(e.target.value)} placeholder="العنوان" />
          <input className="input" dir="ltr" value={lu} onChange={(e) => setLu(e.target.value)} placeholder="https://" />
          <div className="seg">{['u4', 'u5'].map((u) => <button type="button" key={u} aria-pressed={lun === u} onClick={() => setLun(u)} dir="ltr">Unit {u.slice(1)}</button>)}</div>
          {err && <p className="err">{err}</p>}
          <button className="btn primary">إضافة الرابط</button>
        </form>
        <ul className="t-list">{d.links.map((l) => <li key={l.id}><a href={l.url} target="_blank" rel="noopener">{l.title}</a><small dir="ltr">Unit {l.u.slice(1)}</small><button className="icon-btn" onClick={() => delLink(l.id)} aria-label="حذف"><Icon n="trash" size={16} /></button></li>)}</ul>
      </section>
    </div>
  )
}

export default function Teacher() {
  const d = useData()
  const [ok, setOk] = useState(() => { try { return sessionStorage.getItem('ll-t') === '1' } catch { return false } })
  const [tab, setTab] = useState('ov')
  const [cls, setCls] = useState('')
  const [confirm, setConfirm] = useState(false)
  if (!ok) return <Login onOk={() => setOk(true)} />
  const rs = rows(d, cls)
  const pending = d.writings.filter((w) => !w.feedback).length
  const T = [['ov', 'نظرة عامة', 'grid'], ['res', 'النتائج', 'chart'], ['wr', 'الكتابات', 'pen', pending], ['sp', 'المحادثة', 'mic'], ['bd', 'الإعلانات والروابط', 'bell']]
  return (
    <div className="t-app">
      <aside className="t-side">
        <Logo small />
        <p className="t-role">لوحة المعلمة</p>
        <nav>{T.map(([k, l, ic, n]) => <button key={k} aria-current={tab === k ? 'page' : undefined} onClick={() => setTab(k)}><Icon n={ic} size={19} />{l}{n ? <em>{n}</em> : null}</button>)}</nav>
        <div className="t-side-foot">
          <a href="#/" className="link-btn"><Icon n="home" size={16} />عرض المنصة</a>
          <button className="link-btn" onClick={() => { try { sessionStorage.removeItem('ll-t') } catch {} setOk(false) }}><Icon n="logout" size={16} />خروج</button>
        </div>
      </aside>
      <main className="t-main">
        <header className="t-top">
          <div><h1>{T.find((x) => x[0] === tab)[1]}</h1><p className="muted">English 2 · Units 4–5 · {SITE.teacher}</p></div>
          <div className="seg">{['', ...SITE.classes].map((c) => <button key={c || 'all'} aria-pressed={cls === c} onClick={() => setCls(c)} dir="ltr">{c || 'كل الفصول'}</button>)}</div>
        </header>
        {Object.values(d.students).some((s) => s.demo) && (
          <div className="demo-note"><span>تظهر بيانات ست طالبات تجريبيات حتى تري شكل اللوحة.</span>
            {confirm ? <><button className="btn danger sm" onClick={() => { clearDemo(); setConfirm(false) }}>تأكيد الحذف</button><button className="btn ghost sm" onClick={() => setConfirm(false)}>إلغاء</button></> : <button className="btn ghost sm" onClick={() => setConfirm(true)}>حذف البيانات التجريبية</button>}
          </div>
        )}
        {tab === 'ov' && <Overview d={d} rs={rs} />}
        {tab === 'res' && <Results rs={rs} />}
        {tab === 'wr' && <Writings d={{ ...d, writings: d.writings.filter((w) => !cls || w.cls === cls) }} />}
        {tab === 'sp' && <Speaking d={d} />}
        {tab === 'bd' && <Board d={d} />}
      </main>
    </div>
  )
}
