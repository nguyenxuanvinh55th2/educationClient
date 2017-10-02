import React, {Component} from 'react';
import __ from 'lodash';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import NotificationSystem from 'react-notification-system';
// import '../javascript/bootstrap.min.js';
import enterprise from 'ag-grid-enterprise/main';
import * as actionCreator from "../actions/actionCreator";
function mapStateToProps(state) {
  return {users: state.users, notification: state.notification, header: state.header, google: state.google}
}
let orLicense = 'NDEwMjMzMzIwMDAwMA==4776ae9eddc069aad222a64b09b9e834';
const reverse = function (s) {
  return s.split('').reverse().join('');
};
const License = reverse(orLicense);
enterprise.LicenseManager.setLicenseKey(reverse(License));

function mapDispathToProps(dispatch) {
  return bindActionCreators(actionCreator, dispatch);
}

class Main extends Component {
  constructor(props) {
    super(props);
  }
  componentWillUpdate(nextProps) {
    let {notification} = nextProps;
    if (notification.fetchData) {
      this._notificationSystem.addNotification({message: notification.message, level: notification.level, position: 'bl'});
      this.props.addNotificationMute({fetchData: false});
    }
  }
  componentDidMount() {
    this._notificationSystem = this.refs.notificationSystemRoot;
  }
  render() {
    let childProps = __.cloneDeep(this.props);
    delete childProps.children;
    return (
      <div>
        {React.cloneElement(this.props.children, childProps)
}
        <NotificationSystem ref="notificationSystemRoot" style={{
          NotificationItem: {
            DefaultStyle: {
              margin: '10px',
              minHeight: 50,
              padding: '10px'
            }
          }
        }}/>
      </div>
    );
  }
}
const App = connect(mapStateToProps, mapDispathToProps)(Main);

export default App;
