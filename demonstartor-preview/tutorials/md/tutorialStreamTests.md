Test driven development

We are going to apply test driven development way to create our models for the simulator. It means that we will start from creating tests in advance and only then a controller which satisfy the tests.
Let's start with simple example:

```sh
package simulatorModel;

stream VelocityControllerTest for VelocityController {
    velocity: 0m/s tick 10m/s tick 11m/s;
    time: 0s tick 10s tick 11s;

    acceleration: 1m/s^2 tick 1m/s^2 tick 0m/s^2;
}
```

We are going to analyse it line by line. From the very beginning we have to declare the package name. If we have a chain of folders then they have to be separated by points. Example: folder1.folder2.folderWithTests.
Then you can see the reserved word STREAM, which is followed by the name of the test. It has to coincide with the file name where the test is written. After the reserved word FOR must be written the actual controller which will be tested. Inside the test scope should be written incoming and outgoing ports of the controller. Here we have 3 ports: 2 incoming velocity and time and one outgoing acceleration. The reserved word TICK divides "discrete" data on chunks. Then we can see the first value for velocity is 0m/s and 0s for time then we have to have the respective value on the acceleration port. It has to be 1m/s^2 in our case.

When we have eventually created the test for the VelocityController, it is time to  implement the controller. To satisfy the tests the controller could be something like this one:

```sh
package simulatorModel;

component VelocityController {
	port
		in Q(0m/s : 25m/s) velocity,
		in Q(0s:oos) time,
		out Q(-2m/s^2:2m/s^2) acceleration;

	implementation Math{

    	if (velocity > 10 m/s)
    	    acceleration = 0m/s^2;
    	else
    	    acceleration = 1m/s^2;
        end
	}
}
```

Now we can see, if we pass 0m/s into velocity port then we have 1m/s^2 for the outgoing acceleration port and out controller pass the test.
