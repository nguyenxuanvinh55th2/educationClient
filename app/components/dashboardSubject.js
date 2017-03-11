import React, {PropTypes,Component} from 'react'
ReactDom = require('react-dom')
import {Link,browserHistory} from 'react-router'
//import { Meteor } from 'metor/meteor'

var Cryptr = require('cryptr'),
cryptr = new Cryptr('ntuquiz123');

import {Glyphicon,Tabs,Tab,Row,Col,ButtonGroup,Button,Panel,PanelGroup} from 'react-bootstrap'
import RenderPost from '../renderPost/renderPost.js'

export default class DashboardSubject extends Component {
  constructor(props)
  {
    super(props);
  }

  renderActivity(){
    console.log(this.props.data);
    let decryptedString = cryptr.decrypt(this.props.params.classInfo);
    let courseId = JSON.parse(decryptedString).courseId;

    if(!this.props.data || this.props.data.loading)
      return (<div className="loader"></div>)
    else {
      let course = this.props.data.classInfo.course.filter(item => item._id === courseId)[0];
      return (
        <RenderPost refetchData={this.refetchData.bind(this)} listactivity={course.activity} courseId={course._id} owner={course.teacherId} />
      )
    }
  }

  refetchData() {
    this.props.data.refetch()
  }

  render() {
    return (
      <Tabs defaultActiveKey={1} id="dashboardSubject">
       <Tab eventKey={1} title="Bài đăng">
       { this.renderActivity() }
       </Tab>
       <Tab eventKey={2} title="Files">Tab 2 content</Tab>
       <Tab eventKey={3} title="Thành viên" >Tab 3 content</Tab>
      </Tabs>
    )
  }
}
DashboardSubject.PropTypes = {
  data:React.PropTypes.object.isRequired
}
