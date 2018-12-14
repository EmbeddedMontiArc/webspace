//import de.CoordHelper;
import {Rotation} from "../coord/Rotation";
import {Track} from "../track/Track";
import {Wall} from "../track/Wall";
import {WallCurved} from "../track/WallCurved";
import {WallLinear} from "../track/WallLinear";
import {CoordHelper} from "../CoordHelper";
import {Car} from "./Car";
import * as math from "../math/math.js";

export {Sensor}

class Sensor {

    private offset : number[];
    private direction : number[];

    public constructor (offset : number[], direction : number[]) {
        
        this.offset = offset;
        this.direction = direction;
    }

    public getDirection(car: Car): number[] {
        
        let rotationMatrix : number[][] = Rotation.getMatrix(car.getDegree());
        
        return math.multiply(rotationMatrix, this.direction);
    }

    public getPosition(car: Car): number[] {

        let rotationMatrix : number[][] = Rotation.getMatrix(car.getDegree());
        let position : number[] = car.getPosition();
        
        let offset : number[] = math.subtract(math.add(position, this.offset),position);
        let rotatedOffset: number[] = math.multiply(rotationMatrix, offset);
        
        return math.add(rotatedOffset, position); // returns normal array
    }

    public getIntersections(wall: Wall, car: Car): Array<number[]>;
    public getIntersections(wall: WallLinear, car: Car): Array<number[]>;
    public getIntersections(wall: WallCurved, car: Car): Array<number[]>;
    public getIntersections(wall: any, car: Car): Array<number[]>{
        
        if (wall instanceof WallLinear){

            let result = new Array<number[]>();
            
            try {
                    let position : number[] = this.getPosition(car);
                    let direction : number[] = this.getDirection(car);

                    let intersection : number[] = CoordHelper.getIntersectionLine(
                        wall.pointLeft, wall.pointRight, position, direction);
            
                    if(wall.inBoundaries(intersection)) {
            
                        result.push(intersection);
                    }
            
                    return result;
                }

            catch { 
                    // need to add some log here
                    return [[0,0],[0,0]];
                }
        }
        else if (wall instanceof WallCurved){

            let result = new Array<number[]>();
            
            try {
                    let position : number[] = this.getPosition(car);
                    let direction : number[] = this.getDirection(car);
                    
                    let intersections : Array<number[]> = CoordHelper.getIntersectionCircle(
                        position, direction, wall.pointMiddle, wall.radius);
            
                    for( let intersection of intersections) {
                            
                        if(wall.inBoundaries(intersection)) {
                                
                            result.push(intersection);
                        }
                    }
                       
                    return result;
                } 
                
            catch {
                    // need to add some log here
                    return [[0,0],[0,0]];
                }
        }   
    }

    // get the parameter of the line of the sensor to intersection point
    // if the parameter is positive than the intersection point is in correct direction
    public getParameters(wall : Wall, car: Car): Array<number> {
        
        let parameters = new Array<number>();
        let intersections : Array<number[]> = this.getIntersections(wall, car);

        for(let intersection of intersections) {

            let position : number[] = this.getPosition(car);
            let direction : number[] = this.getDirection(car);

            // Add a constant 
            let scalar : number = (direction[0] < 0.0001 && direction[0]>-0.0001) ?
                    (intersection[1] - position[1]) / direction[1] :
                    (intersection[0] - position[0]) / direction[0];

            parameters.push(scalar);
        }

        return parameters;
    }

    public getDistances(wall : Wall, car: Car): Array<number> {

        let distances = new Array<number>();
        let intersections : Array<number[]> = this.getIntersections(wall, car);

        for(let intersection of intersections) {
            // distance between vectors calculate
            let distance : number = math.distance(this.getPosition(car), intersection);

            distances.push(distance);
        }

        return distances;
    }

    public getAllDistances(walls: Array<Wall>, car: Car): Array<number> {
        
        let allDistances = new Array<number>();
        let wallIndex : number = 0;

        for(let wall of walls) {
            
            wallIndex++;

            let parameters : Array<number> = this.getParameters(wall, car);
            let distances : Array<number> = this.getDistances(wall, car);

            for(let i : number = 0; i < parameters.length; i++) {
                
                let parameter : number = parameters[i];

                if(parameter >= 0) {
                    
                    let distance : number = distances[i];
                    allDistances.push(distance);
                }
            }
        }

        return allDistances;
    }

    // Gets the correct distance of the sensor to the track
    public getMinDistance(walls: Array<Wall>, car: Car) : number {

        let distances : number[] = this.getAllDistances(walls, car);
        let minDistance : number = Number.MAX_VALUE;

        for(let distance of distances) {

            minDistance = Math.min(minDistance, distance);
        }

        return minDistance;
    }
}