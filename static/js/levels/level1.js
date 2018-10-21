const level1 = {
	"platforms": [[-2, 2, 12], [16, -5, 10], [24, 12, 10]],
	"portals": [[21, -5]],
	"exit": [28, 12],
	"init": [-2, 2],
	"hor_bar": [[16,-3,2]],
	"ver_bar": null,
	"spikes_lever":null,
    "id": 1
};

let REPLAYED_1 = false;


function replaystep_1(Cube) {
    REPLAYED_1=true;
    Cube.mat.position.set(level1.init[0], level1.init[1] + CUBE_EDGE/2+PLATFORM_Y/2, 0);
    Cube.x = level1.init[0];
    Cube.y = level1.init[1] + CUBE_EDGE/2+PLATFORM_Y/2;
    key_down_left(Cube);
    step1_1(Cube);
}

function step7_1(Cube) {
    if (Cube.x >= 8) {
        setTimeout(step7_1, 20, Cube)
    }
    else {
        arrow_up(Cube);
        setTimeout(replaystep_1, 1500, Cube)
    }
}


function step6_1(Cube) {
    if (Cube.vy >= 0) {
        setTimeout(step6_1, 20, Cube)
    }
    else {
        key_down_space(Cube);
        key_down_left(Cube);
        step7_1(Cube)
    }
}


function step5_1(Cube) {
    if (Cube.x >= 15) {
        setTimeout(step5_1, 20, Cube)
    }
    else {
        arrow_up(Cube);
        key_down_space(Cube);
        key_down_up(Cube);
        step6_1(Cube)
    }
}


function step4_1(Cube) {
    if (Cube.x <= 21) {
        setTimeout(step4_1, 20, Cube)
    }
    else {
        arrow_up(Cube);
        if (REPLAYED_1) {
            EVENT_LISTENERS_ENABLED = true;
            ENABLE_LOSER = true;
        }
        else {
            key_down_left(Cube);
            step5_1(Cube)
        }
    }
}


function step3_1(Cube) {
    if (Cube.x <= 15) {
        setTimeout(step3_1, 20, Cube)
    }
    else {
        key_down_up(Cube);
        step4_1(Cube)
    }
}


function step2_1(Cube) {
    if (Cube.x <= 2) {
        setTimeout(step2_1, 20, Cube)
    }
    else {
        key_down_up(Cube);
        step3_1(Cube)
    }
}


function step1_1(Cube) {
	if (Cube.x >= -7) {
		setTimeout(step1_1, 20, Cube)
	}
	else {
        arrow_up(Cube);
        key_down_right(Cube);
		step2_1(Cube)
	}
}


function solution1() {
    EVENT_LISTENERS_ENABLED = false;
    ENABLE_LOSER = false;
    let Cube = start_game(level1);

    key_down_left(Cube);
    step1_1(Cube);
}