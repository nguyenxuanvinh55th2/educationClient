import React from 'react';

import { Link, Router, browserHistory } from 'react-router'

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import LeftBar from './LeftBar.jsx'
import ChatBar from './ChatBar.jsx'
import Notification from './Notification.jsx'
import NotificationSystem from 'react-notification-system';

import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import Notifications from 'material-ui/svg-icons/social/notifications'
import MapsPlace from 'material-ui/svg-icons/maps/place';
export default class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.notificationSystem = null;
    this.state = {
      sidebarOpen: window.matchMedia(`(min-width: 800px)`).matches,
      chatBarOpen: false
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
    this.setState({sidebarOpen: mql.matches});
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
        })} iconClassNameRight="muidocs-icon-navigation-expand-more" style={{backgroundColor: '#EEE9E9'}}
          >
          <IconMenu open={false} onTouchTap={() => console.log("f")}
          iconButtonElement={<IconButton><MapsPlace /></IconButton>}
          iconStyle={{ fill: 'rgba(0, 0, 0, 0.87)' }}
        >
        </IconMenu>
          <IconMenu open={false} onTouchTap={() => console.log("f")}
          iconButtonElement={<IconButton><MapsPlace /></IconButton>}
          iconStyle={{ fill: 'rgba(0, 0, 0, 0.87)' }}
        >
        </IconMenu>
          <IconMenu open={false} onTouchTap={() => console.log("f")}
          iconButtonElement={<IconButton onClick = {e => {
              let note = document.getElementById('notification');
              if(note.style.display === 'none') {
                  note.style.display = 'inline';
              } else
                  if(note.style.display = 'inline') {
                      note.style.display = 'none';
                  }
          }}><Notifications /></IconButton>}
          iconStyle={{ fill: 'rgba(0, 0, 0, 0.87)' }}
        >
        </IconMenu>
          <IconMenu open={false} onTouchTap={() => this.setState({chatBarOpen: true})}
          iconButtonElement={<IconButton><MapsPlace /></IconButton>}
          iconStyle={{ fill: 'rgba(0, 0, 0, 0.87)' }}
        >
        </IconMenu>
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
          <div style={{width: window.innerWidth -(2*256)}}>
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
      </div>
    )
  }
}
