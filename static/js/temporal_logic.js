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
        GRABBABLE_OBJECTS[i] = BAR_SHAPES[i];
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

var last_movements = null;
var next_last_movement;
var current_future_frame;
function run_future(Cube, level) {
    EVENT_LISTENERS_ENABLED = false;
    TIME_TRAVEL_ENABLED = false;
    if (GRABBED_OBJECT !== null) {
        GRABBED_OBJECT = null;
    }
    CURRENT_TIME = 0;
    //If there are NO registered movements then you are a noob and you have lost.
    if (REGISTERED_MOVEMENTS.length === 0 && LOSS === false && ENABLE_LOSER) {
        LOSS = true;
        doBigLettersBuffer("Loser", hexToRGB(0xffe131), mean_x(level), mean_y(level), 5);
        setTimeout(destroy_scene_and_start_game, 2000, level);
        return 0;
    }

    // Reenable portal
    disabled_portals.pop();
    updated_portals = true;
    
    // Get last registered movement. 
    last_movements = REGISTERED_MOVEMENTS.pop();
    console.log(last_movements.length);

    // Get initial position.
    let pos = last_movements[0];
    Cube.x = pos[0];
    Cube.y = pos[1];
    Cube.vx = pos[2];
    Cube.vy = pos[3];
    key_down_left = false;
    key_down_right = false;
    key_down_up = false;
    
    next_last_movement = 1;
    current_future_frame = 0;
    return 1;
}

function run_future_frame(Cube){
    let time_delta = last_movements[next_last_movement][0];
    while(time_delta == CURRENT_TIME){
        last_movements[next_last_movement][1](Cube);
        next_last_movement++;
        if(next_last_movement == last_movements.length){
            enable_event_listener(Cube);
            return false;
        }
        
        time_delta = last_movements[next_last_movement][0];
    }
    return true;
}