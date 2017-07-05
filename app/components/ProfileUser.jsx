import React from 'react';
import { browserHistory } from 'react-router';

import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';
import Dialog from 'material-ui/Dialog';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import {Tabs, Tab} from 'material-ui/Tabs';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

class ProfileUser  extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'a',
      open: false,
      subjectSelected: {}
    };
  }
  handleChange (value){
   this.setState({
     value: value
   });
 }

  render(){
    let { dataProfile } = this.props;
    if(!dataProfile.notActive_getAllCourseByUser){
      return (
          <div className="spinner spinner-lg"></div>
      );
    }
    else {
      return (
        <div style={{display: 'flex', flexDirection: 'column', padding: 20}}>
          <Tabs
            value={this.state.value}
            onChange={(event) => this.handleChange(event)}
          >
            <Tab label="Danh sách khóa học" value="a">
              <div>
                <h2 style={styles.headline}>Danh sách khóa học</h2>
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên khóa học</th>
                      <th>Ngày bắt đầu</th>
                      <th>Ngày kết thúc</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      __.map(dataProfile.notActive_getAllCourseByUser,(course,idx) => {
                        return (
                          <tr key={idx}>
                            <td>{idx+1}</td>
                            <td>{course.name}</td>
                            <td>{moment(course.dateStart ? course.dateStart : moment().valueOf()).format('DD/MM/YYYY')}</td>
                            <td>{moment(course.dateEnd ? course.dateEnd : moment().valueOf()).format('DD/MM/YYYY')}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            </Tab>
            <Tab label="Danh sách lớp học" value="b">
              <div>
                <h2 style={styles.headline}>Danh sách lớp học</h2>
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Mã lớp học</th>
                      <th>Tên lớp học</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      __.map(dataProfile.notActive_getAllClassByUser,(classUser,idx) => {
                        return (
                          <tr key={idx}>
                            <td>{idx+1}</td>
                            <td>{classUser.code}</td>
                            <td>{classUser.name}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            </Tab>
            <Tab label="Danh sách môn học" value="c">
              <div>
                <h2 style={styles.headline}>Danh sách môn học</h2>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <table className="table table-striped table-bordered">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th></th>
                        <th></th>
                        <th>Mã môn học</th>
                        <th>Tên môn học</th>
                        <th>Mô tả</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        __.map(dataProfile.notActive_getAllSubjectByUser,(subject,idx) => {
                          return (
                            <tr key={idx}>
                              <td>{idx+1}</td>
                              <td>
                                <button type="button" className="btn btn-sm" disabled={!subject.classSubjects[0]} onClick={() => {
                                  if(subject.classSubjects && subject.classSubjects[0]){
                                    browserHistory.push("/profile/" + this.props.users.userId + '/' + subject.classSubjects[0]._id)
                                  }
                                }}
                                  style={{ margin: 0, boxShadow:'none', border: 'none', background:'none', padding: 0, color: '#35bcbf', fontSize: 15}}>
                                  <span className="glyphicon glyphicon-info-sign"></span>&nbsp;
                                </button>
                              </td>
                              <td>
                                <button type="button" className="btn btn-sm" disabled={!subject.classSubjects[0]} onClick={() => {
                                  this.setState({open: true, subjectSelected: subject})
                                }}
                                  style={{ margin: 0, boxShadow:'none', border: 'none', background:'none', padding: 0, color: '#35bcbf', fontSize: 15}}>
                                  <span className="glyphicon glyphicon-pencil"></span>&nbsp;
                                </button>
                              </td>
                              <td>{subject.code}</td>
                              <td>{subject.name}</td>
                              <td>{subject.description}</td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </Tab>
          </Tabs>
          <Dialog
            modal={true}
            open={this.state.open}
            autoDetectWindowHeight={false}
            autoScrollBodyContent={false}
            bodyStyle={{padding: 0}}
            contentStyle={{minHeight:'60%'}}
          >
            <div className="modal-dialog" style={{width: 'auto', margin: 0}}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">{this.state.subjectSelected.name}</h4>
                  </div>
                  <div className="modal-body" style={{overflowY: 'auto', overflowX: 'hidden'}}>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                      <button type="button" className="btn btn-primary" onClick={() => {
                        browserHistory.push(`/profile/${this.props.users.userId}/edit/${this.state.subjectSelected.classSubjects[0]._id}`)
                      }}>Chỉnh sửa</button>
                      <button type="button" className="btn btn-primary" onClick={()=> {
                        browserHistory.push(`/profile/${this.props.users.userId}/move/${this.state.subjectSelected.classSubjects[0]._id}`)
                      }}>Chuyển môn học</button>
                    </div>
                  </div>
                  <div className="modal-footer" style={{margin: 0}}>
                    <button type="button" className="btn btn-default" onClick={() => this.setState({open: false})}>Đóng</button>
                  </div>
                </div>
            </div>
          </Dialog>
        </div>
      )
    }
  }
}

const MyQueryProfile = gql`
    query dataProfile($userId: String){
      notActive_getAllCourseByUser(userId: $userId) {
        _id  name  dateStart  dateEnd
      }
      notActive_getAllClassByUser(userId: $userId) {
        _id  code name
      }
      notActive_getAllSubjectByUser(userId: $userId) {
         _id code name description
         classSubjects {
            _id code  name
          }
       }
    }`

export default compose(
  graphql(MyQueryProfile, {
      options: (ownProps) => ({
        variables: {userId: ownProps.users.userId},
        forceFetch: true
      }),
      name: 'dataProfile',
  })
)(ProfileUser)
