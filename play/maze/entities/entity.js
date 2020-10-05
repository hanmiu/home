import { Vector } from '../util/vector.js';
import { CollisionDetector } from '../collisions/collisiondetection.js';
import { EDGE_FLOOR } from '../world/edge.js';
import { edgeQuad } from '../collisions/edgequad.js';

// class Entity
export class Entity {
  constructor() {
    this.velocity = new Vector(0, 0);

    // private variable to tell whether this enemy will be removed at the end of all Entity ticks
    this._isDead = false;
  }
  
  getVelocity() { 
    return this.velocity; 
  }
  
  setVelocity(vel) { 
    this.velocity = vel; 
  }

  isDead() { 
    return this._isDead; 
  }

  setDead(isDead) {
    if (this._isDead === isDead) return;
    this._isDead = isDead;
    if (this._isDead) this.onDeath();
    else this.onRespawn();
  }

  getCenter() { 
    return this.getShape().getCenter(); 
  }

  setCenter(vec) { 
    this.getShape().moveTo(vec); 
  }

  getColor() { 
    throw 'Entity.getColor() unimplemented'; 
  }

  getShape() { 
    throw 'Entity.getShape() unimplemented';
  }

  getCenter() {
    return this.getShape().getCenter(); 
  }
  
  setCenter(center) {
    this.getShape().moveTo(center);
  }

  isOnFloor() {
    // THIS IS A GLOBAL NOW var edgeQuad = new EdgeQuad();
    CollisionDetector.onEntityWorld(this, edgeQuad, gameState.world);
    return (edgeQuad.edges[EDGE_FLOOR] != null);
  }

  tick() {
    throw 'Entity.tick() unimplemented';
  }
  
  draw() {
    throw 'Entity.draw() unimplemented';
  }

  onDeath() {}
  onRespawn() {}
}