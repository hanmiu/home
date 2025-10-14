export const CONFIG = {
  DPI: 600,
  PAPER: { W: 1800, H: 3000 }, // 3x5in @600dpi
  PAD_MM: 3,                    // 전역 테두리 패딩
  CELL_S: 150,                  // 보더 한 셀 정사각 크기(px)
  INNER_PAD: 6,                 // 각 셀 내부 여백(px) 5~7 권장
  GRID: { COLS: 9, ROWS: 15 },  // 개념상 그리드(보더 뜯어 사용)
  // 리소스 경로 (필요 시 cards/print에서 override 가능)
  ASSETS_BASE: "./assets/",
  TSV_URL: "./data/data.tsv",
  SALT: "25_creatures_v1"
};

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

// TSV 파싱 → basename 목록 (확장자 제거)
export function parseTSV(text){
  const lines=text.split(/\r?\n/).filter(Boolean);
  const header=lines.shift().split(/\t/);
  const idx=header.findIndex(h=>h.trim()==='file');
  if(idx===-1) throw new Error('TSV에 file 컬럼이 필요합니다');
  const out=[];
  for(const ln of lines){
     const cols=ln.split(/\t/);
     const file=(cols[idx]||'').trim();
     if(!file) continue;
     const base=file.replace(/\.png$/i,'').normalize('NFC').trim();
     out.push(base);
  }
  return out;
}

// 에셋 URL
export function assetUrl(basename, base=CONFIG.ASSETS_BASE){
  return base + encodeURIComponent(basename + '.png');
}

// 보더 44 슬롯 좌표 (시계방향, 모서리 중복 제거: 상9 + 우14 + 하8 + 좌13)
export function gridMetrics(cellS=CONFIG.CELL_S){
  const s = cellS;
  const gx = Math.round((WORK_W - CONFIG.GRID.COLS*s) / (CONFIG.GRID.COLS-1));
  const gy = Math.round((WORK_H - CONFIG.GRID.ROWS*s) / (CONFIG.GRID.ROWS-1));
  return {s,gx,gy};
}
export function borderXY(idx, m){
  const {s,gx,gy}=m; const W=CONFIG.PAPER.W, H=CONFIG.PAPER.H; const pad=PAD;
  // 상단 9개: 좌상 모서리부터 우상 모서리까지
  if(idx<9) return [pad + idx*(s+gx), pad];
  idx-=9;
  // 우측 14개: 우상 모서리 바로 아래부터 우하 모서리까지
  if(idx<14) return [W-pad-s, pad + (idx+1)*(s+gy)];
  idx-=14;
  // 하단 8개: 우하 모서리 바로 왼쪽부터 좌하 모서리 바로 오른쪽까지
  if(idx<8) return [W - pad - s - (idx+1)*(s+gx), H-pad-s];
  idx-=8;
  // 좌측 13개: 좌하 모서리 바로 위부터 좌상 모서리 바로 아래까지 (역순)
  return [pad, H - pad - s - (idx+1)*(s+gy)];
}

// 메인 제외, 결정적 셔플로 44개 선택
export function pickBorders(allBases, mainBase, seed){
  const list = allBases.filter(b=>b!==mainBase);
  const sh = shuffleDeterministic(list, seed);
  return sh.slice(0,44);
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
    img.onerror=reject;
    img.src=url;
  });
}

// 캔버스 그리기: 테두리, 메인, 텍스트, QR(옵션)
export async function drawCard({canvas, basename, allBasenames, assetsBase=CONFIG.ASSETS_BASE, drawQR=true, qrUrl, titleFromBase=true, drawBorders=true}){
  const ctx = canvas.getContext('2d');
  canvas.width = CONFIG.PAPER.W; canvas.height = CONFIG.PAPER.H;
  // 배경
  ctx.fillStyle = '#fff'; ctx.fillRect(0,0,canvas.width,canvas.height);

  const metrics=gridMetrics(CONFIG.CELL_S);
  const seed = await seedFrom(basename);
  const borders = pickBorders(allBasenames, basename, seed);

  // 테두리 이미지 배치 (옵션)
  if(drawBorders){
    const cellPad = CONFIG.INNER_PAD; // 내부 패딩
    for(let i=0;i<borders.length;i++){
      const [x,y]=borderXY(i,metrics);
      const img = await loadImage(assetUrl(borders[i], assetsBase));
      const s = metrics.s - cellPad*2;
      ctx.drawImage(img, x+cellPad, y+cellPad, s, s);
    }
  }

  // 메인 캐릭터 (가로 65% 폭)
  const mainImg = await loadImage(assetUrl(basename, assetsBase));
  const mainW = Math.round(WORK_W*0.65), mainH=mainW; // 정사각형
  const mainX = Math.round((CONFIG.PAPER.W - mainW)/2);
  const mainY = Math.round(PAD + (WORK_H-mainH)*0.18); // 상단에 살짝 치우침
  ctx.drawImage(mainImg, mainX, mainY, mainW, mainH);

  // 텍스트(이름/제목)
  const [author, title] = splitBase(basename);
  const nameY = mainY + mainH + mm2px(8); // 메인 아래 8mm
  ctx.fillStyle='#000'; ctx.textAlign='center'; ctx.textBaseline='alphabetic';

  // 제목(큰 글씨, 단어단위 줄바꿈)
  const titleBoxW = Math.round(WORK_W*0.9);
  const titleMax = 120; const titleMin = 56;
  drawFitText(ctx, titleFromBase?title:basename, CONFIG.PAPER.W/2, nameY, titleBoxW, titleMax, titleMin);

  // 이름(작은 글씨)
  const authorY = nameY + mm2px(16); // 16mm 아래
  ctx.font = `500 ${Math.round(mm2px(5))}px 'Noto Sans KR', system-ui, sans-serif`;
  ctx.fillText(author, CONFIG.PAPER.W/2, authorY);

  // QR (하단 중앙)
  if(drawQR && qrUrl){
    const sizePx = mm2px(16); // 26mm
    // qrcodejs 라이브러리는 DOM 요소에 직접 생성하므로 임시 div 사용
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);
    
    const qr = new window.QRCode(tempDiv, {
      text: qrUrl,
      width: sizePx,
      height: sizePx,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: window.QRCode.CorrectLevel.H
    });
    
    // QR 코드 이미지가 생성될 때까지 대기
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const qrImg = tempDiv.querySelector('img');
    if(qrImg && qrImg.complete){
      const qx = Math.round((CONFIG.PAPER.W - sizePx)/2);
      const qy = CONFIG.PAPER.H - PAD - sizePx - mm2px(8);
      ctx.save();
      ctx.translate(qx + sizePx * 0.5, qy + mm2px(4));
      ctx.rotate(Math.PI * 1.25);
      ctx.drawImage(qrImg, -sizePx * 0.5, -sizePx * 0.5, sizePx, sizePx);
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
    ctx.font = `900 ${size}px 'Noto Sans KR', system-ui, sans-serif`;
    lines = wrapByWords(ctx, text, boxW);
    if(lines.length<=2) break; // 최대 2줄로 제한(필요시 3으로)
    size-=2;
  }
  const lineGap = Math.round(size*0.35);
  const startY = baselineY; // 첫 줄 baseline
  lines.forEach((ln,idx)=>{ ctx.fillText(ln, centerX, startY + idx*(size+lineGap)); });
}

export function wrapByWords(ctx, text, maxW){
  const words = text.split(/\s+/).filter(Boolean);
  if(words.length===0) return [''];
  // 한국어 등 공백 적은 경우 대비: 폭 초과 시 임의 자르기
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