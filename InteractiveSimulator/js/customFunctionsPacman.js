//custom

// init
var gameFrameSrc = "pacman/simulation.html";
var visualisationFrameSrc = "SVGPacman/de.rwth.pacman.pacManWrapper_extended.html";

function customInit() {

}

// common
function getMaxIteration() {
    return gameframe.getIteration();
}

function gameIsPaused() {
    return gameframe.PACMAN.getState() === 6;
}

// buttons - debugControls
function gameEnterDebugMode() {
    gameframe.PACMAN.debug();;
}

function gameLeaveDebugMode() {
    gameframe.PACMAN.endDebug();
}

function gameProceedOneIteration() {
    gameframe.PACMAN.oneStep();

}

var liveValuesEntered = false;
function gameToggleSVGUpdateCallOnIteration() {
    if (!liveValuesEntered)
        gameframe.setLiveValues();
    else
        gameframe.unsetLiveValues();
    liveValuesEntered = !liveValuesEntered;
}

// buttons - game controls
function gameTogglePause() {
    gameframe.PACMAN.pause();
}

function gameToggleMute() {
    gameframe.PACMAN.mute()
}

function gameFaster() {
    gameframe.PACMAN.faster();
}

function gameSlower() {
    gameframe.PACMAN.slower();
}

// matrixHandler
function handleMatrix(id, portValue, svgTextElement){
    printMatrixAsImage(id, portValue, svgTextElement, colorMapping);
}

function colorMapping(value) {
    var color = [0,0,0];
    if (value == "0")
        color = [65, 67, 244];
    else if (value == "1")
        color = [255,255,255];
    else if (value == "2")
        color = [0,0,0];
    else if (value == "3")
        color = [65, 67, 244];
    else if (value == "4")
        color = [244, 167, 66];
    return color;
}