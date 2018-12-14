import {Wall} from "./Wall";
import {WallCurved} from "./WallCurved";
import {WallLinear} from "./WallLinear";

export {Track}

class Track {
    
    public walls = new Array<Wall>();

    public constructor() {
    
        this.walls.push(new WallLinear([58, -9.5], [-122, -9.5]));
        this.walls.push(new WallLinear([58, 10], [-122, 10])); // Along this line cars are located
        this.walls.push(new WallLinear([109, -36], [58, -9.5]));
        this.walls.push(new WallLinear([114, -18], [58, 10]));
        this.walls.push(new WallCurved([123, 22], 60, [184, 22], [109, -36]));
        this.walls.push(new WallCurved([123, 22], 41, [164, 22], [114, -18]));
        this.walls.push(new WallCurved([123, 22], 60, [137.6, 79], [184, 22]));
        this.walls.push(new WallCurved([123, 22], 41, [133, 60.6], [164, 22]));
        this.walls.push(new WallLinear([137.6, 79], [108, 83.5]));
        this.walls.push(new WallLinear([133, 60.6], [98.5, 65.8]));
        this.walls.push(new WallLinear([108, 83.5], [59, 110]));
        this.walls.push(new WallLinear([98.5, 65.8], [58, 90]));
        this.walls.push(new WallLinear([59, 110], [-121, 110]));
        this.walls.push(new WallLinear([58, 90], [-122, 90.8]));
        this.walls.push(new WallCurved([-123, 51.3], 61, [-121, 110], [-183, 51.3]));
        this.walls.push(new WallCurved([-123, 51.3], 41, [-123, 90.8], [-164, 51.3]));
        this.walls.push(new WallCurved([-123, 51.3], 61, [-183, 51.3], [-122, -9.5]));
        this.walls.push(new WallCurved([-123, 51.3], 41, [-164, 51.3], [-122, 10]));
    }

    public addRectangularObject(centralPoint:number[], width:number, hight:number): number{

        let startObjectPosition : number = this.walls.length + 1;

        let point1:number[] = [(centralPoint[1]+hight/2),(centralPoint[0]-width/2)];
        let point2:number[] = [(centralPoint[1]-hight/2),(centralPoint[0]-width/2)];
        let point3:number[] = [(centralPoint[1]+hight/2),(centralPoint[0]+width/2)];
        let point4:number[] = [(centralPoint[1]-hight/2),(centralPoint[0]+width/2)];

        this.walls.push(new WallLinear(point1, point2));
        this.walls.push(new WallLinear(point2, point4));
        this.walls.push(new WallLinear(point4, point3));
        this.walls.push(new WallLinear(point3, point1));

        console.log("Added the object:",point1,point2,point3,point4);

        return startObjectPosition;
    }

    public relocateRectangularObject(positionInArry: number, centralPoint:number[], width:number, hight:number){

        let point1:number[] = [(centralPoint[1]+hight/2),(centralPoint[0]-width/2)];
        let point2:number[] = [(centralPoint[1]-hight/2),(centralPoint[0]-width/2)];
        let point3:number[] = [(centralPoint[1]+hight/2),(centralPoint[0]+width/2)];
        let point4:number[] = [(centralPoint[1]-hight/2),(centralPoint[0]+width/2)];

        this.walls[positionInArry] = new WallLinear(point1, point2);
        this.walls[positionInArry+1] = new WallLinear(point2, point4);
        this.walls[positionInArry+2] = new WallLinear(point4, point3);
        this.walls[positionInArry+3] = new WallLinear(point3, point1);
    }
}