import React, { PropTypes, Component, ReactDom } from 'react';
import { Link, Router, browserHistory } from 'react-router'
// import {FB, FacebookApiException} from 'fb';

//import NewFeedContain from '../../containers/newFeed.js';
import FriendList from './friendList.jsx';
import {Row, Col, Tabs, Tab} from 'react-bootstrap'

//Meteor.subscribe("user");
export default class Wall extends Component {
  constructor(props) {
      super(props);
  }

  render() {
    console.log("message wall", this.props);

      return (
        <Row>
          <Col md={12}>
            <Tabs defaultActiveKey={1} id="uncontrolled-tab">
              <Tab eventKey={1} title="Dòng thời gian">
              </Tab>
              <Tab eventKey={2} title="Danh sách bạn">
                <FriendList data={this.props.data}/>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      )
  }
}

Wall.PropTypes = {
  data: PropTypes.object.isRequired
}
