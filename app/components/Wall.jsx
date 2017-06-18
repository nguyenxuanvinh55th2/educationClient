import React from 'react';

import { browserHistory } from 'react-router';

import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import {List, ListItem} from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';

class Wall extends React.Component {
  constructor(props){
    super(props);
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
  renderSearchString(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
    str = str.replace(/ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|/g,"o");
    str = str.replace(/u|ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|/g,"u");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|/g,"e");
    str = str.replace(/ì|í|ị|ỉ|ĩ|/g,"i");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ|/g,"y")
    return str;
  }
  handleCheckCode(code){
    if(this.props.checkCodeUser){
      this.props.checkCodeUser(this.props.users.userId, code).then(({data}) => {
        if(data){
          this.props.addNotificationMute({fetchData: true, message: 'Bạn đã được thêm vào lớp học thành công', level:'success'});
        }
        else {
          this.props.addNotificationMute({fetchData: true, message: 'Có vẻ như mã code môn học bị nhầm, vui lòng liên hệ lại với giáo viên để xác nhận lại mã môn học', level:'error'});
        }
      })
      .catch((error) => {
        this.props.addNotificationMute({fetchData: true, message: 'Faild', level:'error'});
      })
    }
  }
  handleFilter(keyWord){
    keyWord = this.renderSearchString(keyWord);
    let data = [];
    let courses = __.cloneDeep(this.props.courses.coursesActive);
    __.forEach(courses,(course) => {
      if(this.renderSearchString(course.name).indexOf(keyWord) !== -1){
        data.push(course);
      }
      else {
        __.forEach(course.classSubjects,(classSubject) => {
          if(this.renderSearchString(classSubject.name).indexOf(keyWord) !== -1 || this.renderSearchString(classSubject.subject.name).indexOf(keyWord) !== -1 || this.renderSearchString(classSubject.teacher.email).indexOf(keyWord) !== -1 ||
              this.renderSearchString(classSubject.teacher.name).indexOf(keyWord) !== -1 ){
            data.push(course);
          }
        });
      }
    })
    this.setState({courses: data});
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
            <div className="input-group col-sm-8 col-md-8 col-lg-6">
              <input type="text" className="form-control" placeholder="Search for..." style={{height: 35, borderRadius: 5, zIndex: 1}} onChange={({target}) => {
                this.handleFilter(target.value);
              }}/>
              <span className="input-group-btn">
                <button className="btn btn-secondary" type="button" style={{backgroundColor: '#35bcbf', color: 'white', height: 35, width: 50, borderRadius: 5, left: -10, zIndex: 2}}><span className="glyphicon glyphicon-search"></span></button>
              </span>
            </div>
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
                    <div style={{ paddingLeft: 30}}>
                      {
                        __.map(course.classSubjects,(classSubject,index) => {
                          return(
                            <div key={index} style={{display: 'flex', flexDirection: 'column'}}>
                              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                                  <p style={{fontSize: 25}} >&bull;</p>
                                  <p style={{paddingTop: 10, paddingLeft: 5 }}> {classSubject.subject.name} - 55Th2 - GV NGuyen xuan vinh</p>
                                </div>
                                <button type="button" className="btn btn-sm" onClick={() => {
                                  let courses = dataState.courses;
                                  courses[idx].classSubjects[index].showInfo = courses[idx].classSubjects[index].showInfo ? !courses[idx].classSubjects[index].showInfo : true;
                                  this.setState({courses: courses})
                                }}
                                  style={{ margin: 0, boxShadow:'none', background:'none', padding: 0, color: '#35bcbf', fontSize: 15}}>
                                  <span className="glyphicon glyphicon-info-sign"></span>&nbsp;
                                </button>
                              </div>
                              {
                                classSubject.showInfo &&
                                <div style={{paddingLeft: 14, paddingRight: 30, paddingBottom: 30}}>
                                  <p>
                                    {classSubject.subject.description}
                                  </p>
                                  <h5 style={{color: '#35bcbf'}}>Nhập mã CODE để tham gia môn học</h5>
                                  <div className="input-group col-sm-9 col-md-6 col-lg-4">
                                    <input type="text" className="form-control" value={classSubject.checkCode ? classSubject.checkCode : ''} style={{height: 35}}
                                    onChange={({target}) => this.setState((prevState, props) => {
                                        prevState.courses[idx].classSubjects[index].checkCode = target.value
                                            return {courses: prevState.courses};
                                          })}/>
                                    <span className="input-group-btn">
                                      <button className="btn btn-secondary" type="button" style={{backgroundColor: '#35bcbf', color: 'white', height: 35, width: 50}} onClick={() => this.handleCheckCode(classSubject.checkCode)}>ENTER</button>
                                    </span>
                                  </div>
                                </div>
                              }
                            </div>
                          )
                        })
                      }
                    </div>
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

const checkCodeUser = gql`
 mutation checkCodeUser($userId: String, $code: String){
   checkCodeUser(userId: $userId, code: $code)
 }
`;

const MyQuery = gql`
    query courses{
      coursesActive {
        _id name
        classSubjects {
          _id name
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
}),
graphql(checkCodeUser,{
     props:({mutate})=>({
     checkCodeUser : (userId,code) =>mutate({variables:{userId, code}})
   })
 })
)(Wall);
