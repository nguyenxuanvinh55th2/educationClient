var React = require('react');
var ReactDOM = require('react-dom');
import {Router, Route, IndexRoute} from 'react-router'
import store,{history} from './store'
import App from './components/app'
//import CommentPage from './components/commentPage/commentPage'
//import PostList from './components/post'
import Login from './components/login.jsx'
import Profile from './components/profile.jsx'
//import Account from './containers/login.js'
//import CommentPageContain from './containers/commentPageContain.js'
import {client} from './apollo-client'
import { ApolloProvider } from 'react-apollo';

ReactDOM.render(
  <ApolloProvider store={store} client={client}>
    <Router history={history}>
      <Route path="/" component={App}>
        {/*<Route path="/commentPage/:info" component={CommentPageContain}/>*/}
        <Route path="/login" component={Login}/>
        <Route path="/profile/:userId" component={Profile}/>
        {/*<Route path="/login" component={Account}/>*/}
        {/* <Route path="/salary/:id" component={BargeSalary}></Route> */}
      </Route>
    </Router>
  </ApolloProvider>
, document.getElementById('root'));
