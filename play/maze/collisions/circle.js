import { Vector } from '../util/vector.js';
import { AABB } from './aabb.js';
import { SHAPE_CIRCLE } from './shape.js';

// class Circle extends Shape
export class Circle {
  constructor(center, radius) {
    this.center = center;
    this.radius = radius;
  }
  
  copy() {
    return new Circle(this.center, this.radius);
  }

  getType() {
    return SHAPE_CIRCLE;
  }
  
  getAabb() {
    let radiusVector = new Vector(this.radius, this.radius);
    return new AABB(this.center.sub(radiusVector), this.center.add(radiusVector));
  }
  
  getCenter() {
    return this.center;
  }
  
  moveBy(delta) {
    this.center = this.center.add(delta);
  }
  
  moveTo(destination) {
    this.center = destination;
  }
  
  offsetBy(offset) {
    return new Circle(this.center.add(offset), this.radius);
  };

  draw(c) {
    c.strokeStyle = 'black';
    c.beginPath();
    c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI*2, false);
    c.stroke();
  }
}