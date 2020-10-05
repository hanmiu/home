import { AABB } from '../collisions/aabb.js';
import { Enemy } from './enemy.js';

export class SpawningEnemy extends Enemy {
  constructor(type, center, width, height, elasticity, frequency, startingTime) {
	super(type, elasticity);

	this.spawnFrequency = frequency;

	// Time until next enemy gets spawned
	this.timeUntilNextSpawn = startingTime;
	this.hitBox = AABB.makeAABB(center, width, height);
  }
 
  getShape() {
	return this.hitBox;
  }

  // return a number between 0 and 1 indicating how ready we are for
  // the next spawn (0 is just spawned and 1 is about to spawn)
  getReloadPercentage() {
	return 1 - this.timeUntilNextSpawn / this.spawnFrequency;
  }

  // Special tick to include a step to spawn enemies
  tick(seconds) {
	this.timeUntilNextSpawn -= seconds;

	if (this.timeUntilNextSpawn <= 0)
	{
      // If an enemy is spawned, increase the time by the spawn frequency
      if (this.spawn())
      {
        this.timeUntilNextSpawn += this.spawnFrequency;
      } else
      {
        this.timeUntilNextSpawn = 0;
      }
	}

	super.tick(seconds);
  }

  reactToPlayer(player) {}

  // Subclasses of this should overwrite Spawn() to spawn the right type of enemy
  // Returns true iff an enemy is actually spawned
  spawn() {
    throw 'SpawningEnemy.spawn() unimplemented';
  }
}