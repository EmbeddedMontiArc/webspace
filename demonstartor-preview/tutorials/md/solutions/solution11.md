# Solution (11)

### Run full circle

To solve the tutorial we should begin with a MainController which has an interface and connections between modules:

```
package controller11;

import VelocityController;
import PassObjectsController;
import ActiveController;
import SearchParkingPlaceController;
import ParkingController;
import RunTrackController;
import RunTrackVelocityController;
import SteeringAlignController;
import FollowController;
import FollowVelocityController;
import PassCarController;
import OvertakeController;
import OvertakeVelocityController;
import ObstacleController;
import ObstacleVelocityController;
import VelocitySwitchController;
import SteeringSwitchController;

component MainController{
    ports 
        in Q(-200m:200m) frontLeftSensor,
        in Q(-200m:200m) frontRightSensor,
        in Q(-200m:200m) frontLeftSideSensor,
        in Q(-200m:200m) frontRightSideSensor,
        in Q(-200m:200m) backLeftSideSensor,
        in Q(-200m:200m) backRightSideSensor,
        in Q(-200m:200m) backLeftSensor,
        in Q(-200m:200m) backRightSensor,

        in Q time,
        in Q(0km/h:250km/h) velocity,

        in Q(-200m:200m) xPosition,
        in Q(-200m:200m) yPosition,

        out Q(-2m/s^2:2m/s^2) acceleration,
        out Q(-180:180) steering,
        out B status;


    instance VelocityController velocityController;
    connect velocity->velocityController.velocity;
    connect velocityController.acceleration->velocitySwitch.accelerationLast;

    instance SearchParkingPlaceController searchParkingPlaceController;
    connect frontLeftSideSensor -> searchParkingPlaceController.frontLeftSideSensor;
    connect backLeftSideSensor -> searchParkingPlaceController.backLeftSideSensor;
    connect searchParkingPlaceController.foundPlace -> velocityController.reverseMove;
    connect searchParkingPlaceController.foundPlace -> parkingController.reverseMove;

    
    instance ActiveController activeController;
    connect xPosition -> activeController.xPosition;
    connect yPosition -> activeController.yPosition;
    
    connect activeController.activeSearchParkingPlace -> searchParkingPlaceController.active;
    connect activeController.activeSearchParkingPlace -> velocitySwitch.activeParking;
    connect activeController.activeSearchParkingPlace -> steeringSwitch.activeParking;
    
    connect activeController.activePassObject -> passObjectsController.active;
    connect activeController.activePassObject -> velocitySwitch.activePassObject;
    connect activeController.activePassObject -> steeringSwitch.activePassObject;
    
    connect activeController.activeTrack -> velocitySwitch.activeRunTrack;
    connect activeController.activeTrack -> steeringSwitch.activeTrack;

    connect activeController.activeAlign -> velocitySwitch.activeAlign;
    connect activeController.activeAlign -> steeringSwitch.activeAlign;

    connect activeController.followCar -> velocitySwitch.activeFollow;
    connect activeController.followCar -> steeringSwitch.activeFollow;

    connect activeController.overtakeCar -> overtake.active;
    connect activeController.overtakeCar -> steeringSwitch.activeOvertake;

    connect activeController.obstacleWait -> velocitySwitch.activeObstacle;
    connect activeController.obstacleWait -> steeringSwitch.activeObstacle;


    instance ParkingController parkingController;
    connect frontLeftSensor -> parkingController.frontLeftSensor;
    connect frontRightSensor -> parkingController.frontRightSensor;
    connect frontLeftSideSensor -> parkingController.frontLeftSideSensor;
    connect backLeftSideSensor -> parkingController.backLeftSideSensor;
    connect backLeftSensor -> parkingController.backLeftSensor;
    connect backRightSensor -> parkingController.backRightSensor;
    connect parkingController.status -> status;
    connect parkingController.moveForward -> velocityController.moveForward;
    connect parkingController.steeringAngle -> steeringSwitch.steeringParking;
    
    instance PassObjectsController passObjectsController;
    connect frontLeftSensor -> passObjectsController.frontLeftSensor;
    connect frontRightSensor -> passObjectsController.frontRightSensor;
    connect frontLeftSideSensor -> passObjectsController.frontLeftSideSensor;
    connect frontRightSideSensor -> passObjectsController.frontRightSideSensor;
    connect backLeftSideSensor ->passObjectsController.backLeftSideSensor;
    connect backRightSideSensor -> passObjectsController.backRightSideSensor;
    connect passObjectsController.steering -> steeringSwitch.steeringPassObjects;

    instance RunTrackController runTrackController;
    connect frontLeftSensor -> runTrackController.frontLeft;
    connect frontRightSensor ->  runTrackController.frontRight;
    connect frontLeftSideSensor -> runTrackController.frontLeftSide;
    connect frontRightSideSensor -> runTrackController.frontRightSide;
    connect backLeftSideSensor -> runTrackController.backLeftSide;
    connect backRightSideSensor -> runTrackController.backRightSide;
    connect runTrackController.steering -> steeringSwitch.steeringTrack;

    instance RunTrackVelocityController runTrackVelocity;
    connect velocity -> runTrackVelocity.velocity;
    connect runTrackVelocity.acceleration -> velocitySwitch.accelerationRunTrack;

    instance SteeringAlignController steeringAlign;
    connect frontLeftSideSensor -> steeringAlign.frontLeftSide;
    connect frontRightSideSensor -> steeringAlign.frontRightSide;
    connect backLeftSideSensor -> steeringAlign.backLeftSide;
    connect backRightSideSensor -> steeringAlign.backRightSide;
    connect steeringAlign.steering -> steeringSwitch.steeringAlign;

    instance FollowController<15m> follow;
    connect frontLeftSensor -> follow.frontLeftSensor;
    connect frontRightSensor -> follow.frontRightSensor;
    connect follow.follow -> followVelocity.follow;
    connect follow.run -> followVelocity.run;

    instance FollowVelocityController<2m/s> followVelocity;
    connect velocity -> followVelocity.velocity;
    connect followVelocity.acceleration -> velocitySwitch.accFollow;

    instance PassCarController passCar;
    connect frontRightSideSensor -> passCar.frontRightSideSensor;
    connect backRightSideSensor -> passCar.backRightSideSensor;
    connect passCar.done -> overtake.passed;

    instance OvertakeController<50m> overtake;
    connect frontLeftSensor -> overtake.frontLeftSensor;
    connect frontRightSensor -> overtake.frontRightSensor;
    connect frontRightSideSensor -> overtake.frontRightSideSensor;
    connect frontLeftSideSensor -> overtake.frontLeftSideSensor;
    connect backLeftSideSensor -> overtake.backLeftSideSensor;
    connect backRightSideSensor -> overtake.backRightSideSensor;
    connect overtake.steering -> steeringSwitch.steeringOvertake;
    connect overtake.activatePassChecker -> passCar.active;
    connect overtake.activatePassChecker -> velocitySwitch.activeOvertake;

    instance OvertakeVelocityController overtakeVelocity;
    connect velocity -> overtakeVelocity.velocity;
    connect overtakeVelocity.acceleration -> velocitySwitch.accOvertake;

    instance ObstacleController<30m> obstacle;
    connect frontLeftSensor -> obstacle.frontLeftSensor;
    connect frontRightSensor -> obstacle.frontRightSensor;
    connect obstacle.brake -> obstacleVelocity.brake;

    instance ObstacleVelocityController<5m/s> obstacleVelocity;
    connect velocity -> obstacleVelocity.velocity;
    connect obstacleVelocity.acceleration -> velocitySwitch.accObstacle;

    instance SteeringSwitchController steeringSwitch;
    connect steeringSwitch.steering -> steering;

    instance VelocitySwitchController velocitySwitch;
    connect velocitySwitch.acceleration -> acceleration; 
}
```
It has lots of connection and components. But in general we reuse all the controllers from the previous tutorials, due to this fact, the hardest part will be to adjust controllers to combine them together. Let us start with the most important and almost written form the scratch controller, which defines zones where corresponding controller will be activated:

```
package controller11;

component ActiveController {
	port                                    
		in Q xPosition,
        in Q yPosition,
		out B activePassObject,
        out B activeSearchParkingPlace,
        out B activeTrack,
        out B followCar,
        out B overtakeCar,
        out B obstacleWait,
        out B activeAlign;

	implementation Math{

        activeTrack = 0;
        activePassObject = 0;
        activeSearchParkingPlace = 0;
        activeAlign = 0;
        followCar = 0;
        overtakeCar = 0;
        obstacleWait = 0;
  	
        // default controller
        activeTrack = 1;

        if ((xPosition < 15) && (xPosition > -130) && (yPosition > -8) && (yPosition < 8))
            activePassObject = 1;
            activeTrack = 0;
        end
        
        if ((xPosition >= 15) && (xPosition < 50) && (yPosition > -8) && (yPosition < 8))
           activeSearchParkingPlace = 1;
           activeTrack = 0;
        end

        if ((xPosition >= 45 ) && (xPosition < 60) && (yPosition > 90) && (yPosition < 110))
           activeAlign = 1;
           activeTrack = 0;
        end

        if ((xPosition < 45 ) && (xPosition > 20 ) && (yPosition > 90) && (yPosition < 110))
           followCar = 1;
           activeTrack = 0;
        end

        if ((xPosition < 20) && (xPosition > -100) && (yPosition > 90) && (yPosition < 110))
           overtakeCar = 1;
           activeTrack = 0;
        end

        if ((xPosition < -90) && (xPosition > -130) && (yPosition > 90) && (yPosition < 110))
           obstacleWait = 1;
           activeTrack = 0;
        end
	}
}
```
The activeTrack controller is active by default. The car can drive through the whole track using this controller, but we use it here to pass the curved areas of the track. Then you can see other activators for controllers. The activators fire when the car is located in given area. Then continue with the controller which is default one and was implemented in previous tutorials:

```
package controller11;

component RunTrackController {
    port
        in Q(-200m:200m) frontLeft,
        in Q(-200m:200m) frontRight,
        in Q(-200m:200m) frontLeftSide,
        in Q(-200m:200m) frontRightSide,
        in Q(-200m:200m) backLeftSide,
        in Q(-200m:200m) backRightSide,
        out Q(-180:180) steering;

    implementation Math{

        Q(0m:1m) threshold = 0.1m;

        B comp1 = (((frontLeft-frontRight) > threshold) && ((frontLeftSide-backLeftSide) > threshold)) && ((backRightSide-frontRightSide) > threshold);
        B comp2 = (((frontRight-frontLeft) > threshold) && ((backLeftSide-frontLeftSide) > threshold)) && ((frontRightSide-backRightSide) > threshold);
        
        steering = 0;
        
        if (comp2)
            steering = 3;
        end

        if (comp1)
            steering = -3;
        end
    }
}
```
This controller is responsible for the steering only and we have dedicate one for the velocity control:

```
package controller11;

component RunTrackVelocityController {
	port
		in Q(0m/s : 10m/s) velocity,
		out Q(-2m/s^2:2m/s^2) acceleration;

	implementation Math{

    	if (velocity > 5 m/s)
    	    acceleration = 0 m/s^2;
    	else
    	    acceleration = 0.5 m/s^2;
        end
	}
}
```
After running the first curve part of the track we have to continue with the following a car which is waiting to start movement. But firstly we have to adjust the car to the task, because the goal of the previous controller to have a best trajectory and here we have to align car to the track and the car in front:

```
package controller11;

component SteeringAlignController {
    port
        in Q(-200m:200m) frontLeftSide,
        in Q(-200m:200m) frontRightSide,
        in Q(-200m:200m) backLeftSide,
        in Q(-200m:200m) backRightSide,
        out Q(-180:180) steering;

    implementation Math{

        Q(0m:1m) thresholdM = 0.5m;
        Q(0m:1m) thresholdS = 0.1m;

        B comp1 = ((frontLeftSide - backLeftSide) > thresholdM);
        B comp2 = ((frontLeftSide - backLeftSide) < -thresholdM);
        B comp3 = ((frontLeftSide - backLeftSide) > thresholdS);
        B comp4 = ((frontLeftSide - backLeftSide) < -thresholdS);
        
        steering = 0;
        
        if comp3
            steering = -1;
        end
        
        if comp4
            steering = 1;
        end

        if comp1
            steering = -3;
        end
        
        if comp2
            steering = 3;
        end 
    }
}
```
This controllers adjust the car to the track. It influences only in the steering. Later you will see another part of the controller which does braking before starting the car following procedure.