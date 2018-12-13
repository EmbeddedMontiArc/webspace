var debugModeEntered = false;
$("button").button();
$("#debugMode").click(function (event) {
    if (!debugModeEntered && !gameIsPaused()) {
        gameEnterDebugMode();
        enterDebugMode();
        debugModeEntered = true;
    } else {
        updateDebugMode();
    }
    updateInputText();
    updateInputMax();
});
$("#endDebugMode").click(function (event) {
    if (debugModeEntered) {
        gameLeaveDebugMode();
        debugModeEntered = false;
    }
});
$("#nextStep").click(function (event) {
    if (debugModeEntered) {
        if (currentIteration == getMaxIteration()) {
            gameProceedOneIteration();
        }
        nextDebugStep();
        updateInputText();
        updateInputMax();
    }
});
$("#previousStep").click(function (event) {
    if (debugModeEntered) {
        previousDebugStep();
        updateInputText();
    }
});
$("#liveValues").click(function (event) {
    if (!debugModeEntered)
        gameToggleSVGUpdateCallOnIteration();
});
$("#enterIterationInput").on("keydown", function search(e) {
    if (debugModeEntered) {
        if (e.keyCode == 13) {
            if ($(this).val() >= 0 && $(this).val() <= getMaxIteration()) {
                currentIteration = $(this).val();
                updateSVG(currentIteration);
                updateInputText();
                updateInputMax();
            }
        }
    }
});

function updateInputText() {
    $('#enterIterationText').text("Iteration (Current: " + currentIteration + ", Max: " + getMaxIteration() + ")");
}

function updateInputMax() {
    document.getElementById('enterIterationInput').max = getMaxIteration();
}

$('#gamepause').click(function (event) {
    gameTogglePause();
});

$('#gamemute').click(function (event) {
    if (!debugModeEntered) {
        gameToggleMute();
    }
});

$('#gamefaster').click(function (event) {
    if (!debugModeEntered) {
        gameFaster();
    }
});

$('#gameslower').click(function (event) {
    if (!debugModeEntered) {
        gameSlower();
    }
});

$('#visualisationFrame').on('load', function () {
    if (debugModeEntered)
        setTimeout(updateSVG(currentIteration), 50);
});