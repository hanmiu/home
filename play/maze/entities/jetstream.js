import { Vector } from '../util/vector.js';
import { Sprite } from '../util/sprite.js';
import { RiotBullet } from './riotbullet.js';
import { ENEMY_JET_STREAM } from './enemy.js';
import { SpawningEnemy } from './spawningenemy.js';

const JET_STREAM_WIDTH = 0.4;
const JET_STREAM_HEIGHT = 0.4;
const JET_STREAM_SHOOT_FREQ = 0.2;
const NUM_BARRELS = 3;

const JET_STREAM_SPRITE_A = 0;
const JET_STREAM_SPRITE_B = 1;

export class JetStream extends SpawningEnemy {
  constructor(center, direction) {
	super(ENEMY_JET_STREAM, center, JET_STREAM_WIDTH, JET_STREAM_HEIGHT, 0, JET_STREAM_SHOOT_FREQ, 0);
	this.direction = direction;
	this.reloadAnimation = 0;

	this.sprites = [new Sprite(), new Sprite()];
	this.sprites[JET_STREAM_SPRITE_A].drawGeometry = this.sprites[JET_STREAM_SPRITE_B].drawGeometry = function(c) {
		c.strokeStyle = 'black';
		c.beginPath();
		for(let i = 0; i < NUM_BARRELS; i++) {
          let angle = i * (2 * Math.PI / NUM_BARRELS);
          c.moveTo(0, 0);
          c.lineTo(0.2 * Math.cos(angle), 0.2 * Math.sin(angle));
		}
		c.stroke();
	};
  }
  
  canCollide() { return false; }

  spawn() {
	gameState.addEnemy(new RiotBullet(this.getCenter(), this.direction), this.getCenter());
	return true;
  }

  afterTick(seconds) {
	this.reloadAnimation += seconds * (0.5 / JET_STREAM_SHOOT_FREQ);

	let angle = this.reloadAnimation * (2 * Math.PI / NUM_BARRELS);
	let targetAngle = this.direction - Math.PI / 2;
	let bodyOffset = Vector.fromAngle(targetAngle).mul(0.2);

	let position = this.getCenter();
	this.sprites[JET_STREAM_SPRITE_A].angle = targetAngle + angle;
	this.sprites[JET_STREAM_SPRITE_B].angle = targetAngle - angle;
	this.sprites[JET_STREAM_SPRITE_A].offsetBeforeRotation = position.sub(bodyOffset);
	this.sprites[JET_STREAM_SPRITE_B].offsetBeforeRotation = position.add(bodyOffset);

	// adjust for even NUM_BARRELS
	if (!(NUM_BARRELS & 1)) {
      this.sprites[JET_STREAM_SPRITE_B].angle += Math.PI / NUM_BARRELS;  
    }
  }

  draw(c) {
	let angle = this.reloadAnimation * (2 * Math.PI / NUM_BARRELS);
	let targetAngle = this.direction - Math.PI / 2;
	let position = this.getCenter();
	let bodyOffset = Vector.fromAngle(targetAngle).mul(0.2);

	c.fillStyle = 'yellow';
	c.strokeStyle = 'black';
    
    let critter = critters['Jet Stream'];
    if(critter) {
      c.save();
      c.translate(position.x, position.y);
      c.rotate(angle);
      c.scale(0.005, -0.005);
      c.translate(-128, -128);
      c.fill(critter);
      c.stroke(critter);
      c.restore();
      return;
    }
    
    this.sprites[JET_STREAM_SPRITE_A].draw(c);
	this.sprites[JET_STREAM_SPRITE_B].draw(c);

	for(let side = -1; side <= 1; side += 2)
	{
      for(let i = 0; i < NUM_BARRELS; i++)
      {
        let theta = i * (2 * Math.PI / NUM_BARRELS) - side * angle;
        let reload = (this.reloadAnimation - i * side) / NUM_BARRELS + (side == 1) * 0.5;

        // adjust for even NUM_BARRELS
        if(side == 1 && !(NUM_BARRELS & 1))
        {
          theta += Math.PI / NUM_BARRELS;
          reload -= 0.5 / NUM_BARRELS;
        }

        reload -= Math.floor(reload);

        let pos = position.add(bodyOffset.mul(side)).add(bodyOffset.rotate(theta));
        c.beginPath();
        c.arc(pos.x, pos.y, 0.1 * reload, 0, 2*Math.PI, false);
        c.fill();
        c.stroke();
      }
	}
  }
  
  reactToPlayer(player) {
    if(!gameState.hostile) return;
    
	let relativePos = player.getCenter().sub(this.getCenter());
	// If player jumps on top of this, it explodes
	if (relativePos.y > (JET_STREAM_HEIGHT - .05)) {
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