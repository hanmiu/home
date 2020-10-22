html['about_play'] = `
<div>한미유치원 어린이들의<br>풍요롭고 재미있는 놀이</div>
<br>

<img id="play_as_life" style="display: block; width: 75%; margin: auto;" src="./images/2020/play_as_life.svg">

<br>
<div class="subtle">
  <strong>어린이들의 노래</strong>를 소개합니다.
</div>
<audio id="hanmi_song" style="width: 100%" src="./music/hanmi_song.mp3" controls></audio>

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

<div class="subtle">
준비중 입니다. 그동안 아래 자료를 살펴봐 주세요.
<ul class="flower">
  <li><a href="https://www.youtube.com/c/hanmiu/videos" target="_blank">한미유치원 놀이 영상 모음</a></li>
</ul>
</div>
<br>

<div>더 살펴보기</div>
<div class="subtle">
  <ul class="leaf">
    <li><a href="/?page=thought">한미유치원의 교육에 관한 생각</a> →</li>
    <li><a href="/?page=playground">한미유치원의 디지털 놀이터</a> →</li>
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
    this.commands = [{"f":"moveTo","coords":[26.405,23.245]},{"f":"bezierCurveTo","coords":[26.405,23.245,26.881,26.114,27.22,29.95]},{"f":"moveTo","coords":[11.354,29.95]},{"f":"lineTo","coords":[41.454,29.95]},{"f":"moveTo","coords":[37.19,48.339]},{"f":"bezierCurveTo","coords":[37.19,43.725,33.062,39.98,27.979,39.98]},{"f":"lineTo","coords":[24.83,39.98]},{"f":"bezierCurveTo","coords":[19.746,39.98,15.62,43.725,15.62,48.339]},{"f":"bezierCurveTo","coords":[15.62,52.953,19.746,56.697,24.83,56.697]},{"f":"lineTo","coords":[27.979,56.697]},{"f":"bezierCurveTo","coords":[33.062,56.697,37.19,52.953,37.19,48.339]},{"f":"closePath","coords":[0]},{"f":"moveTo","coords":[54.946,23.241]},{"f":"lineTo","coords":[54.946,60.041]},{"f":"moveTo","coords":[54.945,43.324]},{"f":"lineTo","coords":[64.902,43.324]},{"f":"moveTo","coords":[18.038,66.73]},{"f":"bezierCurveTo","coords":[18.038,71.342,16.822,76.787,25.891,76.76]},{"f":"lineTo","coords":[58.121,76.76]},{"f":"moveTo","coords":[77.431,29.95]},{"f":"lineTo","coords":[100.399,29.95]},{"f":"lineTo","coords":[100.399,63.385]},{"f":"lineTo","coords":[77.431,63.385]},{"f":"closePath","coords":[0]},{"f":"moveTo","coords":[117.555,23.263]},{"f":"lineTo","coords":[117.555,73.417]},{"f":"moveTo","coords":[171.459,34.571]},{"f":"bezierCurveTo","coords":[171.459,28.397,166.278,23.386,159.897,23.386]},{"f":"lineTo","coords":[155.944,23.386]},{"f":"bezierCurveTo","coords":[149.561,23.386,144.382,28.397,144.382,34.571]},{"f":"bezierCurveTo","coords":[144.382,40.744,149.561,45.755,155.944,45.755]},{"f":"lineTo","coords":[159.897,45.755]},{"f":"bezierCurveTo","coords":[166.278,45.755,171.459,40.744,171.459,34.571]},{"f":"closePath","coords":[0]},{"f":"moveTo","coords":[151.173,76.708]},{"f":"bezierCurveTo","coords":[151.173,62.099,152.196,54.288,142.887,53.984]},{"f":"bezierCurveTo","coords":[135.824,53.754,132.047,49.789,131.672,45.756]},{"f":"moveTo","coords":[164.606,76.76]},{"f":"bezierCurveTo","coords":[164.606,62.151,163.644,54.34,172.954,54.036]},{"f":"bezierCurveTo","coords":[180.017,53.806,183.794,50.522,184.168,46.489]},{"f":"moveTo","coords":[193.295,33.337]},{"f":"lineTo","coords":[220.044,33.337]},{"f":"moveTo","coords":[206.677,26.649]},{"f":"bezierCurveTo","coords":[206.677,26.649,208.893,40.002,206.677,46.092]},{"f":"bezierCurveTo","coords":[204.447,52.221,193.314,63.261,193.296,63.429]},{"f":"moveTo","coords":[206.675,46.092]},{"f":"lineTo","coords":[220.043,63.429]},{"f":"moveTo","coords":[233.419,23.263]},{"f":"lineTo","coords":[233.419,73.417]},{"f":"moveTo","coords":[273.707,31.6]},{"f":"bezierCurveTo","coords":[273.707,26.986,269.579,23.241,264.497,23.241]},{"f":"lineTo","coords":[261.348,23.241]},{"f":"bezierCurveTo","coords":[256.264,23.241,252.137,26.986,252.137,31.6]},{"f":"bezierCurveTo","coords":[252.137,36.214,256.264,39.958,261.348,39.958]},{"f":"lineTo","coords":[264.497,39.958]},{"f":"bezierCurveTo","coords":[269.579,39.958,273.707,36.214,273.707,31.6]},{"f":"closePath","coords":[0]},{"f":"moveTo","coords":[246.856,50.012]},{"f":"bezierCurveTo","coords":[263,50.801,272.258,51.404,280.395,46.668]},{"f":"moveTo","coords":[262.923,59.077]},{"f":"bezierCurveTo","coords":[262.923,59.077,263.527,55.428,263.959,50.55]},{"f":"moveTo","coords":[282.312,57.379]},{"f":"lineTo","coords":[292.27,57.379]},{"f":"moveTo","coords":[292.293,23.241]},{"f":"lineTo","coords":[292.293,63.407]},{"f":"moveTo","coords":[253.685,66.73]},{"f":"bezierCurveTo","coords":[253.685,71.342,252.468,76.787,261.537,76.76]},{"f":"lineTo","coords":[293.767,76.76]}];
    
    let for_svg = [];
    this.ptcls = [];
    let hue0 = 120 * Math.random() + 120 * Math.random();
    let hue1 = hue0 + 60 + Math.random() * 60;
    for(let i = 0; i < this.commands.length; i++) {
      let cmd = this.commands[i];
      switch(cmd.f) {
        case 'moveTo':
          for_svg.push('M' + cmd.coords.join(','));
          break;
        case 'lineTo':
          for_svg.push('L' + cmd.coords.join(','));
          break;
        case 'bezierCurveTo':
          for_svg.push('C' + cmd.coords.join(','));
          break;
        case 'closePath':
          for_svg.push('Z');
          break;
      }
      
      if(cmd.f !== 'closePath') {
        let coords = [];
        for(let j = 0; j < cmd.coords.length / 2; j++) {
          let p = new LogoParticle(
            cmd.coords[2 * j + 0], 
            cmd.coords[2 * j + 1],
            [hue0, hue1]
          );
          this.ptcls.push(p);
        }
      }
    }
    let d_str = for_svg.join(' ');
    this.svg = `<svg id="logo" width="100%" height="100%" viewBox="0 0 305 100" version="1.1" xmlns="http://www.w3.org/2000/svg" style="fill:none;stroke:black;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><path d="${d_str}"/></svg>`;
    
    this.frame_count = 0;
  }
  
  update() {
    for(let i = 0; i < this.ptcls.length; i++) {
      this.ptcls[i].update();
    }
    
    this.frame_count += 1;
    if(this.frame_count > 300) {
      for(let i = 0; i < this.ptcls.length; i++) {
        this.ptcls[i].to_r = 0;
      }
    }
  }
  
  draw(c) {
    //c.globalCompositeOperation = 'soft-light';
    
    let t = 1 - Math.max(this.frame_count - 360, 0) / 60;
    let gray = t * 255 | 0;
    
    //c.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
    c.clearRect(0, 0, c.canvas.width, c.canvas.height);
    
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.lineWidth = 3;
    
    c.save();
    c.translate(c.canvas.width / 2, c.canvas.height / 2 - 50);
    c.translate(-305 / 2, -35);
    
    for(let i = 0; i < this.ptcls.length; i++) {
      if(i % 2 === 0) {
        let p = this.ptcls[i];
        c.beginPath();
        c.arc(p.x, p.y, Math.abs(p.r), 0, Math.PI * 2);
        c.fillStyle = `hsla(${p.hue}deg, 100%, ${90 * t}%, ${0.9 + 0.1 * (1 - t)})`;
        c.fill();  
      }
    }
    
    c.beginPath();
    for(let i = 0; i < this.commands.length; i++) {
      let cmd = this.commands[i];
      c[cmd.f].apply(c, cmd.coords);
    }
    c.strokeStyle = `black`;
    c.stroke();
    
    for(let i = 0; i < this.ptcls.length; i++) {
      if(i % 2 !== 0) {
        let p = this.ptcls[i];
        c.beginPath();
        c.arc(p.x, p.y, Math.abs(p.r) * 0.5, 0, Math.PI * 2);
        //c.fillStyle = `hsla(${p.hue}deg, 100%, ${90 * t}%, ${0.9 + 0.1 * (1 - t)})`;
        //c.fillStyle = `hsla(${p.hue}deg, 100%, ${85 * t}%, ${0.5 + 0.5 * (1 - t)})`;
        c.fillStyle = `hsla(${p.to_hue}deg, 100%, ${(85 * t)}%, 1)`;
        //c.fillStyle = `hsla(${p.to_hue}deg, 100%, 85%, 1)`;
        c.fill();
      }
    }
    
    
    c.restore();
  }
}