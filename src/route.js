import P5 from 'p5';
import * as THREE from 'three';
  
  //A* path finding algorithm, between two spots
  export default class Route {
    constructor(start, end, trafficWeight) {
      this.start = start;
      this.end = end;
      this.route = [];
      this.trafficWeight = trafficWeight;
    }
    show() {}
  }