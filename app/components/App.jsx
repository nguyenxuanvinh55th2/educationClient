import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import __ from 'lodash'
import * as actionCreator from "../action/actionCreator"
import React from 'react'
import NotificationSystem from 'react-notification-system';
import Header from './Header.jsx';
import { Meteor } from 'meteor/meteor';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import store from '../store.js'
import { loginCommand } from '../action/actionCreator';
function mapStateToProps(state){
  return {
    users: state.users,
    subjectClass: state.subjectClass,
    notification: state.notification
  }
}

function mapDispathToProps(dispatch) {
  return bindActionCreators(actionCreator, dispatch);
}

class Main extends React.Component {
  constructor(props){
    super(props);
    let intervalConnect;
    if(!Meteor.status().connected){
        intervalConnect = setInterval(()=>{
            if(Meteor.status().connected){
                clearInterval(intervalConnect);
            }
        }, 5000);
    }
    if(localStorage.getItem('keepLogin')!=='true'){
        if(localStorage.getItem('Meteor.loginToken')){
            // store.dispatch(loginCommand({}));
            Meteor.logout();
        }
    }
    Meteor.autorun(()=>{
        if(Meteor.status().connected){
            if(Meteor.userId()){
                this.props.getInfoUser({token: localStorage.getItem('Meteor.loginToken')})
                .then(({data})=>{
                    if(data.getInfoUser){
                        let parseData = JSON.parse(data.getInfoUser);
                        store.dispatch(loginCommand(parseData));
                    }
                })
                .catch((err)=>{
                    console.log(err);
                });
            } else {
                store.dispatch(loginCommand({}));
            }
        }
    });
  }
  componentWillUpdate(nextProps){
    let {notification} = nextProps;
    if(notification.fetchData){
      this._notificationSystem.addNotification({
       message: notification.message,
       level: notification.level,
       position: 'bl'
     });
     this.props.addNotificationMute({fetchData: false});
    }
  }
  componentDidMount() {
    this._notificationSystem = this.refs.notificationSystemRoot;
  }
  render(){
    let childProps = __.cloneDeep(this.props);
    delete childProps.children;
    return (
      <div style={{flexDirection: 'column'}}>
        {
          Meteor.userId() && this.props.users.userId ?
          <div>
            {React.cloneElement(this.props.children, childProps)}
            <NotificationSystem ref="notificationSystemRoot" style={{NotificationItem: {DefaultStyle: {margin: '10px', minHeight: 50, padding: '10px'}}}} />
          </div> :
          Meteor.userId() && !this.props.users && !this.props.users.userId ?
          <div className="spinner spinner-lg"></div> :
          <div>
            {React.cloneElement(this.props.children, childProps)}
            <NotificationSystem ref="notificationSystemRoot" style={{NotificationItem: {DefaultStyle: {margin: '10px', minHeight: 50, padding: '10px'}}}} />
          </div>
        }
      </div>
    )
  }
}

const GET_USER_INFO = gql`
    mutation getInfoUser($token: String){
        getInfoUser(token: $token)
    }
`;
 const MutateApp = graphql(GET_USER_INFO, {
     props: ({mutate}) => ({
         getInfoUser: ({token}) => mutate({
             variables: {token}
         })
     })
   })(Main)
const App = connect (mapStateToProps,mapDispathToProps)(MutateApp);

export default App;
