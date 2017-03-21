import React from 'react';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import Dialog from 'material-ui/Dialog';

import Login from './Login.jsx'
export default class Header extends React.Component {
  constructor(props) {
    super(props)
    this.handleResize = this.handleResize.bind(this);
    this.state = {
      height: window.innerHeight,
      showModal: false,
      dialogType: ''
    }
  }
  handleResize(e) {
      this.setState({height: window.innerHeight});
  }
  componentDidMount() {
      window.addEventListener('resize', this.handleResize);
  }
  componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
  }
  render() {
    return(
      <div style={{flexDirection:'column', width:'auto'}}>
        <nav className="navbar navbar-default navbar-fixed-top " style={{backgroundColor: '#2b3a41', border: 0}}>
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="/">
                <img src="/public/imgs/logo.png" alt="Dispute Bills" />
              </a>
            </div>
            <div className="collapse navbar-collapse" id="myNavbar">
              <ul className="nav navbar-nav navbar-right" style={{paddingRight: 20}}>
                <li style={{marginRight: 20}}><a onClick={() => this.setState({showModal: true})} className="btn btn-sm navbar-btn" style={{color: 'white', borderColor: 'white', padding: 8, width: 90}}>Đắng nhập</a></li>
                <li style={{marginRight: 20}}><a href="#" className="btn btn-sm navbar-btn" style={{color: 'white', borderColor: 'white', padding: 8, width: 90}}>Đắng kí</a></li>
                <li><a href="#" className="btn btn-sm navbar-btn" style={{color: 'white', borderColor: 'white', padding: 8, width: 90}}>Đắng xuất</a></li>
                {/* <li><a href="#"><NotificationsIcon/> <span className="badge" style={{borderRadius: '50%', marginLeft: 0}}>5</span></a>
                </li>
                <li style={{display:'inline'}}><a href="#"><img src="http://placehold.it/30x30" alt="Nature" style={{borderRadius: '50%',width:35, height: 35}}/>Vinh</a></li>
                <li><a href="#"><span className="glyphicon glyphicon-user"></span> Sign Up</a></li>
                <li><a onClick={() => this.setState({showModal: true})}><span className="glyphicon glyphicon-log-in"></span> Login</a></li>
                <li><a href="#"><span className="glyphicon glyphicon-log-out"></span> Logout</a></li> */}
              </ul>
            </div>
          </div>
        </nav>
        <Dialog
          modal={true}
          open={this.state.showModal}
          contentStyle={{width: 600,maxWidth: 'none'}}
        >
          <div className="modal-dialog" style={{width: 'auto', margin: 0}}>
              <div className="modal-content">
                <div className="modal-body" style={{height:this.state.height - 300, overflowY: 'auto', overflowX: 'hidden'}}>
                    <Login {...this.props} />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-default" onClick={() => this.setState({showModal: false})}>Đóng</button>
                </div>
              </div>
          </div>
        </Dialog>
      </div>
    )
  }
}
