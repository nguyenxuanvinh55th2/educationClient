import React from 'react';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';

import TextField from 'material-ui/TextField';

export default class Home extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    let imgUrlTop = 'public/imgs/home-page_01.png';
    let imgUrlCenter = 'public/imgs/home-page_15.png';
    return(
      <div style={{flexDirection:'column', width:'auto'}}>
        <div style={{display: 'flex',flexDirection: 'row', justifyContent: 'center',background: 'url(' + imgUrlTop + ') no-repeat', backgroundSize: 'cover'}}>
          <img src="/public/imgs/text.png" className="img-responsive" />
        </div>
        <div  className="row" style={{margin: 0,padding: 50}}>
          <div className="col-sm-12 col-md-6 col-lg-6">
            <p style={{paddingRight: 50}}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-6">
            <img src="/public/imgs/anh1.png" className="img-responsive" />
          </div>
        </div>
        <div style={{display: 'flex', flexDirection:'row', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
            <div>
              <span className="glyphicon glyphicon-home pull-left" style={{fontSize: 50}}>
              </span>
            </div>
            <div>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
          </div>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
            <div>
              <span className="glyphicon glyphicon-ok pull-left" style={{fontSize: 50}}>
              </span>
            </div>
            <div>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
          </div>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
            <div>
              <span className="glyphicon glyphicon-cog pull-left" style={{fontSize: 50}}>
              </span>
            </div>
            <div>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
          </div>
        </div>
        <div  className="row" style={{margin: 0,padding: 50}}>
          <div className="col-sm-12 col-md-6 col-lg-6">
            <img src="/public/imgs/anh3.png" className="img-responsive" />
          </div>
          <div className="col-sm-12 col-md-6 col-lg-6">
            <p style={{paddingRight: 50}}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', background: 'url(' + imgUrlCenter + ') no-repeat', backgroundSize: 'cover', minHeight: 454}}>
          <div className="col-sm-12 col-md-6 col-lg-3" style={{flex: 'left',color: 'white'}}>
            <p style={{paddingRight: 50}}>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </div>
        <div style={{flexDirection: 'column'}}>

        </div>
        <div className="row" style={{margin: 0, backgroundColor: '#2b3a41', color: 'white', padding: 15}}>
          <div className="col-sm-12 col-md-6 col-lg-5" style={{flexDirection: 'column', alignItems: 'center'}}>
            <img src="/public/imgs/logo.png" alt="Dispute Bills" style={{height: 40}} />
            <div>
              <p>LIÊN HỆ</p>
              <p>Tuielearning.com.vn <span className="glyphicon glyphicon-home pull-left" style={{paddingRight: 10, top: 3}}></span></p>
              <p>0166xxxx770 <span className="glyphicon glyphicon-earphone pull-left" style={{paddingRight: 10, top: 3}}></span></p>
              <p>tuielearning@gmail.com <span className="glyphicon glyphicon-envelope pull-left" style={{paddingRight: 10, top: 3}}></span></p>
              <p>Nha Trang, Khánh Hòa <span className="glyphicon glyphicon-map-marker pull-left" style={{paddingRight: 10, top: 3}}></span></p>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-7" style={{border: '2px solid white', padding: 30}}>
            <h3>GỬI Ý KIẾN ĐÓNG GÓP</h3>
            <div style={{flexDirection: 'column'}}>
              <TextField fullWidth={true} inputStyle={{color: 'white'}} hintStyle={{color: 'white'}}
                hintText="Họ tên" />
              <TextField fullWidth={true} inputStyle={{color: 'white'}} hintStyle={{color: 'white'}}
                hintText="Địa chỉ email" />
              <TextField fullWidth={true} inputStyle={{color: 'white'}} hintStyle={{color: 'white'}}
                hintText="Tiêu đề" />
              <TextField fullWidth={true} inputStyle={{color: 'white'}} hintStyle={{color: 'white'}}
                hintText="Nội dung đóng góp" />
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                <button type="button" className="btn btn-default">
                  <span className="glyphicon glyphicon-send pull-right" style={{paddingLeft: 5, top: 3}}></span> Gửi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
