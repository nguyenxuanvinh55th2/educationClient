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
    this.state = { sItem: '', searchList: [] };
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
    if(this.state.sItem && this.state.sItem !== '') {
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
        <div className="spinner spinner-lg"></div>
      )
    else {
      var userList = this.state.searchList.length ? this.state.searchList : this.props.data.userChat;
      return userList.map((item) => (
        <ChatItem {...this.props} isFriend={item.isFriend} key={item._id} userId={item._id} image={item.user.image} userName={item.user.name} lastLogin={item.user.lastLogin} chatId={item.contentId} online={item.user.online} chatContent={item.content}/>
      ));
    }
  }

  render() {
    let { users } = this.props;
    return (
      <div className="chatbar">
        <div className="chatbar-user" style={{paddingTop: 15, overflowY: 'auto', overflowX: 'hidden'}}>
          <ul className="userList">
            { this.renderChat() }
          </ul>
        </div>
        <div className="chatbar-search">
          <form>
              <div className="form-group" style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                <div className="col-sm-10" style={{paddingRight: 0}}>
                  <input type="text" id="modalInput" className="form-control"onChange={({target}) => {
                      if(target.value && target.value !== '') {
                        this.props.searchUser(users.userId, target.value).then(({data}) => {
                          if(data.searchUser && data.searchUser.length > 0) {
                            this.setState({searchList: data.searchUser});
                          } else {
                              this.setState({searchList: []});
                          }
                        })
                      }
                      this.setState({searchList: []});
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
      isFriend
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

const FIND_USER = gql`
    mutation searchUser($userId: String!, $keyWord: String!) {
      searchUser(userId: $userId, keyWord: $keyWord) {
        _id
        isFriend
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
    }
}`

export default compose(
graphql(USER_CHAT, {
    options: (ownProps) => ({
      variables: { userId: ownProps.users ? ownProps.users.userId : null},
      forceFetch: true
    }),
}),
graphql(FIND_USER, {
    props: ({mutate})=> ({
        searchUser : (userId, keyWord) => mutate({variables:{userId, keyWord}})
    })
}),
)(ChatBar);
