import React from 'react';

import { Link, Router, browserHistory } from 'react-router'

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';
import Dialog from 'material-ui/Dialog';
class ClassList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      code: '',
      name: '',
      userClasses: [],
      userMails: []
    }
  }
  handleSave(type){
    let info = {
      class: {
        code: this.state.code,
        name: this.state.name
      },
      userClasses: this.state.userClasses,
      userMails: this.state.userMails
    }
    if(this.props.insertClass){
      this.props.insertClass(this.props.users.userId,JSON.stringify(info)).then(({data}) => {
        if(data.insertClass){
          if(type == 'saveAndGo'){
            browserHistory.push('/profile/' + this.props.users.userId + '/createSubject');
          }
          else {
            browserHistory.push('/profile/' + this.props.users.userId);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      })
    }
  }
  render(){
    return (
      <div style={{display: 'flex', flexDirection: 'column', paddingTop: 20, width: '100%'}}>
        <div className="column">
          <div className="row">
            <div className="col-sm-3">
              <label >Mã lớp học</label>
            </div>
            <div className="col-sm-9">
              <input type="text" className="form-control" style={{width: '100%'}} value={this.state.code} onChange={({target}) => this.setState({code: target.value})}/>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-3">
              <label >Tên lớp học</label>
            </div>
            <div className="col-sm-9">
              <input type="text" className="form-control" style={{width: '100%'}} value={this.state.name} onChange={({target}) => this.setState({name: target.value})} />
            </div>
          </div>
          <div className="column">
            <label>Mời sinh viên tham gian lớp học</label>
            <div style={{marginLeft: '25%', paddingLeft: 10, paddingRight: 10}}>
              <input type="text"/>
            </div>
            <div style={{marginLeft: '25%', paddingLeft: 10, paddingRight: 10}}>
              <textarea rows="2" />
            </div>
          </div>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
            <button type="button" className="btn btn-primary" disabled={!this.state.code || ! this.state.name} onClick={() => this.handleSave("save")}>Tạo mới lớp học</button>
            <button type="button" className="btn btn-primary" disabled={!this.state.code || ! this.state.name} onClick={() => this.handleSave("saveAndGo")}>Tiếp tục thêm môn học</button>
          </div>
        </div>
      </div>
    )
  }
}
const INSERT_CLASS = gql`
 mutation insertClass($userId:String!,$info:String!){
   insertClass(userId:$userId,info:$info)
 }
`;
export default compose(
  graphql(INSERT_CLASS,{
       props:({mutate})=>({
       insertClass : (userId,info) =>mutate({variables:{userId,info}})
     })
   })
)(ClassList)
