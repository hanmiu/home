html['playground'] = `
  <div>어린이의 동시대 환경인 디지털</div>
  <br>
  
  <div class="subtle"><a href="https://www.hanmiu.cc/play/glyph/hangul-slime.html" target="_blank"><strong>
  한글 슬라임
  </strong></div>
  <a class="no-underline" href="https://www.hanmiu.cc/play/glyph/hangul-slime.html">
    <img class="full" src="./play/glyph/hangul-slime.jpg">
  </a>
  <div class="subtle">모음과 자음 사이에 인력이 작용합니다. 빈 공간을 터치(클릭)하면 그 쪽으로 한글 자모가 모입니다. 데스크탑+모바일 지원합니다. 위 링크 또는 이미지를 클릭하여 어린이와 함께 놀아보세요.</div>
  <br>

  <div class="subtle"><a href="https://www.hanmiu.cc/play/glyph/hangul-slime.html" target="_blank"><strong>
  몸문자
  </strong></div>
  <a class="no-underline" href="https://www.hanmiu.cc/play/glyph/mmj.html">
    <img class="full" src="./play/glyph/mmj.jpg">
  </a>
  <div class="subtle"><a href="https://www.youtube.com/watch?v=x25lngyKUAU" target="_blank">몸문자</a> 놀이를 지원하기 위해 만들었습니다. 만5세 어린이들의 호기심과 제안을 따라가며 문자 체계를 고안해 갔던 이야기입니다. 자세한 내용은 <a href="https://www.youtube.com/watch?v=x25lngyKUAU" target="_blank">몸문자</a> 영상을 살펴봐 주세요. (데스크탑+모바일 지원)</div>
  <br>

  <div class="subtle"><a href="https://www.hanmiu.cc/play/glyph/snowflower.html" target="_blank"><strong>
  눈꽃
  </strong></div>
  <a class="no-underline" href="https://www.hanmiu.cc/play/glyph/snowflower.html">
    <img class="full" src="./play/glyph/snowflower.jpg">
  </a>
  <div class="subtle"><a href="https://youtu.be/AmFalsFzkYA?t=948" target="_blank">글자 디자인</a> 놀이를 지원하기 위해 만들었습니다. 만4세의 한글에 관한 탐색을 지원하기 위한 여러 접근 중에 하나로 활용되었습니다. 자세한 내용은 <a href="https://youtu.be/AmFalsFzkYA?t=948" target="_blank">글자 디자인</a> 영상을 살펴봐 주세요. (데스크탑+모바일 지원)</div>
  <br>

  <div class="subtle"><a href="https://www.hanmiu.cc/play/glyph/drawing.html" target="_blank"><strong>
  글자 드로잉
  </strong></div>
  <a class="no-underline" href="https://www.hanmiu.cc/play/glyph/drawing.html">
    <img class="full" src="./play/glyph/drawing.jpg">
  </a>
  <div class="subtle"><a href="https://youtu.be/AmFalsFzkYA?t=948" target="_blank">글자 디자인</a> 놀이를 지원하기 위해 만들었습니다. 글자 디자인은 <a href="https://docs.google.com/document/d/1yZu8Pt3nYTMR1Zs17U5BEG83POhI7FT3OGwvEHcniME/view" target="_blank">&lt;일상 속의 호기심 탐구 창의성&gt;</a>이란 큰 흐름과 연결되어 있던 교실의 다양한 접근 중 하나였습니다. 더 자세한 내용은 <a href="https://youtu.be/AmFalsFzkYA?t=948" target="_blank">글자 디자인</a> 영상과 <a href="https://docs.google.com/document/d/1yZu8Pt3nYTMR1Zs17U5BEG83POhI7FT3OGwvEHcniME/view" target="_blank">'일상 속의 호기심 탐구 창의성'</a>을 살펴봐 주세요. (데스크탑+모바일 지원)</div>
  <br>

  <div class="subtle">먼저 한글(또는 문자)에 관한 어린이의 호기심을 지원하기 위해 만들었던 작업들을 소개드리고 있습니다. 그 외에도 수, 음악, <a href="https://youtu.be/GhHWJIfQtWc?t=661" target="_blank">움직임 등과 연결되어 있는 한미유치원의 교실 놀이를 지원하기 위해 만들었던 다양한 작업을 소개하며 건강한 미디어 활용을 다룰 계획입니다. (계속 업데이트 됩니다.)</div>
  <br>

  <div>더 살펴보기</div>
  <div class="subtle">
    <ul class="leaf">
      <li><a href="/?page=hanmi">한미유치원의 역사·문화·환경</a> →</li>
      <li><a href="/?page=thought">한미유치원의 교육에 관한 생각</a> →</li>
      <li><a href="/?page=about_play">영상으로 보는 풍요롭고 재밌는 한미유치원의 놀이</a> →</li>
    </ul>
  </div>

  <img style="display: block; height: 100px; margin: auto;" src="./images/logotype/hanmi_runner.svg">
`;

class HanmiPlayground {
  constructor() {
    let d = d_mon3;
    this.path = new Path2D(d);
    
    this.frame_count = 0;
    
    this.x = 400 + Math.random() * 400;
    this.y = 100 + (1-Math.random()*2) * 50;
    
    this.wait = 120;
    
    this.bipeds = [];
    for(let i = 0; i < biped_classes.length; i++) {
      this.bipeds.push(new biped_classes[i]);
    }
    let bc = biped_classes_for_shuffle.shift();
    if(biped_classes_for_shuffle.length === 0) {
      biped_classes_for_shuffle = biped_classes.map(x => x);
    }
    this.biped = this.bipeds[this.bipeds.map(x => x.constructor).indexOf(bc)];
    this.biped_x = -100;
    for(let i = 0; i < this.bipeds.length; i++) {
      this.bipeds[i].x = this.biped_x;
    }
  }
  
  update(c) {
    let dx = hanmi_base.x - this.x;
    let dy = hanmi_base.y - this.y;
    let d = Math.sqrt(dx*dx + dy*dy) + 1e-6;
    if(d > 100) {
      let ux = dx / d;
      let uy = dy / d;
      this.x += ux * 10; 
      this.y += uy * 10;  
    }
    else {
      this.x += dx * 0.25; 
      this.y += dy * 0.25; 
    }
    
    if(this.wait > 0) {
      this.wait -= 1;
    }
    
    if(c === current_ctx) {
      this.frame_count += 1;
      this.biped_x += 1;
      this.biped.update(this.frame_count / 60);
      this.biped.x = this.biped_x;
      if(this.biped.x > c.canvas.width + 200) {
        let bc = biped_classes_for_shuffle.shift();
        if(biped_classes_for_shuffle.length === 0) {
          biped_classes_for_shuffle = biped_classes.map(x => x);
        }
        this.biped = this.bipeds[this.bipeds.map(x => x.constructor).indexOf(bc)];
        this.biped_x = -100;
        this.biped.reform();
      }  
    }
  }
  
  draw(c) {
    c.clearRect(0, 0, c.canvas.width, c.canvas.height);
    
    c.save();
    c.translate(this.x, this.y - 200 * 3);
    c.scale(hanmi_base.scale, hanmi_base.scale);
    c.translate(-256, -256);
    c.fillStyle = 'hsla(90, 100%, 50%, 0.5)';
    c.fill(this.path);
    c.restore();
    
    this.biped.draw(c, this);
  }
}