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
    c.strokeStyle = 'rgb(254, 240, 1)';
    c.lineWidth = 5;
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
    
    if(vol - this.last_vol > 0.03) {
      this.ptcls.unshift(this.ptcls.pop());
      if(Math.random() > 0.5) {
        this.x_period = 1.5 * 3;
        this.y_period = 1 * 3;
        this.mode = 2;
        for(let i = 0; i < this.ptcls.length; i++) {
          this.ptcls[i].to_rot = (Math.random() * 2 - 1) * Math.PI * 0.25;
        }
      }
      else {
        this.x_period = 1;
        this.y_period = 1;
        this.mode = 1;
        if(Math.random() > 0.5) {
          this.mode = 3;
        }
        for(let i = 0; i < this.ptcls.length; i++) {
          this.ptcls[i].to_rot = (Math.random() * 2 - 1) * Math.PI * 0.1;
        }
      }
    }
    
    this.last_vol = vol;
  }
}