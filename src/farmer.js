import P5 from 'p5';
import * as THREE from 'three';

export default class Farmer {
    constructor() {
      this.buffer = 1;
      this.trafficWeight = 1;
  
      // the tile with highest 'defense'from terrain is selected as castle position
      habitable.sort((a, b) => (a.farmerValue < b.farmerValue ? 1 : -1));
      castlePos = habitable[0];
      this.i = castlePos.i;
      this.j = castlePos.j;
      this.x = this.i * res;
      this.y = this.j * res;
      this.R =120 + random(50)
      this.G=120 + random(50)
      this.B=50 + random(50)
      this.color = color(120 + random(50),120 + random(50),50 + random(50))
      
      // pathFinding(grid[this.i][this.j], start, this.trafficWeight);
      // pathFinding(grid[this.i][this.j], end, this.trafficWeight);
      if(castleTiles[0]){
        pathFinding(castlePos, castleTiles[0], this.trafficWeight * 2);
      } else {
        pathFinding(castlePos, start, this.trafficWeight);
        pathFinding(castlePos, end, this.trafficWeight);
      }
      castlePos.attrition = 500;
      castlePos.occupied = true;
      castlePos.occupiedBy = this;
      habitable = habitable.filter((item) => item !== castlePos);
      tilesCentralHabitable = tilesCentralHabitable.filter(
        (item) => item !== castlePos
      );
      for (let neighbor of castlePos.neighbors) {
        neighbor.occupied = true;
      }
  
      this.weight = 1;
      this.nr = nr; //not necessary
      this.control = []; //voronoi claimed tiles
      // the farmer will increase the farmerNr of the tiles in farmerRange
      for (
        let u = castlePos.i - farmerRange;
        u < castlePos.i + farmerRange;
        u++
      ) {
        for (
          let v = castlePos.j - farmerRange;
          v < castlePos.j + farmerRange;
          v++
        ) {
          if (u >= 0 && u < cols && v >= 0 && v < rows) {
            if (
              dist(castlePos.i, castlePos.j, grid[u][v].i, grid[u][v].j) <=
              farmerRange
            ) {
              grid[u][v].farmerNr++;
  
              grid[u][v].security +=
                5 /
                dist(grid[u][v].i, grid[u][v].j, castlePos.i, castlePos.j) ** 2;
            }
          }
        }
      }
    }
    makeBuffer() {
      for (let u = this.i - round(this.buffer); u < this.i + round(this.buffer); u++) {
        for (let v = this.j - round(this.buffer); v < this.j + round(this.buffer); v++) {
          if (
            u >= 0 &&
            u < cols &&
            v >= 0 &&
            v < rows &&
            dist(this.i, this.j, u, v) < this.buffer
          ) {
            grid[u][v].buffer = true;
            grid[u][v].habitable = false;
  
            habitable = habitable.filter((item) => item !== grid[u][v]);
            tilesCentralHabitable = tilesCentralHabitable.filter(
              (item) => item !== grid[u][v]
            );
          }
        }
      }
    }
    show() {
      colorMode(RGB);
      strokeWeight(0.5);
      stroke(0);
      fill(this.R + 120, this.G+110, this.B + 110);
      
      
      push();
      translate(this.x , this.y );
      if (grid[this.i][this.j].rotate) {
        rotate(grid[this.i][this.j].rotate);
      }
  
      rectMode(CENTER);
      rect(0, 0, res*0.8, res*0.8);
      rectMode(CORNER);
      pop();
      
      
    }
    shadow(){
      colorMode(RGB);
      noStroke()
      fill(30);
      ellipse(this.x  +2, this.y -2, 1.1 * res, 1.1 * res);
    }
    
  }