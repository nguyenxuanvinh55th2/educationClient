import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import store from './store.js'
import { loginCommand } from './action/actionCreator';
class QueryUserPermission extends React.Component{
    constructor(props){
        super(props);
        setInterval(()=>{
            this.updateToken();
        }, 1000);
        if(!Meteor.status().connected){
            setInterval(()=>{
                // console.log(Meteor.status());
            }, 1000);
        }
        // this.oldToken = localStorage.getItem('Meteor.loginToken');
    }
    updateToken(){
        let { data } = this.props;
        let newToken = localStorage.getItem('Meteor.loginToken');
        // if(this.oldToken !== newToken){
            data.variables.token = localStorage.getItem('Meteor.loginToken');
            // data.refetch();
        //     this.oldToken = localStorage.getItem('Meteor.loginToken');
        // }
    }
    componentWillReceiveProps(nextProps){
      let { data } = nextProps;
      if(data.getInfoUser){
        let parseData = JSON.parse(data.getInfoUser);
        // console.log(store, this.props);
        store.dispatch(loginCommand(parseData));
      }else {
        store.dispatch(loginCommand({}));
      }

    }
    componentDidMount(){
        if(localStorage.getItem('keepLogin')!=='true'){
            if(localStorage.getItem('Meteor.loginToken')){
                this.props.logout({
                    token: localStorage.getItem('Meteor.loginToken')
                }).then(res=>localStorage.removeItem('Meteor.loginToken'));
            }
        }
    }
    render(){
        return <div></div>;
    }
}
const QUERY_USER_INFO = gql`
    query getInfoUser($token: String){
        getInfoUser(token: $token)
    }
`;
const LOGOUT = gql`
  mutation logout($token: String) {
    logoutUser(token: $token)
  }
`;
//Subscriptions if good
export default compose(
    graphql(QUERY_USER_INFO, {
      options: ({token}) => ({
          variables: {token: localStorage.getItem('Meteor.loginToken')},
          //pollInterval: 1000
      }),
    }),
    graphql(LOGOUT, {
        props: ({mutate}) => ({
            logout: ({token}) => mutate({
                variables: {token}
            })
        })
    })
)(QueryUserPermission);
