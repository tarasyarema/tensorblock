function key_down_space(Cube) {
    if (GRABBED_OBJECT !== null) {
        console.log(GRABBED_OBJECT);
        GRABBED_OBJECT.position.x = Cube.x;
        GRABBED_OBJECT.position.y = Cube.y+Cube.d/2 + BAR_Y/2;
        GRABBED_OBJECT.material.color.setHex(PLATFORM_COLOR);
        GRABBED_OBJECT = null;

        return 0;
    } else {

        for (var i = 0; i < BARS.length; i++) {
            let bar = BARS[i];
            let xmin = bar.position.x - bar.geometry.parameters.width/2;
            let xmax = bar.position.x + bar.geometry.parameters.width/2;
            let ymin = bar.position.y - bar.geometry.parameters.height/2;
            let ymax = bar.position.y + bar.geometry.parameters.height/2;
            
            if (Cube.x - Cube.d / 2 <= xmax && Cube.x + Cube.d / 2 >= xmin &&
                Cube.y - Cube.d / 2 <= ymax && Cube.y + Cube.d / 2 >= ymin) {
                GRABBED_OBJECT = BARS.pop(i);
                break;
            }
        }
    }
}
