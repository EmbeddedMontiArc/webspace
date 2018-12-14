# Tutorial(05)

### Free ride passing cones combining with parallel parking at the end.

Implement a model which drives through the field of cones and after some point find the parking place and then accomplish the parallel parking. The main idea is that we are going top use the parking controller here, which has been produced in the third tutorial. The big advantage of the C&C modeling language is a combining different components together using the connectors. It means that we can reuse the previously created component, which in charge of a parking process, and save the resources.

The main difference between this tutorial and the last one (maneuverability test) is that the car drives trough the field of cones and does not have to pass over each one. It just drives trough the given area without driving into the cones. To solve this tutorial you may need almost all sensors and actuators. The speed has to be around 1-2 m/s, due to limitation of sensors sampling frequency.

The model has to have several modules which are responsible for different actions. One of the examples could be:
1. Module which controls the speed of the car, depends form the current action(e.g. running between cones, parking, searching a parking place).
3. Module which looking for a gap between cars for the parking.
2. Module which controls a steering of the car during the parking process.  
These three modules should be reused from third tutorial. Then, we have to implement missing ones, like:  
4. Module which controls the behavior of the car during passing the cones.
5. Module, which switches the current active process (e.g. running between cones or parking in our case).

**Important to know, if you have several controllers which connected to one outgoing port in the MainController you have to manage, which signal from one of these controllers, will be passed to the MainController. Otherwise, the signal is transmitted in the same sequence as the controllers are instantiated in the MainController.**

Show the [solution](solutions/solution05.md).