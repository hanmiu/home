class HanmiMusical {
  constructor() {
    this.audio_ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.song_source = this.audio_ctx.createMediaElementSource(audio_hanmi_song);
    this.analyser = this.audio_ctx.createAnalyser();
    this.song_source.connect(this.analyser);
    this.analyser.connect(this.audio_ctx.destination);
    this.analyser.fftSize = 2048;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
    this.freqArray = new Uint8Array(this.bufferLength);
    //this.analyser.getByteTimeDomainData(this.dataArray);
    
    this.ptcls = [];
    for(let i = 0; i < 19; i++) {
      let url = `./images/musical/note(${i + 1}).png`;
      let img = new Image();
      img.src = url;
      let p = {
        img: img,
        x: 256,
        y: 256,
        to_x: 256,
        to_y: 256,
        vx: 0,
        vy: 0,
        scale: 1,
        to_scale: 1,
        rot: 0,
        v_rot: 0,
        to_rot: 0
      }
      this.ptcls.push(p);
    }
    shuffle(this.ptcls);
    
    this.x_period = 1;
    this.y_period = 1;
    this.frame_count = 0;
    this.last_vol = 0;
    this.mode = 1;
    
    // hsl(57, 99, 50) , hsl(183, 59, 49)
    this.hsl = [57, 99, 50];
    this.to_hsl = [57, 99, 50];
    
    this.slot = Array(19).fill(true);
  }
  
  update(c) {
    this.analyser.getByteTimeDomainData(this.dataArray);
    this.analyser.getByteFrequencyData(this.freqArray);
    this.frame_count += 1;
  }
  
  draw(c) {
    let time = this.frame_count / 60;
    let r = c.canvas.height * 0.5 * 0.5;
    let dr = (c.canvas.height * 0.5 - r) * 0.75;
    let cx = c.canvas.width * 0.5 - 20;
    let cy = c.canvas.height * 0.5;
    
    c.clearRect(0, 0, c.canvas.width, c.canvas.height);
    c.beginPath();
    let vol = 0;
    for(let i = 0; i < this.bufferLength; i++) {
      let t = i / (this.bufferLength - 1);
      let v = this.dataArray[i] / 128.0;
      let f = this.freqArray[i] / 128.0;
      vol += f;
      let rr = (r + 1.5 * dr * v) * 0.6;
      
      let x = cx + rr * Math.cos(t * Math.PI * 2 * this.x_period - time * 0.1);
      let y = cy + rr * Math.sin(t * Math.PI * 2 * this.y_period - time * 0.1);
      if(this.mode !== 2) {
        if(i === 0) {
          c.moveTo(x, y);
        } else {
          c.lineTo(x, y);
        }  
      }
      
      let j = t * (this.ptcls.length - 1) | 0;
      let tt = j / this.ptcls.length;
      x = cx + rr * Math.cos(tt * Math.PI * 2 * this.x_period - time * 0.1);
      y = cy + rr * Math.sin(tt * Math.PI * 2 * this.y_period - time * 0.1);
      let p = this.ptcls[j];
      p.to_x = x;
      p.to_y = y;
      p.to_scale = 0.9 + f;
      if(this.mode === 3) {
        p.to_rot = (tt * Math.PI * 2 * this.x_period - time * 0.1) % (2 * Math.PI) + Math.PI*0.5;  
      }
    }
    vol = vol / this.bufferLength;
    //c.strokeStyle = 'rgb(254, 240, 1)';
    c.lineWidth = 5;
    this.hsl[0] += (this.to_hsl[0] - this.hsl[0]) * 0.05;
    this.hsl[1] += (this.to_hsl[1] - this.hsl[1]) * 0.05;
    this.hsl[2] += (this.to_hsl[2] - this.hsl[2]) * 0.05;
    c.strokeStyle = `hsl(${this.hsl[0]},${this.hsl[1]}%,${this.hsl[2]}%)`;
    c.stroke();
    
    for(let i = 0; i < this.ptcls.length; i++) {
      let p = this.ptcls[i];
      p.vx += (p.to_x - p.x) * 0.25;
      p.vy += (p.to_y - p.y) * 0.25;
      p.x += p.vx * 0.1;
      p.y += p.vy * 0.1;
      p.vx *= 0.8;
      p.vy *= 0.8;
      p.scale += (p.to_scale - p.scale) * 0.25;
      p.v_rot += (p.to_rot - p.rot) * 0.1;
      p.rot += p.v_rot * 0.1;
      p.v_rot *= 0.9;
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rot);
      c.scale(0.25 * p.scale, 0.25 * p.scale);
      c.drawImage(p.img, -64, -64);
      c.restore();
    }
    
    let pt = audio_hanmi_song.currentTime;
    if(pt < 8.43) { // 띵~
      if(this.slot[0]) {
        this.slot[0] = false;
        this.mode = 1;
        this.to_hsl = [57, 99, 50];
        for(let i = 0; i < this.ptcls.length; i++) {
          this.ptcls[i].to_rot = 0;
        }
      }  
    }
    else if(pt < 17.31) { // 친
      if(this.slot[1]) {
        this.slot[1] = false;
        this.mode = 2;
        for(let i = 0; i < this.ptcls.length; i++) {
          this.ptcls[i].to_rot = (Math.random() * 2 - 1) * Math.PI * 0.25;
        }
      }      
    }
    else if(pt < 24.4) { // 마법~
      if(this.slot[2]) {
        this.slot[2] = false;
        this.mode = 2;
        this.x_period = 1.5 * 3;
        this.y_period = 1 * 3;
        for(let i = 0; i < this.ptcls.length; i++) {
          this.ptcls[i].to_rot = (Math.random() * 2 - 1) * Math.PI * 0.25;
        }
      }      
    }
    else if(pt < 26.8) { // 놀~
      if(this.slot[3]) {
        this.slot[3] = false;
        this.mode = 2;
        this.ptcls.unshift(this.ptcls.pop());
      }       
    }
    else if(pt < 30.6) { // 친~
      if(this.slot[4]) {
        this.slot[4] = false;
        this.mode = 1;
        this.x_period = 1;
        this.y_period = 1;
      }      
    }
    else if(pt < 34.4) { // 찰~
      if(this.slot[5]) {
        this.slot[5] = false;
        this.mode = 3;
        this.x_period = 1;
        this.y_period = 1;
      }      
    }
    else if(pt < 42) { // 내~
      if(this.slot[6]) {
        this.slot[6] = false;
        this.mode = 2;
        this.x_period = 1.25 * 10;
        this.y_period = 1 * 10;
        for(let i = 0; i < this.ptcls.length; i++) {
          this.ptcls[i].to_rot = (Math.random() * 2 - 1) * Math.PI;
        }
      }       
    }
    else if(pt < 49.77) { // 친~
      if(this.slot[7]) {
        this.slot[7] = false;
        this.mode = 1;
        this.x_period = 1;
        this.y_period = 1;
        for(let i = 0; i < this.ptcls.length; i++) {
          this.ptcls[i].to_rot = 0;
        }
      }       
    }
    else if(pt < 56.5) { // 놀~ (후)
      if(this.slot[8]) {
        this.slot[8] = false;
        this.ptcls.unshift(this.ptcls.pop());
        for(let i = 0; i < this.ptcls.length; i++) {
          this.ptcls[i].to_rot = (Math.random() * 2 - 1) * Math.PI;
        }
      }      
    }
    else if(pt < 60.58) { // 놀~ (후)
      this.to_hsl = [171, 100, 80];     
    }
    else if(pt < 64.56) { // 놀~ (후)
      this.to_hsl = [201, 100, 66];       
    }
    else if(pt < 68.42) { // 놀~ (후)
      this.to_hsl = [284, 100, 67];    
    }
    else if(pt < 70.79) { // 마~
      if(this.slot[9]) {
        this.slot[9] = false;
        this.mode = 3;
        this.x_period = 1;
        this.y_period = 1;
        this.to_hsl = [32, 100, 62]; 
      }       
    }
    else if(pt < 76.62) { // 놀~ (그냥)
      if(this.slot[10]) {
        this.slot[10] = false;
        this.to_hsl = [57, 99, 50];
      }       
    }
    else if(pt < 80.27) { // 친~
      if(this.slot[11]) {
        this.slot[11] = false;
        this.mode = 2;
        this.x_period = 1.5 * 3;
        this.y_period = 1 * 3;
        for(let i = 0; i < this.ptcls.length; i++) {
          this.ptcls[i].to_rot = (Math.random() * 2 - 1) * Math.PI * 0.25;
        }
      }       
    }
    else if(pt < 83.95) { // 찰~
      if(this.slot[12]) {
        this.slot[12] = false;
        this.mode = 3;
        this.x_period = 1;
        this.y_period = 1;
        this.ptcls.unshift(this.ptcls.pop());
      }       
    }
    else if(pt < 91.68) { // 내~
      if(this.slot[13]) {
        this.slot[13] = false;
        this.mode = 2;
        this.x_period = 1.5 * 3;
        this.y_period = 1 * 3;
        for(let i = 0; i < this.ptcls.length; i++) {
          this.ptcls[i].to_rot = (Math.random() * 2 - 1) * Math.PI * 0.1;
        }
      }      
    }
    else if(pt < 98.84) { // 친~
      if(this.slot[14]) {
        this.slot[14] = false;
        this.x_period = 1;
        this.y_period = 1;
        this.mode = 3;
      }       
    }
    else if(pt < 105.88) { // 놀~ (후)
      if(this.slot[15]) {
        this.slot[15] = false;
        this.ptcls.unshift(this.ptcls.pop());
      }       
    }
    else if(pt < 109.75) { // 놀~ (후)
      this.to_hsl = [323, 100, 50];        
    }
    else if(pt < 113.57) { // 놀~ (후)
      this.to_hsl = [268, 100, 50];       
    }
    else if(pt < 117.31) { // 마~(음)
      if(this.slot[16]) {
        this.slot[16] = false;
        this.to_hsl = [183, 59, 49];
        this.mode = 1;
        for(let i = 0; i < this.ptcls.length; i++) {
          this.ptcls[i].to_rot = (Math.random() * 2 - 1) * Math.PI * 0.1;
        }
        shuffle(this.ptcls);
      }      
    }
    else if(pt < 119.92) { // 마~(법)
      if(this.slot[17]) {
        this.slot[17] = false;
        this.to_hsl = [57, 99, 50];
        for(let i = 0; i < this.ptcls.length; i++) {
          this.ptcls[i].to_rot = (Math.random() * 2 - 1) * Math.PI;
        }
      }       
    }
    else if(pt < 121.01) { // 놀이~
      if(this.slot[18]) {
        this.slot[18] = false;
        this.mode = 2;
        this.ptcls.unshift(this.ptcls.pop());
        for(let i = 0; i < this.ptcls.length; i++) {
          this.ptcls[i].to_rot = 0;
        }
        this.slot = Array(19).fill(true);
      }       
    }
    
    /*
    8.43 // 띵~
    24.4 // 마법~
    26.8 // 놀~
    30.6 // 친~
    34.44 // ?
    42 // 내~
    49.77 // 친~
    56.5 // 놀~ (후)
    70.79 // 마~
    76.62 // 놀~ (그냥)
    80.27 // 친~
    83.95 // 찰~
    91.68 // 내~
    98.84 // 친~
    105.88 // 놀~
    117.31 // 마~(음)
    119.92 // 마~(법)
    */
    
    //if(vol - this.last_vol > 0.03) { }
    
    this.last_vol = vol;
  }
}