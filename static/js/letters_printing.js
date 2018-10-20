
function creaCube(x, y, z, scene, col) {
    var geometry = new THREE.BoxGeometry( CUBE_EDGE/2, CUBE_EDGE/2, CUBE_EDGE/2);
    var material = new THREE.MeshPhongMaterial( {color: col} );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;
    cube.castShadow = false;
    cube.receiveShadow = true;
    scene.add( cube );
}

function creaGrid (x, y, z) {
    var pos = [], i;
    for ( i = 0; i < 5; ++i ) {
        pos[i] = [[],[],[]];
    }
    pos[0][0] = [x,y,z];
    var dx = 1.1;
    var dy = 1.1;
    var j;
    for (i = 0; i < 5; ++i) {
        for (j=0; j < 5; ++j) {
            pos[i][j] = [ (i*dx)+x, -(j*dy)+y, z ];
        }
    }
    return pos;
}

function normalizePos( x, y, z) {
    var realpos = [];
    var dx = 5;
    var dy = 5;
    var dz = 5;
    realpos[0] = x + dx / 2;
    realpos[1] = y + dy / 2;
    realpos[2] = z + dz / 2;
    return realpos;
}

function printLetter (x, y, z, n, scene, col) {
    var pos = normalizePos(x, y, z);
    var grid = creaGrid(pos[0], pos[1], pos[2]);
    for (var i = 0; i < asciiChars[n].length; ++i) {
        for (var j = 0; j < asciiChars[n][0].length; ++j) {
            if (asciiChars[n][j][i]!=0){
                creaCube(grid[i][j][0], grid[i][j][1], grid[i][j][2], scene, col);
            }
        }
    }
}

function str2Num (str) {
    var num = [];
    var ucstr = str.toUpperCase();
    for ( var i = 0; i < ucstr.length; ++i) {
        if (ucstr.charCodeAt(i) < 96) {
            num[i] = ucstr.charCodeAt(i) - 32;
        } else {
            num[i] = 0;
        }
    }
    return num;
}

function printCombo ( x, y, z, letts, scene, col) {
    var nums = str2Num(letts);
    var i, it = 5 * 1.3;
    var temp = (nums.length * it) / 2;
    for (i = 0; i < nums.length; ++i) {
        printLetter(x - temp + (i * it), y, z, nums[i], scene, col);
    }
}