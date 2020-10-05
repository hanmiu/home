import { Vector } from '../util/vector.js';
import { Sprite } from '../util/sprite.js';
import { adjustAngleToTarget } from '../util/util.js';
import { CollisionDetector } from '../collisions/collisiondetection.js';
import { ENEMY_HUNTER } from './enemy.js';
import { RotatingEnemy } from './rotatingenemy.js';

const HUNTER_BODY = 0;
const HUNTER_CLAW1 = 1;
const HUNTER_CLAW2 = 2;

const HUNTER_RADIUS = 0.3;
const HUNTER_ELASTICITY = 0.4;
const HUNTER_CHASE_ACCEL = 14;
const HUNTER_FLEE_ACCEL = 3;
const HUNTER_FLEE_RANGE = 10;
const HUNTER_CHASE_RANGE = 8;
const HUNTER_LOOKAHEAD = 20;

const STATE_IDLE = 0;
const STATE_RED = 1;
const STATE_BLUE = 2;
const STATE_BOTH = 3;

export class Hunter extends RotatingEnemy {
  constructor(center) {
	super(ENEMY_HUNTER, center, HUNTER_RADIUS, 0, HUNTER_ELASTICITY);

	this.state = STATE_IDLE;
	this.acceleration = new Vector(0, 0);
	this.jawAngle = 0;

	this.sprites = [new Sprite(), new Sprite(), new Sprite()];
	this.sprites[HUNTER_BODY].drawGeometry = function(c) {
      c.beginPath();
      c.arc(0, 0, 0.1, 0, 2*Math.PI, false);
      c.stroke();
	};
	this.sprites[HUNTER_CLAW1].drawGeometry = this.sprites[HUNTER_CLAW2].drawGeometry = function(c) {
      c.beginPath();
      c.moveTo(0, 0.1);
      for(let i = 0; i <= 6; i++)
          c.lineTo((i & 1) / 24, 0.2 + i * 0.05);
      c.arc(0, 0.2, 0.3, 0.5*Math.PI, -0.5*Math.PI, true);
      c.stroke();
	};
	this.sprites[HUNTER_CLAW1].setParent(this.sprites[HUNTER_BODY]);
	this.sprites[HUNTER_CLAW2].setParent(this.sprites[HUNTER_BODY]);
	this.sprites[HUNTER_CLAW2].flip = true;
	this.sprites[HUNTER_BODY].offsetAfterRotation = new Vector(0, -0.2);
  }
  
  avoidsSpawn() { return true; }

  calcAcceleration(target) {
	return target.unit().sub(this.velocity.mul(3.0 / HUNTER_CHASE_ACCEL)).unit().mul(HUNTER_CHASE_ACCEL);
  }

  playerInSight(target, distanceSquared) {
	if (target.isDead()) return false;
	let inSight = distanceSquared < (HUNTER_CHASE_RANGE * HUNTER_CHASE_RANGE);
	inSight &= !CollisionDetector.lineOfSightWorld(this.getCenter(), target.getCenter(), gameState.world);
	return inSight;
  }

  move(seconds) {
	// Relative player positions
	let deltaA = gameState.playerA.getCenter().sub(this.getCenter());
	let deltaB = gameState.playerB.getCenter().sub(this.getCenter());
	// Projection positions with lookahead
	let projectedA = deltaA.add(gameState.playerA.getVelocity().mul(HUNTER_LOOKAHEAD * seconds));
	let projectedB = deltaB.add(gameState.playerB.getVelocity().mul(HUNTER_LOOKAHEAD * seconds));
	// Squared distances
	let distASquared = deltaA.lengthSquared();
	let distBSquared = deltaB.lengthSquared();
	// Checks if players are in sight
	let inSightA = this.playerInSight(gameState.playerA, distASquared);
	let inSightB = this.playerInSight(gameState.playerB, distBSquared);

	// If player A is in sight
	if (inSightA) {
      // If both in sight
      if (inSightB) {
        // If they're on the same side of the Hunter, the Hunter will flee
        if ((deltaA.dot(this.velocity) * deltaB.dot(this.velocity)) >= 0) {
          this.acceleration = deltaA.unit().add(deltaB.unit()).mul(-.5 * HUNTER_FLEE_ACCEL);
          this.target = null;
          this.state = STATE_BOTH;
        } else if (distASquared < distBSquared) {
          // Otherwise the hunter will chase after the closer of the two players
          this.acceleration = this.calcAcceleration(projectedA);
          this.target = gameState.playerA;
          this.state = STATE_RED;
        } else {
          this.acceleration = this.calcAcceleration(projectedB);
          this.target = gameState.playerB;
          this.state = STATE_BLUE;
        }
      // If only player A in sight
      } else {
        this.acceleration = this.calcAcceleration(projectedA);
        this.target = gameState.playerA;
        this.state = STATE_RED;
      }
	} else if (inSightB) {
      // If only player B in sight
      this.acceleration = this.calcAcceleration(projectedB);
      this.target = gameState.playerB;
      this.state = STATE_BLUE;
	} else {
      this.acceleration.x = this.acceleration.y = 0;
      this.target = null;
      this.state = STATE_IDLE;
	}

	// Damp the movement so it doesn't keep floating around
	// Time independent version of multiplying by 0.99
	this.velocity.inplaceMul(Math.pow(0.366032, seconds));

	return this.accelerate(this.acceleration, seconds);
  }

  afterTick(seconds) {
	let position = this.getCenter();
	this.sprites[HUNTER_BODY].offsetBeforeRotation = position;

	if (this.target)
	{
		let currentAngle = this.sprites[HUNTER_BODY].angle;
		let targetAngle = this.target.getCenter().sub(position).atan2() - Math.PI / 2;
		this.sprites[HUNTER_BODY].angle = adjustAngleToTarget(currentAngle, targetAngle, Math.PI * seconds);
	}

	let targetJawAngle = this.target ? -0.2 : 0;
	this.jawAngle = adjustAngleToTarget(this.jawAngle, targetJawAngle, 0.4 * seconds);
	this.sprites[HUNTER_CLAW1].angle = this.jawAngle;
	this.sprites[HUNTER_CLAW2].angle = this.jawAngle;
  }

  draw(c) {
	c.fillStyle = (this.target == gameState.playerA) ? 'red' : 'blue';
	c.strokeStyle = 'black';

	if (this.state != STATE_IDLE)
	{
      let angle = this.sprites[HUNTER_BODY].angle + Math.PI / 2;
      let fromEye = Vector.fromAngle(angle);
      let eye = this.getCenter().sub(fromEye.mul(0.2));

      if(this.state == STATE_RED) {
        c.fillStyle = 'red';
        c.beginPath();
        c.arc(eye.x, eye.y, 0.1, 0, 2*Math.PI, false);
        c.fill();
      } else if(this.state == STATE_BLUE) {
        c.fillStyle = 'blue';
        c.beginPath();
        c.arc(eye.x, eye.y, 0.1, 0, 2*Math.PI, false);
        c.fill();
      } else {
        c.fillStyle = 'red';
        c.beginPath();
        c.arc(eye.x, eye.y, 0.1, angle, angle + Math.PI, false);
        c.fill();

        c.fillStyle = 'blue';
        c.beginPath();
        c.arc(eye.x, eye.y, 0.1, angle + Math.PI, angle + 2*Math.PI, false);
        c.fill();

        c.beginPath();
        c.moveTo(eye.x - fromEye.x * 0.1, eye.y - fromEye.y * 0.1);
        c.lineTo(eye.x + fromEye.x * 0.1, eye.y + fromEye.y * 0.1);
        c.stroke();
      }
	}

	this.sprites[HUNTER_BODY].draw(c);
  }
  
  reactToPlayer(player) {
    if(!gameState.hostile) return;
    
	let relativePos = player.getCenter().sub(this.getCenter());
	// If player jumps on top of this, it explodes
	if (relativePos.y > (HUNTER_RADIUS - .05)) {
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