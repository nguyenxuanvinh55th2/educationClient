import React from 'react';
import { browserHistory } from 'react-router';
import CryptoJS from "crypto-js";

import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Dialog from 'material-ui/Dialog';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

class ManagerSystem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      height: window.innerHeight,
      courses: [],
      open: false,
      classSelected: {},
      teacherChange: {}
    }
  }
  componentWillReceiveProps(nextProps){
    if(this.props.courses.loading != nextProps.courses.loading && nextProps.courses.loading == false){
      this.setState({courses: __.cloneDeep(nextProps.courses.coursesActive)})
    }
  }
  render(){
    let { courses } = this.props;
    let dataState = this.state;
    if(!courses.user){
      return (
          <div className="spinner spinner-lg"></div>
      );
    }
    else {
      return (
        <div style={{flexDirection: 'column', padding: 20}}>
          <div style={{display: 'flex', flexDirection :'column', alignItems: 'center'}}>
            <h1>Danh sách các khóa học của hệ thống</h1>
          </div>
          <div style={{marginTop: 25}}>
            {
            __.map(dataState.courses,(course,idx) => {
              return(
                <div key={idx} style={{display: 'flex', flexDirection: 'column', backgroundColor: 'white', marginTop: 10, paddingLeft: 5}}>
                  <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                    <button type="button" className="btn btn-sm" onClick={() => {
                      let courses = dataState.courses;
                      courses[idx].showSubject = course.showSubject ? !course.showSubject : true;
                      this.setState({courses: courses})
                    }}
                      style={{ margin: 0, boxShadow:'none', background:'none', padding: 0}}>
                      <span className={course.showSubject ? 'glyphicon glyphicon-chevron-down': 'glyphicon glyphicon-chevron-right'}></span>&nbsp;
                    </button>
                    <p style={{paddingTop: 10}}>{course.name}</p>
                  </div>
                  {
                    course.showSubject &&
                    <table className="table table-striped table-bordered">
                      <caption>Danh sách môn học</caption>
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Xóa</th>
                          <th>Chuyển giáo viên</th>
                          <th>Mã môn học</th>
                          <th>Tên môn học</th>
                          <th>Tên giáo viên</th>
                          <th>Email</th>
                          <th>Tương tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          __.map(course.classSubjects,(classSubject,idx) => {
                            return (
                              <tr key={idx}>
                                <td>{idx+1}</td>
                                <td>
                                  <button type="button" className="btn btn-sm" onClick={() => {
                                    if(this.props.updateClassSubject){
                                      let confirm = window.confirm('Bạn thật sự muốn xóa môn học này ra khỏi khóa học');
                                      if(confirm){
                                        this.props.updateClassSubject(classSubject._id, JSON.stringify({isActive: false})).then(({data}) => {
                                          this.props.courses.refetch();
                                          this.props.addNotificationMute({fetchData: true, message: 'Xóa môn học thành công', level:'success'});
                                        })
                                        .catch((error) => {
                                          console.log(error);
                                          this.props.addNotificationMute({fetchData: true, message: 'Faild', level:'error'});
                                        })
                                      }
                                    }
                                  }}
                                    style={{ margin: 0, boxShadow:'none', background:'none', padding: 0, color: 'red'}}>
                                    <span className="glyphicon glyphicon-remove"></span>
                                  </button>
                                </td>
                                <td>
                                  <button type="button" className="btn btn-sm" onClick={() => {
                                    this.setState({open: true, classSelected: classSubject})
                                  }}
                                    style={{ margin: 0, boxShadow:'none', background:'none', color: 'red'}}>
                                      Chuyển
                                  </button>
                                </td>
                                <td>{classSubject.code}</td>
                                <td>{classSubject.name}</td>
                                <td>{classSubject.teacher.name}</td>
                                <td>{classSubject.teacher.email}</td>
                                <CountActive userId={classSubject.teacher._id} classSubjectId={classSubject._id} />
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </table>
                  }
                </div>
              )
            })
          }
        </div>
        <Dialog
          modal={true}
          open={this.state.open}
          bodyStyle={{padding: 0}}
          contentStyle={{width: 600}}
        >
          <div className="modal-dialog" style={{width: 'auto', margin: 0}}>
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Chuyển giáo viên cho môn học {this.state.classSelected.name}</h4>
                </div>
                <div className="modal-body" style={{overflowY: 'auto', overflowX: 'hidden', overflowY: 'auto', overflowX: 'hidden'}}>
                  <div className="form-group">
                    <label className="col-sm-3 control-label" >Chọn giáo viên</label>
                    <div className="col-sm-9">
                      <select value={this.state.teacherChange && this.state.teacherChange._id ? this.state.teacherChange._id : -1} onChange={({target}) => {
                        if(target.value != -1){
                          this.setState({teacherChange: this.props.courses.user.userFriendsUser[__.findIndex(this.props.courses.user.userFriendsUser,(userA) => userA._id === target.value)]});
                        }
                        else {
                          this.setState({teacherChange: {}})
                        }
                      }}>
                        <option value={-1}>Chọn giáo viên</option>
                        {
                          __.map(this.props.courses.user.userFriendsUser, (infoUser,idx) =>
                              <option key={idx} value={infoUser._id}>{infoUser._id} - {infoUser.email}</option>
                          )
                        }
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-default" onClick={() => this.setState({open: false})}>Đóng</button>
                  <button type="button" className="btn btn-primary" disabled={!this.state.teacherChange._id}  onClick={() => {
                    console.log(this.state.teacherChange);
                    if(this.props.moveTeacherInClassSubject){
                      this.props.moveTeacherInClassSubject(this.state.classSelected._id, JSON.stringify({userId: this.state.teacherChange._id})).then(({data}) => {
                        console.log(data);
                      })
                      .then((error) => {
                        console.log(error);
                      })
                    }
                  }}>Chuyển</button>
                </div>
              </div>
          </div>
        </Dialog>
        </div>
      )
    }
  }
}
const UPDATE_SUBJECT = gql`
 mutation updateClassSubject($classSubjectId: String, $info: String){
   updateClassSubject(classSubjectId: $classSubjectId, info: $info)
 }
`;
const  MOVE_TEACHER = gql`
 mutation moveTeacherInClassSubject($classSubjectId: String, $info: String){
   moveTeacherInClassSubject(classSubjectId: $classSubjectId, info: $info)
 }
`;

const MyQuery = gql`
    query courses ($userId: String){
      coursesActive {
        _id name
        classSubjects {
          _id name code
          teacher {
             _id name email
           }
          subject {
            _id name description
          }
          class {
            _id  name
          }
        }
      }
      user(userId:$userId) {
       _id name
       userFriendsUser {
          _id name image  email
        }
     }
    }`
export default compose(
graphql(MyQuery, {
    options: (ownProps) => ({
      variables: {userId: ownProps.users.userId},
      forceFetch: true
    }),
    name: 'courses',
}),
graphql(UPDATE_SUBJECT,{
     props:({mutate})=>({
     updateClassSubject : (classSubjectId,info) =>mutate({variables:{classSubjectId,info}})
   })
 }),
graphql(MOVE_TEACHER,{
     props:({mutate})=>({
     moveTeacherInClassSubject : (classSubjectId,info) =>mutate({variables:{classSubjectId,info}})
   })
 }),
)(ManagerSystem);

class CountActiveForm extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    return (
      <td>
        {
          this.props.countAc.loading ? '' : this.props.countAc.getCountActivityByUserClassSubject
        }
      </td>
    )
  }
}
const MyQueryAC = gql`
    query lengAcctive ($userId: String, $classSubjectId: String){
      getCountActivityByUserClassSubject(userId: $userId, classSubjectId: $classSubjectId)
    }`

const CountActive = graphql(MyQueryAC, {
    options: ({userId, classSubjectId}) => ({
      variables: {userId: userId,classSubjectId: classSubjectId},
      fetchPolicy: 'cache-only'
    }),
    name: 'countAc',
})(CountActiveForm)
