var renderingInfo = {
    canvas: null,
    gl: null,
    normalProgram: null,
    playerBuffer: null,
    levelBuffer: null,
    portalsBuffer: null,
    floatingLettersBuffer: null,
    bigLettersBuffer: null,
    ambientLight: [0.8862745098, 0.8862745098, 0.8862745098],
    directionalLightDirection: normalizeVector([0, 3, 1]),
    directionalLightColor: [0.15, 0.15, 0.15],
    backgroundColor: [1, 0.847, 0.92],
    cameraPosition: [0, 0, 35]
};

function initWebGL(canvas){
    renderingInfo.canvas = canvas;
    let gl = canvas.getContext("webgl");
    renderingInfo.gl = gl;
    
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    {
        let program = webglUtils.createProgramFromScripts(gl, ["normalProgramVertexShader", "normalProgramFragmentShader"]);
        
		let matrixLocation = gl.getUniformLocation(program, "u_matrix");
		let ambientLightLocation = gl.getUniformLocation(program, "u_ambient_light");
		let directionalLightColorLocation = gl.getUniformLocation(program, "u_directional_light_color");
		let directionalLightDirectionLocation = gl.getUniformLocation(program, "u_directional_light_direction");
        
		let positionLocation = gl.getAttribLocation(program, "a_position");
		let normalLocation = gl.getAttribLocation(program, "a_normal");
        let colorLocation = gl.getAttribLocation(program, "a_color");
        
        gl.enableVertexAttribArray(positionLocation);
        gl.enableVertexAttribArray(normalLocation);
        gl.enableVertexAttribArray(colorLocation);
        
        renderingInfo.normalProgram = {
            id: program,
            matrixLocation: matrixLocation,
            ambientLightLocation: ambientLightLocation,
            directionalLightColorLocation: directionalLightColorLocation,
            directionalLightDirectionLocation: directionalLightDirectionLocation,
            positionLocation: positionLocation,
            normalLocation: normalLocation,
            colorLocation: colorLocation,
        };
        renderingInfo.playerBuffer = {
            position: gl.createBuffer(),
            normal: gl.createBuffer(),
            color: gl.createBuffer(),
            count: 0
        }
        renderingInfo.levelBuffer = {
            position: gl.createBuffer(),
            normal: gl.createBuffer(),
            color: gl.createBuffer(),
            count: 0
        }
        renderingInfo.portalsBuffer = {
            position: gl.createBuffer(),
            normal: gl.createBuffer(),
            color: gl.createBuffer(),
            count: 0
        }
        renderingInfo.floatingLettersBuffer = {
            position: gl.createBuffer(),
            normal: gl.createBuffer(),
            color: gl.createBuffer(),
            count: 0
        }
        renderingInfo.bigLettersBuffer = {
            position: gl.createBuffer(),
            normal: gl.createBuffer(),
            color: gl.createBuffer(),
            count: 0
        }
    }
    resizeWebGL();
    initFloatingLetters();
}

function resizeWebGL(){
    let canvas = renderingInfo.canvas;
    let gl = renderingInfo.gl;
    canvas.width = window.innerWidth;
    canvas.height =  window.innerHeight;
    gl.viewport(0, 0,  canvas.width, canvas.height);
}

function normalizeVector(v){
    let l = Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);
    return [v[0]/l, v[1]/l, v[2]/l];
}
function getCubeArrays(x, y, z, dx, dy, dz, rgba){
    let x0 = x-dx;
    let x1 = x+dx;
    let y0 = y-dy;
    let y1 = y+dy;
    let z0 = z-dz;
    let z1 = z+dz;
    let r = rgba[0];
    let g = rgba[1];
    let b = rgba[2];
    let a = rgba[3];
    return [
        [   // Front face
            x0, y0, z1, 1,
            x1, y0, z1, 1,
            x0, y1, z1, 1,
            x0, y1, z1, 1,
            x1, y0, z1, 1,
            x1, y1, z1, 1,
            
            // Back face
            /*x0, y0, z0, 1,
            x1, y0, z0, 1,
            x0, y1, z0, 1,
            x0, y1, z0, 1,
            x1, y0, z0, 1,
            x1, y1, z0, 1,*/
            
            // Top face
            x0, y1, z0, 1,
            x1, y1, z0, 1,
            x0, y1, z1, 1,
            x0, y1, z1, 1,
            x1, y1, z0, 1,
            x1, y1, z1, 1,
            
            // Bottom face
            x0, y0, z0, 1,
            x1, y0, z0, 1,
            x0, y0, z1, 1,
            x0, y0, z1, 1,
            x1, y0, z0, 1,
            x1, y0, z1, 1,
            
            // Right face
            x1, y0, z0, 1,
            x1, y1, z0, 1,
            x1, y0, z1, 1,
            x1, y0, z1, 1,
            x1, y1, z0, 1,
            x1, y1, z1, 1,
            
            // Left face
            x0, y0, z0, 1,
            x0, y1, z0, 1,
            x0, y0, z1, 1,
            x0, y0, z1, 1,
            x0, y1, z0, 1,
            x0, y1, z1, 1,
        ], [
            0, 0, +1,
            0, 0, +1,
            0, 0, +1,
            0, 0, +1,
            0, 0, +1,
            0, 0, +1,
            
            /*0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,*/
            
            0, +1, 0,
            0, +1, 0,
            0, +1, 0,
            0, +1, 0,
            0, +1, 0,
            0, +1, 0,
            
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            
            +1, 0, 0,
            +1, 0, 0,
            +1, 0, 0,
            +1, 0, 0,
            +1, 0, 0,
            +1, 0, 0,
            
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
        ], [
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
            
            /*r, g, b, a,
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,*/
            
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
            
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
            
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
            
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
        ],
        30
    ];
}
function getSquareArrays(x, y, z, dx, dy, dz, rgba){
    let x0 = x-dx;
    let x1 = x+dx;
    let y0 = y-dy;
    let y1 = y+dy;
    let z0 = z-dz;
    let z1 = z+dz;
    let r = rgba[0];
    let g = rgba[1];
    let b = rgba[2];
    let a = rgba[3];
    return [
        [   // Front face
            x0, y0, z1, 1,
            x1, y0, z1, 1,
            x0, y1, z1, 1,
            x0, y1, z1, 1,
            x1, y0, z1, 1,
            x1, y1, z1, 1,
        ], [
            0, 0, +1,
            0, 0, +1,
            0, 0, +1,
            0, 0, +1,
            0, 0, +1,
            0, 0, +1,
        ], [
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
            r, g, b, a,
        ],
        6
    ];
}
function addCubeArrays(x, y, z, dx, dy, dz, rgba, p, n, c, pi, ni, ci){
    let arrays = getCubeArrays(x, y, z, dx, dy, dz, rgba);
    let np = arrays[0];
    let nn = arrays[1];
    let nc = arrays[2];
    for(let i=0; i<np.length; i++, pi++){
        p[pi] = np[i];
    }
    for(let i=0; i<nn.length; i++, ni++){
        n[ni] = nn[i];
    }
    for(let i=0; i<np.length; i++, ci++){
        c[ci] = nc[i];
    }
    return arrays[3];
}
function addSquareArrays(x, y, z, dx, dy, dz, rgba, p, n, c, pi, ni, ci){
    let arrays = getSquareArrays(x, y, z, dx, dy, dz, rgba);
    let np = arrays[0];
    let nn = arrays[1];
    let nc = arrays[2];
    for(let i=0; i<np.length; i++, pi++){
        p[pi] = np[i];
    }
    for(let i=0; i<nn.length; i++, ni++){
        n[ni] = nn[i];
    }
    for(let i=0; i<np.length; i++, ci++){
        c[ci] = nc[i];
    }
    return arrays[3];
}

function doLevelBuffer(level){
    let gl = renderingInfo.gl;
    let buffer = renderingInfo.levelBuffer;
    let p = [], n = [], c = [];
    buffer.count = 0;
    // Platforms
    for (let i = 0; i < level.platforms.length; ++i) {
        let platform = level.platforms[i];
        let x = platform[0];
        let y = platform[1];
        let w = platform[2];
        let t = platform[3];
        
        let arrays = getCubeArrays(x, y, 0, w/2, t/2, 1, [35, 35, 35, 255]);
        p = p.concat(arrays[0]);
        n = n.concat(arrays[1]);
        c = c.concat(arrays[2]);
        buffer.count += arrays[3];
    }
    { // Exit
        let arrays = getCubeArrays(level.exit[0], level.exit[1]+2.5, 0, 0.375, 2, 1, [221, 115, 255, 255]);
        p = p.concat(arrays[0]);
        n = n.concat(arrays[1]);
        c = c.concat(arrays[2]);
        buffer.count += arrays[3];
    }
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(p), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer.normal);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(n), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer.color);
	gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(c), gl.STATIC_DRAW);
    
    let camera = renderingInfo.cameraPosition;
    camera[0] = mean_x(level);
    camera[1] = mean_y(level);
    
    doPortalsBuffer(level);
}
function doPortalsBuffer(level){
    let gl = renderingInfo.gl;
    let buffer = renderingInfo.portalsBuffer;
    let p = [], n = [], c = [];
    buffer.count = 0;
    for (let i = 0; i < level.portals.length; ++i) {
        let portal = level.portals[i];
        var disabled = disabled_portals.indexOf(i) !== -1;
        let x = portal[0];
        let y = portal[1];
        
        let arrays = getCubeArrays(x, y+2.5, 0, 0.375, 2, 1, [255, 221, 115, disabled ? 50 : 255]);
        p = p.concat(arrays[0]);
        n = n.concat(arrays[1]);
        c = c.concat(arrays[2]);
        buffer.count += arrays[3];
    }
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(p), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer.normal);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(n), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer.color);
	gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(c), gl.STATIC_DRAW);
}
function doPlayerBuffer(Cube){
    let gl = renderingInfo.gl;
    let buffer = renderingInfo.playerBuffer;
    let p = [], n = [], c = [];
    buffer.count = 0;
    {
        var d = Cube.d/2;
        let arrays = getCubeArrays(Cube.x, Cube.y, 0, d, d, d, [255, 113, 13, 255]);
        p = p.concat(arrays[0]);
        n = n.concat(arrays[1]);
        c = c.concat(arrays[2]);
        buffer.count += arrays[3];
    }
    for(let i=0; i<GRABBABLE_OBJECTS.length; i++){
        let bar = GRABBABLE_OBJECTS[i];
        let arrays = getCubeArrays(bar[0], bar[1], 0, 1, 0.5, 1, [102, 102, 102, 255]);
        p = p.concat(arrays[0]);
        n = n.concat(arrays[1]);
        c = c.concat(arrays[2]);
        buffer.count += arrays[3];
    }
    if(GRABBED_OBJECT != null){
        let bar = GRABBED_OBJECT;
        let arrays = getCubeArrays(bar[0], bar[1], 0, 1, 0.5, 1, [102, 102, 102, 255]);
        p = p.concat(arrays[0]);
        n = n.concat(arrays[1]);
        c = c.concat(arrays[2]);
        buffer.count += arrays[3];
    }
    for(let i=0; i<NON_GRABBABLE_OBJECTS.length; i++){
        let bar = NON_GRABBABLE_OBJECTS[i];
        let arrays = getCubeArrays(bar[0], bar[1], 0, 1, 0.5, 1, [35, 35, 35, 255]);
        p = p.concat(arrays[0]);
        n = n.concat(arrays[1]);
        c = c.concat(arrays[2]);
        buffer.count += arrays[3];
    }
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(p), gl.DYNAMIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer.normal);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(n), gl.DYNAMIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer.color);
	gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(c), gl.DYNAMIC_DRAW);
}

function hexToRGB(hex){
    return [hex >> 16, (hex >> 8) & 0xff, hex & 0xff, 255];
}
let words = [
    ["blockchain", hexToRGB(0x412432), [110, 105]],
    ["tensorflow", hexToRGB(0xfe123d), [-95, 125]],
    ["p-adic", hexToRGB(0xd61394), [95, -125]],
    ["Galois", hexToRGB(0x01ff00), [-110, -105]],
    ["Hilbert", hexToRGB(0x888888), [0, 0]],
    ["Turing", hexToRGB(0x0092ff), [-80, 82]],
    ["Erdos", hexToRGB(0x20ff9a), [-117, 15]],
    ["Gauss", hexToRGB(0xff85dc), [14, -123]],
    ["Euler", hexToRGB(0x9eff00), [-7, 53]],
    ["Wolfram", hexToRGB(0xff9100), [-53, 72]]
];
let words_vertices = 0;
function initFloatingLetters(){
    for (let w = 0; w < words.length; ++w) {
        let word = words[w];
        
        let a = Math.random()*2*Math.PI;
        word[3] = [0.5*Math.cos(a), 0.5*Math.sin(a)];
        
        let wx = 0;
        let wy = 0;
        
        var ucstr = word[0].toUpperCase();
        word[4] = [];
        for(let l=0; l<ucstr.length; l++){
            
            let num = ucstr.charCodeAt(l);
            if(num < 96){
                num -= 32;
            }else{
                num = 0;
            }
            
            let char = asciiChars[num];
            word[4][l] = [];
            for (var i = 0; i < char.length; ++i) {
                for (var j = 0; j < char[0].length; ++j) {
                    if (char[j][i] != 0){
                        word[4][l].push([wx+i, wy-j]);
                        words_vertices += 6;
                    }
                }
            }
            
            wx += char[0].length+0.5;
        }
    }
}
function doFloatingLettersBuffer(){
    let gl = renderingInfo.gl;
    let buffer = renderingInfo.floatingLettersBuffer;
    let p = new Float32Array(4*words_vertices), n = new Float32Array(3*words_vertices), c = new Uint8Array(4*words_vertices);
    let pi = 0, ni = 0, ci = 0;
    buffer.count = 0;
    for (let w = 0; w < words.length; ++w) {
        let word = words[w];
        word[2][0] += word[3][0];
        word[2][1] += word[3][1];
        let wx = word[2][0];
        let wy = word[2][1];
        if((wx >= window.innerWidth / 6 && word[3][0] > 0) || (wx <= -window.innerWidth / 6 && word[3][0] < 0))
            word[3][0] = -word[3][0];
        if((wy >= window.innerHeight / 6 && word[3][1] > 0) || (wy <= -window.innerHeight / 6 && word[3][1] < 0))
            word[3][1] = -word[3][1];
        
        let color = [word[1][0], word[1][1], word[1][2], 255];
        
        let letter_objects = word[4];
        for(let l=0; l<letter_objects.length; l++){
            let letter_cubes = letter_objects[l];
            
            let rnd_x = Math.random() - 0.5;
            let rnd_y = Math.random() - 0.5;
            let rnd_z = Math.random() - 0.5;
            
            for(let i=0; i<letter_cubes.length; ++i) {
                let plus = addSquareArrays(wx+letter_cubes[i][0]+rnd_x, wy+letter_cubes[i][1]+rnd_y, -150+rnd_z, 0.5, 0.5, 0.5, color, p, n, c, pi, ni, ci);
                pi += 4*plus;
                ni += 3*plus;
                ci += 4*plus;
                //p = p.concat(arrays[0]);
                //n = n.concat(arrays[1]);
                //c = c.concat(arrays[2]);
                buffer.count += plus;
            }
        }
    }
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
	gl.bufferData(gl.ARRAY_BUFFER, p, gl.DYNAMIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer.normal);
	gl.bufferData(gl.ARRAY_BUFFER, n, gl.DYNAMIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer.color);
	gl.bufferData(gl.ARRAY_BUFFER, c, gl.DYNAMIC_DRAW);
}

function doBigLettersBuffer(text, color, x, y, z){
    let gl = renderingInfo.gl;
    let buffer = renderingInfo.bigLettersBuffer;
    let p = [], n = [], c = [];
    buffer.count = 0;
    
    let ox = x;
    var ucstr = text.toUpperCase();
    for(let l=0; l<ucstr.length; l++){
        let num = ucstr.charCodeAt(l);
        if(num < 96){
            num -= 32;
        }else{
            num = 0;
        }

        let char = asciiChars[num];
        for (var i = 0; i < char.length; ++i) {
            for (var j = 0; j < char[0].length; ++j) {
                if (char[j][i] != 0){
                    let arrays = getCubeArrays(x+i, y-j, z, 0.5, 0.5, 0.5, color);
                    p = p.concat(arrays[0]);
                    n = n.concat(arrays[1]);
                    c = c.concat(arrays[2]);
                    buffer.count += arrays[3];
                }
            }
        }

        x += char[0].length+0.5;
    }
    let hx = (x-ox)/2;
    for(let i=0; i<p.length; i+=4){
        p[i] -= hx;
    }
    
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(p), gl.DYNAMIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer.normal);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(n), gl.DYNAMIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer.color);
	gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(c), gl.DYNAMIC_DRAW);
}

function drawScene(Cube){
    let canvas = renderingInfo.canvas;
    let gl = renderingInfo.gl;
    gl.clearColor(renderingInfo.backgroundColor[0], renderingInfo.backgroundColor[1], renderingInfo.backgroundColor[2], 1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    /*var projMatrix = makeProjection(canvas.width, canvas.height, 10000);
    var matrix = makeTranslation(-self.offset.x+canvas.width/4, -self.offset.y-canvas.height/4, 0);
    var scaleMatrix = makeScale(self.zoom);
    matrix = matProd(matrix, projMatrix);
    matrix = matProd(matrix, scaleMatrix);*/
    let camera = renderingInfo.cameraPosition;
    let worldTranslationMatrix = makeTranslation(-camera[0], -camera[1], -camera[2]);
    let perspectiveMatrix = makePerspective(Math.PI/2, canvas.width/canvas.height, 100, -200);
    let screenScaleMatrix = makeScale(1.1);
    let matrix = worldTranslationMatrix;
    matrix = matProd(matrix, perspectiveMatrix);
    matrix = matProd(matrix, screenScaleMatrix);
    //matrix = makeScale(0.1);
    //console.log(matrix);
    /*let matrix = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];*/
    
    {
        let program = renderingInfo.normalProgram;
        
		gl.useProgram(program.id);
        
		gl.uniformMatrix4fv(program.matrixLocation, gl.FALSE, matrix);
        gl.uniform3f(program.ambientLightLocation, renderingInfo.ambientLight[0], renderingInfo.ambientLight[1], renderingInfo.ambientLight[2]);
        gl.uniform3f(program.directionalLightColorLocation, renderingInfo.directionalLightColor[0], renderingInfo.directionalLightColor[1], renderingInfo.directionalLightColor[2]);
        gl.uniform3f(program.directionalLightDirectionLocation, renderingInfo.directionalLightDirection[0], renderingInfo.directionalLightDirection[1], renderingInfo.directionalLightDirection[2]);
        
        {
            let buffer = renderingInfo.playerBuffer;
            if(buffer.count > 0){
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
                gl.vertexAttribPointer(program.positionLocation, 4, gl.FLOAT, false, 0, 0);
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer.normal);
                gl.vertexAttribPointer(program.normalLocation, 3, gl.FLOAT, false, 0, 0);
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer.color);
                gl.vertexAttribPointer(program.colorLocation, 4, gl.UNSIGNED_BYTE, true, 0, 0);

                gl.drawArrays(gl.TRIANGLES, 0, buffer.count);
            }
        }
        {
            let buffer = renderingInfo.levelBuffer;
            if(buffer.count > 0){
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
                gl.vertexAttribPointer(program.positionLocation, 4, gl.FLOAT, false, 0, 0);
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer.normal);
                gl.vertexAttribPointer(program.normalLocation, 3, gl.FLOAT, false, 0, 0);
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer.color);
                gl.vertexAttribPointer(program.colorLocation, 4, gl.UNSIGNED_BYTE, true, 0, 0);

                gl.drawArrays(gl.TRIANGLES, 0, buffer.count);
            }
        }
        {
            let buffer = renderingInfo.portalsBuffer;
            if(buffer.count > 0){
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
                gl.vertexAttribPointer(program.positionLocation, 4, gl.FLOAT, false, 0, 0);
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer.normal);
                gl.vertexAttribPointer(program.normalLocation, 3, gl.FLOAT, false, 0, 0);
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer.color);
                gl.vertexAttribPointer(program.colorLocation, 4, gl.UNSIGNED_BYTE, true, 0, 0);

                gl.drawArrays(gl.TRIANGLES, 0, buffer.count);
            }
        }
        {
            let buffer = renderingInfo.bigLettersBuffer;
            if(buffer.count > 0){
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
                gl.vertexAttribPointer(program.positionLocation, 4, gl.FLOAT, false, 0, 0);
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer.normal);
                gl.vertexAttribPointer(program.normalLocation, 3, gl.FLOAT, false, 0, 0);
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer.color);
                gl.vertexAttribPointer(program.colorLocation, 4, gl.UNSIGNED_BYTE, true, 0, 0);

                gl.drawArrays(gl.TRIANGLES, 0, buffer.count);
                console.log("R");
            }
        }
        {
            let buffer = renderingInfo.floatingLettersBuffer;
            if(buffer.count > 0){
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
                gl.vertexAttribPointer(program.positionLocation, 4, gl.FLOAT, false, 0, 0);
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer.normal);
                gl.vertexAttribPointer(program.normalLocation, 3, gl.FLOAT, false, 0, 0);
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer.color);
                gl.vertexAttribPointer(program.colorLocation, 4, gl.UNSIGNED_BYTE, true, 0, 0);

                gl.drawArrays(gl.TRIANGLES, 0, buffer.count);
            }
        }
    }
		
		
		
	
			
		//gl.activeTexture(gl.TEXTURE0);
		//gl.bindTexture(gl.TEXTURE_2D,self.texture);
		//gl.uniform1i(self.samplerUniform,0);
}

function makeProjection(w,h,d){
	return [
		4/w, 0,   0,   0,
		0,  4/h, 0,   0,
		0,   0,   4/d, 0,
		-1,  1,   0,   1
	];
}
function makePerspective(fieldOfViewInRadians, aspect, near, far) {
	var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
	var rangeInv = 1.0 / (near - far);
	return [
		f / aspect, 0, 0, 0,
		0, f, 0, 0,
		0, 0, (near + far) * rangeInv, -1,
		0, 0, near * far * rangeInv * 2, 0
	];
}
function makeTranslation(x,y,z){
	return [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		x, y, z, 1
	];
}
function makeXRotation(a){
	c=Math.cos(a);
	s=Math.sin(a);
	return [
		1, 0, 0, 0,
		0, c, s, 0,
		0,-s, c, 0,
		0, 0, 0, 1
	];
}
function makeYRotation(a){
	c=Math.cos(a);
	s=Math.sin(a);
	return [
		c, 0,-s, 0,
		0, 1, 0, 0,
		s, 0, c, 0,
		0, 0, 0, 1
	];
}
function makeZRotation(a){
	c=Math.cos(a);
	s=Math.sin(a);
	return [
		 c, s, 0, 0,
		-s, c, 0, 0,
		 0, 0, 1, 0,
		 0, 0, 0, 1
	];
}
function makeScale(s){
	return [
		s, 0, 0, 0,
		0, s, 0, 0,
		0, 0, s, 0,
		0, 0, 0, 1
	]
}
function matProd(a,b){
	var a00 = a[0*4+0];
	var a01 = a[0*4+1];
	var a02 = a[0*4+2];
	var a03 = a[0*4+3];
	var a10 = a[1*4+0];
	var a11 = a[1*4+1];
	var a12 = a[1*4+2];
	var a13 = a[1*4+3];
	var a20 = a[2*4+0];
	var a21 = a[2*4+1];
	var a22 = a[2*4+2];
	var a23 = a[2*4+3];
	var a30 = a[3*4+0];
	var a31 = a[3*4+1];
	var a32 = a[3*4+2];
	var a33 = a[3*4+3];
	var b00 = b[0*4+0];
	var b01 = b[0*4+1];
	var b02 = b[0*4+2];
	var b03 = b[0*4+3];
	var b10 = b[1*4+0];
	var b11 = b[1*4+1];
	var b12 = b[1*4+2];
	var b13 = b[1*4+3];
	var b20 = b[2*4+0];
	var b21 = b[2*4+1];
	var b22 = b[2*4+2];
	var b23 = b[2*4+3];
	var b30 = b[3*4+0];
	var b31 = b[3*4+1];
	var b32 = b[3*4+2];
	var b33 = b[3*4+3];
	return [a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30,
			a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31,
			a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32,
			a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33,
			a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30,
			a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31,
			a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32,
			a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33,
			a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30,
			a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31,
			a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32,
			a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33,
			a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30,
			a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31,
			a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32,
			a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33];
}