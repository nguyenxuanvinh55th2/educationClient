import React, { PropTypes, Component, ReactDom } from 'react';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import {asteroid} from '../asteroid'

import { Link, Router, browserHistory } from 'react-router'

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.email = {};
    this.password = {};
  }

  render() {
    console.log("this props login", this.props);
    return (
      <div className="login-title">
          <h2 style={{marginLeft:'40%', color: 'white'}}>Đăng nhập</h2>
          <br/>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', padding: 10}}>
            <form className="form-horizontal" style={{width: '50%', borderRight: '1px solid white', paddingRight: '25px'}}>
              <div className="form-group">
                <label className="col-sm-2 control-label" htmlFor="modalInput">Email</label>
                <div className="col-sm-10">
                  <input type="text" id="modalInput" ref={node => {
                    this.email = node
                  }} className="form-control"/>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-2 control-label" htmlFor="modalInputDisabled">Password</label>
                <div className="col-sm-10">
                  <input type="text" id="modalInputDisabled" className="form-control" ref={node => {
                    this.password = node
                  }}/>
                </div>
              </div>
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
            </form>

            <div style={{width: '50%',  paddingLeft: '25px'}}>
              <p style={{color: 'white', fontSize: '15px'}}>Hoặc đăng nhập với</p>

              <GoogleLogin
                clientId="500871646789-sutbet90ovo14nub4f2l190ck6u93cgc.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={(response) => {
                    response['services'] = 'google';
                    response['job'] = '';
                    response['friendList'] = [];
                    this.props.loginGG(response);
                  }
                }
                onFailure={(response) => {}}
                />

              <FacebookLogin
                appId="1055517184541707"
                autoLoad={false}
                fields="name,email,picture"
                callback={(response) => {
                    response['services'] = 'facebook';
                    response['job'] = '';
                    response['friendList'] = [];
                    this.props.loginFB(response);
                  }
                }
                cssClass="my-facebook-button-class"
                />
            </div>
          </div>
      </div>
    )
  }
}

Login.PropTypes = {
  onLogin: PropTypes.func.isRequired,
  onLoginFB: PropTypes.func.isRequired,
  onLoginGG: PropTypes.func.isRequired,
}
