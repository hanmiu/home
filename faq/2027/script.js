/* 크게 보기: 페이지 위에 띄우고 ✕·바깥·뒤로 가기로 닫음 / 질문 링크 복사 */
(function () {
  var d = document.getElementById("zoom"), im = d.querySelector("img"), toast = document.getElementById("toast");
  if (!d.showModal) return;
  function close() { if (d.open) d.close(); }
  document.querySelectorAll("a[data-zoom]").forEach(function (a) {
    a.addEventListener("click", function (ev) {
      ev.preventDefault();
      im.src = a.href; im.alt = a.querySelector("img").alt;
      d.showModal(); history.pushState({ zoom: 1 }, "");
    });
  });
  d.addEventListener("click", function (ev) { if (ev.target === d || ev.target.classList.contains("close")) history.back(); });
  d.addEventListener("cancel", function (ev) { ev.preventDefault(); history.back(); });
  window.addEventListener("popstate", close);
  document.querySelectorAll("a[data-copy]").forEach(function (a) {
    a.addEventListener("click", function (ev) {
      if (!navigator.clipboard) return;
      ev.preventDefault();
      navigator.clipboard.writeText(location.origin + location.pathname + a.getAttribute("href")).then(function () {
        toast.textContent = "링크를 복사했습니다"; toast.className = "show";
        setTimeout(function () { toast.className = ""; }, 1800);
      });
    });
  });
})();

/* 화살표: 선은 화살촉 길이만큼 덜 그리고, 화살촉 밑변을 선 끝에 붙여 촉 끝이 원래 끝점에 옴.
   방향은 그 지점의 접선. 그리는 동안 화살촉이 선 끝을 따라 움직임(양방향은 시작 쪽도 같은 방식).
   스크립트가 없으면 SVG marker(끝 접선 방향) 그대로 */
var NS = "http://www.w3.org/2000/svg";
var calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
function head(p, L, hw) {
  var h = document.createElementNS(NS, "path");
  h.setAttribute("d", "M" + L + ",0 L0," + (-hw) + " L0," + hw + " Z");    // 밑변이 원점, 촉 끝이 +L
  h.setAttribute("fill", p.getAttribute("stroke"));
  p.parentNode.insertBefore(h, p.nextSibling);
  return h;
}
function setup(p) {
  if (p._len !== undefined) return;
  p.removeAttribute("pathLength");
  p._len = p.getTotalLength();
  var w = parseFloat(p.getAttribute("stroke-width")) || 3;
  p._L = Math.max(9, w * 2.6); p._hw = Math.max(4.5, w * 1.7);
  if (p.getAttribute("marker-end")) { p.removeAttribute("marker-end"); p._he = head(p, p._L, p._hw); }
  if (p.getAttribute("marker-start")) { p.removeAttribute("marker-start"); p._hs = head(p, p._L, p._hw); }
}
function tangent(p, l) {
  var a = p.getPointAtLength(Math.max(0, l - .6)), b = p.getPointAtLength(Math.min(p._len, l + .6));
  return Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
}
function render(p, l) {                    // l = 지금까지 그린 길이(0~전체)
  var s0 = p._hs ? p._L : 0, e0 = p._he ? p._len - p._L : p._len, vis = Math.min(l, e0);
  if (vis <= s0) { p.style.strokeDasharray = "0 " + p._len * 2; p.style.strokeDashoffset = 0; }
  else { p.style.strokeDasharray = (vis - s0) + " " + p._len * 2; p.style.strokeDashoffset = -s0; }
  if (p._he) {
    var b = p.getPointAtLength(Math.max(vis, s0));
    p._he.setAttribute("transform", "translate(" + b.x + "," + b.y + ") rotate(" + tangent(p, Math.max(vis, s0)) + ")");
    p._he.style.opacity = l > s0 + 1 ? 1 : 0;
  }
  if (p._hs) {
    var c = p.getPointAtLength(p._L);
    p._hs.setAttribute("transform", "translate(" + c.x + "," + c.y + ") rotate(" + (tangent(p, p._L) + 180) + ")");
    p._hs.style.opacity = l > 1 ? 1 : 0;
  }
}
function prep(p) { setup(p); if (p._raf) cancelAnimationFrame(p._raf); render(p, 0); }
function draw(p, dur, delay) {
  prep(p);
  var t0 = null;
  function tick(now) {
    if (t0 === null) t0 = now + delay;
    var k = Math.min(1, Math.max(0, (now - t0) / dur)), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    render(p, p._len * e);
    if (k < 1) p._raf = requestAnimationFrame(tick);
  }
  p._raf = requestAnimationFrame(tick);
}
function finish(p) { setup(p); if (p._raf) cancelAnimationFrame(p._raf); render(p, p._len); }
/* 처음: 모든 화살표를 같은 방식의 완성 상태로 */
document.querySelectorAll(".flowfig path[marker-end], .flowfig path[marker-start], .animfig path[marker-end], .animfig path[marker-start]")
  .forEach(finish);

/* 9장 개념도: 단계 보기(버튼) — 세로형·가로형 둘 다 */
(function () {
  var fig = document.querySelector(".flowfig");
  if (!fig) return;
  var svgs = fig.querySelectorAll("svg"), cap = fig.querySelector(".stepcap"), cur = 0;
  document.documentElement.classList.add("js");
  function go(n) {
    cur = n;
    svgs.forEach(function (svg) {
      svg.classList.toggle("stepping", n > 0);
      svg.querySelectorAll("[data-step]").forEach(function (g) {
        var on = +g.dataset.step === n;
        g.classList.toggle("on", on);
        g.querySelectorAll("path.draw").forEach(function (p, i) {
          if (on && !calm) draw(p, +p.dataset.dur || 900, i * 70); else finish(p);
        });
      });
    });
    fig.querySelectorAll("[data-go]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.go === String(n))); });
    var b = fig.querySelector('[data-go="' + n + '"]');
    cap.innerHTML = n > 0 ? "<strong>" + n + ". " + b.dataset.cap + "</strong>" + (b.dataset.sub ? "<span>" + b.dataset.sub + "</span>" : "") : "";
  }
  fig.querySelectorAll("[data-go]").forEach(function (b) {
    b.addEventListener("click", function () { go(b.dataset.go === "next" ? cur % 4 + 1 : +b.dataset.go); });
  });
  go(0);
})();

/* 9장 놀이 흐름·8장 순환: 화면에 들어오면 선이 자람(움직임 줄이기 설정이면 그대로) */
(function () {
  if (!("IntersectionObserver" in window) || calm) return;
  document.querySelectorAll(".animfig").forEach(function (fig) {
    var paths = fig.querySelectorAll("path.grow");
    fig.classList.add("anim");
    paths.forEach(prep);
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        fig.classList.add("play");
        paths.forEach(function (p) { draw(p, +p.dataset.dur || 1200, +p.dataset.delay || 0); });
        io.disconnect();
      });
    }, { threshold: 0.35 });
    io.observe(fig);
  });
})();

/* 표지 몬스터: 페이지가 다 뜨면 오른쪽 위에서 빼꼼, 표지(목차)를 지나 내려가면 숨고 올라오면 다시 */
(function () {
  var m = document.querySelector(".peek"), cover = document.querySelector(".cover");
  if (!m || !cover) return;
  var ready = false, busy = false;
  function update() {
    busy = false;
    m.classList.toggle("on", ready && window.scrollY < cover.offsetTop + cover.offsetHeight - 120);
  }
  function start() { setTimeout(function () { ready = true; update(); }, 400); }
  if (document.readyState === "complete") start(); else window.addEventListener("load", start);
  window.addEventListener("scroll", function () { if (!busy) { busy = true; requestAnimationFrame(update); } }, { passive: true });
})();

/* 마지막 장 자모 도안: 그림을 페이지 안에 넣고, 가끔 무작위로 한 마리만 사사삭(간격·모양 모두 무작위) */
(function () {
  var img = document.querySelector(".jamo img");
  if (!img || !window.fetch || calm) return;
  fetch(img.getAttribute("src")).then(function (r) { return r.text(); }).then(function (txt) {
    var box = document.createElement("div");
    box.innerHTML = txt;
    var svg = box.querySelector("svg");
    if (!svg) return;
    svg.removeAttribute("width"); svg.removeAttribute("height");
    svg.setAttribute("role", "img"); svg.setAttribute("aria-label", img.alt);
    img.replaceWith(svg);
    var critters = svg.querySelectorAll(".jp"), last = null;
    function twitch() {
      var c;
      do { c = critters[Math.floor(Math.random() * critters.length)]; } while (critters.length > 1 && c === last);
      last = c;
      var k = "jt" + (1 + Math.floor(Math.random() * 3));
      c.classList.add(k);
      c.addEventListener("animationend", function done() { c.classList.remove(k); c.removeEventListener("animationend", done); });
      setTimeout(twitch, 1800 + Math.random() * 4200);            // 1.8~6초 사이 무작위
    }
    setTimeout(twitch, 1200 + Math.random() * 2500);
  }).catch(function () {});
})();

/* 반짝임(메인 페이지 glitter 와 같은 색): 대상 요소 위에 장식용 복사본을 겹쳐 글자마다 시차를 두고 반짝임.
   원래 글자·제목 구조는 그대로(복사본은 aria-hidden, 끝나면 제거) → 화면 읽기·검색·AI 에 영향 없음.
   GLITTER 선택자에 맞는 요소가 화면에 처음 들어올 때 한 번, 무지개·금색 번갈아 */
(function () {
  var GLITTER = "section > h2";
  // 색만 바뀌고 움직이지 않으므로 '동작 줄이기' 설정에서도 재생(움직임이 아닌 색 변화는 허용 범위)
  if (!("IntersectionObserver" in window)) return;
  function letters(text) {
    try { if (window.Intl && Intl.Segmenter) return Array.from(new Intl.Segmenter("ko", { granularity: "grapheme" }).segment(text), function (s) { return s.segment; }); } catch (e) {}
    return Array.from(text);
  }
  function play(el, gold) {
    if (getComputedStyle(el).position === "static") el.style.position = "relative";
    var ov = document.createElement("span"), n = 0, chars = letters(el.textContent), total = 0;
    ov.className = "glit"; ov.setAttribute("aria-hidden", "true");
    var count = chars.filter(function (c) { return !/\s/.test(c); }).length || 1;
    ov.innerHTML = chars.map(function (c) {
      if (/\s/.test(c)) return c;
      var h = Math.round(n / count * 360), i = n++;
      return '<span class="' + (gold ? "g" : "r") + '" style="--i:' + i + ";--h:" + h + '">' + c.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</span>";
    }).join("");
    el.appendChild(ov);
    setTimeout(function () { ov.remove(); }, 1500 + n * 60 + 200);
  }
  var k = 0;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      var gold = (e.target._gi % 2) === 1;
      (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { play(e.target, gold); });
    });
  }, { threshold: 0.8 });
  document.querySelectorAll(GLITTER).forEach(function (el) { el._gi = k++; io.observe(el); });
})();
