function register_event(func) {
    var delta_t = Date.now() - START_TIME;
    CURRENT_MOVEMENTS.push([delta_t, func])
}

function register_run(Cube) {
    REGISTERED_MOVEMENTS.push(CURRENT_MOVEMENTS);
    CURRENT_MOVEMENTS = [[Cube.x, Cube.y, Cube.vx, Cube.vy]];
    START_TIME = Date.now();
}

function enable_event_listener(){
    EVENT_LISTENERS_ENABLED = true;
}

function run_future(Cube, scene) {
    EVENT_LISTENERS_ENABLED = false;
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
    var vx = pos[2];
    var vy = pos[3];
    Cube.mat.position.set(x, y, 0);
    Cube.x = x;
    Cube.y = y;
    Cube.vx = vx;
    Cube.vy = vy;

    var aux;
    var time_delta = 0;
    var func;
    for (var i = 1; i < last_movements.length; i++) {
        aux = last_movements[i];
        time_delta = aux[0];
        func = aux[1];
        setTimeout(func, time_delta, Cube);
    }
    setTimeout(enable_event_listener, time_delta)
}