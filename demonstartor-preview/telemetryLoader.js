var jsonSimulationData1;

function readJSONFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                jsonSimulationData1 = JSON.parse(allText);
            }
        }
    }
    rawFile.send(null);
}

readJSONFile("telemetry-log-tsc.json");

var distBetweenPoints1 = new Array();
var distBetweenPointsSum1 = 0;

// Read all telemetry records from the file
for(var i=0; i<jsonSimulationData1.telemetry.length-1; i++){

    // Add in the array changing position related to x and y
    var diffX = jsonSimulationData1.telemetry[i].Position[0] -
                    jsonSimulationData1.telemetry[i+1].Position[0];
    var diffY = jsonSimulationData1.telemetry[i].Position[1] -
                    jsonSimulationData1.telemetry[i+1].Position[1];

    distBetweenPoints1.push({
        "x": diffX,
        "y": diffY,
        "v": {
                // Add begin and end points of vector
                "x0": jsonSimulationData1.telemetry[i].Position[0],
                "y0": jsonSimulationData1.telemetry[i].Position[1],
                "x1": jsonSimulationData1.telemetry[i].Position[0]-diffX*6, // The constant size influences on arrow length 
                "y1": jsonSimulationData1.telemetry[i].Position[1]-diffY*6
            }
    });

    distBetweenPointsSum1 += Math.sqrt(Math.pow(diffX,2)+Math.pow(diffY,2));
}

console.log(distBetweenPoints1.length);
console.log("Length of TSC controller : ",distBetweenPointsSum1);