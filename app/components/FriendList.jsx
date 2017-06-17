import React, { PropTypes, Component } from 'react'
import { Link, Router, browserHistory } from 'react-router'
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { Meteor } from 'meteor/meteor';

class FriendItem extends Component {
  constructor(props) {
    super(props);
    this.state = {open: false};
  }
  render() {
      return (
        <div className="col-sm-6">
          <div style={{marginTop: '15px', marginLeft: '15px', paddingTop: '18px', paddingBottom: '15px', width: '95%', border: '1px solid gray', height: 150}}>
            <div className="col-sm-4">
              <img className="img-search-item" src={ this.props.item.image }></img>
            </div>
            <div className="col-sm-5">
              <div style={{height: '45px'}}>
                <p style={{fontSize: '16px', width: '100%'}}><b>{ this.props.item.fullName ? this.props.item.fullName : this.props.item.name }</b></p>
              </div>
              <p>{this.props.item.email}</p>
            </div>
            <div className="col-sm-1">
              <button className="btn" style={{backgroundColor: '#35bcbf', color: 'white'}} onClick={(event) => this.setState({open: true, anchorEl: event.currentTarget})}>Bạn bè</button>
              <Popover
                open={this.state.open}
                anchorEl={this.state.anchorEl}
                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                onRequestClose={() => this.setState({open: false})}
              >
                <Menu>
                  <MenuItem primaryText="Hủy kết bạn" onClick={() => {
                    this.props.unFriend(Meteor.userId(), this.props.item._id).then(() => {
                      this.props.refetch();
                    })
                  }}/>
                </Menu>
              </Popover>
            </div>
          </div>
        </div>
      )
  }
}

const UN_FRIEND = gql`
    mutation unFriend($userId: String!, $friendId: String!) {
      unFriend(userId: $userId, friendId: $friendId)
}`

const FriendItemMutate = compose(
graphql(UN_FRIEND, {
    props: ({mutate})=> ({
        unFriend : (userId, friendId) => mutate({variables:{userId, friendId}})
    })
}),
)(FriendItem);


class FriendList extends Component {
  constructor(props) {
    super(props);
    this.state = { sItem: '' };
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

  searchItem(friendList) {
    let searchList = [];
    if(this.state.sItem !== '' && this.state.sItem) {
      for(let i = 0; i < friendList.length; i++) {
        var lowerCase = this.renderSearchString(friendList[i].name);
        if(lowerCase.indexOf(this.state.sItem) !== -1)
          searchList.push(friendList[i])
      }
      return searchList;
    } else {
      return friendList;
    }
  }

  renderResult() {
    if(!this.props.data || !this.props.data.friendList)
      return (
        <div className="loader"></div>
      )
    else {
      var friendList = this.searchItem(this.props.data.friendList);
      return friendList.map((item) => (
        <FriendItemMutate key={item._id} item={item} refetch={this.props.data.refetch}/>
      ));
    }
  }

  render() {
    return (
      <div className="friendList" style={{backgroundColor: '#F0F0F0'}}>
        <div className="col-sm-offset-8 col-sm-4" style={{marginRight: '1%'}}>
          <div className="col-sm-10" style={{paddingRight: 0}}>
                <input type="text" id="modalInput" className="form-control" onChange={({target}) => {
                    //if(target.value && target.value !== '') {
                      this.setState({sItem: this.renderSearchString(target.value)})
                    //}
                    this.setState({searchList: []});
                  }}/>
          </div>
          <label className="col-sm-2 control-label" htmlFor="modalInput">
            <i className="fa fa-search" aria-hidden="true"></i>
          </label>
        </div>
        <div>
          {this.renderResult()}
        </div>
      </div>
    )
  }
}

const FRIEND_LIST = gql`
  query friendList($userId: String!){
    friendList(userId: $userId) {
      _id
      name
      image
      email
      social
      fullName
    },
  }`

export default compose(
  graphql(FRIEND_LIST, {
      options: (ownProps) => ({
        variables: { userId: ownProps.users ? ownProps.users.userId : ''},
        forceFetch: true
      }),
  })
)(FriendList);
