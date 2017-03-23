import React from 'react';

import { Link, Router, browserHistory } from 'react-router'

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import LeftBar from './LeftBar.jsx'
import ChatBar from './ChatBar.jsx'
import NotificationSystem from 'react-notification-system';

import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import {List, ListItem} from 'material-ui/List';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import ContentSend from 'material-ui/svg-icons/content/send';
import Subheader from 'material-ui/Subheader';
import Person from 'material-ui/svg-icons/social/person';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import MenuItem from 'material-ui/MenuItem';
import MapsPlace from 'material-ui/svg-icons/maps/place';
export default class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.notificationSystem = null;
    this.state = {
      sidebarOpen: window.matchMedia(`(min-width: 800px)`).matches
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
        <AppBar onLeftIconButtonTouchTap={() => this.setState({sidebarOpen: true
        })} iconClassNameRight="muidocs-icon-navigation-expand-more" style={{backgroundColor: '#2b3a41'}}
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
          iconButtonElement={<IconButton><MapsPlace /></IconButton>}
          iconStyle={{ fill: 'rgba(0, 0, 0, 0.87)' }}
        >
        </IconMenu>
          <IconMenu open={false} onTouchTap={() => console.log("f")}
          iconButtonElement={<IconButton><MapsPlace /></IconButton>}
          iconStyle={{ fill: 'rgba(0, 0, 0, 0.87)' }}
        >
        </IconMenu>
      </AppBar>
      {/* <ChatBar {...this.props} /> */}
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
