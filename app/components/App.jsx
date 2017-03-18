import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import __ from 'lodash'
import * as actionCreator from "../action/actionCreator"
import React from 'react'

import Profile from './profile.jsx';
import Header from './Header.jsx';
import NotificationSystem from 'react-notification-system';

function mapStateToProps(state){
  return {
    users: state.users,
  }
}

function mapDispathToProps(dispatch) {
  return bindActionCreators(actionCreator, dispatch);
}


class Main extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    let childProps = __.cloneDeep(this.props);
    delete childProps.children;
    return (
      <div style={{flexDirection: 'column'}}>
          {React.cloneElement(this.props.children, childProps)}
      </div>
    )
  }
}

const App = connect (mapStateToProps,mapDispathToProps)(Main);

export default App;
