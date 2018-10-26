const level3 = {
	"platforms": [[-20, 15, 10, 1], [10, 15, 10, 1], [-10, 0, 50, 1]],
	"portals": [[12, 0]],
	"exit": [13, 15],
	"init": [-19, 15],
	"hor_bar": [[10, 2, 2]],
	"spikes_lever":null,
	"id": 3
};

let REPLAYED_3 = false;


function replaystep_3(Cube) {
    REPLAYED_3=true;
    Cube.mat.position.set(level3.init[0], level3.init[1] + CUBE_EDGE/2+PLATFORM_Y/2, 0);
    Cube.x = level3.init[0];
    Cube.y = level3.init[1] + CUBE_EDGE/2+PLATFORM_Y/2;
    arrow_up(Cube);
    key_down_right(Cube);
    step1_3(Cube);
}


function step6_3(Cube) {
    if (Cube.vy >= 0) {
        setTimeout(step6_3, 20, Cube)
    }
    else {
        key_down_space(Cube);
        key_down_left(Cube);
        setTimeout(replaystep_3, 2500, Cube);
    }
}


function step5_3(Cube) {
    if (Cube.x >= -2.5) {
        setTimeout(step5_3, 20, Cube)
    }
    else {
        arrow_up(Cube);
        key_down_up(Cube);
        step6_3(Cube)
    }
}


function step4_3(Cube) {
    if (Cube.x >= 10) {
        setTimeout(step4_3, 20, Cube)
    }
    else {
        arrow_up(Cube);
        key_down_space(Cube);
        key_down_left(Cube);
        step5_3(Cube)
    }
}


function step3_3(Cube) {
    if (Cube.x <= 12) {
        setTimeout(step3_3, 20, Cube)
    }
    else {
        if (REPLAYED_3) {
            EVENT_LISTENERS_ENABLED = true;
            ENABLE_LOSER = true;
        }
        else {
            arrow_up(Cube);
            key_down_left(Cube);
            step4_3(Cube)
        }
    }
}


function step2_3(Cube) {
    if (Cube.x <= -2.5) {
        setTimeout(step2_3, 20, Cube)
    }
    else {
        arrow_up(Cube);
        for (let i=0; i < 10; i++) {
            setTimeout(key_down_up, i*20, Cube);
        }
        setTimeout(key_down_right, 200, Cube);
        setTimeout(step3_3, 200, Cube);
    }
}


function step1_3(Cube) {
    if (Cube.x <= -15) {
        setTimeout(step1_3, 20, Cube)
    }
    else {
        key_down_up(Cube);
        step2_3(Cube)
    }
}


function solution3() {
    EVENT_LISTENERS_ENABLED = false;
    ENABLE_LOSER = false;
    let Cube = start_game(level3);

    key_down_right(Cube);
    step1_3(Cube);
}
