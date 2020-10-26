html['admission'] = `
<div>2021학년도 입학 안내</div>
<br>

<div class="subtle">
한미유치원은 <a href="https://blog.naver.com/go-firstschool" target="_blank">유치원입학관리스템-처음학교로</a></strong>를 통하여 유아모집을 실시합니다. 아래는 <strong><a href="https://drive.google.com/file/d/1g8rct91YMkrzah5O2npGblYBbdM0ruGT/view?usp=sharing" target="_blank">&lt;모집요강&gt;</a></strong>의 간추린 내용입니다.
</div>
<br>

<div>모집 대상</div>
<div class="subtle">
  <ul class="flower">
    <li>2017년생 (만3세) 3학급</li>
    <li>2016년생 (만4세) 1학급</li>
    <li>2015년생 (만5세) 약간명</li>
  </ul>
</div>
<br>

<div>처음학교로 시스템</div>
<div class="subtle">
  <ul class="musical">
    <li>2020년 11월 2일 월요일 ~ 12월 31일 목요일</li>
    <li>우선모집 선발 후 일반모집과 대기자 선발</li>
    <li><a href="https://www.go-firstschool.go.kr" target="_blank">처음학교로 사이트</a> 참고</li>
  </ul>
</div>
<br>

<div>교육설명회</div>
<div class="subtle">
  <strong>비대면: Zoom, 대면: 소그룹</strong><br>
  코로나19로 인하여 단체설명회는 생략하며 비대면(Zoom)과 소그룹(대면) 설명회를 병행합니다.
  <ol>
    <li>비대면(Zoom) 교육설명회:<br>10월 29일 목요일 11시<br>10월 30일 금요일 11시<br>비대면 교육설명회는 필요에 따라 이후 더 열릴 수 있습니다.</li>
    <li>대면(소그룹) 교육설명회:<br>11월 7일 토요일 11시, 1시<br>성인만 참석가능하며, 방역기준을 준수합니다.</li>
  </ol>
  <div><a href="https://forms.gle/eeZWtCEQn47Y1mtTA" target="_blank">교육설명회 신청</a> (링크 클릭)</div>
</div>
<br>

<div class="subtle">
더 자세한 내용은 <strong><a href="https://drive.google.com/file/d/1g8rct91YMkrzah5O2npGblYBbdM0ruGT/view?usp=sharing" target="_blank">&lt;모집요강&gt;</a></strong>을 참고해 주시고, 궁금한 사항은 전화로 문의해 주시면 상세히 답변 드리겠습니다.<br><br>
<a href="tel:031-975-6567">031-975-6567</a>, <a href="tel:031-976-6567">031-976-6567</a>
</div>
<br>

<div>더 살펴보기</div>
<div class="subtle">
  <ul class="leaf">
    <li><a href="https://trello.com/b/sFYg60Ly" target="_blank">한미유치원의 1년</a></li>
    <li><a href="http://www.youtube.com/watch?v=JJtlmzplcWA" target="_blank">한미유치원 하루 일과 (영상)</a></li>
    <li><a href="/?page=hanmi">한미유치원의 역사·문화·환경</a> →</li>
    <li><a href="/?page=thought">한미유치원의 교육에 관한 생각</a> →</li>
    <li><a href="/?page=about_play">영상으로 보는 풍요롭고 재밌는 한미유치원의 놀이</a> →</li>
  </ul>
</div>

<img style="display: block; height: 100px; margin: auto;" src="./images/logotype/hanmi_runner.svg">
`;

class HanmiAdmission {
  constructor() {
    let d = d_child;
    
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
    c.translate(this.x, this.y);
    c.scale(hanmi_base.scale, hanmi_base.scale);
    c.translate(-256, -256);
    c.fillStyle = 'hsla(220deg, 100%, 50%, 0.5)';
    c.fill(this.path);
    c.restore();
    
    this.biped.draw(c, this);
  }
}