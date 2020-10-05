import { Vector } from '../util/vector.js';
import { randInRange } from '../util/math.js';
import { Sprite } from '../util/sprite.js';
import { STAT_ENEMY_DEATHS } from '../world/gamestate.js';
import { CollisionDetector } from '../collisions/collisiondetection.js';
import { Particle } from './particle.js';
import { ENEMY_WALL_AVOIDER } from './enemy.js';
import { RotatingEnemy } from './rotatingenemy.js';

const WALL_AVOIDER_RADIUS = 0.3;
const WALL_AVOIDER_ACCEL = 3.3; 

export class WallAvoider extends RotatingEnemy {
  constructor(center, target) {
	super(ENEMY_WALL_AVOIDER, center, WALL_AVOIDER_RADIUS, 0, 0);

	this.target = target;
	this.acceleration = new Vector(0, 0);
	this.angularVelocity = 0;

	this.bodySprite = new Sprite();
	this.bodySprite.drawGeometry = function(c) {
      c.beginPath(); c.arc(0, 0, 0.1, 0, 2*Math.PI, false); c.fill(); c.stroke();
      c.beginPath();
      for(let i = 0; i < 4; i++)
      {
        let angle = i * (2*Math.PI / 4);
        let cos = Math.cos(angle), sin = Math.sin(angle);
        c.moveTo(cos * 0.1, sin * 0.1);
        c.lineTo(cos * 0.3, sin * 0.3);
        c.moveTo(cos * 0.16 - sin * 0.1, sin * 0.16 + cos * 0.1);
        c.lineTo(cos * 0.16 + sin * 0.1, sin * 0.16 - cos * 0.1);
        c.moveTo(cos * 0.23 - sin * 0.05, sin * 0.23 + cos * 0.05);
        c.lineTo(cos * 0.23 + sin * 0.05, sin * 0.23 - cos * 0.05);
      }
      c.stroke();
	};
  }

  move(seconds) {
	if (this.target.isDead()) {
      this.velocity.x = this.velocity.y = 0;
      return this.velocity.mul(seconds);
	} else {
      let targetDelta = this.target.getCenter().sub(this.getCenter());
      let ref_shapePoint = {};
      let ref_worldPoint = {};
      let closestPointDist = CollisionDetector.closestToEntityWorld(this, 5, ref_shapePoint, ref_worldPoint, gameState.world);
      // If something went horribly, horribly wrong
      if (closestPointDist < 0.001) {
        return this.accelerate(new Vector(0, 0), seconds);
      }
      this.acceleration = targetDelta.unit();
      if (closestPointDist < Number.POSITIVE_INFINITY) {
        let closestPointDelta = ref_worldPoint.ref.sub(this.getCenter());
        let wallAvoidance = closestPointDelta.mul(-1 / (closestPointDist * closestPointDist));
        this.acceleration.inplaceAdd(wallAvoidance);
      }
      this.acceleration.normalize();
      this.acceleration.inplaceMul(WALL_AVOIDER_ACCEL);

      // Time independent version of multiplying by 0.99
      this.velocity.inplaceMul(Math.pow(0.366032, seconds));
      return this.accelerate(this.acceleration, seconds);
	}
  }

  reactToWorld(contact) {
	this.setDead(true);
  }

  onDeath() {
	gameState.incrementStat(STAT_ENEMY_DEATHS);

	let position = this.getCenter();
	// fire
	for(let i = 0; i < 50; ++i) {
      let direction = Vector.fromAngle(randInRange(0, 2 * Math.PI));
      direction = direction.mul(randInRange(0.5, 17));

      Particle.take().position(position).velocity(direction).radius(0.02, 0.15).bounces(0, 4).elasticity(0.05, 0.9).decay(0.000001, 0.00001).expand(1.0, 1.2).color(1, 0.3, 0, 1).mixColor(1, 0.1, 0, 1).triangle();
	}
  }

  getTarget() {
	return this.target === gameState.getPlayerB();
  }

  afterTick(seconds) {
	this.bodySprite.offsetBeforeRotation = this.getCenter();
	this.angularVelocity = (this.angularVelocity + randInRange(-Math.PI, Math.PI)) * 0.5;
	this.bodySprite.angle += this.angularVelocity * seconds;
  }

  draw(c) {
	c.fillStyle = (this.target == gameState.playerA) ? 'red' : 'blue';
	c.strokeStyle = 'black';
	this.bodySprite.draw(c);
  }
  
  reactToPlayer(player) {
    if(!gameState.hostile) return;
    
	let relativePos = player.getCenter().sub(this.getCenter());
	// If player jumps on top of this, it explodes
	if (relativePos.y > (WALL_AVOIDER_RADIUS - .05)) {
      player.setVelocity(new Vector(player.getVelocity().x, 6));
      this.setDead(true);
	} else if (player.isSuperJumping) {
      this.setDead(true);
	} else {
      player.setDead(true);
	}
  }
}