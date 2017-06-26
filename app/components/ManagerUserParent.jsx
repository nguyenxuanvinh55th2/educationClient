import React from 'react';

import { Link, Router, browserHistory } from 'react-router'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {AgGridReact} from 'ag-grid-react';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Dialog from 'material-ui/Dialog';
import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';
import ChildrentAss from './ChildrentAss.jsx';
class ManagerUserParent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openAss: false,
      classSubjectId: '',
      exams: []
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps .data.getAllPlayperExamByUser){
      let exams = [];
      __.forEach(nextProps.data.getAllPlayperExamByUser, (exam) => {
        if(exam.status !== 99){
          exams.push(exam)
        }
      });
      this.setState({exams: exams})
    }
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
                              <button type="button" className="btn" style={{boxShadow: 'none', border: 'none', backgroundColor: 'white'}} onClick={() => {
                                this.setState({openAss: true, classSubjectId: sub._id})
                              }}>
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
                    <tr>
                      <th>#</th>
                      <th>Tên kì thì</th>
                      <th>Ngày thi</th>
                      <th>Điểm số</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      __.map(this.state.exams,(exam,idx) => {
                        let score = '';
                        let indexUser = __.findIndex(exam.userExams, (user) => {
                          return user.player.user._id == this.props.params.childrenId
                        });
                        if(indexUser > -1){
                          score = exam.userExams[indexUser].score;
                        }
                        return(
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{exam.name}</td>
                            <td>{moment(exam.timeStart).format('HH:mm DD/MM/YYYY')}</td>
                            <td>
                              {
                                exam.status == 100 ? score : 'Chưa bắt đầu'
                              }
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            </TabPanel>
          </Tabs>
          <Dialog
            modal={true}
            open={this.state.openAss}
            autoDetectWindowHeight={false}
            autoScrollBodyContent={false}
            bodyStyle={{padding: 0}}
            contentStyle={{minHeight:'60%'}}
          >
            <ChildrentAss {...this.props} childrenId={this.props.params.childrenId} classSubjectId={this.state.classSubjectId} handleClose={() => this.setState({openAss: false})} />
          </Dialog>
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
     time
     createdAt
     status
     userExams {
     _id score
       player {
         _id
         user {
           _id
         }
       }
    }
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
