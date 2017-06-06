import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import CryptoJS from "crypto-js";

class Register extends React.Component {

  constructor(props) {
    super(props);

    //---------------------user system services----------------------------//
    this.email = {};
    this.password = {};
    this.repassword = {};
    this.name = {};
    this.old = {};
    this.gender = {
      value: true
    };
    this.address = {};
    this.phone = {};
    this.vertificate = false;

    //error validation
    this.emailError = "";

    //---------------------mail services-------------------------------//
    this.msMail = {};
    this.state = ({email: '', password: '', passwordRetype: '', name: '', old: '', address: '', phone: '', msMail: '', existsUser: false, existEmail: false});
  }

  handleChange(e) {
    if(e.target.id === 'email') {
      this.setState({ email: e.target.value });
      this.props.getExistEmail(e.target.value).then(({data}) => {
        if(data.getExistEmail) {
          console.log("message ", data.getExistEmail);
          this.setState({existEmail: true});
        } else {
            this.setState({existEmail: false});
        }
      });
    } else
        if(e.target.id === 'password')
          this.setState({ password: e.target.value });
        else
          if(e.target.id === 'passwordRetype')
            this.setState({ passwordRetype: e.target.value });
          else
            if(e.target.id === 'old')
              this.setState({ old: e.target.value });
            else
              if(e.target.id === 'name') {
                this.setState({ name: e.target.value });
                this.props.getExistUserName(e.target.value).then(({data}) => {
                  console.log("message ", data.getExistUserName);
                  if(data.getExistUserName) {
                    this.setState({existUser: true});
                  } else {
                      this.setState({existUser: false});
                  }
                });
              } else
                  if(e.target.id === 'address')
                    this.setState({ address: e.target.value });
                  else
                    if(e.target.id === 'msMail')
                      this.setState({ msMail: e.target.value });
                    else
                      this.setState({ phone: e.target.value });
  }

  getEmailValidation() {
    const value = this.state.email;
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
    if (value && re.test(value)) return 'success';
    else return 'error';
  }

  getMsMailValidation() {
    const value = this.state.msMail;
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
    if (value && re.test(value)) return 'success';
    else return 'error';
  }

  getPasswordValidation() {
    const value = this.state.password;
    if (value && value.length > 6) return 'success';
    else return 'error';
  }

  getPasswordRetypeValidation() {
    const value = this.state.passwordRetype;
    if (value && value.length > 6 && value === this.state.password) return 'success';
    else return 'error';
  }

  getNameValidation() {
    const value = this.state.name;
    if (value && value.length > 6) return 'success';
    else return 'error';
  }

  getAddressValidation() {
    const value = this.state.address;
    if (value && value.length > 6) return 'success';
    else return 'error';
  }

  getOldValidation() {
    const value = this.state.old;
    if (value && value.toString() > 6) return 'success';
    else return 'error';
  }

  getPhoneValidation() {
    const value = this.state.phone;
    var re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (value && re.test(value)) return 'success';
    else return 'error';
  }

  render() {
    return (
      <div style={{flexDirection: 'column'}}>
        <div style={{display: 'flex', flexDirection: 'column',alignItems: 'center'}}>
          <h4>ĐĂNG KÝ</h4>
        </div>
        <div className="form-horizontal" style={{display: 'flex',flexDirection: 'column'}}>
          <div className={this.getEmailValidation() === 'success' ? "form-group" : "form-group has-error"}>
            <label className="col-sm-2 control-label" htmlFor="modalInput" style={{paddingRight: 0}}>Địa chỉ email</label>
            <div className="col-sm-8">
              <input id='email' type="text" className="form-control" placeholder="Nhập mật khẩu" placeholder="Email" ref={node => this.email = node } onChange={this.handleChange.bind(this)}/>
              <span className="help-block">{this.state.existEmail ? 'Địa chỉ email đã tồn tại trong hệ thống' : this.getEmailValidation() !== 'success' && 'Địa chỉ mail rỗng hoặc không hợp lệ'}</span>
            </div>
          </div>

          <div className={this.getNameValidation() === 'success' ? "form-group" : "form-group has-error"}>
            <label className="col-sm-2 control-label" htmlFor="modalInputDisabled" style={{paddingRight: 0}}>Tên của bạn</label>
            <div className="col-sm-8">
              <input id='name' type="text" className="form-control" placeholder="Tên của bạn" ref={ node => this.name = node } onChange={this.handleChange.bind(this)}/>
              <span className="help-block">{this.state.existUser ? 'username đã tồn tại trong hệ thống' : this.getNameValidation() !== 'success' && 'Tên của bạn là bắt buộc'}</span>
            </div>
          </div>

          <div className={this.getPasswordValidation() === 'success' ? "form-group" : "form-group has-error"}>
            <label className="col-sm-2 control-label" htmlFor="modalInputDisabled" style={{paddingRight: 0}}>Mật khẩu</label>
            <div className="col-sm-8">
              <input id='password' type="password" className="form-control" placeholder="Mật khẩu" ref={ node => this.password = node } onChange={this.handleChange.bind(this)}/>
              <span className="help-block">{this.getPasswordValidation() !== 'success' && 'Mật khẩu là bắt buộc'}</span>
            </div>
          </div>

          <div className={this.getPasswordRetypeValidation() === 'success' ? "form-group" : "form-group has-error"}>
            <label className="col-sm-2 control-label" htmlFor="modalInputDisabled" style={{paddingRight: 0}}>Nhập lại</label>
            <div className="col-sm-8">
              <input id='passwordRetype' type="password" className="form-control" placeholder="Nhập lại mật khẩu" ref={ node => this.repassword = node } onChange={this.handleChange.bind(this)}/>
              <span className="help-block">{this.getPasswordRetypeValidation() !== 'success' && 'Mật khẩu nhập lại không đúng'}</span>
            </div>
          </div>

          <div className="form-group">
            <label className="col-sm-2 control-label" htmlFor="modalInputDisabled" style={{paddingRight: 0}}>Giới tính</label>
            <div className="col-sm-8">
              <label className="radio-inline">
                <input type="radio" id="radio1" name="radios" value="true" defaultChecked onClick = {
                  e => {
                    this.gender.value = true;
                  }}/>
                  Nam
              </label>
              <label className="radio-inline">
                <input type="radio" id="radio2" name="radios" value="false" onClick= {
                  e => {
                    this.gender.value = false;
                  }}/>
                  Nữ
              </label>
            </div>
          </div>

          <div className={this.getOldValidation() === 'success' ? "form-group" : "form-group has-error"}>
            <label className="col-sm-2 control-label" htmlFor="modalInputError" style={{paddingRight: 0}}>Tuổi của bạn</label>
            <div className="col-sm-8">
              <input id='old' type="number" className="form-control" placeholder="tuổi của bạn" ref={node => {
              this.old = node
            }} onChange={this.handleChange.bind(this)}/>
            <span className="help-block">{this.getOldValidation() !== 'success' && 'Tuổi của bạn là bắt buộc'}</span>
            </div>
          </div>

          <div className={this.getAddressValidation() === 'success' ? "form-group" : "form-group has-error"}>
            <label className="col-sm-2 control-label" htmlFor="modalInputError" style={{paddingRight: 0}}>Địa chỉ</label>
            <div className="col-sm-8">
              <input id='address' type="text" className="form-control" placeholder="Nơi bạn sống" ref={node => {
              this.address = node
            }} onChange={this.handleChange.bind(this)}/>
            <span className="help-block">{this.getAddressValidation() !== 'success' && 'Địa chỉ của bạn là bắt buộc'}</span>
            </div>
          </div>

          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
            <button disabled={!(this.getEmailValidation() === 'success' &&
              this.getPasswordValidation() === 'success' &&
              this.getPasswordRetypeValidation() === 'success' &&
              this.getNameValidation() === 'success' &&
              this.getAddressValidation() === 'success' && !this.state.existEmail && !this.state.existsUser)} className="btn btn-primary" style={{width: 150}} onClick={e => {
              e.preventDefault();
              if( this.getEmailValidation() === 'success' &&
                this.getPasswordValidation() === 'success' &&
                this.getPasswordRetypeValidation() === 'success' &&
                this.getNameValidation() === 'success' &&
                this.getAddressValidation() === 'success' && !this.state.existEmail && !this.state.existsUser ) {
                  let email = this.state.email;
                  let password = this.state.password;
                  let username = this.state.name;
                  let old = this.state.old;
                  let gender = this.gender.value;
                  let address = this.state.address;
                  let info = {
                    email,
                    password,
                    username,
                    old,
                    gender,
                    address,
                  }
                  info = JSON.stringify(info);
                  this.props.register(info).then(() => {
                    this.props.handleClose();
                    let that = this;
                    var encrypted = CryptoJS.AES.encrypt(this.state.password, "def4ult");
                    this.props.loginWithPassword(that.state.email,encrypted.toString()).then(({data})=>{
                      if(data){
                        let dataUser = JSON.parse(data.loginWithPassword);
                        this.props.loginCommand(dataUser.user);
                        localStorage.setItem('keepLogin', true);
                        localStorage.setItem(this.props.loginToken, dataUser.token);
                        this.props.addNotificationMute({fetchData: true, message: 'Đăng nhập thành công', level: 'success'});
                        this.props.handleClose();
                        this.setState({email: '', password: '', passwordRetype: '', name: '', old: '', address: '', phone: ''});
                      }
                    }).catch((err)=>{
                      this.props.addNotificationMute({fetchData: true, message: 'Vui lòng kiểm tra lại tên đăng nhập và mật khẩu', level: 'error'})
                      this.props.handleClose();
                    });
                  });
                }
          }}>
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    )
  }
}

const REGISTER = gql`
    mutation register($info: String!){
        register(info: $info)
}`
const GET_EXIST_USER_NAME = gql`
    mutation getExistUserName($value: String!){
        getExistUserName(value: $value) {
          _id
        }
}`
const GET_EXIST_EMAIL = gql`
    mutation getExistEmail($value: String!){
        getExistEmail(value: $value) {
          _id
        }
}`

const LOGIN = gql`
  mutation loginWithPassword($username: String, $password: String) {
    loginWithPassword(username: $username, password: $password)
  }
`;



export default compose (
    graphql(REGISTER, {
        props: ({mutate})=> ({
          register : (info) => mutate({variables:{info}})
        })
    }),
    graphql(GET_EXIST_USER_NAME, {
        props: ({mutate})=> ({
          getExistUserName : (value) => mutate({variables:{value}})
        })
    }),
    graphql(GET_EXIST_EMAIL, {
        props: ({mutate})=> ({
          getExistEmail : (value) => mutate({variables:{value}})
        })
    }),
    graphql(LOGIN,{
        props:({mutate})=>({
        loginWithPassword : (username,password) =>mutate({variables:{username,password}})
      })
    })
)(Register);
