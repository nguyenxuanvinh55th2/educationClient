import React from 'react';

import { Link, Router, browserHistory } from 'react-router'

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';
import Dialog from 'material-ui/Dialog';
import MultiSelectEditor, {InviteUser} from './MultiSelectEditor.jsx'
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
        this.props.addNotificationMute({fetchData: true, message: 'Tạo lớp học mới thành công', level:'success'});
        }
      })
      .catch((error) => {
        this.props.addNotificationMute({fetchData: true, message: 'Faild', level:'error'});
        console.log(error);
      })
    }
  }
  render(){
    let { dataSet } = this.props;
    if(dataSet.loading && !dataSet.user){
      return (
        <div className="spinner spinner-lg"></div>
      )
    }
    else {
      return (
        <div className="column" style={{padding: 15}}>
          <h3 style={{textAlign: 'center', color: "#35bcbf"}}>LỚP HỌC</h3>
          <div className="row" style={{marginTop: 5}}>
            <div className="col-sm-3">
              <label >Mã lớp học</label>
            </div>
            <div className="col-sm-9">
              <input type="text" className="form-control" style={{width: '100%'}} value={this.state.code} onChange={({target}) => this.setState({code: target.value})}/>
            </div>
          </div>
          <div className="row" style={{marginTop: 5}}>
            <div className="col-sm-3">
              <label >Tên lớp học</label>
            </div>
            <div className="col-sm-9">
              <input type="text" className="form-control" style={{width: '100%'}} value={this.state.name} onChange={({target}) => this.setState({name: target.value})} />
            </div>
          </div>
          <div className="column">
            <label>Mời sinh viên tham gian lớp học</label>
            <div style={{marginLeft: '25%', paddingLeft: 10, marginTop: 5}}>
              <MultiSelectEditor value={this.state.userClasses} data={dataSet.user.userFriendsUser} label={"name"} placeholder="Tìm kiếm sinh viên"
                 onChangeValue={(value) => this.setState({userClasses: value})}/>
            </div>
            <div style={{marginLeft: '25%', paddingLeft: 10, marginTop: 5}}>
              <InviteUser userMails={this.state.userMails} onChangeValue={(value) => this.setState({userMails: value})}/>
            </div>
          </div>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20}}>
            <button type="button" className="btn" style={{backgroundColor: '#35bcbf', color: 'white'}} disabled={!this.state.code || ! this.state.name} onClick={() => this.handleSave("save")}>Tạo mới lớp học</button>
            <button type="button" className="btn" style={{backgroundColor: '#35bcbf', color: 'white', marginLeft: 10}} disabled={!this.state.code || ! this.state.name} onClick={() => this.handleSave("saveAndGo")}>Tiếp tục thêm môn học</button>
          </div>
        </div>
      )
    }
  }
}
const INSERT_CLASS = gql`
 mutation insertClass($userId:String!,$info:String!){
   insertClass(userId:$userId,info:$info)
 }
`;
const MyQuery = gql`
    query getData($userId: String){
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
  graphql(INSERT_CLASS,{
       props:({mutate})=>({
       insertClass : (userId,info) =>mutate({variables:{userId,info}})
     })
   })
)(ClassList)
