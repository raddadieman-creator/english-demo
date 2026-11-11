// نطق ذاتي بصوت إنجليزي + تمييز كلام الطالب (حيث يدعمه المتصفح) + تسجيل صوتي
let voice = null
function pickVoice() {
  if (!('speechSynthesis' in window)) return null
  const vs = speechSynthesis.getVoices()
  const pref = ['Samantha', 'Google US English', 'Microsoft Aria', 'Microsoft Jenny', 'Karen', 'Moira', 'Google UK English Female']
  for (const p of pref) { const v = vs.find((x) => x.name.includes(p)); if (v) return v }
  return vs.find((x) => x.lang === 'en-US') || vs.find((x) => x.lang && x.lang.startsWith('en')) || null
}
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  speechSynthesis.onvoiceschanged = () => { voice = pickVoice() }
  voice = pickVoice()
}
export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window
export function speak(text, slow = false) {
  return new Promise((res) => {
    if (!canSpeak()) return res()
    speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'; u.rate = slow ? 0.62 : 0.92; u.pitch = 1.05
    if (!voice) voice = pickVoice()
    if (voice) u.voice = voice
    const t = setTimeout(res, 1500 + text.length * (slow ? 160 : 110))
    u.onend = () => { clearTimeout(t); res() }; u.onerror = () => { clearTimeout(t); res() }
    speechSynthesis.speak(u)
  })
}
export const stopSpeak = () => { if (canSpeak()) speechSynthesis.cancel() }

const SR = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null
export const canListen = () => Boolean(SR)
export function listen(timeoutMs = 8000) {
  return new Promise((res, rej) => {
    if (!SR) return rej(new Error('unsupported'))
    const r = new SR(); r.lang = 'en-US'; r.interimResults = false; r.maxAlternatives = 3
    let done = false
    const t = setTimeout(() => { try { r.stop() } catch {} }, timeoutMs)
    r.onresult = (e) => { done = true; clearTimeout(t); res([...e.results[0]].map((a) => a.transcript)) }
    r.onerror = (e) => { clearTimeout(t); if (!done) rej(new Error(e.error || 'error')) }
    r.onend = () => { clearTimeout(t); if (!done) rej(new Error('no-speech')) }
    r.start()
  })
}

const norm = (s) => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' ]+/g, ' ').split(/\s+/).filter(Boolean)
// مقارنة كلمة بكلمة (أطول تسلسل مشترك) لإظهار الكلمات الصحيحة والفائتة
export function compare(target, heardList) {
  const T = norm(target)
  let bestR = null
  for (const h of heardList) {
    const H = norm(h)
    const L = Array.from({ length: T.length + 1 }, () => new Array(H.length + 1).fill(0))
    for (let i = T.length - 1; i >= 0; i--) for (let j = H.length - 1; j >= 0; j--) L[i][j] = T[i] === H[j] ? 1 + L[i + 1][j + 1] : Math.max(L[i + 1][j], L[i][j + 1])
    const ok = new Array(T.length).fill(false)
    let i = 0, j = 0
    while (i < T.length && j < H.length) { if (T[i] === H[j]) { ok[i] = true; i++; j++ } else if (L[i + 1][j] >= L[i][j + 1]) i++; else j++ }
    const score = Math.round((ok.filter(Boolean).length / Math.max(T.length, 1)) * 100)
    if (!bestR || score > bestR.score) bestR = { score, words: T.map((w, k) => ({ w, ok: ok[k] })), heard: h }
  }
  return bestR
}

export async function record(ms = 15000) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const rec = new MediaRecorder(stream); const chunks = []
  rec.ondataavailable = (e) => chunks.push(e.data)
  const stopped = new Promise((r) => { rec.onstop = r })
  rec.start()
  const timer = setTimeout(() => rec.state !== 'inactive' && rec.stop(), ms)
  return {
    stop: async () => { clearTimeout(timer); if (rec.state !== 'inactive') rec.stop(); await stopped; stream.getTracks().forEach((t) => t.stop()); return URL.createObjectURL(new Blob(chunks, { type: rec.mimeType || 'audio/webm' })) },
  }
}
