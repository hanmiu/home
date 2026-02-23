let cho = Array(19).fill(0).map((x,i)=>String.fromCharCode(0x1100+i));
let jung = Array(21).fill(0).map((x,i)=>String.fromCharCode(0x1161+i));
let jong = Array(27).fill(0).map((x,i)=>String.fromCharCode(0x11A8+i));
jong.unshift('&nbsp;');

function composeHangul(chs) {
  let ch_L = 0;
  let ch_V = 0;
  let ch_T = 0;
  if(chs[0]) {
   ch_L = (chs[0].charCodeAt(0) - 0x1100) * 21 * 28;
  }
  if(chs[1]) {
   ch_V = (chs[1].charCodeAt(0) - 0x1100 - 0x61) * 28;
  }
  if(chs[2]) {
   ch_T = chs[2].charCodeAt(0) - 0x1100 - 0xA7;
  }

  return String.fromCharCode(0xAC00 + ch_L + ch_V + ch_T);
}

function decomposeHangul(ch) {
  let n_ch = ch.charCodeAt(0);
  let o = []
  if(n_ch >= 0xAC00 && n_ch <= 0xD7A3) {
    let ch_T = (n_ch - 0xAC00) % 28;
    let ch_V = Math.floor((n_ch - 0xAC00) / 28) % 21;
    let ch_L = Math.floor(Math.floor((n_ch - 0xAC00) / 28) / 21);

    o.push(String.fromCharCode(ch_L + 0x1100));
    o.push(String.fromCharCode(ch_V + 0x1100 + 0x61));
    if(ch_T != 0) {
      o.push(String.fromCharCode(ch_T + 0x1100 + 0xA7));
    }
  }
  return o;
}