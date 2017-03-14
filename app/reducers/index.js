import { combineReducers } from 'redux';
import { routerReducer} from 'react-router-redux'

import { client } from '../apollo-client.js';

import users from './users.js'
const rootReducer = combineReducers({
  users,
  routing: routerReducer,
  apollo: client.reducer(),
})

export default rootReducer;
