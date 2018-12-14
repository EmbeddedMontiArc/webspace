import {Rotation} from "../rwth.visualisation/coord/Rotation";

describe('Check rotation values', () => {

    it('should return diagonal ', () => {
        
        expect(Rotation.getMatrix(0)).toEqual([[1,0],[-0,1]]);
    });
});