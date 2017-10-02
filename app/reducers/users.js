function users(state = [], action) {
    switch (action.type) {
        case 'LOGIN_COMMAND':
            return Object.assign({}, state, action.user);
        default:
            return state;
    }
}

export default users;
