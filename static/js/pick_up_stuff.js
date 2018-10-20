

function key_down_backspace(Cube) {
    if (GRABBED_OBJECT !== null) {
        GRABBED_OBJECT.position.set(Cube.x, Cube.y+Cube.d/2 + BAR_Y/2);
        GRABBED_OBJECT.color.set(PLATFORM_COLOR);
        GRABBED_OBJECT = null;
        return 0
    }
    else {
        var bar;
        var xmin;
        var xmax;
        var ymin;
        var ymax;
        for (var i=0; i < BARS.length; i++) {
            bar = BARS[i];
            xmin = bar.position.x - bar.shape.width/2;
            xmax = bar.position.x + bar.shape.width/2;
            ymin = bar.position.y - bar.shape.height/2;
            ymax = bar.position.y + bar.shape.height/2;
            if (Cube.x - Cube.d / 2 <= xmax && Cube.x + Cube.d / 2 >= xmin &&
                Cube.y - Cube.d / 2 <= ymax && Cube.y + Cube.d / 2 >= ymin) {
                BARS.pop(i);
                GRABBED_OBJECT = bar;
                break;
            }
        }
    }
}
