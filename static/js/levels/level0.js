const level0 = {
	"platforms": [[0, 1, 10, 1]],
	"portals": null,
	"exit": [5, 1],
	"init": [0,1],
	"hor_bar": null,
	"spikes_lever": null,
    "id": 0
};

function stopper(cube) {
    if (cube.x <= 4) {
        setTimeout(stopper, 20, cube)
    }
    else{
        arrow_up(cube);
        EVENT_LISTENERS_ENABLED = true;
    }
}

function solution0() {
    EVENT_LISTENERS_ENABLED = false;
    let Cube = start_game(level0);

    key_down_right(Cube);
    stopper(Cube);

}