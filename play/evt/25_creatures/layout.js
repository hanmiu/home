// === layout.js (root) — QR 표시/코너 겹침/프로그레시브 렌더 개선 ===
// 변경점 요약:
// 1) QR: qrcodejs 가 <img> 또는 <canvas>를 생성하는 경우 모두 지원 (타임아웃/에러 폴백)
// 2) 텍스트 우선 렌더: 텍스트(제목/이름/반 배지) → 메인 → (비동기) 보더/SVG/QR 순으로 합성
// 3) 모서리 겹침 제거: Top 이 윗 코너 소유, Bottom 이 아랫 코너 소유 → Right/Left는 해당 코너를 스킵

export const CONFIG = {
  DPI: 600,
  PAPER: { W: 2102, H: 3000 }, // 89mm x 127mm @600dpi
  PAD_MM: 3,                    // 전역 테두리 패딩
  CELL_S: 150,                  // 보더 한 셀 정사각 크기(px)
  INNER_PAD: 6,                 // 각 셀 내부 여백(px) 5~7 권장
  GRID: { COLS: 11, ROWS: 15 }, // 개념상 그리드(보더 뜯어 사용)
  ASSETS_BASE: "./assets/",
  TSV_URL: "./data/data.tsv",
  CREATURES_SVG_URL: "./front/strange_creatures.svg", // 우하단 로고 SVG 경로
  SALT: "25_creatures_v1",
  // QR 스타일(요구사항 그대로 유지)
  QR_SIZE_MM: 13,
  QR_ROTATE_RAD: Math.PI * 1.25,
};

export const AGE_COLORS = { 3: '#159D40', 4: '#72BFEA', 5: '#753F97' };
export function colorForAge(age){ return AGE_COLORS[age] || '#111'; }

export function mm2px(mm, dpi = CONFIG.DPI) { return Math.round(mm * dpi / 25.4); }
export const PAD = mm2px(CONFIG.PAD_MM, CONFIG.DPI);
export const WORK_W = CONFIG.PAPER.W - 2*PAD;
export const WORK_H = CONFIG.PAPER.H - 2*PAD;

// base64url ⇄ utf8 string (NFC/trim 보장) - DEPRECATED, 하위 호환용
export function b64urlEncode(str) {
  const s = str.normalize('NFC').trim();
  const bytes = new TextEncoder().encode(s);
  let bin = ''; bytes.forEach(b => bin += String.fromCharCode(b));
  return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
export function b64urlDecode(code) {
  let b64 = code.replace(/-/g,'+').replace(/_/g,'/');
  while (b64.length % 4) b64 += '=';
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length); for (let i=0;i<bin.length;i++) bytes[i]=bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

// 짧은 코드 생성 (SHA256 해시 앞 8자리 hex)
export async function shortCode(basename, length=8) {
  const normalized = (basename||'').normalize('NFC').trim();
  const hex = await sha256hex(normalized);
  return hex.slice(0, length);
}

// 짧은 코드로부터 basename 찾기
export async function fromShortCode(code, allBasenames) {
  const len = code.length;
  for(const base of allBasenames) {
    const hash = await shortCode(base, len);
    if(hash === code) return base;
  }
  return null; // 찾을 수 없음
}

// sha256 hex (WebCrypto)
export async function sha256hex(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
export async function seedFrom(basename, salt = CONFIG.SALT) {
  const hex = await sha256hex((basename||'') + '|' + salt);
  return parseInt(hex.slice(0,8), 16) >>> 0; // u32 seed
}

// PRNG + 결정적 셔플
export function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
export function shuffleDeterministic(list, seed){const rnd=mulberry32(seed);const a=list.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

// TSV → 레코드 목록(+ byBase 맵) 파싱
export function parseTSVRecords(text){
  const lines=text.split(/\r?\n/).filter(Boolean);
  if(lines.length===0) return { bases: [], records: [], byBase: new Map() };
  const header=lines.shift().split(/\t/).map(h=>h.trim());
  const idx = (name)=> header.findIndex(h=>h===name);
  const iFile = idx('file');
  if(iFile===-1) throw new Error('TSV에 file 컬럼이 필요합니다');
  const iLatLng = idx('latlng');
  const iDesc   = idx('desc');
  const iClass  = idx('class');
  const iAge = idx('age');

  const records=[]; const bases=[]; const byBase=new Map();
  for(const ln of lines){
    const cols=ln.split(/\t/);
    const file=(cols[iFile]||'').trim();
    if(!file) continue;
    const base=file.replace(/\.png$/i,'').normalize('NFC').trim();
    const latlng = iLatLng!==-1 ? (cols[iLatLng]||'').trim() : '';
    let lat=null, lng=null;
    if(latlng){
      const m=latlng.split(',').map(s=>s.trim());
      if(m.length===2){ lat=parseFloat(m[0]); lng=parseFloat(m[1]); }
    }
    const desc  = iDesc!==-1 ? (cols[iDesc]||'').trim() : '';
    const klass = iClass!==-1 ? (cols[iClass]||'').trim() : '';
    const age = iAge!==-1 ? parseInt((cols[iAge]||'').trim(), 10) : null;
    const rec = { base, file, lat, lng, desc, klass, age };
    records.push(rec); bases.push(base); byBase.set(base, rec);
  }
  return { bases, records, byBase };
}
// 하위호환: 기존 parseTSV는 basenames만 반환
export function parseTSV(text){ return parseTSVRecords(text).bases; }

// 에셋 URL
export function assetUrl(basename, base=CONFIG.ASSETS_BASE){
  return base + encodeURIComponent(basename + '.png');
}

// 보더 그리드 메트릭
export function gridMetrics(cellS=CONFIG.CELL_S){
  const s = cellS;
  const gx = Math.round((WORK_W - CONFIG.GRID.COLS*s) / (CONFIG.GRID.COLS-1));
  const gy = Math.round((WORK_H - CONFIG.GRID.ROWS*s) / (CONFIG.GRID.ROWS-1));
  return {s,gx,gy};
}

// (기존) 슬롯 좌표 기본형
export function borderXY(side, idx, m){
  const {s,gx,gy}=m; 
  const W=CONFIG.PAPER.W, H=CONFIG.PAPER.H; 
  const pad=PAD;
  switch(side){
    case 'top':    return [pad + idx*(s+gx), pad];
    case 'right':  return [W-pad-s, pad + idx*(s+gy)];
    case 'bottom': return [W - pad - s - idx*(s+gx), H-pad-s];
    case 'left':   return [pad, H - pad - s - idx*(s+gy)]; // 좌하→좌상
    default:       return [0, 0];
  }
}

// 코너 소유권 정책 반영: 유효 슬롯 수 계산
export function effectiveSlotCounts(sides){
  const COLS = CONFIG.GRID.COLS, ROWS = CONFIG.GRID.ROWS;
  return {
    top:    sides.top    ? COLS : 0,
    right:  sides.right  ? ROWS - (sides.top?1:0) - (sides.bottom?1:0) : 0,
    bottom: sides.bottom ? COLS : 0,
    left:   sides.left   ? ROWS - (sides.bottom?1:0) - (sides.top?1:0) : 0,
  };
}

// 코너 스킵을 고려한 좌표 매핑
export function borderXYNoOverlap(side, idx, sides, m){
  const skipTop = sides.top ? 1 : 0;
  const skipBottom = sides.bottom ? 1 : 0;
  switch(side){
    case 'top':    return borderXY('top', idx, m);
    case 'right':  return borderXY('right', idx + skipTop, m);
    case 'bottom': return borderXY('bottom', idx, m);
    case 'left':   return borderXY('left', idx + skipBottom, m); // left는 아래→위 인덱싱
    default:       return [0,0];
  }
}

// 보더 이미지 선택 (유효 슬롯 수 기준으로 분배)
export function pickBordersBySide(allBases, mainBase, seed, sides={top:true, right:true, bottom:true, left:true}){
  const list = allBases.filter(b=>b!==mainBase);
  const sh = shuffleDeterministic(list, seed);
  const cnt = effectiveSlotCounts(sides);
  let off = 0; const result = { top:[], right:[], bottom:[], left:[] };
  if(sides.top && cnt.top){       result.top    = sh.slice(off, off+cnt.top);    off+=cnt.top; }
  if(sides.right && cnt.right){   result.right  = sh.slice(off, off+cnt.right);  off+=cnt.right; }
  if(sides.bottom && cnt.bottom){ result.bottom = sh.slice(off, off+cnt.bottom); off+=cnt.bottom; }
  if(sides.left && cnt.left){     result.left   = sh.slice(off, off+cnt.left);   off+=cnt.left; }
  return result;
}

// 이미지 로더
export function loadImage(url){
  return new Promise((resolve,reject)=>{
    const img = new Image();
    try {
      const u = new URL(url, location.href);
      if (u.origin !== location.origin) img.crossOrigin = 'anonymous';
    } catch {}
    img.onload=()=>resolve(img);
    img.onerror=(e)=>reject(new Error('이미지 로드 실패: '+url));
    img.src=url;
  });
}

// 이미지의 투명하지 않은 픽셀로 bounding box 계산
export function getBoundingBox(img){
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = img.width;
  tempCanvas.height = img.height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(img, 0, 0);
  const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
  const data = imageData.data;
  let minX = img.width, minY = img.height, maxX = 0, maxY = 0;
  let hasContent = false;
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const alpha = data[(y * img.width + x) * 4 + 3];
      if (alpha > 0) { // 투명하지 않은 픽셀
        hasContent = true;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (!hasContent) {
    return { x: 0, y: 0, width: img.width, height: img.height };
  }
  return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

// 둥근 사각형 path
export function roundRectPath(ctx, x, y, w, h, r){
  const rr = Math.min(r, w/2, h/2);
  ctx.beginPath();
  ctx.moveTo(x+rr, y);
  ctx.lineTo(x+w-rr, y);
  ctx.quadraticCurveTo(x+w, y, x+w, y+rr);
  ctx.lineTo(x+w, y+h-rr);
  ctx.quadraticCurveTo(x+w, y+h, x+w-rr, y+h);
  ctx.lineTo(x+rr, y+h);
  ctx.quadraticCurveTo(x, y+h, x, y+h-rr);
  ctx.lineTo(x, y+rr);
  ctx.quadraticCurveTo(x, y, x+rr, y);
  ctx.closePath();
}

export function hexToRgb(hex){
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if(!m) return {r:0,g:0,b:0};
  return { r: parseInt(m[1],16), g: parseInt(m[2],16), b: parseInt(m[3],16) };
}

// 파일명 유틸
export function sanitizeFilename(s){ return (s||'').replace(/[\\/:*?"<>|]+/g, '_'); }
export function computeFilename(index, record, ext='jpg'){
  const num = String(index+1).padStart(3,'0');
  const klass = (record?.klass||'').normalize('NFC');
  const base  = (record?.base||'').normalize('NFC');
  return sanitizeFilename(`${num}_${klass}_${base}.${ext}`);
}

// 캔버스 그리기: 텍스트 선행, 이후 메인/보더/SVG/QR 순차(보더는 비동기 로딩 후 합성)
export async function drawCard({
  canvas, 
  basename, 
  allBasenames, 
  record=null,
  assetsBase=CONFIG.ASSETS_BASE, 
  drawQR=true, 
  qrUrl, 
  titleFromBase=true, 
  drawBorders=true,
  borderSides={top:true, right:true, bottom:true, left:true}
}){
  const ctx = canvas.getContext('2d');
  canvas.width = CONFIG.PAPER.W; canvas.height = CONFIG.PAPER.H;
  ctx.fillStyle = '#fff'; ctx.fillRect(0,0,canvas.width,canvas.height);
  const ageColor = colorForAge(record?.age);

  const metrics=gridMetrics(CONFIG.CELL_S);
  const seed = await seedFrom(basename);
  const borders = pickBordersBySide(allBasenames, basename, seed, borderSides);

  // 1) 텍스트/배지/좌하 Path 로고를 먼저 그림 (메인/보더 로드 대기 없이)
  // 텍스트 배치는 메인 bbox 없이 targetSize(=45mm) 기준으로 산정
  const [author, title] = splitBase(basename);
  const targetSize = mm2px(45);
  const topSafeMargin = PAD + (borderSides.top ? CONFIG.CELL_S : 0) + mm2px(3);
  const availableHeight = WORK_H - topSafeMargin * 2;
  const bboxCenterY = topSafeMargin + availableHeight * 0.30;
  const nameY = bboxCenterY + targetSize/2 + mm2px(10);

  // 제목
  ctx.fillStyle='#000'; ctx.textAlign='center'; ctx.textBaseline='alphabetic';
  const titleBoxW = Math.round(WORK_W*0.85);
  const titleMax = 110; const titleMin = 52;
  drawFitText(ctx, titleFromBase?title:basename, CONFIG.PAPER.W/2, nameY, titleBoxW, titleMax, titleMin);
  // 이름
  const authorY = nameY + mm2px(8);
  ctx.font = `500 ${Math.round(mm2px(3.5))}px 'Noto Sans KR', system-ui, sans-serif`;
  ctx.fillText(author, CONFIG.PAPER.W/2, authorY);
  // 클래스 배지
  if(record && record.klass){
    const badgeText = record.klass;
    const fontSize = mm2px(2);
    ctx.font = `600 ${fontSize}px 'Noto Sans KR', system-ui, sans-serif`;
    const padX = mm2px(3), padY = mm2px(1.8);
    const textW = ctx.measureText(badgeText).width;
    const w = Math.round(textW + padX*2);
    const h = Math.round(fontSize + padY*2);
    const x = Math.round(CONFIG.PAPER.W/2 - w/2);
    const y = Math.round(authorY + mm2px(6) - h*0.85);
    ctx.fillStyle = ageColor;
    roundRectPath(ctx, x, y, w, h, mm2px(3));
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(badgeText, CONFIG.PAPER.W/2, y + h/2);
  }
  // 좌하 Path2D 로고(즉시)
  const logoPath = new Path2D('M26.405471,23.244963C26.405471,23.244963 26.880837,26.114323 27.220195,29.950259 M37.189743,48.338714C37.189743,43.724875 33.062148,39.980291 27.979476,39.980291L24.830489,39.980291C19.746433,39.980291 15.620222,43.724875 15.620222,48.338714C15.620222,52.952553 19.746433,56.697136 24.830489,56.697136L27.979476,56.697136C33.062148,56.697136 37.189743,52.952553 37.189743,48.338714Z M54.945547,23.241356L54.945547,60.041296 M11.354173,29.950091L41.454242,29.950091 M18.038490,66.729916C18.038490,71.342105 16.821848,76.787099 25.890786,76.759868L58.120517,76.759868 M54.944924,43.324091L64.902262,43.324091 M262.922953,59.077087C262.922953,59.077087 263.527444,55.428316 263.958983,50.550415 M273.706943,31.599714C273.706943,26.985875 269.579348,23.241291 264.496676,23.241291L261.347689,23.241291C256.263633,23.241291 252.137422,26.985875 252.137422,31.599714C252.137422,36.213553 256.263633,39.958136 261.347689,39.958136L264.496676,39.958136C269.579348,39.958136 273.706943,36.213553 273.706943,31.599714Z M253.685090,66.729916C253.685090,71.342105 252.468448,76.787099 261.537386,76.759868L293.767117,76.759868 M292.293457,23.241356L292.293457,63.406550 M282.312224,57.379091L292.269562,57.379091 M246.855598,50.011786C262.999964,50.801475 272.258382,51.403953 280.394670,46.668091 M171.459341,34.570717C171.459341,28.397029 166.277669,23.386474 159.897018,23.386474L155.943864,23.386474C149.561476,23.386474 144.381541,28.397029 144.381541,34.570717C144.381541,40.744406 149.561476,45.754960 155.943864,45.754960L159.897018,45.754960C166.277669,45.754960 171.459341,40.744406 171.459341,34.570717Z M151.172657,76.708062C151.172657,62.098824 152.196076,54.288169 142.886601,53.984093C135.823653,53.753768 132.046537,49.789440 131.672115,45.755902 M164.606474,76.760062C164.606474,62.150824 163.644324,54.340169 172.953799,54.036093C180.016747,53.805768 183.793863,50.522206 184.168285,46.488668 M206.677144,26.649414C206.677144,26.649414 208.893038,40.001504 206.677144,46.092091C204.446501,52.221254 193.313708,63.261009 193.295554,63.428931 M206.674734,46.092091L220.042709,63.428931 M233.418747,23.263356L233.418747,73.416521 M193.295311,33.337091L220.043742,33.337091 M117.554547,23.263356L117.554547,73.416521 M77.430841,29.950134L100.398687,29.950134L100.398687,63.385425L77.430841,63.385425Z');
  const logoX = mm2px(12);
  const logoY = CONFIG.PAPER.H - mm2px(15);
  ctx.save(); ctx.translate(logoX, logoY); ctx.scale(1.2, 1.2); ctx.lineWidth = mm2px(0.2); ctx.lineCap = 'round'; ctx.strokeStyle = 'black'; ctx.stroke(logoPath); ctx.restore();

  // 2) 메인/보더/SVG/QR 로딩을 병렬로 시작
  const mainImgP = loadImage(assetUrl(basename, assetsBase));
  const svgLogoP = loadImage(CONFIG.CREATURES_SVG_URL).then(img=>({ok:true,img})).catch(e=>({ok:false,e}));

  // 3) 메인 이미지 그리기 (텍스트 이후)
  try{
    const mainImg = await mainImgP;
    const bbox = getBoundingBox(mainImg);
    const scale = targetSize / Math.max(bbox.width, bbox.height);
    const scaledW = Math.round(mainImg.width * scale);
    const scaledH = Math.round(mainImg.height * scale);
    const scaledBboxH = Math.round(bbox.height * scale);
    const bboxCenterX = CONFIG.PAPER.W / 2;
    const mainX = Math.round(bboxCenterX - scaledW/2);
    const mainY = Math.round(bboxCenterY - scaledBboxH/2 - bbox.y * scale);
    ctx.drawImage(mainImg, mainX, mainY, scaledW, scaledH);
  }catch(e){ console.warn('메인 이미지 로드 실패:', e); }

  // 4) 보더 합성 (비동기 로딩 후 순차 드로우 – 진행 중 즉시 화면 반영)
  if(drawBorders){
    const cellPad = CONFIG.INNER_PAD; 
    const s = metrics.s - cellPad*2;
    const borderPromises = [];
    for(const [side, items] of Object.entries(borders)){
      items.forEach((base, i)=>{
        const p = loadImage(assetUrl(base, assetsBase)).then(img=>{
          const [x,y] = borderXYNoOverlap(side, i, borderSides, metrics);
          ctx.drawImage(img, x+cellPad, y+cellPad, s, s);
        }).catch(e=>console.warn('보더 이미지 오류:', base, e));
        borderPromises.push(p);
      });
    }
    await Promise.all(borderPromises);
  }

  // 5) 우하 SVG 로고 (보더 인셋 반영)
  try{
    const res = await svgLogoP;
    if(res.ok){
      const creatureLogoImg = res.img;
      const insetRight  = borderSides.right  ? metrics.s : 0;
      const insetBottom = borderSides.bottom ? metrics.s : 0;
      const margin = mm2px(3);
      const targetW = mm2px(28);
      const scaleSvg = targetW / creatureLogoImg.width;
      const targetH = Math.round(creatureLogoImg.height * scaleSvg);
      const xSvg = CONFIG.PAPER.W - PAD - insetRight - margin - targetW;
      const ySvg = CONFIG.PAPER.H - PAD - insetBottom - margin - targetH;
      ctx.drawImage(creatureLogoImg, xSvg + 170, ySvg + 70, targetW * 0.8, targetH * 0.8);
    }
  }catch(e){ console.warn('SVG 로고 오류:', e); }

  // 6) QR (옵션, print.html에서만 사용)
  if(drawQR && qrUrl){
    const sizePx = mm2px(13); // 13mm
    // qrcodejs 라이브러리는 DOM 요소에 직접 생성하므로 임시 div 사용
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);
    
    const qr = new window.QRCode(tempDiv, {
      text: qrUrl,
      width: sizePx,
      height: sizePx,
      colorDark: ageColor,
      colorLight: '#ffffff',
      correctLevel: window.QRCode.CorrectLevel.L
    });
    
    // QR 코드 이미지가 생성될 때까지 대기
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const qrImg = tempDiv.querySelector('img');
    if(qrImg && qrImg.complete){
      const qx = Math.round((CONFIG.PAPER.W - sizePx)/2);
      const qy = CONFIG.PAPER.H - PAD - sizePx - mm2px(10);
      ctx.save();
      ctx.translate(qx + sizePx * 0.5, qy + mm2px(4));
      ctx.rotate(Math.PI * 1.25);
      ctx.drawImage(qrImg, -sizePx * 0.5, -sizePx * 0.5, sizePx, sizePx);
      const n = 4;
      const {r:cr,g:cg,b:cb} = hexToRgb(ageColor);
      for (let i = 1; i < n; i++) {
        const gap = mm2px(2) * i;
        const alpha = (1 - i / n) * 0.75; // 기존 감쇠 유지
        ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha})`;
        ctx.strokeRect(-(sizePx + gap) * 0.5, -(sizePx + gap) * 0.5, sizePx + gap, sizePx + gap);
      }
      ctx.restore();
    }
    
    document.body.removeChild(tempDiv);
  }
}

export function splitBase(base){
  const m = base.split('_');
  if(m.length>=2){ return [m[0], m.slice(1).join(' ').replace(/\s+/g,' ').trim()]; }
  return ['', base];
}

// 박스 너비에 맞춰 폰트 크기를 줄이며 줄바꿈 후 중앙 정렬로 그림
export function drawFitText(ctx, text, centerX, baselineY, boxW, maxPx, minPx){
  let size=maxPx; let lines;
  while(size>=minPx){
    ctx.font = `700 ${size}px 'Noto Sans KR', system-ui, sans-serif`;
    lines = wrapByWords(ctx, text, boxW);
    if(lines.length<=2) break; // 최대 2줄
    size-=2;
  }
  const lineGap = Math.round(size*0.35);
  const startY = baselineY; // 첫 줄 baseline
  lines.forEach((ln,idx)=>{ ctx.fillText(ln, centerX, startY + idx*(size+lineGap)); });
}

export function wrapByWords(ctx, text, maxW){
  const words = text.split(/\s+/).filter(Boolean);
  if(words.length===0) return [''];
  const measure=(s)=>ctx.measureText(s).width;
  const out=[]; let line='';
  for(const w of words){
    const test = line? line+' '+w : w;
    if(measure(test)<=maxW){ line=test; }
    else{
      if(!line){ // 단어 하나가 너무 길면 강제 분절
        let chunk=''; for(const ch of w){ if(measure(chunk+ch)<=maxW) chunk+=ch; else { out.push(chunk); chunk=ch; } }
        line=chunk; continue;
      }
      out.push(line); line=w;
    }
  }
  if(line) out.push(line);
  return out.slice(0,3); // 안전장치(최대 3줄)
}