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
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Search for..." style={{height: 35, borderRadius: 5}} />
            <span className="input-group-btn">
              <button className="btn btn-secondary" type="button" style={{backgroundColor: '#35bcbf', color: 'white', height: 35, width: 50, borderRadius: 5, left: -10, zIndex: 50}}><span className="glyphicon glyphicon-search"></span></button>
            </span>
          </div>
          {
            __.map(dataState.courses,(course,idx) => {
              return(
                <div key={idx} style={{display: 'flex', flexDirection: 'column', backgroundColor: 'white'}}>
                  <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                    <button type="button" className="btn btn-sm" onClick={() => {
                      let courses = dataState.courses;
                      courses[idx].show = course.show ? !course.show : true;
                      this.setState({courses: courses})
                    }}
                      style={{ margin: 0, boxShadow:'none', background:'none', padding: 0}}>
                      <span className={course.show ? 'glyphicon glyphicon-chevron-down': 'glyphicon glyphicon-chevron-right'}></span>&nbsp;
                    </button>
                    <p style={{paddingTop: 10}}>{course.name}</p>
                  </div>
                  {
                    !course.show &&
                    <div style={{ paddingLeft: 30}}>
                      {
                        __.map(course.classSubjects,(classSubject,index) => {
                          return(
                            <div key={index} style={{display: 'flex', flexDirection: 'column'}}>
                              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                                  <p style={{fontSize: 25}} >&bull;</p>
                                  <p style={{paddingTop: 10, paddingLeft: 5 }}> {classSubject.subject.name} - GV NGuyen xuan vinh</p>
                                </div>
                                <button type="button" className="btn btn-sm" onClick={() => {
                                }}
                                  style={{ margin: 0, boxShadow:'none', background:'none', padding: 0, color: '#35bcbf'}}>
                                  <span className="glyphicon glyphicon-info-sign"></span>&nbsp;
                                </button>
                              </div>
                              <div style={{paddingLeft: 5, paddingRight: 30}}>
                                <p>
                                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </p>
                                <h4 style={{color: '#35bcbf'}}>Nhập mã CODE để tham gia môn học</h4>
                                <div className="input-group">
                                  <input type="text" className="form-control" style={{height: 35}} />
                                  <span className="input-group-btn">
                                    <button className="btn btn-secondary" type="button" style={{backgroundColor: '#35bcbf', color: 'white', height: 35, width: 50}}>ENTER</button>
                                  </span>
                                </div>
                              </div>
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
      )
    }
  }
}

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
)(Wall);
