import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import store from './store.js'
import { loginCommand } from './action/actionCreator';
import { createContainer } from 'react-meteor-data';
class QueryUserPermission extends React.Component{
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
    render(){
        return <div></div>;
    }
}
const GET_USER_INFO = gql`
    mutation getInfoUser($token: String){
        getInfoUser(token: $token)
    }
`;
//Subscriptions if good
export default compose(
    graphql(GET_USER_INFO, {
      props: ({mutate}) => ({
          getInfoUser: ({token}) => mutate({
              variables: {token}
          })
      })
    }),
)(QueryUserPermission);
