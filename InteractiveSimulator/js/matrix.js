function printMatrixAsImage(id, portValue, svgTextElement, colormapping) {
    var textNode = svgTextElement.childNodes[0];
    textNode.nodeValue = "[matrix]";

    svgTextElement.addEventListener('mouseover', mouseOverFunction);
    var valueMatrix = portValue.replace("[", "").replace("]", "").replace(/ /g, '').split(";");

    var matrixHeight = valueMatrix.length;
    var matrixWidth = valueMatrix[0].split(",").length;
    var scale = 6;

    var canvas = getCanvas(id, svgTextElement, matrixHeight, matrixWidth, scale);
    putPortValueIntoCanvas(canvas, valueMatrix, matrixWidth, matrixHeight, scale, colormapping);
}

function putPortValueIntoCanvas(canvas, valueMatrix, matrixWidth, matrixHeight, scale, colormapping) {
    var ctx = canvas.getContext("2d");
    var imgData = ctx.createImageData(matrixWidth, matrixHeight);
    for (var y = 0; y < matrixHeight; y += 1) {
        var valueArray = valueMatrix[y].split(",");
        for (var x = 0; x < matrixWidth; x += 1) {
            var i = y * matrixWidth * 4 + x * 4;
            setValue(imgData, i, valueArray[x], colormapping);
        }
    }
    imgData = scaleImageData(ctx, imgData, scale);
    ctx.canvas.width = scale * matrixWidth;
    ctx.canvas.height= scale * matrixHeight;
    ctx.putImageData(imgData, 0, 0);
}

function scaleImageData(ctx, imageData, scale) {
    var scaled = ctx.createImageData(imageData.width * scale, imageData.height * scale);
    var subLine = ctx.createImageData(scale, 1).data;
    for (var row = 0; row < imageData.height; row++) {
        for (var col = 0; col < imageData.width; col++) {
            var sourcePixel = imageData.data.subarray(
                (row * imageData.width + col) * 4,
                (row * imageData.width + col) * 4 + 4
            );
            for (var x = 0; x < scale; x++) subLine.set(sourcePixel, x*4)
            for (var y = 0; y < scale; y++) {
                var destRow = row * scale + y;
                var destCol = col * scale;
                scaled.data.set(subLine, (destRow * scaled.width + destCol) * 4)
            }
        }
    }

    return scaled;
}

function setValue(imgData, i, value, colormapping) {
    var color = colormapping(value);
    for (var j = 0; j < 3; j++)
        imgData.data[i + j] = color[j];
    imgData.data[i + 3] = 255;
}

function getCanvas(id, svgTextElement, matrixHeight, matrixWidth, scale) {
    var vf = document.getElementById("visualisationFrame").contentWindow;
    var canvas = vf.document.getElementById(id);
    if (canvas == null) {
        var body = vf.document.body,
            html = vf.document.documentElement;
        var height = Math.max( body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight );

        var canvas = createCanvas(id, svgTextElement, height, matrixHeight, matrixWidth, scale);
    }
    return canvas;
}

function createCanvas(id, svgTextElement, height, matrixHeight, matrixWidth, scale) {
    var vf = document.getElementById("visualisationFrame").contentWindow;
    var canvas = vf.document.createElement("canvas");
    canvas.id = id;
    var container = vf.document.createElement("div");
    container.id = id.replace("canvas", "container");
    container.addEventListener('mouseout', mouseOutFunction);
    container.appendChild(canvas);
    vf.document.body.appendChild(container);

    var top = svgTextElement.getAttribute("y");
    if (top + 50 > height)
        top = top - 50;
    var styleCanvas =
        "position: relative; ";
    var styleContainer =
        "position: absolute; " +
        "left: " + svgTextElement.getAttribute("x") + "px; " +
        "top: " + top + "px; " +
        "z-index: -10; " +
        "height: " + scale * matrixHeight + "px; " +
        "width:  " + scale * matrixWidth +  "px; " +
        "display: none; ";
    canvas.style = styleCanvas;
    container.style = styleContainer;
    return canvas;
}

function mouseOverFunction() {
    var vf = document.getElementById("visualisationFrame").contentWindow;
    var container = vf.document.getElementById(this.id.replace("porttype", "container"));
    var canvas = vf.document.getElementById(this.id.replace("porttype", "canvas"));
    container.style.zIndex = "1";
    $(container).fadeIn( "slow", function () {
        container.style.zIndex = "1";
    } );
    $(canvas).fadeIn( "slow" );
}

function mouseOutFunction() {
    var vf = document.getElementById("visualisationFrame").contentWindow;
    var container = vf.document.getElementById(this.id.replace("porttype", "container"));
    var canvas = vf.document.getElementById(this.id.replace("porttype", "canvas"));
    $(container).fadeOut( "slow", function () {
        container.style.zIndex = "-10";
    });
    $(canvas).fadeOut( "slow" );
}

function printMatrix(id, portValue, svgTextElement) {
    var textNode = svgTextElement.childNodes[0];
    textNode.nodeValue = "[matrix]";
    svgTextElement.addEventListener('mouseover', mouseOverFunction);

    var valueMatrix = portValue.replace("[", "").replace("]", "").replace(/ /g, '').split(";");

    var matrixHeight = valueMatrix.length;
    var matrixWidth = valueMatrix[0].split(",").length;
    var scale = 15;

    var canvas = getCanvas(id, svgTextElement, matrixHeight, matrixWidth, scale);

    $(canvas).css('background-color', 'rgba(158,167,184,1');

    var ctx = canvas.getContext("2d");
    ctx.canvas.width = scale * matrixWidth + 100;
    ctx.canvas.height= scale * matrixHeight;
    ctx.font = scale + "px Arial";

    var text = beautifyMatrix(portValue).split("<br>");
    for(var i = 0; i < text.length; i++)
        ctx.fillText(text[i], 10, i*scale);
}

function beautifyMatrix(mat) {
    var res = "";
    var valueMatrix = mat.replace("[", "").replace("]", "").split(";");
    for (var i = 0; i < valueMatrix.length; i++){
        res += "[" + valueMatrix[i] + "]";
        if ((i + 1) < valueMatrix.length)
            res += "<br>";
    }
    return res;
}