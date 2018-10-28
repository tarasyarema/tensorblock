var USED_PAST = false;

function key_down_space(Cube) {
    if (GRABBED_OBJECT !== null) {
        GRABBED_OBJECT[0] = Cube.x;
        GRABBED_OBJECT[1] = Cube.y + Cube.d/2 + BAR_Y/2;
        NON_GRABBABLE_OBJECTS.push(GRABBED_OBJECT);
        GRABBED_OBJECT = null;

        return 0;
    } else {

        for (let i = 0; i < GRABBABLE_OBJECTS.length; i++) {
            let bar = GRABBABLE_OBJECTS[i];
            let xmin = bar[0] - 1;
            let xmax = bar[0] + 1;
            let ymin = bar[1] - 0.5;
            let ymax = bar[1] + 0.5;
            
            if (Cube.x - Cube.d / 2 <= xmax && Cube.x + Cube.d / 2 >= xmin &&
                Cube.y - Cube.d / 2 <= ymax && Cube.y + Cube.d / 2 >= ymin) {
                GRABBED_OBJECT = GRABBABLE_OBJECTS[i];
                GRABBABLE_OBJECTS.splice(i, 1);
                if (REGISTERED_MOVEMENTS.length > 0) {
                    USED_PAST = true;
                }
                break;
            }
        }
    }
}
