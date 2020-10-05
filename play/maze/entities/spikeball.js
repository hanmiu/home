import { Sprite } from '../util/sprite.js';
import { Vector } from '../util/vector.js';
import { randInRange } from '../util/math.js';
import { Circle } from '../collisions/circle.js';
import { Enemy, ENEMY_SPIKE_BALL } from './enemy.js';

const SPIKE_BALL_RADIUS = 0.2;

function makeDrawSpikes(count) {
  let radii = [];
  for(let i = 0; i < count; i++) {
    radii.push(randInRange(0.5, 1.5));
  }
  return function(c) {
    c.strokeStyle = 'black';
    c.beginPath();
    for(let i = 0; i < count; i++) {
        let angle = i * (2 * Math.PI / count);
        let radius = SPIKE_BALL_RADIUS * radii[i];
        c.moveTo(0, 0);
        c.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    c.stroke();
  };
}

export class SpikeBall extends Enemy {
  // A boring old spike ball
  constructor(center) {
	super(ENEMY_SPIKE_BALL, 0);
	this.hitCircle = new Circle(center, SPIKE_BALL_RADIUS);

	this.sprites = [new Sprite(), new Sprite(), new Sprite()];

	this.sprites[0].drawGeometry = makeDrawSpikes(11);
	this.sprites[1].drawGeometry = makeDrawSpikes(13);
	this.sprites[2].drawGeometry = makeDrawSpikes(7);

	this.sprites[1].setParent(this.sprites[0]);
	this.sprites[2].setParent(this.sprites[0]);

	this.sprites[0].angle = randInRange(0, 2*Math.PI);
	this.sprites[1].angle = randInRange(0, 2*Math.PI);
	this.sprites[2].angle = randInRange(0, 2*Math.PI);
  }
  
  getShape() { return this.hitCircle; }

  canCollide() { return false; }

  afterTick(seconds) {
	this.sprites[0].offsetBeforeRotation = this.getCenter();

	this.sprites[0].angle -= seconds * (25 * Math.PI / 180);
	this.sprites[1].angle += seconds * (65 * Math.PI / 180);
	this.sprites[2].angle += seconds * (15 * Math.PI / 180);
  }

  draw(c) {
    let critter = critters['Spike Ball'];
    if(critter) {
      let pos = this.getCenter();
      c.fillStyle = 'black';
      c.save();
      c.translate(pos.x, pos.y);
      c.scale(0.005, -0.005);
      c.translate(-128, -128);
      c.fill(critter);
      c.restore();
    }
    
	this.sprites[0].draw(c);
  }
  
  reactToPlayer(player) {
    if(!gameState.hostile) return;
    
	let relativePos = player.getCenter().sub(this.getCenter());
	// If player jumps on top of this, it explodes
	if (relativePos.y > (SPIKE_BALL_RADIUS - .05)) {
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