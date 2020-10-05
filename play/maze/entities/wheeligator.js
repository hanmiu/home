import { Edge, EDGE_FLOOR } from '../world/edge.js';
import { Vector } from '../util/vector.js';
import { Sprite } from '../util/sprite.js';
import { FREEFALL_ACCEL } from './freefallenemy.js';
import { ENEMY_WHEELIGATOR } from './enemy.js';
import { WalkingEnemy } from './walkingenemy.js';

const WHEELIGATOR_RADIUS = 0.3;
const WHEELIGATOR_SPEED = 3;
const WHEELIGATOR_ELASTICITY = 1;
const WHEELIGATOR_FLOOR_ELASTICITY = 0.3;

export class Wheeligator extends WalkingEnemy {
  constructor(center, angle) {
	super(ENEMY_WHEELIGATOR, center, WHEELIGATOR_RADIUS, WHEELIGATOR_ELASTICITY);

	this.hitGround = false;
	this.angularVelocity = 0;
	this.startsRight = (Math.cos(angle) > 0);

	this.bodySprite = new Sprite();
	this.bodySprite.drawGeometry = function(c) {
      let critter = critters['Wheeligator'];
      if(critter) {
        c.fillStyle = 'black';
        c.save();
        c.scale(0.005, -0.005);
        c.translate(-128, -128);
        c.fill(critter);
        c.restore();
        return;
      }
      let rim = 0.1;

      c.strokeStyle = 'black';
      c.beginPath();
      c.arc(0, 0, WHEELIGATOR_RADIUS, 0, 2*Math.PI, false);
      c.arc(0, 0, WHEELIGATOR_RADIUS - rim, Math.PI, 3*Math.PI, false);
      c.stroke();

      c.fillStyle = 'black';
      for(let i = 0; i < 4; i++) {
        let startAngle = i * (2*Math.PI / 4);
        let endAngle = startAngle + Math.PI / 4;
        c.beginPath();
        c.arc(0, 0, WHEELIGATOR_RADIUS, startAngle, endAngle, false);
        c.arc(0, 0, WHEELIGATOR_RADIUS - rim, endAngle, startAngle, true);
        c.fill();
      }
	};
  }
  
  move(seconds) {
	let isOnFloor = this.isOnFloor();

	if (!this.hitGround && isOnFloor) {
      if (this.velocity.x < WHEELIGATOR_SPEED) {
        this.velocity.x = this.startsRight ? WHEELIGATOR_SPEED : -WHEELIGATOR_SPEED;
        this.hitGround = true;
      }
	}

	if (isOnFloor) {
      this.angularVelocity = -this.velocity.x / WHEELIGATOR_RADIUS;
	}

	this.velocity.y += (FREEFALL_ACCEL * seconds);
	return this.velocity.mul(seconds);
  }

  reactToWorld(contact) {
	// If a floor, bounce off like elasticity is FLOOR_ELASTICITY
	if (Edge.getOrientation(contact.normal) === EDGE_FLOOR) {
      let perpendicular = this.velocity.projectOntoAUnitVector(contact.normal);
      let parallel = this.velocity.sub(perpendicular);
      this.velocity = parallel.add(perpendicular.mul(WHEELIGATOR_FLOOR_ELASTICITY));
      this.angularVelocity = -this.velocity.x / WHEELIGATOR_RADIUS;
	}
  }

  afterTick(seconds) {
	this.bodySprite.offsetBeforeRotation = this.getCenter();
	this.bodySprite.angle = this.bodySprite.angle + this.angularVelocity * seconds;
  }

  draw(c) {
	this.bodySprite.draw(c);
  }
  
  reactToPlayer(player) {
    if(!gameState.hostile) return;
    
	let relativePos = player.getCenter().sub(this.getCenter());
	// If player jumps on top of this, it explodes
	if (relativePos.y > (WHEELIGATOR_RADIUS - .05)) {
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