import React, { PropTypes, Component } from 'react'
import { Link, Router, browserHistory } from 'react-router'
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

class FriendItem extends Component {
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
              <div id="dropdown-custom-1" style={{background: 'white', backgroundImage: 'none'}}>
              </div>
            </div>
          </div>
        </div>
      )
  }
}

FriendItem.PropTypes = {
  item: PropTypes.object.isRequired
}

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
        <FriendItem key={item._id} item={item}/>
      ));
    }
  }

  render() {
    console.log('this.props.data.friendList ', this.props.data.friendList)
    return (
      <div className="friendList">
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
