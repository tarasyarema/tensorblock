const level2 = {
	"platforms": [[-2, 2, 12, 1], [16, -5, 10, 1], [-2, 15, 10, 1]],
	"portals": [[20, -5]],
	"exit": [0, 15],
	"init": [-2, 2],
	"hor_bar": [[17,-3,2]],
	"spikes_lever":null,
    "id": 2
};


let REPLAYED_2 = false;
let win = false;


function replaystep_2(Cube) {
    REPLAYED_2=true;
    Cube.mat.position.set(level2.init[0], level2.init[1] + CUBE_EDGE/2+PLATFORM_Y/2, 0);
    Cube.x = level2.init[0];
    Cube.y = level2.init[1] + CUBE_EDGE/2+PLATFORM_Y/2;
    key_down_right(Cube);
    step1_2(Cube);
}

function step8_2(Cube) {
    if (Cube.vy >= 0) {
        setTimeout(step8_2, 20, Cube)
    }
    else {
        key_down_space(Cube);
        setTimeout(replaystep_2, 2000, Cube)
    }
}

function step7_2(Cube) {
    if (Cube.vy >= 0.08) {
        setTimeout(step7_2, 20, Cube)
    }
    else {
        arrow_up(Cube);
        step8_2(Cube)
    }
}


function step6_2(Cube) {
    if (Cube.x >= 12.2) {
        setTimeout(step6_2, 20, Cube)
    }
    else {
        arrow_up(Cube);
        key_down_up(Cube);
        key_down_left(Cube);
        step7_2(Cube);
    }
}


function step5_2(Cube){
    if (Cube.x >= 17) {
        setTimeout(step5_2, 20, Cube)
    }
    else {
        arrow_up(Cube);
        key_down_space(Cube);
        key_down_left(Cube);
        step6_2(Cube)
    }
}


function step4_2(Cube) {
    if (Cube.x <= 21) {
        setTimeout(step4_2, 20, Cube)
    }
    else {
        arrow_up(Cube);
        if (REPLAYED_2) {
            EVENT_LISTENERS_ENABLED = true;
            ENABLE_LOSER = true;
        }
        else {
            key_down_left(Cube);
            step5_2(Cube)
        }
    }
}


function step3_2(Cube) {
    if (Cube.x >= -8) {
        setTimeout(step3_2, 20, Cube);
    }
    else {
        arrow_up(Cube);
        key_down_right(Cube);
        step4_2(Cube)
    }
}

function delay(Cube){
    key_down_left(Cube);
    step3_2(Cube);
}

function step2_2_1(Cube) {
    if (!REPLAYED_2) {
        if (Cube.vy >= -0.86) {
            setTimeout(step2_2_1, 20, Cube);
        }
        else {
            key_down_up(Cube);
            key_down_left(Cube);
            step3_2(Cube);
        }
    }
    else {
        if (!Cube.on_platform){
            setTimeout(step2_2_1, 20, Cube);
        }
        else{
            key_down_up(Cube);
            setTimeout(delay, 200, Cube);
        }

    }
}

function step2_2(Cube) {
    if (Cube.vy >= 0.4) {
        setTimeout(step2_2, 20, Cube)
    }
    else {
        arrow_up(Cube);
        step2_2_1(Cube);
    }
}


function step1_2(Cube) {
    if (Cube.x <= 1.5) {
        setTimeout(step1_2, 20, Cube)
    }
    else {
        arrow_up(Cube);
        key_down_right(Cube);
        key_down_up(Cube);
        step2_2(Cube)
    }
}


function solution2() {
    EVENT_LISTENERS_ENABLED = false;
    ENABLE_LOSER = false;
    let Cube = start_game(level2);

    key_down_right(Cube);
    step1_2(Cube);
}