import { AABB } from './aabb.js';
import { Segment } from './segment.js';
import { SHAPE_POLYGON } from './shape.js';

/**
  *  For the polygon class, the segments and the bounding box are all relative to the center of the polygon.
  *  That is, when the polygon moves, the center is the only thing that changes.  This is to prevent
  *  floating-point arithmetic errors that would be caused by maintaining several sets of absolute coordinates.
  *
  *  Segment i goes from vertex i to vertex ((i + 1) % vertices.length)
  *
  *  When making a new polygon, please declare the vertices in counterclockwise order.	I'm not sure what will
  *  happen if you don't do that.
  */

// class Polygon extends Shape
export class Polygon {
  constructor(center, ...vertices) {
    // center is the first argument, the next arguments are the vertices relative to the center
    this.center = center;
    this.vertices = vertices;

    this.segments = [];
    for(let i = 0; i < this.vertices.length; i++) {
      this.segments.push(new Segment(this.vertices[i], this.vertices[(i + 1) % this.vertices.length]));
    }

    this.boundingBox = new AABB(this.vertices[0], this.vertices[0]);
    this.initializeBounds();
  }
  
  copy() {
    let polygon = new Polygon(this.center, this.vertices[0]);
    polygon.vertices = this.vertices;
    polygon.segments = this.segments;
    polygon.initializeBounds();
    return polygon;
  }

  getType() {
    return SHAPE_POLYGON;
  }
  
  moveBy(delta) {
    this.center = this.center.add(delta);
  }
  
  moveTo(destination) {
    this.center = destination;
  }
  
  getVertex(i) {
    return this.vertices[i].add(this.center);
  }
  
  getSegment(i) {
    return this.segments[i].offsetBy(this.center);
  }
  
  getAabb() {
    return this.boundingBox.offsetBy(this.center);
  }
  
  getCenter() {
    return this.center;
  }

  // expand the aabb and the bounding circle to contain all vertices
  initializeBounds() {
    for(let i = 0; i < this.vertices.length; i++) {
      let vertex = this.vertices[i];

      // expand the bounding box to include this vertex
      this.boundingBox = this.boundingBox.include(vertex);
    }
  }

  draw(c) {
    c.strokeStyle = 'black';
    c.beginPath();
    for(let i = 0; i < this.vertices.length; i++) {
      c.lineTo(this.vertices[i].x + this.center.x, this.vertices[i].y + this.center.y);
    }
    c.closePath();
    c.stroke();
  }
}