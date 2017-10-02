import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Dialog from 'material-ui/Dialog';
import { createContainer } from 'react-meteor-data';
import moment from 'moment';
import __ from 'lodash';

class ChatContent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="chat-data-form-content">
        {
          this.props.chatContent.content.map((item, idx) => {
            if(item.isCustomer) {
              return (
                <div key={idx} className="chatblock support">
                  <p className="send-at">{ moment(item.createdAt).format('HH:mm') }</p>
                  <p className="chat-name">{this.props.chatContent.user.username}</p>
                  <p className="content"><span>{item.message}</span></p>
                </div>
              )
            } else {
                return (
                  <div key={idx} className="chatblock me">
                    <p className="send-at">{ moment(item.createdAt).format('HH:mm') }</p>
                    <p className="chat-name">Bạn</p>
                    <p className="content"><span>{ item.message }</span></p>
                  </div>
                )
            }
          })
        }
      </div>
    )
  }
}

const ChatContentData = createContainer((ownProps) => {
  Meteor.subscribe('chats');
	return {
		chatContent: Chats.findOne({'_id': ownProps._id})
	}
}, ChatContent);

class ChatManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {height: window.innerHeight, chatContent: null, message: ''};
  }

  handleResize(e) {
      this.setState({height: window.innerHeight});
  }

  componentDidMount() {
      window.addEventListener('resize', this.handleResize.bind(this));
      this.setState({refetch: false});
  }

  componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize.bind(this));
  }

  getChatContent(content) {
    this.setState({chatContent: content});
  }

  render() {
    let { message } = this.state;
    let note = __.find(this.props.chatData, {haveNew: true});
    return (
      <div>
        <div className="col-sm-5" style={{padding: 0}}>
          <div style={{backgroundColor: '#E6E6E6', height: 30, padding: '7px 10px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <h4 style={{margin: 0}}>
              Danh Sách Khách Hàng
            </h4>
            <i className="fa fa-bell" aria-hidden="true" style={{color: note ? 'red' : 'gray', fontSize: 20, marginTop: -3}}></i>
          </div>
          <div style={{height: this.state.height - 125, overflowY: 'auto', overflowX: 'none'}}>
            {
              this.props.chatData ?
              this.props.chatData.map((item, idx) => (
                <div className="btn btn-default" style={{width: '100%', borderRadius: 0, borderTop: 'none', textAlign: 'left', backgroundColor: (this.state.chatContent && item._id === this.state.chatContent._id ? '#eee' : 'white')}} key={idx} onClick={this.getChatContent.bind(this, item)}>
                  <div>
                    <i className="fa fa-bell" aria-hidden="true" style={{color: item.haveNew ? 'red' : 'gray'}}></i>
                    &nbsp;
                    {item.user.username}
                  </div>
                  <div>{item.user.email + ' - ' + item.user.mobile + ' - ' + moment(item.updatedAt).format('DD/MM/YYYY HH:mm')}</div>
                </div>
              )) : <div></div>
            }
          </div>
        </div>
        <div className="col-sm-7">
          <div style={{backgroundColor: '#E6E6E6', height: 30, padding: '7px 10px'}}><h4 style={{margin: 0}}>Nội Dung Chat</h4></div>
          <div className="btn btn-default" style={{width: '100%', borderRadius: 0, borderTop: 'none', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <div style={{ textAlign: 'left'}}>
              <div>{'Tên khách hàng: ' + (this.state.chatContent ? this.state.chatContent.user.username : '')}</div>
              <div>{'Email: ' + (this.state.chatContent ? this.state.chatContent.user.email : '')}</div>
              <div>{'Điện thoại: ' + (this.state.chatContent ? this.state.chatContent.user.mobile : '')}</div>
              <div>{'Thời gian: ' + (this.state.chatContent ? moment(this.state.chatContent.updatedAt).format('DD/MM/YYYY HH:mm') : '')}</div>
            </div>
            <div style={{ textAlign: 'left', width: 200 }}>
              <div>{'Tên quản trị viên: ' + (this.state.chatContent ? this.state.chatContent.manager.username : '')}</div>
            </div>
          </div>
          <div style={{height: this.state.height - 280, overflowY: 'auto', overflowX: 'none', padding: 15, borderRight: '1px solid #E6E6E6',  borderLeft: '1px solid #E6E6E6'}}>
            {
              this.state.chatContent ? <ChatContentData _id={this.state.chatContent._id}/> : <div></div>
            }
          </div>
          {
            <div disabled={((!this.state.chatContent) || (this.state.chatContent.manager._id && (this.state.chatContent.manager._id !== Meteor.userId())))} className="form-group chat-form">
              <textarea disabled={((!this.state.chatContent) || (this.state.chatContent.manager._id && (this.state.chatContent.manager._id !== Meteor.userId())))} style={{borderRadius: 0}} className="form-control" placeholder="Nội dung chat" value={message} onKeyDown={(e) => {
                  var keyCode = e.keyCode;
                  if(message && keyCode == 13) {
                    if(!this.state.chatContent.manager._id) {
                      Chats.update({_id: this.state.chatContent._id}, {$set: {
                        manager: {
                          _id: Meteor.userId(),
                          username: Meteor.user().username
                        }
                      }})
                    }
                    Chats.update({_id: this.state.chatContent._id}, {$push: {
                      content: {
                        isManager: true,
                        message,
                        createdAt: moment().valueOf()
                      }
                    }}, (err) => {
                      if(err) {
                        console.log("message err ", err);
                      }
                    });
                    let chatContent = this.state.chatContent;
                    chatContent.content.push({
                      isManager: true,
                      message,
                      createdAt: moment().valueOf()
                    })
                    this.setState({message: '', chatContent});
                    e.target.value = '';
                  }
                }}
                onChange={({target}) => {
                  this.setState({message: target.value});
                }}
                onClick={() => {
                  Chats.update({_id: this.state.chatContent._id}, {$set: {
                    haveNew: false
                  }});
                }}>
              </textarea>
            </div>
          }
        </div>
      </div>
    )
  }
}

export default createContainer((ownProps) => {
  Meteor.subscribe('chats');
	return {
		chatData: Chats.find({}, {sort: {updatedAt: -1}}).fetch()
	}
}, ChatManagement);
