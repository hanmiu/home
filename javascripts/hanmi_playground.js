html['playground'] = `
`;

class HanmiPlayground {
  constructor() {
    let d = d_mon3;
    this.path = new Path2D(d);
    
    this.frame_count = 0;
    
    this.x = 400 + Math.random() * 400;
    this.y = 100 + (1-Math.random()*2) * 50;
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
  }
  
  draw(c) {
    c.clearRect(0, 0, c.canvas.width, c.canvas.height);
    
    c.save();
    c.translate(this.x, this.y - 200 * 3);
    c.scale(hanmi_base.scale, hanmi_base.scale);
    c.translate(-256, -256);
    c.fillStyle = 'hsla(90deg, 100%, 50%, 0.5)';
    c.fill(this.path);
    c.restore(); 
  }
}