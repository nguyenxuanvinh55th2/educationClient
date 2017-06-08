import React from 'react';

import { Link, Router, browserHistory } from 'react-router'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {AgGridReact} from 'ag-grid-react';
import Dropzone from 'react-dropzone';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Dialog from 'material-ui/Dialog';
import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';

class GiveAssignmentForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      file: {},
    }
  }
  onDropAccepted(files) {
    let that = this;
    if(files.length){
      let file = files[0];
      if(file.size <= 1024*1000*10){
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            if(e.target.result){
              that.setState({file: {
                file: e.target.result,
                fileName: file.name,
                type: file.type
              }})
            }
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
      }
      else {
        alert('File nhỏ hơn 10MB!');
      }
    }
  }
  handleAdd(){
    let info = {
      data: {
        content: this.state.content,
        topicId: this.props.topicSelected._id,
        files: []
      },
      image: this.state.file
    }
    if(this.props.insertMemberReply){
      this.props.insertMemberReply(localStorage.getItem('Meteor.loginTokenFacebook') ? localStorage.getItem('Meteor.loginTokenFacebook') : localStorage.getItem('Meteor.loginTokenGoogle') ? localStorage.getItem('Meteor.loginTokenGoogle') : localStorage.getItem('Meteor.loginToken'), JSON.stringify(info)).then(({data}) => {
        if(data.insertMemberReply){
          this.props.handleClose();
          this.props.addNotificationMute({fetchData: true, message: 'Nộp bài tập thành công', level:'success'});
        }
        else {
          this.props.addNotificationMute({fetchData: true, message: 'Faild', level:'error'});
          this.props.handleClose();
        }
      })
      .catch((error) => {
        this.props.addNotificationMute({fetchData: true, message: 'Faild', level:'error'});
        this.props.handleClose();
      })
    }
  }
  render(){
    return (
      <div className="modal-dialog" style={{width: 'auto', margin: 0}}>
          <div className="modal-content">
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f5f5f5', borderBottom: 'none', padding: '10px 18px'}}>
              <h4 className="modal-title">Nộp bài tập: {this.props.topicSelected ? this.props.topicSelected.title : ''} - {this.props.topicSelected.owner ? this.props.topicSelected.owner.name : ''} </h4>
              <span className="close" onClick={() => this.props.handleClose()}>&times;</span>
            </div>
            <div className="modal-body" style={{maxHeight:window.innerHeight - 300, overflowY: 'auto', overflowX: 'hidden'}}>
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                <Dropzone onDrop={this.onDropAccepted.bind(this)} multiple={false} style={{height: 140, border: '1px solid gray', borderRadius: 10, padding: '13px 7px', width: 350}} minSize={0} maxSize={1024*10*1000} multiple={false} >
                  <div style={{textAlign: 'center'}}>Click or Drap here to upload file</div>
                </Dropzone>
              {
                this.state.file.file ?
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 15, width: '100%'}}>
                  <div style={{width: '100%'}}>
                    <p>{this.state.file.fileName}</p>
                      <textarea rows="2" style={{height: 105, width: '100%'}} value={this.state.content} placeholder="Nội dung" onChange={({target}) => this.setState({content: target.value})}/>
                  </div>
                </div> : <div></div>
              }
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" onClick={() => this.props.handleClose()}>Đóng</button>
              <button type="button" className="btn btn-primary" disabled={!this.state.content} onClick={this.handleAdd.bind(this)}>Nộp</button>
            </div>
          </div>
      </div>
    )
  }
}
const INSERT_MEMBER_REPLY = gql`
 mutation insertMemberReply($token:String!,$info:String){
   insertMemberReply(token:$token,info:$info)
 }
`;
export const GiveAssignment = graphql(INSERT_MEMBER_REPLY,{
       props:({mutate})=>({
       insertMemberReply : (token,info) =>mutate({variables:{token,info}})
     })
})(GiveAssignmentForm);

class ListUserGiveAssForm extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    let { dataSet } = this.props;
    if(!dataSet.getInfoTopic){
      return (
          <div className="spinner spinner-lg"></div>
      );
    }
    return (
      <div style={{display: 'flex', flexDirection: 'column', padding: 20}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <h2>DANH SÁCH SINH VIÊN NỘP BÀI TẬP</h2>
          <h4 style={{color: '#35bcbf'}}>{dataSet.getInfoTopic.title} - {dataSet.getInfoTopic.owner.name}</h4>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên</th>
              <th>Email</th>
              <th>File</th>
              <th>Ngày nộp</th>
              <th>Nộp dung</th>
            </tr>
          </thead>
          <tbody>
            {
              __.map(dataSet.getInfoTopic.memberReply,(member,idx) => {
                return (
                  <tr key={idx}>
                    <td>{idx +1}</td>
                    <td>{member.owner.name}</td>
                    <td>{member.owner.email}</td>
                    <td><a href={member.files && member.files[0] ? member.files[0].file : ''} download><p> {member.files && member.files[0] ? member.files[0].fileName : 'Not valid'}</p></a></td>
                    <td>{moment(member.createdAt).format('HH:mm DD/MM/YYYY')}</td>
                    <td>{member.content}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    )
  }
}

const MyQuery = gql`
    query getData($_id: String){
      getInfoTopic(_id: $_id) {
        _id title content links createdAt
        owner {
           _id name  image  email
         }
        memberReply {
          _id
          owner {
            _id name image email
          }
          content
          files {
            _id  file type  fileName
          }
          createdAt
        }
        files {
          _id  file type  fileName
        }
       },
    }`

export const ListUserGiveAss = graphql(MyQuery, {
    options: (ownProps) => ({
      variables: {_id: ownProps.params.topicId},
      fetchPolicy: 'cache-only'
    }),
    name: 'dataSet',
})(ListUserGiveAssForm);
class PermissionSubjectForm extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    let {dataPer} = this.props;
    console.log(this.props.dataPer);
    if(!dataPer.getPermissonInAccounting){
      return (
        <div className="spinner spinner-lg"></div>
      )
    }
    else {
      return (
        <div style={{display: 'flex', flexDirection: 'column',}}>
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <td></td>
                  <th>Tên học viên</th>
                  <th>Email</th>
                  <th>Tập các quyền</th>
                </tr>
              </thead>
              <tbody>
                {
                  __.map(dataPer.getPermissonInAccounting,(per,idx) => {
                    let rolesString = [];
                    __.forEach(per.profile.roles,(role) => {
                      switch (role) {
                        case 'userCanView':
                          rolesString.push("Có quyền xem nội dung")
                          break;
                        default:
                          break;
                      }
                    })
                    return (
                      <tr key={idx}>
                        <td><button type="button" className="btn btn-lg" style={{backgroundColor: idx % 2 == 0 ?'#f0f0f0' : 'whitesmoke', color: '#35bcbf'}} onClick={() => this.setState({openClass: true})}>
                            <span className="glyphicon glyphicon-pencil"></span>
                          </button></td>
                        <td>{per.user.name}</td>
                        <td>{per.user.email}</td>
                        <td>{rolesString.toString()}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      )

    }
  }
}

const MyQueryPer = gql`
    query getData($userIds: [String], $accountingObjectId: String){
      getPermissonInAccounting(userIds: $userIds, accountingObjectId: $accountingObjectId) {
      _id
      user {
        _id name image email
      }
      profile {
        _id roles name
      }
      }
    }`

export const PermissionSubject = graphql(MyQueryPer, {
    options: ({userIds, accountingObjectId}) => ({
      variables: {userIds: userIds, accountingObjectId: accountingObjectId},
      fetchPolicy: 'cache-only'
    }),
    name: 'dataPer',
})(PermissionSubjectForm);
