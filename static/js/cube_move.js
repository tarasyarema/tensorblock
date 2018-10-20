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
var START_TIME;
var MIN_INTER_TRAVEL_TIME = 2000;
var EVENT_LISTENERS_ENABLED = true;
var GRABBABLE_OBJECTS = [];
var GRABBED_OBJECT = null;


function key_down_left(Cube){
    //if (Cube.on_platform) {
        Cube.vx = -SPEED;
        //Cube.vx = Math.max(Cube.vx, -SPEED);
    //}
}

function key_down_right(Cube){
    //if (Cube.on_platform) {
        Cube.vx = SPEED;
        //Cube.vx = Math.min(Cube.vx, SPEED);
    //}
}

function key_down_up(Cube) {
    if (Cube.on_platform) {
        Cube.vy = VERTICAL_SPEED;
    }
}

/**
 * react to key pressed.
 */
function key_down_listener(event, Cube) {
    var key;
    pingu_index = 0;
    
    // get key pressed.
    key = event.key;
    console.log(key);

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


function arrow_up(Cube) {
    //if (Cube.on_platform) {
        Cube.vx = 0;
    //}
}

/**
 * react to key pressed.
 */
function key_up_listener(event, Cube) {
    let key;
    // get key pressed.
    key = event.key;
    // if left arrow key is pressed then , depending on 'ChangeYearOnKeyPress'
    // variable value we show previous page of bookmarks or of backgrounds
    if ((key === "ArrowLeft" || key === "ArrowRight")  && EVENT_LISTENERS_ENABLED) {
        register_event(arrow_up);
        arrow_up(Cube)
    }
}

function update_cube(Cube, level, scene){
    let platforms = level.platforms;
    Cube.x += Cube.vx;
    Cube.y += Cube.vy;

    if (Cube.y <= MIN_HEIGHT)
        run_future(Cube);

    let is_on_platform = false;

    for (let i = 0; i < platforms.length; ++i) {
        let platform = platforms[i];
        let xmin = platform[0] - platform[2]/2;
        let xmax = platform[0] + platform[2]/2;
        let ymax = platform[1] + PLATFORM_Y/2;
        let ymin = platform[1] - PLATFORM_Y/2;

        if (Cube.x-Cube.d/2 <= xmax && Cube.x + Cube.d/2 >= xmin) {
            if (Cube.y - Cube.d / 2 <= ymax + EPSILON && Cube.y +Cube.d/2 >= ymin) {
                if (Cube.vy <= 0) {
                    is_on_platform = true;
                    Cube.y = ymax + Cube.d / 2;
                } else {
                    if (is_on_platform === false) {
                        Cube.y = ymin - Cube.d / 2;
                        Cube.vy = 0;
                    }
                }
            }
            else if (Math.max(Cube.y - Cube.d/2, ymin) <= Math.min(Cube.y + Cube.d/2, ymax)) {
                /**if (Cube.vx >= 0) {
                    Cube.x = xmin - Cube.d / 2;
                }
                 else if (Cube.vx < 0) {
                    Cube.x = xmax + Cube.d / 2;
                }
                 if (Cube.vy >= 0) {
                    Cube.y = ymin - Cube.d / 2;
                }
                 else if (Cube.vy < 0) {
                    Cube.y = ymax + Cube.d / 2;
                }**/
                Cube.vx = 0;
                //Cube.vy = 0;
            }
        }
    }

    for (let i = 0; i < BARS; ++i) {
        let bar = BARS[i];
        if (bar.color === PLATFORM_COLOR) {
            let xmin = bar.position.x - bar.geometry.parameters.width / 2;
            let xmax = bar.position.x + bar.geometry.parameters.width / 2;
            let ymax = bar.position.y + BAR_Y / 2;
            let ymin = bar.position.y - BAR_Y / 2;

            if (Cube.x - Cube.d / 2 <= xmax && Cube.x + Cube.d / 2 >= xmin) {
                if (Cube.y - Cube.d / 2 <= ymax + EPSILON && Cube.y + Cube.d / 2 >= ymin) {
                    if (Cube.vy <= 0) {
                        is_on_platform = true;
                        Cube.y = ymax + Cube.d / 2;
                    } else {
                        if (is_on_platform === false) {
                            Cube.y = ymin - Cube.d / 2;
                            Cube.vy = 0;
                        }
                    }
                }
                else if (Math.max(Cube.y - Cube.d / 2, ymin) <= Math.min(Cube.y + Cube.d / 2, ymax)) {
                    /**if (Cube.vx >= 0) {
                    Cube.x = xmin - Cube.d / 2;
                }
                     else if (Cube.vx < 0) {
                    Cube.x = xmax + Cube.d / 2;
                }
                     if (Cube.vy >= 0) {
                    Cube.y = ymin - Cube.d / 2;
                }
                     else if (Cube.vy < 0) {
                    Cube.y = ymax + Cube.d / 2;
                }**/
                    Cube.vx = 0;
                    //Cube.vy = 0;
                }
            }
        }
    }

    let portal = level.portal;

    let xmin = portal[0] - PORTAL_X / 2;
    let xmax = portal[0] + PORTAL_X / 2;
    let ymin = portal[1] - PORTAL_Y / 2;
    let ymax = portal[1] + PORTAL_Y / 2;

    if (Cube.x - Cube.d / 2 <= xmax && Cube.x + Cube.d / 2 >= xmin &&
        Cube.y - Cube.d / 2 <= ymax && Cube.y + Cube.d / 2 >= ymin) {
        if ((Date.now() - START_TIME) >= MIN_INTER_TRAVEL_TIME) {
            console.log("Registering RUN!");
            console.log({REGISTERED_MOVEMENTS, CURRENT_MOVEMENTS, EVENT_LISTENERS_ENABLED, GRABBABLE_OBJECTS, GRABBED_OBJECT});
            register_run(Cube);
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
    xmin = exit[0] - EXIT_X/2;
    xmax = exit[0] + EXIT_X/2;
    ymin = exit[1] - EXIT_Y/2;
    ymax = exit[1] + EXIT_Y/2;

    if (Cube.x-Cube.d/2 <= xmax && Cube.x + Cube.d/2 >= xmin &&
        Cube.y-Cube.d/2 <= ymax && Cube.y + Cube.d/2 >= ymin) {
        if (REGISTERED_MOVEMENTS.length === 0 && WIN === false) {
            WIN = true;
            TIME = START_TIME - Date.now();
            printCombo(0, 0, 0, 'WINNER', scene, 0x31ffe1)
        }
    }

}

function start_game(level){
    // Initializing Scene
    let aux = setup_level(level);
    let scene = aux.scene;
    let camera = aux.camera;
    let renderer = aux.renderer;

    // Initilize grabbable objects.
    for (let i = 0; i < BARS.length; i++) {
        GRABBABLE_OBJECTS[i] = BARS[i];
    }

    // Define cube and set initial position.
    let material = new THREE.MeshPhongMaterial({color: CUBE_COLOR});
    let geometry = new THREE.BoxGeometry(CUBE_EDGE, CUBE_EDGE, CUBE_EDGE);
    for(let i = 0; i < geometry.faces.length; ++i){
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

    START_TIME = Date.now();
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
        requestAnimationFrame(render);
        update_cube(Cube, level, scene, CUBE_COLOR);
        renderer.render(scene, camera);
    };

    render();
}