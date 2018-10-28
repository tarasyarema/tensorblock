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

var canvas;
function setup_level(level) {
    canvas = document.getElementById("game");

    /*
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
    let update_wolfram = dinamicPrintCombo(-53, 72, -150, "Wolfram", scene, 0xff9100);*/
    if (level.hor_bar !== null) {
        for (let i = 0; i < level.hor_bar.length; ++i) {
            let portal = level.hor_bar[i];
            x = portal[0];
            y = portal[1];
            GRABBABLE_OBJECTS.push([x, y]);
            BAR_SHAPES.push([x, y, 0]);
        }
    }
    
    initWebGL(canvas);
    doLevelBuffer(level);
}