class HanmiBase {
  constructor() {
    this.x = 400 + Math.random() * 400;
    this.y = 100 + (1-Math.random()*2) * 50;
    this.vx = 0;
    this.vy = 0;
    this.to_x = 300;
    this.to_y = 100;
    this.scale = 0.3;
    this.to_scale = 0.3;
    
    this.frame_count = 0;
    this.wait = 240;
    this.wait_dur = this.wait;
    
    this.trail = buildRandomCurve([this.x, this.y], [this.to_x, this.to_y], 4 + Math.random()*3 | 0, 200);
  }
  
  update(c) {
    let t = Math.max(1 - this.wait / (this.wait_dur + 100), 1);
    let pos = this.trail[t * (this.trail.length - 1) | 0];
    if(pos) {
      this.vx += (pos[0] - this.x) * 0.1;
      this.vy += (pos[1] - this.y) * 0.1;
      this.x += this.vx * 0.1;
      this.y += this.vy * 0.1;
      this.vx *= 0.9;
      this.vy *= 0.9;
    }
    
    this.scale += (this.to_scale - this.scale) * 0.05;
    
    this.frame_count += 1;
    
    if(this.wait > 0) {
      this.wait -= 1;
      if(this.wait === 0) {
        //this.to_x = Math.random() * c.canvas.width;
        //this.to_y = Math.random() * 200 * 3;
        //this.to_x = eX;
        //this.to_y = eY;
        //this.wait = 120 + Math.random() * 240 | 0;
        //this.wait_dur = this.wait;
        
        //this.trail = buildRandomCurve([this.x, this.y], [this.to_x, this.to_y], 3, 50);
      }
    }
  }
}