import { Parameters } from "./parameters";

let roads = []; // is the global array for road pixels.
const waters = [];
const wateredArea = [];
const farms = [];
const habitable = [];
const openToOccupy = [];
const tilesCentralHabitable = [];
const mapEdge = [];
let edges = []; //voronoi edges, not implemented
let grid = [];
let tiles = [];
let tilesCentral = [];
let noiseScale = 0.2;
//huts related
let huts = [];
let nr = 0;
let castleTiles = [];
let minBuffer = 5;
let castes = ["Lord", "Farmer", "Merchant"];

//pathFinding related
var routes = []; //array for all routes
var routesNr = 0;
var routesFront = []; //array of routefront arrays
let routeTile = []; //road tiles
const landWaterChangeModeCost = 100; // high mode change cost
const heuristicValueFactor = 0.1; //can modify
const waterAttrition = 0.5
var waterMoveCost = 1; //alternative water move calculation
const landAttrition =1
var downhillFactor = 0.3;
var flatTerrainCost = 2;
let interRegionalTrafficWeight = 3; //traffic weights settings:

// value related
const waterAccessDist = 7;
var shopfronts = []; // shopfront tiles
const farmerRange = 10;
const weightFactor = 0.5; //
const claimRange = 20;
const waterLevel = 0;
const farmMin = 0; // altitude of farm
const farmMax = 30;
const highlandLevel = 50;
let start, end, castlePos;
// let p = new P5()
// const newMaterial = new THREE.MeshBasicMaterial()
// console.log(newMaterial)

// let a = new THREE.AmbientLight({color :'#ffffff'})
// console.log(a);



//parameters, to adjust in GUI




//tile related





function waterValue() {
  for (let water of waters) {
    for (
      let u = water.i - waterAccessDist;
      u < water.i + waterAccessDist;
      u++
    ) {
      for (
        let v = water.j - waterAccessDist;
        v < water.j + waterAccessDist;
        v++
      ) {
        if (u >= 0 && u < cols && v >= 0 && v < rows) {
          if (
            grid[u][v].altitude < highlandLevel &&
            grid[u][v].water == false &&
            dist(water.i, water.j, grid[u][v].i, grid[u][v].j) < waterAccessDist
          ) {
            grid[u][v].waterAccess = true;
            if(!wateredArea.includes(grid[u][v])){
              wateredArea.push(grid[u][v])}
          }
        }
      }
    }
  }
}

function farmValue() {
  for (let tile of tiles) {
    tile.farmValue = 0;
  }
  for (let farm of farms) {
    for (let u = farm.i - farmerRange; u < farm.i + farmerRange; u++) {
      for (let v = farm.j - farmerRange; v < farm.j + farmerRange; v++) {
        if (u >= 0 && u < cols+1 && v >= 0 && v < rows+1) {
          if (
            grid[u][v].wall == false &&
            grid[u][v].water == false &&
            dist(farm.i, farm.j, grid[u][v].i, grid[u][v].j) < farmerRange
          ) {
            grid[u][v].farmValue += 1 / (farm.farmerNr + 1);
            if (farm.waterAccess == true) {
              grid[u][v].farmValue += 1 / (farm.farmerNr + 1);
            }
          }
        }
      }
    }
  }
  for (let habit of habitable) {
    habit.farmerValue = habit.farmValue / 20 * sqrt(habit.security); //farmer's preference
    
  }
}

  
  
  
  function farmerPopulate() {
    let newCastle = new Farmer();
    huts.push(newCastle);
    nr++;
    newCastle.makeBuffer();
    farmValue();
  }
  
  class Farmer {
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
  function merchantPopulate() {
    merchantValue();
    let newCastle = new Merchant();
    huts.push(newCastle);
    nr++;
    newCastle.makeBuffer();
    merchantValue();
  }
  class Merchant {
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
  function newcomerPopulate() {
    newcomerValue();
    let newCastle = new Newcomer();
    huts.push(newCastle);
    nr++;
    newCastle.makeBuffer();
    newcommerValue();
  }
    
  
  
  
  //alternative: find the object that has min value of a property
  // Array.prototype.hasMin = function(attrib) {
  //     return (this.length && this.reduce(function(prev, curr){
  //         return prev[attrib] < curr[attrib] ? prev : curr;
  //     })) || null;
  //  }
  
  //A* path finding algorithm, between two spots
  class Route {
    constructor(start, end, trafficWeight) {
      this.start = start;
      this.end = end;
      this.route = [];
      this.trafficWeight = trafficWeight;
    }
    show() {}
  }
  
  function pathFinding(start, end, trafficWeight) {
    //reset grid......
    let closeSet = [];
    let openSet = [];
    let route = [];
    let moveCost;
    tileReset();
    addNeighbors();
    //.g is the accumulated cost
    //.h is the heuristic future cost from a node(guessed cost)
    start.g = 0;
  
    openSet.push(start);
    let current = start;
  
  
  
    //loop.............
    while (current != end) {
      openSet.sort((a, b) => (a.f > b.f ? 1 : -1)); //expensive
      // openSet.hasMin('f')
  
      current = openSet[0];
      openSet.splice(0, 1);
      closeSet.push(current);
  
      for (let neighbor of current.neighbors) {
        if (closeSet.includes(neighbor) == false && neighbor.wall == false) {
          neighbor.h =
            dist(neighbor.i, neighbor.j, end.i, end.j) * heuristicValueFactor;
          if (neighbor.water === true && current.water === true) {//waterAttrition is normally set lower
            moveCost =
              current.g +
              waterAttrition * dist(neighbor.i, neighbor.j, current.i, current.j);
          } else if (neighbor.water != current.water) { //mode change, landing from water
            moveCost =
              current.g +
              landWaterChangeModeCost +
              waterAttrition * dist(neighbor.i, neighbor.j, current.i, current.j);
          } else { //land movement, has flatTerrainCost
            moveCost =
              current.g +
              neighbor.attrition *
                (max(
                  0,
                  neighbor.altitude - current.altitude,
                  max(0, downhillFactor * (current.altitude - neighbor.altitude))
                ) +
                  flatTerrainCost) *
                dist(neighbor.i, neighbor.j, current.i, current.j);
          }
          if (moveCost < neighbor.g) {
            neighbor.from = current;
            neighbor.g = moveCost;
            neighbor.f = neighbor.g + neighbor.h;
          }
  
          if (openSet.includes(neighbor) == false) {
            openSet.push(neighbor);
          }
        }
      }
    }
  
    if (current == end) {
      var previous = end;
      while (previous.from != null) {
        route.push(previous);
        previous = previous.from;
        previous.occupied = true;
        previous.road = true;
  
        roads.push(previous);
  
        previous.traffic += trafficWeight; //to highway dest
  
        previous.attrition = round(1 / previous.traffic, 2); //the more the traffic the less the attrition
      }
      route.push(start);
      start.occupied = true;
      start.road = true;
      roads.push(start);
  
      //remove the trade route from buildable lots
      habitable = habitable.filter(function (el) {
        return !route.includes(el);
      });
      routes.push(route);
      routesFront.push([]);
      colorMode(RGB);
      beginShape();
      noFill();
  
      strokeWeight(res / 4);
      stroke(255, trafficWeight * 20);
      // stroke(255,100)
      vertex(route[0].x, route[0].y);
      for (let step = 0; step < route.length; step++) {
        curveVertex(route[step].x, route[step].y);
  
        routeTile.push(grid[route[step].i][route[step].j]);
        //remove duplicates in routesFront[routeNr] array
        for (let e of route[step].neighbors) {
          if (!routesFront[routesNr].includes(e)) {
            routesFront[routesNr].push(e);
            shopfronts.push(e);
            // vector = p5.Vector(route[step].i - ,)
          }
        }
      }
  
      vertex(route[route.length - 1].x, route[route.length - 1].y);
      endShape();
      for (let step = 0; step < route.length; step++) {
        textSize(9);
        noStroke();
        fill(255);
        text(round(route[step].g,1), route[step].x, route[step].y);
      }
  
      //route neighbor normal generation
      for (let step = 1; step < route.length - 1; step++) {
        let vector = createVector(
          route[step + 1].x - route[step - 1].x,
          route[step + 1].y - route[step - 1].y
        );
        let heading = vector.heading();
        for (let e of route[step].neighbors) {
          if (!e.rotate) {
            e.rotate = heading;
          }
        }
      }
  
      for (let shopfront of routesFront[routesNr]) {
        shopfront.trafficValue += trafficWeight;
      }
    }
    routesNr++;
  }
  
  function trafficValueShow() {
    for (let each of tiles) {
      colorMode(RGB);
      noStroke();
      rectMode(CENTER);
      let a = 3;
      fill(255, 1, 255, 50 * a);
      fill(255, 0, 0, 10 * sqrt(each.trafficValue));
      rect(each.x, each.y, res, res);
      // fill(0);
      // text(round(each.trafficValue), each.x, each.y + res);
    }
  }
  
 
  
  function roadTraffic() {
    for (let pave of roads) {
      stroke(50 * pave.traffic, 0, 0);
      strokeWeight((round(pave.traffic ** 0.3) * res) / 2);
      point(pave.x, pave.y);
    }
  }
  
  function drawRoutes() {
    noFill();
    colorMode(RGB);
    strokeWeight(res / 4);
    stroke(255, 50);
  
    for (let route of routes) {
      beginShape();
      vertex(route[0].x, route[0].y);
      for (var step = 0; step < route.length; step++) {
        curveVertex(route[step].x, route[step].y);
      }
      vertex(route[route.length - 1].x, route[route.length - 1].y);
      endShape();
    }
  }
  
  //Richard Qian Li refactored...
  //source: The Coding Train / Daniel Shiffman
  
  // function contourThree(){
    
  //   const terrainGeometry = new THREE.BufferGeometry();
  //   console.log(terrainGeometry);
  //   const terrainVertices = new Float32Array((cols+1)*(rows+1)*3)
    
  //   for(let i = 0; i<cols+1; i++){
  //     for(let j = 0; j <rows+1; j++){
  //       terrainVertices[(i*cols+i+j)*3] = i;
  //       terrainVertices[(i*cols+i+j)*3+1] = grid[i][j].altitude
  //       terrainVertices[(i*cols+i+j)*3+2] = j;
  //     }
  //   }
  //   terrainGeometry.setAttribute('position', new THREE.BufferAttribute(terrainVertices, 3)) 
  //   const particlesMaterial = new THREE.PointsMaterial({
  //     size: 1,
  //     sizeAttenuation: true
  // })
  //   console.log(terrainGeometry)
  //   const terrain = new THREE.Points(terrainGeometry, particlesMaterial)
  //   scene.add(terrain)
    
  //  }
  