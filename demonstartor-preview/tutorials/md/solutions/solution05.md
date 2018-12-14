# Solution(05)

### Free ride passing cones combining with parallel parking at the end.

To solve that tutorial you have to use the MainController, like you did in the other tutorials. The difference here in other connections between the components:

```
package controller05;

import VelocityController;
import PassObjectsController;
import ActiveController;
import SearchParkingPlaceController;
import ParkingController;
import SteeringProxyController;

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

    instance SearchParkingPlaceController searchParkingPlaceController;
    connect frontLeftSideSensor -> searchParkingPlaceController.frontLeftSideSensor;
    connect backLeftSideSensor -> searchParkingPlaceController.backLeftSideSensor;
    connect searchParkingPlaceController.foundPlace -> velocityController.reverseMove;
    connect searchParkingPlaceController.foundPlace -> parkingController.reverseMove;

    instance ActiveController activeController;
    connect xPosition -> activeController.xPosition;
    connect activeController.activeSearchParkingPlace -> searchParkingPlaceController.active;
    connect activeController.activePassObject -> passObjectsController.active;
    connect activeController.activePassObject -> steeringProxyController.mode;

    instance ParkingController parkingController;
    connect frontLeftSensor -> parkingController.frontLeftSensor;
    connect frontRightSensor -> parkingController.frontRightSensor;
    connect frontLeftSideSensor -> parkingController.frontLeftSideSensor;
    connect backLeftSideSensor -> parkingController.backLeftSideSensor;
    connect backLeftSensor -> parkingController.backLeftSensor;
    connect backRightSensor -> parkingController.backRightSensor;
    connect parkingController.status -> status;
    connect parkingController.moveForward -> velocityController.moveForward;
    connect parkingController.steeringAngle -> steeringProxyController.steeringParking;
    
    instance PassObjectsController passObjectsController;
    connect frontLeftSensor -> passObjectsController.frontLeftSensor;
    connect frontRightSensor -> passObjectsController.frontRightSensor;
    connect frontLeftSideSensor -> passObjectsController.frontLeftSideSensor;
    connect frontRightSideSensor -> passObjectsController.frontRightSideSensor;
    connect backLeftSideSensor ->passObjectsController.backLeftSideSensor;
    connect backRightSideSensor -> passObjectsController.backRightSideSensor;
    connect passObjectsController.steering -> steeringProxyController.steeringPassObjects;
    
    instance SteeringProxyController steeringProxyController;
    connect steeringProxyController.steering -> steering;
}
```

It is pretty hard to imagine all given connections between the components. To simplify that, the following picture is given. It gives better understanding the structure of the whole controller.   
<img src="../../img/controller05.mainController_simplified.svg" alt="drawing" width="1200px" height="600px"/>

We can borrow all components related to the parking process from the third tutorial. There are three controllers:

Parking controller :  
```
package controller05;

component ParkingController {
    port
        in Q backLeftSensor,
        in Q backRightSensor,
        in Q frontLeftSensor,
        in Q frontRightSensor,
        in Q frontLeftSideSensor,
        in Q backLeftSideSensor,
        in B reverseMove,
        out Q steeringAngle,
        out B moveForward,
        out B status;

    implementation Math{
        
    if(reverseMove)
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
    end
    }
}
```
Search parking place controller:  

```
package controller05;

component SearchParkingPlaceController {
    port
        in Q frontLeftSideSensor,
        in Q backLeftSideSensor,
        in B active,
        out B foundPlace;

    implementation Math{
        
        static Q first = 0;
        static Q second = 0;
        static Q third = 0;
        static Q found = 0;

    if(active)

        if ((frontLeftSideSensor - backLeftSideSensor) < -3)
            first = 1;
        end
        
        if (((backLeftSideSensor - frontLeftSideSensor) < -3) && first )
            second = 1;
        end
        
        if (((frontLeftSideSensor - backLeftSideSensor) < -3) && first && second)
            third = 1;
        end
        
        if (((backLeftSideSensor - frontLeftSideSensor) < -3) && first && second && third)
            found = 1;
        end
    end
    
    foundPlace = found > 0;
    }
}
```

And VelocityController :  

```
package controller05;

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

Then we should implement the remaining controllers. Let us start with the active controller. This module decides which controller should be active, depends on some condition. In the given example, the condition is a place, where the car starts to search a place for parking. We have two possible active modes: passing cones or searching for a parking place.

```
package controller05;

component ActiveController {
	port                                    
		in Q xPosition,
		out B activePassObject,
        out B activeSearchParkingPlace;

	implementation Math{                    

    	if (xPosition > 15)
            activePassObject = 0;
            activeSearchParkingPlace = 1;
        else
            activePassObject = 1;
            activeSearchParkingPlace = 0;
        end

	}
}
```

The next controller will be the passing objects controller. This controller works pretty strait forward, if there is an object, which is closer to a right side of the car, it passes the object from the left hand side and wise versa. If these is no obstacles in 10 meters, it tries to align the car to drive straight. If the controller is not active, then it return 0 to the steering output.

```
package controller05;

component PassObjectsController {
	port
	    in Q(-200m:200m) frontLeftSensor,
        in Q(-200m:200m) frontRightSensor,
		in Q(-200m:200m) frontLeftSideSensor,
        in Q(-200m:200m) frontRightSideSensor,
        in Q(-200m:200m) backLeftSideSensor,
        in Q(-200m:200m) backRightSideSensor,
		in B active,
        out Q steering;

	implementation Math{

	if(active)
    	if((frontLeftSensor < 10) && (backRightSideSensor > 5))
    	    steering = 1;
    	else
    	    if((frontRightSensor < 10) && (backLeftSideSensor > 5))
    	        steering = -1;
    	    else
    	        steering = 0; 
    	        
    	        if (frontLeftSideSensor > backLeftSideSensor)
    	        	steering = -0.3;
    	        end
    	        if (frontLeftSideSensor < backLeftSideSensor)
    	        	steering = 0.3;
    	        end
    	    end
    	end
	else
    	steering = 0;
	end
	}
}
```
And the last one is the steering proxy controller. This controller defines, which signal from one of these controllers, will be passed to the MainController. As were said before, we have two modes: passing objects or parking. Depends on what mode is active, the active controller data is passed to the MainController.

package controller05;

component SteeringProxyController {
    port
        in Q steeringParking,
        in Q steeringPassObjects,
        in B mode,
        out Q steering;

    implementation Math{
        
        if mode
            steering = steeringPassObjects;
        else
            steering = steeringParking;
        end
        
    }

}
```