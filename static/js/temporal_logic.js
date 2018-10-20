function register_event(func) {
    var delta_t = Date.now() - START_TIME;
    CURRENT_MOVEMENTS.push([delta_t, func])
}

function register_run(Cube) {
    REGISTERED_MOVEMENTS.push(CURRENT_MOVEMENTS);
    CURRENT_MOVEMENTS = [[Cube.x, Cube.y]]
}

function run_future(Cube, scene) {
    //If there are NO registered movements then you are a noob and you have lost.
    if (REGISTERED_MOVEMENTS.length === 0) {
        printCombo(0, 0, 0, 'LOSER', scene, 0xffe131);
        return 0
    }

    // Get last registered movement.
    var last_movements = REGISTERED_MOVEMENTS.pop();

    // Get initial position.
    var pos = last_movements[0];
    var x = pos[0];
    var y = pos[1];
    Cube.mat.position.set(x, y, 0);

    var aux;
    var time_delta;
    var func;
    for (var i = 1; i < last_movements.length; i++) {
        aux = last_movements[i];
        time_delta = aux[0];
        func = aux[1];
        setTimeout(func, time_delta, Cube);
    }
}