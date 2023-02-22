import P5 from 'p5';
export default class Tile{

    constructor(i, j, attrition) {
      this.i = i;
      this.j = j;
      this.x = i * res;
      this.z = j * res;
      this.altitude = 0; //perlin noise
      
      this.R = 0;
      this.G = 0;
      this.B = 0;
      this.neighbors = [];
  
      //from pathfinding
      this.from = null;
      this.g = 99999;
      this.h = 0;
      this.attrition = attrition; //cost factor for making path, reduced when
      this.f = 99999;
      this.path = false; // used by path
      this.wall = false; // inaccessible terrain
      this.road = false; //roadwayrized when traffic hits certain value
      this.traffic = 0;
      this.trafficValue = 0;
      this.rotate = null;
  
      //ownership
      this.defense = 0; //topo higher
      this.security = 1; //from lord and neighbor
  
      // Neighbors
  
      this.castled = false;
      this.belong = null; //claimed by
      this.allDist = []; //distance to houses to determin
  
      this.occupied = false; // if occupied by building: lord, farmer[] or merchant[]
      this.occupiedBy = null; //should be a building object
      this.claimed = {}; // to be clarify
      this.buffer = false;
      this.habitable = true;//when initial
      this.openToOccupy = true; //change when occupation happens
  
      this.water = false;
      this.waterEdge = false;
      this.waterEdgeSecond = false;
      this.waterAccess = false;
      this.waterValue = 0; // not yet used
  
      this.farm = false;
      this.farmValue = 0; //available farms in range
      this.farmValueDiv = 0; //available farms divided by farmer population
      this.farmerNr = 0; //farmer population in range
      this.farmerValue = this.security + this.farmValue;
  
      this.merchantValue = this.security * this.traffic;
    }
  
    show() {
        P5.rect();
    }
}