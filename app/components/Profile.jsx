import React from 'react';

import { Link, Router, browserHistory } from 'react-router'

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import LeftBar from './LeftBar.jsx'
import ChatBar from './ChatBar.jsx'
import Notification from './Notification.jsx'
import JoinExamDialog from './JoinExamDialog.jsx'
import NotificationSystem from 'react-notification-system';

import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import Notifications from 'material-ui/svg-icons/social/notifications'
import IconChat from 'material-ui/svg-icons/communication/chat';
export default class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.notificationSystem = null;
    this.state = {
      height: window.innerHeight,
      sidebarOpen: window.matchMedia(`(min-width: 800px)`).matches,
      chatBarOpen: false,
      showModal: false,
    }
  }
  addNotification(level,message) {
    this.notificationSystem.addNotification({
      message: message,
      level: level
    });
  }
  mediaQueryChanged(e) {
    var mql = window.matchMedia(`(min-width: 800px)`);
    this.setState({sidebarOpen: mql.matches, height: window.innerHeight});
  }
  componentDidMount() {
      window.addEventListener('resize', this.mediaQueryChanged);
       this.notificationSystem = this.refs.notificationSystem;
  }
  componentWillUnmount() {
      window.removeEventListener('resize', this.mediaQueryChanged);
  }
  render() {
    return(
      <div style={{flexDirection: 'column'}}>
        <Notification/>
        <AppBar onLeftIconButtonTouchTap={() => this.setState({sidebarOpen: true
        })} iconClassNameRight="muidocs-icon-navigation-expand-more" style={{backgroundColor: '#EEE9E9', height: 47, position: 'fixed'}}
          >
          <div style={{height: 48, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <button type="button" className="btn" style={{width: 90, backgroundColor: '#EEE9E9', border: '1px solid #35bcbf'}}>Thi</button>
          </div>
          <div style={{height: 48, display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 20}}>
            <button type="button" className="btn" style={{width: 90, backgroundColor: '#EEE9E9', border: '1px solid #35bcbf'}}>Tạo kì thi</button>
          </div>
          <IconButton onClick = {e => {
              let note = document.getElementById('notification');
              if(note.style.display === 'none') {
                  note.style.display = 'inline';
              } else
                  if(note.style.display = 'inline') {
                      note.style.display = 'none';
                  }
          }}>
            <Notifications color={'#35bcbf'}/>
          </IconButton>
          <IconButton onClick={() => this.setState({chatBarOpen: true})}>
            <IconChat color={'#35bcbf'}/>
          </IconButton>
        </AppBar>
        <div style={{width: 200}}>
           <ChatBar {...this.props}/>
        </div>
      {
        window.matchMedia(`(min-width: 800px)`).matches ?
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
          <div style={{width: 256}}>
            <LeftBar {...this.props} addNotification={this.addNotification.bind(this)} sidebarOpen={this.state.sidebarOpen} closeLeftBar={() => this.setState({sidebarOpen: false})}/>
          </div>
          <div style={{width: window.innerWidth -(2*256), marginTop: 47, minHeight: this.state.height - 47}}>
            {React.cloneElement(this.props.children, this.props)}
          </div>
          <div style={{width: 256}}>

          </div>
        </div> :
        <div style={{display:'flex', flexDirection: 'column'}}>
          <LeftBar {...this.props} sidebarOpen={this.state.sidebarOpen} closeLeftBar={() => this.setState({sidebarOpen: false})}/>
          {React.cloneElement(this.props.children, this.props)}
        </div>
      }
        <Dialog
          modal={true}
          open={this.state.showModal}
          contentStyle={{minHeight:'40%'}}
        >
          <div className="modal-dialog" style={{width: 'auto', margin: 0}}>
              <div className="modal-content">
                <div className="modal-body" style={{maxHeight:this.state.height - 300, overflowY: 'auto', overflowX: 'hidden'}}>
                  <div>
                    <span className="close" onClick={() => this.setState({showModal: false})}>&times;</span>
                  </div>
                    <JoinExamDialog {...this.props}/>
                </div>
              </div>
          </div>
        </Dialog>
      </div>
    )
  }
}
