import P5 from 'p5';

export default class Merchant {
    constructor() {
      this.buffer = 0;
      this.trafficWeight = 3;
      habitable.sort((a, b) => (a.merchantValue < b.merchantValue ? 1 : -1));
      castlePos = habitable[0];
      this.i = castlePos.i;
      this.j = castlePos.j;
      this.x = this.i * res;
      this.y = this.j * res;
      this.color = color(220 + random(70), 130 + random(70), 50 + random(50));
  
      pathFinding(grid[this.i][this.j], start, this.trafficWeight);
      pathFinding(grid[this.i][this.j], end, this.trafficWeight);
      pathFinding(grid[this.i][this.j], castleTiles[0], this.trafficWeight * 2);
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
      this.control = []; //not clarified
      // it will increase security value of the tiles in Range(use farmer Range for a while)
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
              // grid[u][v].security += 1;
              grid[u][v].security +=
                5 /
                dist(grid[u][v].i, grid[u][v].j, castlePos.i, castlePos.j) ** 2;
            }
          }
        }
      }
    }
    makeBuffer() {
      for (let u = this.i - this.buffer; u < this.i + this.buffer; u++) {
        for (let v = this.j - this.buffer; v < this.j + this.buffer; v++) {
          if (
            u >= 0 &&
            u < cols+1 &&
            v >= 0 &&
            v < rows+1 &&
            dist(this.i, this.j, u, v) <= this.buffer
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
      fill(this.color);
      push();
      translate(this.x , this.y );
      if (grid[this.i][this.j].rotate) {
        rotate(grid[this.i][this.j].rotate);
      }
  
      rectMode(CENTER);
      rect(0, 0, res*0.6, res*0.8);
      rectMode(CORNER);
      pop();
    }
    shadow(){
      colorMode(RGB);
      noStroke();
      stroke(0);
      
      push();
      translate(this.x  +2, this.y  -2);
      if (grid[this.i][this.j].rotate) {
        rotate(grid[this.i][this.j].rotate);
      }
  
      rectMode(CENTER);
      fill(30);
      rect(0, 0, res*0.6, res*0.8);
      fill(30);
      rectMode(CORNER);
      pop();
    }
  }