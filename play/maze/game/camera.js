import { Vector } from '../util/vector.js';
import { BackgroundCache } from './backgroundcache.js';

export let useBackgroundCache = true;

// Clip a rectangular w by h polygon by a line passing though split and the origin:
//
//	+-----+---+
//	| A  /	B |
//	+---+-----+
//
// Pass split to get region A and -split to get region B.  This is necessary likely
// because Firefox 4.0b8 renders to an internal buffer bounding the clipping polygon,
// but the polygon isn't clipped to the canvas before being bounded.  Before this,
// we were just drawing a huge polygon 99999 units across and not bothering to tightly
// wrap the canvas, but Firefox was crashing.
function clipHelper(c, w, h, split) {
  let tx = h / split.y;
  let ty = w / split.x;
  c.beginPath();
  if ((-w) * split.y - (-h) * split.x >= 0) c.lineTo(-w, -h);
  if (Math.abs(split.y * ty) <= h) c.lineTo(-split.x * ty, -split.y * ty);
  if ((-w) * split.y - (+h) * split.x >= 0) c.lineTo(-w, +h);
  if (Math.abs(split.x * tx) <= w) c.lineTo(split.x * tx, split.y * tx);
  if ((+w) * split.y - (+h) * split.x >= 0) c.lineTo(+w, +h);
  if (Math.abs(split.y * ty) <= h) c.lineTo(split.x * ty, split.y * ty);
  if ((+w) * split.y - (-h) * split.x >= 0) c.lineTo(+w, -h);
  if (Math.abs(split.x * tx) <= w) c.lineTo(-split.x * tx, -split.y * tx);
  c.closePath();
  c.clip();
}

// class SplitScreenCamera
export class SplitScreenCamera {
  constructor(playerA, playerB, width, height) {
    this.playerA = playerA;
	this.playerB = playerB;
	this.width = width;
	this.height = height;
	
	if (useBackgroundCache) {
      this.backgroundCacheA = new BackgroundCache('a');
      this.backgroundCacheB = new BackgroundCache('b');
	} else {
      this.backgroundCacheA = null;
      this.backgroundCacheB = null;
	}
  }
  
  draw(c, renderer) {
	let positionA = this.playerA.getCenter();
	let positionB = this.playerB.getCenter();
	let center = positionA.add(positionB).div(2);
	
	// maximum distance between a player and the center is the distance to the box that is half the size of the screen
	let temp = positionB.sub(positionA).unit();
	temp = new Vector(this.width / Math.abs(temp.x), this.height / Math.abs(temp.y));
	let maxLength = Math.min(temp.x, temp.y) / 4;

	let isSplit = (positionB.sub(positionA).lengthSquared() > 4*maxLength*maxLength);
    
    //isSplit = false;
    //center = positionA;
      
	if(!isSplit) {
      renderer.render(c, center, this.width, this.height, this.backgroundCacheA);
	} else {
      let AtoB = positionB.sub(positionA).unit().mul(99);
      let split = AtoB.flip();

      // make sure a's center isn't more than maxLength from positionA
      let centerA = center.sub(positionA);
      if(centerA.lengthSquared() > maxLength*maxLength) centerA = centerA.unit().mul(maxLength);
      centerA = centerA.add(positionA);

      // make sure b's center isn't more than maxLength from positionB
      let centerB = center.sub(positionB);
      if(centerB.lengthSquared() > maxLength*maxLength) centerB = centerB.unit().mul(maxLength);
      centerB = centerB.add(positionB);

      // draw world from a's point of view
      c.save();
      clipHelper(c, this.width / 2, this.height / 2, split);
      renderer.render(c, centerA, this.width, this.height, this.backgroundCacheA);
      c.restore();

      // draw world from b's point of view
      c.save();
      clipHelper(c, this.width / 2, this.height / 2, split.mul(-1));
      renderer.render(c, centerB, this.width, this.height, this.backgroundCacheB);
      c.restore();

      // divide both player's view with a black line
      let splitSize = Math.min(0.1, (positionB.sub(positionA).length() - 1.9 * maxLength) * 0.01);
      c.save();
      c.lineWidth = 2 * splitSize;
      c.strokeStyle = 'black';
      c.beginPath();
      c.moveTo(-split.x, -split.y);
      c.lineTo(split.x, split.y);
      c.stroke();
      c.restore();
	}
  }
}