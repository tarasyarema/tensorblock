const CUBE_EDGE = 2;
const EPSILON = 0.1;
const WAIT_PERIOD = 200;
const SPEED = 2;
const GRAVITY = -0.5;


var x_pos;
var y_pos;
var z_pos;


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
            Cube.vy = SPEED;
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
        Cube.vx = 0;
    }
}


function update_cube(Cube, platforms){
    Cube.x += Cube.vx;
    Cube.y += Cube.vy;

    var is_on_platform = false;
    var platform;
    var xmin;
    var xmax;
    var y;
    for (var i=0; i< platforms.length; i++){
        platform = platforms[i];
        xmin = platform[0];
        xmax = xmin + platform[2];
        y = platform[1];
        if (Cube.x <= xmax && Cube.x + Cube.d >= xmin && Math.abs(Cube.y + Cube.d -y) <= EPSILON ){
            is_on_platform = true;
        }
        if (Math.max(Cube.x, xmin) <= Math.min(Cube.x + Cube.d, xmax) &&
            Math.max(Cube.y, y) <= Math.min(Cube.y + Cube.d, y+EPSILON)){
            if (Cube.vx >= 0) {
                Cube.x = xmin - Cube.d;
            }
            else if (Cube.vx < 0) {
                Cube.x = xmax;
            }
            if (Cube.vy >= 0) {
                Cube.y = y - Cube.d;
            }
            else if (Cube.vx < 0) {
                Cube.y = y + EPSILON;
            }
        }
    }

    //Store if the cube is on a platform or not.
    Cube.on_platform = is_on_platform;

    if (!is_on_platform){
        Cube.vy += GRAVITY;
    }
    else {
        Cube.vy = 0;

    }
}

function start_game(level){
    // Initializing Scene
    var aux = setup_level(level);
    var scene = aux.scene;
    var camera = aux.camera;
    var renderer = aux.renderer;

    z_pos = 0;

    // Define cube and set initial position.
    var material = new THREE.MeshPhongMaterial({color: 0xffd8eb});
    var geometry = new THREE.BoxGeometry(CUBE_EDGE, CUBE_EDGE, CUBE_EDGE);
    for(var i = 0; i < geometry.faces.length; ++i){
        geometry.faces[i].color.setHex(Math.random() * 0xffffff);
    }
    var Cube = {mat: new THREE.Mesh(geometry, material),
                x: level.init[0],
                y: level.init[1],
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

    document.addEventListener('onkeyup', function (event){
        key_up_listener(event, Cube);
    });

    // Creating render function.
    var controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', render);
    var render = function () {
        requestAnimationFrame(render);
        update_cube(Cube, level.platforms);
        controls.update();
        renderer.render(scene, camera);
    };

    render();
}
