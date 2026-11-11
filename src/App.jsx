import { useEffect, useState, useSyncExternalStore, lazy, Suspense } from 'react'
import { SITE } from './config.js'
import { load, me, signIn, signOut, starsOf, subscribe } from './lib/store.js'
import { Icon } from './components/ui.jsx'
import Home from './pages/Home.jsx'
import Unit from './pages/Unit.jsx'
import Skills from './pages/Skills.jsx'
import Listening from './pages/Listening.jsx'
import Speaking from './pages/Speaking.jsx'
import Reading from './pages/Reading.jsx'
import Writing from './pages/Writing.jsx'
import Quizzes from './pages/Quizzes.jsx'
import Quiz from './pages/Quiz.jsx'
import Stars from './pages/Stars.jsx'
const Teacher = lazy(() => import('./teacher/Teacher.jsx'))

let ver = 0
subscribe(() => { ver++ })
export const useData = () => { useSyncExternalStore(subscribe, () => ver); return load() }

function useRoute() {
  const get = () => (location.hash.replace(/^#/, '') || '/').split('/').filter(Boolean)
  const [r, setR] = useState(get)
  useEffect(() => { const f = () => { setR(get()); window.scrollTo(0, 0) }; addEventListener('hashchange', f); return () => removeEventListener('hashchange', f) }, [])
  return r
}
export const go = (path) => { location.hash = path }

export function Logo({ small }) {
  return (
    <a className={`logo ${small ? 'sm' : ''}`} href="#/" aria-label={SITE.name}>
      <span className="logo-mark" aria-hidden="true"><svg viewBox="0 0 48 48"><rect x="3" y="6" width="36" height="28" rx="10" fill="#FFD23F" stroke="#1E1B3A" strokeWidth="3" /><path d="M14 34l-4 9 12-9" fill="#FFD23F" stroke="#1E1B3A" strokeWidth="3" strokeLinejoin="round" /><text x="21" y="27" direction="ltr" textAnchor="middle" fontFamily="Bricolage Grotesque" fontWeight="800" fontSize="17" fill="#1E1B3A">Hi!</text><circle cx="40" cy="10" r="6" fill="#FF6F59" stroke="#1E1B3A" strokeWidth="3" /></svg></span>
      <span className="logo-word" dir="ltr">Lingo<b>Lane</b></span>
    </a>
  )
}

function Entry({ onClose }) {
  const [name, setName] = useState('')
  const [cls, setCls] = useState(SITE.classes[0])
  const [err, setErr] = useState('')
  const ok = (e) => { e.preventDefault(); if (name.trim().split(/\s+/).length < 2) return setErr('اكتبي اسمك الأول واسم العائلة'); signIn(name, cls); onClose() }
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="ent-h" onClick={onClose}>
      <form className="modal-card entry" onSubmit={ok} onClick={(e) => e.stopPropagation()}>
        <span className="sticker s-sun" dir="ltr">Hello! 👋</span>
        <h2 id="ent-h">ادخلي إلى الشارع</h2>
        <p className="muted">نحفظ نجومك ونتائجك باسمك، وتراها معلمتك.</p>
        <label className="field">الاسم<input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثل: ريم العتيبي" autoFocus /></label>
        <div className="field">الفصل<div className="seg">{SITE.classes.map((c) => <button type="button" key={c} aria-pressed={cls === c} onClick={() => setCls(c)} dir="ltr">{c}</button>)}</div></div>
        {err && <p className="err" role="alert">{err}</p>}
        <button className="btn primary big">Let’s go! <Icon n="arrow" /></button>
      </form>
    </div>
  )
}

function Nav({ route, onEnter }) {
  useData()
  const m = me()
  const [open, setOpen] = useState(false)
  const at = route[0] || ''
  const L = [['', 'الرئيسية'], ['unit', 'الوحدات', 'unit/u4'], ['skills', 'مختبر المهارات'], ['quizzes', 'الاختبارات'], ['stars', 'نجومي']]
  return (
    <header className="nav">
      <div className="wrap nav-in">
        <Logo />
        <nav className={`links ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
          {L.map(([k, t, to]) => <a key={k} href={'#/' + (to || k)} aria-current={at === k ? 'page' : undefined}>{t}</a>)}
        </nav>
        <div className="nav-end">
          {m ? (
            <a className="me-chip" href="#/stars"><span className="av">{m.name[0]}</span><span className="nm">{m.name.split(' ')[0]}</span><span className="st" dir="ltr">⭐ {starsOf(m.key)}</span></a>
          ) : <button className="btn primary sm" onClick={onEnter}>ادخلي</button>}
          <button className="burger" aria-label="القائمة" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /><span /></button>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot-in">
        <Logo small />
        <p>English 2 · Super Goal 2 · Units 4–5 · الفصل الدراسي الأول</p>
        <a href="#/teacher" className="t-link"><Icon n="lock" size={16} />لوحة المعلمة</a>
      </div>
    </footer>
  )
}

export function Gate({ children, onEnter }) {
  useData()
  if (me()) return children
  return (
    <div className="gate">
      <span className="big-emoji">🔑</span>
      <h2>سجّلي دخولك أولًا</h2>
      <p className="muted">حتى تُحفظ نجومك ونتائجك.</p>
      <button className="btn primary" onClick={onEnter}>ادخلي الآن</button>
    </div>
  )
}

export default function App() {
  const route = useRoute()
  const [entry, setEntry] = useState(false)
  const enter = () => setEntry(true)
  useData()
  if (route[0] === 'teacher') return <Suspense fallback={<div className="gate">…</div>}><Teacher /></Suspense>
  let page
  switch (route[0]) {
    case 'unit': page = <Unit id={route[1] || 'u4'} tab={route[2]} onEnter={enter} />; break
    case 'skills':
      page = route[1] === 'listening' ? <Listening onEnter={enter} /> : route[1] === 'speaking' ? <Speaking onEnter={enter} /> : route[1] === 'reading' ? <Reading id={route[2]} onEnter={enter} /> : route[1] === 'writing' ? <Writing onEnter={enter} /> : <Skills />
      break
    case 'quizzes': page = <Quizzes />; break
    case 'quiz': page = <Gate onEnter={enter}><Quiz id={route[1]} /></Gate>; break
    case 'stars': page = <Gate onEnter={enter}><Stars onOut={() => { signOut(); go('/') }} /></Gate>; break
    default: page = <Home onEnter={enter} />
  }
  return (
    <>
      <a className="skip" href="#main">تخطَّ إلى المحتوى</a>
      <Nav route={route} onEnter={enter} />
      <main id="main">{page}</main>
      <Footer />
      {entry && <Entry onClose={() => setEntry(false)} />}
    </>
  )
}
