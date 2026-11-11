import { useData } from '../App.jsx'
import { QUIZZES } from '../data/quizzes.js'
import { me, best } from '../lib/store.js'
import { Icon, Ltr } from '../components/ui.jsx'

export default function Quizzes() {
  useData()
  const m = me()
  return (
    <>
      <section className="lab-hero quiz-hero"><div className="wrap"><Ltr as="h1">Quiz Zone</Ltr><p>اختبار لكل وحدة، وتحدٍّ ختامي يجمع الوحدتين. أفضل نتيجة تُحسب في نجومك.</p></div></section>
      <section className="sec"><div className="wrap qz-grid">
        {QUIZZES.map((q) => {
          const b = m && best(m.key, 'quiz', q.id)
          const p = b ? Math.round((b.score / b.max) * 100) : null
          return (
            <a key={q.id} href={`#/quiz/${q.id}`} className={`qz ${q.challenge ? 'hot' : q.u === 'u4' ? 'c-grape' : 'c-coral'}`}>
              <span className="qz-e">{q.challenge ? '🚀' : q.u === 'u4' ? '🎨' : '🍦'}</span>
              <Ltr as="h2">{q.title}</Ltr><span className="qz-ar">{q.ar}</span>
              <span className="qz-meta">{q.items.length} سؤال · {q.minutes} دقائق</span>
              <span className="qz-best">{p !== null ? <>أفضل نتيجة <b dir="ltr">{p}%</b></> : 'لم تختبر بعد'}</span>
              <span className="qz-go">{p !== null ? 'أعد' : 'ابدأ'}<Icon n="arrow" /></span>
            </a>
          )
        })}
      </div></section>
    </>
  )
}
