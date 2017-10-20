import React from 'react';

import { Link, Router, browserHistory } from 'react-router'

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { createContainer } from 'react-meteor-data';
import  { Questions } from 'educationServer/question'
import  { Examinations } from 'educationServer/examination'
import  { ClassSubjects } from 'educationServer/classSubject'
import ClassList from './ClassList.jsx';
import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';

import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Popover from 'material-ui/Popover';
import {List, ListItem} from 'material-ui/List';

import School from 'material-ui/svg-icons/social/school';
import LocalLibary from 'material-ui/svg-icons/maps/local-library';
import Description from 'material-ui/svg-icons/action/description'
import Setting from 'material-ui/svg-icons/action/settings'
import Note from 'material-ui/svg-icons/notification/event-note'
import Public from 'material-ui/svg-icons/social/public'

import ActionGrade from 'material-ui/svg-icons/action/grade';
import Person from 'material-ui/svg-icons/social/person';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';
import ActionInfo from 'material-ui/svg-icons/action/info';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import RotateLeft from 'material-ui/svg-icons/image/rotate-left';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';

const iconButtonElement = (
  <IconButton
    touch={true}
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);

class SubjectItem extends React.Component {
  renderSubjectTheme() {
    return __.map(this.props.themes,(theme,idx) => {
      return (
        <ListItem
          key={idx}
          style={{color: 'white', fontSize: 10}}
          primaryText={theme.name}
        />
      )
    })
  }
  render() {
    return (
      <ListItem
        primaryText={
          <div>
            <a style={{color: 'white'}} onClick={() => browserHistory.push("/profile/" + this.props.userId + '/' + this.props._id)}>{this.props.subject.name}</a>
          </div>
        }
        initiallyOpen={false}
        primaryTogglesNestedList={true}
        style={{color: 'white', fontSize: 13}}
        nestedItems={
          this.renderSubjectTheme()
        }
      />
    )
  }
}

class LeftBar extends React.Component {
  constructor(props) {
    super(props)
    this.handleResize = this.handleResize.bind(this);
    this.state = {
      openDialog: false,
      height: window.innerHeight,
      open: false,
      selectedIndex: -1,
      openDialogClass: false
    }
  }
  handleResize(e) {
      this.setState({height: window.innerHeight});
  }
  componentDidMount() {
      window.addEventListener('resize', this.handleResize);
  }
  componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
  }
  handleClose () {
    this.setState({openDialog: false});
  }

  renderClassSubjectTeacher() {
    let { data, subjectClass, subjectClassMutation  } = this.props;
    if(data.loading && ! data.classSubjectsByTeacher) {
      return []
    } else {
      if (!subjectClass.fetchData) {
          setTimeout(()=>{
              subjectClassMutation({
                  fetchData: true,
                  classSubjectsByTeacher:data.classSubjectsByTeacher
              });
          }, 500);
      }
      return __.map(data.classSubjectsByTeacher,(item,idx) =>(
        <SubjectItem key={idx} subject={item.subject} _id={item._id} themes={item.theme} userId={this.props.users.userId}/>
      ))
    }
  }
  renderClassSubjectStudent() {
    let { data, subjectClass, subjectClassMutation  } = this.props;
    if(data.loading && ! data.classSubjectsByStudent) {
      return []
    } else {
      if (!subjectClass.fetchData) {
          setTimeout(()=>{
              subjectClassMutation({
                  fetchData: true,
                  classSubjectsByStudent:data.classSubjectsByStudent
              });
          }, 500);
      }
      return __.map(data.classSubjectsByStudent,(item,idx) =>(
        <SubjectItem key={idx} subject={item.subject} _id={item._id} themes={item.theme} userId={this.props.users.userId}/>
      ))
    }
  }
  renderChildrent() {
    let { data, subjectClass, subjectClassMutation  } = this.props;
    if(data.loading && ! data.user) {
      return []
    } else {
      if (!subjectClass.fetchData) {
          setTimeout(()=>{
              subjectClassMutation({
                  fetchData: true,
                  childrents:data.user.childrents ? data.user.childrents : []
              });
          }, 500);
      }
      return __.map(data.user.childrents ? data.user.childrents : [] ,(item,idx) =>(
        <ListItem
          key={idx}
          primaryText={
            <div>
              <a style={{color: 'white'}} onClick={() => browserHistory.push("/profile/" + this.props.users.userId + '/managerUser/' + item._id )}>{item.name}</a>
            </div>
          }
          initiallyOpen={false}
          primaryTogglesNestedList={true}
          style={{color: 'white', fontSize: 13}}
        />
      ))
    }
  }
  readyExamination(_id) {
    let { readyExamination } = this.props;
    let token = localStorage.getItem(this.props.loginToken);
    readyExamination(token, _id).then(() => {
      browserHistory.push('/waitExam/' + _id)
    })
  }
  logout(){
    let { users, logout, loginToken } = this.props;
    if(this.props.logout && users.userId){
      this.props.logout(users.userId,localStorage.getItem(loginToken)).then(({data}) => {
        if(data.logoutUser){
          Meteor.logout();
          localStorage.removeItem('Meteor.loginTokenGoogle');
          localStorage.removeItem('Meteor.loginToken');
          localStorage.removeItem('Meteor.loginTokenFacebook');
          localStorage.removeItem('Meteor.loginServices');
          localStorage.removeItem('Meteor.loginServicesGoogle');
          this.props.loginCommand({});
          browserHistory.push('/');
        }
      })
    }
  }
  renderExamination() {
    let { data, users } = this.props;
    if(data.loading && ! data.examByUser) {
      return []
    } else {
        return __.map(data.examByUser, (item, idx) =>{
          let rightIconMenu = (
            <IconMenu iconButtonElement={iconButtonElement}>
              {
                 (item.status === 0 || item.status === 1) ?
                   <MenuItem onClick={this.readyExamination.bind(this, item._id)}>Bắt đâu kì thi</MenuItem> :
                   <MenuItem onClick={() => {
                       browserHistory.push('/waitExam/' + item._id)
                     }}>Xem lại kì thi</MenuItem>
              }
              <MenuItem onClick={() => {
                  let remove = confirm('Bạn thật sự muốn xóa bộ câu hỏi này?');
                  if(remove) {
                    let token = localStorage.getItem(this.props.loginToken);
                    this.props.removeExamination(token, item._id).then(() => {
                      this.props.data.refetch();
                    }).catch((err) => {
                    });
                  }
                }}>Bỏ theo dõi thì ki</MenuItem>
            </IconMenu>
          );
          return (
            <ListItem key={idx}
              primaryText={item.name}
              rightIconButton={rightIconMenu}
              style={{color: 'white', fontSize: 13}}
            />
          )
        })
    }
  }

  handleTouchTap(event){
      event.preventDefault();
      this.setState({
          open: true,
          anchorEl: event.currentTarget,
      });
  }

  renderQuestionSet() {
    let { data, users } = this.props;
    let { open, anchorEl } = this.state;
    if(data.loading && ! data.questionSetBankUser) {
      return []
    } else {
        return __.map(data.questionSetBankUser, (item, idx) =>{
          let rightIconMenu = (
            <IconMenu iconButtonElement={iconButtonElement}>
              <MenuItem onClick={() => {
                  browserHistory.push('/profile/' + users.userId + '/questionSet/' + item._id)
                }}>Xem bộ đề</MenuItem>
              <MenuItem onClick={() => {
                    let remove = confirm('Bạn thật sự muốn xóa bộ câu hỏi này?');
                    if(remove) {
                      let token = localStorage.getItem(this.props.loginToken);
                      this.props.removeQuestionSet(token, item._id).then(() => {
                        this.props.data.refetch();
                      }).catch((err) => {
                        console.log("message ", err);
                      });
                    }
                }}>Bỏ theo dõi bộ đề</MenuItem>
            </IconMenu>
          );
          return (
            (
              <ListItem key={idx}
                primaryText={item.title}
                rightIconButton={rightIconMenu}
                style={{color: 'white', fontSize: 13}}
              />
            )
          )
        })
    }
  }

  render() {
    let { users} = this.props;
    return (
      <Drawer open={this.props.sidebarOpen}  docked={window.matchMedia(`(min-width: 800px)`).matches}
        onRequestChange={() => {
          if(!window.matchMedia(`(min-width: 800px)`).matches){
            this.props.closeLeftBar();
          }
        }} containerStyle={{backgroundColor: '#2b3a41', boxShadow: 'none'}}>
        <div style={{textAlign: 'center', cursor: 'pointer'}}>
          <img src="https://sv1.upsieutoc.com/2017/10/12/logofn1.png" alt="Dispute Bills" onClick={() => browserHistory.push("/")} style={{height: 40}} />
        </div>
        <List>
          <ListItem style={{backgroundColor :'#35bcbf', fontSize: 13}} onClick={() => browserHistory.push("/profile/" + users.userId)}
            innerDivStyle={{padding: '5px 16px 5px 50px'}}
             leftAvatar={<Avatar src={users.currentUser && users.currentUser.image ? users.currentUser.image : 'https://sv1.upsieutoc.com/2017/10/12/userImage.png'} backgroundColor={'#35bcbf'} style={{top: 5, left: 7}} />}
             primaryText={
               <p>
                 {users.currentUser ? users.currentUser.name : ''}
               </p>
             }
             secondaryText={
               <p style={{fontSize: 10}}>{users.currentUser ? users.currentUser.email: ''}</p>
             }
           />
         <ListItem
           primaryText="Giáo viên"
           leftIcon={<LocalLibary color={'white'} style={{width: 20, height: 20}}/>}
           initiallyOpen={false}
           primaryTogglesNestedList={true}
           style={{color: 'white', fontSize: 13, backgroundColor: this.state.selectedIndex == 0 ?  'rgba(0, 0, 0, 0.2)' : ''}}
           nestedListStyle={{marginLeft: 25}}
           onClick={() => this.setState({selectedIndex: 0})}
           nestedItems={
            this.renderClassSubjectTeacher()
           }
         />
         <ListItem
           primaryText="Học sinh"
           leftIcon={<School color={'white'} style={{width: 20, height: 20}}/>}
           initiallyOpen={false}
           primaryTogglesNestedList={true}
           style={{color: 'white', fontSize: 13, backgroundColor: this.state.selectedIndex == 1 ?  'rgba(0, 0, 0, 0.2)' : ''}}
           onClick={() => this.setState({selectedIndex: 1})}
           nestedItems={
            this.renderClassSubjectStudent()
           }
         />
         <ListItem
           primaryText="Phụ huynh"
           leftIcon={<Person color={'white'} style={{width: 20, height: 20}}/>}
           initiallyOpen={false}
           primaryTogglesNestedList={true}
           style={{color: 'white', fontSize: 13, backgroundColor: this.state.selectedIndex == 2 ?  'rgba(0, 0, 0, 0.2)' : ''}}
           onClick={() => this.setState({selectedIndex: 2})}
           nestedItems={
            this.renderChildrent()
           }
         />
         <ListItem
           primaryText="Danh sách kì thi"
           leftIcon={<Description color={'white'} style={{width: 20, height: 20}}/>}
           initiallyOpen={false}
           primaryTogglesNestedList={true}
           style={{color: 'white', fontSize: 13, backgroundColor: this.state.selectedIndex == 3 ?  'rgba(0, 0, 0, 0.2)' : ''}}
           onClick={() => this.setState({selectedIndex: 3})}
           nestedItems={this.renderExamination()}
         />
         <ListItem
           primaryText="Bộ câu hỏi"
           leftIcon={<Description color={'white'} style={{width: 20, height: 20}}/>}
           initiallyOpen={false}
           primaryTogglesNestedList={true}
           style={{color: 'white', fontSize: 13, backgroundColor: this.state.selectedIndex == 4 ?  'rgba(0, 0, 0, 0.2)' : ''}}
           onClick={() => this.setState({selectedIndex: 4})}
           nestedItems={this.renderQuestionSet()}
         />
         {/* <ListItem
           primaryText="Thời gian biểu"
           leftIcon={<Note color={'white'} style={{width: 20, height: 20}}/>}
           initiallyOpen={false}
           primaryTogglesNestedList={true}
           style={{color: 'white', fontSize: 13}}
           nestedItems={[
           ]}
         /> */}
         <ListItem
           primaryText="Cài đặt"
           leftIcon={<Setting color={'white'} style={{width: 20, height: 20}}/>}
           initiallyOpen={false}
           primaryTogglesNestedList={true}
           style={{color: 'white', fontSize: 13, backgroundColor: this.state.selectedIndex == 5 ?  'rgba(0, 0, 0, 0.2)' : ''}}
           onClick={() => {
            this.setState({selectedIndex: 5});
            browserHistory.push('/profile/' + this.props.users.userId + '/userProfile')
           }}
           style={{color: 'white', fontSize: 13}}
           nestedItems={[
           ]}
         />
         <ListItem
           primaryText="Hướng dẫn"
           leftIcon={<Public color={'white'} style={{width: 20, height: 20}}/>}
           initiallyOpen={false}
           primaryTogglesNestedList={true}
           style={{color: 'white', fontSize: 13}}
           onClick={() => document.getElementById('tutorial').click()}
         />
         <ListItem
           primaryText="Đăng xuất"
           leftIcon={<RotateLeft color={'white'} style={{width: 20, height: 20}}/>}
           style={{color: 'white', fontSize: 13}}
           onClick={this.logout.bind(this)}
         />
       </List>
       <div className="btn-group"  style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap'}}>
         <button type="button" className="btn btn-link" style={{color: '#35bcbf', fontSize: 13}} onClick={() => this.setState({openDialog: true})}>Tạo khóa học</button>
         <button type="button" className="btn btn-link" style={{color: '#35bcbf', fontSize: 13}} onClick={() => this.setState({openDialogClass: true})}>Tạo lớp học</button>
         <button type="button" className="btn btn-link" style={{color: '#35bcbf', fontSize: 13}} onClick={() =>browserHistory.push('/profile/' + this.props.users.userId + '/createSubject')}>Tạo môn học</button>
       </div>
       <a id="tutorial" target="_blank" href="https://docs.google.com/document/d/1Qk2vx26NroYrupga8Y8aaLae08CirtwcXQ_zxSduWbk/edit?usp=sharing"></a>
       <Dialog
         modal={true}
         open={this.state.openDialog}
         bodyStyle={{padding: 0}}
         contentStyle={{width: 600}}
       >
         <CreateCoure {...this.props} height={window.innerHeight -226} handleClose={this.handleClose.bind(this)} />
       </Dialog>
       <Dialog
         modal={true}
         open={this.state.openDialogClass}
         bodyStyle={{padding: 0}}
         contentStyle={{width: 600}}
       >
         <ClassList {...this.props} height={window.innerHeight -226} handleClose={() => this.setState({openDialogClass: false})} />
         {/* <CreateCoure {...this.props} height={window.innerHeight -226} handleClose={this.handleClose.bind(this)} /> */}
       </Dialog>
       <PubSub RefreshData={() => this.props.data.refetch()}/>
       </Drawer>
    )
  }
}

const CLASS_SUBJECT = gql`
  query classSubjects($userId: String!,$token: String!){
    classSubjectsByTeacher(token: $token) {
      _id name dateStart  dateEnd
      isOpen  publicActivity
      subject {
        _id code name ownerId  createAt
      }
      theme {
        _id  name  activity
      }
    },
    classSubjectsByStudent(userId: $userId) {
      _id name dateStart  dateEnd
      isOpen  publicActivity
      subject {
        _id code name ownerId  createAt
      }
      theme {
        _id  name  activity
      }
    },
    examByUser(token: $token) {
      _id
      code
      name
      description
      userCount
      time
      createdAt
      status
    },
    user(userId:$userId) {
     _id name
     childrents {
        _id name image  email
      }
    }
    questionSetBankUser(userId: $userId) {
      _id
      title
    }
}`

const READY_EXAMINATION = gql`
    mutation readytExamination ($token: String!, $_id: String!) {
      readyExamination(token: $token, _id: $_id)
}`

const REMOVE_QUESTION_SET = gql`
    mutation removeQuestionSet ($token: String!, $_id: String!) {
      removeQuestionSet(token: $token, _id: $_id)
}`

const REMOVE_EXAMINATION = gql`
    mutation removeExamination ($token: String!, $_id: String!) {
      removeExamination(token: $token, _id: $_id)
}`

const LOGOUT = gql`
  mutation logout($userId: String, $token: String) {
    logoutUser(userId: $userId, token: $token)
  }
`;

export default compose(
graphql(CLASS_SUBJECT, {
    options: (ownProps) => ({
      variables: {userId: ownProps.users.userId,token: localStorage.getItem('Meteor.loginTokenFacebook') ? localStorage.getItem('Meteor.loginTokenFacebook') : localStorage.getItem('Meteor.loginTokenGoogle') ? localStorage.getItem('Meteor.loginTokenGoogle') : localStorage.getItem('Meteor.loginToken') },
      forceFetch: true
    }),
}),
graphql(READY_EXAMINATION , {
    props: ({mutate})=> ({
      readyExamination : (token, _id) => mutate({variables: {token, _id}})
    })
}),
graphql(REMOVE_QUESTION_SET, {
    props: ({mutate})=> ({
        removeQuestionSet : (token, _id) => mutate({variables:{token, _id}})
    })
}),
graphql(REMOVE_EXAMINATION , {
    props: ({mutate})=> ({
        removeExamination : (token, _id) => mutate({variables:{token, _id}})
    })
}),
graphql(LOGOUT,{
    props:({mutate})=>({
    logout : (userId,token) =>mutate({variables:{userId,token}})
  })
}),
)(LeftBar);

class CreateCoureForm extends React.Component {
  constructor(props) {
    super(props)
    this.state ={
      name: '',
      dateStart: '',
      dateEnd: '',
    }
  }
  handleSave(type){
    let data = {
      name: this.state.name,
      dateStart : moment(this.state.dateStart, 'YYYY-MM-DD').valueOf(),
      dateEnd: moment(this.state.dateEnd, 'YYYY-MM-DD').valueOf()
    }
    if(type === 'save'){
      if(this.props.insertCourse){
        this.props.insertCourse(this.props.users.userId,JSON.stringify(data)).then(({data}) =>{
          if(data.insertCourse){
            this.props.handleClose();
            if(this.props.refreshData){
              this.props.refreshData();
            }
            this.props.addNotificationMute({fetchData: true, message: 'Tạo khóa học mới thành công', level:'success'});
          }
        })
        .catch((error) => {
          this.props.addNotificationMute({fetchData: true, message: 'Faild', level:'error'});
          console.log(error);
        })
      }
    }
    else {
      if(this.props.insertCourse){
        this.props.insertCourse(this.props.users.userId,JSON.stringify(data)).then(({data}) =>{
          if(data.insertCourse){
            this.props.handleClose();
            this.props.addNotificationMute({fetchData: true, message: 'Tạo khóa học mới thành công', level:'success'});
            browserHistory.push('/profile/' + this.props.users.userId + '/createClass');
          }
        })
        .catch((error) => {
          this.props.addNotificationMute({fetchData: true, message: 'Faild', level:'error'});
          console.log(error);
        })
      }
    }
  }
  render() {
    return (
      <div className="modal-dialog" style={{width: 'auto', margin: 0}}>
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Tạo mới khóa học</h4>
            </div>
            <div className="modal-body" style={{overflowY: 'auto', overflowX: 'hidden', overflowY: 'auto', overflowX: 'hidden'}}>
              <form className="form-horizontal">
                <div className="form-group">
                  <label className="col-sm-3 control-label" >Tên khóa học</label>
                  <div className="col-sm-9">
                    <input type="text" className="form-control" value={this.state.name} onChange={({target}) => this.setState({name: target.value})}/></div>
                </div>
                <div className="form-group ">
                  <label className="col-sm-3 control-label">Ngày bắt đầu</label>
                  <div className="col-sm-9">
                    <input type="date" className="form-control" value={this.state.dateStart} onChange={({target}) => this.setState({dateStart: target.value})} />
                  </div>
                </div>
                <div className="form-group ">
                  <label className="col-sm-3 control-label">Ngày kết thúc</label>
                  <div className="col-sm-9">
                    <input type="date" className="form-control" value={this.state.dateEnd} onChange={({target}) => this.setState({dateEnd: target.value})} />
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" onClick={() => this.props.handleClose()}>Đóng</button>
              <button type="button" className="btn" style={{backgroundColor: '#35bcbf', color: 'white'}} disabled={!this.state.name || !this.state.dateStart || !this.state.dateEnd}  onClick={() => this.handleSave("save")}>Tạo mới</button>
              {
                !this.props.refreshData ?
                <button type="button" className="btn" style={{backgroundColor: '#35bcbf', color: 'white'}} disabled={!this.state.name || !this.state.dateStart || !this.state.dateEnd} onClick={() => this.handleSave("saveAndGo")}>Tạo mới và tiếp theo</button>
                : <div></div>
              }
            </div>
          </div>
      </div>
    )
  }
}


const INSERT_COURSE = gql`
 mutation insertCourse($userId:String!,$info:String!){
   insertCourse(userId:$userId,info:$info)
 }
`;
export const CreateCoure =graphql(INSERT_COURSE,{
     props:({mutate})=>({
     insertCourse : (userId,info) =>mutate({variables:{userId,info}})
   })
 })(CreateCoureForm)

class PubSubForm extends React.Component{
    constructor(props){
        super(props);
    }
    refesh(){
      if(this.props.RefreshData){
        this.props.RefreshData();
      }
    }
    componentWillUpdate(nextProps, nextState){
      if(this.props.classSubjectsCount !== nextProps.classSubjectsCount){
        this.refesh();
      }
      else if (this.props.questionCount !== nextProps.questionCount) {
        this.refesh();
      }
      else if (this.props.examinationCount !== nextProps.examinationCount) {
        this.refesh();
      }
    }
    render(){
        return (<div></div>);
    }
}
const PubSub = createContainer((ownProps) => {
  Meteor.subscribe("questions");
  Meteor.subscribe("examinations");
  Meteor.subscribe("classSubjects");
  return {
    classSubjectsCount: ClassSubjects.find({}).count(),
    questionCount: Questions.find({}).count(),
    examinationCount: Examinations.find({}).count()
  }
}, PubSubForm);
