import rootReducer from './reducers';
import { createStore, applyMiddleware, compose} from 'redux';
import {syncHistoryWithStore} from 'react-router-redux';
import { browserHistory} from 'react-router';
import { client } from './apollo-client.js';
const defaultState = {
  users: {},
  notification: {
    fetchData: false,
    level: '', message: '',
    header: 'home',
    google: false
  },
}
const store = createStore(
  rootReducer,
  defaultState,
  compose(
      applyMiddleware(client.middleware()),
      // (typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
  )
);

// export const history = syncHistoryWithStore(browserHistory, store);
export default store;
