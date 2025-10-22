const ACTUAL_KEY = '__actual__';
const store = new Map();

function toKey(ply) {
  return Number.isFinite(ply) ? ply : null;
}

function toBucket(ply) {
  const key = toKey(ply);
  if (key == null) return null;
  if (!store.has(key)) {
    store.set(key, new Map());
  }
  return store.get(key);
}

function cloneRecord(record) {
  if (!record) return null;
  return {
    ply: record.ply,
    san: record.san,
    uci: record.uci,
    evalCp: record.evalCp,
    deltaVsBestCp: record.deltaVsBestCp,
    epPlayed: record.epPlayed,
    epBest: record.epBest,
    tag: record.tag,
    baseline: record.baseline,
    isMate: record.isMate,
    mateDepth: record.mateDepth,
    deltaLabel: record.deltaLabel,
    evalLabel: record.evalLabel
  };
}

export function classifyMoveReadonly(ply, uci) {
  const key = toKey(ply);
  if (key == null || !store.has(key)) return null;
  const bucket = store.get(key);
  if (!bucket || !bucket.size) return null;
  const normalized = typeof uci === 'string' && uci ? uci : ACTUAL_KEY;
  const record = bucket.get(normalized) || (uci ? null : bucket.get(ACTUAL_KEY));
  return cloneRecord(record);
}

export function recordMoveClassification(ply, uci, data) {
  const bucket = toBucket(ply);
  if (!bucket) return;
  const normalized = typeof uci === 'string' && uci ? uci : ACTUAL_KEY;
  if (!data) {
    bucket.delete(normalized);
    return;
  }
  bucket.set(normalized, {
    ply: data.ply,
    san: data.san,
    uci: data.uci,
    evalCp: data.evalCp,
    deltaVsBestCp: data.deltaVsBestCp,
    epPlayed: data.epPlayed,
    epBest: data.epBest,
    tag: data.tag,
    baseline: data.baseline,
    isMate: data.isMate,
    mateDepth: data.mateDepth,
    deltaLabel: data.deltaLabel,
    evalLabel: data.evalLabel
  });
}

export function clearMoveClassifications() {
  store.clear();
}
