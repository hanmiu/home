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

function buildRandomCurve(start, end, n, steps = 50, radius = 200) {
  let hull, hull2, pts, trail;
  hull = [];
  for(let i = 0; i < n; i++) {
    let t = i / (n - 1);
    let dx = 0;
    let dy = 0;
    if(i > 0 && i < n - 1) {
      dx = (Math.random()*2-1) * radius;
      dy = (Math.random()*2-1) * radius;
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
    for(let j = 0; j < steps; j++) {
      let t = j / (steps - 1);
      let p = pointInQuadraticBezier(a, b, c, t);
      pts.push([p[0], p[1]]);
    }
  }
  
  return pts;
}

function rand(min, max) {
  return min + (max - min) * Math.random();
};

function randi(min, max) {
  return Math.floor(rand(min, max));
};

function hue_to_rgb(m1, m2, h) {
  if(h < 0) h = h + 1;
  if(h > 1) h = h - 1;
  if(h * 6 < 1) return m1 + (m2 - m1) * h * 6;
  if(h * 2 < 1) return m2;
  if(h * 3 < 2) return m1 + (m2 - m1) * (2 / 3 - h) * 6;
  return m1;
};

function hsl_to_rgb(h, s, l) {
  h = h / 360;
  s = s / 100;
  l = l / 100;
  var r, g, b, m1, m2;

  if(l <= 0.5) {
    m2 = l * (s + 1);
  }
  else {
    m2 = l + s - l * s;
  }
  m1 = l * 2 - m2;
  r = hue_to_rgb(m1, m2, h + 1 / 3);
  g = hue_to_rgb(m1, m2, h);
  b = hue_to_rgb(m1, m2, h - 1 / 3);
  return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
};

function rgb_to_hsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if(max == min){
    h = s = 0;
  }
  else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max){
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.floor(h * 360), Math.floor(s * 100), Math.floor(l * 100)];
};

function length(p) {
  return Math.sqrt(p.x*p.x + p.y*p.y);
}

function distance(p0, p1) {
  var dx = p1.x - p0.x;
  var dy = p1.y - p0.y;
  return Math.sqrt(dx*dx + dy*dy);  
}

function clamp(x, a, b) {
  return Math.min(Math.max(a, x), b);
}

function step(a, x) {
  return x >= a ? 1 : 0;
}

function smoothstep(a, b, x) {
  x = clamp((x - a)/(b - a), 0.0, 1.0); 
  return x*x*(3 - 2*x);
}

function motor(min, max, time) {
  var t = 0.5 + 0.5 * Math.sin(time);
  return mix(min, max, t);
}

function rotate_from_origin(origin, target, r, angle) {
  target.x = origin.x + r * Math.cos(angle);
  target.y = origin.y + r * Math.sin(angle);
}

function preserve(p0, p1, len) {
  var dx = p1.x - p0.x;
  var dy = p1.y - p0.y;
  var d = Math.sqrt(dx*dx + dy*dy);
  if(d > 0) {
    var ux = dx / d;
    var uy = dy / d;
    var dl = len - d;
    p0.x += -dl * ux * 0.5;
    p0.y += -dl * uy * 0.5;
    p1.x += dl * ux * 0.5;
    p1.y += dl * uy * 0.5;
  }
}