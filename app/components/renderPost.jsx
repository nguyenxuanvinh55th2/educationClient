import React, {PropTypes,Component} from 'react'
import {Link,browserHistory} from 'react-router'
//import { Meteor } from 'metor/meteor'
import {Glyphicon,Tabs,Tab,Row,Col,ButtonGroup,Button,Panel,PanelGroup} from 'react-bootstrap'
import AddTopic from './addNewTopic.jsx'
//import ChatForum from '../../containers/chatForum'
//import Assignment from './assignment.jsx'
//import RenderLessonContainer from './renderLesson.jsx'
//import RenderForum from '../../containers/renderForum'

export default class RenderPost extends Component {
  constructor(props)
  {
    super(props);
    this.renderActivity = this.renderActivity.bind(this)
  }
  renderActivity(){
    console.log(this.props.listactivity);
    return (
      this.props.listactivity.sort(function(a, b){return b.topic.index-a.topic.index}).map(item =>
        {
          if(item.topic.type === "lesson") {
            //return (<RenderLessonContainer refetchData={this.props.refetchData} key={item.topic._id} index={item.topic.type+item.topic._id} topic={item.topic} />)
          // if(item.type === "forum")
          //   return (<RenderForum key={item.index} index={item.type+item.id} forumId={item.id} />)
          // if(item.type === "assignment")
          //   return (<Assignment key={item.index} index={item.type+item.id} assignmentId={item.id}/>)
          } else {
              return (<p>sau</p>)
            }
        }
      )
    )
  }
  renderTag(){
    if(this.props.owner === Meteor.userId()){
      return (
        <Tabs defaultActiveKey={1} id="uncontrolled-tab-example" >
            <Tab eventKey={1} title="Bài giảng">
                <div  className="tabcontent">
                  <AddTopic courseId={this.props.courseId}/>
                </div>
            </Tab>

            <Tab eventKey={2} title="Thông báo">
              <div  className="tabcontent">
                <ChatForum  subjectId={this.props.subjectId}/>
              </div>
            </Tab>

            <Tab eventKey={3} title="Bài tập" >
            <div  className="tabcontent">
            </div>
            </Tab>
       </Tabs>
      )
    }
    else {
      return (
        <AddTopic refetchData={this.props.refetchData} courseId={this.props.courseId} />
      )
    }
  }
  render(){
    return (
      <div>
          {this.renderTag()}
         <div>
         <PanelGroup>
            {this.renderActivity()}
         </PanelGroup>
         </div>
      </div>


    )
  }
}
RenderPost.PropTypes = {
  courseId:PropTypes.string.isRequired,
  listactivity:PropTypes.array.isRequired,
  owner:PropTypes.string.isRequired,
  refetchData: PropTypes.func.isRequired
}
