import * as THREE from 'three'
import { Parameters } from './parameters.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {mergeVertices} from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import P5 from 'p5'
import GUI from 'lil-gui';

const gui = new GUI();
gui.add(Parameters, 'camY', 0, 1000, 1)
gui.add(Parameters, 'camZ', -10000, 10000, 1)
gui.add(Parameters, 'camX', -10000, 10000, 1)

let p = new P5();
const canvas = document.querySelector('canvas.webgl');
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

//THREE.js Objects
// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xa0a0c0 );
scene.fog = new THREE.Fog( 0xa0a0c0, 1000, 5000 );

// Base camera
const camera = new THREE.PerspectiveCamera(120, sizes.width / sizes.height, 1, 10000)
camera.position.set(parameters.camX, parameters.camY, parameters.camZ)
camera.lookAt(new THREE.Vector3(cols*res/2, -1000, rows*res/2));
// camera.getWorldDirection(new THREE.Vector3(0, -0.5, -1).normalize())
scene.add(camera)
const helper = new THREE.CameraHelper( camera );
// scene.add( helper );

// Canvas
const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444, 0.2 );
hemiLight.position.set( 0, 100, 0 );
scene.add( hemiLight );


tiling();
console.log(cols, rows, tiles.length);
tradeRoute();


//terrain
const sphere = new THREE.SphereGeometry(50,50,50)
const terrain = new THREE.BufferGeometry()
const positionsArray = new Float32Array(cols*rows*18);
const colorArray = new Float32Array(cols*rows*18);

for(let i = 0; i < cols ; i++){
  
    for (let j = 0; j <rows; j++){
        positionsArray[(i*rows + j)*18] = grid[i][j].x;
        positionsArray[(i*rows + j)*18+1] = grid[i][j].altitude;
        positionsArray[(i*rows + j)*18+2] = grid[i][j].z;

        colorArray[(i*rows + j)*18] = grid[i][j].R;
        colorArray[(i*rows + j)*18+1] = grid[i][j].G;
        colorArray[(i*rows + j)*18+2] = grid[i][j].B;

        positionsArray[(i*rows + j)*18+3] = grid[i][j+1].x;
        positionsArray[(i*rows + j)*18+4] = grid[i][j+1].altitude;
        positionsArray[(i*rows + j)*18+5] = grid[i][j+1].z;

        colorArray[(i*rows + j)*18+3] = grid[i][j+1].R;
        colorArray[(i*rows + j)*18+4] = grid[i][j+1].G;
        colorArray[(i*rows + j)*18+5] = grid[i][j+1].B;
        
        positionsArray[(i*rows + j)*18+6] = grid[i+1][j].x;
        positionsArray[(i*rows + j)*18+7] = grid[i+1][j].altitude;
        positionsArray[(i*rows + j)*18+8] = grid[i+1][j].z;

        colorArray[(i*rows + j)*18+6] = grid[i+1][j].R;
        colorArray[(i*rows + j)*18+7] = grid[i+1][j].G;
        colorArray[(i*rows + j)*18+8] = grid[i+1][j].B;

        positionsArray[(i*rows + j)*18+9] = grid[i+1][j].x;
        positionsArray[(i*rows + j)*18+10] = grid[i+1][j].altitude;
        positionsArray[(i*rows + j)*18+11] = grid[i+1][j].z;

        colorArray[(i*rows + j)*18+9] = grid[i+1][j].R;
        colorArray[(i*rows + j)*18+10] = grid[i+1][j].G;
        colorArray[(i*rows + j)*18+11] = grid[i+1][j].B;

        positionsArray[(i*rows + j)*18+12] = grid[i][j+1].x;
        positionsArray[(i*rows + j)*18+13] = grid[i][j+1].altitude;
        positionsArray[(i*rows + j)*18+14] = grid[i][j+1].z;

        colorArray[(i*rows + j)*18+12] = grid[i][j+1].R;
        colorArray[(i*rows + j)*18+13] = grid[i][j+1].G;
        colorArray[(i*rows + j)*18+14] = grid[i][j+1].B;

        positionsArray[(i*rows + j)*18+15] = grid[i+1][j+1].x;
        positionsArray[(i*rows + j)*18+16] = grid[i+1][j+1].altitude;
        positionsArray[(i*rows + j)*18+17] = grid[i+1][j+1].z;

        colorArray[(i*rows + j)*18+15] = grid[i+1][j+1].R;
        colorArray[(i*rows + j)*18+16] = grid[i+1][j+1].G;
        colorArray[(i*rows + j)*18+17] = grid[i+1][j+1].B;

    }
}
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
const colorAttribute = new THREE.BufferAttribute(colorArray,3);

terrain.setAttribute('position', positionsAttribute)
terrain.setAttribute('color', colorAttribute);
//important
// terrain.computeVertexNormals( );
// const material = new THREE.MeshStandardMaterial( { 
//   color: 0xff0000, 
  
//  } )
// const material = new THREE.MeshNormalMaterial({ side:THREE.DoubleSide } )
const material = new THREE.MeshStandardMaterial(
  { side:THREE.DoubleSide,
    vertexColors: true,
  } )
// const mesh = new THREE.Mesh(terrain, material)

const geometry = mergeVertices(terrain);
// const geometry = terrain;
geometry.computeVertexNormals();
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

// const ambientLight = new THREE.AmbientLight(0x404040)
// scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(0,1,0)
scene.add(directionalLight)



// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()


const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()
    // camera.update()
    // camera.position.set(parameters.camX, parameters.camY, parameters.camZ)
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()



function addNeighbors() {
    for (var i = 0; i < cols+1; i++) {
        for (var j = 0; j < rows+1; j++) {
          if (i < cols ) {
              grid[i][j].neighbors.push(grid[i + 1][j]);
          }
          if (i > 0) {
              grid[i][j].neighbors.push(grid[i - 1][j]);
          }
          if (j < rows ) {
              grid[i][j].neighbors.push(grid[i][j + 1]);
          }
          if (j > 0) {
              grid[i][j].neighbors.push(grid[i][j - 1]);
          }
          if (i > 0 && j > 0) {
              grid[i][j].neighbors.push(grid[i - 1][j - 1]);
          }
          if (i < cols  && j > 0) {
              grid[i][j].neighbors.push(grid[i + 1][j - 1]);
          }
          if (i > 0 && j < rows ) {
              grid[i][j].neighbors.push(grid[i - 1][j + 1]);
          }
          if (i < cols && j < rows ) {
              grid[i][j].neighbors.push(grid[i + 1][j + 1]);
          }
        }
      }
  }   
  
function tiling() {
    p.noiseSeed(seed);
    for (let i = 0; i < cols + 1; i++) {
        grid.push([]);
        for (let j = 0; j < rows + 1; j++) {
        grid[i][j] = new Tile(i, j, landAttrition);
        tiles.push(grid[i][j]);
        if (
            i > cols / 4 &&
            i < (cols * 3) / 4 &&
            j > rows / 4 &&
            j < (rows * 3) / 4
        ) {
            tilesCentral.push(grid[i][j]);
        }
        // 3 octave frequency perlin noise
        
        grid[i][j].altitude = round(
            40 * p.noise(noiseScale * i, noiseScale * j) +
            60 *
                p.noise(
                0.3 * noiseScale * i,
                0.3 * noiseScale * j
                ) +
            150 *
                (p.noise(
                0.1 * noiseScale * i,
                0.1 * noiseScale * j
                ) -
                0.6)
        );

        if (grid[i][j].altitude <0){
          grid[i][j].R= 0.1;
          grid[i][j].G = 0.3;
          grid[i][j].B = 0.8;
        } else if(grid[i][j].altitude <=1){
          grid[i][j].R= 0.95;
          grid[i][j].G = 0.95;
          grid[i][j].B = 0.85;
        }else {
          grid[i][j].R = 0.3 + grid[i][j].altitude * 2/100;
          grid[i][j].G = 0.6 + grid[i][j].altitude * 1/100;
          grid[i][j].B = 0.3 + grid[i][j].altitude * 1.5/100;
        }
        

      
        if (grid[i][j].altitude <= waterLevel) {
            grid[i][j].attrition = waterAttrition;
            grid[i][j].water = true;
            grid[i][j].altitude = -2
            waters.push(grid[i][j]);
    
        } else if (grid[i][j].altitude > highlandLevel) {
            //grid[i][j].wall = true;
    
        } else if (
            grid[i][j].altitude > farmMin &&
            grid[i][j].altitude <= farmMax
        ) {
            grid[i][j].farm = true;
            farms.push(grid[i][j]);
    
            habitable.push(grid[i][j]);
        } else {
    
            habitable.push(grid[i][j]);
        }
        }
    }
    tilesCentralHabitable = tilesCentral.filter((value) =>
        habitable.includes(value)
    );
    waterValue();
    farmValue();
    
        //farm value initiates, farmValue is from the amount of farms available around
        for (let farm of farms) {
            for (let u = farm.i - farmerRange; u < farm.i + farmerRange; u++) {
            for (let v = farm.j - farmerRange; v < farm.j + farmerRange; v++) {
                if (u >= 0 && u < cols && v >= 0 && v < rows) {
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
    
        addNeighbors();
      
        //defense value initiates, waterAccess is required
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
            if (grid[i][j].waterAccess == false || grid[i][j].water == true) {
                grid[i][j].defense = 0;
            } else {
                let altitudeChange = 0;
                for (let neighbor of grid[i][j].neighbors) {
                for (let subNeighbor of neighbor.neighbors){
                    altitudeChange += grid[i][j].altitude - subNeighbor.altitude;
                }
                }
                grid[i][j].defense = altitudeChange;
            }
            }
        }
        mapEdgeDefine();
    }
  
    
    
  function mapEdgeDefine() {
      for (let tile of tiles) {
        if (
        tile.i == 0 ||
        tile.i == cols  ||
        tile.j == 0 ||
        tile.j == rows 
        ) {
          
          mapEdge.push(tile);
        }
      }
    }
      
function showWater() {
    for (let water of waters) {
    fill(140, 180, 250);
    noStroke();
    rect(water.x, water.y, res, res);
    } 
}

  function terrainDefense() {
      let to = color(255, 0, 0, 255);
      let from = color(255, 255, 0, 0);
      colorMode(RGB); // Try changing to HSB.
      let interA = lerpColor(from, to, 0.33);
      let interB = lerpColor(from, to, 0.66);
    
          
          for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
              if (grid[i][j].defense > 0) {
                noStroke();
                colorMode(RGB)
                let fillColor = lerpColor(from, to, grid[i][j].defense/1200);
                fill(fillColor);
                rectMode(CENTER)
                rect(grid[i][j].x, grid[i][j].y, res, res);
                fill(0)
                textSize(res*0.8)
                text(round(grid[i][j].defense/100),grid[i][j].x+res/3, grid[i][j].y+res/3)
              }
            }
          }
    }
      
    
      
  function waterValueShow() {
      for (let area of wateredArea) {
        noStroke();
        colorMode(RGB);
        fill(0, 0, 255,50);
        rect(area.x, area.y, res, res);
      }
    }
      
      //farm value initiates, farmValue is from the amount of farms available around
    
      
  function farmValueShow() {
      colorMode(HSB);
      for (let lot of habitable){
          fill(100 - lot.farmValue *0.1, 100, 100);
          //fill( lot.farmValue, 255 - lot.farmValue, 0);
          noStroke();
          rect(lot.x, lot.y, res, res);
          fill(0)
        textSize(8)
          text(round(lot.farmValue/15), lot.x+res/3,lot.y+res/3)
      }
      colorMode(RGB)
    }
      
  function farmerValueShow() {
      colorMode(HSB);
      for (let lot of habitable){
          fill(sqrt(lot.farmerValue)*3, 100, 100);
          //fill( lot.farmValue, 255 - lot.farmValue, 0);
          noStroke();
        rectMode(CENTER)
          rect(lot.x, lot.y, res, res);
          fill(0)
        textSize(8)
          text(round(sqrt(lot.farmerValue))*3, lot.x+res/3,lot.y+res/3)
      }
      colorMode(RGB)
    }
      
  function securityValueShow(){
      for (let habit of habitable) {
        noStroke();
        colorMode(RGB);
        rectMode(CENTER)
        fill(255, 200, 0, habit.security*50)
        rect(habit.x, habit.y, res, res);    
        fill(0)
        textAlign(CENTER,CENTER)
        textSize(8)
        text(round(habit.security), habit.x, habit.y)
      }
    }
      
  function merchantValue(){
      for (let habit of habitable){
        habit.merchantValue = habit.security * habit.trafficValue
      }
    }
    
    function newcomerValue(){
      for (let habit of habitable){
        habit.merchantValue = habit.security * habit.trafficValue
      }
    }
    
    function merchantValueShow(){
      for (let habit of habitable){
        habit.merchantValue = habit.security * habit.trafficValue
      }
    }
    
      // TODO: minimal buffer distance between huts, security cast from castle and huts
    // TODO: extents Hut class, community
    // TODO: 
    
    
    //value system
    // Lord : defense(from terrain); may consider traffic
    // Farmer : security, farm value
    // merchant : security, traffic
    
    function autoPopulate(){
      lord()
      for (let i = 0; i<steps; i++){
        let dice =random(1)
        if (dice < 0.4) {merchantPopulate()}
        else{farmerPopulate()
          
        }
     
        
      }
    }
    
    function lord() {
      let newCastle = new Lord();
      huts.push(newCastle);
      nr++;
      newCastle.makeBuffer();
      farmValue();
    }

    function tradeRoute() {
      start = random(mapEdge);
      // rectMode(CENTER);
      // colorMode(RGB);
      // fill(255, 255, 0);
      // rect(start.x, start.y, res, res);
      
      end = random(mapEdge);
  
    
      while (
        abs(end.i + end.j - start.i - start.j) < rows ||
        end.i == start.i ||
        end.j == start.j
      ) {
        end = random(mapEdge);
        if (
          abs(end.i + end.j - start.i - start.j) >= rows &&
          end.i != start.i &&
          end.j != start.j
        ) {
          break;
        }
      }
      const MarkBoxGeometry = new THREE.BoxGeometry(res, res, res);
      const MarkBoxMaterial = new THREE.MeshStandardMaterial(0xffffff);
      const startMarkBox = new THREE.Mesh(MarkBoxGeometry, MarkBoxMaterial);
      const endMarkBox = new THREE.Mesh(MarkBoxGeometry, MarkBoxMaterial);
      startMarkBox.position.set(start.x, start.altitude, start.z)
      endMarkBox.position.set(end.x, end.altitude, end.z);
      scene.add(startMarkBox, endMarkBox);


      console.log(start, end);
      // console.log(startMarkBox);
      // colorMode(RGB);
      // fill(255, 200, 0);
      // rect(end.x, end.y, res, res);
      // pathFinding(start, end, interRegionalTrafficWeight);
    }