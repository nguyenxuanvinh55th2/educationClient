import React from 'react';
import { browserHistory } from 'react-router';
import CryptoJS from "crypto-js";

import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import FriendList from './FriendList.jsx';
import ManagerSystem from './ManagerSystem.jsx';
import ProfileUser from './ProfileUser.jsx';

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.checkEmail = this.checkEmail.bind(this);
    this.addNotification = this.addNotification.bind(this);
    this.handleSaveProfile = this.handleSaveProfile.bind(this);
    this.validateSaveProfile = this.validateSaveProfile.bind(this);
    this.state = {
      firstName: props.users.currentUser.firstName ? props.users.currentUser.firstName : '',
      lastName: props.users.currentUser.lastName ? props.users.currentUser.lastName : '',
      email: props.users.currentUser.email ? props.users.currentUser.email : '',
      gender: props.users.currentUser.gender ? props.users.currentUser.gender : false,
      oldPass: '',
      newPass: '',
      confirmPass: '',
      image: props.users.currentUser.image ? props.users.currentUser.image : '',
      openSetPassword: false
    }
  }
  checkEmail(value){
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
     if (!filter.test(value)) {
       console.log("invalid email");
    }
    else {
      console.log("valid email");
    }
    this.setState({mail: value})
  }
  addNotification(level, message) {
    this.props.addNotificationMute({fetchData: true, message: 'Cập nhật thành công', level:'success'});
  }
  handleAddImage(files){
    let that = this;
    if(files[0]){
      let file = files[0];
      if(file.size <= 1024*1000*2){
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            if(reader.result) {
              that.setState({image: reader.result});
            }
        }
        reader.onerror = function (error) {
          console.log('Error: ', error);
        }
      }
      else {
        alert('File nhỏ hơn 2MB!');
      }
    }
  }
  validateSaveProfile(){
    if(this.state.openSetPassword){
      if(this.state.oldPass && this.state.newPass && this.state.newPass === this.state.confirmPass && this.state.newPass !== this.state.oldPass){
        return true;
      }
      else {
        return false;
      }
    }
    return true;
  }
  handleSaveProfile(){
    let {  loginSetFlag } = this.props;
    let dataUser = {
      profile: {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        gender: this.state.gender,
        dateOfBirth: moment(this.state.dateOfBirth, 'YYYY-MM-DD').valueOf()
      },
      image: this.state.image
    }
    if(this.state.openSetPassword){
      dataUser.password = {
        newPass: CryptoJS.AES.encrypt(this.state.newPass, "def4ult").toString()
      }
      var encrypted = CryptoJS.AES.encrypt(this.state.oldPass, "def4ult");
      if(this.props.checkPasswordUser){
        this.props.checkPasswordUser(localStorage.getItem('Meteor.loginToken'),this.props.users.userId,encrypted.toString()).then(({data}) => {
          if(data.checkPasswordUser){
            if(this.props.updateProfile) {
              this.props.updateProfile(localStorage.getItem('Meteor.loginToken'), JSON.stringify(dataUser)).then(({data}) => {
                this.addNotification('success', "Cập nhập thông tin thành công");
              })
              .catch((error) => {
                console.log(error);
                this.addNotification("error", 'Faild!');
              })
            }
          }
          else {
            this.addNotification('error', 'Incorrect password [403]')
          }
        })
        .catch((error) => {
          console.log(error.message.split(": ")[1]);
          this.addNotification("error", error.message.split(": ")[1])
        })
      }
    }
    else {
      if(this.props.updateProfile) {
        this.props.updateProfile(localStorage.getItem('Meteor.loginToken'), JSON.stringify(dataUser)).then(({data}) => {
          this.addNotification('success', "Cập nhập thông tin thành công");
        })
        .catch((error) => {
          console.log(error);
          this.addNotification("error", 'Faild!');
        })
      }
    }
  }
  render(){
    let { layouts, theme, defaultColor, t } = this.props;
    return (
      <Tabs className="secondary">
        <TabList className="modal-header" style={{margin: 0, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 40}}>
            <Tab>
              <h4 className="modal-title" style={{color: 'black'}}>Chỉnh sửa tài khoản</h4>
            </Tab>
            <Tab>
              <h4 className="modal-title" style={{color: 'black'}}>Bạn bè</h4>
            </Tab>
            <Tab>
              <h4 className="modal-title" style={{color: 'black'}}>Hồ sơ</h4>
            </Tab>
            {
              this.props.users.userId == '0' &&
              <Tab>
                <h4 className="modal-title" style={{color: 'black'}}>Quản trị</h4>
              </Tab>
            }
        </TabList>
        <TabPanel>
          <div style={{padding: '0px 70px'}}>
            <div style={{flexDirection: 'column'}}>
              <h2>Chỉnh sửa tài khoản</h2>
            </div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
              <div style={{width: '20%',display: 'flex', flexDirection: 'column'}}>
                <img src={this.state.image ? this.state.image : "https://challengeinequality.luskin.ucla.edu/wp-content/uploads/sites/4/2015/12/Photo-Not-Available.jpg"} style={{borderRadius: '50%', height: 120, width: 120, backgroundColor: '#1caeb6'}}
                onClick={() => document.getElementById("getDataImageProfile").click()}/>
                <h4 style={{paddingLeft: 18}}>Tải ảnh</h4>
                <input type="file" id="getDataImageProfile" accept="image/*" multiple={false} style={{display: 'none'}} onChange={({target}) => this.handleAddImage(target.files)} />
              </div>
              <div style={{width: '80%'}}>
                <form className="form-horizontal" style={{textAlign: 'left'}}>
                  <div className="form-group">
                    <label className="col-sm-3 control-label">Họ</label>
                    <div className="col-sm-9">
                      <input type="text" value={this.state.lastName} className="form-control" onChange={({target}) => this.setState({lastName: target.value})}/>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-3 control-label">Tên</label>
                    <div className="col-sm-9">
                      <input type="text" value={this.state.firstName} className="form-control" onChange={({target}) => this.setState({firstName: target.value})}/>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-3 control-label">Email</label>
                    <div className="col-sm-9">
                      <input type="text" value={this.state.email} className="form-control" onChange={({target}) => this.checkEmail(target.value)} disabled />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-3 control-label">Giới tính </label>
                    <div className="col-sm-9">
                      <label className="radio-inline">
                         <input type="radio" checked={!this.state.gender} onChange={() => {
                             if(this.state.gender)
                              this.setState({gender: false});
                         }} />Nam
                       </label>
                       <label className="radio-inline">
                         <input type="radio" checked={this.state.gender} onChange={({}) => {
                             if(!this.state.gender)
                              this.setState({gender: true});
                         }}/>Nữ
                       </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-sm-3">
                      <a className="btn btn-link" onClick={() => this.setState({openSetPassword: this.state.openSetPassword ? false : true})}>
                        {
                          this.state.openSetPassword ?
                          <span className="glyphicon glyphicon-chevron-down pull-right" style={{left: 20, top: 3}}></span>
                          : <span className="glyphicon glyphicon-chevron-right pull-right" style={{left: 20, top: 3}}></span>
                        }
                        Đổi mật khẩu</a>
                    </div>
                  </div>
                  {
                    this.state.openSetPassword &&
                    <div>
                      <div className="form-group">
                        <label className="col-sm-3 control-label">Mật khẩu cũ</label>
                        <div className="col-sm-9">
                          <input type="password" className="form-control" value={this.state.oldPass} onChange={({target}) => this.setState({oldPass: target.value})}/>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-3 control-label">Mật khẩu mới</label>
                        <div className="col-sm-9">
                          <input type="password" className="form-control" value={this.state.newPass} onChange={({target}) => this.setState({newPass: target.value})} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-3 control-label">Nhập lại mật khẩu mới</label>
                        <div className="col-sm-9">
                          <input type="password" className="form-control" value={this.state.confirmPass} onChange={({target}) => this.setState({confirmPass: target.value})} />
                        </div>
                      </div>
                    </div>
                  }
                  <div className="form-group">
                    <div className="col-sm-offset-3 col-sm-9">
                      <button type="button" className="btn" style={{width: '100%', backgroundColor: defaultColor, color: 'white'}} disabled={!this.validateSaveProfile() || !this.state.lastName || !this.state.lastName} onClick={() => this.handleSaveProfile()}>Cập nhật</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <FriendList {...this.props}/>
        </TabPanel>
        <TabPanel>
          <ProfileUser {...this.props}/>
        </TabPanel>
        {
          this.props.users.userId == '0' &&
          <TabPanel>
            <ManagerSystem {...this.props} />
          </TabPanel>
        }
      </Tabs>
    )
  }
}
const UPDATE_PROFILE_USER = gql`
    mutation updateProfileUser($token: String!, $info: String){
        updateProfileUser(token: $token, info: $info)
}`
const CHECK_PASSWORD_USER = gql`
    mutation checkPasswordUser($token: String!, $userId: String, $password: String){
        checkPasswordUser(token: $token, userId: $userId, password: $password)
}`

export default compose (
    graphql(UPDATE_PROFILE_USER,{
        props:({mutate})=>({
        updateProfile : (token,info) =>mutate({variables:{token,info}})
      })
    }),
    graphql(CHECK_PASSWORD_USER,{
        props:({mutate})=>({
        checkPasswordUser : (token,userId, password) =>mutate({variables:{token,userId,password}})
      })
    })
)(EditProfile);
