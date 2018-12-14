# Tutorial(04)

### Maneuverability test - drive between cones.
Implement a model that manages a a driving between cones, which emulates the maneuverability test. The model has to have several modules which are responsible for different actions. One of the examples could be:
1. Module controls the speed of the car
2. Module is responsible for a steering angle of the car, depends form current position.

Each module should be as simple as possible.

To solve this tutorial you may use from 4 to 6 sensors, which measure the distance to objects which are located in front/side of the car. The speed has to be around 1-2 m/s. At the picture you can see the main idea how the driving has to be done:

![alt text](../img/drive_cones.png)

The parking process can be divided in several steps:  
1. Go straight until a cone it closer the 10m then start to rotate the car to round the cone.
2. When a front part of the car is passed the cone, start to rotate in opposite direction.
3. When the car is rotated enough to pass the next cone, stop rotation and continue moving straight.
4. Repeat the second step until pass all cones.

**Important to know, this wed-simulator is a simplified version and it does not change the angle of front wheels but an angle of the car entirely.**

Hint: In this task will be helpful to use the static variables like a counters.

Show the [solution](solutions/solution04.md).