html['about_play'] = `
<div>한미유치원 어린이들의<br>풍요롭고 재미있는 놀이</div>
<br>

<div style="position: relative;">
  <div id="musical_container" style="position: absolute; width: 100%"></div>
  <img id="play_as_life" style="display: block; width: 75%; margin: auto;" src="./images/2020/play_as_life.svg">
</div>

<br>
<div class="subtle">
  <strong>어린이들의 노래</strong>를 소개합니다.
</div>
<div id="song_container">
</div>

<div class="subtle">
  <ul class="musical">
    <li class="bambini">우리는 서로 다르지만<br>모두가 좋아하는게 있지</li>
    <li class="bambini">친구와 함께 할 수 있고<br> 마음이 행복해지는 마법, 놀이!</li>
    <li class="bambini">놀이는 그냥 재미있어<br>친구와 함께라서 더 재밌어</li>
    <li class="bambini">찰흙, 블록, 종이만 있다면<br>우리는 뭐든지 만들 수 있어!</li>
    <li class="bambini">내 마음에 생겨난 하트를<br>친구에게 나누어 줄거야</li>
    <li class="bambini">놀이는 어린이들의 삶이다</li>
    <li class="bambini">놀이는 어린이들의 삶이다</li>
    <li class="bambini">놀이는 어린이들의 삶이다</li>
    <li class="bambini">마음이 행복해지는 마법, 놀이!</li>
  </ul>
</div>
<div style="margin-bottom: 0.5em; text-align: right; font-size: 0.5em">작곡·작사: 박서희, 황보선<br>노래: 2019 개나리반 어린이들</div>
<br>

<div>도전하는 도미노</div>
<br>
<div class="iframe-container">
  <iframe class="video" src="https://www.youtube.com/embed/hrxF_ik4Pk4" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
<div style="margin-bottom: 0.5em; text-align: right; font-size: 0.5em">2015 종달새반 어린이들</div>
<br>
<div class="subtle">
  <a href="/?page=hanmi" target="_blank">어린이들이 한미유치원에서 경험할 수 있는 것</a>에 나오는 <span class="bambini">“노력하면 <strong>할 수 있다</strong>. 시행착오를 인정하고 다시 도전하는 방법 터득하기. 즐겁게 놀았던 경험 쌓기. 마음의 힘을 키우기.”</span> 등을 잘 보여주는 한미유치원 놀이 속 한 장면입니다.
</div>
<br>

<div class="subtle">
계속 준비중 입니다. 그동안 아래 자료를 살펴봐 주세요. 어린이들이 졸업한 후 공개하는 놀이와 그 의미에 관한 영상입니다.  
<ul class="flower">
  <li><a href="https://www.youtube.com/c/hanmiu/videos" target="_blank">한미유치원 놀이 영상 모음</a></li>
</ul>
</div>
<br>

<div>더 살펴보기</div>
<div class="subtle">
  <ul class="leaf">
    <li><a href="/?page=hanmi">한미유치원의 역사·문화·환경</a> →</li>
    <li><a href="/?page=thought">한미유치원의 교육에 관한 생각</a> →</li>
    <li><a href="/?page=playground">한미유치원의 디지털 놀이터 - 어린이들의 놀이를 지원하기 위한 건강한 미디어</a> →</li>
  </ul>
</div>
<!--
<div style="display: flex; justify-content: center">
  <img style="height: 100px" src="./images/logotype/hanmi_runner.svg">
</div>
-->
<img style="display: block; height: 100px; margin: auto;" src="./images/logotype/hanmi_runner.svg">
`;

class HanmiAboutPlay {
  constructor() {
    let d = d_mon2;
    this.path = new Path2D(d);
    
    this.coords = [];
    for(let i = 0; i < 100; i++) {
      this.coords.push([
        Math.random() * 400,
        Math.random() * 400
      ]);
    }
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
    c.translate(this.x, this.y - 200 * 2);
    c.scale(hanmi_base.scale, hanmi_base.scale);
    c.translate(-256, -256);
    c.fillStyle = 'hsla(320, 100%, 50%, 0.5)';
    c.fill(this.path);
    c.restore();
    
    this.biped.draw(c, this);
  }
}