export function lerp(a, b, percent) {
  return a + (b - a) * percent;
}

export function randInRange(a, b) {
  return lerp(a, b, Math.random());
}