import { createAction, handleAction, handleActions } from 'redux-actions';
import { browserHistory } from 'react-router'

export function loginCommand(user){
    return {
        type: 'LOGIN_COMMAND',
        user,
    }
}
export function subjectClassMutation(detail){
    return {
        type: 'SUBJECT_CLASS_MUTATION',
        detail,
    }
}
export function addNotificationMute(detail){
    return {
        type: 'ADD_NOTIFICATION',
        detail
    }
}
