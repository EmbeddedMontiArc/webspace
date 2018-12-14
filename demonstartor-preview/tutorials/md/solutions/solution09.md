# Solution (09)

### Run trough the track.

To solve the tutorial we have to use the MainController, like we did in the other tutorials.

```
package controller09;

import SteeringController;
import VelocityController;
import StatusController;

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
        in Q(0m/s:25m/s) velocity,

        in Q(-200m:200m) xPosition,
        in Q(-200m:200m) yPosition,

        out Q(-2m/s^2:2m/s^2) acceleration,
        out Q(-180:180) steering,
        out B status;

    instance SteeringController steeringController;
    instance VelocityController velocityController;
    instance StatusController trigger;

    connect time->velocityController.time;
    connect velocity->velocityController.velocity;
    connect frontLeftSensor->steeringController.frontLeft;
    connect frontRightSensor->steeringController.frontRight;
    connect frontLeftSideSensor->steeringController.frontLeftSide;
    connect backLeftSideSensor->steeringController.backLeftSide;
    connect frontRightSideSensor->steeringController.frontRightSide;
    connect backRightSideSensor->steeringController.backRightSide;
    connect xPosition->trigger.inx;
    connect yPosition->trigger.iny;

    connect velocityController.acceleration->acceleration;
    connect steeringController.steering->steering;
    connect trigger.status->status;
}
```
You can see that we have here 3 controllers: SteeringController, VelocityController and StatusController. Let us start from the simples one, which is similar to other tutorials:

```
package controller09;

component VelocityController {
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
This module just controls a velocity of the car. How you can see it is pretty straight forward, we accelerate the car until it reaches 5 m/s. Then just keep up the velocity without an acceleration. The next module is StatusController. It is responsible for the simulation status :

```
package controller09;

component StatusController {
    port
        in Q(-200m:200m) inx,
        in Q(-200m:200m) iny,
        out B status;

    implementation Math{

        // the track boundaries
        B boundariesX = (inx > 200m) || (inx < -200m);
        B boundariesY = (iny > 120m) || (iny < -50m);
  
        status = boundariesX || boundariesY;
    }
}
```

The simulation process is running forever, until you stop the simulation with the button or the car exceeds the virtual world borders. Then we should continue with the most important module - SteeringController. This module is in charge of the car rotation.

```
package controller09;

component SteeringController {
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
        
        steering = 0°;
        
        if (comp2)
            steering = 3°;
        end

        if (comp1)
            steering = -3°;
        end
    }
}
```
Here we are using 6 sensors to measure the distance. We have three possible output for this module: 0°, 3° and -3°. Depends on the result of the expressions(comp1 and comp2) we have different output. There is some possibilities to get better the controller. For instance, slow down the car before a turn, to increase the car maneuverability.