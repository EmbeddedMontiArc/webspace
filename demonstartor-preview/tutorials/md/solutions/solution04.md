# Solution(04)

### Maneuverability test - drive between cones.

To solve that tutorial you have to use the MainController, like you did in the other tutorials. The difference here in other connections between the components:

```sh
package controller04;

import VelocityController;
import ConeRunner;

component MainController{
    ports 
        in Q fl,
        in Q fr,
        in Q slf,
        in Q slb,
        in Q srf,
        in Q srb,
        in Q bl,
        in Q br,

        in Q time,
        in Q(0km/h:250km/h) velocity,

        in Q(-200m:200m) x,
        in Q(-200m:200m) y,

        out Q(-2m/s^2:2m/s^2) acceleration,
        out Q(-180:180) steering,
        out B status;


    instance VelocityController velocityController;

    connect velocity->velocityController.velocity;
    connect velocityController.acceleration->acceleration;

    instance ConeRunner coneRunner;

    connect fl->coneRunner.fl;
    connect fr->coneRunner.fr;
    connect slf->coneRunner.slf;
    connect srf->coneRunner.srf;
    connect slb->coneRunner.slb;
    connect srb->coneRunner.srb;
    connect x->coneRunner.x;
    connect coneRunner.status->status; 
    connect coneRunner.steering->steering;
}
```

Here we have only two controllers velocityController and coneRunner. First one just controls the speed of the car and the second one use sensors to control steering of the car.

Now we should create a VelocityController:

```sh
package controller04;

component VelocityController {
	port                                    
		in Q(0km/h : 250km/h) velocity,
		out Q(-2m/s^2:2m/s^2) acceleration; 

	implementation Math{                    

    	if (velocity > 1 m/s)
    	    acceleration = 0m/s^2;
    	else
    		acceleration = 1m/s^2;
        end

	}
}
```

And now the controller which controls the most important - steering:

```sh
package controller04;

component ConeRunner {
    port
        in Q fr,
        in Q fl,
        in Q slf,
        in Q srf,
        in Q slb,
        in Q srb,
        in Q x,
        out Q steering,
        out B status;

    implementation Math{

        // pass variables are fired when the car reached a cone left/right side
        static Q passRight = 0;
        static Q passLeft = 0;
        
        // helps to control a rotation angle
        static Q count = 0;
        status = 0;

        // deal with the first cone
        if ((fr < 10) && (passLeft == 0) && (passRight == 0))
            steering = -1;
        else
            steering = 0;
        end
        
        // reached a cone from right side
        if (srf < 1)
            passRight = 1;
            passLeft = 0;
            count = 0;
        end
        
        if passRight && (count < 48)
            steering = 1;
            count +=1;
        end
        
        // reached a cone from left side
        if passRight && (slf < 1)
            passLeft = 1;
            passRight = 0;
            count = 0;
        end
        
        if passLeft && (count < 55)
            steering = -1;
            count +=1;
        end
        
        // Stop after passing the last cone
        if (x > 32)
            status = 1;
        end
    }
}
```

We are using slf and srf sensors to measure distance to cones and when the distance to the cone less then 1m we assume that it is time to start rotation in opposite direction. The counter give us possibility to control the rotation of the car.