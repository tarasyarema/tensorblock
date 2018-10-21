function creaCube(x, y, z, scene, col) {
    var geometry = new THREE.BoxGeometry( CUBE_EDGE/2, CUBE_EDGE/2, CUBE_EDGE/2);
    var material = new THREE.MeshPhongMaterial( {color: col} );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;
    cube.castShadow = false;
    cube.receiveShadow = true;
    scene.add(cube);
    return {box: cube,
        x: x,
        y: y,
        z: z};
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
    var letter = [];
    for (var i = 0; i < asciiChars[n].length; ++i) {
        for (var j = 0; j < asciiChars[n][0].length; ++j) {
            if (asciiChars[n][j][i]!=0){
                letter.push(creaCube(grid[i][j][0], grid[i][j][1], grid[i][j][2], scene, col));
            }
        }
    }
    return letter;
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
    var letters = [];
    for (i = 0; i < nums.length; ++i) {
        letters.push(printLetter(x - temp + (i * it), y, z, nums[i], scene, col));
    }
    return letters
}


function dinamicPrintCombo (x, y, z, letts, scene, col) {
    var letters = printCombo(x, y, z, letts, scene, col);
    var Combo = {letters: letters,
                 vx: Math.random() - 0.5,
                 vy: Math.random() - 0.5,
                 x: x,
                 y: y};

    return function () {
        if (Combo.x + Combo.vx>= window.innerWidth / 6 ||
            Combo.x + Combo.vx<= -window.innerWidth / 6) {
            Combo.vx = -Combo.vx;
        }
        if (Combo.y + Combo.vy >= window.innerHeight / 6 ||
            Combo.y + Combo.vy <= -window.innerHeight / 6) {
            Combo.vy = -Combo.vy;
        }
        Combo.x += Combo.vx;
        Combo.y += Combo.vy;

        for (let i = 0; i < Combo.letters.length; i++) {
            let letter = Combo.letters[i];
            let rnd_x = Math.random() - 0.5;
            let rnd_y = Math.random() - 0.5;
            let rnd_z = Math.random() - 0.5;
            for (let j = 0; j < letter.length; j++) {
                let box = letter[j];
                box.box.position.set(box.x + rnd_x, box.y + rnd_y, box.z + rnd_z);
                box.x += Combo.vx;
                box.y += Combo.vy;
            }
        }
    };
}