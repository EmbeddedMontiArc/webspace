var Module = {
  'print': function (text) { console.log('stdout: ' + text) },
  'printErr': function (text) { console.log('stderr: ' + text) },
  onRuntimeInitialized: function () { Module.init(); }
};

function init() {
  Module.init();
}

function execute() {
  Module.execute();
}

  function getNewPacManDirection() {
    return math.format(Module.getNewPacManDirection(), {notation: 'fixed'})
  ;
  }

  function setGhostX(_ghostX) {
  var value = math.eval(_ghostX);
      var lower = math.eval("-1/1 m").toSI().toNumber();
      var upper = math.eval("19/1 m").toSI().toNumber();

  if (value === undefined) {
    throw "ghostX: Could not evaluate input";
  }

    //check dimension
    var dim = math.matrix([4]);
    if (!math.deepEqual(math.size(value), dim)) {
      throw "ghostX: Input has dimension " + math.size(value) + " but expected " + dim;
    }

    var array = [];
  for (var i0 = 0; i0 < 4; i0++) {
      var e = value.get([i0]);

    //check unit
    var expectedUnit = math.eval("m");
    if (math.typeof(expectedUnit) !== math.typeof(e) || !expectedUnit.equalBase(e)) {
      throw "ghostX: Expected unit m";
    }
        var e_num = e.toSI().toNumber();
    //check range
  if (math.smaller(e_num, lower)) {
        throw "ghostX: Value " + e_num + " out of range";
      }
  if (math.larger(e_num, upper)) {
        throw "ghostX: Value " + e_num + " out of range";
      }
      array  [i0]
 = e_num;
  }
    Module.setGhostX(array);
}
  function setGhostY(_ghostY) {
  var value = math.eval(_ghostY);
      var lower = math.eval("0/1 m").toSI().toNumber();
      var upper = math.eval("21/1 m").toSI().toNumber();

  if (value === undefined) {
    throw "ghostY: Could not evaluate input";
  }

    //check dimension
    var dim = math.matrix([4]);
    if (!math.deepEqual(math.size(value), dim)) {
      throw "ghostY: Input has dimension " + math.size(value) + " but expected " + dim;
    }

    var array = [];
  for (var i0 = 0; i0 < 4; i0++) {
      var e = value.get([i0]);

    //check unit
    var expectedUnit = math.eval("m");
    if (math.typeof(expectedUnit) !== math.typeof(e) || !expectedUnit.equalBase(e)) {
      throw "ghostY: Expected unit m";
    }
        var e_num = e.toSI().toNumber();
    //check range
  if (math.smaller(e_num, lower)) {
        throw "ghostY: Value " + e_num + " out of range";
      }
  if (math.larger(e_num, upper)) {
        throw "ghostY: Value " + e_num + " out of range";
      }
      array  [i0]
 = e_num;
  }
    Module.setGhostY(array);
}
  function setGhostDirection(_ghostDirection) {
  var value = math.eval(_ghostDirection);
      var lower = 0/1;
      var upper = 3/1;

  if (value === undefined) {
    throw "ghostDirection: Could not evaluate input";
  }

    //check dimension
    var dim = math.matrix([4]);
    if (!math.deepEqual(math.size(value), dim)) {
      throw "ghostDirection: Input has dimension " + math.size(value) + " but expected " + dim;
    }

    var array = [];
  for (var i0 = 0; i0 < 4; i0++) {
      var e = value.get([i0]);

        var e_num = e;
    //check range
  if (math.smaller(e_num, lower)) {
        throw "ghostDirection: Value " + e_num + " out of range";
      }
  if (math.larger(e_num, upper)) {
        throw "ghostDirection: Value " + e_num + " out of range";
      }
      array  [i0]
 = e_num;
  }
    Module.setGhostDirection(array);
}
  function setGhostEatable(_ghostEatable) {
  var value = math.eval(_ghostEatable);

  if (value === undefined) {
    throw "ghostEatable: Could not evaluate input";
  }

    //check dimension
    var dim = math.matrix([4]);
    if (!math.deepEqual(math.size(value), dim)) {
      throw "ghostEatable: Input has dimension " + math.size(value) + " but expected " + dim;
    }

    var array = [];
  for (var i0 = 0; i0 < 4; i0++) {
      var e = value.get([i0]);

        var e_num = e;
      array  [i0]
 = e_num;
  }
    Module.setGhostEatable(array);
}
  function setGhostEaten(_ghostEaten) {
  var value = math.eval(_ghostEaten);

  if (value === undefined) {
    throw "ghostEaten: Could not evaluate input";
  }

    //check dimension
    var dim = math.matrix([4]);
    if (!math.deepEqual(math.size(value), dim)) {
      throw "ghostEaten: Input has dimension " + math.size(value) + " but expected " + dim;
    }

    var array = [];
  for (var i0 = 0; i0 < 4; i0++) {
      var e = value.get([i0]);

        var e_num = e;
      array  [i0]
 = e_num;
  }
    Module.setGhostEaten(array);
}
  function setPacManX(_pacManX) {
  var value = math.eval(_pacManX);
      var lower = math.eval("-1/1 m").toSI().toNumber();
      var upper = math.eval("19/1 m").toSI().toNumber();

  if (value === undefined) {
    throw "pacManX: Could not evaluate input";
  }

  //check type
  if (math.typeof(value) !== "Unit") {
    throw "pacManX: Expected type Unit";
  }
    //check unit
    var expectedUnit = math.eval("m");
    if (math.typeof(expectedUnit) !== math.typeof(value) || !expectedUnit.equalBase(value)) {
      throw "pacManX: Expected unit m";
    }
      var value_num = value.toSI().toNumber();
    //check range
  if (math.smaller(value_num, lower)) {
        throw "pacManX: Value " + value_num + " out of range";
      }
  if (math.larger(value_num, upper)) {
        throw "pacManX: Value " + value_num + " out of range";
      }
    Module.setPacManX(value_num);
}
  function setPacManY(_pacManY) {
  var value = math.eval(_pacManY);
      var lower = math.eval("0/1 m").toSI().toNumber();
      var upper = math.eval("21/1 m").toSI().toNumber();

  if (value === undefined) {
    throw "pacManY: Could not evaluate input";
  }

  //check type
  if (math.typeof(value) !== "Unit") {
    throw "pacManY: Expected type Unit";
  }
    //check unit
    var expectedUnit = math.eval("m");
    if (math.typeof(expectedUnit) !== math.typeof(value) || !expectedUnit.equalBase(value)) {
      throw "pacManY: Expected unit m";
    }
      var value_num = value.toSI().toNumber();
    //check range
  if (math.smaller(value_num, lower)) {
        throw "pacManY: Value " + value_num + " out of range";
      }
  if (math.larger(value_num, upper)) {
        throw "pacManY: Value " + value_num + " out of range";
      }
    Module.setPacManY(value_num);
}
  function setPacManEaten(_pacManEaten) {
  var value = math.eval(_pacManEaten);

  if (value === undefined) {
    throw "pacManEaten: Could not evaluate input";
  }

  //check type
  if (math.typeof(value) !== "number") {
    throw "pacManEaten: Expected type number";
  }
      var value_num = value;
    Module.setPacManEaten(value_num);
}
  function setPacManLives(_pacManLives) {
  var value = math.eval(_pacManLives);
      var lower = 0/1;

  if (value === undefined) {
    throw "pacManLives: Could not evaluate input";
  }

  //check type
  if (math.typeof(value) !== "number") {
    throw "pacManLives: Expected type number";
  }
      var value_num = value;
    //check range
  if (math.smaller(value_num, lower)) {
        throw "pacManLives: Value " + value_num + " out of range";
      }
    Module.setPacManLives(value_num);
}
  function setPacManScore(_pacManScore) {
  var value = math.eval(_pacManScore);
      var lower = 0/1;

  if (value === undefined) {
    throw "pacManScore: Could not evaluate input";
  }

  //check type
  if (math.typeof(value) !== "number") {
    throw "pacManScore: Expected type number";
  }
      var value_num = value;
    //check range
  if (math.smaller(value_num, lower)) {
        throw "pacManScore: Value " + value_num + " out of range";
      }
    Module.setPacManScore(value_num);
}
  function setMap(_map) {
  var value = math.eval(_map);

  if (value === undefined) {
    throw "map: Could not evaluate input";
  }

    //check dimension
    var dim = math.matrix([22, 19]);
    if (!math.deepEqual(math.size(value), dim)) {
      throw "map: Input has dimension " + math.size(value) + " but expected " + dim;
    }

    var array = [];
  for (var i0 = 0; i0 < 22; i0++) {
    array  [i0]
 = [];
  for (var i1 = 0; i1 < 19; i1++) {
      var e = value.get([i0,i1]);

        var e_num = e;
      array  [i0][i1]
 = e_num;
  }
  }
    Module.setMap(array);
}

