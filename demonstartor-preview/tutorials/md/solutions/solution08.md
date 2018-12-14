# Solution(08)

### Enhance the previously created parking controller.

To solve that tutorial we have to use the MainController, like we did in the other tutorials. We may reuse the previously created modules from the tutorial03: 

```
package controller08;

import VelocityController;
import SearchParkingPlaceController;
import ParkingController;
import MeasureGapController;

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
    connect velocityController.acceleration->acceleration;

    instance MeasureGapController<12m> measureGapController;
    connect velocity -> measureGapController.velocity;
    connect time -> measureGapController.time;
    connect measureGapController.passed -> searchParkingPlaceController.enoughSpace;

    instance SearchParkingPlaceController searchParkingPlaceController;
    connect frontLeftSideSensor->searchParkingPlaceController.frontLeftSideSensor;
    connect backLeftSideSensor->searchParkingPlaceController.backLeftSideSensor;
    connect searchParkingPlaceController.activeMeasure -> measureGapController.active;
    connect searchParkingPlaceController.foundPlace->velocityController.reverseMove;
    connect searchParkingPlaceController.foundPlace->parkingController.reverseMove;
    
    instance ParkingController parkingController;
    connect frontRightSensor->parkingController.frontRightSensor;
    connect frontLeftSensor->parkingController.frontLeftSensor;
    connect backLeftSensor->parkingController.backLeftSensor;
    connect backRightSensor->parkingController.backRightSensor;
    connect frontLeftSideSensor->parkingController.frontLeftSideSensor;
    connect backLeftSideSensor->parkingController.backLeftSideSensor;
    connect parkingController.steeringAngle->steering;
    connect parkingController.status->status;
    connect parkingController.moveForward->velocityController.moveForward;
}
```
Then we may just completely reuse the VelocityController from the tutorial03:
```
package controller08;

component VelocityController {
	port                                    
		in Q(0km/h : 250km/h) velocity,
		in B reverseMove,
		in B moveForward,
		out Q(-2m/s^2:2m/s^2) acceleration; 

	implementation Math{                    

    	if (velocity > 1 m/s)
    	    acceleration = 0m/s^2;
    	else
    		acceleration = 1m/s^2;
        end
        
        if reverseMove
        	acceleration = -0.5 m/s^2;
        end
        
        if (velocity < -0.5 m/s)
        	acceleration = 0m/s^2;
        end
        
        if (reverseMove && moveForward)
            acceleration = 0.5 m/s^2;
        end
        
        if (reverseMove && moveForward && (velocity > 0.5 m/s))
            acceleration = 0m/s^2;
        end
        
	}
}
```
After that we may borrow another module from the tutorial03:
```
package controller08;

component ParkingController {
    port
        in Q(-200m:200m) frontLeftSensor,
        in Q(-200m:200m) frontRightSensor,
        in Q(-200m:200m) frontLeftSideSensor,
        in Q(-200m:200m) backLeftSideSensor,
        in Q(-200m:200m) backLeftSensor,
        in Q(-200m:200m) backRightSensor,
        in B reverseMove,
        out Q steeringAngle,
        out B moveForward,
        out B status;

    implementation Math{
        
        // fix the state of moving direction
        static Q forwardState = 0;
        
        moveForward = 0;
        steeringAngle = 0;
        
        if reverseMove
            steeringAngle = 1;
        end
        
        if (reverseMove && (backLeftSensor < 2))
            steeringAngle = -1;
        end
        
        // Car has to be parallel to the road edge
        // Go forward when the back closer then 3m
        if (reverseMove && ((backRightSensor == backLeftSensor) || ((backRightSensor < 3) && (backLeftSensor < 3))))
            forwardState = 1;
        end
        
        // Stop when the car closer then 3m to front car
        if (((frontRightSensor < 3) || (frontLeftSensor < 3)) && forwardState)
            status = 1;
        else
            status = 0;
        end
        
        // if car moving forward, does not change the car angle
        if forwardState
            steeringAngle = 0;
        end
        
        // align the car
        if (forwardState && (frontLeftSideSensor > backLeftSideSensor))
            steeringAngle = -0.5;
        end
        
        if (forwardState && (frontLeftSideSensor < backLeftSideSensor))
            steeringAngle = 0.5;
        end
        
        moveForward = forwardState;
    }
}
```
Then we may partially reuse the SearchParkingPlaceController from the tutorial03. But it is not sufficient to use the previous functionality of the controller, we have to improve it adding the possibility to measure the parking lot.

```
package controller08;

component SearchParkingPlaceController {
    port
        in Q(-200m:200m) frontLeftSideSensor,
        in Q(-200m:200m) backLeftSideSensor,
        in B enoughSpace,
        out B activeMeasure,
        out B foundPlace;

    implementation Math{
        
        static Q passed0 = 0;
        static Q passed1 = 0;
        static Q passed2 = 0;
        static Q passed3 = 0;
        
        static Q found = 0;
        static B measuresActive = 0;

        if ((frontLeftSideSensor - backLeftSideSensor) < -3)
            passed0 = 1;
        end

        if (((backLeftSideSensor - frontLeftSideSensor) < -3) && passed0)
            passed1 = 1;
            measuresActive = 1;     // start measuring process
        end
        
        if (((frontLeftSideSensor - backLeftSideSensor) < -3) && passed1)
            passed2 = 1;
            measuresActive = 0;     // stop measuring process
        end
        
        if (((frontLeftSideSensor - backLeftSideSensor) > 3) && passed2)
            passed3 = 1;
        end
        
        if enoughSpace
            found = 1;
        end
        
        if (found && passed3)
            foundPlace = 1;
        else
            foundPlace = 0;
        end
        
        if (passed3 && (found < 1)) // reset the counters for passing cars
            passed0 = 0;
            passed1 = 0;
            passed2 = 0;
            passed3 = 0;
        end
        
        activeMeasure = measuresActive;
    }
}
```
The first part of the controller hasn't been changed, we calculate the difference in measurements between front side sensor and back side sensor to find the gap between cars. Now we should refine it adding the measurement of the space, where it has enough room for the car or not. For this purposes we will use other controller:

```
package controller08;

component MeasureGapController<Q length = 10m> {
    port
        in Q(0km/h:250km/h) velocity,
        in Q time,
        in B active,
        out B passed;

    implementation Math{

        static Q dist = 0;
        static Q timeLoc = 0;
        
        if active
            dist += (time - timeLoc) * velocity;
            if (dist >= length)
                passed = 1;
            else
                passed = 0;
            end
        else
            dist = 0;
        end

        timeLoc = time;
    }
}
```

This controller measures the distance on the track, between the points of time when it was activated and deactivated. The SearchParkingPlaceController activates it when the front side sensor passed the a first car and it starts to count. When the sensor reached a second car, the MeasureGapController is deactivated by the SearchParkingPlaceController and it stops count the distance. If the distance is satisfy the conditions, and the car has passed the front part of the second car, the parking process starts. If not, then we reset the counters and searching process continue.  
The calculation of a distance in the MeasureGapController is done using time and velocity data. We just take an increment of time and multiply it by current velocity. The sufficient parking lot size is defined in the MainController, during the instantiation of the MeasureGapController.