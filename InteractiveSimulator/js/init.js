var gameframe;

var loaded = 0;
$('iframe').each(function () {
    loaded++;
    if (loaded === 3)
        initDebug();
});
$(document).ready(function () {
    loaded++;
    if (loaded === 3)
        initDebug();
});

document.getElementById('gameFrame').src = gameFrameSrc;
document.getElementById('visualisationFrame').src = visualisationFrameSrc;

function initDebug() {
    customInit();
    gameframe = document.getElementById("gameFrame").contentWindow;
    $(gameframe).on("mousemove", function (event) {
        move(event);
    });
    $(gameframe).on("mouseup", function () {
        barclicked = false;
    })
}

$('#visualisationFrame').on('load', function () {
    setTimeout(function () {
        var vf = document.getElementById("visualisationFrame").contentWindow;
        var svg = vf.document.getElementById('svg').contentWindow;
        $(vf).on("mousemove", function (event) {
            move(event);
        });
        $(svg).on("mousemove", function (event) {
            move(event);
        });
        $(vf).on("mouseup", function () {
            barclicked = false;
        });
        $(svg).on("mouseup", function () {
            barclicked = false;
        });
    }, 50);
});

var barclicked = false;
$('#bar').on('mousedown', function (event) {
    barclicked = true;
    move(event);
});
$(document).on('mouseup', function () {
    barclicked = false;
});
$(document).on('mousemove', function (event) {
    move(event);
});

function convertIntoVw(width) {
    return width*(100 / [document.documentElement.clientWidth]);
}

function move(event) {
    if(barclicked) {
        var pos = convertIntoVw(event.screenX);
        $('#bar').css('left', pos - 0.35 + "vw");
        $('#gameFrame').css('width', pos - 0.35 + "vw");
        $('#visualisationFrame').css('left', pos + 0.35 + "vw");
        $('#visualisationFrame').css('width', 100 - pos - 0.7 + "vw");
    }
}