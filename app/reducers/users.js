import __ from 'lodash';

function users(state = [], action) {
    switch (action.type) {
        case 'LOGIN_COMMAND':
            return Object.assign({}, state, {
                userId: action.user ? action.user._id : "",
                currentUser: action.user ? action.user: {},
                image: action.user.image ? action.user.image : action.user.profile ? action.user.profile.imageUrl : action.user.picture ? action.user.picture.data.url: ''
            });
        default:
            return state;
    }
}

export default users;
