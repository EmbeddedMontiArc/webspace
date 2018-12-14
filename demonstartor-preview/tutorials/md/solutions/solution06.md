# Solution(06)

### Follow a car (adaptive cruise control).

To solve that tutorial we have to use the MainController, like we did in the other tutorials. The difference here in other connections between the components:

```
package controller06;

import VelocityController;
import DistanceController;
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
        in Q(0km/h:250km/h) velocity, 

        in Q(-200m:200m) xPosition,
        in Q(-200m:200m) yPosition,

        out Q(-2m/s^2:2m/s^2) acceleration, 
        out Q(-180:180) steering,
        out B status;

    instance VelocityController<2 m/s> velocityController;
    connect velocity->velocityController.velocity;
    connect velocityController.acceleration->acceleration;

    instance DistanceController<10 m> distanceController;
    connect frontLeftSensor -> distanceController.frontLeftSensor;
    connect frontRightSensor -> distanceController.frontRightSensor;
    connect distanceController.run -> velocityController.run;
    connect distanceController.follow -> velocityController.follow;

    instance StatusController statusController;
    connect xPosition -> statusController.xPosition;
    connect statusController.status -> status;
}
```
Here we have 3 controllers which are: VelocityController, DistanceController and StatusController. We have to instantiate them and connect the ports. But you can see a new construction which we use:

```
component Component<Type n=5> { // define component with the different possible types (like generics in Java)
    ...
    if(n) ...
}
```
Where n=5 is a default value if nothing is given. Then we can use it, like you see above:
```
instance Component<10 m> componentName;
```
It will be really convenient in our case, because we can specify the distance, when the controller is involved, directly in the MainController. But in general you can use one controller for different types of data and don't have to rewrite the complete component.  
Let us continue with implementation of the DistanceController. It has to measure the distance to a car in front and communicate with the VelocityController, changing the velocity of the car.

```
package controller06;

component DistanceController<Q distance = 10m> {
	port
        in Q(-200m:200m) frontLeftSensor,
        in Q(-200m:200m) frontRightSensor,
        out Q follow,
		out Q run; 

	implementation Math{
		
		static Q previousFL = 0;
		static Q previousFR = 0;

    	if ((frontLeftSensor < distance) || (frontRightSensor < distance))
    	    run = 0;
    	else
    		run = 1;
        end
        
        if ((run < 1) && ((previousFL < frontLeftSensor) || (previousFR < frontRightSensor)))
        	follow = 1;
        else
        	follow = 0;
        end
        
        previousFL = frontLeftSensor;
        previousFR = frontRightSensor;
	}
}
```
You can see that we are using here the data from the previous measurement process to compare the distances. To save the data from the previous loop we use **static** variables. We have here two stages: first one it to catch up the car in front and the second one is to follow the car. All these data are transferred to the VelocityController.

```
package controller06;

component VelocityController<Q velMAX = 2m/s> {
	port                                    
		in Q(0km/h : 250km/h) velocity,
		in Q run,
		in Q follow,
		out Q(-2m/s^2:2m/s^2) acceleration; 

	implementation Math{                    

    	if (run && (velocity < velMAX))
			acceleration = 0.1 m/s^2;
    	else
			acceleration = -0.1 m/s^2;
        end
        
        if follow
        	acceleration = 0 m/s^2;
        end
	}
}
```

Depends on the state, follow or run, the velocity of the car is changed. The parameter **velMAX** defines the maximum velocity of the car. When there are no obstacles in front of the car, it runs maximum speed. Then we need the last module which be able to start/end the simulation.

```
package controller06;

component StatusController {
	port                                    
		in Q xPosition,
		out B status;

	implementation Math{
        
        if (xPosition > 40)
            status = 1;
        else
            status = 0;
        end
	}
}
```

The module just finishes the simulation process, when the car has passed the given point on the track.