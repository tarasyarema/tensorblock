const CUBE_EDGE = 2;
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
        Cube.vx = -SPEED;
    }

    // if right arrow key is pressed then , depending on 'ChangeYearOnKeyPress'
    // variable value we show next page of bookmarks or of backgrounds
    if (key === "ArrowRight") {
        Cube.vx = SPEED;
    }
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
    for (var i=0; i< platforms.length; i++){
        var platform = platforms[i]
    }



}

function start_game(level){
    // Initializing Scene
    var aux = setup_level(level);
    var scene = aux.scene;
    var camera = aux.camera;
    var renderer = aux.renderer;

    x_pos = level['init'][0];
    y_pos = level['init'][1];
    z_pos = 0;

    // Define cube and set initial position.
    var material = new THREE.MeshPhongMaterial({color: 0xffd8eb});
    var geometry = new THREE.BoxGeometry(edge, edge, edge);
    for(var i = 0; i < geometry.faces.length; ++i){
        geometry.faces[i].color.setHex(Math.random() * 0xffffff);
    }
    var Cube = {mat: new THREE.Mesh(geometry, material),
                x: level['init'][0],
                y: level['init'][1],
                z: 0,
                g: false,
                vx: 0,
                vy: 0,
                vz: 0,
                d: CUBE_EDGE};

    //Set initial cube position and make fancy shadowing.
    Cube.mat.position.set(Cube.x, Cube.y, Cube.z);
    Cube.mat.castShadow.set(Cube.x, Cube.y, Cube.z);

    //Add event listeners for cube moving.
    document.addEventListener('keydown', function (event){
        key_down_listener(event, Cube);
    });

    document.addEventListener('keyup', function (event){
        key_up_listener(event, Cube);
    });

    // Creating render function.
    var controls = new THREE.OrbitControls(camera);
    var render = function () {
        requestAnimationFrame(render);
        update_cube(Cube, renderer, scene, camera);
        controls.update();
        //controls.addEventListener('change', render);
        document.addEventListener("keydown", keyDown);
    };

    render();
}
