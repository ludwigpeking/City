export default class Lord {
    constructor() {
      this.buffer = 2;
      this.trafficWeight = 3;
  
      // the tile with highest 'defense'from terrain is selected as castle position
      tilesCentralHabitable.sort((a, b) => (a.defense < b.defense ? 1 : -1));
      castlePos = tilesCentralHabitable[0];
      this.i = castlePos.i;
      this.j = castlePos.j;
      this.x = this.i * res;
      this.z = this.j * res;
      castleTiles.push(castlePos);
      this.color = color(255);
  
      pathFinding(castlePos, start, this.trafficWeight);
      pathFinding(castlePos, end, this.trafficWeight);
      castlePos.attrition = 5000;
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
  
      //caste security to the realm
      for (let habit of habitable) {
        // habit.security +=
        //   5 +
        //   log(1 / ((habit.i - castlePos.i) ** 2 + (habit.j - castlePos.j) ** 2)) /
        //     log(10);
        habit.security += 100 / dist(habit.i, habit.j, castlePos.i, castlePos.j)**2;
      }
    }
    makeBuffer() {
      //farm value initiates
  
      for (let u = this.i - this.buffer; u < this.i + this.buffer; u++) {
        for (let v = this.j - this.buffer; v < this.j + this.buffer; v++) {
          if (
            u >= 0 &&
            u < cols &&
            v >= 0 &&
            v < rows &&
            dist(this.i, this.j, u, v) <= this.buffer
          ) {
            grid[u][v].buffer = true;
            grid[u][v].openToOccupy = false;
  
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
      rectMode(CENTER);
      fill(this.color);
      rect(this.x , this.y , res * 2, res * 2);
      circle(this.x , this.y , res*1.5);
      circle(this.x - res , this.y -res, res);
      circle(this.x + res , this.y+ res, res);
      circle(this.x + res, this.y-res, res);
      circle(this.x-res , this.y + res, res);
      rectMode(CORNER);
    }
    shadow(){
      colorMode(RGB);
      strokeWeight(0.5);
      stroke(0);
      rectMode(CENTER);
      fill(50)
      rect(this.x  + 3, this.y  - 3, res * 2, res * 2)
      rectMode(CORNER);
    }
  }