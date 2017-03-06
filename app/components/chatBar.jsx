import React, { PropTypes, Component, ReactDom } from 'react';
import { Link, Router, browserHistory } from 'react-router'
import { Button, Form, FormControl, ControlLabel, InputGroup, FormGroup, Glyphicon, ListGroup } from 'react-bootstrap'
import store from '../../store';

//import ChatItem from '../chatItem/chatitem.js';

//Meteor.subscribe("user");
export default class ChatBar extends Component {
  constructor(props) {
      super(props);
      this.id = 0;
      var parent = this;
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
      for(i = 0; i < userList.length; i++) {
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
      return userList.map((item) => (
        <ChatItem key={item._id} userId={item._id} image={item.user.image} userName={item.user.name} lastLogin={item.user.lastLogin} chatId={item.contentId} online={item.user.online} chatContent={item.content}/>
      ));
    }
  }

  render() {
    return (
      <div className="chatbar">
        <div className="chatbar-user">
          <ul className="userList">
            { this.renderChat() }
          </ul>
        </div>
        <div className="chatbar-search">
          <Form inline>
            <FormGroup>
              <InputGroup>
                <FormControl type="text" onChange={e => {
                    if(e !== null) {
                      this.setState({sItem: this.renderSearchString(e.target.value)})
                    }
                  }}/>
                <InputGroup.Addon><Glyphicon glyph="search" /></InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </Form>
        </div>
        <div id="chatShow" style={{display: 'none'}}>
        </div>
      </div>
    )
  }
}

ChatBar.PropTypes = {
  //userChat: React.PropTypes.object.isRequired,
  data: React.PropTypes.object.isRequired,
  //refresh: PropTypes.object.isRequired
}
