import React from 'react';

import Login from './login.jsx';

export default class ComponentRender extends React.Component {
  render() {
    let type = this.props.location.pathname.replace('/', '');
    switch (type) {
      case 'login':
        return (
          <Login {...this.props}/>
        )
        break;
      default:
    }
  }
}
