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
    this.data = [
      {
        name: 'Bài tập tự ôn trước khi thi',
        date: '03/2/2017',
        point: '7.5'
      },
      {
        name: 'Bài tập chương 2 tổng quan PHP',
        date: '09/3/2017',
        point: 'Chưa nộp'
      },
      {
        name: 'Bài tập tổng hợp kiến thức',
        date: '10/04/2017',
        point: '9'
      },
      {
        name: 'Bài tập kiểm tra giữa kì',
        date: '1/5/2017',
        point: '4.5'
      },
      {
        name: 'Bài tập luyện tập',
        date: '9/7/2017',
        point: 'Chưa nộp'
      },
      {
        name: 'Kiểm tra kết thúc môn học',
        date: '03/8/2017',
        point: 'Chưa nộp'
      }
    ]
  }
  render(){
    let { data } = this.props;
    if(!data.classSubjectsByStudent){
      return (
        <div className="spinner spinner-lg"></div>
      )
    }
    else {
      return (
        <div style={{display: 'flex', flexDirection: 'column', padding: 20}}>
          <h1>Tên: {data.user.name} - Email: {data.user.email}</h1>
          <Tabs className="secondary" >
            <TabList className="modal-header" style={{margin: 0, backgroundColor: 'white', borderBottom: 0}}>
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
                      <th></th>
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
                            <td>
                              <button type="button" className="btn" style={{boxShadow: 'none', border: 'none', backgroundColor: 'white'}}>
                                <span className="glyphicon glyphicon-info-sign" style={{color: 'blue'}}></span>
                              </button>
                            </td>
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
            <TabPanel style={{backgroundColor: '#f0f0f0'}}>
              <div style={{display: 'flex', flexDirection: 'column', padding: 10, backgroundColor: 'white'}}>
                <table className="table table-striped table-bordered">
                  <thead>
                    {/* <tr>
                      <th>#</th>
                      <th>Tên kì thì</th>
                      <th>Ngày thi</th>
                      <th>Điểm số</th>
                      <th>Trạng thái</th>
                    </tr> */}
                    <tr>
                      <th>#</th>
                      <th>Tên bài tập</th>
                      <th>Hạn nộp</th>
                      <th>Điểm số / trạng thái</th>
                      {/* <th>Trạng thái</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {/* {
                      __.map(this.props.data.getAllPlayperExamByUser,(exam,idx) => {
                        return(
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{exam.name}</td>
                            <td>
                              {
                                exam.status == 100 ? 'Đã kết thúc' : exam.status == 99 ? 'Đang diễn ra' : 'Chưa bắt đầu'
                              }
                            </td>
                          </tr>
                        )
                      })
                    } */}
                    {
                      __.map(this.data,(exam,idx) => {
                        return(
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{exam.name}</td>
                            <td>{exam.date}</td>
                            <td>{exam.point}</td>
                            {/* <td>
                              {
                                exam.status == 100 ? 'Đã kết thúc' : exam.status == 99 ? 'Đang diễn ra' : 'Chưa bắt đầu'
                              }
                            </td> */}
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            </TabPanel>
          </Tabs>
        </div>
      )
    }
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
    getAllPlayperExamByUser(userId:$userId) {
     _id
     code
     timeStart
     name
     description
     userCount
     time
     createdAt
     status
     isClassStyle
   },
   user(userId: $userId) {
     _id name email
   }
}`

export default compose(
graphql(CLASS_SUBJECT, {
    options: (ownProps) => ({
      variables: {userId: ownProps.params.childrenId},
      forceFetch: true
    }),
}),
)(ManagerUserParent);
