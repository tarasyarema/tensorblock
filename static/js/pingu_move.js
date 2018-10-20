const cube_dim = 2;

var cap_yes;
var x_pos;
var y_pos;
var z_pos;

var pingu_boxes;
var pingu_still_right;
var pingu_still_left;
var pingu_move_right;
var pingu_move_left;
var pingu_index;
var speed;
var wait_period;

var pingu_left_motion;
var pingu_left_still;
var pingu_right_motion;
var pingu_right_still;


function create_cube(x, y, z, col, scene) {
    var geometry = new THREE.BoxGeometry(1, 1);
    var material = new THREE.MeshPhongMaterial( {color: col} );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;
    cube.castShadow = false;
    cube.receiveShadow = true;
    scene.add( cube );
    return cube;
}

function create_grid (x, y, z, height, width) {
    var pos = [];
    for (var i = 0; i < width; ++i ) {
        pos[i] = [[],[],[]];
    }

    pos[0][0] = [x,y,z];

    for (i = 0; i < height; ++i) {
        for (var j=0; j < width; ++j) {
            pos[i][j] = [ i+x, -j+y, z ];
        }
    }
    return pos;
}

function normalize_pos(x, y, z) {
    return [x - cube_dim / 2,
            y + cube_dim / 2,
            z + cube_dim / 2];
}

function print_pingu (x, y, z, pingu_fig, scene) {
    var pos = normalize_pos(x, y, z);
    var grid = create_grid(pos[0], pos[1], pos[2], pingu_height, pingu_width);

    // Remove previous pingu print.
    for (var i = 0; i < pingu_boxes.length; i++) {
        scene.remove(pingu_boxes[i]);
    }

    pingu_boxes = [];
    for (i = 0; i < pingu_height; ++i) {
        for (var j = 0; j < pingu_width; ++j) {
            if (pingu_fig[pingu_width*i + j]!==0x00000000){
                pingu_boxes.push(create_cube(grid[j][i][0], grid[j][i][1], grid[j][i][2],
                                               pingu_fig[pingu_width*i + j], scene));
            }
        }
    }
}

function start_pingu_move(x_start, y_start, z_start, scene) {
    x_pos = x_start;
    y_pos = y_start;
    z_pos = z_start;

    start_pingu_still_right(scene);

    document.addEventListener('keydown', function (event){
        key_down_listener(event, scene);
    });

    document.addEventListener('keyup', function (event){
        key_up_listener(event, scene);
    });

}



function start_pingu_still_left(scene) {
    print_pingu(x_pos, y_pos, z_pos, pingu_left_still[pingu_index], scene);

    pingu_index += 1;
    pingu_index = pingu_index % 2;
    if (pingu_still_left) {
        setTimeout(start_pingu_still_left, wait_period*(1 + pingu_index*2), scene)
    }
}



function start_pingu_still_right(scene) {
    print_pingu(x_pos, y_pos, z_pos, pingu_right_still[pingu_index], scene);

    pingu_index += 1;
    pingu_index = pingu_index % 2;
    if (pingu_still_right) {
        setTimeout(start_pingu_still_right, wait_period*(1 + pingu_index*2), scene)
    }
}



function start_pingu_move_left(scene) {
    x_pos = x_pos - speed;
    print_pingu(x_pos, y_pos, z_pos, pingu_left_motion[pingu_index], scene);

    pingu_index += 1;
    pingu_index = pingu_index % 3;
    if (pingu_move_left) {
        setTimeout(start_pingu_move_left, wait_period, scene)
    }
}



function start_pingu_move_right(scene) {
    x_pos = x_pos + speed;
    print_pingu(x_pos, y_pos, z_pos, pingu_right_motion[pingu_index], scene);

    pingu_index += 1;
    pingu_index = pingu_index % 3;
    if (pingu_move_right) {
        setTimeout(start_pingu_move_right, wait_period, scene)
    }
}


/**
 * react to key pressed.
 */
function key_down_listener(event, scene) {
    var key;
    pingu_index = 0;
    // get key pressed.
    key = event.key;
    // if left arrow key is pressed then , depending on 'ChangeYearOnKeyPress'
    // variable value we show previous page of bookmarks or of backgrounds
    if (key === "ArrowLeft") {
        pingu_still_right = false;
        pingu_still_left = false;
        pingu_move_right = false;
        pingu_move_left = true;
        start_pingu_move_left(scene);
    }

    // if right arrow key is pressed then , depending on 'ChangeYearOnKeyPress'
    // variable value we show next page of bookmarks or of backgrounds
    if (key === "ArrowRight") {
        pingu_still_right = false;
        pingu_still_left = false;
        pingu_move_right = true;
        pingu_move_left = false;
        start_pingu_move_right(scene);
    }
}



/**
 * react to key pressed.
 */
function key_up_listener(event, scene) {
    var key;
    pingu_index = 0;
    // get key pressed.
    key = event.key;
    // if left arrow key is pressed then , depending on 'ChangeYearOnKeyPress'
    // variable value we show previous page of bookmarks or of backgrounds
    if (key === "ArrowLeft") {
        pingu_still_right = false;
        pingu_still_left = true;
        pingu_move_right = false;
        pingu_move_left = false;
        start_pingu_still_left(scene);
    }

    // if right arrow key is pressed then , depending on 'ChangeYearOnKeyPress'
    // variable value we show next page of bookmarks or of backgrounds
    if (key === "ArrowRight") {
        pingu_still_right = true;
        pingu_still_left = false;
        pingu_move_right = false;
        pingu_move_left = false;
        start_pingu_still_right(scene);
    }
}


function init_scene(){
    // Initializing Scene

    cap_yes = false;
    x_pos = 0;
    y_pos = 0;
    z_pos = 0;

    pingu_boxes = [];
    pingu_still_right = true;
    pingu_still_left = false;
    pingu_move_right = false;
    pingu_move_left = false;
    pingu_index = 0;
    speed = 2;
    wait_period = 500;


    pingu_left_motion = [];
    if (cap_yes) {
        pingu_left_motion = [pingu_left_cap, pingu_left_cap_walk1, pingu_left_cap_walk2];
    }
    else{
        pingu_left_motion = [pingu_left, pingu_left_walk1, pingu_left_walk2];
    }

    pingu_left_still = [];
    if (cap_yes) {
        pingu_left_still = [pingu_left_cap, pingu_left_cap_blink];
    }
    else{
        pingu_left_still = [pingu_left, pingu_left_blink];
    }

    pingu_right_motion = [];
    if (cap_yes) {
        pingu_right_motion = [pingu_right_cap, pingu_right_cap_walk1, pingu_right_cap_walk2];
    }
    else{
        pingu_right_motion = [pingu_right, pingu_right_walk1, pingu_right_walk2];
    }

    pingu_right_still = [];
    if (cap_yes) {
        pingu_right_still = [pingu_right_cap, pingu_right_cap_blink];
    }
    else{
        pingu_right_still = [pingu_right, pingu_right_blink];
    }


    var scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x252525 );
    var camera = new THREE.PerspectiveCamera( 60, window.innerWidth/window.innerHeight, 1, 1000 );
    camera.position.z = 150;

    // Camera controls

    var controls = new THREE.OrbitControls( camera );
    controls.addEventListener('change', render);


    // Some lightings

    var light = new THREE.DirectionalLight(0xff0000);
    light.position.set(100, -100, 300);
    light.castShadow = true;
    light.shadowDarkness = 0.5;
    scene.add(light);

    light = new THREE.DirectionalLight(0x002288);
    light.position.set(0, 200, -100);
    light.castShadow = true;
    light.shadowDarkness = 0.5;
    scene.add(light);

    light = new THREE.AmbientLight(0x222222);
    light.castShadow = true;
    light.shadowDarkness = 0.5;
    scene.add(light);

    // Initializing Renderer

    var renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;


    // Print sample strings

    start_pingu_move(0, 0, 0, scene);


    // Render functions

    var render = function () {
        requestAnimationFrame( render );
        renderer.render(scene, camera);
        controls.update();
    };

    render();
}