import React from 'react';

import { Link, Router, browserHistory } from 'react-router'

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import Dialog from 'material-ui/Dialog';

import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import {List, ListItem} from 'material-ui/List';
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
    this.state = {
      openDialog: false,
      height: window.innerHeight
    }
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
        <List>
         <ListItem
           primaryText="Giáo viên"
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
           primaryText="Học sinh"
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
       </List>
       <Dialog
         modal={true}
         open={this.state.openDialog}
         contentStyle={{width: 600,maxWidth: 'none'}}
       >
         <CreateCoure height={this.state.height -226} handleClose={this.handleClose.bind(this)} />
       </Dialog>
       <button onClick={() => this.setState({openDialog: true})}>Tao moi khoa hoc</button>
       </Drawer>
    )
  }
}

class CreateCoure extends React.Component {
  constructor(props) {
    super(props)
    this.state ={
      name: '',
      dateStart: '',
      dateEnd: ''
    }
  }
  render() {
    return (
      <div className="modal-dialog" style={{width: 'auto', margin: 0}}>
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Tạo mới khóa học</h4>
            </div>
            <div className="modal-body" style={{height:this.props.height, overflowY: 'auto', overflowX: 'hidden'}}>
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
              <button type="button" className="btn btn-primary">Tạo mới</button>
              <button type="button" className="btn btn-primary">Tạo mới và tiếp theo</button>
            </div>
          </div>
      </div>
    )
  }
}
