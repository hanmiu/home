/* '일곱 살, 활짝 핀 놀이' 머리글 배경 — 디테일 꾸미기의 방식(도형 하나에서 중심→바깥으로, 되풀이)을 따른 파스텔 붓 꽃(묽은 칠 + 마른 붓 선, 꽃잎마다 조금씩 다름). 어린이 작품이 아니라 그 방식을 따른 그림.
   제목·부제 자리는 비우고 가장자리에만. 들어올 때 한 번 피어나고 멈춤. 움직임 줄이기면 완성본만. 스크립트가 없으면 크림 머리글 그대로. 이 파일 하나만 빼면 원래대로. */
(function () {
  var hero = document.querySelector(".page-hero");
  if (!hero) return;
  var cv = document.createElement("canvas"), g = cv.getContext("2d");
  if (!g) return;
  hero.style.position = "relative"; hero.style.overflow = "hidden";
  cv.setAttribute("aria-hidden", "true");
  cv.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:0";
  hero.insertBefore(cv, hero.firstChild);
  [].forEach.call(hero.children, function (c) { if (c !== cv) { c.style.position = "relative"; c.style.zIndex = "1"; } });
  var calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var TONES = [  // 칠(옅게), 선(조금 진하게)
    ["#F9D9DE", "#E9AEB9"], ["#FBEBB8", "#E8CF82"], ["#D5EEDA", "#A3D3AE"], ["#D6E8F7", "#A5C8E6"], ["#E3DAF5", "#BDAEE3"], ["#FBDFC8", "#EDBC94"]
  ];
  var R = Math.random, DUR = 6000, flowers = [], W = 0, H = 0;
  function pick(a) { return a[Math.floor(R() * a.length)]; }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(R() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  // ---- 붓: 모양은 점 목록으로. 칠은 조금씩 어긋난 묽은 층을 겹치고(수채), 선은 털 여러 가닥이 끊기며 지나감(마른 붓)
  function rgba(hex, a) { var n = parseInt(hex.slice(1), 16); return "rgba(" + (n >> 16) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")"; }
  function wash(c, pts, hex, amt) {
    for (var k = 0; k < 7; k++) {
      c.beginPath();
      for (var i = 0; i < pts.length; i++) {
        var x = pts[i][0] + (R() - 0.5) * amt * (1 + k * 0.28), y = pts[i][1] + (R() - 0.5) * amt * (1 + k * 0.28);
        c[i ? "lineTo" : "moveTo"](x, y);
      }
      c.closePath(); c.fillStyle = rgba(hex, 0.10 + R() * 0.07); c.fill();
    }
  }
  function brush(c, pts, hex, w, closed) {
    var list = closed ? pts.concat([pts[0]]) : pts, n = list.length, hairs = Math.max(4, Math.round(w * 4));
    c.lineCap = "round"; c.lineJoin = "round";
    for (var h = 0; h < hairs; h++) {
      var off = (R() - 0.5) * w, drift = 0, seg = false;
      c.beginPath();
      for (var i = 0; i < n; i++) {
        var a = list[Math.max(i - 1, 0)], b = list[Math.min(i + 1, n - 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.sqrt(dx * dx + dy * dy) || 1;
        var taper = closed ? 1 : Math.min(1, Math.sin(3.1416 * (i + 0.5) / n) * 1.5);
        drift += (R() - 0.5) * 0.25; drift *= 0.92;
        var o = (off + drift) * taper, x = list[i][0] - dy / l * o, y = list[i][1] + dx / l * o;
        if (R() < 0.07) seg = false;                       // 물감이 마른 자리: 잠깐 끊김
        if (seg) c.lineTo(x, y); else { c.moveTo(x, y); seg = true; }
      }
      c.strokeStyle = rgba(hex, 0.16 + R() * 0.3); c.lineWidth = 0.45 + R() * 0.75; c.stroke();
    }
  }
  function curve(p0, p1, p2, p3, n, out) { for (var i = 0; i < n; i++) { var t = i / n, m = 1 - t; out.push([m * m * m * p0[0] + 3 * m * m * t * p1[0] + 3 * m * t * t * p2[0] + t * t * t * p3[0], m * m * m * p0[1] + 3 * m * m * t * p1[1] + 3 * m * t * t * p2[1] + t * t * t * p3[1]]); } return out; }
  function petalPts(r, w, len) { var o = []; curve([0, -r], [w, -r - len * 0.3], [w, -r - len * 0.9], [0, -r - len], 10, o); curve([0, -r - len], [-w, -r - len * 0.9], [-w, -r - len * 0.3], [0, -r], 10, o); return o; }
  function heartPts(cy, s) { var o = []; curve([0, cy - s * 0.25], [s * 0.55, cy - s * 1.05], [s * 1.15, cy - s * 0.2], [0, cy + s * 0.65], 12, o); curve([0, cy + s * 0.65], [-s * 1.15, cy - s * 0.2], [-s * 0.55, cy - s * 1.05], [0, cy - s * 0.25], 12, o); return o; }
  function circlePts(cx, cy, r, n) { var o = []; for (var i = 0; i < n; i++) { var a = i * 6.2832 / n; o.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return o; }
  function polyPts(sides, s) { var o = [], i, j; for (i = 0; i < sides; i++) { var a0 = -1.5708 + i * 6.2832 / sides, a1 = -1.5708 + (i + 1) * 6.2832 / sides; for (j = 0; j < 8; j++) { var t = j / 8; o.push([(Math.cos(a0) * (1 - t) + Math.cos(a1) * t) * s, (Math.sin(a0) * (1 - t) + Math.sin(a1) * t) * s]); } } return o; }
  // 고리 하나를 자기 캔버스에 칠해 둠 — 재생 때는 그림만 얹으므로 가벼움
  function paintRing(q, rad, d) {
    var size = Math.ceil((rad + 12) * 2 * d), cc = document.createElement("canvas"); cc.width = cc.height = size;
    var c = cc.getContext("2d"); c.scale(d, d); c.translate(rad + 12, rad + 12); c.rotate(q.rot);
    var fill = q.tone[0], line = q.tone[1], bw = Math.max(1.2, rad * 0.022), amt = Math.max(1, rad * 0.018), i, pts;
    if (q.kind === "core") {
      pts = q.shape === 2 ? heartPts(q.size * 0.1, q.size * 0.85) : q.shape === 3 || q.shape === 4 ? polyPts(q.shape, q.size * 1.1) : circlePts(0, 0, q.size, 20);
      wash(c, pts, fill, amt); brush(c, pts, line, bw, true); return cc;
    }
    if (q.kind === "line") { brush(c, circlePts(0, 0, q.r, 60), line, bw, true); return cc; }
    if (q.kind === "scallop") {
      var rs = q.r * Math.sin(3.1416 / q.n) * 1.02;
      for (i = 0; i < q.n; i++) { c.save(); c.rotate(i * 6.2832 / q.n + (R() - 0.5) * 0.03); pts = []; for (var j = 0; j <= 10; j++) { var a = 3.1416 + j / 10 * 3.1416; pts.push([Math.cos(a) * rs, -q.r + Math.sin(a) * rs]); } brush(c, pts, line, bw * 0.8, false); c.restore(); }
      return cc;
    }
    for (i = 0; i < q.n; i++) {
      var v = 0.86 + R() * 0.28;                           // 꽃잎마다 크기·각도가 조금씩 다름
      c.save(); c.rotate(i * 6.2832 / q.n + (R() - 0.5) * 0.09);
      if (q.kind === "petal" || q.kind === "double") {
        pts = petalPts(q.r, q.w * v, q.size * v); wash(c, pts, fill, amt); brush(c, pts, line, bw, true);
        if (q.kind === "double") brush(c, petalPts(q.r + q.size * 0.2 * v, q.w * 0.45 * v, q.size * 0.55 * v), line, bw * 0.7, true);
      } else if (q.kind === "heart") { pts = heartPts(-q.r, q.size * 0.55 * v); wash(c, pts, fill, amt); brush(c, pts, line, bw * 0.9, true); }
      else if (q.kind === "dot") { pts = circlePts(0, -q.r, q.size * 0.5 * v, 12); wash(c, pts, fill, amt * 0.7); wash(c, pts, line, amt * 0.5); }
      else if (q.kind === "spoke") { brush(c, [[0, -q.r], [0, -q.r - q.size * 0.25 * v], [0, -q.r - q.size * 0.5 * v], [0, -q.r - q.size * 0.75 * v], [0, -q.r - q.size * v]], line, bw, false); }
      c.restore();
    }
    return cc;
  }
  function makeFlower(x, y, rad, delay) {
    var tones = shuffle(TONES.slice()).slice(0, 3), rings = [], n = pick([6, 7, 8, 9, 10]), r = rad * 0.15;
    rings.push({ kind: "core", shape: pick([0, 2, 3, 4]), size: rad * 0.14, tone: tones[0], rot: R() * 0.4, r: 0, n: 1 });
    var inner = pick(["dot", "line", "spoke"]), plan = [inner, "petal", pick(["line", "scallop"]), R() < 0.55 ? "double" : (R() < 0.5 ? "heart" : "petal"), "dot"], k = 1;
    plan.forEach(function (kind) {
      if (r >= rad * 0.95) return;
      var left = rad - r, size = 0, w = 0, m = n, gap;
      if (kind === "line") { gap = rad * 0.05; r += rad * 0.02; }
      else if (kind === "dot") { size = Math.min(rad * 0.075, left * 0.5); r += size * 0.9; m = n * 2; gap = size * 1.2; }
      else if (kind === "spoke") { size = Math.min(rad * 0.1, left * 0.6); m = n * 2; gap = size + rad * 0.02; }
      else if (kind === "scallop") { m = n * 2; gap = rad * 0.09; r += rad * 0.03; }
      else if (kind === "heart") { size = Math.min(rad * 0.36, left * 0.9); r += size * 0.25; gap = size * 0.72; }
      else { size = Math.min(rad * 0.32, left * 0.95); w = r * Math.sin(3.1416 / n) * 0.95 + size * 0.14; gap = size * 0.82; }
      rings.push({ kind: kind, r: r, size: size, w: w, n: m, tone: tones[k++ % 3], rot: kind === "petal" || kind === "double" ? (k % 2 ? 3.1416 / n : 0) : R() * 0.3 });
      r += gap;
    });
    return { x: x, y: y, rad: rad, rot: R() * 6.2832, rings: rings, delay: delay };
  }
  // 글자 영역과 겹치지 않는 자리: 후보 자리마다 글자 상자까지 거리만큼만 키움
  function layout() {
    var hb = hero.getBoundingClientRect(), boxes = [];
    [].forEach.call(hero.children, function (c) {
      if (c === cv) return;
      var rg = document.createRange(); rg.selectNodeContents(c);
      [].forEach.call(rg.getClientRects(), function (b) { boxes.push({ l: b.left - hb.left, t: b.top - hb.top, r: b.right - hb.left, b: b.bottom - hb.top }); });
    });
    function room(x, y) { var d = 1e9; boxes.forEach(function (b) { var dx = Math.max(b.l - x, 0, x - b.r), dy = Math.max(b.t - y, 0, y - b.b); d = Math.min(d, Math.sqrt(dx * dx + dy * dy)); }); return d - 14; }
    W = hb.width; H = hb.height;
    var wide = W >= 760, slots, list = [], i = 0;
    if (wide) slots = [[0.04, 0.2, 92], [0.13, 0.88, 74], [0.96, 0.14, 84], [0.88, 0.82, 96], [0.02, 0.8, 44], [0.985, 0.62, 40]];
    else slots = [[0.02, 0.1, 44], [0.98, 0.06, 40], [0.96, 0.98, 36], [0.03, 0.98, 32]];
    slots.forEach(function (s) {
      var x = W * s[0] + (R() - 0.5) * W * (wide ? 0.03 : 0.02), y = H * s[1] + (R() - 0.5) * H * 0.1, rad = Math.min(s[2] * (0.85 + R() * 0.3), room(x, y));
      if (rad >= 22) list.push(makeFlower(x, y, rad, 400 * i++ * (wide ? 0.8 : 1)));
    });
    return list;
  }
  function size() {
    var d = DPR = Math.min(devicePixelRatio || 1, 2), b = hero.getBoundingClientRect();
    cv.width = Math.round(b.width * d); cv.height = Math.round(b.height * d);
    g.setTransform(d, 0, 0, d, 0, 0);
  }
  var DPR = 1;
  function draw(t) {
    g.clearRect(0, 0, W, H);
    flowers.forEach(function (f) {
      var span = (DUR - f.delay) / (f.rings.length + 1.5);
      g.save(); g.translate(f.x, f.y); g.rotate(f.rot);
      for (var i = f.rings.length - 1; i >= 0; i--) {      // 바깥 고리부터 얹어야 안쪽이 위로, 피어나는 차례는 안쪽부터
        var q = f.rings[i], p = Math.max(0, Math.min(1, (t - f.delay - i * span) / (span * 2.5)));
        if (p <= 0 || !q.img) continue;
        var e = 1 - Math.pow(1 - p, 3), s = 0.82 + 0.18 * e, half = f.rad + 12;
        g.save(); g.globalAlpha = Math.min(1, p * 1.6); g.rotate((1 - e) * 0.25); g.scale(s, s);
        g.drawImage(q.img, -half, -half, half * 2, half * 2);
        g.restore();
      }
      g.restore();
    });
  }
  function paintAll(done, sync) {                       // 고리를 한 프레임에 조금씩 칠함(페이지가 멈추지 않게)
    var todo = [];
    flowers.forEach(function (f) { f.rings.forEach(function (q) { todo.push([q, f.rad]); }); });
    (function step() {
      var t0 = performance.now();
      while (todo.length && (sync || performance.now() - t0 < 8)) { var it = todo.shift(); it[0].img = paintRing(it[0], it[1], DPR); }
      if (todo.length) setTimeout(step, 0); else done();
    })();
  }
  function start() {
    size(); flowers = layout();
    if (calm) { paintAll(function () { draw(1e9); }, true); return; }
    paintAll(function () {
      var t0 = 0;
      requestAnimationFrame(function frame(now) {
        t0 = t0 || now;
        draw(now - t0);
        if (now - t0 < DUR + 1500) requestAnimationFrame(frame);
      });
    });
  }
  var tid = 0, lastW = 0;
  addEventListener("resize", function () {          // 폭이 바뀔 때만 다시 배치(모바일 주소창 높이 변화는 무시), 다 핀 모습으로
    clearTimeout(tid); tid = setTimeout(function () { var w = hero.getBoundingClientRect().width; if (w === lastW) return; lastW = w; size(); flowers = layout(); paintAll(function () { draw(1e9); }, true); }, 150);
  });
  function go() { lastW = hero.getBoundingClientRect().width; start(); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(go); else go();   // 글자가 자리 잡은 뒤에 칸을 잼
})();
