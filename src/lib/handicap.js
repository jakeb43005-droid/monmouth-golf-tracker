export function toDifferential(strokes, courseRating, slope) {
  const cr = Number(courseRating)
  const sl = Number(slope)
  const strks  = Number(strokes)
  if (!isFinite(cr) || !isFinite(sl) || !isFinite(strks) || sl <= 0) return null
  return ((strks - cr) * 113) / sl
}

export function computeIndex(diffs) {
  const clean = diffs.filter(d => typeof d === 'number' && isFinite(d)).sort((a,b)=>a-b)
  const n = clean.length
  if (n < 3) return null

  let take = 0, adjust = 0
  if (n === 3) { take = 1; adjust = -2.0 }
  else if (n === 4) { take = 1; adjust = -1.0 }
  else if (n === 5) { take = 1 }
  else if (n <= 8) { take = 2 }
  else if (n <= 11) { take = 3 }
  else if (n <= 14) { take = 4 }
  else if (n <= 16) { take = 5 }
  else if (n <= 18) { take = 6 }
  else if (n === 19) { take = 7 }
  else { take = 8 } // n >= 20

  const avg = clean.slice(0, take).reduce((s,x)=>s+x,0) / take
  return Math.round((avg + adjust) * 10) / 10
}