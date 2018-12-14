import {CoordHelper} from '../rwth.visualisation/CoordHelper';
import * as math from "../rwth.visualisation/math/math.js";

describe('test CoordHelper\' functions', () => {

    it('should return an intersection point with line', () => {
        
        expect(CoordHelper.getIntersectionLine(
            [-50, -20], // point 1 of the wall
            [50, -20], // point 2 of the wall
            [0,0], // the sensor position
            [0,1])) // direction of the sensor
            .toEqual([0,-20]);
    });

    it('test getIntersectionCirclePlus()', () => {
        
        expect(CoordHelper.getIntersectionCirclePlus(
            [0,0], // the sensor position [4.15, 1.85]
            [1,0], // direction of the sensor FRONT_LEFT 
            [123, 22], // Middle point
            60, // radius
            true // 1 or -1
            )) 
            .toEqual([67.17885705218855, 0]);
    });

    it('test getIntersectionCircle()', () => {
        
        expect(CoordHelper.getIntersectionCircle(
            [0,0], // the sensor position [4.15, 1.85]
            [1,0], // direction of the sensor FRONT_LEFT 
            [123, 22], // Middle point
            60, // radius
            )) 
            .toEqual([[67.17885705218855, 0], [178.82114294781144, 0]]);
    });

    it('test getDistanceLine()', () => {
        
        expect(CoordHelper.getDistanceLine(
            [-50, -20], // point 1 of the wall
            [50, -20], // point 2 of the wall
            [0,0], // the sensor position
            [0,1], // direction of the sensor FRONT_LEFT_SIDE 
            )) 
            .toEqual(20);
    });

    it('test getDistanceCircle()', () => {
        
        expect(CoordHelper.getDistanceCircle(
            [0,0], // the sensor position [4.15, 1.85]
            [1,0], // direction of the sensor FRONT_LEFT 
            [123, 22], // Middle point
            60, // radius
            true
            )) 
            .toEqual(67.17885705218855);
    });

});
