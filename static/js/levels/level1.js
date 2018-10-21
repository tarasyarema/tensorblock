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

var REPLAYED = false;


function replaystep(Cube) {
    REPLAYED=true;
    Cube.mat.position.set(level1.init[0], level1.init[1] + CUBE_EDGE/2+PLATFORM_Y/2, 0);
    Cube.x = level1.init[0];
    Cube.y = level1.init[1] + CUBE_EDGE/2+PLATFORM_Y/2;
    key_down_left(Cube);
    step1(Cube);
}

function step7(Cube) {
    if (Cube.x >= 8) {
        setTimeout(step7, 20, Cube)
    }
    else {
        arrow_up(Cube);
        setTimeout(replaystep, 1500, Cube)
    }
}


function step6(Cube) {
    if (Cube.vy >= 0) {
        setTimeout(step6, 20, Cube)
    }
    else {
        key_down_space(Cube);
        key_down_left(Cube);
        step7(Cube)
    }
}


function step5(Cube) {
    if (Cube.x >= 15) {
        setTimeout(step5, 20, Cube)
    }
    else {
        arrow_up(Cube);
        key_down_space(Cube);
        key_down_up(Cube);
        step6(Cube)
    }
}


function step4(Cube) {
    if (Cube.x <= 21) {
        setTimeout(step4, 20, Cube)
    }
    else {
        arrow_up(Cube);
        if (REPLAYED) {
            EVENT_LISTENERS_ENABLED = true;
            ENABLE_LOSER = true;
        }
        else {
            key_down_left(Cube);
            step5(Cube)
        }
    }
}


function step3(Cube) {
    if (Cube.x <= 15) {
        setTimeout(step3, 20, Cube)
    }
    else {
        key_down_up(Cube);
        step4(Cube)
    }
}


function step2(Cube) {
    if (Cube.x <= 2) {
        setTimeout(step2, 20, Cube)
    }
    else {
        key_down_up(Cube);
        step3(Cube)
    }
}


function step1(Cube) {
	if (Cube.x >= -7) {
		setTimeout(step1, 20, Cube)
	}
	else {
        arrow_up(Cube);
        key_down_right(Cube);
		step2(Cube)
	}
}


function solution1() {
    EVENT_LISTENERS_ENABLED = false;
    ENABLE_LOSER = false;
    let Cube = start_game(level1);

    key_down_left(Cube);
    step1(Cube);
}