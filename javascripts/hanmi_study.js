html['study'] = `
  <div>현장 연구, 교사 연수</div>
  <br>
  
  <div class="subtle">(점진적으로 보완하며 계속 준비 중 입니다)</div> 
  <br>

  <div>현장 연구</div>
  <br>
  <div class="subtle">한미유치원은 다양한 방식으로 현장의 연구를 외부와 공유하고 있습니다.</div>

  <div class="subtle">
    <ul class="flower">
      <li><a href="https://drive.google.com/file/d/13MgcFyn4ZPkZzABfBwwIyT7j6CQtaFyF/view?usp=sharing" target="_blank">기록작업의 선순환과 신임교사 교육</a></li>
      <li><a href="https://www.youtube.com/watch?v=ph5UTocxw9M" target="_blank">연구 과제를 보고 (신임 교사 교육)</a></li>
      <li><a href="https://drive.google.com/file/d/1Bre-mBU9s-_wfGbc4FZAqCoqzO0G1pve/view?usp=sharing" target="_blank">몸글자 되돌아 보며, 그 의미를 다시 짚어 보기</a></li>
      <li><a href="https://drive.google.com/file/d/0BwNA5QSGhdCgY2VGQi1Fdk1vNzA/view" target="_blank">종이 상자 공룡의 골판지 뿔 - 블록 놀이에 새로운 가능성을 가져온 자료로서 종이</a></li>
      <li><a href="https://www.youtube.com/watch?v=HbvYkkT3FoE" target="_blank">‘이만큼’이 얼마만큼이야? - 일상의 관찰과 탐구가 배움으로 연결되는 과정</a></li>
      <li><a href="https://docs.google.com/document/d/1O_5P0g-UuknP00l7tBCq15znpRIOpfywsDJwFei3ilo/edit?usp=sharing" target="_blank">확실함과 불확실함 사이를 넘나들기</a></li>
    </ul>
  </div> 
  <br>

  <div>교사 연수</div>
  <br>
  <div class="subtle">국내외 대학이나 유아교육기관이 한미유치원을 방문하는 연수가 있습니다.</div> 
  <br>
  <!--
  <div class="subtle">
    <ul class="flower">
    <li><a href="https://www.notion.so/2020-af348ba4e67c4cceb682f14b646c7379" target="_blank">2020 한미유치원 놀이 연수 (<strong>2020년 11월 30일 ~ 12월 7일</strong>, 비대면)</a></li>
    <li><a href="https://forms.gle/idqRiKSkuxi54vDT7" target="_blank">한미유치원 놀이 연수 알림</a>에 신청해 주시면 이후 놀이 연수가 기획될 때 알림을 드립니다.</li>
    </ul>
  <br>
  -->

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

class HanmiStudy {
  constructor() {
    let d = d_mon4;
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
    c.translate(this.x, this.y - 200 * 6);
    c.scale(hanmi_base.scale, hanmi_base.scale);
    c.translate(-256, -256);
    c.fillStyle = 'hsla(300, 100%, 50%, 0.5)';
    c.fill(this.path);
    c.restore(); 
    
    this.biped.draw(c, this);
  }
}