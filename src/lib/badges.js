import { load, starsOf } from './store.js'
// أوسمة تُمنح من الأنشطة الفعلية
export const BADGES = [
  { id: 'words', e: '🧠', ar: 'جامعة الكلمات', en: 'Word Collector', test: (ev) => ev.some((e) => e.kind === 'vocab' && e.score / e.max >= 0.8) },
  { id: 'gram', e: '🧩', ar: 'خبيرة القواعد', en: 'Grammar Pro', test: (ev) => new Set(ev.filter((e) => e.kind === 'grammar' && e.score === e.max).map((e) => e.ref)).size >= 4 },
  { id: 'ear', e: '🎧', ar: 'أذن ذهبية', en: 'Golden Ear', test: (ev) => ev.some((e) => (e.kind === 'listen' || e.kind === 'dialog') && e.score / e.max >= 0.85) },
  { id: 'voice', e: '🎤', ar: 'نجمة المحادثة', en: 'Star Speaker', test: (ev) => ev.some((e) => e.kind === 'speak' && e.score >= 85) },
  { id: 'book', e: '📖', ar: 'دودة كتب', en: 'Bookworm', test: (ev) => new Set(ev.filter((e) => e.kind === 'read' && e.score / e.max >= 0.75).map((e) => e.ref)).size >= 2 },
  { id: 'pen', e: '✍️', ar: 'كاتبة واعدة', en: 'Young Writer', test: (ev) => ev.some((e) => e.kind === 'write') },
  { id: 'quiz', e: '🏆', ar: 'بطلة الاختبارات', en: 'Quiz Champion', test: (ev) => ev.some((e) => e.kind === 'quiz' && e.score / e.max >= 0.9) },
  { id: 'all', e: '🚀', ar: 'متحدية الختام', en: 'Challenge Hero', test: (ev) => ev.some((e) => e.kind === 'quiz' && e.ref === 'qx' && e.score / e.max >= 0.75) },
]
export function badgesOf(key) {
  const ev = load().events.filter((e) => e.key === key)
  const w = load().writings.some((x) => x.key === key)
  return BADGES.filter((b) => b.test(w ? [...ev, { kind: 'write' }] : ev))
}
export function levelOf(stars) {
  const L = [[0, 'Starter', 'مبتدئة'], [60, 'Explorer', 'مستكشفة'], [150, 'Achiever', 'متقدمة'], [260, 'Star', 'نجمة'], [400, 'Legend', 'أسطورة']]
  let cur = L[0], next = null
  for (let i = 0; i < L.length; i++) if (stars >= L[i][0]) { cur = L[i]; next = L[i + 1] || null }
  return { name: cur[1], ar: cur[2], next: next ? next[0] : null, from: cur[0] }
}
export const leaderboard = (cls) => {
  const d = load()
  return Object.entries(d.students).filter(([, s]) => !cls || s.cls === cls).map(([k, s]) => ({ key: k, ...s, stars: starsOf(k) })).sort((a, b) => b.stars - a.stars)
}
