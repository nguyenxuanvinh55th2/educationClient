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
                  <h4 className="modal-title" style={{color: '#35bcbf'}}>Forum</h4>
              </Tab>
              <Tab>
                  <h4 className="modal-title" style={{color: '#35bcbf'}}>Bài giảng</h4>
              </Tab>
              <Tab>
                  <h4 className="modal-title" style={{color: '#35bcbf'}}>Bài Tập</h4>
              </Tab>
              <Tab>
                  <h4 className="modal-title" style={{color: '#35bcbf'}}>Khảo sát</h4>
              </Tab>
              <Tab>
                  <h4 className="modal-title" style={{color: '#35bcbf'}}>Thành viên</h4>
              </Tab>
              <Tab>
                  <h4 className="modal-title" style={{color: '#35bcbf'}}>Hoạt động</h4>
              </Tab>
          </TabList>
          <TabPanel style={{backgroundColor: '#f0f0f0'}}>
            <div style={{display: 'flex', flexDirection: 'column', padding: 10, backgroundColor: 'white'}}>
              
            </div>
          </TabPanel>
          <TabPanel style={{backgroundColor: '#f0f0f0'}}>
            <div style={{display: 'flex', flexDirection: 'column', padding: 10, backgroundColor: 'white'}}>
              <div style={{border: '1px solid black', height: 150, borderRadius: 10, padding: 10}}>
                <textarea rows="5" placeholder="Bạn có điều gì muốn hỏi" style={{border: 'none', height: 100, width: '100%'}}/>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                  <div>
                    <button type="button" className="btn" style={{width: 70, backgroundColor: 'white', boxShadow: 'none', border: '1px dotted #35bcbf', color: '#35bcbf'}}>+ Ảnh</button>
                    <button type="button" className="btn" style={{marginLeft: 10, width: 70, backgroundColor: 'white', boxShadow: 'none', border: '1px dotted #35bcbf', color: '#35bcbf'}}>+ Video</button>
                    <button type="button" className="btn" style={{marginLeft: 10, width: 70, backgroundColor: 'white', boxShadow: 'none', border: '1px dotted #35bcbf', color: '#35bcbf'}}>+ Tệp</button>
                  </div>
                  <div>
                    <button type="button" className="btn" style={{width: 70, backgroundColor: '#35bcbf', color: 'white'}}>Đăng</button>
                  </div>
                </div>
              </div>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', marginTop: 10}}>
              <div style={{backgroundColor: 'white'}}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            3
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
