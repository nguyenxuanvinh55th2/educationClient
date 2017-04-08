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
      userClasses: []
    }
  }
  handleSave(type){
    let info = {
      class: {
        code: this.state.code,name: this.state.name
      },
      userClasses: this.state.userClasses
    }
    if(this.props.insertClass){
      this.props.insertClass(this.props.users.userId,JSON.stringify(info)).then(({data}) => {
        if(data.insertClass){
          browserHistory.push('/profile/' + this.props.users.userId + '/createSubject');
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
        <form className="form-horizontal">
          <div className="form-group">
            <label className="col-sm-3 control-label" >Mã lớp học</label>
            <div className="col-sm-9">
              <input type="text" className="form-control" style={{width: '100%'}} value={this.state.code} onChange={({target}) => this.setState({code: target.value})}/>
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-3 control-label" >Tên lớp học</label>
            <div className="col-sm-9">
              <input type="text" className="form-control" style={{width: '100%'}} value={this.state.name} onChange={({target}) => this.setState({name: target.value})} />
            </div>
          </div>
          {/* <div className="col-sm-9 col-sm-offset-3" style={{display: 'flex', justifyContent: 'column'}}>
            <p>
              Mới sinh viên tham gia lớp học
            </p>
            <input />
          </div> */}
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
            <button type="button" className="btn btn-primary" disabled={!this.state.code || ! this.state.name} onClick={() => this.handleSave("save")}>Tạo mới lớp học</button>
            <button type="button" className="btn btn-primary" disabled={!this.state.code || ! this.state.name} onClick={() => this.handleSave("saveAndGo")}>Tiếp tục thêm môn học</button>
          </div>
        </form>
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
