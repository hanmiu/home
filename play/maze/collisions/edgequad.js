// class EdgeQuad
export class EdgeQuad {
  constructor() {
    this.nullifyEdges();
	this.quantities = [0, 0, 0, 0];  
  }
  
  nullifyEdges() {
    this.edges = [null, null, null, null];
  }

  minimize(edge, quantity) {
    let orientation = edge.getOrientation();
    if(this.edges[orientation] == null || quantity < this.quantities[orientation]) {
      this.edges[orientation] = edge;
      this.quantities[orientation] = quantity;
    }
  }

  throwOutIfGreaterThan(minimum) {
    for(let i = 0; i < 4; i++) {
      if(this.quantities[i] > minimum) {
        this.edges[i] = null;
      }
    }
  }

  nullifyEdges() {
    this.edges = [null, null, null, null];
  }
  
  minimize(edge, quantity) {
    let orientation = edge.getOrientation();
    if(this.edges[orientation] == null || quantity < this.quantities[orientation]) {
      this.edges[orientation] = edge;
      this.quantities[orientation] = quantity;
    }
  }

  throwOutIfGreaterThan = function(minimum) {
    for(let i = 0; i < 4; i++) {
      if(this.quantities[i] > minimum) {
        this.edges[i] = null;
      }
    }
  }
}

// this is a global because we only ever need one and allocations are expensive
export let edgeQuad = new EdgeQuad();