import React, { PropTypes, Component, ReactDom } from 'react';
import { Link, Router, browserHistory } from 'react-router';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import __ from 'lodash';
import { createContainer } from 'react-meteor-data';

import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Dialog from 'material-ui/Dialog';

import ChatRoom from './ChatRoom.jsx';

import  { ChatContents } from 'educationServer/chatContent';

//Meteor.subscribe("user");

class ChatNotificate extends Component {
  render() {
    if(!this.props.show || (this.props.users && this.props.userId === this.props.users.userId)) {
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

class ChatItem extends Component {
  constructor(props) {
      super(props);
      this.state = {showChatRoom: false, showModal: false, childCode: ''};
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
    if(this.state.showChatRoom) {
      return (<ChatRoom {...this.props} refetch={this.props.refetch} id={ this.props.userId } name={ this.props.userName } chatId={ this.props.chatId } chatContent={ this.props.chatContent } number={ number }/>)
    } else {
        return null
    }
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
    return (<ChatNotificate {...this.props} show={ show } number={ number } userId={ userId }></ChatNotificate>)
  }

  openChatRoom(event) {
    let _this = this;
    if(_this.props.handleCloseChat){
      _this.props.handleCloseChat();
      //chang router chat page
    }
    var chatShow = document.getElementById('chatShow');
    this.setState({showChatRoom: true});

    setTimeout(() => {
      var chatRoom = document.getElementById('chatroom' + this.props.userId);
      if(chatShow.style.display === 'none') {
        chatShow.style.display = 'inline';
      }
      if(chatRoom.style.display === 'none') {
        chatRoom.style.display = 'inline';
        chatShow.appendChild(chatRoom);
      }
    }, 50);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.chatEl !== this.props.chatEl) {
      if(!__.find(this.props.chatContent, {_id: nextProps.chatEl._id})) {
        this.props.refetch();
      }
    }
  }

  render() {
      let { users } = this.props;
      return (
          <li style={{marginTop: 10}}>
            { this.renderNotification() }
            { this.renderChatRoom() }
            <button style={{background: 'none', border: 'none'}}>
              <table>
                <tbody>
                  <tr>
                    <td style={{width: '30px'}} onClick={this.openChatRoom.bind(this)}>
                      <img src={ this.props.image } style= {{width: '30px', height: '30px'}}/>
                    </td>
                    <td style={{width: '150px'}} onClick={this.openChatRoom.bind(this)}>
                      <div style={{marginLeft: '10px', textAlign: 'left'}}>{ this.props.userName.length > 9 ? this.props.userName.substring(0, 10) + '...' : this.props.userName }</div>
                    </td>
                    <td>
                      { this.props.isFriend ? (
                          this.props.online ?
                          <div style={{width: '9px', height: '9px', backgroundColor: '#53af13', borderRadius: '50%'}}/> :
                          <div style={{width: '27%', fontSize: '11px', color: 'gray'}}>{this.props.lastLogin}</div>
                        ) :
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                          <IconButton style={{height: 30, width: 30, paddingTop: 0, paddingLeft: 0}} tooltip="Thêm bạn" iconStyle={{color: 'rgb(53, 188, 191)', height: 30, width: 30}} onClick={() => {
                            this.props.insertUserFriend(users.userId, this.props.userId).then(() => {
                              this.props.addNotificationMute({fetchData: true, message: 'Gửi yêu cầu kết bạn thành công', level:'success'});
                            })
                          }}>
                            <i className="material-icons">person_add</i>
                          </IconButton>
                          <IconMenu
                            style={{height: 30, width: 20, paddingTop: 0}}
                            iconButtonElement={<IconButton style={{height: 30, width: 20, paddingTop: 0, paddingLeft: 0}} iconStyle={{color: 'rgb(53, 188, 191)'}}><MoreVertIcon /></IconButton>}
                            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                            targetOrigin={{horizontal: 'left', vertical: 'top'}}
                          >
                            <MenuItem primaryText="Thêm thành viên gia đình" onClick={() => this.setState({showModal: true})}/>
                          </IconMenu>
                        </div>
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
            </button>
            <Dialog
              modal={true}
              open={this.state.showModal}
              autoDetectWindowHeight={false}
              autoScrollBodyContent={false}
              bodyStyle={{padding: 0}}
              contentStyle={{minHeight:'60%', width: 300}}
            >
              <div className="modal-dialog" style={{width: 'auto', margin: 0}}>
                  <div className="modal-content">
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f5f5f5', borderBottom: 'none', padding: '10px 18px'}}>
                      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center',width: '95%'}}>
                        <img src="https://sv1.upsieutoc.com/2017/10/12/logofn2.png" alt="Dispute Bills" style={{height: 50, width: 200}} />
                      </div>
                      <span className="close" onClick={() => this.setState({showModal: false})}>&times;</span>
                    </div>
                    <div className="modal-body" style={{maxHeight:this.state.height - 300, overflowY: 'auto', overflowX: 'hidden'}}>
                      <div className="form-group" style={{height: 25, width: '100%'}}>
                        <label className="col-sm-2 control-label" htmlFor="modalInputDisabled" style={{padding: 0, whiteSpace: 'nowrap'}}>Nhập mã</label>
                        <div className="col-sm-10">
                          <input type="text" className="form-control" placeholder="Mã thành viên" onChange={({target}) => {
                            this.setState({childCode: target.value});
                          }}/>
                        </div>
                      </div>
                      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%'}}>
                        <button disabled={!(this.state.childCode && this.state.childCode !== '')} className="btn" style={{backgroundColor: 'rgb(53, 188, 191)', color: 'white', width: 75}} onClick={() => {
                          this.props.insertChildrent(users.userId, this.state.childCode).then(() => {
                            this.setState({showModal: false});
                            this.props.addNotificationMute({fetchData: true, message: 'Thêm thành công', level: 'success'});
                          })
                        }}>
                          Thêm
                        </button>
                      </div>
                    </div>
                  </div>
              </div>
            </Dialog>
          </li>
      )
  }
}

const ADD_FRIEND = gql`
  mutation insertUserFriend($userId: String!, $_id: String) {
    insertUserFriend(userId: $userId, _id: $_id)
  }`
const ADD_CHILDRENT = gql`
  mutation insertChildrent($userId: String!, $code: String!) {
    insertChildrent(userId: $userId, code: $code)
}`


const ChatItemWithMutate = compose(
  graphql(ADD_FRIEND, {
      props: ({mutate})=> ({
          insertUserFriend : (userId, _id) => mutate({variables:{userId, _id}})
      })
  }),
  graphql(ADD_CHILDRENT, {
      props: ({mutate})=> ({
          insertChildrent : (userId, code) => mutate({variables:{userId, code}})
      })
  }),
)(ChatItem);

export default createContainer((ownProps) => {
  Meteor.subscribe("chatContents", ownProps.users.userId);
  let chatEl = ChatContents.find({userId: ownProps.userId, receiver: ownProps.users.userId}, {index: -1}).fetch().sort((a, b) => b.index - a.index)[0];
  return {
    chatEl
  };
}, ChatItemWithMutate);
