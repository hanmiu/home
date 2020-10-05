import { Sprite } from '../util/sprite.js';
import { Vector } from '../util/vector.js';
import { STAT_ENEMY_DEATHS } from '../world/gamestate.js';
import { ENEMY_SHOCK_HAWK } from './enemy.js';
import { HoveringEnemy } from './hoveringenemy.js';

const SHOCK_HAWK_RADIUS = 0.3;
const SHOCK_HAWK_ACCEL = 6;
const SHOCK_HAWK_DECEL = 0.8;
const SHOCK_HAWK_RANGE = 10;

export class ShockHawk extends HoveringEnemy {
  constructor(center, target) {
	super(ENEMY_SHOCK_HAWK, center, SHOCK_HAWK_RADIUS, 0);
	this.target = target;
	this.chasing = false;

	this.bodySprite = new Sprite();
	this.bodySprite.drawGeometry = function(c) {
      // draw solid center
      c.beginPath();
      c.moveTo(0, -0.15);
      c.lineTo(0.05, -0.1);
      c.lineTo(0, 0.1);
      c.lineTo(-0.05, -0.1);
      c.fill();

      // draw outlines
      c.beginPath();
      for(let scale = -1; scale <= 1; scale += 2) {
        c.moveTo(0, -0.3);
        c.lineTo(scale * 0.05, -0.2);
        c.lineTo(scale * 0.1, -0.225);
        c.lineTo(scale * 0.1, -0.275);
        c.lineTo(scale * 0.15, -0.175);
        c.lineTo(0, 0.3);

        c.moveTo(0, -0.15);
        c.lineTo(scale * 0.05, -0.1);
        c.lineTo(0, 0.1);
      }
      c.stroke();
	};
  }
  
  getTarget() { return target === gameState.playerB; }
  setTarget(player) { this.target = player; }

  avoidsSpawn() {
	if (this.chasing) {
      return false;
	} else {
      return true;
	}
  }

  move(seconds) {
	// Time independent version of multiplying by 0.998
	// solved x^0.01 = 0.998 for x very precisely using wolfram alpha
	this.velocity.inplaceMul(Math.pow(0.8185668046884278157989334904543296243702023236680159019579, seconds));
	if (!this.target || this.target.isDead()) {
      this.chasing = false;
      return this.accelerate(this.velocity.mul(-SHOCK_HAWK_DECEL), seconds);
	}
	let relTargetPos = this.target.getCenter().sub(this.getCenter());
	if (relTargetPos.lengthSquared() > (SHOCK_HAWK_RANGE * SHOCK_HAWK_RANGE)) {
      this.chasing = false;
      return this.accelerate(this.velocity.mul(-SHOCK_HAWK_DECEL), seconds);
	}
	this.chasing = true;
	relTargetPos.normalize();
	let accel = relTargetPos.mul(SHOCK_HAWK_ACCEL);
	return this.accelerate(accel, seconds);
  }

  afterTick(seconds) {
	let position = this.getCenter();
	this.bodySprite.offsetBeforeRotation = position;
	if(!this.target.isDead()) {
      this.bodySprite.angle = this.target.getCenter().sub(position).atan2() - Math.PI / 2;
	}
  }

  draw(c) {
    c.fillStyle = (this.target == gameState.playerA) ? 'red' : 'blue';
    c.strokeStyle = 'black';
    if(!critters['Shockhawk']) {
      this.bodySprite.draw(c);
    }
	else {
      let center = this.getCenter();
      c.save();
      c.translate(center.x, center.y);
      c.scale(0.008, -0.008);
      c.translate(-320, -240);
      c.fill(critters['Shockhawk']);
      c.restore();
    }
  }
  
  reactToPlayer(player) {
    if(!gameState.hostile) return;
    
	let relativePos = player.getCenter().sub(this.getCenter());
	// If player jumps on top of this, it explodes
	if (relativePos.y > (SHOCK_HAWK_RADIUS - .05)) {
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