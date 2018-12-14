import * as math from "./math/math.js";
export {CoordHelper}; 

class CoordHelper {

    //Intersection between sensor and linear function; p1, p2 points of wall, (s)ensor and (d)irection.
    public static getIntersectionLine(p1: number[], p2: number[], s: number[], d: number[]): number[] {

        let scalar: number = (p1[0]*(p2[1]-p1[1])-p1[1]*(p2[0]-p1[0]) - s[0]*(p2[1]-p1[1])+s[1]*(p2[0]-p1[0])) /
                                    (d[0]*(p2[1]-p1[1])-d[1]*(p2[0]-p1[0]));
        
        let intersection: number[] = math.add(s, math.multiply(d, scalar));

        return intersection; // returns normal array
    }

    //Distance from sensor to intersection : p1, p2 points of wall, (s)ensor and r - direction.
    public static getDistanceLine(p1: number[], p2: number[], s: number[], r: number[]): number {
        
        try {
                let intersection: number[] = CoordHelper.getIntersectionLine(p1, p2, s, r);
                // get distance between two vectors
                let distance = math.distance(intersection, s);

            return distance;
            
        } catch {

            return Number.MAX_VALUE;
        }
    }

    public static getIntersectionCirclePlus(sensor: number[], direction: number[],
                                    middlePoint: number[], radius: number, plus: boolean): number[] {

        let plusValue: number = plus ? 1.0 : -1.0;

        let a: number = direction[0];
        let b: number = direction[1];

        let m: number = middlePoint[0];
        let n: number = middlePoint[1];

        let x: number = sensor[0];
        let y: number = sensor[1];

        let as: number = Math.pow(a,2)+Math.pow(b,2);
        let xm: number = Math.pow(x-m,2)+Math.pow(y-n,2)-Math.pow(radius,2);
        let za: number = Math.pow(2*a*(x-m)+2*b*(y-n), 2);
        let zaq: number = 2*Math.pow(a,2)+2*Math.pow(b,2);
        let sqrtValue: number = -4*as*xm+za;
        
        if(sqrtValue < 0 && sqrtValue >= -0.0001){
            
            sqrtValue = 0;
        }

        let sqrt: number = plusValue*Math.sqrt(sqrtValue);
        let scalar: number = -1*(sqrt +2*a*(x-m)+2*b*(y-n))/zaq;
        
        return math.add(sensor, math.multiply(direction, scalar)); // returns intersection
    }

    public static getIntersectionCircle(s: number[], d: number[], m: number[], radius: number): Array<number[]> {
        
        let result = new Array<number[]>();

        let pointLower = CoordHelper.getIntersectionCirclePlus(s, d, m, radius, false);
        let pointUpper = CoordHelper.getIntersectionCirclePlus(s, d, m, radius, true);

        result.push(pointUpper);
        result.push(pointLower);

        return result;
    }

    public static getDistanceCircle(s : number[], d: number[], m: number[], radius: number, plus: boolean): number {
        
        try {
                // check the types
                let intersection: number[] = CoordHelper.getIntersectionCirclePlus(s, d, m, radius, plus);
                // distance between two vectors
                let distance = math.distance(math.matrix(intersection), math.matrix(s));

            return distance;
        
        } catch {

            return Number.MAX_VALUE;
        }
    }

}