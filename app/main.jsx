var React = require('react');
var ReactDOM = require('react-dom');
import {Router, Route, IndexRoute} from 'react-router'
import store,{history} from './store'

import {client} from './apollo-client'
import { ApolloProvider } from 'react-apollo';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'react-grid-layout-root/css/styles.css';
import 'react-resizable-root/css/styles.css';
import 'quill-root/dist/quill.core.css';
import 'quill-root/dist/quill.snow.css';
import 'rc-slider-root/assets/index.css';
import './material.css';
import './ag-pattern.css';
import './react-tab.css';
import './react-tree.css';
import './pattern-fly.css';
import './customer.css'
import App from './components/App.jsx'
import Login from './components/Login.jsx'
import Profile from './components/Profile_Vinh.jsx'
import Wall from './components/Wall_Vinh.jsx'
import Home from './components/Home.jsx'
import LeftBar from './components/LeftBar_Vinh.jsx'
injectTapEventPlugin();
ReactDOM.render(
  <ApolloProvider store={store} client={client}>
    <MuiThemeProvider>
    <Router history={history}>
      <Route path='/' component={App}>
        <IndexRoute component={Home}/>
        <Route path="login" component={Login}/>
        <Route path="/profile/:id" component={Profile}>
          <IndexRoute component={Wall}/>
          {/* <Route path="/profile/:id/wall" component={Wall}/> */}
        </Route>
      </Route>
    </Router>
    </MuiThemeProvider>
  </ApolloProvider>
, document.getElementById('root'));
