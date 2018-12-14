import {Orientation} from "../coord/Orientation";
import {Sensor} from "./Sensor";
import {Track} from "../track/Track";
import * as math from "../math/math.js";

export {Car}

class Car {

    private position: number[];
    private degree;
    private sensors: Array<Sensor>; // Position of the sensor

    public constructor(x: number, y:number) {
        
        this.sensors = new Array<Sensor>();

        this.doInitSensorFrontLeft();
        this.doInitSensorFrontLeftSide();
        this.doInitSensorFrontRight();
        this.doInitSensorFrontRightSide();
        this.doInitSensorBackLeft();
        this.doInitSensorBackLeftSide();
        this.doInitSensorBackRight();
        this.doInitSensorBackRightSide();
        this.position = [x,y];
        this.degree = math.unit('0 deg');
    }

    public setPosition(position: number[]){

        this.position = position;
    }

    public getPosition(): number[] {

        return this.position;
    }

    public setDegree(degree) {
        
        this.degree = degree;
    }

    public getDegree(){
        
        return this.degree;
    }

    public getSensor(orientation: Orientation): Sensor {

        switch(+orientation){
            case Orientation.FRONT_LEFT: return this.sensors[0];
            case Orientation.FRONT_LEFT_SIDE: return this.sensors[1];
            case Orientation.FRONT_RIGHT: return this.sensors[2];
            case Orientation.FRONT_RIGHT_SIDE: return this.sensors[3];
            case Orientation.BACK_LEFT: return this.sensors[4];
            case Orientation.BACK_LEFT_SIDE: return this.sensors[5];
            case Orientation.BACK_RIGHT: return this.sensors[6];
            case Orientation.BACK_RIGHT_SIDE: return this.sensors[7];
        }
    }

    private doInitSensorFrontLeft() {

        let direction: number[] = [1,0];
        let offset: number[] = [4.15, 1.85];

        this.sensors.push(new Sensor(offset, direction));
    }

    private doInitSensorFrontLeftSide() {

        let direction: number[] = [0,1];
        let offset: number[] = [4.15, 1.85];

        this.sensors.push(new Sensor(offset, direction));
    }

    private doInitSensorFrontRight() {

        let direction: number[] = [1,0];
        let offset: number[] = [4.15, -1.85];

        this.sensors.push(new Sensor(offset, direction));
    }

    private doInitSensorFrontRightSide() {
        let direction: number[] = [0,-1];
        let offset: number[] = [4.15, -1.85];

        this.sensors.push(new Sensor(offset, direction));
    }

    private doInitSensorBackLeft() {
        let direction: number[] = [-1,0];
        let offset: number[] = [-4.15, 1.85];

        this.sensors.push(new Sensor(offset, direction));
    }

    private doInitSensorBackLeftSide() {
        let direction: number[] = [0,1];
        let offset: number[] = [-4.15, 1.85];

        this.sensors.push(new Sensor(offset, direction));
    }

    private doInitSensorBackRight() {
        let direction: number[] = [-1,0];
        let offset: number[] = [-4.15, -1.85];

        this.sensors.push(new Sensor(offset, direction));
    }

    private doInitSensorBackRightSide() {
        let direction: number[] = [0,-1];
        let offset: number[] = [-4.15, -1.85];

        this.sensors.push(new Sensor(offset, direction));
    }

    public getDistancesFromSensors(track : Track): number[]{
        
        return [
            /*flDistance*/
                this.getSensor(Orientation.FRONT_LEFT).getMinDistance(track.walls, this),
            /*frDistance*/
                this.getSensor(Orientation.FRONT_RIGHT).getMinDistance(track.walls, this),
            /*slfDistance*/
                this.getSensor(Orientation.FRONT_LEFT_SIDE).getMinDistance(track.walls, this),
            /*slbDistance*/
                this.getSensor(Orientation.BACK_LEFT_SIDE).getMinDistance(track.walls, this),
            /*srfDistance*/
                this.getSensor(Orientation.FRONT_RIGHT_SIDE).getMinDistance(track.walls, this),
            /*srbDistance*/
                this.getSensor(Orientation.BACK_RIGHT_SIDE).getMinDistance(track.walls, this),
            /*blDistance*/
                this.getSensor(Orientation.BACK_LEFT).getMinDistance(track.walls, this),
            /*brbDistance*/
                this.getSensor(Orientation.BACK_RIGHT).getMinDistance(track.walls, this)
            ];
    }
}