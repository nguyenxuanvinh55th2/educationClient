function google(state = false, action) {
    switch (action.type) {
        case 'LOAD_GOOGLE':
            return action.loaded;
        default:
            return state;
    }
}

export default google;
