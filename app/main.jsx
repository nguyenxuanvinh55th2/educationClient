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
import './main.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import App from './components/App.jsx'
import Login from './components/Login.jsx'
import Profile from './components/Profile.jsx'
import Wall from './components/Wall.jsx'
import Home from './components/Home.jsx'
import ClassList from './components/ClassList.jsx'
import CreateTest from './components/CreateTest.jsx'
import CreateSubject from './components/CreateSubject.jsx'
import EditSubject from './components/EditSubject.jsx'
import MoveSubject from './components/MoveSubject.jsx'
import QueryUserPermission from './QueryUserPermission.jsx';
import WaitExam from './components/WaitExam.jsx';
import StartedExam from './components/StartedExam.jsx';
import ManagerSubject from './components/ManagerSubject.jsx';
import QuestionStatis from './components/QuestionStatis.jsx';
import Authenticate from './components/Authenticate.jsx';
import ManagerUserParent from './components/ManagerUserParent.jsx';
import { ListUserGiveAss } from './components/ChildManagerSubject.jsx'
import UserProfile from './components/EditProfile.jsx';
import Calendar from './components/Calendar.jsx';

injectTapEventPlugin();
ReactDOM.render(
  <ApolloProvider store={store} client={client}>
    <MuiThemeProvider>
        <Router history={history}>
          <Route path='/' component={App}>
            <IndexRoute component={Home}/>
            <Route path="login" component={Login}/>
            <Route path="/authenticate/:id/:code" component={Authenticate}/>
            <Route path="/profile/:id" component={Profile}>
              <IndexRoute component={Wall}/>
              <Route path="/profile/:id/edit/:subjectId" component={EditSubject} />
              <Route path="/profile/:id/move/:subjectId" component={MoveSubject} />
              <Route path="/profile/:id/calendar" component={Calendar} />
              <Route path="/profile/:id/createClass" component={ClassList}/>
              <Route path="/profile/:id/createSubject" component={CreateSubject}/>
              <Route path="/profile/:id/questionSet/:questionSetId" component={QuestionStatis}/>
              <Route path="/profile/:id/managerUser/:childrenId" component={ManagerUserParent}/>
              <Route path="/profile/:id/createTest" component={CreateTest}/>
              <Route path="/profile/:id/userProfile" component={UserProfile} />
              <Route path="/profile/:id/:subjectId" component={ManagerSubject} />
              <Route path="/profile/:id/:subjectId/:topicId" component={ListUserGiveAss} />
              <Route path="/profile/:id/calendar" component={Calendar} />
            </Route>
            <Route path="/waitExam/:id" component={WaitExam}/>
            <Route path="/startedExam/:id" component={StartedExam}/>
          </Route>
        </Router>
    </MuiThemeProvider>
  </ApolloProvider>
, document.getElementById('root'));
