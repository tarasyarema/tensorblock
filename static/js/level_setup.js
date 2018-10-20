const PLATFORM_Y = 0.5;
const PLATFORM_Z = 2;

function create_platform(x, y, w) {
    var geometry = new THREE.BoxGeometry(w, PLATFORM_Y, PLATFORM_Z);
    var material = new THREE.MeshPhongMaterial({ color: 0xffffff, vertexColors: THREE.FaceColors }); 
    var platform =  new THREE.Mesh(geometry, material);

    platform.position.set = (x, y, 0);
    platform.castShadow = true;
    platform.receiveShadow = false;
    return platform;
}

function setup_level(level) {
    var back = 0xffd8eb; // 0xffd8eb
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(back);

    var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000);

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
    lights.directional_2.position.set(-10, 200, -100);
    lights.directional_2.castShadow = true;
    scene.add(lights.directional_2);
    lights.ambient.castShadow = true;
    scene.add(lights.ambient);


    console.log(level.platforms);

    for (let i = 0; i < level.platforms.length; ++i) {
        let tmp = level.platforms[i];
        scene.add(create_platform(tmp[0], tmp[1], tmp[2]));
        
        console.log("Created platform %d: (%d, %d, %d)", i, tmp[0], tmp[1], tmp[2]);
    }

    return {
        scene: scene,
        camera: camera,
        renderer: renderer
    };
}