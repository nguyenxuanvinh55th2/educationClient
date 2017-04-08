import { combineReducers } from 'redux';
import { routerReducer} from 'react-router-redux'

import { client } from '../apollo-client.js';

import users from './users.js'
import messager from './messager.js'
const rootReducer = combineReducers({
  users,
  messager,
  routing: routerReducer,
  apollo: client.reducer(),
})

export default rootReducer;
