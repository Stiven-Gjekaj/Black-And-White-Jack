/** Utility helpers */

export const RNG = {
  /** Return integer in [0, max) */
  int(max) {
    return Math.floor(Math.random() * max);
  },
  /** Shuffle array in-place using Fisher–Yates */
  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
};

export function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

export function formatCurrency(cents) {
  return `$${(cents/100).toFixed(2)}`;
}

export function loadFromStorage(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function wait(ms) {
  return new Promise(res => setTimeout(res, ms));
}
