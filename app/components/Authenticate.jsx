import React, { PropTypes, Component } from 'react'
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Link, Router, browserHistory } from 'react-router'

class Authenticate extends Component {
  constructor(props) {
    super(props);
    this.state = {authenticate: false};
    var Cryptr = require('cryptr'),
    cryptr = new Cryptr('ntuquiz123');
    //giải mã thông tin user được chứa trong đường link
    var decryptedString = cryptr.decrypt(this.props.params.code);
    let token = localStorage.getItem('Meteor.loginToken');
    props.authenticateUser(token, decryptedString);
    //this.setState({authenticate: true});
  }

  // componentWillM(nextProps) {
  //   if(nextProps.onAuthenticate && !this.state.authenticate) {
  //     //khởi tạo đối tượng giải mã
  //     var Cryptr = require('cryptr'),
  //     cryptr = new Cryptr('ntuquiz123');
  //
  //     //giải mã thông tin user được chứa trong đường link
  //     var decryptedString = cryptr.decrypt(this.props.params.code);
  //     var userCode = JSON.parse(decryptedString);
  //     let token = localStorage.getItem('Meteor.loginToken');
  //     this.props.onAuthenticate(token, userCode);
  //     this.setState({authenticate: true});
  //   }
  // }

  render() {
    return (
      <p>Đăng ký thành công</p>
    )
  }
}


const AUTHENTICATE = gql`
    mutation authenticateUser ($token: String!, $info: String!) {
      authenticateUser(token: $token, info: $info)
}`

export default compose (
  graphql(AUTHENTICATE, {
      props: ({mutate})=> ({
        authenticateUser : (token, info) => mutate({variables: {token, info}})
      })
  })
)(Authenticate);
