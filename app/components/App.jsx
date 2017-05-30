import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import __ from 'lodash'
import * as actionCreator from "../action/actionCreator"
import React from 'react'
import NotificationSystem from 'react-notification-system';
import Header from './Header.jsx';
import { Meteor } from 'meteor/meteor';
function mapStateToProps(state){
  return {
    users: state.users,
    subjectClass: state.subjectClass,
    notification: state.notification
  }
}

function mapDispathToProps(dispatch) {
  return bindActionCreators(actionCreator, dispatch);
}

class Main extends React.Component {
  constructor(props){
    super(props);
  }
  componentWillUpdate(nextProps){
    let {notification} = nextProps;
    if(notification.fetchData){
      this._notificationSystem.addNotification({
       message: notification.message,
       level: notification.level,
       position: 'bl'
     });
     this.props.addNotificationMute({fetchData: false});
    }
  }
  componentDidMount() {
    this._notificationSystem = this.refs.notificationSystemRoot;
  }
  render(){
    let childProps = __.cloneDeep(this.props);
    delete childProps.children;
    return (
      <div style={{flexDirection: 'column'}}>
        {React.cloneElement(this.props.children, childProps)}
        <NotificationSystem ref="notificationSystemRoot" style={{NotificationItem: {DefaultStyle: {margin: '10px', minHeight: 50, padding: '10px'}}}} />
      </div>
    )
  }
}

const App = connect (mapStateToProps,mapDispathToProps)(Main);

export default App;
