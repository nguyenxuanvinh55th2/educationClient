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

import App from './components/app.jsx'
import Login from './components/login.jsx'
import Profile from './components/profile.jsx'
import Wall from './components/wall.jsx'
class Home extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>HOme</div>
    )
  }
}
injectTapEventPlugin();
ReactDOM.render(
  <ApolloProvider store={store} client={client}>
    <Router history={history}>
      <Route path='/' component={App}>
        <IndexRoute component={Home}/>
        <Route path="login" component={Login}/>
        <Route path="/profile/:id" component={Profile}>
          <Route path="/profile/:id/wall" component={Wall}/>
        </Route>
      </Route>
    </Router>
  </ApolloProvider>
, document.getElementById('root'));
