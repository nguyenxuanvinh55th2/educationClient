import React from 'react';
import ReactDOM from 'react-dom'
import { render } from 'react-dom';
import {Router, Route, IndexRoute} from 'react-router'
import store,{history} from './app/store'

import {client} from './app/apollo-client'
import { ApolloProvider } from 'react-apollo';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './app/components/App.jsx'
import Login from './app/components/Login.jsx'
import Profile from './app/components/Profile.jsx'
import Wall from './app/components/Wall.jsx'
import Home from './app/components/Home.jsx'
import ClassList from './app/components/ClassList.jsx'
import CreateTest from './app/components/CreateTest.jsx'
import CreateSubject from './app/components/CreateSubject.jsx'
import QueryUserPermission from './app/QueryUserPermission.jsx';
import WaitExam from './app/components/WaitExam.jsx';
import StartedExam from './app/components/StartedExam.jsx';
import ManagerSubject from './app/components/ManagerSubject.jsx';
import QuestionStatis from './app/components/QuestionStatis.jsx';
import Authenticate from './app/components/Authenticate.jsx';
import ManagerUserParent from './app/components/ManagerUserParent.jsx';
import { ListUserGiveAss } from './app/components/ChildManagerSubject.jsx'
import UserProfile from './app/components/EditProfile.jsx';

injectTapEventPlugin();
let routes = (
  <ApolloProvider store={store} client={client}>
    <MuiThemeProvider>
        <Router history={history}>
          <Route path='/' component={App}>
            <IndexRoute component={Home}/>
            <Route path="login" component={Login}/>
            <Route path="/authenticate/:id/:code" component={Authenticate}/>
            <Route path="/profile/:id" component={Profile}>
              <IndexRoute component={Wall}/>
              <Route path="/profile/:id/createClass" component={ClassList}/>
              <Route path="/profile/:id/createSubject" component={CreateSubject}/>
              <Route path="/profile/:id/questionSet/:questionSetId" component={QuestionStatis}/>
              <Route path="/profile/:id/managerUser/:childrenId" component={ManagerUserParent}/>
              <Route path="/profile/:id/createTest" component={CreateTest}/>
              <Route path="/profile/:id/userProfile" component={UserProfile} />
              <Route path="/profile/:id/:subjectId" component={ManagerSubject} />
              <Route path="/profile/:id/:subjectId/:topicId" component={ListUserGiveAss} />
            </Route>
            <Route path="/waitExam/:id" component={WaitExam}/>
            <Route path="/startedExam/:id" component={StartedExam}/>
          </Route>
        </Router>
    </MuiThemeProvider>
  </ApolloProvider>
)
export default routes;
