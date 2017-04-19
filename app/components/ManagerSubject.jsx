import React from 'react';

import { Link, Router, browserHistory } from 'react-router'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';

export default class ManagerSubject extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    return (
      <div style={{display: 'flex', flexDirection: 'column', padding: 20}}>
        <Tabs className="secondary" >
          <TabList className="modal-header" style={{margin: 0, backgroundColor: 'white'}}>
              <Tab>
                  <h4 className="modal-title">Forum</h4>
              </Tab>
              <Tab>
                  <h4 className="modal-title">Bài giảng</h4>
              </Tab>
              <Tab>
                  <h4 className="modal-title">Khảo sát</h4>
              </Tab>
              <Tab>
                  <h4 className="modal-title">Thành viên</h4>
              </Tab>
              <Tab>
                  <h4 className="modal-title">Hoạt động</h4>
              </Tab>
          </TabList>
          <TabPanel>
            1
          </TabPanel>
          <TabPanel>
            2
          </TabPanel>
          <TabPanel>
            3
          </TabPanel>
          <TabPanel>
            4
          </TabPanel>
          <TabPanel>
            5
          </TabPanel>
        </Tabs>
      </div>
    )
  }
}
