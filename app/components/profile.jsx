import React from 'react'
import { Link, Router, browserHistory } from 'react-router'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import LeftBar from './leftBar.jsx';
//import ChatBar from '../chatbar/chatbar';

class Profile extends React.Component {
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
     return React.cloneElement(
       parent.props.children,
         {data: data}
     );
   } else {
       return (
         <div className="loader"></div>
       )
   }
 }

 render() {
   console.log("this props ", this.props);
     return (
       <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', padding: 10}}>
         <div className="col-sm-2">
           <LeftBar data={{loading: this.props.data.loading, friendList: this.props.data.userChat ? this.props.data.userChat : []}}/>
         </div>
         <div className="col-sm-7">
         {/*this.props.children*/}
         {this.content()}
         </div>
         <div className="col-sm-2">
            {/*<ChatBar data={{loading: this.props.data.loading, userChat: this.props.data.userChat ? this.props.data.userChat : []}}/>*/}
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

console.log("message", JSON.parse(localStorage.getItem("userInfo")) ? JSON.parse(localStorage.getItem("userInfo"))._id : '');

const mapDataToProps = graphql(
  USER_CHAT,
  {
    options: () => ({ variables: { userId: JSON.parse(localStorage.getItem("userInfo")) ? JSON.parse(localStorage.getItem("userInfo"))._id : '' },  pollInterval: 1000 })
  }
);

export default mapDataToProps(Profile);
