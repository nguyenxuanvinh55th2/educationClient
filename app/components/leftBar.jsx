import React, { PropTypes, Component, ReactDom } from 'react';
import { Link, Router, browserHistory } from 'react-router'
import {ListGroup,ListGroupItem,Button,Glyphicon} from 'react-bootstrap'

import ClassList from './classList.jsx'
//Meteor.subscribe("user");

export default class LeftBar extends Component {
  constructor(props) {
      super(props)
  }
  render() {
      return (
        <div id="menuLeft">
            <p>Danh sách lớp học</p>
            <ClassList friendList = {this.props.data}/>
        </div>
      )
  }
}

LeftBar.PropTypes = {
  data: PropTypes.object.isRequired
}
