import React, { PropTypes, Component } from 'react'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag'
import { Link, Router, browserHistory } from 'react-router'

import LeftBar from './leftBar.jsx';
import ChatBar from './chatBar.jsx';
import Wall from './wall.jsx'

import {Row,Col} from 'react-bootstrap'

class Profile extends Component {
  constructor(props) {
      super(props);
      this.state = ({ temp: 'Foo' })
  }

  content() {
    console.log(this.props.data);
    if(this.props.data && !this.props.data.loading) {
      var parent = this;
      var data = {
        loading: this.props.data.loading,
        friendList: this.props.data.userChat
      }
      console.log("message profile", data);
      return <Wall data={data}/>
    } else {
        return (
          <div className="loader"></div>
        )
    }
  }

  render() {
      return (
        <Row>
          <Col md={2}>
            <LeftBar data={{loading: this.props.data.loading, friendList: this.props.data.userChat ? this.props.data.userChat : []}}/>
          </Col>
          <Col md={7}>
          {/*this.props.children*/}
          {this.content()}
          </Col>
          <Col md={2}>
             <ChatBar data={{loading: this.props.data.loading, userChat: this.props.data.userChat ? this.props.data.userChat : []}}/>
          </Col>
        </Row>
      )
  }
}

Profile.PropTypes = {
  data: PropTypes.object.isRequired
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

let userInfo = JSON.parse(localStorage.getItem("userInfo"));

console.log("message ", userInfo);

const mapDataToProps = graphql(
  USER_CHAT,
  {
    options: () => ({ variables: { userId: userInfo ? userInfo._id : null },  pollInterval: 1000 })
  }
);

export default mapDataToProps(Profile);
