var LOSS = false;
var ENABLE_LOSER = true;

function register_event(func) {
    let delta_t = Date.now() - START_TIME;
    CURRENT_MOVEMENTS.push([delta_t, func])
}

function register_run(Cube) {
    REGISTERED_MOVEMENTS.push(CURRENT_MOVEMENTS);
    CURRENT_MOVEMENTS = [[Cube.x, Cube.y, Cube.vx, Cube.vy]];
    START_TIME = Date.now();

    // Reset Grabbable objects.
    for (let i = 0; i < BAR_SHAPES.length; ++i) {
        let pos = BAR_SHAPES[i];
        BARS[i].position.x = pos[0];
        BARS[i].position.y = pos[1];
        BARS[i].geometry.parameters.width = pos[2];
        GRABBABLE_OBJECTS[i] = BARS[i];
        GRABBABLE_OBJECTS[i].material.color.setHex(BAR_COLOR);

    }

    NON_GRABBABLE_OBJECTS = [];
    GRABBED_OBJECT = null;
}

function enable_event_listener(Cube) {
    EVENT_LISTENERS_ENABLED = true;
    TIME_TRAVEL_ENABLED = true;

    CURRENT_MOVEMENTS = [[Cube.x, Cube.y, Cube.vx, Cube.vy]];
    START_TIME = Date.now();
}

function run_future(Cube, scene, level) {
    EVENT_LISTENERS_ENABLED = false;
    TIME_TRAVEL_ENABLED = false;
    if (GRABBED_OBJECT !== null) {
        scene.remove();
        GRABBED_OBJECT = null;
    }
    START_TIME = Date.now();
    //If there are NO registered movements then you are a noob and you have lost.
    if (REGISTERED_MOVEMENTS.length === 0 && LOSS === false && ENABLE_LOSER) {
        LOSS = true;
        printCombo(mean_x(level), mean_y(level), 5, 'LOSER', scene, 0xffe131);
        return 0;
    }

    // Get last registered movement.
    let last_movements = REGISTERED_MOVEMENTS.pop();

    // Get initial position.
    let pos = last_movements[0];
    Cube.mat.position.set(pos[0], pos[1], 0);
    Cube.x = pos[0];
    Cube.y = pos[1];
    Cube.vx = pos[2];
    Cube.vy = pos[3];

    let func, time_delta = 0;

    for (let i = 1; i < last_movements.length; ++i) {
        time_delta = last_movements[i][0];
        func = last_movements[i][1];
        setTimeout(func, time_delta, Cube);
    }

    setTimeout(enable_event_listener, time_delta, Cube)
}