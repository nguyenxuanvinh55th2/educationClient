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
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import ContentSend from 'material-ui/svg-icons/content/send';
import Subheader from 'material-ui/Subheader';
import Person from 'material-ui/svg-icons/social/person';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import MenuItem from 'material-ui/MenuItem';
import MapsPlace from 'material-ui/svg-icons/maps/place';
export default class LeftBarVinh extends React.Component {
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
  render() {
    return (
      <Drawer open={this.props.sidebarOpen}  docked={window.matchMedia(`(min-width: 800px)`).matches}
        onRequestChange={() => {
          if(!window.matchMedia(`(min-width: 800px)`).matches){
            this.props.closeLeftBar();
          }
        }} containerStyle={{backgroundColor: '#2b3a41', boxShadow: 'none'}}>
        <div style={{textAlign: 'center'}}>
          <img src="/public/imgs/logo.png" alt="Dispute Bills" style={{height: 40}} />
        </div>
        <List style={{color: 'white'}}>
         <ListItem
           primaryText="Giáo viên"
           leftIcon={<LocalLibary />}
           initiallyOpen={false}
           primaryTogglesNestedList={true}
           nestedItems={[
             <ListItem
               key={1}
               primaryText="Starred"
              //  leftIcon={<ActionGrade />}
             />,
            //  <ListItem
            //    key={2}
            //    primaryText={
            //      <div>
            //        <button className="btn btn-primary" onClick={() => this.setState({openDialog: true})}>Tạo mới môn học </button>
            //      </div>
            //    }
            //   //  leftIcon={<ActionGrade />}
            //  />,
           ]}
         />
         <ListItem
           primaryText="Học sinh"
           leftIcon={<School />}
           initiallyOpen={false}
           primaryTogglesNestedList={true}
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
           leftIcon={<Person />}
           initiallyOpen={false}
           primaryTogglesNestedList={true}
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
           leftIcon={<Description />}
           initiallyOpen={false}
           primaryTogglesNestedList={true}
           nestedItems={[
             <ListItem
               key={1}
               primaryText="Starred"
               leftIcon={<ActionGrade />}
             />,
           ]}
         />
         <ListItem
           primaryText="Thời gian biểu"
           leftIcon={<Note />}
           initiallyOpen={false}
           primaryTogglesNestedList={true}
           nestedItems={[
             <ListItem
               key={1}
               primaryText="Starred"
               leftIcon={<ActionGrade />}
             />,
           ]}
         />
         <ListItem
           primaryText="Hướng dẫn"
           leftIcon={<Public />}
           initiallyOpen={false}
           primaryTogglesNestedList={true}
           nestedItems={[
             <ListItem
               key={1}
               primaryText="Starred"
               leftIcon={<ActionGrade />}
             />,
           ]}
         />
         <ListItem
           primaryText="Cài đặt"
           leftIcon={<Setting />}
           initiallyOpen={false}
           primaryTogglesNestedList={true}
           nestedItems={[
             <ListItem
               key={1}
               primaryText="Starred"
               leftIcon={<ActionGrade />}
             />,
           ]}
         />
       </List>
       <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
         <button onClick={() => this.setState({openDialog: true})}>tao khoa hoc</button>
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
            browserHistory.push('/profile/' + this.props.users.userId + '/createClass')
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
              <button type="button" className="btn btn-primary" onClick={() => this.handleSave("save")}>Tạo mới</button>
              <button type="button" className="btn btn-primary" onClick={() => this.handleSave("saveAndGo")}>Tạo mới và tiếp theo</button>
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
