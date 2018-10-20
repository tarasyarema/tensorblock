function register_event(func) {
    var delta_t = Date.now() - START_TIME;
    CURRENT_MOVEMENTS.push([delta_t, func])
}

function register_run(Cube) {
    REGISTERED_MOVEMENTS.push(CURRENT_MOVEMENTS);
    CURRENT_MOVEMENTS = [[Cube.x, Cube.y, Cube.vx, Cube.vy]];
    START_TIME = Date.now();

    // Reset Grabbable objects.
    for (i = 0; i < BAR_SHAPES.length; ++i) {
        let pos = BAR_SHAPES[i];
        BARS[i].position.set(pos[0], pos[1], Cube.z);
        BARS[i].shape.width.set(pos[2]);
        GRABBABLE_OBJECTS[i] = BARS[i];
    }

    GRABBED_OBJECT = null;
}

function enable_event_listener() {
    EVENT_LISTENERS_ENABLED = true;
}

function run_future(Cube, scene) {
    EVENT_LISTENERS_ENABLED = false;
    //If there are NO registered movements then you are a noob and you have lost.
    if (REGISTERED_MOVEMENTS.length === 0) {
        printCombo(0, 0, 0, 'LOSER', scene, 0xffe131);
        return 0;
    }

    // Get last registered movement.
    var last_movements = REGISTERED_MOVEMENTS.pop();

    // Get initial position.
    var pos = last_movements[0];
    Cube.mat.position.set(pos[0], pos[1], 0);
    Cube.x = pos[0];
    Cube.y = pos[1];
    Cube.vx = pos[2];
    Cube.vy = pos[3];

    var func, time_delta = 0;

    for (var i = 1; i < last_movements.length; ++i) {
        time_delta = last_movements[i][0];
        func = last_movements[i][1];
        setTimeout(func, time_delta, Cube);
    }

    setTimeout(enable_event_listener, time_delta)
}