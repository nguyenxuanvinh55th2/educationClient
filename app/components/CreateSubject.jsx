import React from 'react';

import { Link, Router, browserHistory } from 'react-router'

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import ClassList from './ClassList.jsx';
import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';
import Dialog from 'material-ui/Dialog';
import Combobox from './Combobox.jsx';
import MultiSelectEditor, {InviteUser} from './MultiSelectEditor.jsx';
import { CreateCoure } from './LeftBar.jsx'
class CreateSubject extends React.Component {
  constructor(props) {
    super(props)
    this.handleSave = this.handleSave.bind(this);
    this.handleAddTheme = this.handleAddTheme.bind(this);
    this.state = {
      _id: '', code: '', name: '', description: '',  themes: [], joinCourse: false,
      classId: '', courseId: '', userSubjects: [], userMails: [],
      openClass: false, openCourse: false,
      checkedSelect: true, checkedNew: false
    }
  }
  handleSave(){
    let nameClassSubject = '';
    nameClassSubject += this.state.name;
    if(this.state.classId){
      let index = __.findIndex(this.props.getClassByUserId, {_id: this.state.classId});
      if(index > -1){
        nameClassSubject += this.props.getClassByUserId[index].name;
      }
    }
    let info = {
      _id: this.state._id,
      subject: {
        code: this.state.code,
        name: this.state.name,
        description: this.state.description,
        createAt: moment.valueOf(),
        ownerId: this.props.users.userId,
      },
      classSubject: {
        name: nameClassSubject,
        courseId: this.state.courseId,
        dateStart: moment.valueOf(),
        dateEnd: moment.valueOf()
      },
      userSubjects: this.state.userSubjects,
      userMails: this.state.userMails,
      joinCourse: this.state.joinCourse,
      themes: this.state.themes,
      classId: this.state.classId
    };
    if(this.props.insertSubject){
      this.props.insertSubject(this.props.users.userId,JSON.stringify(info)).then(({data}) => {
        if(data){
          this.props.addNotificationMute({fetchData: true, message: 'Tạo môn học mới thành công', level:'success'});
          browserHistory.push("/profile/" + this.props.users.userId);
        }
      })
      .catch((error) => {
        this.props.addNotificationMute({fetchData: true, message: 'Faild', level:'error'});
        console.log(error);
      })
    }
  }
  handleAddTheme(){
    let themes = this.state.themes;
    themes.push({
      name: 'Chủ đề ' + ' '
    });
    this.setState({themes: themes});
  }
  getClass(value){
    this.setState({classId: value});
  }
  getCourse(value){
    this.setState({courseId: value});
  }
  getClassSubject(value){
    if(value){
      let idx = __.findIndex(this.props.subjectClass.classSubjectsByTeacher,{_id: value});
      if(idx > -1){
        let data = this.props.subjectClass.classSubjectsByTeacher[idx];
        this.setState({
          _id: data.subject._id,
          code: data.subject.code,
          name: data.subject.name,
          description: data.subject.description,
          themes: data.theme,
        })
      }
    }
  }
  render(){
    let { dataSet, subjectClass } = this.props;
    if(dataSet.loading){
      return (
        <div className="spinner spinner-lg"></div>
      )
    }
    else {
      return (
        <div className="row" style={{padding: 15}}>
          {/* <button type="button"  onClick={() => this.props.dataSet.refetch()}>dfdfdsf</button> */}
          <div className="col-sm-8" style={{backgroundColor: 'white', padding: 10}}>
            <h3 style={{textAlign: 'center', color: "#35bcbf"}}>MÔN HỌC</h3>
            <div className="column">
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <div className="radio">
                  <label><input type="radio" checked={this.state.checkedSelect} onChange={() => this.setState({checkedNew: this.state.checkedSelect, checkedSelect: !this.state.checkedSelect})} name="optradio" />Chọn môn học</label>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 20}}>
                  <p style={{width: '20%'}}>Chọn môn học</p>
                  <div style={{width: '80%'}}>
                    <Combobox
                      name="subject"
                      data={subjectClass.classSubjectsByTeacher}
                      datalistName="subjectClassList"
                      label="name"
                      placeholder="Chọn môn học"
                      value={this.state._id}
                      getValue={this.getClassSubject.bind(this)}/>
                  </div>
                </div>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
                <div className="radio">
                  <label><input type="radio" checked={this.state.checkedNew} onChange={() => this.setState({checkedSelect: this.state.checkedNew, checkedNew: !this.state.checkedNew})} name="create" />Tạo mới môn học</label>
                </div>
                <div style={{paddingLeft: 20}}>
                  <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                    <label style={{width: '20%'}}>Mã môn học</label>
                    <input type="text" style={{width: '80%'}} value={this.state.code} onChange={({target}) => this.setState({code: target.value})} />
                  </div>
                  <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', marginTop: 7}}>
                    <label style={{width: '20%'}}>Tên môn học</label>
                    <input type="text" style={{width: '80%'}} value={this.state.name} onChange={({target}) => this.setState({name: target.value})} />
                  </div>
                  <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', marginTop: 7}}>
                    <label style={{width: '20%'}}>Mô tả</label>
                    <textarea rows="4" style={{width: '80%'}} value={this.state.description} onChange={({target}) => this.setState({description: target.value})} />
                  </div>
                </div>
              </div>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <p>Các chủ đề của môn học</p>
                <div style={{display: 'flex', flexDirection:'column', paddingLeft: 20}}>
                  {
                    __.map(this.state.themes,(theme,idx) => {
                      return(
                        <div key={idx} className="input-group" style={{width :'100%', marginTop: 5}}>
                           <input type="text" className="form-control" value={theme.name} style={{height: 40}} onChange={({target}) => {
                             let themes = this.state.themes;
                             themes[idx].name = target.value;
                             this.setState({themes: themes});
                           }} />
                           <span className="input-group-addon btn btn-default" style={{background:'none', color:'red', boxShadow:'none'}}
                             onClick={() => {
                               let themes = this.state.themes;
                               themes.splice(idx,1);
                               this.setState({themes: themes})
                             }}>
                                <span className="glyphicon glyphicon-remove"></span>
                            </span>
                         </div>
                      )
                    })
                  }
                  <button type="button" className="btn" style={{backgroundColor: 'white', border: '1px dotted #35bcbf', color: '#35bcbf', marginTop: 5, height: 40}}
                     onClick={() => this.handleAddTheme()}>
                    <span className="glyphicon glyphicon-plus"></span> Thêm chủ đề
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div style={{backgroundColor: 'white', padding: 10}}>
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <h4 style={{textAlign: 'center', color: "#35bcbf"}}>Lớp học</h4>
                <button type="button" className="btn" style={{backgroundColor: 'white', color: '#35bcbf'}} onClick={() => this.setState({openClass: true})}>
                  <span className="glyphicon glyphicon-plus"></span>
                </button>
              </div>
              <Combobox
                name="class"
                data={dataSet.getClassByUserId}
                datalistName="classDataList"
                label="name"
                placeholder="Chọn lớp học"
                value={this.state.classId}
                getValue={this.getClass.bind(this)}/>
            </div>
            <div style={{backgroundColor: 'white', padding: 10, marginTop: 10}}>
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <h4 style={{textAlign: 'center', color: "#35bcbf"}}>Khóa học</h4>
                <button type="button" className="btn" style={{backgroundColor: 'white', color: '#35bcbf'}} onClick={() => this.setState({openCourse: true})}>
                  <span className="glyphicon glyphicon-plus"></span>
                </button>
              </div>
              <Combobox
                name="course"
                data={dataSet.courses}
                datalistName="courseDataList"
                label="name"
                placeholder="Chọn khóa học"
                value={this.state.courseId}
                getValue={this.getCourse.bind(this)}/>
            </div>
            <div style={{backgroundColor: 'white', padding: 10, marginTop: 10, minHeight: 150}}>
              <h4 style={{textAlign: 'center', color: "#35bcbf"}}>Thêm thành viên</h4>
              <div style={{height: '100%'}}>
                <MultiSelectEditor value={this.state.userSubjects} data={dataSet.user.userFriendsUser} label={"name"} placeholder="Tìm kiếm sinh viên"
                   onChangeValue={(value) => this.setState({userSubjects: value})}/>
                 <div style={{marginTop: 15}}>
                   <InviteUser userMails={this.state.userMails} onChangeValue={(value) => this.setState({userMails: value})}/>
                 </div>
              </div>
           </div>
            <div style={{backgroundColor: 'white', padding: 10, marginTop: 10}}>
              <div className="checkbox">
                <label>
                  <input type="checkbox" checked={this.state.joinCourse} onChange={() => this.setState({joinCourse:!this.state.joinCourse})} /> Tham gia giảng dạy ngay
                </label>
              </div>
            </div>
            <div style={{width: '100%', marginTop: 10}}>
              <button type="button" className="btn" style={{backgroundColor: '#35bcbf', color: 'white', width : '100%'}} disabled={!this.state.code || !this.state.name || !this.state.description} onClick={() => this.handleSave()}>HOÀN THÀNH</button>
            </div>
          </div>
          <Dialog
            modal={true}
            open={this.state.openCourse}
            bodyStyle={{padding: 0}}
            contentStyle={{width: 600}}
          >
            <CreateCoure {...this.props} height={window.innerHeight -226} handleClose={() => this.setState({openCourse: false})} refreshData={() => this.props.dataSet.refetch()}/>
          </Dialog>
          <Dialog
            modal={true}
            open={this.state.openClass}
            bodyStyle={{padding: 0}}
            contentStyle={{width: 600}}
          >
            <ClassList {...this.props} height={window.innerHeight -226} handleClose={() => this.setState({openClass: false})} refreshData={() => this.props.dataSet.refetch()} />
          </Dialog>
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
      getClassByUserId(userId: $userId) {
         _id
         code
         name
         currentUserId
         role
         createAt
         createrId
       },
      courses {
        _id
        name
        dateStart
        dateEnd
      },
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
      name: 'dataSet',
  }),
  graphql(INSERT_SUBJECT,{
       props:({mutate})=>({
       insertSubject : (userId,info) =>mutate({variables:{userId,info}})
     })
   })
)(CreateSubject)
