var LOSS = false;
var ENABLE_LOSER = true;

function register_event(func) {
    let delta_t = CURRENT_TIME;
    CURRENT_MOVEMENTS.push([delta_t, func])
}

function register_run(Cube) {
    REGISTERED_MOVEMENTS.push(CURRENT_MOVEMENTS);
    CURRENT_MOVEMENTS = [[Cube.x, Cube.y, Cube.vx, Cube.vy]];
    CURRENT_TIME = 0;

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
    CURRENT_TIME = 0;
}

let last_movements = null;
let next_last_movement;
let current_future_frame;
function run_future(Cube, scene, level) {
    EVENT_LISTENERS_ENABLED = false;
    TIME_TRAVEL_ENABLED = false;
    if (GRABBED_OBJECT !== null) {
        scene.remove();
        GRABBED_OBJECT = null;
    }
    CURRENT_TIME = 0;
    //If there are NO registered movements then you are a noob and you have lost.
    if (REGISTERED_MOVEMENTS.length === 0 && LOSS === false && ENABLE_LOSER) {
        LOSS = true;
        printCombo(mean_x(level), mean_y(level), 5, 'LOSER', scene, 0xffe131);
        return 0;
    }

    // Get last registered movement. 
    last_movements = REGISTERED_MOVEMENTS.pop();

    // Get initial position.
    let pos = last_movements[0];
    Cube.mat.position.set(pos[0], pos[1], 0);
    Cube.x = pos[0];
    Cube.y = pos[1];
    Cube.vx = pos[2];
    Cube.vy = pos[3];
    
    next_last_movement = 1;
    current_future_frame = 0;
}

function run_future_frame(Cube){
    let i = next_last_movement;
    let time_delta = last_movements[i][0];
    if(time_delta == CURRENT_TIME){
        last_movements[i][1]();
        i++;
        if(i == last_movements.length){
            enable_event_listener();
            return false;
        }
    }
    return true;
}