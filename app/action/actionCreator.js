import { createAction, handleAction, handleActions } from 'redux-actions';
import { browserHistory } from 'react-router'

import { asteroid }  from '../asteroid.js'

export function loginCommand(user){
    return {
        type: 'LOGIN_COMMAND',
        user,
    }
}

//action xử lý việc tìm kiếm của user
//---------------------------------------------------------------------------------//
export const search = createAction('SEARCH', (keyWord) => {
return keyWord
})
