/* 눈송이 — 먼저 어린이들이 그린 눈송이 하나(2025 입학 브로슈어 표지, 무작위)가 가운데에서 선을 따라 피어나고, 이어서 시뮬레이션 눈송이가 자람.
   시뮬레이션: 육각 격자의 Gravner–Griffeath(2009) 모델. 규칙은 하나, 자라는 동안 지나온 조건(경로)이 달라 매번 다른 모양.
   전체 격자를 계산(대칭 접기 없음)하고 공기 흐름 치우침·작은 흔들림·결함을 넣어 가지마다 조금씩 다름. 그릴 때 회전·기울임으로 축 각도도 60도에서 살짝 벗어남.
   계산은 Web Worker 에서 — 어린이 그림이 피는 동안 끝나므로 그림이 곧 대기 화면. 칸마다 언 시각·두께의 기울기를 텍스처에 담아 한 번만 올리고, 재생 중엔 숫자 하나만 넘김.
   WebGL2 가 없으면 그림 칸을 숨기고 글만. 움직임 줄이기 설정이면 어린이 그림 완성본만(단추로 시뮬레이션과 번갈아). 화면 밖이면 멈춤. */
(function () {
  var fig = document.querySelector(".snow-art");
  if (!fig) return;
  var cv = fig.querySelector("canvas"), btn = fig.querySelector("button");
  var gl = cv.getContext("webgl2", { antialias: false, alpha: false });
  if (!gl) { fig.classList.add("static"); return; }
  var calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var R = 104, SIZE = 2 * R + 7;                  // 시뮬레이션 격자 반지름(칸이 적을수록 결이 굵음)
  var DRAWINGS = ["/stories/img/snow-1.png", "/stories/img/snow-2.png", "/stories/img/snow-3.png"];

  // ---- 시뮬레이션(워커 안에서도, 워커가 안 되면 여기서도 돌 수 있게 독립 함수)
  function makeSim(R, SIZE) {
    var OFF = R + 3, cells = [];
    function dist(q, r) { return Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r)); }
    for (var q = -R; q <= R; q++) for (var r = -R; r <= R; r++) if (dist(q, r) <= R) cells.push([q, r]);
    cells.sort(function (a, b) { return dist(a[0], a[1]) - dist(b[0], b[1]); });   // 안쪽부터(계산을 자란 곳 근처로 한정)
    var N = cells.length, W = 2 * R + 1, index = new Int32Array(W * W).fill(-1), Q = new Int16Array(N), Rr = new Int16Array(N), rad = new Int16Array(N), i, d;
    cells.forEach(function (c, n) { index[(c[0] + R) * W + c[1] + R] = n; Q[n] = c[0]; Rr[n] = c[1]; rad[n] = dist(c[0], c[1]); });
    var radStart = new Int32Array(R + 2);
    for (i = N - 1; i >= 0; i--) radStart[rad[i]] = i;
    radStart[R + 1] = N;
    var D = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, -1], [-1, 1]], nb = new Int32Array(N * 6);
    for (i = 0; i < N; i++) for (d = 0; d < 6; d++) {
      var a = Q[i] + D[d][0], b = Rr[i] + D[d][1];
      nb[i * 6 + d] = dist(a, b) <= R ? index[(a + R) * W + b + R] : -1;
    }
    var TF = new Float32Array(N), rStep = new Int32Array(R + 2), A = new Uint8Array(N), B = new Float32Array(N), C = new Float32Array(N), V = new Float32Array(N), V2 = new Float32Array(N), bd = new Uint8Array(N), G = new Float32Array(N);
    var steps, reach, stages, P, rnd;
    function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
    var KINDS = [
      { rho: [0.42, 0.50], beta: [1.6, 2.4], alpha: [0.1, 0.2], theta: [0.04, 0.08], kappa: [0.002, 0.01], mu: [0.02, 0.06], gamma: [0.00002, 0.0001] },  // 면(판)
      { rho: [0.60, 0.72], beta: [1.2, 1.6], alpha: [0.05, 0.1], theta: [0.02, 0.05], kappa: [0.005, 0.02], mu: [0.01, 0.04], gamma: [0.00002, 0.0001] }   // 가지
    ];
    var NOISE = 0.002;                            // 칸마다 언 양의 흔들림(작은 차이를 모델이 스스로 키움)
    function pick(kind) { var o = {}, k = KINDS[kind]; for (var n in k) o[n] = k[n][0] + (k[n][1] - k[n][0]) * rnd(); return o; }
    function attach(i) {
      A[i] = 1; bd[i] = 0; TF[i] = steps;
      for (var d = 0; d < 6; d++) { var j = nb[i * 6 + d]; if (j >= 0 && !A[j]) bd[j] = 1; }
      if (rad[i] > reach) { for (var q = reach + 1; q <= rad[i]; q++) rStep[q] = steps; reach = rad[i]; }
    }
    function reset(seed) {
      rnd = mulberry(seed);
      var n = 2 + Math.floor(rnd() * 2), kind = 0, k; stages = [];   // 경로: 육각 판에서 시작해 번갈아
      for (k = 0; k <= n; k++) { stages.push(pick(kind)); kind = 1 - kind; }
      // 공기 흐름 치우침 + 수증기가 모자란 자리 한두 곳(결함)
      var phi = rnd() * 6.283, tilt = 0.002 + rnd() * 0.004, dips = [], nd = 1 + Math.floor(rnd() * 2);
      for (k = 0; k < nd; k++) dips.push([rnd() * 6.283, R * (0.35 + rnd() * 0.5), R * (0.10 + rnd() * 0.1), 0.004 + rnd() * 0.008]);
      for (var i = 0; i < N; i++) {
        var x = Q[i] + Rr[i] * 0.5, y = Rr[i] * 0.8660254, l = Math.sqrt(x * x + y * y), g = 1;
        if (l > 0) g += tilt * (x * Math.cos(phi) + y * Math.sin(phi)) / l;
        for (k = 0; k < nd; k++) { var dx = x - dips[k][1] * Math.cos(dips[k][0]), dy = y - dips[k][1] * Math.sin(dips[k][0]); g -= dips[k][3] * Math.exp(-(dx * dx + dy * dy) / (dips[k][2] * dips[k][2])); }
        G[i] = g;
      }
      A.fill(0); B.fill(0); C.fill(0); bd.fill(0); TF.fill(0); rStep.fill(0); V.fill(stages[0].rho); steps = 0; reach = 0;
      attach(0); C[0] = 1; V[0] = 0;
    }
    function params() {
      var f = Math.min(reach / (R * 0.9), 1), k = Math.min(Math.floor(f * (stages.length - 1)), stages.length - 2);
      var t = f * (stages.length - 1) - k; t = t * t * (3 - 2 * t); var o = {}, x = stages[k], y = stages[k + 1];
      for (var n in x) o[n] = x[n] + (y[n] - x[n]) * t;
      P = o;
    }
    function step() {
      params();
      var lim = Math.min(reach + 30, R), end = radStart[lim + 1], i, d, j, sum, v, cnt;
      var rho = P.rho, K = P.kappa, BE = P.beta, AL = P.alpha, TH = P.theta, MU = P.mu, GA = P.gamma;
      for (i = 0; i < end; i++) {                 // 퍼짐: 얼음 이웃은 제 값으로 되돌아옴
        if (A[i]) { V2[i] = 0; continue; }
        v = V[i]; sum = v;
        for (d = 0; d < 6; d++) { j = nb[i * 6 + d]; sum += j < 0 || j >= end ? rho : (A[j] ? v : V[j]); }
        V2[i] = rad[i] >= lim ? rho : sum / 7;
      }
      var T = V; V = V2; V2 = T;
      for (i = 0; i < end; i++) {
        if (!bd[i]) continue;
        v = V[i] * G[i] * (1 + NOISE * (2 * rnd() - 1)); B[i] += (1 - K) * v; C[i] += K * v; V[i] = 0;   // 얼어붙기
        cnt = 0; sum = 0;
        for (d = 0; d < 6; d++) { j = nb[i * 6 + d]; if (j < 0) continue; if (A[j]) cnt++; else sum += V[j]; }
        if ((cnt <= 2 && B[i] >= BE) || (cnt === 3 && (B[i] >= 1 || (sum < TH && B[i] >= AL))) || cnt >= 4) { C[i] += B[i]; B[i] = 0; attach(i); continue; }  // 달라붙기
        V[i] += MU * B[i] + GA * C[i]; B[i] *= 1 - MU; C[i] *= 1 - GA;   // 녹기
      }
      steps++;
    }
    return function compute(seed) {               // 끝까지 계산해 텍스처 자료를 돌려줌: r=언 시각(0~1, 빈칸 2), g=얼음, ba=두께 기울기
      reset(seed);
      while (reach < R * 0.92 && steps < 200000) step();
      var buf = new Float32Array(SIZE * SIZE * 4), hh = new Float32Array(SIZE * SIZE), p, i;
      for (p = 0; p < SIZE * SIZE; p++) buf[p * 4] = 2;
      for (i = 0; i < N; i++) if (A[i]) {
        p = (Rr[i] + OFF) * SIZE + Q[i] + OFF;
        buf[p * 4] = TF[i] / steps; buf[p * 4 + 1] = 1; hh[p] = 0.25 + 1.1 * C[i];
      }
      var h2 = new Float32Array(SIZE * SIZE), r, q;           // 두께를 한 번 뭉개 잔 능선을 줄임(얼음 밖은 그대로 0)
      for (r = 1; r < SIZE - 1; r++) for (q = 1; q < SIZE - 1; q++) {
        p = r * SIZE + q; if (!hh[p]) continue;
        var sm = hh[p] * 2, nn = 2;
        [1, -1, SIZE, -SIZE, SIZE - 1, 1 - SIZE].forEach(function (o) { if (hh[p + o]) { sm += hh[p + o]; nn++; } });
        h2[p] = sm / nn;
      }
      hh = h2;
      for (r = 1; r < SIZE - 1; r++) for (q = 1; q < SIZE - 1; q++) {
        p = r * SIZE + q;
        var gx = (hh[p + 1] - hh[p - 1]) * 0.5, dr = (hh[p + SIZE] - hh[p - SIZE]) * 0.5;
        buf[p * 4 + 2] = gx; buf[p * 4 + 3] = (dr - 0.5 * gx) / 0.8660254;
      }
      return { buf: buf, rStep: rStep.slice(), steps: steps, reach: reach };
    };
  }

  var worker = null, simLocal = null, simId = 0;
  function requestSim(seed, cb) {                 // 계산 요청 — 나중 요청이 오면 앞의 것은 버림
    var id = ++simId;
    if (worker) worker.terminate();
    worker = null;
    try {
      var src = "var compute=(" + makeSim + ")(" + R + "," + SIZE + ");onmessage=function(e){var o=compute(e.data);postMessage(o,[o.buf.buffer,o.rStep.buffer]);};";
      worker = new Worker(URL.createObjectURL(new Blob([src], { type: "text/javascript" })));
      worker.onmessage = function (e) { if (id === simId) cb(e.data); };
      worker.onerror = function () { if (id === simId) local(); };
      worker.postMessage(seed);
    } catch (err) { local(); }
    function local() { setTimeout(function () { if (id !== simId) return; simLocal = simLocal || makeSim(R, SIZE); cb(simLocal(seed)); }, 0); }
  }

  // ---- 그리기
  var VS = "#version 300 es\nin vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
  var HEAD = "#version 300 es\nprecision highp float;precision highp sampler2D;out vec4 o;const vec3 PAPER=vec3(0.984,0.969,0.933);";
  var FS = HEAD + "uniform sampler2D T;uniform float uT,R0,OFF;uniform vec2 res;uniform mat2 M;" +
    // 회전·기울임(M) 뒤 축 좌표에서 이중 선형으로 읽음
    "void main(){vec2 v=M*((gl_FragCoord.xy-0.5*res)/(0.5*res.y))*R0;float rr=v.y/0.8660254;vec2 c=vec2(v.x-rr*0.5,rr)+OFF;vec2 f=fract(c);ivec2 i=ivec2(floor(c));" +
    "vec4 t=mix(mix(texelFetch(T,i,0),texelFetch(T,i+ivec2(1,0),0),f.x),mix(texelFetch(T,i+ivec2(0,1),0),texelFetch(T,i+ivec2(1,1),0),f.x),f.y);" +
    // 언 시각이 지금(uT)보다 앞선 칸만 보임, 자라는 끝선은 먹선으로
    "float w0=clamp(fwidth(t.r),0.0008,0.012);float past=uT-t.r;float front=smoothstep(-w0,w0,past);float ice=smoothstep(0.35,0.65,t.g)*front;" +
    "float bend=clamp(length(t.ba)*1.5,0.,1.);bend=max(bend,uT<1.0?(1.0-smoothstep(0.,w0*2.5,past))*front:0.);" +
    "vec3 ic=mix(vec3(0.965,0.975,1.0),vec3(0.753,0.804,0.953),smoothstep(0.02,0.30,bend));ic=mix(ic,vec3(0.17,0.23,0.58),smoothstep(0.30,0.95,bend));" +
    "o=vec4(mix(PAPER,ic,ice),1.0);}";
  // 어린이 그림: C=크림 바탕에 얹은 그림, D=가운데에서 선을 따라 잰 거리(0~1). uT 까지 번져 나감, uF 는 사라질 때
  var FS2 = HEAD + "uniform sampler2D C,D;uniform float uT,uF;uniform vec2 res,fit;" +
    "void main(){vec2 u=(gl_FragCoord.xy-0.5*res)/res.y;u=vec2(0.5+u.x*fit.x,0.5-u.y*fit.y);" +
    "if(u.x<0.||u.y<0.||u.x>1.||u.y>1.){o=vec4(PAPER,1.);return;}" +
    "float r=smoothstep(0.,0.06,uT*1.06-texture(D,u).r);o=vec4(mix(PAPER,texture(C,u).rgb,r*uF),1.);}";
  function sh(t, c) { var o = gl.createShader(t); gl.shaderSource(o, c); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(o); return o; }
  function prog(fs) {
    var p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
    gl.bindAttribLocation(p, 0, "p"); gl.linkProgram(p); return p;
  }
  var pS = prog(FS), pD = prog(FS2);
  function loc(p, names) { var o = {}; names.forEach(function (n) { o[n] = gl.getUniformLocation(p, n); }); return o; }
  var uS = loc(pS, ["T", "uT", "R0", "OFF", "res", "M"]), uD = loc(pD, ["C", "D", "uT", "uF", "res", "fit"]);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  function newTex(unit, filter) {
    var t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }
  newTex(0, gl.NEAREST); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, SIZE, SIZE, 0, gl.RGBA, gl.FLOAT, null);
  var texC = newTex(1, gl.LINEAR), texD = newTex(2, gl.LINEAR);

  function size(full) {
    var w = Math.round(cv.clientWidth * Math.min(devicePixelRatio || 1, 2)); if (!full) w = Math.min(w, 768);
    if (cv.width !== w) { cv.width = w; cv.height = w; }
    gl.viewport(0, 0, w, w);
  }
  function blank() { size(); gl.clearColor(0.984, 0.969, 0.933, 1); gl.clear(gl.COLOR_BUFFER_BIT); }

  // 어린이 그림 불러오기 + 거리 계산(그림당 한 번). 칠한 곳은 빨리, 빈 곳은 느리게 — 끊긴 선도 가까운 순서로 나타남
  var loaded = {};
  function loadDrawing(url, cb) {
    if (loaded[url]) return cb(loaded[url]);
    var im = new Image();
    im.onerror = function () { cb(null); };
    im.onload = function () {
      var w = im.naturalWidth, h = im.naturalHeight, c = document.createElement("canvas"); c.width = w; c.height = h;
      var x = c.getContext("2d", { willReadFrequently: true });
      x.drawImage(im, 0, 0);
      var a = x.getImageData(0, 0, w, h).data, n = w * h, cost = new Float32Array(n), dd = new Float32Array(n).fill(1e9), mx = 0, my = 0, ms = 0, i, px, py;
      for (py = 0; py < h; py++) for (px = 0; px < w; px++) { i = py * w + px; var al = a[i * 4 + 3]; cost[i] = al > 40 ? 1 : 6; mx += px * al; my += py * al; ms += al; }
      dd[Math.round(my / ms) * w + Math.round(mx / ms)] = 0;
      var NB = [[-1, 0, 1], [0, -1, 1], [-1, -1, 1.414], [1, -1, 1.414]];
      for (var it = 0; it < 4; it++) {            // 앞뒤로 훑기(빠른 근사 최단 거리)
        for (py = 0; py < h; py++) for (px = 0; px < w; px++) relax(px, py, 1);
        for (py = h - 1; py >= 0; py--) for (px = w - 1; px >= 0; px--) relax(px, py, -1);
      }
      function relax(px, py, sg) {
        var i = py * w + px, best = dd[i];
        for (var k = 0; k < 4; k++) {
          var ax = px + NB[k][0] * sg, ay = py + NB[k][1] * sg;
          if (ax < 0 || ay < 0 || ax >= w || ay >= h) continue;
          var v = dd[ay * w + ax] + NB[k][2] * cost[i];
          if (v < best) best = v;
        }
        dd[i] = best;
      }
      var top = 0; for (i = 0; i < n; i++) if (a[i * 4 + 3] > 40 && dd[i] > top) top = dd[i];
      var bytes = new Uint8Array(n); for (i = 0; i < n; i++) bytes[i] = Math.min(255, 255 * dd[i] / top);
      x.globalCompositeOperation = "source-over"; x.clearRect(0, 0, w, h); x.fillStyle = "rgb(251,247,238)"; x.fillRect(0, 0, w, h); x.drawImage(im, 0, 0);
      loaded[url] = { canvas: c, bytes: bytes, w: w, h: h };
      cb(loaded[url]);
    };
    im.src = url;
  }
  function useDrawing(d) {
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, texC); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, d.canvas);
    gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, texD); gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, d.w, d.h, 0, gl.RED, gl.UNSIGNED_BYTE, d.bytes);
    gl.useProgram(pD); gl.uniform1i(uD.C, 1); gl.uniform1i(uD.D, 2);
    var big = Math.max(d.w, d.h) / 0.94;           // 긴 쪽이 칸의 94%
    gl.uniform2f(uD.fit, big / d.w, big / d.h);
  }
  function drawDrawing(t, fade, full) {
    size(full); gl.useProgram(pD); gl.uniform1f(uD.uT, t); gl.uniform1f(uD.uF, fade); gl.uniform2f(uD.res, cv.width, cv.height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  var sim = null;
  function useSim(s) {
    sim = s;
    gl.activeTexture(gl.TEXTURE0); gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, SIZE, SIZE, gl.RGBA, gl.FLOAT, s.buf);
    gl.useProgram(pS); gl.uniform1i(uS.T, 0); gl.uniform1f(uS.R0, R * 1.06); gl.uniform1f(uS.OFF, R + 3);
    // 회전 + 살짝 기울여 본 시점: 축 사이 각도가 60도에서 조금 벗어남
    var a = Math.random() * 6.283, b = Math.random() * 6.283, e = 0.008 + Math.random() * 0.017, cb_ = Math.cos(b), sb = Math.sin(b), ca = Math.cos(a), sa = Math.sin(a);
    var m00 = cb_ * cb_ * (1 + e) + sb * sb * (1 - e), m01 = cb_ * sb * 2 * e, m11 = sb * sb * (1 + e) + cb_ * cb_ * (1 - e);   // 대칭 늘임
    gl.uniformMatrix2fv(uS.M, false, [ca * m00 - sa * m01, sa * m00 + ca * m01, ca * m01 - sa * m11, sa * m01 + ca * m11]);
  }
  function drawSim(u, full) {
    size(full); gl.useProgram(pS); gl.uniform1f(uS.uT, u); gl.uniform2f(uS.res, cv.width, cv.height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  // 재생 위치 p(0~1) → 언 시각: 끝이 고른 빠르기로 뻗어 나가도록 '반지름에 닿은 걸음' 표로 바꿈
  function timeAt(p) {
    var x = p * sim.reach, a = Math.floor(x), b = Math.min(a + 1, sim.reach);
    return p >= 1 ? 1.0001 : (sim.rStep[a] + (sim.rStep[b] - sim.rStep[a]) * (x - a)) / sim.steps;
  }

  // ---- 순서: 어린이 그림 피기 → 잠시 머묾(계산이 끝날 때까지) → 사라짐 → 시뮬레이션 자람
  var BLOOM = 7000, HOLD = 1800, FADE = 700, GROW = 20000;
  var seen = true, raf = 0, phase = "", clock = 0, last = 0, gen = 0, lastPick = -1, calmSim = false;
  function go(t) { phase = t; clock = 0; last = performance.now(); }
  function kick() { if (!raf && seen) raf = requestAnimationFrame(frame); }
  function frame(now) {
    raf = 0;
    if (!seen) return;
    clock += Math.min(now - last, 50); last = now;
    if (phase === "bloom") { drawDrawing(Math.min(clock / BLOOM, 1), 1); if (clock >= BLOOM) go("hold"); }
    else if (phase === "hold") { if (clock >= HOLD && pending) { useSim(pending); pending = null; go(hasDrawing ? "fade" : "play"); } }
    else if (phase === "fade") { drawDrawing(1, Math.max(1 - clock / FADE, 0)); if (clock >= FADE) { blank(); go("play"); } }
    else if (phase === "play") {
      var p = Math.min(clock / GROW, 1);
      if (p >= 1) { phase = "done"; drawSim(1.0001, true); return; }
      drawSim(timeAt(p));
    } else return;
    raf = requestAnimationFrame(frame);
  }
  var pending = null, hasDrawing = false;
  function pickDrawing() {
    var i = Math.floor(Math.random() * DRAWINGS.length);
    if (i === lastPick) i = (i + 1) % DRAWINGS.length;
    lastPick = i; return DRAWINGS[i];
  }
  function start() {
    var me = ++gen, seed = Date.now() % 2147483647;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    phase = ""; pending = null; hasDrawing = false; blank();                    // 이전 눈송이를 바로 지움
    if (calm) {                                   // 움직임 줄이기: 완성본만, 단추로 번갈아
      if (calmSim) requestSim(seed, function (s) { if (me === gen) { useSim(s); drawSim(1.0001, true); } });
      else loadDrawing(pickDrawing(), function (d) { if (me === gen && d) { useDrawing(d); drawDrawing(1, 1, true); } });
      calmSim = !calmSim; return;
    }
    requestSim(seed, function (s) { if (me === gen) pending = s; });            // 어린이 그림이 피는 동안 뒤에서 계산
    loadDrawing(pickDrawing(), function (d) {
      if (me !== gen) return;
      if (d) { useDrawing(d); hasDrawing = true; go("bloom"); } else { go("hold"); clock = HOLD; } // 그림을 못 불러오면 바로 시뮬레이션
      kick();
    });
  }
  new IntersectionObserver(function (e) {
    seen = e[0].isIntersecting;
    if (seen && phase && phase !== "done") { last = performance.now(); kick(); }
  }, { threshold: 0.35 }).observe(cv);            // 글 아래쪽으로 옮겨서: 어느 정도 보일 때 피어나기 시작
  addEventListener("resize", function () { if (phase === "done") drawSim(1.0001, true); });
  btn.addEventListener("click", start);
  start();
})();
