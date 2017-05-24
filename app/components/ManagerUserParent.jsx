import React from 'react';

import { Link, Router, browserHistory } from 'react-router'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {AgGridReact} from 'ag-grid-react';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';
class ManagerUserParent extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    console.log(this.props.data.classSubjectsByStudent);
    return (
      <div style={{display: 'flex', flexDirection: 'column', padding: 20}}>
        <Tabs className="secondary" >
          <TabList className="modal-header" style={{margin: 0, backgroundColor: 'white'}}>
              <Tab>
                  <h4 className="modal-title" style={{color: '#35bcbf'}}>Danh sách môn học</h4>
              </Tab>
              <Tab>
                  <h4 className="modal-title" style={{color: '#35bcbf'}}>Danh sách kì thi</h4>
              </Tab>
          </TabList>
          <TabPanel style={{backgroundColor: '#f0f0f0'}}>
            <div style={{display: 'flex', flexDirection: 'column', padding: 10, backgroundColor: 'white'}}>
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tên môn học</th>
                    <th>Tên giáo viên</th>
                    <th>Email giáo viên</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    __.map(this.props.data.classSubjectsByStudent,(sub,idx) => {
                      return(
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{sub.name}</td>
                          <td>{sub.teacher.name}</td>
                          <td>{sub.teacher.email}</td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
          </TabPanel>
          <TabPanel style={{backgroundColor: '#f0f0f0'}}></TabPanel>
        </Tabs>
      </div>
    )
  }
}
const CLASS_SUBJECT = gql`
  query classSubjects($userId: String!){
    classSubjectsByStudent(userId: $userId) {
      _id name
      subject {
        _id code name ownerId  createAt
      }
      teacher {
        _id  name  image  email
      }
    },
}`

export default compose(
graphql(CLASS_SUBJECT, {
    options: (ownProps) => ({
      variables: {userId: ownProps.params.childrenId},
      forceFetch: true
    }),
}),
)(ManagerUserParent);
