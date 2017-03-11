import React, { PropTypes, Component, ReactDom } from 'react';
import { Link, Router, browserHistory } from 'react-router'

import { Button, Form, FormControl, ControlLabel, InputGroup, FormGroup, Glyphicon, Col, Grid  } from 'react-bootstrap'

import ChatRoomContain from './chatroom.jsx';

//Meteor.subscribe("user");

class ChatNotificate extends Component {
  render() {

    if(!this.props.show || this.props.userId === Meteor.userId()) {
      return (
        <div></div>
      )
    } else {
      return (
        <div className="chatNotificate">{ this.props.number }</div>
      )
    }
  }
}

ChatNotificate.PropTypes = {
  show: PropTypes.bool.isRequired,
  number: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired
}

export default class ChatItem extends Component {
  constructor(props) {
      super(props);
  }

  renderChatRoom() {
    var count = 0;
    var color = 'white';
    var number = 0;
    var show = false;
    if(this.props.chatId !== null)
      count = this.props.chatContent.length;
      if(count > 0 && !this.props.chatContent[count - 1].read) {
        show = true;
        while(count > 0 && !this.props.chatContent[count - 1].read){
          number ++;
          count --;
        }
      }
    return (<ChatRoomContain id={ this.props.userId } name={ this.props.userName } chatId={ this.props.chatId } chatContent={ this.props.chatContent } number={ number }/>)
  }

  renderNotification() {
    var count = 0;
    var color = 'white';
    var number = 0;
    var show = false;
    var userId = '';

    if(this.props.chatId !== null)
      count = this.props.chatContent.length;
      userId = count > 0 ? this.props.chatContent[count - 1].userId : '';
      if(count > 0 && !this.props.chatContent[count - 1].read) {
        show = true;
        while(count > 0 && !this.props.chatContent[count - 1].read){
          number ++;
          count --;
        }
      }
    return (<ChatNotificate show={ show } number={ number } userId={ userId }></ChatNotificate>)
  }

  openChatRoom(event) {
    var chatRoom = document.getElementById('chatroom' + this.props.userId);
    var chatShow = document.getElementById('chatShow');

    if(chatShow.style.display === 'none') {
      chatShow.style.display = 'inline';
    }

    if(chatRoom.style.display === 'none') {
      chatRoom.style.display = 'inline';
      chatShow.appendChild(chatRoom);
    }
  }

  render() {
      return (
          <li>
            { this.renderNotification() }
            { this.renderChatRoom() }
            <Button style={{background: 'none', border: 'none' }} onClick={this.openChatRoom.bind(this)}>
              <table>
                <tbody>
                  <tr>
                    <td style={ {width: '30px'} }>
                      <img src={ this.props.image } style= {{width: '30px', height: '30px'}}/>
                    </td>
                    <td style={{width: '150px'}}>
                      <div style={{marginLeft: '10px'}}>{ this.props.userName }</div>
                    </td>
                    <td>
                      { this.props.online ? <div style={{width: '9px', height: '9px', backgroundColor: '#53af13', borderRadius: '50%'}}/> : <div style={{width: '27%', fontSize: '11px', color: 'gray'}}>{this.props.lastLogin}</div> }
                    </td>
                  </tr>
                </tbody>
              </table>
            </Button>
          </li>
      )
  }
}
