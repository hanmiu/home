import { Vector } from '../util/vector.js';
import { Polygon } from './polygon.js';
import { SHAPE_AABB } from './shape.js';

// class AABB extends Shape
export class AABB {
  constructor(lowerLeft, upperRight) {
    this.lowerLeft = new Vector(
      Math.min(lowerLeft.x, upperRight.x),
      Math.min(lowerLeft.y, upperRight.y));
    this.size = new Vector(
      Math.max(lowerLeft.x, upperRight.x),
      Math.max(lowerLeft.y, upperRight.y)).sub(this.lowerLeft);
  }
  
  static makeAABB(center, width, height) {
    let halfSize = new Vector(width * 0.5, height * 0.5);
    let lowerLeft = center.sub(halfSize);
    let upperRight = center.add(halfSize);
    return new AABB(lowerLeft, upperRight);
  }
  
  getTop() { 
    return this.lowerLeft.y + this.size.y; 
  }
  
  getLeft() { 
    return this.lowerLeft.x; 
  }
  
  getRight() { 
    return this.lowerLeft.x + this.size.x; 
  }
  
  getBottom() { 
    return this.lowerLeft.y; 
  }
  
  getWidth() { 
    return this.size.x; 
  }
  
  getHeight() { 
    return this.size.y; 
  }

  copy() {
    return new AABB(this.lowerLeft, this.lowerLeft.add(this.size));
  }
  
  getPolygon() {
    let center = this.getCenter();
    let halfSize = this.size.div(2);
    return new Polygon(center,
      new Vector(+halfSize.x, +halfSize.y),
      new Vector(-halfSize.x, +halfSize.y),
      new Vector(-halfSize.x, -halfSize.y),
      new Vector(+halfSize.x, -halfSize.y));
  }
  
  getType() {
    return SHAPE_AABB;
  }
  
  getAabb() {
    return this;
  }
  
  moveBy(delta) {
    this.lowerLeft = this.lowerLeft.add(delta);
  }
  
  moveTo(destination) {
    this.lowerLeft = destination.sub(this.size.div(2));
  }
  
  getCenter() {
    return this.lowerLeft.add(this.size.div(2));
  }
  
  expand(margin) {
    let marginVector = new Vector(margin, margin);
    return new AABB(this.lowerLeft.sub(marginVector), this.lowerLeft.add(this.size).add(marginVector));
  }
  
  union(aabb) {
    return new AABB(this.lowerLeft.minComponents(aabb.lowerLeft), this.lowerLeft.add(this.size).maxComponents(aabb.lowerLeft.add(aabb.size)));
  }
  
  include(point) {
    return new AABB(this.lowerLeft.minComponents(point), this.lowerLeft.add(this.size).maxComponents(point));
  }
  
  offsetBy(offset) {
    return new AABB(this.lowerLeft.add(offset), this.lowerLeft.add(this.size).add(offset));
  }

  draw(c) {
    c.strokeStyle = 'black';
    c.strokeRect(this.lowerLeft.x, this.lowerLeft.y, this.size.x, this.size.y);
  }
}