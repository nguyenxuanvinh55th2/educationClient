import React from 'react';

import { Link, Router, browserHistory } from 'react-router'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {AgGridReact} from 'ag-grid-react';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';
export default class ManagerUserParent extends React.Component {
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
          </TabList>
          <TabPanel style={{backgroundColor: '#f0f0f0'}}></TabPanel>
          <TabPanel style={{backgroundColor: '#f0f0f0'}}></TabPanel>
        </Tabs>
      </div>
    )
  }
}
