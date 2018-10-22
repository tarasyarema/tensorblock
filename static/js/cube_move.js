const CUBE_EDGE = 2;
const EPSILON = 0.7;
//const HORIZONTAL_ACC = 0.2;
const SPEED = 0.4;
const VERTICAL_SPEED = 1.2;
const GRAVITY = -0.08;
const CUBE_COLOR = 0xff710d;
const MIN_HEIGHT = -100;

var WIN = false;
var TIME;
var REGISTERED_MOVEMENTS = [];
var CURRENT_MOVEMENTS = [];
var CURRENT_TIME;
var MIN_INTER_TRAVEL_TIME = 2000;
var EVENT_LISTENERS_ENABLED = true;
var TIME_TRAVEL_ENABLED = true;
var GRABBABLE_OBJECTS = [];
var NON_GRABBABLE_OBJECTS = [];
var GRABBED_OBJECT = null;

var left_down = false;
var right_down = false;
var up_down = false;
function key_down_left(Cube){
    left_down = true;
}

function key_down_right(Cube){}
    right_down = true;
}

function key_down_up(Cube) {
    up_down = true;
}

/**
 * react to key pressed.
 */
function key_down_listener(event, Cube) {
    // get key pressed.
    let key = event.key;

    // if left arrow key is pressed then , depending on 'ChangeYearOnKeyPress'
    // variable value we show previous page of bookmarks or of backgrounds
    if (key === "ArrowLeft" && EVENT_LISTENERS_ENABLED) {
        register_event(key_down_left);
        key_down_left(Cube);
    }

    // if right arrow key is pressed then , depending on 'ChangeYearOnKeyPress'
    // variable value we show next page of bookmarks or of backgrounds
    else if (key === "ArrowRight" && EVENT_LISTENERS_ENABLED) {
        register_event(key_down_right);
        key_down_right(Cube);
    }

    // if right arrow key is pressed then , depending on 'ChangeYearOnKeyPress'
    // variable value we show next page of bookmarks or of backgrounds
    else if (key === "ArrowUp" && EVENT_LISTENERS_ENABLED) {
        register_event(key_down_up);
        key_down_up(Cube)
    }

    // if right arrow key is pressed then , depending on 'ChangeYearOnKeyPress'
    // variable value we show next page of bookmarks or of backgrounds
    else if (key === " " && EVENT_LISTENERS_ENABLED) {
        register_event(key_down_space);
        key_down_space(Cube)
    }
}


function key_up_left(Cube) {
    left_down = false;
}
function key_up_right(Cube) {
    right_down = false;
}
function key_up_up(Cube) {
    up_down = false;
}

/**
 * react to key pressed.
 */
function key_up_listener(event, Cube) {
    let key = event.key;
    // if left arrow key is pressed then , depending on 'ChangeYearOnKeyPress'
    // variable value we show previous page of bookmarks or of backgrounds
    if (key === "ArrowLeft"  && EVENT_LISTENERS_ENABLED) {
        register_event(key_up_left);
        key_up_left(Cube)
    }
    if (key === "ArrowRight"  && EVENT_LISTENERS_ENABLED) {
        register_event(key_up_right);
        key_up_right(Cube)
    }
    if (key === "ArrowUp"  && EVENT_LISTENERS_ENABLED) {
        register_event(key_up_up);
        key_up_up(Cube)
    }
}

function cube_can_move(level, Cube, v, eps){ // Says if Cube can move v from its current position
    let x = Cube.x + v[0];
    let y = Cube.y + v[1];
    let x0 = x - Cube.d/2 + eps[0];
    let x1 = x + Cube.d/2 - eps[0];
    let y0 = y - Cube.d/2 + eps[1];
    let y1 = y + Cube.d/2 - eps[1];
    
    let platforms = level.platforms;
    for (let i = 0; i < platforms.length; ++i) {
        let platform = platforms[i];
        let xmin = platform[0] - platform[2]/2;
        let xmax = platform[0] + platform[2]/2;
        let ymax = platform[1] + PLATFORM_Y/2;
        let ymin = platform[1] - PLATFORM_Y/2;

        // Check if the cube and the platform would overlap
        let overlap_x = x0 < xmax && x1 > xmin;
        let overlap_y = y0 < ymax && y1 > ymin;
        
        if (overlap_x && overlap_y) {
            return false;
        }
    }
    
    let ver_platforms = level.ver_bar;
    if (ver_platforms !== null) {
        for (let i = 0; i < ver_platforms.length; ++i) {
            let platform = platforms[i];
            let xmin = platform[0] - PLATFORM_Y / 2;
            let xmax = platform[0] + PLATFORM_Y / 2;
            let ymin = platform[1] - platform[2] / 2;
            let ymax = platform[1] + platform[2] / 2;

            // Check if the cube and the platform would overlap
            let overlap_x = x0 <= xmax && x1 >= xmin;
            let overlap_y = y0 <= ymax && y1 >= ymin;

            if (overlap_x && overlap_y) {
                return false;
            }
        }
    }

    for (let i = 0; i < NON_GRABBABLE_OBJECTS.length; ++i) {
        let bar = NON_GRABBABLE_OBJECTS[i];
        let xmin = bar.position.x - bar.geometry.parameters.width / 2;
        let xmax = bar.position.x + bar.geometry.parameters.width / 2;
        let ymin = bar.position.y - BAR_Y / 2;
        let ymax = bar.position.y + BAR_Y / 2;
        
        // Check if the cube and the object would overlap
        let overlap_x = x0 <= xmax && x1 >= xmin;
        let overlap_y = y0 <= ymax && y1 >= ymin;
        
        if (overlap_x && overlap_y) {
            return false;
        }
    }
    
    return true;
}

let running_future = false;
function update_cube(Cube, level, scene){
    if (Cube.y <= MIN_HEIGHT && (!LOSS && !WIN)) {
        run_future(Cube, scene, level);
        running_future = true;
    }
    if(running_future){
        running_Future = run_future_frame(Cube);
    }

    let is_on_platform = false;
    
    if(left_down)
        Cube.vx = -SPEED;
    else if(right_down)
        Cube.vx = SPEED;
    else
        Cube.vx = 0;
    if(up_down){
        if(Cube.on_platform)
            Cube.vy = VERTICAL_SPEED;
    }
    
    if(cube_can_move(level, Cube, [Cube.vx, 0], [0, 0.01])){
       Cube.x += Cube.vx;
    }else{
        Cube.vx = 0;
    }
    if(cube_can_move(level, Cube, [0, Cube.vy], [0.01, 0])){
       Cube.y += Cube.vy;
    }else{
        if(Cube.vy < 0)
            is_on_platform = true;
        Cube.vy = 0;
    }

    let portals = level.portals;
    if (portals !== null){
        for (let i=0; i< portals.length; i++){
            let portal = portals[i];
            let xmin = portal[0] - PORTAL_X / 2;
            let xmax = portal[0] + PORTAL_X / 2;
            let ymin = portal[1] - PORTAL_Y / 2;
            let ymax = portal[1] + PORTAL_Y / 2;


            if (Cube.x - Cube.d / 2 <= xmax && Cube.x + Cube.d / 2 >= xmin &&
                Cube.y - Cube.d / 2 <= ymax && Cube.y + Cube.d / 2 >= ymin) {
                if (CURRENT_TIME >= MIN_INTER_TRAVEL_TIME && TIME_TRAVEL_ENABLED) {
                    register_run(Cube);
                }
            }
        }
    }

    //Store if the cube is on a platform or not.
    Cube.on_platform = is_on_platform;

    if (is_on_platform)
        Cube.vy = 0;
    else {
        Cube.vy += GRAVITY;
        Cube.vy = Math.min(Cube.vy, VERTICAL_SPEED);
        Cube.vy = Math.max(Cube.vy, -VERTICAL_SPEED);
    }

    Cube.mat.position.set(Cube.x, Cube.y, Cube.z);

    if (GRABBED_OBJECT !== null)
        GRABBED_OBJECT.position.set(Cube.x, Cube.y + Cube.d/2+ BAR_Y/2, Cube.z);

    let exit = level.exit;
    let xmin = exit[0] - EXIT_X/2;
    let xmax = exit[0] + EXIT_X/2;
    let ymin = exit[1] + PLATFORM_Y / 2;
    let ymax = exit[1] + EXIT_Y + PLATFORM_Y / 2;

    if (Cube.x-Cube.d/2 < xmax && Cube.x + Cube.d/2 > xmin &&
        Cube.y-Cube.d/2 < ymax && Cube.y + Cube.d/2 > ymin) {
        if (REGISTERED_MOVEMENTS.length === 0 && WIN === false) {
            WIN = true;
            TIME = START_TIME;
            printCombo(mean_x(level), mean_y(level), 5, 'WINNER', scene, 0x31ffe1);
            Cookies.remove('Level' + level.id);
            Cookies.set('Level' + level.id, 'true');
        }
    }
    
    
    CURRENT_TIME++;
}

function start_game(level){
    // Initializing Scene
    let aux = setup_level(level);
    let scene = aux.scene;
    let camera = aux.camera;
    let renderer = aux.renderer;
    let update_blockchain = aux.update_blockchain;
    let update_tensorflow = aux.update_tensorflow;
    let update_p_adics = aux.update_p_adics;
    let update_galois = aux.update_galois;
    let update_hilbert = aux.update_hilbert;
    let update_turing = aux.update_turing;
    let update_euler = aux.update_euler;
    let update_gauss = aux.update_gauss;
    let update_erdos = aux.update_erdos;
    let update_wolfram = aux.update_wolfram;

    // Initilize grabbable objects.
    for (let i = 0; i < BARS.length; i++) {
        GRABBABLE_OBJECTS[i] = BARS[i];
    }

    // Define cube and set initial position.
    let material = new THREE.MeshPhongMaterial({color: CUBE_COLOR});
    let geometry = new THREE.BoxGeometry(CUBE_EDGE, CUBE_EDGE, CUBE_EDGE);
    for(let i = 0; i < geometry.faces.length; i++){
        geometry.faces[i].color.setHex(Math.random() * 0xaa710d);
    }
    let Cube = {
        mat: new THREE.Mesh(geometry, material),
        x: level.init[0],
        y: level.init[1] + CUBE_EDGE/2+PLATFORM_Y/2,
        z: 0,
        on_platform: false,
        vx: 0,
        vy: 0,
        vz: 0,
        d: CUBE_EDGE };

    //Set initial cube position and make fancy shadowing.
    Cube.mat.position.set(Cube.x, Cube.y, Cube.z);
    Cube.mat.castShadow = true;
    Cube.mat.receiveShadow = false;
    scene.add(Cube.mat);

    CURRENT_TIME = 0;
    CURRENT_MOVEMENTS.push([Cube.x, Cube.y, Cube.vx, Cube.vy]);

    //Add event listeners for cube moving.
    document.addEventListener('keydown', function (event){
        key_down_listener(event, Cube);
    });

    document.addEventListener('keyup', function (event){
        key_up_listener(event, Cube);
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    // Creating render function.
    let render = function () {
        $('#time').html("<b>Timeline(" + String(-REGISTERED_MOVEMENTS.length) + ')</b>');
        requestAnimationFrame(render);
        update_cube(Cube, level, scene, CUBE_COLOR);
        update_blockchain();
        update_tensorflow();
        update_p_adics();
        update_galois();
        update_hilbert();
        update_turing();
        update_euler();
        update_gauss();
        update_erdos();
        update_wolfram();
        renderer.render(scene, camera);
    };

    render();

    return Cube;
}