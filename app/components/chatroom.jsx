import React, { PropTypes, Component } from 'react'
import ReactDom from 'react-dom';
import { connect } from 'react-redux';
import { Link, Router, browserHistory } from 'react-router'
import { Label, Panel, Button, Grid, Row, Col, Form, FormGroup, Glyphicon } from 'react-bootstrap'
// import {FB, FacebookApiException} from 'fb';

import { sendMessage } from '../action/actionCreator.js';

import { asteroid } from '../asteroid'

class Message extends Component {
  render() {
    if(this.props.userId !== Meteor.userId()) {
      return (
        <tr>
          <td className="td-image">
            <img className="chatImage" style={{marginLeft: '15px'}} src={ this.props.image }/>
          </td>
          <td className="td-message">
            <p className="message-left">
              {this.props.text}
              <br/>
              <span className="messageDate">{this.props.date}</span>
            </p>
          </td>
          <td></td>
        </tr>
      )
    }
    else {
      return (
        <tr>
          <td></td>
          <td className="td-message">
            <p className="message-right">
              {this.props.text}
              <br/>
              <span className="messageDate">{this.props.date}</span>
            </p>
          </td>
          <td>
            <img className="chatImage" src={ this.props.image }/>
          </td>
        </tr>
      )
    }
  }
};

Message.PropTypes = {
  text: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired
}

//Meteor.subscribe("user");
class ChatRoom extends Component {
  constructor(props) {
      super(props);
      this.index = this.props.chatContent.length;

      //id của thẻ div chứa khung chat
      this.chatRoomId = this.props.id;
  }

  renderMessage () {
    if(this.props.chatId === null) {
      return (
        <tr></tr>
      )
    }
    else {
      return this.props.chatContent.map((content) => (
        <Message key={content.index} userId={content.user._id} name={content.user.name} image={content.user.image} text={content.message} date={content.date}/>
      ));
    }
  }

  componentWillMount() {
    this.index = this.props.chatContent.length
  }

  readMessenger(event) {
    if(this.props.chatId !== null) {
      var count = this.props.chatContent.length - 1;
      var userId = this.props.chatContent[count].userId;
      if(this.props.chatId !== null && userId !== Meteor.userId()) {
        for(i = 0; i < this.props.number; i ++)
          Meteor.call('updateChatData', this.props.chatId);
      }
    }
  }

  sendMessage(event) {
    const text = ReactDOM.findDOMNode(this.refs.messageInput).value;
    const id = (Math.floor(Math.random()*90000) + 10000).toString();
    const userName = Meteor.user().profile ? Meteor.user().profile.name : Meteor.user().services.google.name;
    const userImage = Meteor.user().profile ? Meteor.user().profile.picture : Meteor.user().services.google.picture;
    const userId = Meteor.userId();
    const date = new Date();
    let index = 0

    if(this.props.chatId === null) {

      let data = {
        _id: id,
        createAt: date,
        ownerId: userId,
        members: [
          userId,
          this.props.id
        ],
      };
      asteroid.call("insertChatData", chatData);

      let content = {
        index: index,
        userId: userId,
        message: text,
        read: false,
        date: date,
        chatId: id
      };
      asteroid.call("insertChatContent", content);

    } else {

        let id = this.props.chatId;
        index = this.props.chatContent.length;
        let item = {
            index: index,
            userId: userId,
            message: text,
            read: false,
            date: date,
            chatId: id
        }
        ChatContent.insert(item);

    }

    this.props.onSendMess(index, userName, userImage, text, date, userId)
    this.render();
    ReactDOM.findDOMNode(this.refs.messageInput).value = '';
    node = ReactDOM.findDOMNode(this.refs.chatBody);
    node.scrollTop = 300;
  }

  componentDidMount() {
    let node = ReactDom.findDOMNode(this.refs.chatBody);
    node.scrollTop = 300;
  }

  render() {
      //var rightSpace = this.props.chatRoomPosition.toString() + 'px';
      return (
        <div id={ 'chatroom' + this.props.id } className=" chatRoom" style={{display: 'none'}}>
          <Panel className="chat-heading" style={{backgroundColor: '#2f9ce2', color: 'white'}}>
            <table style={{width: '100%'}}>
              <tbody>
                <tr>
                  <td className="td-room-name">
                    <p className="p-room-name">{ this.props.name }</p>
                  </td>
                  <td className="td-room-closing">
                    <button className="button-chat-closing" onClick= {e => {
                        document.getElementById('chatroom' + this.chatRoomId).style.display = 'none';
                        document.getElementById('chatShow').style.display = 'none';
                        this.prop
                      }}>X</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </Panel>
          <div ref="chatBody" className="chat-body">
            <table>
              <tbody>
                { this.renderMessage() }
              </tbody>
            </table>
          </div>
          <Panel className="chat-footer" style={{backgroundColor: '#2f9ce2', color: 'white'}}>
            <div style={{marginTop: '-5px'}}>
              <textarea ref="messageInput" className="input-chat" rows="3" cols="50" id="comment" onClick={this.readMessenger.bind(this)}></textarea>
              <Button bsStyle="success" className="button-chat-send" style={{padding: '0px', backgroundColor: 'transparent', backgroundImage: 'url("")', borderColor: 'white'}} onClick={this.sendMessage.bind(this)}>
                <Glyphicon glyph="play" />
              </Button>
            </div>
          </Panel>
        </div>
      )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      onSendMess: (index, userName, userImage, message, date) => {
        dispatch(sendMessage(index, userName, userImage, message, date))
      }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatRoom)
