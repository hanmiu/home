html['parent'] = `
  <div>공유 모임과 참여 수업</div>
  <br>
  
  <div class="subtle">
  (조금씩 보완하며 준비 중 입니다.)
  </div> 
  <br>

  <div>공유 모임</div>
  <br>
  <div class="subtle">
  공유 모임을 통해 교실의 놀이 이야기를 가정과 공유합니다. 부모가 서로 교제하는 시간, 교사의 발표, 워크숍 등이 혼합되어 진행되는 공유 모임은 준비하는 과정에서 교사가 수업을 회고하며 의미를 되새기는 경험을 장려하고 사전 교사 협의를 통해 교육 과정을 조정하는 장학의 역할을 합니다. 공유(부모, 다른 교사)를 통해 피드백을 주고 받으며 어린이의 놀이를 지원할 수 있는 새로운 아이디어를 얻습니다. 2020학년도는 코로나19 상황으로 &lt;비대면&gt; 방식으로 이루어졌습니다.<br>(준비 중 입니다)
  </div>
  <br>

  <div>참여 수업</div>
  <br>
  <div class="subtle">
    <div>한미유치원의 다양한 놀이를 날줄과 씨줄로 엮는 참여 수업에 관한 이야기입니다. 2017-2019학년도 2학기 참여 수업은 우리반의 놀이만 아니라 다른 반의 놀이에도 참여할 수 있는 방식으로 이루어졌습니다. 부모만 아니라 형제까지 참여하며 놀이를 경험하고 그 의미에 관해 생각해 볼 수 있는 가족 행사이기도 합니다.</div>
    <ul class="musical">
      <li><a href="https://docs.google.com/document/d/1YluXZ-HvlbjgjeQI89ORJCs75_SnmFKUcx1fB--9yqU/view" target="_blank">2017 벼룩시장</a></li>
      <li><a href="https://docs.google.com/document/d/1yZu8Pt3nYTMR1Zs17U5BEG83POhI7FT3OGwvEHcniME/view" target="_blank">2018 일상 속의 호기심 탐구 창의성</a></li>
      <li><a href="https://docs.google.com/document/d/1eAQG5oD5-3gvaRLk1dHLknQLoFbUyz4ulY4_bKLZMpY/edit?usp=sharing" target="_blank">2019 ‘놀이의 힘’이 속해 있는 맥락</a></li>
    </ul>
  </div>
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

class HanmiParent {
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
    c.translate(this.x, this.y - 200 * 4);
    c.scale(hanmi_base.scale, hanmi_base.scale);
    c.translate(-256, -256);
    c.fillStyle = 'hsla(300, 100%, 50%, 0.5)';
    c.fill(this.path);
    c.restore(); 
    
    this.biped.draw(c, this);
  }
}