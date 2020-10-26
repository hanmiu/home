class Biped {
  constructor() {
    let p = [];
    let cx = 0;
    let cy = 0;

    // pelvis
    p[0] = { x: cx, y: cy };
    p[1] = { x: cx, y: cy - 0.5 };
    p[2] = { x: cx, y: cy - 1 };
    p[3] = { x: cx, y: cy - 0.5 };
    p[4] = { x: cx, y: cy - 1 };

    // shoulder
    cy = 1;
    p[5] = { x: cx + 0.1, y: cy };
    p[6] = { x: cx + 0.1, y: cy - 0.5 };
    p[7] = { x: cx + 0.1, y: cy - 1 };
    p[8] = { x: cx + 0.1, y: cy - 0.5 };
    p[9] = { x: cx + 0.1, y: cy - 1 };

    // waist
    cy = 0;
    p[10] = { x: cx, y: cy + 0.2 };
    // head
    p[11] = { x: cx + 0.1, y: cy + 1.8 };

    // tail
    p[12] = { x: cx - 0.8, y: cy + 1.8 };
    p[13] = { x: cx - 1.2, y: cy + 1.6 };

    let scope = this;
    scope.head = p[11];
    scope.p = p;
    scope.x = 0;
    scope.y = 0;
    scope.speed = 2;
    scope.stride_a = 1;
    scope.stride_b = 1;
    scope.leg_angle = -Math.PI * 0.4;
    scope.arm_angle = -Math.PI * 0.6;
    scope.scale = 30;
    scope.strokeStyle = '#eb7c62';
    let hue = Math.random() * 360 | 0;
    let sat = 100;
    let d_lig = Math.random() * 20 | 0;
    let lig = 50 + d_lig;
    scope.color_front = `hsl(${hue}deg, ${sat}%, ${lig}%)`;
    scope.color_middle = `hsl(${hue}deg, ${sat}%, ${lig - 5 - (d_lig/3 | 0)}%)`;
    scope.color_back = `hsl(${hue}deg, ${sat}%, ${lig - 10 - (d_lig/3 | 0)}%)`;
    scope.color_eye = `hsl(${Math.random() * 360 | 0}deg, ${sat}%, ${lig - 20 - (d_lig/3 | 0)}%)`;
    scope.lineWidth = 0.25;

    scope.t = 0;
    scope.repeated = 0;
    scope.max_repeat = 3;
    scope.volume = 0;
    scope.shout = false;
    scope.beat = 0;
  }
  
  reform() {
    let scope = this;
    let hue = Math.random() * 360 | 0;
    let sat = 100;
    let d_lig = Math.random() * 20 | 0;
    let lig = 50 + d_lig;
    scope.color_front = `hsl(${hue}deg, ${sat}%, ${lig}%)`;
    scope.color_middle = `hsl(${hue}deg, ${sat}%, ${lig - 5 - (d_lig/3 | 0)}%)`;
    scope.color_back = `hsl(${hue}deg, ${sat}%, ${lig - 10 - (d_lig/3 | 0)}%)`;
    scope.color_eye = `hsl(${Math.random() * 360 | 0}deg, ${sat}%, ${lig - 20 - (d_lig/3 | 0)}%)`;
  }
  
  update(time) {
    let scope = this;
    let p = scope.p;
    
    scope.x += 1;

    let angle0 = 0;
    let angle1 = 0;
    let t = time * scope.speed * world_tempo;
    scope.t = t;
    let h = 0.775;
    let sa = scope.stride_a;
    let sb = scope.stride_b;
    let la = scope.leg_angle;
    let aa = scope.arm_angle;

    let tt = t * 4; 

    p[0].y = h + motor(-0.1, 0.2, t * 4);
    angle0 = la + sa * Math.PI * motor(-0.2, 0.2, t * 2 + Math.PI * 0.5);
    angle1 = la + sa * Math.PI * motor(-0.2, 0.2, t * 2 - Math.PI * 0.5);
    rotate_from_origin(p[0], p[1], 0.3, angle0); 
    rotate_from_origin(p[0], p[3], 0.3, angle1); 
    angle0 += sb * -motor(0, Math.PI * 0.5, t * 2 + Math.PI);
    angle1 += sb * -motor(0, Math.PI * 0.5, t * 2 + Math.PI + Math.PI);
    rotate_from_origin(p[1], p[2], 0.3, angle0);
    rotate_from_origin(p[3], p[4], 0.3, angle1);

    t += Math.PI * 0.5;
    p[5].y = h + 0.5 + motor(-0.1, 0.2, t * 4);
    angle0 = aa + sa * Math.PI * motor(-0.2, 0.2, t * 2 + Math.PI * 0.5);
    angle1 = aa + sa * Math.PI * motor(-0.2, 0.2, t * 2 - Math.PI * 0.5);
    rotate_from_origin(p[5], p[6], 0.4, angle0); 
    rotate_from_origin(p[5], p[8], 0.4, angle1); 
    angle0 += sb * motor(0, Math.PI * 0.5, t * 2 + Math.PI);
    angle1 += sb * motor(0, Math.PI * 0.5, t * 2 + Math.PI + Math.PI);
    rotate_from_origin(p[6], p[7], 0.4, angle0);
    rotate_from_origin(p[8], p[9], 0.4, angle1);

    //p[10].y = h + 0.25 * motor(-0.1, 0.2, t * 4 - Math.PI * 0.5);
    rotate_from_origin(p[0], p[10], 0.2, Math.PI * 0.5 + motor(-0.1, 0.1, t * 4));
    rotate_from_origin(p[5], p[11], 0.3, Math.PI * 0.5 + motor(-0.1, 0.1, t * 4));

    rotate_from_origin(p[0], p[12], 0.35, Math.PI * 0.9);
    rotate_from_origin(p[12], p[13], 0.35, Math.PI * 0.5 + motor(-0.1, 0.1, t * 3));
  }
  
  draw(g, v) {
    let scope = this;
    let p = scope.p;

    g.lineWidth = scope.lineWidth;
    g.lineCap = 'round';
    g.lineJoin = 'round';
    //g.strokeStyle = scope.strokeStyle;
    g.fillStyle = scope.strokeStyle;

    g.save();
    g.translate(scope.x, scope.y + g.canvas.height);
    g.scale(scope.scale, -scope.scale);

    // back legs
    g.lineWidth = scope.lineWidth;
    g.beginPath();
    g.moveTo(p[0].x, p[0].y);
    g.bezierCurveTo(p[1].x, p[1].y, p[1].x, p[1].y, p[2].x, p[2].y);
    g.moveTo(p[5].x, p[5].y);  
    g.bezierCurveTo(p[6].x, p[6].y, p[6].x, p[6].y, p[7].x, p[7].y);
    g.strokeStyle = scope.color_back;
    g.stroke();
    
    // tail
    g.lineWidth = scope.lineWidth * 0.5;
    g.beginPath();
    g.moveTo(p[0].x, p[0].y);
    g.bezierCurveTo(p[0].x, p[0].y, p[12].x, p[12].y, p[13].x, p[13].y);
    g.strokeStyle = scope.color_middle;
    g.stroke();
    
    // body + neck
    g.lineWidth = scope.lineWidth * 1;
    g.beginPath();
    g.moveTo(p[0].x, p[0].y);
    g.bezierCurveTo(p[10].x, p[10].y, p[10].x, p[10].y, p[5].x, p[5].y);
    g.lineTo(p[11].x, p[11].y);
    g.strokeStyle = scope.color_front;
    g.stroke();
    
    // front legs
    g.lineWidth = scope.lineWidth * 1;
    g.beginPath();
    g.moveTo(p[0].x, p[0].y);
    g.bezierCurveTo(p[3].x, p[3].y, p[3].x, p[3].y, p[4].x, p[4].y);
    g.moveTo(p[5].x, p[5].y);
    g.bezierCurveTo(p[8].x, p[8].y, p[8].x, p[8].y, p[9].x, p[9].y);
    g.strokeStyle = scope.color_front;
    g.stroke();

    // head
    //g.drawImage(scope.gh.canvas, p[11].x - 0.1, p[11].y - 0.2, scope.gh.canvas.width / scope.gh.canvas.height * 0.5, 0.5);
    g.beginPath();
    g.arc(p[11].x+0.05, p[11].y, 0.25, 0, Math.PI * 2);
    g.arc(p[11].x+0.1, p[11].y, 0.22, 0, Math.PI * 2);
    g.fillStyle = scope.color_front;
    g.fill();
    
    // eye white
    g.beginPath();
    g.arc(p[11].x+0.09, p[11].y + 0.05, 0.1, 0, Math.PI * 2);
    g.fillStyle = 'white';
    g.fill();
    
    // eye pupil
    let dx = v.x - scope.x;
    let dy = (g.canvas.height - p[11].y * scope.scale) - v.y % g.canvas.height;
    let d = Math.sqrt(dx*dx + dy*dy) + 1e-6;
    let ux = dx / d;
    let uy = dy / d;
    let r = 0.04;
    g.beginPath();
    g.arc(p[11].x + 0.09 + r*ux, p[11].y + 0.05 + r*uy, 0.07, 0, Math.PI * 2);
    g.fillStyle = scope.color_eye;
    g.fill();
    
    // eye lid
    if(v.y % g.canvas.height < g.canvas.height * 0.9) {
      let lid_r = 0.12;
      let lid_close = Math.pow(Math.sin(scope.t)*0.5+0.5, 100);
      g.beginPath();
      g.ellipse(p[11].x+0.09, p[11].y + 0.05 + lid_r*(1 - lid_close), lid_r, lid_r*lid_close, 0, 0, Math.PI * 2);
      g.fillStyle = scope.color_middle;
      g.fill();  
    }
    
    g.restore();
  }
}

class Quadruped {
  constructor() {
    let p = [];
    let cx = 0;
    let cy = 0;

    // pelvis
    p[0] = { x: cx - 0.55, y: cy };
    p[1] = { x: cx - 0.55, y: cy - 0.5 };
    p[2] = { x: cx - 0.55, y: cy - 1 };
    p[3] = { x: cx - 0.55, y: cy - 0.5 };
    p[4] = { x: cx - 0.55, y: cy - 1 };

    // shoulder
    p[5] = { x: cx + 0.55, y: cy };
    p[6] = { x: cx + 0.55, y: cy - 0.5 };
    p[7] = { x: cx + 0.55, y: cy - 1 };
    p[8] = { x: cx + 0.55, y: cy - 0.5 };
    p[9] = { x: cx + 0.55, y: cy - 1 };

    // waist
    p[10] = { x: cx - 0.1, y: cy + 0.2 };
    // head
    p[11] = { x: cx + 0.56, y: cy + 1.6 };

    // tail
    p[12] = { x: cx - 0.8, y: cy + 1.8 };
    p[13] = { x: cx - 1.2, y: cy + 1.6 };

    let scope = this;
    scope.head = p[11];
    scope.p = p;
    scope.x = 0;
    scope.y = 0;
    scope.speed = 2;
    scope.stride_a = 1;
    scope.stride_b = 1;
    scope.leg_angle = -Math.PI * 0.4;
    scope.arm_angle = -Math.PI * 0.6;
    scope.scale = 30;
    scope.strokeStyle = '#eb7c62';
    let hue = Math.random() * 360 | 0;
    let sat = 100;
    let d_lig = Math.random() * 20 | 0;
    let lig = 50 + d_lig;
    scope.color_front = `hsl(${hue}deg, ${sat}%, ${lig}%)`;
    scope.color_middle = `hsl(${hue}deg, ${sat}%, ${lig - 5 - (d_lig/3 | 0)}%)`;
    scope.color_back = `hsl(${hue}deg, ${sat}%, ${lig - 10 - (d_lig/3 | 0)}%)`;
    scope.color_eye = `hsl(${Math.random() * 360 | 0}deg, ${sat}%, ${lig - 20 - (d_lig/3 | 0)}%)`;
    scope.lineWidth = 0.25;

    scope.t = 0;
    scope.repeated = 0;
    scope.max_repeat = 3;
    scope.volume = 0;
    scope.shout = false;
    scope.beat = 0;
  }
  
  reform() {
    let scope = this;
    let hue = Math.random() * 360 | 0;
    let sat = 100;
    let d_lig = Math.random() * 20 | 0;
    let lig = 50 + d_lig;
    scope.color_front = `hsl(${hue}deg, ${sat}%, ${lig}%)`;
    scope.color_middle = `hsl(${hue}deg, ${sat}%, ${lig - 5 - (d_lig/3 | 0)}%)`;
    scope.color_back = `hsl(${hue}deg, ${sat}%, ${lig - 10 - (d_lig/3 | 0)}%)`;
    scope.color_eye = `hsl(${Math.random() * 360 | 0}deg, ${sat}%, ${lig - 20 - (d_lig/3 | 0)}%)`;
  }
  
  update(time) {
    let scope = this;
    let p = scope.p;
    
    scope.x += 1;

    let angle0 = 0;
    let angle1 = 0;
    let t = time * scope.speed * world_tempo;
    scope.t = t;
    let h = 0.775;
    h = 1.15;
    let sa = scope.stride_a;
    let sb = scope.stride_b;
    let la = scope.leg_angle;
    let aa = scope.arm_angle;

    let tt = t * 4; 

    p[0].y = h + motor(-0.1, 0.2, t * 4);
    angle0 = la + sa * Math.PI * motor(-0.2, 0.2, t * 2 + Math.PI * 0.5);
    angle1 = la + sa * Math.PI * motor(-0.2, 0.2, t * 2 - Math.PI * 0.5);
    rotate_from_origin(p[0], p[1], 0.5, angle0); 
    rotate_from_origin(p[0], p[3], 0.5, angle1); 
    angle0 += sb * -motor(0, Math.PI * 0.5, t * 2 + Math.PI);
    angle1 += sb * -motor(0, Math.PI * 0.5, t * 2 + Math.PI + Math.PI);
    rotate_from_origin(p[1], p[2], 0.5, angle0);
    rotate_from_origin(p[3], p[4], 0.5, angle1);

    t += Math.PI * 0.5;
    p[5].y = h + motor(-0.1, 0.2, t * 4);
    angle0 = la + sa * Math.PI * motor(-0.2, 0.2, t * 2 + Math.PI * 0.5);
    angle1 = la + sa * Math.PI * motor(-0.2, 0.2, t * 2 - Math.PI * 0.5);
    rotate_from_origin(p[5], p[6], 0.5, angle0); 
    rotate_from_origin(p[5], p[8], 0.5, angle1); 
    angle0 += sb * -motor(0, Math.PI * 0.5, t * 2 + Math.PI);
    angle1 += sb * -motor(0, Math.PI * 0.5, t * 2 + Math.PI + Math.PI);
    rotate_from_origin(p[6], p[7], 0.5, angle0);
    rotate_from_origin(p[8], p[9], 0.5, angle1);

    p[10].y = h + 0.5 * motor(-0.1, 0.2, t * 4 - Math.PI * 0.5);
    rotate_from_origin(p[5], p[11], 0.6, Math.PI * 0.5 + motor(-0.1, 0.1, t * 4));
    rotate_from_origin(p[0], p[12], 0.35, Math.PI * 0.7);
    rotate_from_origin(p[12], p[13], 0.35, Math.PI * 1.0 + motor(-0.1, 0.1, t * 3));
  }
  
  draw(g, v) {
    let scope = this;
    let p = scope.p;

    g.lineWidth = scope.lineWidth;
    g.lineCap = 'round';
    g.lineJoin = 'round';
    //g.strokeStyle = scope.strokeStyle;
    g.fillStyle = scope.strokeStyle;

    g.save();
    g.translate(scope.x, scope.y + g.canvas.height);
    g.scale(scope.scale, -scope.scale);

    // back legs
    g.lineWidth = scope.lineWidth * 1;
    g.beginPath();
    g.moveTo(p[0].x, p[0].y);
    g.bezierCurveTo(p[1].x, p[1].y, p[1].x, p[1].y, p[2].x, p[2].y);
    g.moveTo(p[5].x, p[5].y);  
    g.bezierCurveTo(p[6].x, p[6].y, p[6].x, p[6].y, p[7].x, p[7].y);
    g.strokeStyle = scope.color_back;
    g.stroke();
    
    // tail
    g.lineWidth = scope.lineWidth * 0.5;
    g.beginPath();
    g.moveTo(p[0].x, p[0].y);
    g.bezierCurveTo(p[0].x, p[0].y, p[12].x, p[12].y, p[13].x, p[13].y);
    g.strokeStyle = scope.color_middle;
    g.stroke();
    
    // body + neck
    g.lineWidth = scope.lineWidth * 1.5;
    g.beginPath();
    g.moveTo(p[0].x, p[0].y);
    g.bezierCurveTo(p[10].x, p[10].y, p[10].x, p[10].y, p[5].x, p[5].y);
    g.lineTo(p[11].x, p[11].y);
    g.strokeStyle = scope.color_front;
    g.stroke();
    
    // front legs
    g.lineWidth = scope.lineWidth * 1;
    g.beginPath();
    g.moveTo(p[0].x, p[0].y);
    g.bezierCurveTo(p[3].x, p[3].y, p[3].x, p[3].y, p[4].x, p[4].y);
    g.moveTo(p[5].x, p[5].y);
    g.bezierCurveTo(p[8].x, p[8].y, p[8].x, p[8].y, p[9].x, p[9].y);
    g.strokeStyle = scope.color_front;
    g.stroke();

    // head
    //g.drawImage(scope.gh.canvas, p[11].x - 0.1, p[11].y - 0.2, scope.gh.canvas.width / scope.gh.canvas.height * 0.5, 0.5);
    g.beginPath();
    g.arc(p[11].x+0.05, p[11].y, 0.25, 0, Math.PI * 2);
    g.arc(p[11].x+0.1, p[11].y, 0.25, 0, Math.PI * 2);
    g.fillStyle = scope.color_front;
    g.fill();
    
    // eye white
    g.beginPath();
    g.arc(p[11].x+0.09, p[11].y + 0.05, 0.1, 0, Math.PI * 2);
    g.fillStyle = 'white';
    g.fill();
    
    // eye pupil
    let dx = v.x - scope.x;
    let dy = (g.canvas.height - p[11].y * scope.scale) - v.y % g.canvas.height;
    let d = Math.sqrt(dx*dx + dy*dy) + 1e-6;
    let ux = dx / d;
    let uy = dy / d;
    let r = 0.04;
    g.beginPath();
    g.arc(p[11].x + 0.09 + r*ux, p[11].y + 0.05 + r*uy, 0.07, 0, Math.PI * 2);
    g.fillStyle = scope.color_eye;
    g.fill();
    
    // eye lid
    if(v.y % g.canvas.height < g.canvas.height * 0.9) {
      let lid_r = 0.12;
      let lid_close = Math.pow(Math.sin(scope.t)*0.5+0.5, 100);
      g.beginPath();
      g.ellipse(p[11].x+0.09, p[11].y + 0.05 + lid_r*(1 - lid_close), lid_r, lid_r*lid_close, 0, 0, Math.PI * 2);
      g.fillStyle = scope.color_middle;
      g.fill();  
    }
    
    g.restore();
  }
}

class Worm {
  constructor() {
    let p = [];
    let cx = 0;
    let cy = 0;

    // body
    for(var i = 0; i <= 9; i++) {
      p[i] = { x: cx - 0.3 * i, y: cy};
    }

    let scope = this;
    scope.head = p[0];
    scope.p = p;
    scope.x = 0;
    scope.y = 0;
    scope.speed = 2;
    scope.scale = 30;
    scope.strokeStyle = '#eb7c62';
    let hue = Math.random() * 360 | 0;
    let sat = 100;
    let d_lig = Math.random() * 20 | 0;
    let lig = 50 + d_lig;
    scope.color_front = `hsl(${hue}deg, ${sat}%, ${lig}%)`;
    scope.color_middle = `hsl(${hue}deg, ${sat}%, ${lig - 5 - (d_lig/3 | 0)}%)`;
    scope.color_back = `hsl(${hue}deg, ${sat}%, ${lig - 10 - (d_lig/3 | 0)}%)`;
    scope.color_eye = `hsl(${Math.random() * 360 | 0}deg, ${sat}%, ${lig - 20 - (d_lig/3 | 0)}%)`;
    scope.lineWidth = 0.3;

    scope.t = 0;
    scope.repeated = 0;
    scope.max_repeat = 3;
    scope.volume = 0;
    scope.shout = false;
    scope.beat = 0;
  }
  
  reform() {
    let scope = this;
    let hue = Math.random() * 360 | 0;
    let sat = 100;
    let d_lig = Math.random() * 20 | 0;
    let lig = 50 + d_lig;
    scope.color_front = `hsl(${hue}deg, ${sat}%, ${lig}%)`;
    scope.color_middle = `hsl(${hue}deg, ${sat}%, ${lig - 5 - (d_lig/3 | 0)}%)`;
    scope.color_back = `hsl(${hue}deg, ${sat}%, ${lig - 10 - (d_lig/3 | 0)}%)`;
    scope.color_eye = `hsl(${Math.random() * 360 | 0}deg, ${sat}%, ${lig - 20 - (d_lig/3 | 0)}%)`;
  }
  
  update(time) {
    let scope = this;
    let p = scope.p;
    
    scope.x += 1;

    let angle0 = 0;
    let angle1 = 0;
    let t = time * scope.speed * world_tempo;
    scope.t = t;
    let h = scope.lineWidth * 0.3;

    let tt = t * 4; 
    
    for(var i = 0; i < p.length; i++) {
      p[i].y = h + motor(0, 0.3, -t * 4 + Math.PI * 0.5 * i);
      if(i == 0) {
        p[i].y = 1.0 + motor(0, 0.3, -t * 4 + Math.PI);
        p[i + 1].x = p[i].x;
      }
    }
  }
  
  draw(g, v) {
    let scope = this;
    let p = scope.p;

    g.lineWidth = scope.lineWidth;
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.strokeStyle = scope.color_front;
    g.fillStyle = scope.color_front;

    g.save();
    g.translate(scope.x, scope.y + g.canvas.height);
    g.scale(scope.scale, -scope.scale);

    // body
    g.lineWidth = scope.lineWidth * 1;
    g.beginPath();
    g.moveTo(p[0].x, p[0].y);
    g.lineTo((p[0].x + p[1].x) * 0.5, (p[0].y + p[1].y) * 0.5); 
    for(var i = 1; i < p.length - 1; i++) {
      g.quadraticCurveTo(p[i].x, p[i].y, (p[i].x + p[i + 1].x) * 0.5, (p[i].y + p[i + 1].y) * 0.5);
    }
    g.stroke();

    // head
    //g.drawImage(scope.gh.canvas, p[0].x - 0.1, p[0].y - 0.2, scope.gh.canvas.width / scope.gh.canvas.height * 0.5, 0.5);

    g.beginPath();
    g.arc(p[0].x+0.05, p[0].y, 0.25, 0, Math.PI * 2);
    g.arc(p[0].x+0.1, p[0].y, 0.25, 0, Math.PI * 2);
    g.fillStyle = scope.color_front;
    g.fill();
    
    // eye white
    g.beginPath();
    g.arc(p[0].x+0.09, p[0].y + 0.05, 0.1, 0, Math.PI * 2);
    g.fillStyle = 'white';
    g.fill();
    
    // eye pupil
    let dx = v.x - scope.x;
    let dy = (g.canvas.height - p[0].y * scope.scale) - v.y % g.canvas.height;
    let d = Math.sqrt(dx*dx + dy*dy) + 1e-6;
    let ux = dx / d;
    let uy = dy / d;
    let r = 0.04;
    g.beginPath();
    g.arc(p[0].x + 0.09 + r*ux, p[0].y + 0.05 + r*uy, 0.07, 0, Math.PI * 2);
    g.fillStyle = scope.color_eye;
    g.fill();
    
    // eye lid
    if(v.y % g.canvas.height < g.canvas.height * 0.9) {
      let lid_r = 0.12;
      let lid_close = Math.pow(Math.sin(scope.t)*0.5+0.5, 100);
      g.beginPath();
      g.ellipse(p[0].x+0.09, p[0].y + 0.05 + lid_r*(1 - lid_close), lid_r, lid_r*lid_close, 0, 0, Math.PI * 2);
      g.fillStyle = scope.color_middle;
      g.fill();  
    }
    
    g.restore();
  }
}

class CritterRacing {
  constructor() {

  }
  
  update(c) {

  }
  
  draw(c) {
    c.clearRect(0, 0, c.canvas.width, c.canvas.height);
    
    c.save();
    
    c.restore(); 
  }
}