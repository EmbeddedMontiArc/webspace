# Solution(07)

### Overtaking a car on a straight road

To solve that tutorial we have to use the MainController, like we did in the other tutorials. The difference here in other connections between the components and number of these components:

```
package controller07;

import VelocityController;
import DistanceController;
import OvertakeController;
import ActiveController;
import PassObjectController;

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

    instance ActiveController activeController;
    connect xPosition -> activeController.xPosition;
    connect activeController.status -> status;

    instance OvertakeController<50> overtakeController;
    
    connect frontLeftSensor -> overtakeController.frontLeftSensor;
    connect frontRightSensor -> overtakeController.frontRightSensor;
    connect frontLeftSideSensor -> overtakeController.frontLeftSideSensor;
    connect frontRightSideSensor -> overtakeController.frontRightSideSensor;
    connect backLeftSideSensor -> overtakeController.backLeftSideSensor;
    connect backRightSideSensor -> overtakeController.backRightSideSensor;
    
    connect overtakeController.steering -> steering;
    connect activeController.active -> overtakeController.active;
    
    instance PassObjectController passObjectController;
    connect frontRightSideSensor -> passObjectController.frontRightSideSensor;
    connect backRightSideSensor -> passObjectController.backRightSideSensor;
    connect overtakeController.activatePassChecker -> passObjectController.active;
    connect passObjectController.done -> overtakeController.passed;
}
```
In the previous tutorial we have made 3 modules which we a going to reuse in this one: VelocityController, DistanceController. StatusController will be relocated into the ActiveController with some improvements and expansion of the functional. Another components have to be implemented, they are: PassObjectController and OvertakingController. Let's start with the components which were already implemented without changes or enhancements. The DistanceController:

```
package controller07;

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

And the VelocityController:

```
package controller07;

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
Next controller is the ActiveController which is partially reuse the StatusController:

```
package controller07;

component ActiveController {
	port                                    
		in Q xPosition,
		out B active,
		out B status;

	implementation Math{                    

    	if (xPosition > -50)
            active = 1;
        else
            active = 0; 
        end
        
        if (xPosition > 50)  // the part which was reused from the previous tutorial
            status = 1;
        else
            status = 0;
        end
	}
}
```

The ActiveController regulates the position when to start an overtaking process and when to finish the simulation. The second part was borrowed from the previous tutorial. The output port - active, signals to the Overtaking controller that is time to start an overtaking.  
The next controller which we going to implement is the PassObjectController:

```
package controller07;

component PassObjectController {
	port                                    
		in Q(-200m:200m) frontRightSideSensor,
        in Q(-200m:200m) backRightSideSensor,
        in B active,
		out B done; 

	implementation Math{
	    
	    static B passed0 = 0;
	    static B passed1 = 0;
	    done = 0;
	    
	    if active
	    
	        if ((frontRightSideSensor - backRightSideSensor) < -3)
                passed0 = 1;
            end
        
            if (((backRightSideSensor - frontRightSideSensor) < -3) && passed0 )
                passed1 = 1;
            end
            
            if (passed0 && passed1 && ((frontRightSideSensor - backRightSideSensor) < 2))
	        	done = 1;
	        end
	    end

	}
}
```
This module is calculating changes in the sensors' measurements to understand, whether a car ,during the overtaking, is already passed or not. The overtaking is taking place on the left side, due to this we are using the right sensors to measure changes. Firstly the front right side sensor passes a back edge of the overtaking car, then it passes the front edge of the car and finally the back sensor passes the front edge of the car. It means that we have passed the car and may start the process of returning to the center of the road, because to accomplish an overtaking we have to "shift" car to the left to be able to overtake it without an accident.  
Eventually we are building the most important controller for this tutorial - Overtaking controller:

```
package controller07;

component OvertakeController<Q distance = 80m> {
	port                                    
		in Q(-200m:200m) frontLeftSensor,
        in Q(-200m:200m) frontRightSensor,
        in Q(-200m:200m) frontRightSideSensor,
        in Q(-200m:200m) frontLeftSideSensor,
        in Q(-200m:200m) backLeftSideSensor,
        in Q(-200m:200m) backRightSideSensor,
        in B active,
        in B passed,
        out B activatePassChecker,
		out Q steering;

	implementation Math{
    
    static B overtake0 = 0;
    static B overtake1 = 0;
    steering = 0;
    activatePassChecker = 0;

    if active
    
        if ((frontLeftSideSensor > 5) && (frontRightSensor < 20))
            steering = -1;
        end
        
        if (frontRightSensor > 20) 
            overtake0 = 1;
        end
        
        if (overtake0 && (frontLeftSideSensor < backLeftSideSensor))
            steering = 0.2;
            overtake1 = 1;
        end
        
        if overtake1
            activatePassChecker = 1;
        end
        
        if passed
            if (frontRightSideSensor > 10)
                steering = 0.5;
            else
                if (frontLeftSideSensor < backLeftSideSensor)
                    steering = 0.5;
                end
            
                if (frontLeftSideSensor > backLeftSideSensor)
                    steering = -0.5;
                end
            end
            
        end
        
    end

	}
}
```
The main logic of this controller is following: when the overtaking controller is activated by the ActiveController, the car measures a distance from left front car to edge of the road to have enough space for overtaking. Then it turns left until the car "shifted" enough to the left to do overtaking. When the overtaking process has already started, the PassObjectController is activated. When the car from the right side already passed, it turns right to come back to the center of the road and align the car with the track.