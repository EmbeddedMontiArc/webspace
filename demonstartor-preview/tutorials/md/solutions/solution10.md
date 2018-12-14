# Solution (10)

### React on an obstacle on the track.

To solve the tutorial we should begin with a MainController which has an interface and connections between modules:

```
package controller10;

import SteeringController;
import VelocityController;
import StatusController;
import ObstacleController;

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

        in Q(0s:oos) time,
        in Q(0m/s:25m/s) velocity,

        in Q(-200m:200m) xPosition,
        in Q(-200m:200m) yPosition,

        out Q(-2m/s^2:2m/s^2) acceleration,
        out Q(-180°:180°) steering,
        out B status;

    instance SteeringController steeringController;
    connect frontLeftSensor->steeringController.frontLeft;
    connect frontRightSensor->steeringController.frontRight;
    connect frontLeftSideSensor->steeringController.frontLeftSide;
    connect backLeftSideSensor->steeringController.backLeftSide;
    connect frontRightSideSensor->steeringController.frontRightSide;
    connect backRightSideSensor->steeringController.backRightSide;
    connect steeringController.steering->steering;
    
    instance VelocityController<5m/s> velocityController;
    connect velocity->velocityController.velocity;
    connect velocityController.acceleration->acceleration;
    
    instance StatusController trigger;
    connect xPosition->trigger.inx;
    connect yPosition->trigger.iny;
    connect trigger.status->status;
    
    instance ObstacleController<30m> obstacleController;
    connect frontLeftSensor->obstacleController.frontLeftSensor;
    connect frontRightSensor->obstacleController.frontRightSensor;
    connect obstacleController.status -> status;
    connect obstacleController.brake -> velocityController.brake;
}
```
We have reused from the previous tutorial several components : SteeringController, VelocityController and StatusController. Let us start from them:

```
package controller10;

component SteeringController {
    port
        in Q(-200m:200m) frontLeft,
        in Q(-200m:200m) frontRight,
        in Q(-200m:200m) frontLeftSide,
        in Q(-200m:200m) frontRightSide,
        in Q(-200m:200m) backLeftSide,
        in Q(-200m:200m) backRightSide,
        out Q(-180°:180°) steering;

    implementation Math{

        Q(0m:1m) threshold = 0.1m;

        B comp1 = (((frontLeft-frontRight) > threshold) && ((frontLeftSide-backLeftSide) > threshold)) && ((backRightSide-frontRightSide) > threshold);
        B comp2 = (((frontRight-frontLeft) > threshold) && ((backLeftSide-frontLeftSide) > threshold)) && ((frontRightSide-backRightSide) > threshold);
        
        steering = 0°;
        
        if (comp2)
            steering = 3°
        end

        if (comp1)
            steering = -3°;
        end
    }
}
```
The SteeringController was entirely reused. Continue with the StatusController:

```
package controller10;

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
It was not changed as well. It controls the boundaries of the virtual world. The next one is VelocityController, it has to be modified to be able to perform braking, which is important for our tutorial:

```
package controller10;

component VelocityController<Q maxVel = 5 m/s> {
	port
		in Q(0m/s : 10m/s) velocity,
		in B brake,
		out Q(-2m/s^2:2m/s^2) acceleration;

	implementation Math{
        
        if (brake && (velocity > 0 m/s))
        	acceleration = -0.5 m/s^2;
        else
        	if (velocity > maxVel)
    	    	acceleration = 0 m/s^2;
    		else
    	    	acceleration = 0.5 m/s^2;
        	end
        end
	}
}
```
We have added the brake input, which is controlled by the ObstacleController. If there is an obstacle in front of the car, it starts braking until the full stop and then wait until the object moves away from the way. Then we need to develop a new controller which reacts on the object and controls the braking:

```
package controller10;

component ObstacleController<Q distance = 30m>{
    port
        in Q(-200m:200m) frontLeftSensor,
        in Q(-200m:200m) frontRightSensor,
        out B brake;

    implementation Math{
        
        Q threshold = 0.5 m;
        brake = false;

        if ((frontRightSensor - frontLeftSensor) > 0m)
            if (((frontRightSensor - frontLeftSensor) < threshold) && (frontLeftSensor < distance))
                brake = true;
            end
        else
            if (((frontLeftSensor - frontRightSensor) < threshold) && (frontLeftSensor < distance))
                brake = true;
            end
        end
    }
}
```
The controller uses two front sensors. It measures the difference between them to react on the obstacle and sends a signal to the velocity controller.