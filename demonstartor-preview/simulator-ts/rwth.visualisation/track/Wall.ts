export {Wall};

abstract class Wall {

    public inBoundaries(pointLeft: number[], point: number[], pointRight: number[]): boolean {

        let xMin = Math.min(pointLeft[1], pointRight[1]) - 2.1;
        let xMax = Math.max(pointLeft[1], pointRight[1]) + 2.1;

        let yMin = Math.min(pointLeft[0], pointRight[0]) - 2.1;
        let yMax = Math.max(pointLeft[0], pointRight[0]) + 2.1;

        let inHeight : boolean = yMin <= point[0] && point[0] <= yMax;
        let inWidth : boolean = xMin <= point[1] && point[1] <= xMax;

        return inHeight && inWidth;
    }
}