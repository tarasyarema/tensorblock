function register_event(func) {
    var delta_t = Date.now() - START_TIME;
    CURRENT_MOVEMENTS.push([delta_t, func])
}

function register_run() {
    REGISTERED_MOVEMENTS.push(CURRENT_MOVEMENTS);
    CURRENT_MOVEMENTS = []
}

function identity(Object) {
    pass
}

function run_future(Object, scene){
    if (REGISTERED_MOVEMENTS.length === 0) {
        printCombo(0, 0, 0, 'LOSER', scene, 0x31ffe1)
    }
}