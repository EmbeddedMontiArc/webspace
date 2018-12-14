# Solution(01)

## Accelerate the given time and stop simulation.

To solve that tutorial you have to use the MainController like you did in the tutorial00. The only difference here that we should pass simulation time instead of velocity of the car.

```
package controller01;

import VelocityController;

component MainController{
    ports                                   
        in Q(-200m:200m) frontLeftSensor,       //front left sensor with range from 0 meters to 200 meters
        in Q(-200m:200m) frontRightSensor,      //front right sensor
        in Q(-200m:200m) frontLeftSideSensor,   //side left front sensor
        in Q(-200m:200m) frontRightSideSensor,  //side left back sensor
        in Q(-200m:200m) backLeftSideSensor,    //side right front sensor
        in Q(-200m:200m) backRightSideSensor,   //side right back sensor
        in Q(-200m:200m) backLeftSensor,        //back left sensor
        in Q(-200m:200m) backRightSensor,       //back right sensor

        in Q(0s:oos) time,                      //simulation time from 0s to infinity
        in Q(0m/s:25m/s) velocity,              //car velocity
        in Q(-200m:200m) xPosition,             //car position X
        in Q(-200m:200m) yPosition,             //car position Y

        out Q(-2m/s^2:2m/s^2) acceleration,     //car acceleration 
        out Q(-180°:180°) steering,             //car steering
        out B status;                           //whether the simulation is still running

    instance VelocityController velocityController;

    connect time->velocityController.time;
    connect velocityController.acceleration->acceleration;
    connect velocityController.status->status;
}
```
We import the VelocityController, instantiate it and then connect to the MainController.
Now we have to write the VelocityController. It has to have only one incoming port and two outgoing ones.

```
package controller01;

component VelocityController {
	port
		in Q(0s:oos) time,
		out Q(-2m/s^2:2m/s^2) acceleration,
		out B status;

	implementation Math{
		
		if (time <= 10 s)
    	    acceleration = 0.5 m/s^2;
            status = false;
    	else
    		status = true;
        end
	}
}
```

The logic inside the controller means that until the car reach 10s execution time, it has to accelerate 1 m/s^2. After that the component should set status to TRUE, which means stop the simulation.