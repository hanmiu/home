import { Vector } from '../util/vector.js';
import { Sprite } from '../util/sprite.js';
import { CollisionDetector } from '../collisions/collisiondetection.js';
import { ENEMY_CRAWLER } from './enemy.js';
import { WalkingEnemy } from './walkingenemy.js';

const WALL_CRAWLER_SPEED = 1;
const WALL_CRAWLER_RADIUS = 0.25;
const PULL_FACTOR = 0.9;
const PUSH_FACTOR = 0.11;

export class WallCrawler extends WalkingEnemy {
  constructor(center, direction) {
	super(ENEMY_CRAWLER, center, WALL_CRAWLER_RADIUS, 0);

	this.firstTick = true;
	this.clockwise = false;
	this.velocity = new Vector(Math.cos(direction), Math.sin(direction));

	this.bodySprite = new Sprite();
	this.bodySprite.drawGeometry = function(c) {
      let space = 0.15;
      c.fillStyle = 'black';
      c.strokeStyle = 'black';
      
      let critter = critters['Wall Crawler'];
      if(critter) {
        c.save();
        c.scale(0.005, -0.005);
        c.translate(-128, -128);
        c.fill(critter);
        c.restore();
        return;
      }
      
      c.beginPath(); c.arc(0, 0, 0.25, Math.PI * 0.25 + space, Math.PI * 0.75 - space, false); c.stroke();
      c.beginPath(); c.arc(0, 0, 0.25, Math.PI * 0.75 + space, Math.PI * 1.25 - space, false); c.stroke();
      c.beginPath(); c.arc(0, 0, 0.25, Math.PI * 1.25 + space, Math.PI * 1.75 - space, false); c.stroke();
      c.beginPath(); c.arc(0, 0, 0.25, Math.PI * 1.75 + space, Math.PI * 2.25 - space, false); c.stroke();
      c.beginPath(); c.arc(0, 0, 0.15, 0, 2*Math.PI, false); c.stroke();
      c.beginPath();
      c.moveTo(0.15, 0); c.lineTo(0.25, 0);
      c.moveTo(0, 0.15); c.lineTo(0, 0.25);
      c.moveTo(-0.15, 0); c.lineTo(-0.25, 0);
      c.moveTo(0, -0.15); c.lineTo(0, -0.25);
      c.stroke();
      c.beginPath(); c.arc(0, 0, 0.05, 0, 2*Math.PI, false); c.fill();
	};
  }
  
  // Rotates about the closest point in the world
  move(seconds) {
	let ref_shapePoint = {};
	let ref_worldPoint = {};
	let closestPointDist = CollisionDetector.closestToEntityWorld(this, 2, ref_shapePoint, ref_worldPoint, gameState.world);

	if (closestPointDist < Number.POSITIVE_INFINITY) {
      let delta = this.getCenter().sub(ref_worldPoint.ref);
      // Make sure it doesn't get too far away or get stuck in corners
      let flip = delta.flip();

      if (this.firstTick) {
        if (this.velocity.dot(flip) < 0) this.clockwise = true;
        else this.clockwise = false;
        this.firstTick = false;
      }
      if (delta.lengthSquared() > (WALL_CRAWLER_RADIUS * WALL_CRAWLER_RADIUS * 1.1)) {
        // Pull the crawler towards the wall
        if (this.clockwise) this.velocity = flip.mul(-1).sub(delta.mul(PULL_FACTOR));
        else this.velocity = flip.sub(delta.mul(PULL_FACTOR));
      } else {
        // Push the crawler away from the wall
        if (this.clockwise) this.velocity = flip.mul(-1).add(delta.mul(PUSH_FACTOR));
        else this.velocity = flip.add(delta.mul(PUSH_FACTOR));
      }
      this.velocity.normalize();
	}

	return this.velocity.mul(WALL_CRAWLER_SPEED * seconds);
  }

  afterTick(seconds) {
	let deltaAngle = WALL_CRAWLER_SPEED / WALL_CRAWLER_RADIUS * seconds;
	this.bodySprite.offsetBeforeRotation = this.getCenter();
	if (this.clockwise) this.bodySprite.angle += deltaAngle;
	else this.bodySprite.angle -= deltaAngle;
  }

  draw(c) {
	this.bodySprite.draw(c);
  }
  
  reactToPlayer(player) {
    if(!gameState.hostile) return;
    
	let relativePos = player.getCenter().sub(this.getCenter());
	// If player jumps on top of this, it explodes
	if (relativePos.y > (WALL_CRAWLER_RADIUS - .05)) {
      player.setVelocity(new Vector(player.getVelocity().x, 6));
      this.setDead(true);
	} else if (player.isSuperJumping) {
      this.setDead(true);
	} else {
      player.setDead(true);
	}
  }
  
  onDeath() {
    super.onDeath();
  }
}