import __ from 'lodash';

function users(state = [], action) {
    switch (action.type) {
        case 'LOGIN_COMMAND':
            return Object.assign({}, state, {
                userId: action.user?action.user._id:"",
                currentUser: action.user,
            });
        default:
            return state;
    }
}

export default users;
