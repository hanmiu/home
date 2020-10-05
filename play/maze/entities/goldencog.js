import { Vector } from '../util/vector.js';
import { randInRange } from '../util/math.js';
import { drawGoldenCog } from '../util/cog.js';
import { Circle } from '../collisions/circle.js';
import { GAME_IN_PLAY, STAT_NUM_COGS, STAT_COGS_COLLECTED } from '../world/gamestate.js';
import { Particle } from './particle.js';
import { Enemy } from './enemy.js';

export const GOLDEN_COG_RADIUS = 0.25;

export class GoldenCog extends Enemy {
  constructor(center) {
	super(-1, 0);

	this.hitCircle = new Circle(center, GOLDEN_COG_RADIUS);
	this.timeSinceStart = 0;

	gameState.incrementStat(STAT_NUM_COGS);
  }
  
  getShape() {
	return this.hitCircle;
  }

  reactToPlayer(player) {
	this.setDead(true);
  }

  onDeath() {
	if (gameState.gameStatus === GAME_IN_PLAY) {
      gameState.incrementStat(STAT_COGS_COLLECTED);
      
      if(gameState.stats[2] === gameState.stats[3]) {
        gameState.hostile = true;
        gameState.invincible = false;
        el_game.style.backgroundColor = '#efe13e';
      }
	}
	// Golden particle goodness
	let position = this.getCenter();
	for (let i = 0; i < 100; ++i) {
      let direction = Vector.fromAngle(randInRange(0, 2 * Math.PI));
      direction = this.velocity.add(direction.mul(randInRange(1, 5)));

      Particle.take().position(position).velocity(direction).radius(0.01, 1.5).bounces(0, 4).elasticity(0.05, 0.9).decay(0.01, 0.5).color(0.9, 0.87, 0, 1).mixColor(1, 0.96, 0, 1).triangle();
	}
  }

  afterTick(seconds) {
	this.timeSinceStart += seconds;
  }

  draw(c) {
	let position = this.getCenter();
	drawGoldenCog(c, position.x, position.y, this.timeSinceStart);
  }
}