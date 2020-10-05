import { DOORBELL_OPEN, DOORBELL_CLOSE, DOORBELL_TOGGLE } from '../entities/doorbell.js';
import { Edge } from './edge.js';

// enum DoorType
export const ONE_WAY = 0;
export const TWO_WAY = 1;

export class Door {
  constructor(edge0, edge1, cell0, cell1) {
    this.cells = [cell0, cell1];
	this.edges = [edge0, edge1];
  }
  
  doorExists(i) {
    if (this.edges[i] === null) {
      return false;
    }

    let cell = this.cells[i];

    return cell !== null && cell.getEdge(this.edges[i]) !== -1;
  }

  doorPut(i, kill) {
    if (this.edges[i] !== null && !this.doorExists(i)) {
      let cell = this.cells[i];
      if (cell === null) {
        return;
      }

      let edge = new Edge(this.edges[i].getStart(), this.edges[i].getEnd(), this.edges[i].color);
      edge.for_door = true;
      cell.addEdge(edge);

      if (kill) {
        gameState.killAll(this.edges[i]);
      }

      gameState.recordModification();
    }
  }

  doorRemove(i) {
    if (this.edges[i] !== null && this.doorExists(i)) {
      let cell = this.cells[i];
      if (cell === null) {
        return;
      }

      cell.removeEdge(this.edges[i]);

      gameState.recordModification();
    }
  }

  act(behavior, force, kill) {
    for (let i = 0; i < 2; ++i) {
      switch (behavior) {
      case DOORBELL_OPEN:
        this.doorRemove(i);
        break;
      case DOORBELL_CLOSE:
        this.doorPut(i, kill);
        break;
      case DOORBELL_TOGGLE:
        if(this.doorExists(i)) {
          this.doorRemove(i);
        } else {
          this.doorPut(i, kill);  
        }
        break;
      }
    }
  }
}