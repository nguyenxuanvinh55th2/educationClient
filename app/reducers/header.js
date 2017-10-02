function header(state = 'home', action) {
    switch (action.type) {
        case 'CHANGE_HEADER':
            return action.index;
        default:
            return state;
    }
}

export default header;
