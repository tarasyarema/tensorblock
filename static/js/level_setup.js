const PLATFORM_Y = 1;
const PLATFORM_Z = 2;
const PORTAL_X = 0.75;
const PORTAL_Y = 4;
const PORTAL_Z = 2;
const EXIT_COLOR = 0x070222;
const PLATFORM_COLOR = 0xd0ff22;

function create_platform(x, y, w) {
    var geometry = new THREE.BoxGeometry(w, PLATFORM_Y, PLATFORM_Z);
    var material = new THREE.MeshPhongMaterial({ color: PLATFORM_COLOR, vertexColors: THREE.FaceColors });
    var platform =  new THREE.Mesh(geometry, material);
    for(var i = 0; i < geometry.faces.length; ++i){
        geometry.faces[i].color.setHex(Math.random() * PLATFORM_COLOR);
    }

    platform.position.set(x, y, 0);
    platform.castShadow = true;
    platform.receiveShadow = false;
    return platform;
}

function create_portal(x, y) {
    var geometry = new THREE.BoxGeometry(PORTAL_X, PORTAL_Y, PORTAL_Z);
    var material = new THREE.MeshPhongMaterial({ color: EXIT_COLOR, vertexColors: THREE.FaceColors });
    var portal =  new THREE.Mesh(geometry, material);
    for(var i = 0; i < geometry.faces.length; ++i){
        geometry.faces[i].color.setHex(Math.random() * EXIT_COLOR);
    }

    portal.position.set(x, y+PORTAL_Y/2+PLATFORM_Y/2, 0);
    portal.castShadow = true;
    portal.receiveShadow = false;
    return portal;
}

function setup_level(level) {
    var back = 0xffd8eb; // 0xffd8eb
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(back);

    var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 40;

    var renderer = new THREE.WebGLRenderer();
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

    // Draw platform.
    scene.add(create_portal(level.exit[0], level.exit[1]));



    return {
        scene: scene,
        camera: camera,
        renderer: renderer
    };
}