import React from 'react'
import {Link} from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import __ from 'lodash';
import '../../stylesheet/OpenSans.css';
import '../../stylesheet/Lobster.css';
import ChatBox from '../chatbox/ChatBox.jsx';
import {PinTop} from '../../javascript/header.js';
class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Khách hàng Online',
      mobile: '',
      email: '',
    }
    this.allowClick = false;
  }
  componentDidMount() {
    PinTop();
  }
  insertTeamBuilding() {
    if(!this.allowClick) {
      this.allowClick = true;
      this.props.insertTeamBuildings(JSON.stringify(this.state), 'isRegister').then(() => {
        Meteor.call('sendMailNotification', {
          content: this.state.email + ' ' + 'đăng ký nhận thông tin',
          title: 'Thông báo'
        }, (err, res) => {
          if (err) {
            alert(err);
          } else {
            // success
          }
        });
        this.setState({email: ''});
        this.allowClick = false;
        this.props.addNotificationMute({fetchData: true, message: 'Cảm ơn bạn đã đăng ký nhận thông tin của chúng tôi. Chúng tôi sẽ liên lạc với bạn.', level: 'success'});
      }).catch(err => {
        console.log("err ", err);
      })
    }
  }

  render() {
    let { email } = this.state;
    return (
      <div>
        <ChatBox/>
        <div id="footer">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <div className="row">
                  <div className="col-sm-6 col-md-6 col-footer">
                    <h4>TRỤ SỞ CHÍNH</h4>
                    <p>Công ty TNHH Du Lịch Trải Nghiệm Việt 239 Ngô Gia Tự, Nha Trang, Khánh Hòa</p>
                    <p>info@trainghiemviet.com.vn</p>
                    <p>(+84) 987 837 000</p>
                    <p>Mã số thuế: 4201735379</p>
                    <img src="/imgs/thuonghieu.png" alt=""/>
                  </div>
                  <div className="col-sm-6 col-md-6 col-footer">
                    <h4>CHĂM SÓC KHÁCH HÀNG</h4>
                    <p>
                      <Link to={'/lien-he'}>Ý kiến khách hàng</Link>
                    </p>
                    <p>
                      <Link to={'/bao-hiem-du-lich'}>Bảo hiểm du lịch</Link>
                    </p>
                    <p>
                      <Link to={'/dieu-khoan-chung'}>Điều khoản chung</Link>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="row">
                  <div className="col-sm-6 col-md-6 col-footer">
                    <h4>LIÊN HỆ</h4>
                    <ul>
                      <li data-toggle="tooltip" title="Facebook">
                        <a href="https://facebook.com/TraiNghiemViet" target="_blank">
                          <i className="fa fa-facebook" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li data-toggle="tooltip" title="Twitter">
                        <a href="https://twitter.com/TraiNghiemViet" target="_blank">
                          <i className="fa fa-twitter" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li data-toggle="tooltip" title="Instagram">
                        <a href="https://www.instagram.com/evitour.info/" target="_blank">
                          <i className="fa fa-instagram" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li data-toggle="tooltip" title="Youtube">
                        <a href="https://www.youtube.com/channel/UChLVF6-bOXqWbCvBMPTH2WQ" target="_blank">
                          <i className="fa fa-youtube-square" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li data-toggle="tooltip" title="Google">
                        <a href="https://plus.google.com/u/4/114236316896736229176" target="_blank">
                          <i className="fa fa-google-plus" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li data-toggle="tooltip" title="Zalo">
                        <a href="http://zalo.me/2171915280312627070" target="_blank">
                          <img src="/imgs/zalo.png" />
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="col-sm-6 col-md-6 col-footer">
                    <h4>ĐĂNG KÍ NHẬN THÔNG TIN</h4>
                    <div className="form-group">
                      <input type="text" value={email} className="form-control" placeholder="Nhập Email" onChange={({target}) => {
                          this.setState({email: target.value});
                        }}/>
                      <Link className="btn btn-tour" data-toggle="tooltip" title="Đăng ký" disabled={!email} onClick={this.insertTeamBuilding.bind(this)}>ĐĂNG KÝ</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="end-footer">
            <div className="container">
              <p>Viet Experience Travel & Trading Services Limited Ltd 2017. All rights reserved. Design by
                <a href="http://lokatech.net/"> LokaTech.</a>
              </p>
            </div>
          </div>
        </div>
        <div className="pin-top">
          <i className="fa fa-angle-up" aria-hidden="true"></i>
        </div>
      </div>
    )
  }
}

const CHANGE_PASSWORD = gql`
  mutation insertAccountingObject($info: String, $type: String) {
    insertAccountingObject(info: $info, type: $type)
  }
`;
export default compose(graphql(CHANGE_PASSWORD, {
    props:({mutate})=>({
        insertTeamBuildings : (info, type) => mutate({variables:{info, type}})
    })
}))(Footer);
