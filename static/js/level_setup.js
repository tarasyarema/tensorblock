const PLATFORM_Y = 1;
const PLATFORM_Z = 2;
const EXIT_X = 0.75;
const EXIT_Y = 4;
const EXIT_Z = 2;
const PORTAL_X = 0.75;
const PORTAL_Y = 4;
const PORTAL_Z = 2;
const BAR_Y = 1;
const BAR_Z = 2;
const EXIT_COLOR = 0xdd73ff;
const PORTAL_COLOR = 0xffdd73;
const PLATFORM_COLOR = 0x262326;
const BAR_COLOR = 0x666666;
const CUBE_DIMENSION = 0.1;
const CAMERA_Z = 35;

var BARS = [];
var BAR_SHAPES = [];

var exit_boxes;

function mean_x(level) {
    var min = 1000;
    var max = -1000;

    for (var i = 0; i < level.platforms.length; ++i) {
        if (level.platforms[i][0] < min) min = level.platforms[i][0];
        if (level.platforms[i][0] + PLATFORM_Y > max) max = level.platforms[i][0] + PLATFORM_Y;
    }

    return (max + min) / 2;
}

function mean_y(level) {
    var min = 1000;
    var max = -1000;

    for (var i = 0; i < level.platforms.length; ++i) {
        if (level.platforms[i][1] < min) min = level.platforms[i][1];
        if (level.platforms[i][1] + level.platforms[i][2] > max) max = level.platforms[i][1] + level.platforms[i][2];
    }

    return (max + min) / 2;
}


function create_cube(x, y, z, col, scene) {
    var geometry = new THREE.BoxGeometry(CUBE_DIMENSION, CUBE_DIMENSION, CUBE_DIMENSION);
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
    for (var i = 0; i < width; ++i) 
        pos[i] = [[],[],[]];

    pos[0][0] = [x,y,z];
    for (i = 0; i < height; ++i)
        for (var j=0; j < width; ++j)
            pos[i][j] = [ CUBE_DIMENSION * (i + x), CUBE_DIMENSION * (y - j), z ];

    return pos;
}

function create_platform(x, y, w) {
    var geometry = new THREE.BoxGeometry(w, PLATFORM_Y, PLATFORM_Z);
    var material = new THREE.MeshPhongMaterial({ color: PLATFORM_COLOR }); //, vertexColors: THREE.FaceColors });
    var platform =  new THREE.Mesh(geometry, material);
    for (var i = 0; i < geometry.faces.length; ++i)
        geometry.faces[i].color.setHex(Math.random() * PLATFORM_COLOR);

    platform.position.set(x, y, 0);
    platform.castShadow = true;
    platform.receiveShadow = false;
    return platform;
}

function create_exit(x, y, scene) {
    var pos = [x,y,0];
    var grid = create_grid(pos[0], pos[1], pos[2], door_width, door_height);

    console.log(pos);
    console.log(grid);

    exit_boxes = [];
    for (var i = 0; i < door_height; ++i) {
        for (var j = 0; j < door_width; ++j) {
            if (exit_door[door_width*i + j] !== 0x000000 && exit_door[door_width*i + j] !== 0xffffff){
                // console.log(j, i, grid[j][i]);
                exit_boxes.push(create_cube(grid[j][i][0], grid[j][i][1], grid[j][i][2],
                                               exit_door[door_width*i + j], scene));
            }
        }
    }
}

function create_bar(x, y, w) {
    var geometry = new THREE.BoxGeometry(w, BAR_Y, BAR_Z);
    var material = new THREE.MeshPhongMaterial({ color: BAR_COLOR });
    var bar =  new THREE.Mesh(geometry, material);

    for (var i = 0; i < geometry.faces.length; ++i) 
        geometry.faces[i].color.setHex(Math.random() * BAR_COLOR);

    bar.position.set(x, y, 0);
    bar.castShadow = true;
    bar.receiveShadow = false;

    return bar;
}


/**
    var geometry = new THREE.BoxGeometry(EXIT_X, EXIT_Y, EXIT_Z);
    var material = new THREE.MeshPhongMaterial({ color: EXIT_COLOR, vertexColors: THREE.FaceColors });
    var exit =  new THREE.Mesh(geometry, material);
    for(var i = 0; i < geometry.faces.length; ++i){
        geometry.faces[i].color.setHex(Math.random() * EXIT_COLOR);
    }

    exit.position.set(x, y+EXIT_Y/2+PLATFORM_Y/2, 0);
    exit.castShadow = true;
    exit.receiveShadow = false;
    return exit;
}**/

function create_portal(x, y, color) {
    var geometry = new THREE.BoxGeometry(PORTAL_X, PORTAL_Y, PORTAL_Z);
    var material = new THREE.MeshPhongMaterial({ color: color });
    var exit =  new THREE.Mesh(geometry, material);

    for (var i = 0; i < geometry.faces.length; ++i)
        geometry.faces[i].color.setHex(Math.random() * PORTAL_COLOR);

    exit.position.set(x, y + EXIT_Y / 2 + PLATFORM_Y / 2, 0);
    exit.castShadow = true;
    exit.receiveShadow = false;

    return exit;
}

function setup_level(level) {
    var back = 0xffd8eb;
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(back);

    var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(mean_x(level), mean_y(level), CAMERA_Z);

    var game = document.getElementById("game");
    var renderer = new THREE.WebGLRenderer({ canvas: game, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.Enabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild(renderer.domElement);

    // Setup lights!
    var lights = {
        directional_1: new THREE.DirectionalLight(0xff59ac, 0.2),
        directional_2: new THREE.DirectionalLight(0x00e1ff, 0.2),
        ambient: new THREE.AmbientLight(0xe2e2e2)
    };
      
    lights.directional_1.position.set(50, 200, 100);
    lights.directional_1.castShadow = true;
    scene.add(lights.directional_1);
    lights.directional_2.position.set(10, 100, -100);
    lights.directional_2.castShadow = true;
    scene.add(lights.directional_2);
    lights.ambient.castShadow = true;
    scene.add(lights.ambient);

    // Draw platforms.
    var platform;
    var x;
    var y;
    var w;
    for (var i = 0; i < level.platforms.length; ++i) {
        platform = level.platforms[i];
        x = platform[0];
        y = platform[1];
        w = platform[2];
        scene.add(create_platform(x, y, w));
    }

    // Draw exit.
    if (level.portals !== null) {
        for (let i=0; i < level.portals.length; i++) {
            let portal = level.portals[i];
            scene.add(create_portal(portal[0], portal[1], PORTAL_COLOR));
        }
    }

    scene.add(create_portal(level.exit[0], level.exit[1], EXIT_COLOR));

    /*
    Draw portals.
    var portal;
    if (level.portal !== null) {
        for (var i = 0; i < level.portal.length; ++i) {
            portal = level.portal[i];
            x = portal[0];
            y = portal[1];
            w = portal[2];
            scene.add(create_portal(x, y, w));
        }
    }
    */

    if (level.hor_bar !== null) {
        for (let i = 0; i < level.hor_bar.length; ++i) {
            let portal = level.hor_bar[i];
            x = portal[0];
            y = portal[1];
            w = portal[2];
            BAR_SHAPES.push([x, y, w]);
            let bar = create_bar(x, y, w);
            scene.add(bar);
            BARS.push(bar)
        }
    }


    return {
        scene: scene,
        camera: camera,
        renderer: renderer
    };
}