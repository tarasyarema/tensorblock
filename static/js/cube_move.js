const CUBE_EDGE = 2;
const EPSILON = 0.7;
const SPEED = 1;
const VERTICAL_SPEED = 1.2;
const GRAVITY = -0.1;
const CUBE_COLOR = 0Xff710d;


var REGISTERED_MOVEMENTS = [];
var CURRENT_MOVEMENTS = [];


/**
 * react to key pressed.
 */
function key_down_listener(event, Cube) {
    var key;
    pingu_index = 0;
    // get key pressed.
    key = event.key;
    // if left arrow key is pressed then , depending on 'ChangeYearOnKeyPress'
    // variable value we show previous page of bookmarks or of backgrounds
    if (key === "ArrowLeft") {
        if (Cube.on_platform) {
            Cube.vx = -SPEED;
        }
    }

    // if right arrow key is pressed then , depending on 'ChangeYearOnKeyPress'
    // variable value we show next page of bookmarks or of backgrounds
    if (key === "ArrowRight") {
        if (Cube.on_platform) {
            Cube.vx = SPEED;
        }
    }

    // if right arrow key is pressed then , depending on 'ChangeYearOnKeyPress'
    // variable value we show next page of bookmarks or of backgrounds
    if (key === "ArrowUp") {
        if (Cube.on_platform) {
            Cube.vy = VERTICAL_SPEED;
        }
    }
    console.log(Cube)
}



/**
 * react to key pressed.
 */
function key_up_listener(event, Cube) {
    var key;
    pingu_index = 0;
    // get key pressed.
    key = event.key;
    // if left arrow key is pressed then , depending on 'ChangeYearOnKeyPress'
    // variable value we show previous page of bookmarks or of backgrounds
    if (key === "ArrowLeft" || key === "ArrowRight") {
        if (Cube.on_platform) {
            Cube.vx = 0;
        }
    }
}


function update_cube(Cube, level, scene){
    var platforms = level.platforms;
    Cube.x += Cube.vx;
    Cube.y += Cube.vy;

    var is_on_platform = false;
    var platform;
    var xmin;
    var xmax;
    var ymax;
    var ymin;
    for (var i=0; i< platforms.length; i++){
        platform = platforms[i];
        xmin = platform[0] - platform[2]/2;
        xmax = platform[0] + platform[2]/2;
        ymax = platform[1] + PLATFORM_Y/2;
        ymin = platform[1] - PLATFORM_Y/2;
        if (Cube.x-Cube.d/2 <= xmax && Cube.x + Cube.d/2 >= xmin) {
            if (Cube.y - Cube.d / 2 <= ymax + EPSILON && Cube.y >= ymin) {
                is_on_platform = true;
                Cube.y = ymax + Cube.d / 2;
            }
            else if (Math.max(Cube.y - Cube.d/2, ymin) <= Math.min(Cube.y + Cube.d/2, ymax)) {
                if (Cube.vx >= 0) {
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
                }
                Cube.vx = 0;
                Cube.vy = 0;
            }
        }
    }

    var exit = level.exit;
    xmin = exit[0] - PORTAL_X/2;
    xmax = exit[0] + PORTAL_X/2;
    ymin = exit[1] - PORTAL_Y/2;
    ymax = exit[1] + PORTAL_Y/2;
    if (Cube.x-Cube.d/2 <= xmax && Cube.x + Cube.d/2 >= xmin &&
        Cube.y-Cube.d/2 <= ymax && Cube.y + Cube.d/2 >= ymin) {
            printCombo (0, 0, 0, 'WINNER', scene, 0x31ffe1)
    }

    //Store if the cube is on a platform or not.
    Cube.on_platform = is_on_platform;

    if (is_on_platform){
        Cube.vy = 0;
    }
    else {
        Cube.vy += GRAVITY;
        Cube.vy = Math.min(Cube.vy, VERTICAL_SPEED);
        Cube.vy = Math.max(Cube.vy, -VERTICAL_SPEED);
    }

    Cube.mat.position.set(Cube.x, Cube.y, Cube.z);
}

function start_game(level){
    // Initializing Scene
    var aux = setup_level(level);
    var scene = aux.scene;
    var camera = aux.camera;
    var renderer = aux.renderer;

    // Define cube and set initial position.
    var material = new THREE.MeshPhongMaterial({color: CUBE_COLOR});
    var geometry = new THREE.BoxGeometry(CUBE_EDGE, CUBE_EDGE, CUBE_EDGE);
    for(var i = 0; i < geometry.faces.length; ++i){
        geometry.faces[i].color.setHex(Math.random() * 0xaa710d);
    }
    var Cube = {mat: new THREE.Mesh(geometry, material),
                x: level.init[0],
                y: level.init[1] + CUBE_EDGE/2+PLATFORM_Y/2,
                z: 0,
                on_platform: false,
                vx: 0,
                vy: 0,
                vz: 0,
                d: CUBE_EDGE};

    //Set initial cube position and make fancy shadowing.
    Cube.mat.position.set(Cube.x, Cube.y, Cube.z);
    Cube.mat.castShadow = true;
    Cube.mat.receiveShadow = false;
    scene.add(Cube.mat);

    //Add event listeners for cube moving.
    document.addEventListener('keydown', function (event){
        key_down_listener(event, Cube);
    });

    document.addEventListener('keyup', function (event){
        key_up_listener(event, Cube);
    });

    // Creating render function.
    var render = function () {
        requestAnimationFrame(render);
        update_cube(Cube, level, scene);
        renderer.render(scene, camera);
    };

    render();
}
