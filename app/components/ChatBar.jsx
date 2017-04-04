import React from 'react';

import { browserHistory } from 'react-router';

import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import Drawer from 'material-ui/Drawer';
import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import FontIcon from 'material-ui/FontIcon';

import ChatItem from './ChatItem.jsx';

import {
  blue300,
  indigo900,
  orange200,
  deepOrange300,
  pink400,
  purple500,
} from 'material-ui/styles/colors';
const style = {margin: 5};
class ChatBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sItem: '' };
    this.value = '';
  }

  renderSearchString(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
    str = str.replace(/ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|/g,"o");
    str = str.replace(/u|ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|/g,"u");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|/g,"e");
    str = str.replace(/ì|í|ị|ỉ|ĩ|/g,"i");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ|/g,"y")
    return str;
  }

  searchItem(userList) {
    let searchList = [];
    if(this.state.sItem !== '') {
      for(let i = 0; i < userList.length; i++) {
        var lowerCase = this.renderSearchString(userList[i].user.name);
        if(lowerCase.indexOf(this.state.sItem) !== -1)
          searchList.push(userList[i])
      }
      return searchList;
    } else {
      return userList;
    }
  }

  renderChat() {
    if(!this.props.data || this.props.data.loading)
      return (
        <div className="loader"></div>
      )
    else {
      var userList = this.searchItem(this.props.data.userChat);
      console.log('userList ', this.props.data.userChat);
      return userList.map((item) => (
        <ChatItem {...this.props} key={item._id} userId={item._id} image={item.user.image} userName={item.user.name} lastLogin={item.user.lastLogin} chatId={item.contentId} online={item.user.online} chatContent={item.content}/>
      ));
    }
  }

  render() {
    console.log('this.props ', this.props);
    return (
      <div className="chatbar">
        <div className="chatbar-user">
          <ul className="userList">
            { this.renderChat() }
          </ul>
        </div>
        <div className="chatbar-search">
          <form className="form-horizontal">
              <div className="form-group">
                <div className="col-sm-10">
                  <input type="text" id="modalInput" className="form-control"onChange={e => {
                      if(e !== null) {
                        this.setState({sItem: this.renderSearchString(e.target.value)})
                      }
                    }}/>
                </div>
                <label className="col-sm-2 control-label" htmlFor="modalInput">
                  <i className="fa fa-search" aria-hidden="true"></i>
                </label>
              </div>
          </form>
        </div>
        <div id="chatShow" style={{display: 'none'}}>
        </div>
      </div>
    )
  }
}
const USER_CHAT = gql`
  query userChat($userId: String){
    userChat(userId: $userId) {
      _id
      user {
        name
        image
        online
        lastLogin
        email
        social
      }
      contentId
      content {
        index
        userId
        user{
          _id
          name
          image
        }
        message
        read
        date
      }
    },
}`
export default compose(
graphql(USER_CHAT, {
    options: (ownProps) => ({
      variables: { userId: ownProps.users ? ownProps.users.userId : null},
      forceFetch: true
    }),
}),
)(ChatBar);
