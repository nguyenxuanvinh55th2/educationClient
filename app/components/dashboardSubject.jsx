import React, {PropTypes,Component} from 'react'
import {Link,browserHistory} from 'react-router'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
//import { Meteor } from 'metor/meteor'

var Cryptr = require('cryptr'),
cryptr = new Cryptr('ntuquiz123');

import {Glyphicon,Tabs,Tab,Row,Col,ButtonGroup,Button,Panel,PanelGroup} from 'react-bootstrap'
import RenderPost from './renderPost.jsx'

class DashboardSubject extends Component {
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
      let course = this.props.data.classInfo.courses.filter(item => item._id === courseId)[0];
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

const getClassInfo = (classInfo) => {
  let decryptedString = cryptr.decrypt(classInfo);
  console.log("class Info ", decryptedString);
  return JSON.parse(decryptedString);
}

const CLASS_INFO = gql`
  query classInfo($classId: String, $userId: String, $role: String) {
    classInfo(classId: $classId, userId: $userId, role: $role) {
      _id
      code
      name
      currentUserId
      role
      teacher {
        _id
        name
        image
        email
        social
        online
        lastLogin
      }
      student {
        _id
        name
        image
        email
        social
        online
        lastLogin
      }
      courses {
        _id
        subjectName
        dateStart
        dateEnd
        isOpen
        publicActivity
        activity {
          _id
          topicId
        }
      }
    }
  }`
const mapDataToProps = graphql(
  CLASS_INFO,
  {
    options: (ownProps) => ({ variables: { classId: 'f3nHyx3ZxN7fELto', userId: 'gtez6BH4qdjmsFsQ3', role: 'teacher' } })
  }
);

export default mapDataToProps(DashboardSubject);
