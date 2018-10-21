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
const CAMERA_Z = 35;

var BARS = [];
var BAR_SHAPES = [];

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

function create_vertical_platform(x, y, w) {
    var geometry = new THREE.BoxGeometry(PLATFORM_Y, w, PLATFORM_Z);
    var material = new THREE.MeshPhongMaterial({ color: PLATFORM_COLOR }); //, vertexColors: THREE.FaceColors });
    var platform =  new THREE.Mesh(geometry, material);
    for (var i = 0; i < geometry.faces.length; ++i)
        geometry.faces[i].color.setHex(Math.random() * PLATFORM_COLOR);

    platform.position.set(x, y, 0);
    platform.castShadow = true;
    platform.receiveShadow = false;
    return platform;
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

function create_portal_exit(x, y, color, w, h, d) {
    var geometry = new THREE.BoxGeometry(w, h, d);
    var material = new THREE.MeshPhongMaterial({ color: color });
    var exit =  new THREE.Mesh(geometry, material);

    for (var i = 0; i < geometry.faces.length; ++i)
        geometry.faces[i].color.setHex(Math.random() * PORTAL_COLOR);

    exit.position.set(x, y + h / 2 + PLATFORM_Y / 2, 0);
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
    for (let i = 0; i < level.platforms.length; ++i) {
        let platform = level.platforms[i];
        let x = platform[0];
        let y = platform[1];
        let w = platform[2];
        scene.add(create_platform(x, y, w));
    }

    if (level.ver_bar !== null) {
        for (let i = 0; i < level.ver_bar.length; ++i) {
            let platform = level.ver_bar[i];
            let x = platform[0];
            let y = platform[1];
            let w = platform[2];
            scene.add(create_vertical_platform(x, y, w));
        }
    }

    // Draw exit.
    if (level.portals !== null) {
        for (let i=0; i < level.portals.length; i++) {
            let portal = level.portals[i];
            scene.add(create_portal_exit(portal[0], portal[1], PORTAL_COLOR, PORTAL_X, PORTAL_Y, PORTAL_Z));
        }
    }

    scene.add(create_portal_exit(level.exit[0], level.exit[1], EXIT_COLOR, EXIT_X, EXIT_Y, EXIT_Z));


    // Draw loles
    let update_blockchain = dinamicPrintCombo(110, 105, -150, "blockchain", scene, 0x412432);
    let update_tensorflow = dinamicPrintCombo(-95, 125, -150, "tensorflow", scene, 0xfe123d);
    let update_p_adics = dinamicPrintCombo(95, -125, -150, "p-adic", scene, 0xd61394);
    let update_galois = dinamicPrintCombo(-110, -105, -150, "Galois", scene, 0x01ff00);
    let update_hilbert = dinamicPrintCombo(0, 0, -150, "Hilbert", scene, 0x888888);
    let update_turing = dinamicPrintCombo(-80, 82, -150, "Turing", scene, 0x0092ff);
    let update_erdos = dinamicPrintCombo(-117, 15, -150, "Erdos", scene, 0x20ff9a);
    let update_gauss = dinamicPrintCombo(14, -123, -150, "Gauss", scene, 0xff85dc);
    let update_euler = dinamicPrintCombo(-7, 53, -150, "Euler", scene, 0x9eff00);
    let update_wolfram = dinamicPrintCombo(-7, 53, -150, "Wolfram", scene, 0xff9100);

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
        renderer: renderer,
        update_blockchain: update_blockchain,
        update_tensorflow: update_tensorflow,
        update_p_adics: update_p_adics,
        update_galois: update_galois,
        update_hilbert: update_hilbert,
        update_turing: update_turing,
        update_euler: update_euler,
        update_gauss: update_gauss,
        update_erdos: update_erdos,
        update_wolfram: update_wolfram
    };
}