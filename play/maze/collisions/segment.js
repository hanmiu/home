// class Segment
export class Segment {
  constructor(start, end) {
    this.start = start;
    this.end = end;
    this.normal = end.sub(start).flip().unit();
  }
  
  offsetBy(offset) {
    return new Segment(this.start.add(offset), this.end.add(offset));
  }

  draw(c) {
    c.beginPath();
    c.moveTo(this.start.x, this.start.y);
    c.lineTo(this.end.x, this.end.y);
    c.stroke();
  }
}