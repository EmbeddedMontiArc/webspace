import {Wall} from "./Wall";

export {WallLinear};

class WallLinear extends Wall {

    public pointLeft  : number[];
    public pointRight : number[];

    public constructor (pointLeft: number[], pointRight: number[]) {
        
        super();
        this.setPointLeft(pointLeft);
        this.setPointRight(pointRight);
    }

    public inBoundaries(point: number[]): boolean {
        
        return super.inBoundaries(this.pointLeft, point, this.pointRight);
    }

    private setPointLeft(point : number[]): WallLinear {
                    
        this.pointLeft = point;
        return this;
    }
        
    private setPointRight(point : number[]): WallLinear {
            
        this.pointRight = point;
        return this;
    }
}