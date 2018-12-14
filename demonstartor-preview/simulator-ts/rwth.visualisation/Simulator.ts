import * as math from "./math/math.js";
import {Car} from "./car/Car";
import {Orientation} from "./coord/Orientation";
import {Sinput} from "./Sinput"
import {Soutput} from "./Soutput"
import {Track} from "./track/Track";
import {ControllerMock} from "./ControllerMock";

export {Simulator}

class Simulator {


    // fps = 1/s -> samplingTime is 1/fps
    public samplingTime;
    private velocity;
    private time;
    private car: Car;
    private track: Track;
    public output: Soutput; //stores the output data(new positions, degree, velocity etc.)
    private input: Sinput;
    private objectsPosition: number[];

    //private listeners: Array<Function>;

    public constructor() {

        this.objectsPosition = [];

        // Initial velocity is 0 m/s, Initial time is 0 s
        this.velocity = math.unit('0 m/s'); // v - m/s
        this.time = math.unit('0 sec'); // t
        this.samplingTime = math.unit('0.3 sec');
        
        this.car = new Car(0,0);
        this.track = new Track();

        this.output = new Soutput(
            math.unit('0 m/s'),
            math.unit('0 m'),
            math.unit('0 m'),
            math.unit('0 s'),
            math.unit('0 deg'),
            false,
            false,
            false,
            false
        );

        this.input = new Sinput(
            math.unit('0 m/s^2'), // acceleration
            math.unit('0 deg'),  // steering
            math.unit('0 m'), // x
            math.unit('0 m'), // y
            math.unit('0 s'), // time
            false, // doorStatus
            false, //indicatorStatus
            false, //lightStatus
            false //triggerStatus
        );

        this.calculate();
    }

    public resetSimulation(){

        this.output.velocity = math.unit('0 m/s');
        this.output.xi = math.unit('0 m');
        this.output.yi = math.unit('0 m');
        this.output.ti = math.unit('0 s');
        this.output.degree = math.unit('0 deg');
        this.output.triggerStatus = false;

        // this.input.acceleration = math.unit('0 m/s^2');
        // this.input.steering = math.unit('0 deg');
        // this.input.x0 = math.unit('0 m');
        // this.input.y0 = math.unit('0 m');
        // this.input.t0 = math.unit('0 s');
        // this.input.triggerStatus = false;

        this.time = math.unit('0 s');
        this.velocity = math.unit('0 m/s');

        this.car.setPosition([0,0]);
        this.car.setDegree(math.unit('0 deg'));

        console.log("Simulator is reseted");
    }

    public addObjectOnTrack(centralPoint:number[], width:number, hight:number){

        let numberInArray = this.track.addRectangularObject(centralPoint, width, hight);
        this.objectsPosition.push(numberInArray);
        console.log(numberInArray);
    }

    public changeObjectPosition(objectInArray: number, position: number[], width: number, hight: number){

        this.track.relocateRectangularObject(this.objectsPosition[objectInArray], position, width, hight);
        console.log(this.objectsPosition[objectInArray]);
    }

    // public addSimListener(simListener: Function) {
    //     this.listeners.push(simListener);
    // }

    // private onSimFrameFinished() {
    //     this.listeners.forEach(sl => {
    //         sl.apply(this, [this.car, this.track]);
    //     });
    // }

    // Updates the time, velocity, degree of car and new positions x,y
    public calculate() {
        
        // time = t+(1/20)s, for t=0s
        this.time = math.add(this.time, this.samplingTime);
        
        // velocity = v+(input)acceleration*(1/20)s, for v=0 m/ss
        this.velocity = math.add(this.velocity, math.multiply(this.input.acceleration, this.samplingTime));
        
        // calculation of car rotation
        let degree = this.normalizeDegrees(math.add(this.car.getDegree(), this.input.steering)); // adjust steering angle

        // x=(input)x+v*t*cos(degree)
        let x = math.add(this.input.x0, math.multiply(this.velocity, math.multiply(this.samplingTime, math.cos(degree))));

        // y=(input)y+v*t*sin(degree)
        let y = math.subtract(this.input.y0, math.multiply(this.velocity, math.multiply(this.samplingTime, math.sin(degree))));

        this.output.velocity = this.velocity;
        this.output.xi = x;
        this.output.yi = y;
        this.output.ti = this.time;
        this.output.degree = degree;
        this.output.doorStatus = this.input.doorStatus;
        this.output.indicatorStatus = this.input.indicatorStatus;
        this.output.lightTimerStatus = this.input.lightTimerStatus;
        //this.output.triggerStatus = this.input.triggerStatus;
    }

    // send current output struct to the controller
    public getDistances(){

        let distances: number[] = this.car.getDistancesFromSensors(this.track);
        return distances;
    }

    public initPosition(x,y){
        
        this.output.xi = math.unit(x,'m');
        this.output.yi = math.unit(y,'m');;
    }

    // send the updated position and the degree to the visualization
    public run(status, steering, acceleration) {

        // Give the updated t and v to the Generator/BasicSimulator and next loop

        this.output.triggerStatus = status;
        //this.output.triggerStatus = ControllerMock.gameOverTrigger(this.output.xi.value, this.output.yi.value,this.time);
        this.car.setPosition([this.output.xi.value, this.output.yi.value]);
        this.car.setDegree(this.output.degree);
        //let distances1: number[] = this.car.getDistancesFromSensors(this.track);
        //let steering_controller1 = ControllerMock.steering(distances1); // steering angle
        //let acceleration_controller1 = ControllerMock.acceleration(this.time); // constant velocity
        
        this.input.acceleration = math.unit(acceleration,"m/s^2"); //acceleration
        this.input.steering = math.unit(steering,'deg'); // steering, DEGREE_ANGLE
        this.input.x0 = this.output.xi;
        this.input.y0 = this.output.yi;
        this.input.t0 = this.output.ti;
        this.input.doorStatus = false; //doorStatus
        this.input.indicatorStatus = false; //indicatorStatus
        this.input.lightTimerStatus = false; //lightStatus
        this.calculate();
        // this.onSimFrameFinished();

        return this.output.triggerStatus;
    }

    public normalizeDegrees(degree){

        if(Math.abs(degree.value * 180 / Math.PI) > 360){
            return math.unit((degree.value % 360),'deg');
        } else return degree;
    }
}
