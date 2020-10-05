import { Vector } from '../util/vector.js';
import { randInRange } from '../util/math.js';
import { Sprite } from '../util/sprite.js';
import { CollisionDetector } from '../collisions/collisiondetection.js';
import { STAT_ENEMY_DEATHS } from '../world/gamestate.js';
import { Particle } from './particle.js';
import { ENEMY_STALACBAT } from './enemy.js';
import { FreefallEnemy } from './freefallenemy.js';

let STALACBAT_RADIUS = 0.2;
let STALACBAT_SPEED = 2;
let STALACBAT_SPRITE_BODY = 0;
let STALACBAT_SPRITE_LEFT_WING = 1;
let STALACBAT_SPRITE_RIGHT_WING = 2;

export class Stalacbat extends FreefallEnemy {
  constructor(center, target) {
	super(ENEMY_STALACBAT, center, STALACBAT_RADIUS, 0);
	this.target = target;
	this.isFalling = false;

	this.sprites = [new Sprite(), new Sprite(), new Sprite()];
	// Draw circle for body
	this.sprites[STALACBAT_SPRITE_BODY].drawGeometry = function(c) {
      c.strokeStyle = 'black';
      c.beginPath();
      c.arc(0, 0, 0.1, 0, 2 * Math.PI, false);
      c.stroke();
      c.fill();
	}
	// Draw the two wings 
	this.sprites[STALACBAT_SPRITE_LEFT_WING].drawGeometry = this.sprites[STALACBAT_SPRITE_RIGHT_WING].drawGeometry = function(c) {
      c.strokeStyle = 'black';
      c.beginPath();
      c.arc(0, 0, 0.2, 0, Math.PI / 2, false);
      c.arc(0, 0, 0.15, Math.PI / 2, 0, true);
      c.stroke();

      c.beginPath();
      c.moveTo(0.07, 0.07);
      c.lineTo(0.1, 0.1);
      c.stroke();
	}

	this.sprites[STALACBAT_SPRITE_LEFT_WING].setParent(this.sprites[STALACBAT_SPRITE_BODY]);
	this.sprites[STALACBAT_SPRITE_RIGHT_WING].setParent(this.sprites[STALACBAT_SPRITE_BODY]);
  }
  
  // Falls when the target is directly beneat it
  move(seconds) {
	if (this.isFalling) {
      return FreefallEnemy.prototype.move.call(this, seconds);
	} else if (this.target !== null && !this.target.isDead()) {
      let playerPos = this.target.getCenter();
      let pos = this.getCenter();
      if ((Math.abs(playerPos.x - pos.x) < 0.1) && (playerPos.y < pos.y)) {
        if (!CollisionDetector.lineOfSightWorld(pos, playerPos, gameState.world)) {
          this.isFalling = true;
          return FreefallEnemy.prototype.move.call(this, seconds);
        }
      }
	}
	return new Vector(0, 0);
  }

  getTarget() {
	return this.target === gameState.playerB;
  }

  afterTick(seconds) {
	let percent = this.velocity.y * -0.25;
	if (percent > 1) {
      percent = 1;
	}

	let position = this.getCenter();
	this.sprites[STALACBAT_SPRITE_BODY].offsetBeforeRotation = new Vector(position.x, position.y + 0.1 - 0.2 * percent);

	let angle = percent * Math.PI / 2;
	this.sprites[STALACBAT_SPRITE_LEFT_WING].angle = Math.PI - angle;
	this.sprites[STALACBAT_SPRITE_RIGHT_WING].angle = angle - Math.PI / 2;
  }

  onDeath() {
	gameState.incrementStat(STAT_ENEMY_DEATHS);

	let isRed = (this.target === gameState.playerA) ? 0.8 : 0;
	let isBlue = (this.target === gameState.playerB) ? 1 : 0;

	let position = this.getCenter();
	for (let i = 0; i < 15; ++i) {
      let direction = Vector.fromAngle(randInRange(0, 2 * Math.PI)).mul(randInRange(5, 10));
      Particle.take().position(position).velocity(direction).radius(0.2).bounces(3).decay(0.01).elasticity(0.5).color(isRed, 0, isBlue, 1).triangle();
	}
  }

  draw(c) {
	// Draw the colored "eye"
	if (this.target === gameState.playerA) {
      c.fillStyle = 'red';
	}
	else {
      c.fillStyle = 'blue';
	}
    
    let critter = critters['Stalacbat'];
    if(critter) {
      let pos = this.getCenter();
      c.save();
      c.translate(pos.x, pos.y);
      c.scale(0.005, -0.005);
      c.translate(-128, -128);
      c.fill(critter);
      c.restore();
      return;
    }

	// Draw the black wings
	this.sprites[STALACBAT_SPRITE_BODY].draw(c);
  }
  
  reactToPlayer(player) {
    if(!gameState.hostile) return;
    
	let relativePos = player.getCenter().sub(this.getCenter());
	// If player jumps on top of this, it explodes
	if (relativePos.y > (STALACBAT_RADIUS - .05)) {
      player.setVelocity(new Vector(player.getVelocity().x, 6));
      this.setDead(true);
	} else if (player.isSuperJumping) {
      this.setDead(true);
	} else {
      player.setDead(true);
	}
  }
}