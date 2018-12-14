import {Wall} from "./Wall";

export {WallCurved};

class WallCurved extends Wall {

    public pointMiddle : number[];
    public pointLower : number[];
    public pointUpper : number[];
    public radius : number;

    public constructor (pointMiddle: number[], radius, pointLower: number[], pointUpper: number[]){
        
        super();
        this.setPointMiddle(pointMiddle);
        this.setRadius(radius);
        this.setPointLower(pointLower);
        this.setPointUpper(pointUpper);
    }

    public inBoundaries(point: number[]) {
        return super.inBoundaries(this.pointLower, point, this.pointUpper);
    }
        
    private setPointMiddle(point : number[]): WallCurved {
            
        this.pointMiddle = point;
        return this;
    }
    
    private setPointUpper(point : number[]): WallCurved {
                
        this.pointUpper = point;
        return this;
    }

    private setPointLower(point : number[]): WallCurved {

        this.pointLower = point;
        return this;
    }

    private setRadius(radius : number) {
            
        this.radius = radius;
        return this;
    }
}