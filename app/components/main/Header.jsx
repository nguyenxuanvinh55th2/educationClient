import React from 'react';
import {menuMobile} from '../../javascript/header.js'
import {Link} from 'react-router';
import {PinHeader} from '../../javascript/header.js';
import {removeMenu} from '../../javascript/header.js';
import {removeSearch} from '../../javascript/header.js';
import {removeMenuSearch} from '../../javascript/header.js';
import {heightEqua} from '../../javascript/convertHeight.js';
import {createContainer} from 'react-meteor-data';
import ChildHeader from './ChildHeader.jsx';
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }
  componentDidMount() {
    PinHeader();
    menuMobile();
    removeMenu();
    removeSearch();
    removeMenuSearch();
    heightEqua.init();
  }
  handleOpen(){
    if(!this.state.open || document.getElementById('box-search').style.display == 'none'){
      this.setState({open: !this.state.open});
      document.getElementById('box-search').style.display = 'block';
    }
    else if(this.state.open || document.getElementById('box-search').style.display == 'block') {
      this.setState({open: !this.state.open});
      document.getElementById('box-search').style.display = 'none';
    }
  }
  render() {
    return (
      <div>
        <div id="header">
          <div className="header-top hidden-xs">
            <div className="container">
              <div className="row">
                <div className="col-md-7 text-right hidden-sm">
                  <ul>
                    <li>
                      <i className="fa fa-phone" aria-hidden="true"></i>(+84) 886 526 444
                    </li>
                    <li>
                      <i className="fa fa-envelope" aria-hidden="true"></i>info@trainghiemviet.com.vn
                    </li>
                    <li className="hidden-md">
                      <i className="fa fa-clock-o" aria-hidden="true"></i>7h30 AM - 5h30 PM
                    </li>
                  </ul>
                </div>
                <div className="col-sm-12 col-md-5 right-header-top text-right">
                  <ul>
                    <li>
                      <Link to={'https://facebook.com/TraiNghiemViet'} target="_blank">
                        <i className="fa fa-facebook" aria-hidden="true"></i>
                      </Link>
                      <Link to={'https://www.youtube.com/channel/UChLVF6-bOXqWbCvBMPTH2WQ'} target="_blank">
                        <i className="fa fa-youtube-play" aria-hidden="true"></i>
                      </Link>
                    </li>
                    <li>
                      <Link onClick={() => {this.handleOpen();}} className="icon-search">
                        <i className="fa fa-search" aria-hidden="true"></i>
                      </Link>
                    </li>
                    <li>
                        {'Tổng truy cập: ' + this.props.accessCount}
                      </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="header-main">
            <div className="container">
              <div className="row">
                <div className="col-sm-3 col-xs-4">
                  <div className="logo">
                    <Link to={'/'}><img src="/imgs/logo.png" alt=""/></Link>
                  </div>
                </div>
                <div className="col-sm-9 col-xs-8 text-right">
                  <nav className=" hidden-xs">
                    <ul>
                      <li className={this.props.header && this.props.header == 'home' ? 'active' : ''}>
                        <Link to={'/'}>TRANG CHỦ</Link>
                      </li>
                      <li className={this.props.header && this.props.header == 'tour-trong-nuoc' ? 'active' : ''}>
                        <Link to={'/tour-trong-nuoc'}>TOUR TRONG NƯỚC</Link>
                        <ChildHeader {...this.props} />
                      </li>
                      <li className={this.props.header && this.props.header == 'tour-nuoc-ngoai' ? 'active' : ''}>
                        <Link to={'/tour-nuoc-ngoai'}>TOUR NƯỚC NGOÀI</Link>
                      </li>
                      <li className={this.props.header && this.props.header == 'team-building' ? 'active' : ''}>
                        <Link to={'/team-building'}>TEAM BUILDING</Link>
                      </li>
                      <li className={this.props.header && this.props.header == 'event' ? 'active' : ''}>
                        <Link to={'/tin-tuc-su-kien'}>SỰ KIỆN</Link>
                      </li>
                      <li className={this.props.header && this.props.header == 'promotion' ? 'active' : ''}>
                        <Link to={'/chuong-trinh-khuyen-mai'}>KHUYẾN MÃI</Link>
                      </li>
                      <li className={this.props.header && this.props.header == 'contact' ? 'active' : ''}>
                        <Link to={'/lien-he'}>LIÊN HỆ</Link>
                      </li>

                    </ul>
                  </nav>
                  <Link onClick={() => {this.handleOpen();}} className="visible-xs icon-search">
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </Link>
                  <button type="button" className="menu-control color-red visible-xs" id="open-menu">
                    <span className="box">
                      <span className="icon-bar bar1"></span>
                      <span className="icon-bar bar2"></span>
                      <span className="icon-bar bar3"></span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="menu-mobile visible-xs">
            <ul>
              <li className="active">
                <Link to={'/'}>TRANG CHỦ</Link>
              </li>
              <li>
                <Link to={'/tour-trong-nuoc'}>TOUR TRONG NƯỚC</Link>
              </li>
              <li>
                <Link to={'/tour-nuoc-ngoai'}>TOUR NƯỚC NGOÀI</Link>
              </li>
              <li>
                <Link to={'/team-building'}>TEAM BUILDING</Link>
              </li>
              <li>
                <Link to={'/tin-tuc-su-kien'}>SỰ KIỆN</Link>
              </li>
              <li>
                <Link to={'/chuong-trinh-khuyen-mai'}>KHUYẾN MÃI</Link>
              </li>
              <li>
                <Link to={'/lien-he'}>LIÊN HỆ</Link>
              </li>
            </ul>
          </div>

        </div>
      </div>
    )
  }
}
export default createContainer((ownProps) => {
  Meteor.subscribe('settings');
  let setting = Settings.findOne({_id: 'buildmodify'});
  return {
    accessCount: setting
      ? setting.accessCount
      : 0
  }
}, Header);
