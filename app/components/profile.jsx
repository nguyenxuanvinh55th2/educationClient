import React from 'react'
import { Link, Router, browserHistory } from 'react-router'

//import LeftBar from '../leftbar/leftbar';
//import ChatBar from '../chatbar/chatbar';

export default class Profile extends React.Component {
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
