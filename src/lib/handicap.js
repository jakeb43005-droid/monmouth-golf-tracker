export function toDifferential(strokes, courseRating, slope) {
  const cr = Number(courseRating)
  const sl = Number(slope)
  const strks  = Number(strokes)
  if (!isFinite(cr) || !isFinite(sl) || !isFinite(strks) || sl <= 0) return null
  return ((strks - cr) * 113) / sl
}
export function computeIndex(diffs) {
  const clean = diffs.filter(d => typeof d == 'number' && isFinite(d))
  if (clean.length < 5) return null
  const take = clean.length >= 20 ? 8 : Math.ceil(clean.length * 0.4)
  const sorted = [...clean].sort((a,b) => a - b).slice(0, take)
  const avg = sorted.reduce((s,x)=>s+x,0) / sorted.length
  return Math.round(avg * 10) / 10 
}