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
      if(data){
        let dataUser = JSON.parse(data.loginWithPassword);
        this.props.loginCommand(dataUser.user);
        localStorage.setItem('keepLogin', true);
        localStorage.setItem('Meteor.loginToken', dataUser.token);
        this.props.addNotificationMute({fetchData: true, message: 'Đăng nhập thành công', level: 'success'});
        this.props.handleClose();
      }
    }).catch((err)=>{
      this.props.addNotificationMute({fetchData: true, message: 'Vui lòng kiểm tra lại tên đăng nhập và mật khẩu', level: 'error'})
      this.props.handleClose();
    });
  }
  handleLoginGoogle(response){
    if(response){
      if(this.props.loginWithGoogle){
        this.props.loginWithGoogle(JSON.stringify(response)).then(({data}) => {
          if(data && data.loginWithGoogle){
            let dataUser =  JSON.parse(data.loginWithGoogle);
            localStorage.setItem('keepLogin', true);
            localStorage.setItem('Meteor.loginToken', dataUser.token);
            this.props.loginCommand({
              _id: dataUser.user._id,
              friendList: dataUser.user.friendList,
              googleId: dataUser.user.googleId,
              profile: dataUser.user.profileObj,
              services: dataUser.user.services,
              w3: dataUser.user.w3
            });
            this.props.handleClose();
          }
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
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <img src="/public/imgs/logo_den.png" alt="Dispute Bills" style={{height: 50, width: 200}} />
        </div>
        <div style={{display: 'flex', flexDirection: 'column',alignItems: 'center'}}>
          <h4>ĐĂNG NHẬP</h4>
        </div>
        <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start'}}>
          <div style={{flexDirection: 'column', marginTop: 5, width: '50%'}}>
            <form className="form-horizontal">
              <div className="form-group">
                <div className="col-sm-9 col-sm-offset-3">
                  <input type="text" className="form-control" placeholder="Email" value={this.state.email} onChange={({target}) => this.setState({email: target.value})}/></div>
              </div>
              <div className="form-group">
                <div className="col-sm-9 col-sm-offset-3">
                  <input type="password" className="form-control" placeholder="Mật khẩu" value={this.state.password} onChange={({target}) => this.setState({password: target.value})}/></div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label" ></label>
                <div className="col-sm-9" style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                  <a className="btn btn-link" style={{color: 'black', fontSize: 10}}>Quên mật khẩu</a>
                  <button className="btn btn-primary" type="button" onClick={this.handleLogin.bind(this)}>Đăng Nhập</button>
                </div>
              </div>
          </form>
          </div>
          <div style={{width:'50%',flexDirection: 'column', marginLeft: 15}}>
            <p  style={{textAlign: 'center', fontSize: 13}}>
              Hoặc đăng nhập với
            </p>
            <div style={{textAlign: 'center'}}>
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
                      if(data && data.loginWithFacebook){
                        let dataUser = JSON.parse(data.loginWithFacebook);
                        localStorage.setItem('keepLogin', true);
                        localStorage.setItem('Meteor.loginToken', dataUser.token);
                        this.props.loginCommand(dataUser.user);
                        this.props.handleClose();
                      }
                      else {
                        console.log("failed");
                        this.props.handleClose();
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                      this.props.handleClose();
                    })
                  }
                }
                cssClass="loginFacbook"
                icon="fa-facebook"
              />
            </div>
            <div style={{textAlign: 'center'}}>
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
