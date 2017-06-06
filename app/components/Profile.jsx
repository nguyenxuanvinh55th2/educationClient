import React from 'react';

import { Link, Router, browserHistory } from 'react-router'

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import Header from './Header.jsx';
import LeftBar from './LeftBar.jsx'
import ChatBar from './ChatBar.jsx'
import Notification from './Notification.jsx'
import JoinExamDialog from './JoinExamDialog.jsx'

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
    this.state = {
      height: window.innerHeight,
      sidebarOpen: window.matchMedia(`(min-width: 800px)`).matches,
      chatBarOpen: false,
      showModal: false,
    }
  }
  mediaQueryChanged(e) {
    var mql = window.matchMedia(`(min-width: 800px)`);
    this.setState({sidebarOpen: mql.matches, height: window.innerHeight});
  }
  componentDidMount() {
      window.addEventListener('resize', this.mediaQueryChanged);
  }
  componentWillUnmount() {
      window.removeEventListener('resize', this.mediaQueryChanged);
  }
  handleCloseChat(){
    this.setState({chatBarOpen: false})
  }
  render() {
    let { users } = this.props;
    if(users.userId){
      return(
        <div style={{flexDirection: 'column'}}>
          <Notification loginToken={this.props.loginToken}/>
          <AppBar onLeftIconButtonTouchTap={() => this.setState({sidebarOpen: true
          })} iconClassNameRight="muidocs-icon-navigation-expand-more" style={{backgroundColor: '#ebebeb', height: 47, position: 'fixed'}}
            >
            <div style={{height: 48, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <button type="button" className="btn" style={{width: 90, backgroundColor: '#EEE9E9', border: '1px solid #35bcbf'}} onClick={() => this.setState({showModal: true})}>Thi</button>
            </div>
            <div style={{height: 48, display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 20}}>
              <button type="button" className="btn" style={{width: 90, backgroundColor: '#EEE9E9', border: '1px solid #35bcbf'}} onClick={() => {
                  browserHistory.push('/profile/' + users.userId + '/createTest')
                }}>Tạo kì thi</button>
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
            {
              !window.matchMedia(`(min-width: 1100px)`).matches &&
                <IconButton onClick={() => this.setState({chatBarOpen: true})}>
                  <IconChat color={'#35bcbf'}/>
                </IconButton>
            }
          </AppBar>
          {
            window.matchMedia(`(min-width: 1100px)`).matches &&
            <div style={{width: 200}}>
               <ChatBar {...this.props}/>
            </div>
          }
        {
          window.matchMedia(`(min-width: 800px)`).matches ?
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
            <div style={{width: 256}}>
              <LeftBar {...this.props} sidebarOpen={this.state.sidebarOpen} closeLeftBar={() => this.setState({sidebarOpen: false})}/>
            </div>
            <div style={{width: window.innerWidth - 256 - (window.matchMedia(`(min-width: 1100px)`).matches ? 200 : 0), marginTop: 47, minHeight: this.state.height - 47}}>
              {React.cloneElement(this.props.children, this.props)}
            </div>
          </div> :
          <div style={{display:'flex', flexDirection: 'column'}}>
            <LeftBar {...this.props} sidebarOpen={this.state.sidebarOpen} closeLeftBar={() => this.setState({sidebarOpen: false})}/>
            <div style={{marginTop: 35}}>
                {React.cloneElement(this.props.children, this.props)}
            </div>
          </div>
        }
          <Dialog
            modal={true}
            open={this.state.showModal}
            bodyStyle={{padding: 0}}
            contentStyle={{minHeight:'40%'}}
          >
            <div className="modal-dialog" style={{width: 'auto', margin: 0}}>
                <div className="modal-content">
                  <div className="modal-body" style={{overflowY: 'auto', overflowX: 'hidden'}}>
                    <div>
                      <span className="close" onClick={() => this.setState({showModal: false})}>&times;</span>
                    </div>
                      <JoinExamDialog {...this.props}/>
                  </div>
                </div>
            </div>
          </Dialog>
          <Drawer width={200}  docked={false} openSecondary={true} open={this.state.chatBarOpen}  onRequestChange={() => this.setState({chatBarOpen: false})} >
            <ChatBar {...this.props} handleCloseChat={this.handleCloseChat.bind(this)}/>
         </Drawer>
        </div>
      )
    }
    else {
      if(Meteor.userId()){
        return (
          <div className="spinner spinner-lg"></div>
        )
      }
      else {
        return (
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <Header {...this.props}/>
            <div style={{textAlign: 'center', margin: 100}}>Vui lòng đăng nhập để tiếp tục</div>
          </div>
        )
      }
    }
  }
}
