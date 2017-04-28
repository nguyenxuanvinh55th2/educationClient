import React from 'react';

import { Link, Router, browserHistory } from 'react-router'

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';

import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
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
      height: window.innerHeight
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

  readyExamination(_id) {
    let { readyExamination } = this.props;
    let token = localStorage.getItem('Meteor.loginToken');
    readyExamination(token, _id).then(() => {
      browserHistory.push('/waitExam/' + _id)
    })
  }

  renderExamination() {
    let { data, users } = this.props;
    if(data.loading && ! data.examByUser) {
      return []
    } else {
        return __.map(data.examByUser, (item, idx) =>(
          <ListItem key={idx}
            primaryText={
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <p style={{color: 'white', fontSize: 13}}>{ item.name }</p>
                {
                  item.status === 0 ?
                  <button className="btn btn-primary" onClick={this.readyExamination.bind(this, item._id)}>Bắt đầu</button> :
                  <button className="btn btn-primary" onClick={() => {
                    browserHistory.push('/waitExam/' + item._id)
                  }}>Xem laị</button>
                }
              </div>
            }
          />
        ))
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
        <div style={{textAlign: 'center'}}>
          <img src="/public/imgs/logo.png" alt="Dispute Bills" onClick={() => browserHistory.push("/")} style={{height: 40}} />
        </div>
        <List>
          <ListItem style={{backgroundColor :'#35bcbf', fontSize: 13}} onClick={() => browserHistory.push("/profile/" + users.userId)}
            innerDivStyle={{padding: '5px 16px 5px 50px'}}
             leftAvatar={<Avatar src={users.currentUser && users.currentUser.image ? users.currentUser.image : '/public/imgs/userImage.jpg'} backgroundColor={'#35bcbf'} style={{top: 5, left: 7}} />}
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
           style={{color: 'white', fontSize: 13}}
           nestedListStyle={{marginLeft: 25}}
           nestedItems={
            this.renderClassSubjectTeacher()
           }
         />
         <ListItem
           primaryText="Học sinh"
           leftIcon={<School color={'white'} style={{width: 20, height: 20}}/>}
           initiallyOpen={false}
           primaryTogglesNestedList={true}
           style={{color: 'white', fontSize: 13}}
           nestedItems={[
             <ListItem
               key={1}
               primaryText="Starred"
               leftIcon={<ActionGrade />}
             />,
           ]}
         />
         <ListItem
           primaryText="Phụ huynh"
           leftIcon={<Person color={'white'} style={{width: 20, height: 20}}/>}
           initiallyOpen={false}
           primaryTogglesNestedList={true}
           style={{color: 'white', fontSize: 13}}
           nestedItems={[
             <ListItem
               key={1}
               primaryText="Starred"
               leftIcon={<ActionGrade />}
             />,
           ]}
         />
         <ListItem
           primaryText="Danh sách kì thi"
           leftIcon={<Description color={'white'} style={{width: 20, height: 20}}/>}
           initiallyOpen={false}
           primaryTogglesNestedList={true}
           style={{color: 'white', fontSize: 13}}
           nestedItems={this.renderExamination()}
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
         {/* <ListItem
           primaryText="Hướng dẫn"
           leftIcon={<Public color={'white'} style={{width: 20, height: 20}}/>}
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
           style={{color: 'white', fontSize: 13}}
           nestedItems={[
           ]}
         />
       </List>
       <div className="btn-group"  style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap'}}>
         <button type="button" className="btn btn-link" style={{color: '#35bcbf', fontSize: 13}} onClick={() => this.setState({openDialog: true})}>Tạo khóa học</button>
         <button type="button" className="btn btn-link" style={{color: '#35bcbf', fontSize: 13}} onClick={() => browserHistory.push('/profile/' + this.props.users.userId + '/createClass')}>Tạo lớp học</button>
         <button type="button" className="btn btn-link" style={{color: '#35bcbf', fontSize: 13}} onClick={() =>browserHistory.push('/profile/' + this.props.users.userId + '/createSubject')}>Tạo môn học</button>
       </div>
       <Dialog
         modal={true}
         open={this.state.openDialog}
         contentStyle={{width: 600,maxWidth: 'none'}}
       >
         <CreateCoure {...this.props} height={window.innerHeight -226} handleClose={this.handleClose.bind(this)} />
       </Dialog>
       </Drawer>
    )
  }
}

const CLASS_SUBJECT = gql`
  query classSubjects($token: String!){
    classSubjectsByTeacher(token: $token) {
      _id name dateStart  dateEnd
      isOpen  publicActivity
      subject {
        _id code name ownerId  createAt
      }
      theme {
        _id  name  activity
      }
    }
    examByUser(token: $token) {
      _id
      code
      name
      description
      userCount
      time
      createdAt
      status
    }
}`

const READY_EXAMINATION = gql`
    mutation readytExamination ($token: String!, $_id: String!) {
      readyExamination(token: $token, _id: $_id)
}`

export default compose(
graphql(CLASS_SUBJECT, {
    options: () => ({
      variables: {token: localStorage.getItem('Meteor.loginToken')},
      forceFetch: true
    }),
}),
graphql(READY_EXAMINATION , {
    props: ({mutate})=> ({
      readyExamination : (token, _id) => mutate({variables: {token, _id}})
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
            // this.props.addNotification("success","ok")
          }
        })
        .catch((error) => {
          console.log(error);
        })
      }
    }
    else {
      if(this.props.insertCourse){
        this.props.insertCourse(this.props.users.userId,JSON.stringify(data)).then(({data}) =>{
          if(data.insertCourse){
            this.props.handleClose();
            browserHistory.push('/profile/' + this.props.users.userId + '/createClass');
          }
        })
        .catch((error) => {
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
              <button type="button" className="btn" style={{backgroundColor: '#35bcbf', color: 'white'}} disabled={!this.state.name || !this.state.dateStart || !this.state.dateEnd} onClick={() => this.handleSave("saveAndGo")}>Tạo mới và tiếp theo</button>
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
