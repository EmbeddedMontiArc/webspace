import * as math from "./math/math.js";

export {ControllerMock};

class ControllerMock{

    public static steering(sensors){

        let threshold = 0.1;
        let thresholdN = -0.1;

        let fl = sensors[0]; //frontleft
        let fr = sensors[1]; //frontright
        let slf = sensors[2]; //sideleftfront
        let slb = sensors[3]; //sideleftback
        let srf = sensors[4]; //siderightfront
        let srb = sensors[5]; //siderightback

        let comp1 = ( ((fl-fr) > threshold) && ((slf-slb) > threshold) ) && ((srb-srf) > threshold);
        let comp2 = ( ((fl-fr) < thresholdN) && ((slf-slb) < thresholdN) ) && ((srb-srf) < thresholdN);
        let comp3 = (slf<slb) && (srf<srb);

        let resComp3;

        if (comp3) {

            resComp3 = math.unit('-1 deg');
        }
        else {

            resComp3 = math.unit('0 deg');
        }
        
        let resComp2;
        
        if (comp2) {

            resComp2 = math.unit('5 deg');
        }
        else {

            resComp2 = resComp3;
        }

        let steering;

        if (comp1) {

            steering = math.unit('-5 deg');
        }
        else {

            steering = resComp2;
        }

        return steering;
    }

    public static acceleration(time){

        let cond = time < math.unit('1 s');
        let acceleration;

    	if (cond) {

    	    acceleration = math.unit('0 m/s^2');
    	}
    	else{

    	    acceleration = math.unit('1 m/s^2');
        }
        
        return acceleration;
    }

    public static gameOverTrigger(x,y,time): boolean{

            // The boundaries of the 3D world
            let aboveBnd = x > 200;
            let belowBnd = x < -200;
            let rightBnd = y > 120;
            let leftBnd = y < -50;

            let xloc = x < 1 && x > -1;
            let yloc = y < 15 && y > -15;
            let tloc = time.value > 3;

            let finishCircle : boolean = xloc && yloc && tloc;            
  
        return aboveBnd || belowBnd || rightBnd || leftBnd || finishCircle;
    }

}