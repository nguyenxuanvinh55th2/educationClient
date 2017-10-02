import React from 'react'
import {Link, browserHistory} from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import __ from 'lodash';

import ContactMap from './ContactMap.jsx'

class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      mobile: '',
      email: '',
      feedBack: '',
      address: '',
      ////////////////////////////
      nameError: null,
      mobileError: null,
      emailError: null,
      feedBackError: null,
      addressError: null,
    }
    this.allowClick = false;
  }
  componentWillMount(){
    if(this.props.changeHeader){
      this.props.changeHeader('contact');
    }
  }
  insertTeamBuilding() {
    let { name, mobile, email, feedBack, address, emailError } = this.state;
    if(name && mobile && email && feedBack && address && !emailError) {
      if(!this.allowClick) {
        this.allowClick = true;
        this.props.insertTeamBuildings(JSON.stringify(this.state), 'isFeedBack').then(() => {
          this.props.addNotificationMute({fetchData: true, message: 'Bạn đã gửi phản hồi thành công', level: 'success'});
          browserHistory.goBack();
          Meteor.call('sendMailNotification', {
            content: name + ' ' + 'gửi phản hồi',
            title: 'Thông báo'
          }, (err, res) => {
            if (err) {
              alert(err);
            } else {
              // success
            }
          });
          Meteor.call('sendNotification', {
            note: 'khách hàng ' + name + ' ' + 'vừa gửi phản hồi',
            link: '/feedBack',
          }, (err, res) => {
            if (err) {
              alert(err);
            } else {
              // success
            }
          });
          this.setState({
            name: '',
            mobile: '',
            email: '',
            feedBack: '',
            address: '',
          });
          this.allowClick = false;
        }).catch(err => {
          console.log("err ", err);
        })
      }
    }
  }

  render() {
    let {
      name,
      mobile,
      email,
      feedBack,
      address,
      /////////////////////////////////
      nameError,
      mobileError,
      emailError,
      feedBackError,
      addressError,
    } = this.state;
    return (
      <div>
        {
          (this.props.data.advertisements && this.props.data.advertisements.length) ?  (
            <div className="banner bg" style={{
              backgroundImage: "url('" + this.props.data.advertisements[0].image.file + "')"
            }}>
              <div className="container">
                <div className="table-div">
                  <div className="table-cell">
                    <h2>{this.props.data.advertisements[0].name}</h2>
                    <h4>{this.props.data.advertisements[0].title}</h4>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="banner bg" style={{
                backgroundImage: "url('/imgs/banner-contact.jpg')"
              }}>
              <div className="container">
                <div className="table-div">
                  <div className="table-cell">
                    <h2>LIÊN HỆ VỚI CHÚNG TÔI</h2>
                    <h4>CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ VÀ DU LỊCH TRẢI NGHIỆM VIỆT</h4>
                  </div>
                </div>
              </div>
            </div>
          )
        }
        <div className="contact">
          <div className="container">
            <h3 className="text-right">Góp ý và đánh giá của khách hàng</h3>
            <div className="row">
              <div className="col-md-4 col-lg-6 contact-info">
                <div className="block-info">
                  <div className="row">
                    <div className="icon col-lg-3">
                      <i className="fa fa-map-marker" aria-hidden="true"></i>
                    </div>
                    <div className="info col-lg-9">
                      <h3>Trụ sở chính</h3>
                      <p>239 Ngô Gia Tự, phường Phước Tiến Thành phố Nha Trang</p>
                    </div>
                  </div>
                </div>
                <div className="block-info">
                  <div className="row">
                    <div className="icon col-lg-3">
                      <i className="fa fa-phone" aria-hidden="true"></i>
                    </div>
                    <div className="info col-lg-9">
                      <h3>Tư vấn và đặt dịch vụ</h3>
                      <p>Điện thoại: (+84) 886 526 444</p>
                      <p style={{fontWeight: 600}}>Hot line: (+84) 987 837 000</p>
                    </div>
                  </div>
                </div>
                <div className="block-info">
                  <div className="row">
                    <div className="icon col-lg-3">
                      <i className="fa fa-envelope" aria-hidden="true"></i>
                    </div>
                    <div className="info col-lg-9">
                      <h3>Email</h3>
                      <p>info@trainghiemviet.com.vn</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-8 col-lg-6">
                <div className="contact-form">
                  <div className="form-group">
                    <input type="text" className="form-control" style={{marginBottom: 0}} value={name} placeholder="Họ và tên" onChange={({target}) => {
                        this.setState({name: target.value});
                      }} onBlur={() => {
                        if(name === '') {
                          this.setState({nameError: 'Trường này không được để trống'});
                        } else {
                            this.setState({nameError: null});
                          }
                      }}/>
                    <span style={{height: 15}} className="help-block">{nameError ? <font style={{color: 'red'}}>{nameError}</font> : null}</span>
                  </div>
                  <div className="form-group">
                    <input type="text" className="form-control" style={{marginBottom: 0}} value={email} placeholder="Email" onChange={({target}) => {
                        this.setState({email: target.value});
                      }} onBlur={() => {
                        let mailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
                        if(email === '') {
                          this.setState({emailError: 'Trường này không được để trống'});
                        } else
                            if(!mailReg.test(email)) {
                              this.setState({emailError: 'Sai định dạng mail'});
                            } else {
                                this.setState({emailError: null});
                            }
                      }}/>
                    <span style={{height: 15}} className="help-block">{emailError ? <font style={{color: 'red'}}>{emailError}</font> : null}</span>
                  </div>
                  <div className="form-group">
                    <input type="text" className="form-control" style={{marginBottom: 0}} value={mobile} placeholder="Điện thoại" onChange={({target}) => {
                        this.setState({mobile: target.value});
                      }} onBlur={() => {
                        if(mobile === '') {
                          this.setState({mobileError: 'Trường này không được để trống'});
                        } else {
                            this.setState({mobileError: null});
                          }
                      }}/>
                    <span className="help-block">{mobileError ? <font style={{color: 'red'}}>{mobileError}</font> : null}</span>
                  </div>
                  <div className="form-group">
                    <input type="text" className="form-control" style={{marginBottom: 0}} value={address} placeholder="Địa chỉ" onChange={({target}) => {
                        this.setState({address: target.value});
                      }} onBlur={() => {
                        if(address === '') {
                          this.setState({addressError: 'Trường này không được để trống'});
                        } else {
                            this.setState({addressError: null});
                          }
                      }}/>
                    <span style={{height: 15}} className="help-block">{addressError ? <font style={{color: 'red'}}>{addressError}</font> : null}</span>
                  </div>
                  <div className="form-group">
                    <textarea cols="40" className="form-control" value={feedBack} placeholder="Nội dung"  onChange={({target}) => {
                        this.setState({feedBack: target.value});
                      }} onBlur={() => {
                        if(feedBack === '') {
                          this.setState({feedBackError: 'Trường này không được để trống'});
                        } else {
                            this.setState({feedBackError: null});
                          }
                      }}/>
                    <span className="help-block">{feedBackError ? <font style={{color: 'red'}}>{feedBackError}</font> : null}</span>
                  </div>
                  <p className="submit">
                    <Link to={''} className="btn btn-tour" disabled={!(name && mobile && email && feedBack && address && !emailError)} onClick={this.insertTeamBuilding.bind(this)}>Gửi đánh giá</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <ContactMap/>
        </div>
      </div>
    )
  }
}

const ADVERTISEMENT_QUERY = gql `
    query advertisements($type: String) {
        advertisements(type: $type) {
          _id
          name
          title
          image {
            _id
            file
          }
          type
          createdAt
          createdBy {
            _id
            username
          }
          isShow
        }
}`

const CHANGE_PASSWORD = gql`
  mutation insertAccountingObject($info: String, $type: String) {
    insertAccountingObject(info: $info, type: $type)
  }
`;

export default compose(
  graphql(CHANGE_PASSWORD, {
    props:({mutate})=>({
        insertTeamBuildings : (info, type) => mutate({variables:{info, type}})
    })
  }),
  graphql(ADVERTISEMENT_QUERY, {
    options: () => ({
      variables: {
        type: 'contact'
      },
      fetchPolicy: 'cache-and-network'
    })
  }),
)(Contact);
