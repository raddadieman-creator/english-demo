// تخزين محلي في المتصفح (نسخة تجريبية). كل شيء في مفتاح واحد.
const KEY = 'lingolane:v1'
const ME = 'lingolane:me'
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
const safe = (fn, fb) => { try { return fn() } catch { return fb } }

const empty = () => ({ students: {}, events: [], writings: [], announcements: [], links: [], seeded: false })
let cache = null
const subs = new Set()

export function load() {
  if (cache) return cache
  cache = safe(() => JSON.parse(localStorage.getItem(KEY)), null) || empty()
  if (!cache.seeded) { seed(cache); safe(() => localStorage.setItem(KEY, JSON.stringify(cache))) }
  return cache
}
function save() { safe(() => localStorage.setItem(KEY, JSON.stringify(cache))); subs.forEach((f) => f()) }
export const subscribe = (f) => { subs.add(f); return () => subs.delete(f) }

export const keyOf = (name, cls) => (name.trim().replace(/\s+/g, ' ') + '|' + cls)
export function me() { const k = safe(() => localStorage.getItem(ME), null); const s = k && load().students[k]; return s ? { ...s, key: k } : null }
export function signIn(name, cls) {
  const d = load(); const k = keyOf(name, cls)
  if (!d.students[k]) d.students[k] = { name: name.trim().replace(/\s+/g, ' '), cls, joined: Date.now() }
  safe(() => localStorage.setItem(ME, k)); save(); return { ...d.students[k], key: k }
}
export function signOut() { safe(() => localStorage.removeItem(ME)); subs.forEach((f) => f()) }

// kind: quiz | listen | dict | dialog | speak | read | write | build | vocab | grammar | sound
export function addEvent(kind, ref, score, max, detail) {
  const m = me(); if (!m) return null
  const e = { id: uid(), key: m.key, kind, ref, score, max, at: Date.now(), detail: detail || null }
  load().events.push(e); save(); return e
}
export function eventsOf(key) { return load().events.filter((e) => e.key === key) }
export function best(key, kind, ref) {
  const xs = load().events.filter((e) => e.key === key && e.kind === kind && e.ref === ref)
  return xs.reduce((b, e) => (!b || e.score / e.max > b.score / b.max ? e : b), null)
}
// النجوم: أفضل نتيجة لكل نشاط × 10
export function starsOf(key) {
  const bestBy = {}
  for (const e of load().events) {
    if (e.key !== key) continue
    const k = e.kind + ':' + e.ref, p = e.max ? e.score / e.max : 0
    if (!(k in bestBy) || p > bestBy[k]) bestBy[k] = p
  }
  return Math.round(Object.values(bestBy).reduce((a, p) => a + p * 10, 0))
}

export function submitWriting(task, text) {
  const m = me(); if (!m) return null
  const w = { id: uid(), key: m.key, name: m.name, cls: m.cls, task, text, at: Date.now(), feedback: null }
  load().writings.push(w); save(); return w
}
export function giveFeedback(id, stars, comment) {
  const w = load().writings.find((x) => x.id === id); if (!w) return
  w.feedback = { stars, comment, at: Date.now() }; save()
}
export function addAnnouncement(text) { load().announcements.unshift({ id: uid(), text, at: Date.now() }); save() }
export function delAnnouncement(id) { const d = load(); d.announcements = d.announcements.filter((a) => a.id !== id); save() }
export function addLink(title, url, u) { load().links.unshift({ id: uid(), title, url, u, at: Date.now() }); save() }
export function delLink(id) { const d = load(); d.links = d.links.filter((a) => a.id !== id); save() }
export function resetAll() { cache = empty(); cache.seeded = true; save(); signOut() }
export function clearDemo() { const d = load(); const demo = new Set(Object.keys(d.students).filter((k) => d.students[k].demo)); d.events = d.events.filter((e) => !demo.has(e.key)); d.writings = d.writings.filter((w) => !demo.has(w.key)); demo.forEach((k) => delete d.students[k]); save() }

// بيانات تجريبية حتى لا تظهر لوحة المعلمة فارغة عند العرض الأول
function seed(d) {
  d.seeded = true
  const names = [['ريم العتيبي', '2/1'], ['لمى الحربي', '2/1'], ['جود الغامدي', '2/2'], ['سارة القحطاني', '2/2'], ['نورة الشهري', '2/3'], ['دانة الزهراني', '2/3']]
  const now = Date.now(), day = 864e5
  names.forEach(([n, c], i) => {
    const k = keyOf(n, c); d.students[k] = { name: n, cls: c, joined: now - 9 * day, demo: true }
    const r = (a, b) => a + ((i * 7 + b * 3) % (b - a + 1))
    const ev = (kind, ref, score, max, ago) => d.events.push({ id: uid(), key: k, kind, ref, score, max, at: now - ago * day, detail: null })
    ev('quiz', 'q4', r(7, 12), 12, 6); ev('quiz', 'q5', r(6, 12), 12, 3)
    if (i % 2 === 0) ev('quiz', 'qx', r(6, 12), 12, 1)
    ev('listen', 'pick', r(5, 8), 8, 5); ev('dict', 'all', r(4, 8), 8, 4); ev('speak', 'read', r(60, 98), 100, 2)
    ev('read', 'r1', r(2, 4), 4, 4); ev('read', 'r3', r(2, 3), 3, 2); ev('build', 'all', r(5, 8), 8, 3)
    ev('grammar', 'g41', 3, 3, 6); ev('grammar', 'g52', r(2, 3), 3, 3); ev('vocab', 'u4', r(4, 6), 6, 6)
  })
  const k1 = keyOf('ريم العتيبي', '2/1'), k2 = keyOf('جود الغامدي', '2/2')
  d.writings.push({ id: uid(), key: k1, name: 'ريم العتيبي', cls: '2/1', task: 'w1', at: now - 2 * day, feedback: null,
    text: 'My favorite pastime is calligraphy. I need a special pen and good paper. I practice three times a week after school. I usually write in my room, and sometimes my mother helps me. I enjoy writing Arabic letters because it makes me calm and happy. I want to learn more styles next year.' })
  d.writings.push({ id: uid(), key: k2, name: 'جود الغامدي', cls: '2/2', task: 'w2', at: now - 1 * day, feedback: { stars: 4, comment: 'Great steps! Add one more quantity.', at: now - 0.5 * day },
    text: 'Ingredients: two cups of rice, a chicken, two onions, some tomatoes and some spices. Steps: First, chop the onions and fry them. Then, add the chicken and the tomatoes. Next, boil some water and add the rice. Finally, cook it for 30 minutes.' })
  d.announcements.push({ id: uid(), text: 'Welcome to Lingo Lane! اختبار الوحدة الرابعة متاح الآن، بالتوفيق يا بطلات.', at: now - day })
}
