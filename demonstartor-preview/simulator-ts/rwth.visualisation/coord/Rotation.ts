export {Rotation};
import * as math from "../math/math.js";

class Rotation {

    public static getMatrix(degree : number): number[][] {
        
        let rotationMatrix: number[][]  =   [[math.cos(degree), math.sin(degree)],
                                             [-math.sin(degree), math.cos(degree)]];
        return rotationMatrix;
    }
}