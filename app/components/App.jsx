import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
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
    return (
      <div style={{flexDirection: 'column'}}>
        <div style={{flexDirection: 'column'}}>
        {React.cloneElement(<Header/>, this.props)}
        </div>
        <div style={{marginTop: 65}}>
          {React.cloneElement(this.props.children, this.props)}
        </div>
        {/* <NotificationSystem ref="notificationSystem" /> */}
      </div>
    )
  }
}

const App = connect (mapStateToProps,mapDispathToProps)(Main);

export default App;
