import React, { PropTypes, Component, ReactDom } from 'react';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import {asteroid} from '../asteroid'

import { Link, Router, browserHistory } from 'react-router'
import CryptoJS from "crypto-js";
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
class Login extends Component {
  constructor(props) {
    super(props)
    this.handleLoginGoogle = this.handleLoginGoogle.bind(this);
    this.state= {
      email: '',
      password: ''
    }
  }
  handleLogin(){
    let { loginWithPassword } = this.props;
    let that = this;
    var encrypted = CryptoJS.AES.encrypt(this.state.password, "def4ult");
    loginWithPassword(that.state.email,encrypted.toString()).then(({data})=>{
        let dataUser = JSON.parse(data.loginWithPassword);
        console.log(dataUser);
        localStorage.setItem('Meteor.loginToken', dataUser.token);
    }).catch(err=>{
    });
  }
  handleLoginGoogle(response){
    if(response){
      if(this.props.loginWithGoogle){
        this.props.loginWithGoogle(JSON.stringify(response)).then(({data}) => {
          console.log(JSON.parse(data.loginWithGoogle));
        })
        .catch((error) => {
          console.log(error);
        });
      }
    }
  }
  render() {
    return (
      <div style={{flexDirection: 'column'}}>
        <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start'}}>
          <div style={{flexDirection: 'column', marginTop: 5, width: '70%'}}>
            <div style={{textAlign: 'center'}}>Đăng nhập với tài khoản Tuielearning</div>
            <form className="form-horizontal">
              <div className="form-group">
                <label className="col-sm-3 control-label" >Tài khoản</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control" value={this.state.email} onChange={({target}) => this.setState({email: target.value})}/></div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label" >Mật khẩu</label>
                <div className="col-sm-9">
                  <input type="password" className="form-control" value={this.state.password} onChange={({target}) => this.setState({password: target.value})}/></div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label" ></label>
                <div className="col-sm-9" style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                  <a style={{color: 'black'}}>Quên mật khẩu</a>
                  <button className="btn btn-primary" type="button" onClick={this.handleLogin.bind(this)}>Đăng Nhập</button>
                </div>
              </div>
          </form>
          </div>
          <div style={{flexDirection: 'column', marginLeft: 15}}>
            <div  style={{textAlign: 'center'}}>
              Hoặc đăng nhập với
            </div>
            <div>
              <FacebookLogin
                appId="265492483877076"
                autoLoad={false}
                reAuthenticate={true}
                textButton="Login with Facebook"
                fields="name,email,picture"
                callback={(response) => {
                    response['services'] = 'facebook';
                    response['job'] = '';
                    response['friendList'] = [];
                    this.props.loginWithFacebook(JSON.stringify(response)).then(({data}) => {
                      console.log(data.loginWithFacebook);
                    })
                    .catch((error) => {
                      console.log(error);
                    })
                  }
                }
                cssClass="loginFacbook"
                icon="fa-facebook"
              />
            </div>
            <div>
              <GoogleLogin
                clientId="500871646789-sutbet90ovo14nub4f2l190ck6u93cgc.apps.googleusercontent.com"
                onSuccess={(response) => {
                    response['services'] = 'google';
                    response['job'] = '';
                    response['friendList'] = [];
                  }
                }
                onSuccess={(response) => {
                  response['services'] = 'google';
                  response['job'] = '';
                  response['friendList'] = [];
                  this.handleLoginGoogle(response);
                }
                }
                onFailure={(response) => {}}
                className="loginGoogle"
                >
                <i className="fa fa-google" aria-hidden="true"></i>
                <span> Login with Google</span>
                </GoogleLogin>
            </div>
          </div>
        </div>
        <div>Bạn chưa tài khoản <a> Đăng kí</a></div>
      </div>
    )
  }
}

const LOGIN = gql`
  mutation loginWithPassword($username: String, $password: String) {
    loginWithPassword(username: $username, password: $password)
  }
`;
const LOGINWITHGOOGLE = gql`
  mutation loginWithGoogle($info: String) {
    loginWithGoogle(info: $info)
  }
`;
const LOGINWITHFACEBOOK = gql`
  mutation loginWithFacebook($info: String) {
    loginWithFacebook(info: $info)
  }
`;
export default compose(
  graphql(LOGIN,{
      props:({mutate})=>({
      loginWithPassword : (username,password) =>mutate({variables:{username,password}})
    })
  }),
  graphql(LOGINWITHGOOGLE,{
      props:({mutate})=>({
      loginWithGoogle : (info) =>mutate({variables:{info}})
    })
  }),
  graphql(LOGINWITHFACEBOOK,{
      props:({mutate})=>({
      loginWithFacebook : (info) =>mutate({variables:{info}})
    })
  }),
)(Login);
