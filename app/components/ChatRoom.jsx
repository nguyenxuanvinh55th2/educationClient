import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import __ from 'lodash';

import { Link, Router, browserHistory } from 'react-router'
// import {FB, FacebookApiException} from 'fb';

import { asteroid } from '../asteroid'

class Message extends Component {
  render() {
    if(this.props.users && this.props.userId !== this.props.users.userId) {
      return (
        <tr>
          <td className="td-image">
            <img className="chatImage" style={{marginLeft: '15px'}} src={ this.props.image }/>
          </td>
          <td className="td-message">
            <p className="message-left">
              {this.props.text}
              <br/>
              <span className="messageDate">{moment(this.props.date).format('DD/MM/YYYY, h:mm:ss')}</span>
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
              <span className="messageDate">{moment(this.props.date).format('DD/MM/YYYY, h:mm:ss')}</span>
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

//Meteor.subscribe("user");
class ChatRoom extends Component {
  constructor(props) {
      super(props);
      this.index = this.props.chatContent.length;
  }

  renderMessage () {
    if(this.props.chatId === null) {
      return (
        <tr></tr>
      )
    }
    else {
      return this.props.chatContent.map((content, idx) => (
        <Message {...this.props} key={content.index + idx} userId={content.user._id} name={content.user.name} image={content.user.image} text={content.message} date={content.date}/>
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
      if(this.props.chatId !== null && this.props.users && userId !== this.props.users.userId) {
        let token = localStorage.getItem('Meteor.loginToken');
        this.props.updateChatContent(token, this.props.chatId);
      }
    }
  }

  sendMessage(event) {
    const text = ReactDOM.findDOMNode(this.refs.messageInput).value;
    const id = (Math.floor(Math.random()*90000) + 10000).toString();
    const userName = this.props.users.username;/*Meteor.user().profile ? Meteor.user().profile.name : Meteor.user().services.google.name*/
    const userImage = '';
    const userId = this.props.users.userId;
    const date = moment().valueOf();
    let index = 0;
    let token = localStorage.getItem('Meteor.loginToken');

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
      data = JSON.stringify(data);
      this.props.insertChatData(token, data);

      let content = {
        index: index,
        userId: userId,
        message: text,
        read: false,
        date: date,
        chatId: id
      };
      content = JSON.stringify(content);
      this.props.insertChatContent(token, content);

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
        item = JSON.stringify(item);
        this.props.insertChatContent(token, item);
    }

    ReactDOM.findDOMNode(this.refs.messageInput).value = '';
    node = ReactDOM.findDOMNode(this.refs.chatBody);
    node.scrollTop = 300;
  }

  componentDidMount() {
    // node = ReactDOM.findDOMNode(this.refs.chatBody);
    // node.scrollTop = 300;
  }

  render() {
      //var rightSpace = this.props.chatRoomPosition.toString() + 'px';
      return (
        <div id={ 'chatroom' + this.props.id } className=" chatRoom" style={{display: 'none'}}>
          <div className="chat-heading" style={{backgroundColor: '#2f9ce2', color: 'white', height: 40}}>
            <table style={{width: '100%'}}>
              <tbody>
                <tr>
                  <td className="td-room-name">
                    <p className="p-room-name">{ this.props.name }</p>
                  </td>
                  <td className="td-room-closing">
                    <button className="button-chat-closing" onClick= {e => {
                        document.getElementById('chatroom' + this.props.id).style.display = 'none';
                        let chatRooms = document.getElementsByClassName('chatRoom');
                        let childrenCount = 0;
                        __.forEach(chatRooms, item => {
                          item.style.display === 'inline';
                          childrenCount ++;
                        })
                        if(childrenCount === 0) {
                          document.getElementById('chatShow').style.display = 'none';
                        }
                      }}>X</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div ref="chatBody" className="chat-body">
            <table>
              <tbody>
                { this.renderMessage() }
              </tbody>
            </table>
          </div>
          <div className="chat-footer" style={{backgroundColor: '#2f9ce2', color: 'white'}}>
            <div style={{marginTop: '-5px'}}>
              <textarea ref="messageInput" className="input-chat" rows="3" cols="50" id="comment" onClick={this.readMessenger.bind(this)}></textarea>
              <button className="button-chat-send btn btn-success" style={{padding: '0px', backgroundColor: 'transparent', backgroundImage: 'url("")', borderColor: 'white'}} onClick={this.sendMessage.bind(this)}>
                <i className="fa fa-play" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      )
  }
}

const INSERT_CHAT_DATA = gql`
    mutation insertChatData ($token: String!, $info: String!) {
        insertChatData(token: $token, info: $info)
}`

const INSERT_CHAT_CONTENT = gql`
    mutation insertChatContent ($token: String!, $info: String!) {
        insertChatContent(token: $token, info: $info)
}`

const UPDATE_CHAT_CONTENT = gql`
    mutation updateChatContent ($token: String!, $chatId: String!) {
        updateChatContent(token: $token, chatId: $chatId)
}`

export default compose (
    graphql(INSERT_CHAT_DATA, {
        props: ({mutate})=> ({
            insertChatData : (token, info) => mutate({variables:{token, info}})
        })
    }),
    graphql(INSERT_CHAT_CONTENT, {
        props: ({mutate})=> ({
            insertChatContent : (token, info) => mutate({variables:{token, info}})
        })
    }),
    graphql(UPDATE_CHAT_CONTENT, {
        props: ({mutate})=> ({
            updateChatContent : (token, chatId) => mutate({variables:{token, chatId}})
        })
    }),
)(ChatRoom);