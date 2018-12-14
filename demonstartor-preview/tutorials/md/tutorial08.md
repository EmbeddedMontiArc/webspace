# Tutorial (08)

### Enhance the previously created parking controller.
In this tutorial we a going to enhance the parking controller to add the possibility of measuring the gap between cars, whether it is sufficient for the parking or not. We are using here the sensors from the left side of the car and coordinates, like from GPS to measure the size of the gap for parking. Or the second possibility use the velocity of the car and time, which are given on incoming ports. The previously created solution could have the following modules:  

1. Module which controls the speed of the car, depends on the current action(e.g. parking, searching a parking place).
2. Module which looking for a gap between cars for the parking.
3. Module which controls a steering of the car during the parking process.  

And we may enhance the module, which is looking for a gap between cars. To solve this tutorial you need two sensors, which are located on the side where the car searching for a place. You can define the maximum velocity around 1 m/s or even less. The previously created modules can be reused here.

Show the [solution](solutions/solution08.md).