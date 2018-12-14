# Solution(02)

### Accelerate and then stop about 10 meters before an obstacle.

To solve that tutorial you have to use the MainController like you did in the tutorial00 and tutorial01. Here we are using the sensors fl and fr in the MainController.

```
package controller02;

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

    connect frontLeftSensor->velocityController.frontLeftSensor;
    connect frontRightSensor->velocityController.frontRightSensor;
    connect velocityController.acceleration->acceleration;
    connect velocityController.status->status;
}
```
We import the VelocityController, instantiate it and then connect fl and fr ports to corresponding ports of the velocityController.
Now we should write the VelocityController. It has to have two incoming ports and two outgoing ones.

```
package controller02;

component VelocityController {
	port
		in Q(0m:200m) frontLeftSensor,
		in Q(0m:200m) frontRightSensor,
		out Q(-2m/s^2:2m/s^2) acceleration,
		out B status;

	implementation Math{
		
		if ((frontLeftSensor > 10 m) && (frontRightSensor > 10 m))
    	    acceleration = 1 m/s^2;
            status = false;
    	else
    		status = true;
        end
	}
}
```

Here we use following logic: if the distance to an obstacle from any sensor more than 10 m then accelerate with 1 m/s^2, else stop the simulation. Here you can see we are using the && operator.