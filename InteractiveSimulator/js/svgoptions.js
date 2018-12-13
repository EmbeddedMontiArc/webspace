var currentIteration = 0;
var foundNextIteration = false;

function enterDebugMode() {
    foundNextIteration = false;
    currentIteration = getMaxIteration();
    updateSVG(currentIteration);
}

function updateDebugMode() {
    updateSVG(currentIteration);
}

function nextDebugStep() {
    foundNextIteration = false;
    currentIteration++;
    updateSVG(currentIteration);
    if (!foundNextIteration) {
        currentIteration--;
        alert("No next Step present");
    }
}

function previousDebugStep() {
    if (currentIteration > 0) {
        currentIteration--;
        updateSVG(currentIteration);
    } else {
        alert("No previous step present");
    }
}

function getSVG() {
    var vf = document.getElementById("visualisationFrame").contentWindow;
    var svg = vf.document.getElementById('svg').contentWindow;
    return svg;
}

function getFile(fileName) {
    try {
        return gameframe.FS.readFile(fileName, {"encoding": "utf8"});
    } catch (err) {
        return null;
    }
}

function updateSVG(iterationNumber) {
    var svg = getSVG();

    var compList = svg.document.getElementsByTagName('rect');
    for (var i = 0; i < compList.length; i++) {
        if (compList[i].getAttribute("data-name") != null) {
            var fileName = "execution" + iterationNumber + compList[i].getAttribute("data-name").replace(/\./g, "_") + ".res";
            var file = getFile(fileName); // as string

            if (file != null) {
                var compName = compList[i].id.replace(/\./g, "_");
                var lines = file.split(/\n/);
                for (var l = 0; l < lines.length - 1; l++) {
                    // read each line of text
                    try {
                        var port = lines[l];
                        var portName = port.split(":")[0].replace(" ", "");
                        var portValue = port.split(":")[1];
                        var isPortArray = (svg.document.getElementById(compName + "_" + portName + "[1]" + "_porttype") !== null);
                        var isMatrix = portValue.includes(";") || portValue.includes("matrix");

                        if (!isPortArray) {
                            var svgTextElement = svg.document.getElementById(compName + "_" + portName + "_porttype");
                            var textNode = svgTextElement.childNodes[0];
                            if (!isMatrix) {
                                textNode.nodeValue = portValue;
                            } else {
                                handleMatrix(compName + "_" + portName + "_canvas", portValue, svgTextElement);
                            }
                        } else {
                            // port array is represented by portName[i]_porttype
                            var values = portValue.replace("[", "").replace("]", "").split(",");
                            for (var j = 0; j < values.length; j++) {
                                var svgTextElement = svg.document.getElementById(compName + "_" + portName + "[" + (j + 1) + "]" + "_porttype");
                                var textNode = svgTextElement.childNodes[0];
                                textNode.nodeValue = values[j];
                            }
                        }
                        foundNextIteration = true;
                    } catch (err) {
                        console.log("Error, port not found\nCompName: " + compName + "\nPort: " + lines[l] + "\n");
                    }
                }

            }
        }
    }
}