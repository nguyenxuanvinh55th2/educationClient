import { combineReducers } from 'redux';
import { routerReducer} from 'react-router-redux'

import { client } from '../apollo-client.js';

import users from './users.js'
import messager from './messager.js'
import subjectClass from './subjectClass.js'
import notification from './notification.js'
const rootReducer = combineReducers({
  users,
  messager,
  subjectClass,
  notification,
  routing: routerReducer,
  apollo: client.reducer(),
})

export default rootReducer;
