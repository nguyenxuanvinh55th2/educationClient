function loginToken(state = [], action) {
    switch (action.type) {
        case 'CHANGE_LOGIN_TOKEN':
            return action.value
        default:
            return state;
    }
}

export default loginToken;
