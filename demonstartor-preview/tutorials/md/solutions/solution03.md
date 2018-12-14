# Solution(03)

### To carry out a parallel parking between two cars.

To solve that tutorial you have to use the MainController, like you did in the other tutorials. The difference here in other connections between the components:

```sh
package controller03;

import VelocityController;
import SearchParkingPlaceController;
import ParkingController;

component MainController{
    ports 
        in Q(0m:200m) fl,                   //front left sensor with range from 0 meters to 200 meters
        in Q(0m:200m) fr,                   //front right sensor
        in Q(0m:200m) slf,                  //side left front sensor
        in Q(0m:200m) slb,                  //side left back sensor
        in Q(0m:200m) srf,                  //side right front sensor
        in Q(0m:200m) srb,                  //side right back sensor
        in Q(0m:200m) bl,                   //back left sensor
        in Q(0m:200m) br,                   //back right sensor

        in Q(0s:oos) time,                  //simulation time from 0s to infinity
        in Q(0m/s:25m/s) velocity,          //car velocity

        in Q(-200m:200m) x,                 //car position X
        in Q(-200m:200m) y,                 //car position Y

        out Q(-2m/s^2:2m/s^2) acceleration, //car acceleration 
        out Q(-180°:180°) steering,         //car steering
        out B status;                       //whether the simulation is still running


    instance VelocityController velocityController;

    connect velocity->velocityController.velocity;
    connect velocityController.acceleration->acceleration;

    instance SearchParkingPlaceController searchParkingPlaceController;

    connect slf->searchParkingPlaceController.frs;
    connect slb->searchParkingPlaceController.brs;
    connect searchParkingPlaceController.foundPlace->velocityController.reverseMove;
    
    instance ParkingController parkingController;
    
    connect bl->parkingController.bl;
    connect br->parkingController.br;
    connect fr->parkingController.fr;
    connect fl->parkingController.fl;
    connect slf->parkingController.slf;
    connect slb->parkingController.slb;
    connect parkingController.moveForward->velocityController.moveForward;
    connect parkingController.steeringAngle->steering;
    connect parkingController.status->status;
    connect searchParkingPlaceController.foundPlace->parkingController.reverseMove;
    
}
```
We import VelocityController, SearchParkingPlaceController and ParkingController instantiate them and then connect correspondingly. 
Now we should create a VelocityController, which controls the speed of the car:

```sh
package controller03;

component VelocityController {
	port                                    
		in Q(0m/s : 25m/s) velocity,
		in B reverseMove,
		in B moveForward,
		out Q(-2m/s^2:2m/s^2) acceleration; 

	implementation Math{                    

    	if (velocity > 1 m/s)           // this statement controls the speed of the car
    	    acceleration = 0m/s^2;      // if the speed faster then defined then it have no acceleration
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

The controller has three states. First one is when the car is looking for a place for parking and has speed 1m/s. Second, when the car is moving back. And the third one is when it is moving forward to be closer to the front car.

Next controller is a SearchParkingPlaceController. The idea is to pass the first car and find the "end" of the second car to start parking process form a right point.

```sh
package controller03;

component SearchParkingPlaceController {
    port
        in Q(0m:200m) frs,
        in Q(0m:200m) brs,
        out B foundPlace;

    implementation Math{
        
        static Q first = 0;             // Static variables init only with given value
        static Q second = 0;
        static Q third = 0;
        static Q found = 0;

        if (frs > brs) && (second == 1)  && (third == 1)
            found = 1;
            second = 0;
            third = 0;
        end
        
        if frs > brs
            first = 1;
        end
        
        if frs < brs
            second = 1;
        end
        
        if (frs == brs) && (first == 1) && (second == 1)
            first = 0;
            second = 0;
            third = 1;
        end
        
        foundPlace = found > 0;
    }
}
```

We are using here the side sensors to measure the distances to the cars and the side of the road. Using static variables we can save the states(e.g. the distance has changed from 5m to 1m and then from 1m to 5m -> we have passed the car).

Next controller will be the most important one because it manages the parking process:

```sh
package controller03;

component ParkingController {
    port
        in Q(0m:200m) bl,
        in Q(0m:200m) br,
        in Q(0m:200m) fl,
        in Q(0m:200m) fr,
        in Q(0m:200m) slf,
        in Q(0m:200m) slb,
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
        
        if (reverseMove && (bl < 2))
            steeringAngle = -1;
        end
        
        // Car has to be parallel to the road edge
        // Go forward when the back closer then 3m
        if (reverseMove && ((br == bl) || ((br < 3) && (bl < 3))))
            forwardState = 1;
        end
        
        // Stop when the car closer then 3m to front car
        if (((fr < 3) || (fl < 3)) && forwardState)
            status = 1;
        else
            status = 0;
        end
        
        // if car moving forward, does not change the car angle
        if forwardState
            steeringAngle = 0;
        end
        
        // align the car
        if (forwardState && (slf > slb))
            steeringAngle = -0.5;
        end
        
        if (forwardState && (slf < slb))
            steeringAngle = 0.5;
        end
        
        moveForward = forwardState;
    }
}
```
The idea is that the car is going back until it reached a certain point, changing an angle of the car. When we are going back and the distance, from the back left sensor to the road border, is less then 2m, start rotate the car in opposite direction until it is in parallel with the road. Then stop when the limit of the back distance is reached and go closer to the front car. All these steps are nicely illustrated at the picture in the tutorial03.