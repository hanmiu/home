import { randInRange } from '../util/math.js';
import { Vector } from '../util/vector.js';
import { adjustAngleToTarget } from '../util/util.js';
import { Particle } from './particle.js';
import { ENEMY_CLOUD } from './enemy.js';
import { RotatingEnemy } from './rotatingenemy.js';

const CORROSION_CLOUD_RADIUS = .5;
const CORROSION_CLOUD_SPEED = .7;
const CORROSION_CLOUD_ACCEL = 10;

export class CorrosionCloud extends RotatingEnemy {
  constructor(center, target) {
	super(ENEMY_CLOUD, center, CORROSION_CLOUD_RADIUS, 0, 0);

	this.target = target;
	this.smoothedVelocity = new Vector(0, 0);
  }
  
  canCollide() {
	return false;
  }

  avoidsSpawn() {
	return true;
  }

  move(seconds) {
	let avoidingSpawn = false;
	if (!this.target) return new Vector(0, 0);
	let targetDelta = this.target.getCenter().sub(this.getCenter());
	// As long as the max rotation is over 2 pi, it will rotate to face the player no matter what
	this.heading = adjustAngleToTarget(this.heading, targetDelta.atan2(), 7);
	// ACCELERATION
	let speed = CORROSION_CLOUD_SPEED * CORROSION_CLOUD_ACCEL * seconds;
	this.velocity.x += speed * Math.cos(this.heading);
	this.velocity.y += speed * Math.sin(this.heading);

	if (this.velocity.lengthSquared() > (CORROSION_CLOUD_SPEED * CORROSION_CLOUD_SPEED)) {
      this.velocity.normalize();
      this.velocity.inplaceMul(CORROSION_CLOUD_SPEED);
	}

	return this.velocity.mul(seconds);
  }

  afterTick(seconds) {
	let direction = Vector.fromAngle(randInRange(0, 2 * Math.PI));
	let center = this.getCenter().add(direction.mul(randInRange(0, CORROSION_CLOUD_RADIUS)));

	let isRed = (this.target === gameState.playerA) ? 0.4 : 0;
	let isBlue = (this.target === gameState.playerB) ? 0.3 : 0;

	this.smoothedVelocity = this.smoothedVelocity.mul(0.95).add(this.velocity.mul(0.05));
	Particle.take().position(center).velocity(this.smoothedVelocity.sub(new Vector(0.1, 0.1)), this.smoothedVelocity.add(new Vector(0.1, 0.1))).radius(0.01, 0.1).bounces(0, 4).elasticity(0.05, 0.9).decay(0.01, 0.5).expand(1, 1.2).color(0.2 + isRed, 0.2, 0.2 + isBlue, 1).mixColor(0.1 + isRed, 0.1, 0.1 + isBlue, 1).circle().gravity(-0.4, 0);
};

  getTarget() {
	return this.target === gameState.playerB;
  }

  draw(c) {
	// do nothing, it's all particles!
  }
  
  reactToPlayer(player) {
    if(!gameState.hostile) return;
    
	let relativePos = player.getCenter().sub(this.getCenter());
	// If player jumps on top of this, it explodes
	if (relativePos.y > (CORROSION_CLOUD_RADIUS - .05)) {
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