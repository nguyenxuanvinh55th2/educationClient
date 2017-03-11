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

export default class Header extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return(
      <div style={{flexDirection:'column', width:'auto'}}>
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="#">WebSiteName</a>
            </div>
            <form className="navbar-form navbar-left">
              <div className="input-group" style={{width: 450}}>
                <input type="text" className="form-control" placeholder="Search"/>
                <div className="input-group-btn">
                  <button className="btn btn-default" type="submit">
                    <i className="glyphicon glyphicon-search"></i>
                  </button>
                </div>
              </div>
            </form>
            <div className="collapse navbar-collapse" id="myNavbar">
              <ul className="nav navbar-nav navbar-right">
                <li><a href="#"><NotificationsIcon/> <span className="badge" style={{borderRadius: '50%', marginLeft: 0}}>5</span></a>
                </li>
                <li style={{display:'inline'}}><a href="#"><img src="http://placehold.it/30x30" alt="Nature" style={{borderRadius: '50%',width:35, height: 35}}/>Vinh</a></li>
                <li><a href="#"><span className="glyphicon glyphicon-user"></span> Sign Up</a></li>
                <li><a href="/login"><span className="glyphicon glyphicon-log-in"></span> Login</a></li>
                <li><a href="#"><span className="glyphicon glyphicon-log-out"></span> Logout</a></li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}
