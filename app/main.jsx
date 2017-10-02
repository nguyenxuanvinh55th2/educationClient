import React from 'react';
import ReactDOM from 'react-dom'
// ;
import { render } from 'react-dom';
import { ApolloProvider } from 'react-apollo';

import store from './store';
import {client} from './apollo-client';

import {renderRoutes} from './routes.js';

import injectTapEventPlugin from 'react-tap-event-plugin';
// import '../imports/stylesheet/recss/react-select.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import '/node_modules/slick-carousel/slick/slick.css';
// import '/node_modules/slick-carousel/slick/slick-theme.css';
// import '../imports/stylesheet/recss/quill.scss';
injectTapEventPlugin();
ReactDOM.render(
  <ApolloProvider store={store} client={client}>
    <MuiThemeProvider>
        {renderRoutes()}
    </MuiThemeProvider>
  </ApolloProvider>
, document.getElementById('render-target'));
