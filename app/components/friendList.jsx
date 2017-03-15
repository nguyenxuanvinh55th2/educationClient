import React, { PropTypes, Component, ReactDom } from 'react';
import { Link, Router, browserHistory } from 'react-router'
import { Grid, Col, Row, Button, FormControl, Dropdown, MenuItem, InputGroup, Glyphicon } from 'react-bootstrap'

class FriendItem extends Component {
  render() {
      return (
        <Col md={6}>
          <Row style={{marginTop: '15px', marginLeft: '15px', paddingTop: '18px', paddingBottom: '15px', width: '95%', border: '1px solid gray'}}>
            <Col md={4}>
              <img className="img-search-item" src={ this.props.item.user.image }></img>
            </Col>
            <Col md={5}>
              <div style={{height: '45px'}}>
                <p style={{fontSize: '16px', width: '100%'}}><b>{ this.props.item.user.name }</b></p>
              </div>
              <p>{this.props.item.user.email}</p>
              { this.props.item.user.social ? <Button bsStyle="primary" href={this.props.item.user.social} target="_blank"> Trang cá nhân </Button> : null }
            </Col>
            <Col md={1}>
              <Dropdown id="dropdown-custom-1" style={{background: 'white', backgroundImage: 'none'}}>
                <Dropdown.Toggle>
                  Bạn bè
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <MenuItem eventKey="1" onClick={e => {
                      if (confirm("Bạn muốn hủy kết bạn với " + this.props.item.user.name) == true) {
                        Meteor.call("removeFriendList", this.props.item._id);
                      }
                   }}>Hủy kết bạn</MenuItem>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </Col>
      )
  }
}

FriendItem.PropTypes = {
  item: PropTypes.object.isRequired
}

export default class FriendList extends Component {
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
    if(this.state.sItem !== '') {
      for(let i = 0; i < friendList.length; i++) {
        var lowerCase = this.renderSearchString(friendList[i].user.name);
        if(lowerCase.indexOf(this.state.sItem) !== -1)
          searchList.push(friendList[i])
      }
      return searchList;
    } else {
      return friendList;
    }
  }

  renderResult() {
    if(!this.props.data || this.props.data.loading)
      return (
        <div className="loader"></div>
      )
    else {
      var friendList = this.searchItem(this.props.data.userChat);
      console.log("friend List", friendList);

      return friendList.map((item) => (
        <FriendItem key={item._id} item={item}/>
      ));
    }
  }

  render() {
    console.log("user chat ", this.props);
    return (
      <div className="friendList">
        <Row>
          <Col mdOffset={8} md={4} style={{marginRight: '1%'}}>
            <InputGroup>
              <FormControl type="text" style={{zIndex: '1'}} onChange={e => {
                  if(e !== null) {
                    this.setState({sItem: this.renderSearchString(e.target.value)})
                  }
                }}/>
              <InputGroup.Addon><Glyphicon glyph="search" /></InputGroup.Addon>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          {this.renderResult()}
        </Row>
      </div>
    )
  }
}

FriendList.PropTypes = {
  data: PropTypes.object.isRequired,
  friendList: PropTypes.object.isRequired
}
