import { Vector } from '../util/vector.js';
import { Polygon } from '../collisions/polygon.js';

export const CELL_EMPTY = 0;
export const CELL_SOLID = 1;
export const CELL_FLOOR_DIAG_LEFT = 2;
export const CELL_FLOOR_DIAG_RIGHT = 3;
export const CELL_CEIL_DIAG_LEFT = 4;
export const CELL_CEIL_DIAG_RIGHT = 5;

const CELL_GREY = 0;
const CELL_RED = 1;
const CELL_BLUE = 2;

let cellColor = [
  '#9a9999',
  '#bc7a7a',
  '#6f89b9',
];

let glyphs = '최지유뭐지봉아무것도왜날괴롭히는거냐?';

// class Cell
export class Cell {
  constructor(x, y, type) {
    this.x = x;
	this.y = y;
	this.type = type;
	this.edges = [];
    this.color = 0;
    this.glyph = glyphs[Math.random() * glyphs.length | 0];
  }
  
  bottomLeft() { return new Vector(this.x, this.y); }
  bottomRight() { return new Vector(this.x + 1, this.y); }
  topLeft() { return new Vector(this.x, this.y + 1); }
  topRight() { return new Vector(this.x + 1, this.y + 1); }

  ceilingOccupied() {
    return this.type === CELL_SOLID || this.type === CELL_CEIL_DIAG_LEFT || this.type === CELL_CEIL_DIAG_RIGHT;
  }

  floorOccupied() {
    return this.type === CELL_SOLID || this.type === CELL_FLOOR_DIAG_LEFT || this.type === CELL_FLOOR_DIAG_RIGHT;
  }

  leftWallOccupied() {
    return this.type === CELL_SOLID || this.type === CELL_FLOOR_DIAG_LEFT || this.type === CELL_CEIL_DIAG_LEFT;
  }

  rightWallOccupied() {
    return this.type === CELL_SOLID || this.type === CELL_FLOOR_DIAG_RIGHT || this.type === CELL_CEIL_DIAG_RIGHT;
  }

  // This diagonal: /
  posDiagOccupied() {
    return this.type === CELL_SOLID || this.type === CELL_FLOOR_DIAG_RIGHT || this.type === CELL_CEIL_DIAG_LEFT;
  }

  // This diagonal: \
  negDiagOccupied = function() {
    return this.type === CELL_SOLID || this.type === CELL_FLOOR_DIAG_LEFT || this.type === CELL_CEIL_DIAG_RIGHT;
  }

  addEdge(newEdge) {
    this.edges.push(newEdge);
  }

  removeEdge = function(edge) {
    let edgeIndex = this.getEdge(edge);
    this.edges.splice(edgeIndex, 1);
  }

  // returns all edges that block this color
  getBlockingEdges(color) {
    let blockingEdges = [];
    for(let i = 0; i < this.edges.length; i++) {
      if(this.edges[i].blocksColor(color)) {
        blockingEdges.push(this.edges[i]);
      }
    }
    return blockingEdges;
  }

  getEdge(edge) {
    for (let i = 0; i < this.edges.length; ++i) {
      let thisEdge = this.edges[i];
      if ((thisEdge.getStart().sub(edge.getStart())).lengthSquared() < 0.001 &&
       (thisEdge.getEnd().sub(edge.getEnd())).lengthSquared() < 0.001) {
        return i;
      }
    }
    return -1;
  }

  // returns a polygon that represents this cell
  getShape() {
    let vxy = new Vector(this.x, this.y);
    let v00 = new Vector(0, 0);
    let v01 = new Vector(0, 1);
    let v10 = new Vector(1, 0);
    let v11 = new Vector(1, 1);
    switch(this.type) {
      case CELL_SOLID: return new Polygon(vxy, v00, v10, v11, v01);
      case CELL_FLOOR_DIAG_LEFT: return new Polygon(vxy, v00, v10, v01);
      case CELL_FLOOR_DIAG_RIGHT: return new Polygon(vxy, v00, v10, v11);
      case CELL_CEIL_DIAG_LEFT: return new Polygon(vxy, v00, v11, v01);
      case CELL_CEIL_DIAG_RIGHT: return new Polygon(vxy, v01, v10, v11);
    }
    return null;
  }

  draw(c) {
    let x = this.x, y = this.y;
    c.beginPath();
    if(this.type == CELL_SOLID)
    {
      c.moveTo(x, y);
      c.lineTo(x, y + 1);
      c.lineTo(x + 1, y + 1);
      c.lineTo(x + 1, y);
    }
    else if(this.type == CELL_FLOOR_DIAG_LEFT)
    {
      c.moveTo(x, y);
      c.lineTo(x + 1, y);
      c.lineTo(x, y + 1);
    }
    else if(this.type == CELL_FLOOR_DIAG_RIGHT)
    {
      c.moveTo(x, y);
      c.lineTo(x + 1, y + 1);
      c.lineTo(x + 1, y);
    }
    else if(this.type == CELL_CEIL_DIAG_LEFT)
    {
      c.moveTo(x, y);
      c.lineTo(x, y + 1);
      c.lineTo(x + 1, y + 1);
    }
    else if(this.type == CELL_CEIL_DIAG_RIGHT)
    {
      c.moveTo(x + 1, y);
      c.lineTo(x, y + 1);
      c.lineTo(x + 1, y + 1);
    }
    c.closePath();
    c.fillStyle = cellColor[this.color];
    c.fill();
    c.stroke();
    
    /*
    if(this.type === CELL_SOLID && this.color === CELL_GREY) {
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillStyle = '#b9b9b9';
      c.font = '0.5px Arial';
      c.save();
      c.translate(x + 0.5, y + 0.5);
      c.scale(1, -1);
      c.fillText(this.glyph, 0, 0);
      c.restore();
    }
    */
  }

  drawEdges(c) {
    for(let i = 0; i < this.edges.length; i++) {
      this.edges[i].draw(c);
    }
  }
}