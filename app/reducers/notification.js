function notification(state = [], action) {
    switch (action.type) {
        case 'ADD_NOTIFICATION':
        console.log(action);
            return Object.assign({}, state, action.detail);
        default:
            return state;
    }
}

export default notification;
