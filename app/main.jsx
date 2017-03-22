import React from 'react';
import ReactDOM from 'react-dom'
import { render } from 'react-dom';
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
import 'ag-grid-root/dist/styles/ag-grid.css';
import 'ag-grid-root/dist/styles/theme-fresh.css';
import './customer.css';

import App from './components/App.jsx'
import Login from './components/Login.jsx'
import Profile from './components/Profile.jsx'
import Wall from './components/Wall.jsx'
import Home from './components/Home.jsx'
import ClassList from './components/ClassList.jsx'
import CreateTest from './components/CreateTest.jsx'
import QueryUserPermission from './QueryUserPermission.jsx';
export class WrapMain extends React.Component{
    constructor(props){
        super(props);
        this.token = null;
        if(localStorage.getItem('keepLogin') === 'true'){
            this.token = localStorage.getItem('Meteor.loginToken');
        } else {
            localStorage.removeItem('Meteor.loginToken');
        }
    }
    render(){
        return (
            <div>
                <QueryUserPermission {...this.props} token={this.token} />
                {React.cloneElement(this.props.children, this.props)}
            </div>
        );
    }
}

injectTapEventPlugin();
ReactDOM.render(
  <ApolloProvider store={store} client={client}>
    <MuiThemeProvider>
      <WrapMain>
        <Router history={history}>
          <Route path='/' component={App}>
            <IndexRoute component={Home}/>
            <Route path="login" component={Login}/>
            <Route path="/profile/:id" component={Profile}>
              <IndexRoute component={Wall}/>
              <Route path="/profile/:id/createClass" component={ClassList}/>
            </Route>
            <Route path="/createTest" component={CreateTest}/>
          </Route>
        </Router>
      </WrapMain>
    </MuiThemeProvider>
  </ApolloProvider>
, document.getElementById('root'));
