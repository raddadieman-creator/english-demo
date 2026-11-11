import { useData } from '../App.jsx'
import { me, eventsOf } from '../lib/store.js'
import { Icon, Ltr } from '../components/ui.jsx'

const S = [
  { k: 'listening', en: 'Listening', ar: 'الاستماع', ic: 'headphones', c: 'sky', kinds: ['listen', 'dict', 'dialog'], items: ['Listen & Choose: استمع واختر', 'Dictation: اكتب ما تسمع', 'Dialogues: حوار في النادي وفي المقهى'] },
  { k: 'speaking', en: 'Speaking', ar: 'المحادثة', ic: 'mic', c: 'pink', kinds: ['speak'], items: ['Read Aloud: يقيس الموقع نطقك', 'Tongue Twisters: تحدّي اللسان', 'Talk Time: سجّل إجابتك واستمع لها'] },
  { k: 'reading', en: 'Reading', ar: 'القراءة', ic: 'book', c: 'mint', kinds: ['read'], items: ['4 نصوص بمستويين', 'اضغط الكلمة لترى معناها', 'أسئلة فهم بعد كل نص'] },
  { k: 'writing', en: 'Writing', ar: 'الكتابة', ic: 'pen', c: 'sun', kinds: ['build', 'write'], items: ['Sentence Builder: رتّب الكلمات', 'فقرة عن هوايتك', 'وصفة عائلتك، ويقيّمها معلمك'] },
]

export default function Skills() {
  useData()
  const m = me()
  const ev = m ? eventsOf(m.key) : []
  return (
    <>
      <section className="lab-hero">
        <div className="wrap">
          <Ltr as="h1">Skills Lab</Ltr>
          <p>أربع مهارات، لكل منها مختبر. ابدأ بأي واحدة، وكل تمرين يضيف إلى نجومك.</p>
        </div>
      </section>
      <section className="sec">
        <div className="wrap lab-grid">
          {S.map((s, i) => {
            const n = ev.filter((e) => s.kinds.includes(e.kind)).length
            return (
              <a key={s.k} href={`#/skills/${s.k}`} className={`lab c-${s.c}`} style={{ '--i': i }}>
                <span className="lab-no" dir="ltr">0{i + 1}</span>
                <span className="lab-ic"><Icon n={s.ic} size={38} /></span>
                <div>
                  <Ltr as="h2">{s.en}</Ltr><span className="lab-ar">{s.ar}</span>
                  <ul>{s.items.map((t) => <li key={t}>{t}</li>)}</ul>
                </div>
                <span className="lab-foot">{n ? `أنجزت ${n} تمرينًا` : 'ابدأ هنا'}<Icon n="arrow" /></span>
              </a>
            )
          })}
        </div>
      </section>
    </>
  )
}

export function LabHead({ en, ar, c, children }) {
  return (
    <section className={`skill-hero c-${c}`}>
      <div className="wrap">
        <a className="back" href="#/skills"><Icon n="back" size={18} />مختبر المهارات</a>
        <Ltr as="h1">{en}</Ltr><p className="sh-ar">{ar}</p>
        {children}
      </div>
    </section>
  )
}

export function SubTabs({ tabs, val, set }) {
  return (
    <div className="subtabs" role="tablist">
      {tabs.map(([k, en, ar]) => <button key={k} role="tab" aria-selected={val === k} onClick={() => set(k)}><Ltr as="b">{en}</Ltr><span>{ar}</span></button>)}
    </div>
  )
}
