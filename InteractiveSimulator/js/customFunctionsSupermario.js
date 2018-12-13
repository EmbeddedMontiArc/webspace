//custom
$('#gameFrame').css('width', '1200px');
function resizeGameFrame() {
    $('#gameFrame').css('width', '30vw');
}

// init
var gameFrameSrc = "supermario/gameScripts.html";
var visualisationFrameSrc = "SVGSupermario/de.rwth.supermario.superMarioWrapper_extended.html";

function customInit() {

}

// common
function getMaxIteration() {
    return gameframe.getIteration();
}

function gameIsPaused() {
    return gameframe.FSM.GamesRunner.getPaused();
}

// buttons - debugControls
function gameEnterDebugMode() {
    gameframe.FSM.GamesRunner.pause();
    gameframe.FSM.ModAttacher.fireEvent("onKeyDownPause");
}

function gameLeaveDebugMode() {
    gameframe.FSM.GamesRunner.play();
}

function gameProceedOneIteration() {
    gameframe.FSM.GamesRunner.play();
    gameframe.FSM.GamesRunner.setInterval(1000);
    gameframe.FSM.GamesRunner.pause();
    gameframe.FSM.GamesRunner.setInterval(1);

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
    if (gameframe.FSM.GamesRunner.getPaused())
        gameframe.FSM.GamesRunner.play();
    else
        gameframe.FSM.GamesRunner.pause();
    gameframe.FSM.ModAttacher.fireEvent("onKeyDownPause");
}

var muted = false;
function gameToggleMute() {
    if (gameframe.FSM.GamesRunner.getPaused())
        return;
    if(!muted)
        gameframe.FSM.AudioPlayer.setMutedOn();
    else
        gameframe.FSM.AudioPlayer.setMutedOff();
}

var interval = 1;
function gameFaster() {
    if(interval > 1) {
        interval = interval / 2;
        gameframe.FSM.GamesRunner.setInterval(interval);
    }
}

function gameSlower() {
    interval = interval * 2;
    gameframe.FSM.GamesRunner.setInterval(interval);
}

// matrixHandler
function handleMatrix(id, portValue, svgTextElement){
    printMatrix(id, portValue, svgTextElement);
}