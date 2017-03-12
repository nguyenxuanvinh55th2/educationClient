import React, { PropTypes, Component, ReactDom } from 'react';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import {asteroid} from '../asteroid'

import { Link, Router, browserHistory } from 'react-router'

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state= {
      email: '',
      password: ''
    }
  }
  render() {
    return (
      <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', paddingTop: 10}}>
        <div style={{flexDirection: 'column'}}>
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
                  this.props.loginFB(response);
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
                  this.props.loginGG(response);
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
        <div style={{flexDirection: 'column', marginTop: 5}}>
          <form className="form-horizontal">
            <div className="form-group">
              <label className="col-sm-2 control-label" >Tài khoản</label>
              <div className="col-sm-10">
                <input type="text" className="form-control" value={this.state.email} onChange={({target}) => this.setState({email: target.value})}/></div>
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label" >Mật khẩu</label>
              <div className="col-sm-10">
                <input type="password" className="form-control" value={this.state.password} onChange={({target}) => this.setState({password: target.value})}/></div>
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label" ></label>
              <div className="col-sm-10">
                <button className="btn btn-primary" type="button" onClick= {e => {
                      e.preventDefault();
                      asteroid.loginWithPassword({email:this.email.value,password:this.password.value}).then((res) => {
                        let localToken = localStorage.getItem("ws://localhost:3000/websocket__login_token__");
                        if(localToken){
                          localStorage.setItem('Meteor.loginToken',localToken)
                        }
                        this.props.login(localStorage.getItem('Meteor.loginToken'));
                      }).catch((err) => {console.log(err);})
                    }
                  }>Đăng Nhập</button>
              </div>
            </div>
        </form>
        </div>
      </div>
    )
  }
}
