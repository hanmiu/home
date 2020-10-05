// class Vector
export class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  // math operations
  neg() { 
    return new Vector(-this.x, -this.y); 
  }
  
  add(v) {
    return new Vector(this.x + v.x, this.y + v.y); 
  }

  sub(v) { 
    return new Vector(this.x - v.x, this.y - v.y); 
  }

  mul(f) { 
    return new Vector(this.x * f, this.y * f); 
  }

  div(f) { 
    return new Vector(this.x / f, this.y / f); 
  }

  eq(v) { 
    return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) < 0.001; 
  };

  // inplace operations
  inplaceNeg() { 
    this.x = -this.x; 
    this.y = -this.y; 
  }

  inplaceAdd(v) { 
    this.x += v.x;
    this.y += v.y; 
  }

  inplaceSub(v) { 
    this.x -= v.x;
    this.y -= v.y; 
  }
  
  inplaceMul(f) { 
    this.x *= f; 
    this.y *= f; 
  }
  
  inplaceDiv(f) { 
    this.x /= f; 
    this.y /= f; 
  }
  
  inplaceFlip() { 
    let t = this.x; 
    this.x = this.y;
    this.y = -t; 
  } // turns 90 degrees right

  // other functions
  clone() { 
    return new Vector(this.x, this.y); 
  }

  dot(v) { 
    return this.x*v.x + this.y*v.y; 
  }
  
  lengthSquared() { 
    return this.dot(this); 
  }
  
  length() { 
    return Math.sqrt(this.lengthSquared()); 
  }

  unit() { 
    return this.div(this.length()); 
  }
  
  normalize() { 
    let len = this.length(); 
    this.x /= len; 
    this.y /= len; 
  }
  
  flip() { 
    return new Vector(this.y, -this.x); 
  } // turns 90 degrees right
  
  atan2() { 
    return Math.atan2(this.y, this.x); 
  }
  
  angleBetween(v) { 
    return this.atan2() - v.atan2(); 
  }

  rotate(theta) { 
    let s = Math.sin(theta), c = Math.cos(theta); 
    return new Vector(this.x*c - this.y*s, this.x*s + this.y*c); 
  }
  
  minComponents(v) { 
    return new Vector(Math.min(this.x, v.x), Math.min(this.y, v.y)); 
  }
  
  maxComponents(v) { 
    return new Vector(Math.max(this.x, v.x), Math.max(this.y, v.y)); 
  }
  
  projectOntoAUnitVector(v) { 
    return v.mul(this.dot(v)); 
  }

  toString() { 
    return '(' + this.x.toFixed(3) + ', ' + this.y.toFixed(3) + ')'; 
  }

  adjustTowardsTarget(target, maxDistance) {
    let v = ((target.sub(this)).lengthSquared() < maxDistance * maxDistance) ? target : this.add((target.sub(this)).unit().mul(maxDistance));
    this.x = v.x;
    this.y = v.y;
  }

  //static functions
  static fromAngle(theta) { 
    return new Vector(Math.cos(theta), Math.sin(theta)); 
  }
  
  static lerp(a, b, percent) { 
    return a.add(b.sub(a).mul(percent)); 
  }
}