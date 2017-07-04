import React from 'react';
import { browserHistory } from 'react-router';

import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';

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
