export const Parameters =
{
    cols: 50,
    rows: 40,
    res: 15,
    seed: 8,
    noiseScale: 0.2,

    camX: 1000,
    camY: 100,
    camZ: 100,
        
    farmRange: 10, // range a farm can be used by farmer
    farmerRange : 10, //??
    weightFactor : 0.5, //for voronoi claiming, not used
    waterLevel : 0, //altitude
    farmMin : 0, // altitude of farm
    farmMax : 30, // altitude max of farm
    highlandLevel : 50, // altitude
    waterAccessDist: 7,

    //pathfinding factors
    landWaterChangeModeCost : 100, // high mode change cost
    heuristicValueFactor : 0.1, //** can modify, sensative to pathfinding
    waterAttrition : 0.5, //
    waterMoveCost : 1, //alternative water move calculation
    landAttrition :1,
    downhillFactor : 0.3,
    flatTerrainCost : 2,
    interRegionalTrafficWeight : 3, //traffic weights settings:

    //Voronoi Claim
    claimRange : 20, //for voronoi claiming, not used
    minBuffer: 5,
}

const cols = Parameters.cols;
const rows = Parameters.rows;
const res = Parameters.res;
const seed = Parameters.seed;

