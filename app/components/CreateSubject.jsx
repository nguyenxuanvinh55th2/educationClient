import React from 'react';

import { Link, Router, browserHistory } from 'react-router'

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';
import Dialog from 'material-ui/Dialog';
import Combobox from './Combobox.jsx';
class CreateSubject extends React.Component {
  constructor(props) {
    super(props)
    this.handleSave = this.handleSave.bind(this);
    this.handleAddTheme = this.handleAddTheme.bind(this);
    this.state = {
      code: '',
      name: '',
      discription: '',
      themes: [],
      joinCourse: false,
      classId: '',
      courseId: ''
    }
  }
  handleSave(){
    console.log(this.state);
    let info = {
      subject: {
        code: this.state.code,
        name: this.state.name,
        createAt: moment.valueOf(),
        userId: this.props.users.userId
      },
      classeSubject: {

      }
    };
    console.log(info);
    // if(this.props.insertSubject){
    //   this.props.insertSubject(this.props.users.userId,JSON.stringify(info)).then(({data}) => {
    //     if(data){
    //       console.log("success");
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   })
    // }
  }
  handleAddTheme(){
    let themes = this.state.themes;
    themes.push({
      name: 'Chủ đề ' + ' ' + (this.state.themes.length + 1)
    });
    console.log(themes);
    this.setState({themes: themes});
  }
  getClass(value){
    this.setState({classId: value});
  }
  getCourse(value){
    this.setState({courseId: value});
  }
  render(){
    let { dataSet } = this.props;
    if(dataSet.loading){
      return (
        <div className="spinner spinner-lg"></div>
      )
    }
    else {
      return (
        <div className="row" style={{padding: 15}}>
          <div className="col-sm-9">
            <h2>Môn học</h2>
            <div className="column">
              <div>
                <p>Chọn môn học</p>
                <div>

                </div>
              </div>
              <div>
                <form className="form-horizontal">
                  <div className="form-group">
                    <label className="col-sm-3 control-label">Mã môn học</label>
                    <div className="col-sm-9">
                      <input type="text" className="form-control" value={this.state.code} onChange={({target}) => this.setState({code: target.value})} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-3 control-label">Tên môn học</label>
                    <div className="col-sm-9">
                      <input type="text" className="form-control" value={this.state.name} onChange={({target}) => this.setState({name: target.value})} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-3 control-label">Mô tả</label>
                    <div className="col-sm-9">
                      <input type="text" className="form-control" value={this.state.description} onChange={({target}) => this.setState({description: target.value})} />
                    </div>
                  </div>
                </form>
              </div>
              <div>
                <div style={{display: 'flex', flexDirection:'column'}}>
                  {
                    __.map(this.state.themes,(theme,idx) => {
                      return(
                        <div key={idx}>
                          <input type="text" value={theme.name} onChange={({target}) => {
                            let themes = this.state.themes;
                            themes[idx].name = target.value;
                            this.setState({themes: themes});
                          }} />
                          <span><button>Delete</button></span>
                        </div>
                      )
                    })
                  }
                </div>
                <button type="button" className="btn btn-primary" onClick={() => this.handleAddTheme()}>Thêm chủ đề</button>
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div>
              <p>Lớp học</p>
              <Combobox
                name="class"
                data={dataSet.getSubjectByUserId}
                datalistName="classDataList"
                label="name"
                placeholder="Chọn lớp học"
                value={this.state.classId}
                getValue={this.getClass.bind(this)}/>
            </div>
            <div>
              <p>Khóa học</p>
              <Combobox
                name="course"
                data={dataSet.courses}
                datalistName="courseDataList"
                label="name"
                placeholder="Chọn khóa học"
                value={this.state.courseId}
                getValue={this.getCourse.bind(this)}/>
            </div>
            <div>
              <p>Thêm thành viên</p>
              <input type="text" className="form-control" value={this.state.description} onChange={({target}) => this.setState({description: target.value})} />
            </div>
            <div>
              <div className="checkbox">
                <label>
                  <input type="checkbox" checked={this.state.joinCourse} onChange={() => this.setState({joinCourse:!this.state.joinCourse})} /> Tham gia giảng dạy ngay
                </label>
              </div>
            </div>
            <div>
              <button type="button" className="btn btn-primary" disabled={!this.state.code || !this.state.name} onClick={() => this.handleSave()}>Hoàn thành</button>
            </div>
          </div>
        </div>
      )
    }
  }
}
const INSERT_SUBJECT = gql`
 mutation insertSubject($userId:String!,$info:String!){
   insertSubject(userId:$userId,info:$info)
 }
`;
const MyQuery = gql`
    query getSubjectByUserId($userId: String){
      getSubjectByUserId(userId: $userId) {
        _id
       name
       ownerId
       createAt
      },
      courses {
        _id
        name
        dateStart
        dateEnd
      }
    }`
export default compose(
  graphql(MyQuery, {
      options: (ownProps) => ({
        variables: {userId: ownProps.users.userId},
        forceFetch: true
      }),
      name: 'dataSet',
  }),
  graphql(INSERT_SUBJECT,{
       props:({mutate})=>({
       insertSubject : (userId,info) =>mutate({variables:{userId,info}})
     })
   })
)(CreateSubject)
