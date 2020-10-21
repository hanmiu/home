function mix(a, b, t) {
  return (1 - t) * a + t * b;
}

function pointInQuadraticBezier(a, b, c, t) {
  let ab = [
      mix(a[0], b[0], t),
      mix(a[1], b[1], t)
  ];
  let bc = [
      mix(b[0], c[0], t),
      mix(b[1], c[1], t)
  ];
  return [
      mix(ab[0], bc[0], t),
      mix(ab[1], bc[1], t)
  ];
}

function buildRandomCurve(start, end, n) {
  let hull, hull2, pts, trail;
  hull = [];
  for(let i = 0; i < n; i++) {
    let t = i / (n - 1);
    let dx = 0;
    let dy = 0;
    if(i > 0 && i < n - 1) {
      dx = (Math.random()*2-1) * 200;
      dy = (Math.random()*2-1) * 200;
    }
    let p = [
      mix(start[0], end[0], t) + dx,
      mix(start[1], end[1], t) + dy
    ];
    hull.push(p);
  }
  
  hull2 = [];
  for(let i = 0; i < hull.length; i++) {
    let a, b, c;
    a = hull[i];
    if(i < hull.length - 1) {
      c = hull[i + 1];
      b = [
        (a[0] + c[0]) * 0.5,
        (a[1] + c[1]) * 0.5 
      ];
    }
    hull2.push([a[0], a[1]]);
    if(i > 0 && i < hull.length - 2) {
      hull2.push([b[0], b[1]]);
    }
  }

  pts = [];
  for(let i = 0; i < hull2.length - 1; i += 2) {
    let a = hull2[i];
    let b = hull2[i + 1];
    let c = hull2[i + 2];
    let n = 50;
    for(let j = 0; j < n; j++) {
      let t = j / (n - 1);
      let p = pointInQuadraticBezier(a, b, c, t);
      pts.push([p[0], p[1]]);
    }
  }
  
  return pts;
}