var UPDIRECTION    = 0,
    DOWNDIRECTION  = 1,
    LEFTDIRECTION  = 2,
    RIGHTDIRECTION = 3,
    UNIT           = "m";


function startSimulation () {
    PACMAN.startNewGame();
    try {
        window.setInterval(doSimulationStep, 500 / Pacman.FPS);
    } catch (err) {
        if (err.message === undefined) {
            console.log(err)
        }
        else {
            console.log(err.message);
        }
    }
}

function pressKey(dir) {
    var keyCode;
    if(dir == DOWNDIRECTION)
            keyCode = KEY.ARROW_DOWN;
    else if(dir == UPDIRECTION)
        keyCode = KEY.ARROW_UP;
    else if(dir == LEFTDIRECTION)
        keyCode = KEY.ARROW_LEFT;
    else if(dir == RIGHTDIRECTION)
        keyCode = KEY.ARROW_RIGHT;
    else
        keyCode = KEY.ARROW_LEFT;

    // document.dispatchEvent(new KeyboardEvent('keydown',{'keyCode':keyCode}));
    var keyboardEvent = new KeyboardEvent('keydown', {bubbles:true});
    Object.defineProperty(keyboardEvent, 'keyCode', {get:function(){return keyCode;}});
    keyboardEvent.keyCode = [keyCode];
    document.body.dispatchEvent(keyboardEvent);
}

function getGhostX() {
    var res = "[";
    var ghosts = PACMAN.getGhosts();
    for(var i = 0; i < ghosts.length; i++){
        res += ghosts[i].getPosition().x/10 + UNIT + ",";
    }
    res = res.substring(0, res.length - 1);
    res += "]";
    return res;
}

function getGhostY() {
    var res = "[";
    var ghosts = PACMAN.getGhosts();
    for(var i = 0; i < ghosts.length; i++){
        res += ghosts[i].getPosition().y/10 + UNIT + ",";
    }
    res = res.substring(0, res.length - 1);
    res += "]";
    return res;
}

function getGhostDirection() {
    var res = "[";
    var ghosts = PACMAN.getGhosts();
    for(var i = 0; i < ghosts.length; i++){
        res += pmDir2simDir(ghosts[i].getDirection()) + ",";
    }
    res = res.substring(0, res.length - 1);
    res += "]";
    return res;
}

function pmDir2simDir(dir) {
    switch (dir) {
        case UP: return UPDIRECTION;
        case DOWN: return DOWNDIRECTION;
        case LEFT: return LEFTDIRECTION;
        case RIGHT: return RIGHTDIRECTION;
    }
}

function getGhostEatable() {
    var res = "[";
    var ghosts = PACMAN.getGhosts();
    for(var i = 0; i < ghosts.length; i++){
        res += ((ghosts[i].getEatable() !== null) ? 1 : 0) + ",";
    }
    res = res.substring(0, res.length - 1);
    res += "]";
    return res;
}

function getGhostEaten() {
    var res = "[";
    var ghosts = PACMAN.getGhosts();
    for(var i = 0; i < ghosts.length; i++){
        res += ((ghosts[i].getEaten() !== null) ? 1 : 0) + ",";
    }
    res = res.substring(0, res.length - 1);
    res += "]";
    return res;
}

function getSimulationMap () {
    var res = "[";
    var myMap = PACMAN.getMap().getMap();
    myMap.forEach(function (row) {
        res += row + ";"
    });
    res = res.substring(0, res.length - 1);
    res += "]";
    return res;
}

var printForTest_ = false;
var oldGhostX = "";
var oldGhostY = "";
var printSteps_ = 10;
var printSteps = printSteps_;

var printGhostX = "";
var printGhostY = "";
var printGhostDirection = "";
var printGhostEtable = "";
var printGhostEaten = "";
var printPacManX = "";
var printPacManY = "";
var printPacManEaten = "";
var printPacManLives = "";
var printPacManScore = "";
var printSimulationMap = "";

function printForTest () {
    printForTest_ = true;
    printSteps = printSteps_;
    
    printGhostX = "";
    printGhostY = "";
    printGhostDirection = "";
    printGhostEtable = "";
    printGhostEaten = "";
    printPacManX = "";
    printPacManY = "";
    printPacManEaten = "";
    printPacManLives = "";
    printPacManScore = "";
    printSimulationMap = "";
}

var simDisabled = false;

function disableSimulation() { simDisabled = true; }

function doSimulationStep () {

    var ghostX = getGhostX(),
        ghostY = getGhostY(),
        ghostDirection = getGhostDirection(),
        ghostEtable = getGhostEatable(),
        ghostEaten = getGhostEaten(),
        pacManX = PACMAN.getUser().getPosition().x/10 + UNIT,
        pacManY = PACMAN.getUser().getPosition().y/10 + UNIT,
        pacManEaten = PACMAN.getUser().getEaten() === null ? 1 : 0,
        pacManLives = PACMAN.getUser().getLives(),
        pacManScore = PACMAN.getUser().theScore(),
        simulationMap = getSimulationMap();
        
    if (printForTest_) {
        if(printSteps > 0){
            if (ghostX.localeCompare(oldGhostX) !== 0 || ghostY.localeCompare(oldGhostY) !== 0) {
                oldGhostX = ghostX; 
                oldGhostY = ghostY;
                
                printSteps = printSteps - 1;
                printGhostX = addString(printGhostX, ghostX);
                printGhostY = addString(printGhostY, ghostY);
                printGhostDirection = addString(printGhostDirection, ghostDirection);
                printGhostEtable = addString(printGhostEtable, ghostEtable);
                printGhostEaten = addString(printGhostEaten, ghostEaten);
                printPacManX = addString(printPacManX, pacManX);
                printPacManY = addString(printPacManY, pacManY);
                printPacManEaten = addString(printPacManEaten, pacManEaten);
                printPacManLives = addString(printPacManLives, pacManLives);
                printPacManScore = addString(printPacManScore, pacManScore);
                printSimulationMap = addString(printSimulationMap, simulationMap);
            }
        } else {
            printForTest_ = false;
            printString = 
            "ghostX: " + printGhostX + "\n" + 
            "ghostY: " + printGhostY + "\n" + 
            "ghostDirection: " + printGhostDirection + "\n" + 
            "ghostEatable: " + printGhostEtable + "\n" + 
            "ghostEaten: " + printGhostEaten + "\n" + 
            "pacManX: " + printPacManX + "\n" + 
            "pacManY: " + printPacManY + "\n" + 
            "pacManEaten: " + printPacManEaten + "\n" + 
            "pacManLives: " + printPacManLives + "\n" + 
            "pacManScore: " + printPacManScore + "\n" + 
            "map: " + printSimulationMap;
            console.log(printString);
        }
    }

    // console.log(ghostX);
    // console.log(ghostY);
    // console.log(ghostDirection);
    // console.log(ghostEtable);
    // console.log(ghostEaten);
    // console.log(pacManX);
    // console.log(pacManY);
    // console.log(pacManEaten);
    // console.log(pacManLives);
    // console.log(pacManScore);
    // console.log(simulationMap);

    if ( !simDisabled ) {
        setGhostX(ghostX);
        setGhostY(ghostY);
        setGhostDirection(ghostDirection);
        setGhostEatable(ghostEtable);
        setGhostEaten(ghostEaten);
        setPacManX(pacManX);
        setPacManY(pacManY);
        setPacManEaten(pacManEaten);
        setPacManLives(pacManLives);
        setPacManScore(pacManScore);
        setMap(simulationMap);

        execute();

        var newPacManDirection = getNewPacManDirection();

        console.log(newPacManDirection);

        pressKey(newPacManDirection);
    }
}

function addString (oldString, toAdd) {
    if (oldString === "") {
        oldString = toAdd;
    } else {
        oldString = oldString + " tick " + toAdd;
        if (printSteps < 1) {
            oldString = oldString + ";";
        }
    }
    return oldString;
}








