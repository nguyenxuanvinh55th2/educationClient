import React from 'react';
import { browserHistory } from 'react-router';
import CryptoJS from "crypto-js";

import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

class ManagerSystem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      height: window.innerHeight,
      courses: []
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
    if(courses.loading && courses.error){
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
                                    let courses = dataState.courses;
                                    courses[idx].showSubject = course.showSubject ? !course.showSubject : true;
                                    this.setState({courses: courses})
                                  }}
                                    style={{ margin: 0, boxShadow:'none', background:'none', padding: 0, color: 'red'}}>
                                    <span className="glyphicon glyphicon-remove"></span>
                                  </button>
                                </td>
                                <td>
                                  <button type="button" className="btn btn-sm" onClick={() => {
                                    let courses = dataState.courses;
                                    courses[idx].showSubject = course.showSubject ? !course.showSubject : true;
                                    this.setState({courses: courses})
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
        </div>
      )
    }
  }
}

const MyQuery = gql`
    query courses{
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
    }`
export default compose(
graphql(MyQuery, {
    options: (ownProps) => ({
      forceFetch: true
    }),
    name: 'courses',
})
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
