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
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Chip from 'material-ui/Chip';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';

import MenuItem from 'material-ui/MenuItem';
import Combobox from './Combobox.jsx';
import MultiSelectEditor, {InviteUser} from './MultiSelectEditor.jsx';
import { GiveAssignment, ListUserGiveAss, PermissionSubject } from './ChildManagerSubject.jsx'
const fileImageFile = 'https://i1249.photobucket.com/albums/hh508/nguyenxuanvinhict/file_zpsgm6uuyel.png';
const iconButtonElement = (
  <IconButton
    touch={true}
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);
class ManagerSubject extends React.Component {
  constructor(props) {
    super(props)
    this.styles = {
      chip: {
        margin: 4
      },
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
      },
    };
    this.state = {
      subjectId: props.params.subjectId,
      dataForum: {
        isForum: true,
        content: '',
        files: [],
      },
      dataTheme: {
        isTheme: true,
        title: '',
        content: '',
        files: [],
        open: false
      },
      dataAssign: {
        isAssignment: true,
        title: '',
        content: '',
        files: []
      },
      dataSetForum: [],
      dataSetTheme: [],
      userSubjects: [],
      userMails: [],
      userFriendsUserClass: [],
      topicSelected: {},
      openGiveAdd: false,
      openGiveList:false,
      filesAss: {},
      openDialogEdit: false
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.dataSet.getActivityForum && nextProps.dataSet.getActivityTheme && nextProps.dataSet.getActivityAssignment){
      let userFriendsUserClass = [];
      __.forEach(nextProps.dataSet.getTeacherByClassSubject,(ob) => {
          __.forEach(ob.friendList,(item) => userFriendsUserClass.push(item))
      });
      __.forEach(nextProps.dataSet.getUserByClassSucbject,(ob) => {
          __.forEach(ob.friendList,(item) => userFriendsUserClass.push(item))
      });
      this.setState({
        userFriendsUserClass: userFriendsUserClass,
        dataSetForum: __.cloneDeep(nextProps.dataSet.getActivityForum),
        dataSetTheme: __.cloneDeep(nextProps.dataSet.getActivityTheme),
        dataSetAss: __.cloneDeep(nextProps.dataSet.getActivityAssignment)
      })
    }
  }
  refreshData(){
    this.props.dataSet.refetch();
  }
  handleAddForum(){
    let info = {
      data: {
        isForum: true,
        content: this.state.dataForum.content,
      },
      classSubjectId: this.state.subjectId,
      files: this.state.dataForum.files
    }
    this.props.insertTopic(localStorage.getItem(this.props.loginToken),JSON.stringify(info)).then(({data}) => {
      if(data){
        this.props.addNotificationMute({fetchData: true, message: 'Thêm bài viết mới thành công', level:'success'});
        this.refreshData();
        this.setState({
          dataForum: {
            isForum: true, content: '', files: []
          }
        })
      }
    })
    .catch((error) => {
      this.props.addNotificationMute({fetchData: true, message: 'Faild', level:'error'});
      console.log(error);
    })
  }
  handleAddTheme(){
    let info = {
      data: {
        isTheme: true,
        content: this.state.dataTheme.content,
      },
      files: this.state.dataTheme.files,
      theme: {
        name: this.state.dataTheme.title
      },
      classSubjectId: this.state.subjectId
    }
    this.props.insertTopic(localStorage.getItem(this.props.loginToken),JSON.stringify(info)).then(({data}) => {
      if(data){
        this.props.addNotificationMute({fetchData: true, message: 'Thêm chủ đề mới thành công', level:'success'});
        this.refreshData();
        this.setState({
          dataTheme: {
            isTheme: true, title: '', content: '', files: [], open: false
          }
        })
      }
    })
    .catch((error) => {
      this.props.addNotificationMute({fetchData: true, message: 'Faild', level:'error'});
      console.log(error);
    })
  }
  handleAddAss(){
    let info = {
      data: {
        isAssignment: true,
        title: this.state.dataAssign.title,
        content: this.state.dataAssign.content,
      },
      files: this.state.dataAssign.files,
      classSubjectId: this.state.subjectId,
    }
    this.props.insertTopic(localStorage.getItem(this.props.loginToken),JSON.stringify(info)).then(({data}) => {
      if(data){
        this.props.addNotificationMute({fetchData: true, message: 'Thêm bài tập mới thành công', level:'success'});
        this.refreshData();
        this.setState({
          dataAssign: {
            isAssignment: true,  title: '', content: '', files: []
          },
        })
      }
    })
    .catch((error) => {
      this.props.addNotificationMute({fetchData: true, message: 'Faild', level:'error'});
      console.log(error);
    })
  }
  handleAddMedia(files,filetype,type){
    let that = this;
    let dataState = this.state;
    __.forEach(files,file => {
      if(file.size <= 1024*1000*2){
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            if(e.target.result){
              if(type === 'isForum'){
                dataState.dataForum.files.push({
                  file:e.target.result,
                  fileName: file.name,
                  type: file.type
                })
                that.setState({dataForum: dataState.dataForum});
              }
              else if (type === 'isAssignment') {
                dataState.dataAssign.files.push({
                  file:e.target.result,
                  fileName: file.name,
                  type: file.type
                })
                that.setState({dataAssign: dataState.dataAssign});
              }
              else if (type === 'isTheme') {
                dataState.dataTheme.files.push({
                  file:e.target.result,
                  fileName: file.name,
                  type: file.type
                })
                that.setState({dataTheme: dataState.dataTheme});
              }
            }
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
          that.props.addNotificationMute({fetchData: true, message: 'Faild', level:'error'});
        };
      }
      else if (file.size <= 1024*1000*20 && filetype == 'file') {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            if(e.target.result){
              if(type === 'isForum'){
                dataState.dataForum.files.push({
                  file:e.target.result,
                  fileName: file.name,
                  type: file.type
                })
                that.setState({dataForum: dataState.dataForum});
              }
              else if (type === 'isAssignment') {
                dataState.dataAssign.files.push({
                  file:e.target.result,
                  fileName: file.name,
                  type: file.type
                })
                that.setState({dataAssign: dataState.dataAssign});
              }
              else if (type === 'isTheme') {
                dataState.dataTheme.files.push({
                  file:e.target.result,
                  fileName: file.name,
                  type: file.type
                })
                that.setState({dataTheme: dataState.dataTheme});
              }
            }
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
      }
      else if (filetype == 'audioVideo' && file.size <= 1024*1000*50) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            if(e.target.result){
              if(type === 'isForum'){
                dataState.dataForum.files.push({
                  file:e.target.result,
                  fileName: file.name,
                  type: file.type
                })
                that.setState({dataForum: dataState.dataForum});
              }
              else if (type === 'isAssignment') {
                dataState.dataAssign.files.push({
                  file:e.target.result,
                  fileName: file.name,
                  type: file.type
                })
                that.setState({dataAssign: dataState.dataAssign});
              }
              else if (type === 'isTheme') {
                dataState.dataTheme.files.push({
                  file:e.target.result,
                  fileName: file.name,
                  type: file.type
                })
                that.setState({dataTheme: dataState.dataTheme});
              }
            }
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
      }
      else {
        alert('File nhỏ hơn!');
      }
    });
  }
  handleAddComment(event,topicId, idValue){
    let value = event.target.value;
    if(value && event.charCode === 13 || event.keyCode === 13){
      if(this.props.insertCommentForum){
        let info = {
          content: value,
          topicId: topicId
        }
        this.props.insertCommentForum(localStorage.getItem(this.props.loginToken),JSON.stringify(info)).then(({data}) => {
          if(data){
            document.getElementById(idValue).value = '';
            this.props.addNotificationMute({fetchData: true, message: 'Gửi bình luận thành công', level:'success'});
            this.refreshData();
          }
        })
        .catch((error) => {
          this.props.addNotificationMute({fetchData: true, message: 'Faild', level:'error'});
          console.log(error);
        })
      }
    }
  }
  renderActivityUser(){
    let userInClass = __.cloneDeep(this.props.dataSet.getUserByClassSucbject);
    __.forEach(userInClass,(user,idx) => {
      user.forum = [];
      __.forEach(this.props.dataSet.getActivityForum,(forum) => {
        if(forum.topic.owner._id == user._id){
          user.forum.push(forum)
        }
      })
    });
    return(
      <div style={{display: 'flex', flexDirection: 'column', padding: 20, backgroundColor: 'white'}}>
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Chức vụ</th>
              <th>Số lượng tương tác Forum</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{backgroundColor: 'red', color: 'white'}}>
              <td>VinhNguyen</td>
              <td>Nguyenxuanvinh55th2@gmail.com</td>
              <th>Giáo viên</th>
              <td>70</td>
            </tr>
            {
              __.map(userInClass,(userClass,idx) => {
                return (
                  <tr key={idx}>
                    <td>{userClass.name}</td>
                    <td>{userClass.email}</td>
                    <td>Sinh viên</td>
                    {/* <td>{userClass.forum.length}</td> */}
                    <td>{Math.floor((Math.random() * 30) + 1)}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    )
  }
  handleInvite(){
    __.forEach(this.state.userSubjects,(userId) => {
      if(this.props.checkCodeUser){
        this.props.checkCodeUser(userId, this.props.dataSet.getInfoClassSubject.code).then(({data}) => {
          if(data.checkCodeUser && data.checkCodeUser !== 'duplicated'){
            this.props.addNotificationMute({fetchData: true, message: 'Bạn đã được thêm vào lớp học thành công', level:'success'});
          }
          else if (data.checkCodeUser && data.checkCodeUser === 'duplicated') {
            this.props.addNotificationMute({fetchData: true, message: 'Bạn đã được thêm vào lớp, vui lòng kiểm tra lại danh sách môn học', level:'error'});
          }
          else {
            this.props.addNotificationMute({fetchData: true, message: 'Có vẻ như mã code môn học bị nhầm, vui lòng liên hệ lại với giáo viên để xác nhận lại mã môn học', level:'error'});
          }
        })
        .catch((error) => {
          this.props.addNotificationMute({fetchData: true, message: 'Faild', level:'error'});
        })
      }

    })
  }
  render(){
    let { dataSet, users } = this.props;
      if(dataSet.loading && !dataSet.getActivityForum){
        return (
          <div className="spinner spinner-lg"></div>
        )
      }
      else {
        return (
          <div style={{display: 'flex', flexDirection: 'row', padding: 20, justifyContent: 'space-between'}}>
            <div style={{width: '65%'}}>
              <Tabs className="secondary" >
                <TabList className="modal-header" style={{margin: 0, backgroundColor: 'white', borderBottom: 0}}>
                    <Tab>
                        <h4 className="modal-title" style={{color: '#35bcbf'}}>Forum</h4>
                    </Tab>
                    <Tab>
                        <h4 className="modal-title" style={{color: '#35bcbf'}}>Bài giảng</h4>
                    </Tab>
                    <Tab>
                        <h4 className="modal-title" style={{color: '#35bcbf'}}>Bài Tập</h4>
                    </Tab>
                    {/* <Tab>
                        <h4 className="modal-title" style={{color: '#35bcbf'}}>Khảo sát</h4>
                    </Tab> */}
                    <Tab>
                        <h4 className="modal-title" style={{color: '#35bcbf'}}>Thành viên</h4>
                    </Tab>
                    <Tab>
                        <h4 className="modal-title" style={{color: '#35bcbf'}}>Hoạt động</h4>
                    </Tab>
                    {
                      dataSet.getRolesUserClass && dataSet.getRolesUserClass.roles.length && (__.findIndex(dataSet.getRolesUserClass.roles, item => item === 'userCanUploadAssignment') > -1 ) ?
                      <Tab>
                          <h4 className="modal-title" style={{color: '#35bcbf'}}>Phân quyền</h4>
                      </Tab>: <div></div>
                    }
                </TabList>

                {/* forum */}
                <TabPanel style={{backgroundColor: '#f0f0f0'}}>
                  <div style={{display: 'flex', flexDirection: 'column', padding: 10, backgroundColor: 'white'}}>
                    <div style={{ minHeight: 150, borderRadius: 10, padding: 10}}>
                      <textarea rows="5" placeholder="Bạn có điều gì muốn hỏi" style={{ height: 100, width: '100%'}} value={this.state.dataForum.content} onChange={({target}) => {
                        let dataForum = this.state.dataForum;
                        dataForum.content = target.value;
                        this.setState({dataForum: dataForum})
                      }}/>
                      {
                        this.state.dataForum.files.length ?
                        <div style={this.styles.wrapper}>
                          {
                            __.map(this.state.dataForum.files,(file,idx) => {
                              return(
                                <Chip
                                    key={idx}
                                    onRequestDelete={() => {
                                      this.setState((prevState) => {
                                        prevState.dataForum.files.splice(idx,1);
                                        return prevState;
                                      });
                                    }}
                                    style={this.styles.chip}
                                  >
                                    {file.fileName}
                                  </Chip>
                              )
                            })
                          }
                        </div> : <div></div>
                      }
                      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <div>
                          <button type="button" className="btn" style={{width: 70, backgroundColor: 'white', boxShadow: 'none', border: '1px dotted #35bcbf', color: '#35bcbf'}} onClick={() => document.getElementById("getImageForum").click()}>+ Ảnh</button>
                          <button type="button" className="btn" style={{marginLeft: 10, width: 70, backgroundColor: 'white', boxShadow: 'none', border: '1px dotted #35bcbf', color: '#35bcbf'}} onClick={() => document.getElementById("getVideoForum").click()}>+ Video</button>
                          <button type="button" className="btn" style={{marginLeft: 10, width: 70, backgroundColor: 'white', boxShadow: 'none', border: '1px dotted #35bcbf', color: '#35bcbf'}} onClick={() => document.getElementById("getFileForum").click()}>+ Tệp</button>
                          <input type="file" id="getImageForum" accept="image/*" multiple={true} style={{display: 'none'}} onChange={({target}) => this.handleAddMedia(target.files,"image","isForum")} />
                          <input type="file" id="getVideoForum" accept="video/*,audio/*" multiple={false} style={{display: 'none'}} onChange={({target}) => this.handleAddMedia(target.files,"audioVideo","isForum")} />
                          <input type="file" id="getFileForum"  multiple={false} style={{display: 'none'}} onChange={({target}) => this.handleAddMedia(target.files,"file","isForum")} />
                        </div>
                        <div>
                          <button type="button" className="btn" style={{width: 70, backgroundColor: '#35bcbf', color: 'white'}} disabled={!this.state.dataForum.content} onClick={this.handleAddForum.bind(this)}>Đăng</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', marginTop: 10}}>
                    {
                      __.map(this.state.dataSetForum,(active,idx) => {
                        let topic = active.topic;
                        let idValue = 'comment' + '-' + idx;
                        let rightIconMenu = (
                          <IconMenu iconButtonElement={iconButtonElement}>
                            <MenuItem onClick={() => this.setState({openDialogEdit: true, topicSelected: topic})}>Chỉnh sửa</MenuItem>
                            <MenuItem onClick={() => {
                              let r = confirm('Bạn muốn xóa dữ liệu này')
                              if(r == true){
                                if(this.props.removeActivity){
                                  this.props.removeActivity(active._id).then(({data}) => {
                                    if(data){
                                      this.props.addNotificationMute({fetchData: true, message: 'Xóa thành công', level:'success'});
                                      this.refreshData();
                                    }
                                  })
                                  .catch((error) => {
                                    this.props.addNotificationMute({fetchData: true, message: 'Faild', level:'error'});
                                    console.log(error);
                                  })
                                }
                              }
                            }}>Xoá</MenuItem>
                          </IconMenu>
                        );
                        return (
                          <div key={idx} style={{backgroundColor: 'white', marginTop: 10, padding: 10}}>
                            <ListItem style={{fontSize: 13}}
                              innerDivStyle={{padding: '5px 16px 5px 50px'}}
                               leftAvatar={<Avatar src={topic.owner && topic.owner.image ? topic.owner.image : 'https://i1249.photobucket.com/albums/hh508/nguyenxuanvinhict/userImage_zpsqz3krq9r.jpg'} backgroundColor={'#35bcbf'} style={{top: 5, left: 7}} />}
                               primaryText={
                                 <p>
                                  {
                                    topic.owner && topic.owner.name ? topic.owner.name : 'Ẩn danh'
                                  }
                                 </p>
                               }
                               secondaryText={
                                 <p style={{fontSize: 10}}>{moment(topic.createdAt ? topic.createdAt : moment().valueOf()).format('HH:mm DD/MM/YYYY')}</p>
                               }
                              rightIconButton={rightIconMenu}
                             />
                             <div style={{display: 'flex', flexDirection: 'column', padding: 10}}>
                               <p>{topic.content}</p>
                               <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                                 {
                                   __.map(topic.files,(file, fileIdx) => {
                                     if(file.type.includes('image')){
                                       return (
                                         <div key={fileIdx} style={{padding: 5}}>
                                           <img src={file.file} className="img-responsive"/>
                                         </div>
                                       )
                                     }
                                     else if (file.type.includes('audio')) {
                                       return (
                                         <div key={fileIdx} style={{padding: 5}}>
                                           <audio src={file.file} controls/>
                                         </div>
                                       )
                                     }
                                     else if (file.type.includes('video')) {
                                       <div key={fileIdx} style={{padding: 5}}>
                                         <video controls src={file.file}/>
                                       </div>
                                     }
                                     else {
                                       return (
                                         <div key={fileIdx} style={{padding: 5, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                                           <img src={fileImageFile} className="img-responsive" style={{height: 85}}></img>
                                           <div style={{display: "flex", flexDirection: 'column'}}>
                                             <h3>{file.fileName}</h3>
                                             <div className="btn-group">
                                               <button type="button" className="btn btn-default" style={{width: 70, marginTop: 10}}
                                                 onClick={() => document.getElementById(file._id).click()}>Download</button>
                                               <button type="button" className="btn btn-primary" style={{width: 70, marginTop: 10}}>View</button>
                                            </div>
                                             <a href={file.file} download id={file._id} hidden></a>
                                           </div>
                                         </div>
                                       )
                                     }
                                   })
                                 }
                               </div>
                               <button type="button" className="btn" style={{minWidth: 80, maxWidth: 100, backgroundColor: '#35bcbf', color: 'white', marginTop: 10}} onClick={() => {
                                 let dataValueForum = this.state.dataSetForum;
                                 dataValueForum[idx].openComment = dataValueForum[idx].openComment ? !dataValueForum[idx].openComment : true;
                                 this.setState({dataSetForum: dataValueForum})
                               }}>Bình luận({topic.memberReply.length})</button>
                               {
                                 active.openComment &&
                                 <div>
                                   {
                                     __.map(topic.memberReply,(reply, index) => {
                                       return (
                                         <div key={index} style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 10}}>
                                           <img src={reply.owner && reply.owner.image ? reply.owner.image : 'https://i1249.photobucket.com/albums/hh508/nguyenxuanvinhict/userImage_zpsqz3krq9r.jpg'} width="30" height="30" />
                                           <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', marginLeft: 15}}>
                                             <p style={{color: '#35bcbf'}}>{reply.owner && reply.owner.name ? reply.owner.name : 'Vô danh'}</p> <p>&nbsp;</p> <p>{reply.content}</p>
                                           </div>
                                         </div>
                                       )
                                     })
                                   }
                                   <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 10}}>
                                     <img src="https://i1249.photobucket.com/albums/hh508/nguyenxuanvinhict/userImage_zpsqz3krq9r.jpg" width="30" height="30" style={{marginTop: 7}} />
                                     <input type="text" id={idValue} className="form-control" style={{marginTop: 10, marginLeft: 15}} onKeyPress={(event)=>this.handleAddComment(event,topic._id,idValue)} />
                                   </div>
                                 </div>
                               }
                             </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </TabPanel>

                {/* bai giang */}
                <TabPanel style={{backgroundColor: '#f0f0f0'}}>
                  <div style={{display: 'flex', flexDirection: 'column', padding: 20, backgroundColor: 'white'}}>
                    {
                      __.map(this.state.dataSetTheme,(theme,idx) => {
                        return (
                          <div key={idx} style={{border: '1px solid #f0f0f0', minHeight: 40, padding: 10, marginTop: idx == 0 ? 0 : 10, cursor: 'pointer'}}
                            onClick={() => {
                              let dataValueTheme = this.state.dataSetTheme;
                              dataValueTheme[idx].openDetail = dataValueTheme[idx].openDetail ? !dataValueTheme[idx].openDetail : true;
                              this.setState({dataSetTheme: dataValueTheme})
                            }}>
                            <p style={{fontWeight: 600}}>{theme.theme.name}</p>
                            {
                              theme.openDetail &&
                              <div>
                                <p>{theme.topic.content}</p>
                                {
                                  __.map(theme.topic.files,(file, fileIdx) => {
                                    if(file.type.includes('image')){
                                      return (
                                        <div key={fileIdx} style={{padding: 5}}>
                                          <img src={file.file} className="img-responsive"/>
                                        </div>
                                      )
                                    }
                                    else if (file.type.includes('audio')) {
                                      return (
                                        <div key={fileIdx} style={{padding: 5}}>
                                          <audio src={file.file} controls/>
                                        </div>
                                      )
                                    }
                                    else if (file.type.includes('video')) {
                                      <div key={fileIdx} style={{padding: 5}}>
                                        <video controls src={file.file}/>
                                      </div>
                                    }
                                    else {
                                    return (
                                      <div key={fileIdx} style={{padding: 5, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                                        <img src={fileImageFile} className="img-responsive" style={{height: 85}}></img>
                                        <div style={{display: "flex", flexDirection: 'column'}}>
                                          <h3>{file.fileName}</h3>
                                          <div className="btn-group">
                                            <button type="button" className="btn btn-default" style={{width: 70, marginTop: 10}}
                                              onClick={() => document.getElementById(file._id).click()}>Download</button>
                                            <button type="button" className="btn btn-primary" style={{width: 70, marginTop: 10}}>View</button>
                                         </div>
                                        </div>
                                      </div>
                                    )
                                    }
                                  })
                                }
                              </div>
                            }
                          </div>
                        )
                      })
                    }
                    {
                      dataSet.getRolesUserClass && dataSet.getRolesUserClass.roles.length && (__.findIndex(dataSet.getRolesUserClass.roles, item => item === 'userCanUploadLesson') > -1 )&&
                      <button type="button" className="btn" style={{backgroundColor: 'white', border: '1px dotted #35bcbf', color: '#35bcbf', marginTop: 5, height: 40}}
                         onClick={() => {
                           let dataTheme = this.state.dataTheme;
                           dataTheme.open = !this.state.dataTheme.open;
                           this.setState({dataTheme: dataTheme});
                         }}>
                        <span className={this.state.dataTheme.open ? "glyphicon glyphicon-minus" : "glyphicon glyphicon-plus"}></span> {this.state.dataTheme.open ? 'Hủy chủ đề' : 'Thêm chủ đề'}
                      </button>
                    }
                  </div>
                  {
                    this.state.dataTheme.open &&
                    <div style={{display: 'flex', flexDirection: 'column', marginTop: 10}}>
                      <div style={{backgroundColor: 'white', padding: 20}}>
                        <input type="text" placeholder="Tên chủ đề" style={{width: '100%', height: 40, padding:10, border: '1px solid #f0f0f0'}} onChange={({target}) => {
                          let dataTheme = this.state.dataTheme;
                          dataTheme.title = target.value;
                          this.setState({dataTheme: dataTheme});
                        }}/>
                        <div style={{border: '1px solid #f0f0f0', minHeight: 100, padding: 10, marginTop: 15}}>
                          <textarea rows="2" placeholder="Thêm nội dung chủ đề" style={{ height: 100, width: '100%'}} onChange={({target}) => {
                            let dataTheme = this.state.dataTheme;
                            dataTheme.content = target.value;
                            this.setState({dataTheme: dataTheme});
                          }}/>
                          {/* <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <button type="button" className="btn btn-link" style={{color: '#35bcbf'}}>Mở rộng</button>
                          </div> */}
                          {
                            this.state.dataTheme.files.length ?
                            <div style={this.styles.wrapper}>
                              {
                                __.map(this.state.dataTheme.files,(file,idx) => {
                                  return(
                                    <Chip
                                        key={idx}
                                        onRequestDelete={() => {
                                          this.setState((prevState) => {
                                            prevState.dataTheme.files.splice(idx,1);
                                            return prevState;
                                          });
                                        }}
                                        style={this.styles.chip}
                                      >
                                        {file.fileName}
                                      </Chip>
                                  )
                                })
                              }
                            </div> : <div></div>
                          }
                        </div>
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                          <div>
                            <button type="button" className="btn" style={{marginLeft: 10, width: 70, backgroundColor: 'white', boxShadow: 'none', border: '1px dotted #35bcbf', color: '#35bcbf'}} onClick={() => document.getElementById("getFileTheme").click()}>+ Tệp</button>
                            <input type="file" id="getFileTheme"  multiple={false} style={{display: 'none'}} onChange={({target}) => this.handleAddMedia(target.files,"file","isTheme")} />
                          </div>
                          <button type="button" className="btn" style={{backgroundColor: '#35bcbf', color: 'white', width: 100}} disabled={!this.state.dataTheme.title || !this.state.dataTheme.content} onClick={() => this.handleAddTheme()}>Thêm chủ đề</button>
                        </div>
                      </div>
                    </div>
                  }
                </TabPanel>
                {/* bai tap */}
                <TabPanel style={{backgroundColor: '#f0f0f0'}}>
                  <div style={{display: 'flex', flexDirection: 'column', padding: 20, backgroundColor: 'white'}}>
                    {
                      __.map(this.state.dataSetAss,(ass,idx) => {
                        return (
                          <div key={idx} style={{border: '1px solid #f0f0f0', minHeight: 40, padding: 10, marginTop: idx == 0 ? 0 : 10, cursor: 'pointer'}}>
                            <p style={{width: '100%', cursor: 'pointer', fontWeight: 600}} onClick={() => {
                                let dataValueAss = this.state.dataSetAss;
                                dataValueAss[idx].openDetail = dataValueAss[idx].openDetail ? !dataValueAss[idx].openDetail : true;
                                this.setState({dataSetAss: dataValueAss})
                              }}>{ass.topic.title}</p>
                            {
                              ass.openDetail &&
                              <div>
                                <h1 style={{color: 'red'}}>Hạn nộp: 06/30/2017</h1>
                                <p>{ass.topic.content}</p>
                                {
                                  __.map(ass.topic.files,(file, fileIdx) => {
                                    if(file.type.includes('image')){
                                      return (
                                        <div key={fileIdx} style={{padding: 5}}>
                                          <img src={file.file} className="img-responsive"/>
                                        </div>
                                      )
                                    }
                                    else if (file.type.includes('audio')) {
                                      return (
                                        <div key={fileIdx} style={{padding: 5}}>
                                          <audio src={file.file} controls/>
                                        </div>
                                      )
                                    }
                                    else if (file.type.includes('video')) {
                                      <div key={fileIdx} style={{padding: 5}}>
                                        <video controls src={file.file}/>
                                      </div>
                                    }
                                    else {
                                      return (
                                        <div key={fileIdx} style={{padding: 5, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                                          <img src={fileImageFile} className="img-responsive" style={{height: 85}}></img>
                                          <div style={{display: "flex", flexDirection: 'column'}}>
                                            <h3>{file.fileName}</h3>
                                            <div className="btn-group">
                                              <button type="button" className="btn btn-default" style={{width: 70, marginTop: 10}}
                                                onClick={() => document.getElementById(file._id).click()}>Download</button>
                                              <button type="button" className="btn btn-primary" style={{width: 70, marginTop: 10}}>View</button>
                                           </div>
                                          </div>
                                        </div>
                                      )
                                    }
                                  })
                                }
                              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                                  <button type="button" className="btn btn-warning" onClick={() => this.setState({openGiveAdd: true,topicSelected: ass.topic})} >Nộp bài</button>
                                  <button type="button" className="btn btn-default" style={{marginLeft: 10}} onClick={() => {
                                    browserHistory.push(this.props.location.pathname + "/"+ ass.topic._id)
                                  }} >Danh sách đã nộp</button>
                              </div>
                              </div>
                            }
                          </div>
                        )
                      })
                    }
                    {/* <button type="button" className="btn" style={{backgroundColor: 'white', border: '1px dotted #35bcbf', color: '#35bcbf', marginTop: 5, height: 40}}
                       onClick={() => this.handleAddTheme()}>
                      <span className="glyphicon glyphicon-plus"></span> Tải file bài tập
                    </button> */}
                  </div>
                  {
                     dataSet.getRolesUserClass && dataSet.getRolesUserClass.roles.length && (__.findIndex(dataSet.getRolesUserClass.roles, item => item === 'userCanUploadAssignment') > -1 ) ?
                     <div style={{display: 'flex', flexDirection: 'column', marginTop: 10}}>
                       <div style={{backgroundColor: 'white', padding: 20}}>
                         <button type="button" className="btn btn-link" style={{color: '#35bcbf'}}>Tạo mới bài tập tự luận</button>
                         <input type="text" placeholder="Tên bài tập" value={this.state.dataAssign.title} style={{width: '100%', height: 40, padding:10, border: '1px solid #f0f0f0'}} onChange={({target}) => {
                           let dataAssign = this.state.dataAssign;
                           dataAssign.title = target.value;
                           this.setState({dataAssign: dataAssign});
                         }}/>
                         <div style={{border: '1px solid #f0f0f0', minHeighth: 100, padding: 10, marginTop: 15}}>
                           <textarea rows="2" placeholder="Thêm nội dung câu hỏi bài tập" value={this.state.dataAssign.content} style={{border: 'none', height: 100, width: '100%'}} onChange={({target}) => {
                             let dataAssign = this.state.dataAssign;
                             dataAssign.content = target.value;
                             this.setState({dataAssign: dataAssign});
                           }}/>
                           {
                             this.state.dataAssign.files.length ?
                             <div style={this.styles.wrapper}>
                               {
                                 __.map(this.state.dataAssign.files,(file,idx) => {
                                   return(
                                     <Chip
                                         key={idx}
                                         onRequestDelete={() => {
                                           this.setState((prevState) => {
                                             prevState.dataAssign.files.splice(idx,1);
                                             return prevState;
                                           });
                                         }}
                                         style={this.styles.chip}
                                       >
                                         {file.fileName}
                                       </Chip>
                                   )
                                 })
                               }
                             </div> : <div></div>
                           }
                           {/* <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                             <button type="button" className="btn btn-link" style={{color: '#35bcbf'}}>Mở rộng</button>
                           </div> */}
                         </div>
                         <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10}}>
                           <label style={{width: 130}}>Hạn nộp</label>
                           <input type="date" className="form-control" />
                         </div>
                         <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                           <div>
                             <button type="button" className="btn" style={{marginLeft: 10, width: 70, backgroundColor: 'white', boxShadow: 'none', border: '1px dotted #35bcbf', color: '#35bcbf'}} onClick={() => document.getElementById("getFileAss").click()}>+ Tệp</button>
                             <input type="file" id="getFileAss"  multiple={false} style={{display: 'none'}} onChange={({target}) => this.handleAddMedia(target.files,"file","isAssignment")} />
                           </div>
                           <button type="button" className="btn" style={{backgroundColor: '#35bcbf', color: 'white', width: 100}} disabled={!this.state.dataAssign.title || !this.state.dataAssign.content} onClick={() => this.handleAddAss()}>Thêm bài tập</button>
                         </div>
                       </div>
                     </div>
                      :
                     <div></div>
                  }
                </TabPanel>

                {/* thanh vien */}
                <TabPanel style={{backgroundColor: '#f0f0f0'}}>
                  <div style={{display: 'flex', flexDirection: 'column',}}>
                    {
                      __.map(dataSet.getTeacherByClassSubject, (infoUser,idx) => {
                        return (
                          <div key={idx} style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: '100%', border: '2px solid white', padding: 10}}>
                            <div>
                              <img src={infoUser.image ? infoUser.image : 'https://i1249.photobucket.com/albums/hh508/nguyenxuanvinhict/userImage_zpsqz3krq9r.jpg'} height="75" width="75" className="img-responsive"/>
                            </div>
                            <div style={{paddingLeft: 10}}>
                              <h4>{infoUser.name}</h4>
                              <h5>{infoUser.email}</h5>
                              <p>Giáo viên</p>
                            </div>
                          </div>
                        )
                      })
                    }
                    {
                      __.map(dataSet.getUserByClassSucbject, (infoUser,idx) => {
                        return (
                          <div key={idx} style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: '100%', border: '2px solid white', padding: 10}}>
                            <div>
                              <img src={infoUser.image ? infoUser.image : 'https://i1249.photobucket.com/albums/hh508/nguyenxuanvinhict/userImage_zpsqz3krq9r.jpg'} height="75" width="75" className="img-responsive"/>
                            </div>
                            <div style={{paddingLeft: 10}}>
                              <h4>{infoUser.name}</h4>
                              <h5>{infoUser.email}</h5>
                              <p>Học viên</p>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </TabPanel>

                {/* hoatdong */}
                <TabPanel style={{backgroundColor: '#f0f0f0'}}>
                  {
                    this.renderActivityUser()
                  }
                </TabPanel>

                {/* phanquyen */}
                {
                  dataSet.getRolesUserClass && dataSet.getRolesUserClass.roles.length && (__.findIndex(dataSet.getRolesUserClass.roles, item => item === 'userCanUploadAssignment') > -1 ) ?
                  <TabPanel style={{backgroundColor: '#f0f0f0'}}>
                    <PermissionSubject {...this.props} userIds={__.map(dataSet.getUserByClassSucbject,(user) => user._id)} accountingObjectId={dataSet.getInfoClassSubject.accounting._id}/>
                  </TabPanel> :<div></div>
                }
              </Tabs>
            </div>
            <div style={{width: '35%', paddingLeft: 15}}>
              <div style={{backgroundColor: 'white', padding: 5}}>
                <h4 style={{textAlign: 'center', color: '#35bcbf'}}>{dataSet.getInfoClassSubject.name}</h4>
                <p>GV: {dataSet.getInfoClassSubject.teacher.name}</p>
                <p>Email: {dataSet.getInfoClassSubject.teacher.email}</p>
                <p>Code: <span style={{color: '#35bcbf', fontSize: 20 }}>{dataSet.getInfoClassSubject.code ? dataSet.getInfoClassSubject.code : 'XXXXX'}</span></p>
              </div>
              <div style={{marginTop: 10, backgroundColor: 'white', padding: 5}}>
                <h3 style={{textAlign: 'center'}}>Thêm học viên</h3>
                <EditMulti value={this.state.userSubjects} userIds={this.state.userFriendsUserClass} label={"name"} placeholder='...'
                   onChangeValue={(value) => this.setState({userSubjects: value})}/>
                 <div style={{marginTop: 15}}>
                   <InviteUser userMails={this.state.userMails} onChangeValue={(value) => this.setState({userMails: value})}/>
                 </div>
                 <button className="btn" style={{width: 70, backgroundColor: '#35bcbf', color: 'white', marginTop: 10}} onClick={() => this.handleInvite()}>Mời</button>
              </div>
            </div>
            <Dialog
              modal={true}
              open={this.state.openGiveAdd}
              autoDetectWindowHeight={false}
              autoScrollBodyContent={false}
              bodyStyle={{padding: 0}}
              contentStyle={{minHeight:'60%'}}
            >
              <GiveAssignment {...this.props} topicSelected={this.state.topicSelected} handleClose={() => this.setState({openGiveAdd: false})} />
            </Dialog>
            <Dialog
              modal={true}
              open={this.state.openDialogEdit}
              bodyStyle={{padding: 0}}
              contentStyle={{width: 400}}
            >
              <div className="modal-dialog" style={{width: 'auto', margin: 0}}>
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4 className="modal-title">Chỉnh sửa bài đăng</h4>
                    </div>
                    <div className="modal-body" style={{overflowY: 'auto', overflowX: 'hidden', overflowY: 'auto', overflowX: 'hidden'}}>
                    <textarea rows="5" style={{width: "100%"}} value={this.state.topicSelected.content} onChange={({target}) => {
                      this.setState((prevState, props) => {
                          prevState.topicSelected.content = target.value
                          return prevState
                        });
                    }}></textarea>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-default" onClick={() => this.setState({openDialogEdit: false})}>Đóng</button>
                      <button type="button" className="btn" style={{backgroundColor: '#35bcbf', color: 'white'}} disabled={!this.state.topicSelected.content} onClick={() => {
                        if(this.props.updateTopic){
                          let ob = {
                            content: this.state.topicSelected.content
                          }
                          this.props.updateTopic(this.state.topicSelected._id, JSON.stringify(ob)).then(({data}) => {
                            if(data.updateTopic){
                                this.props.addNotificationMute({fetchData: true, message: 'Thành công', level:'success'});
                                this.setState({openDialogEdit: false});
                                this.refreshData();
                            }
                            else {
                                this.props.addNotificationMute({fetchData: true, message: 'Faild', level:'error'});
                                this.setState({openDialogEdit: false});
                            }
                          })
                          .catch((error) => {
                            console.log(error);
                              this.props.addNotificationMute({fetchData: true, message: 'Faild', level:'error'});
                              this.setState({openDialogEdit: false});
                          })
                        }
                      }} >Cập nhật</button>
                    </div>
                  </div>
              </div>
            </Dialog>

          </div>
        )
      }
    }
}
const INSERT_FORUM = gql`
 mutation insertTopic($token:String!,$info:String){
   insertTopic(token:$token,info:$info)
 }
`;
const INSERT_COMMENT = gql`
 mutation insertCommentForum($token:String!,$info:String){
   insertCommentForum(token:$token,info:$info)
 }
`;
const REMOVE_ACTIVITY = gql`
 mutation removeActivity($_id: String){
   removeActivity(_id: $_id)
 }
`;
const UPDATE_TOPIC = gql`
 mutation updateTopic($_id: String, $info: String){
   updateTopic(_id: $_id, info: $info)
 }
`;
const checkCodeUser = gql`
 mutation checkCodeUser($userId: String, $code: String){
   checkCodeUser(userId: $userId, code: $code)
 }
`;
const MyQuery = gql`
    query getData($userId: String,$classSubjectId: String!){
      getActivityForum(classSubjectId: $classSubjectId) {
        _id
       topic {
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
         }
         files {
           _id  file type  fileName
         }
       }
     },
     getActivityTheme(classSubjectId: $classSubjectId) {
        _id
        theme {
          _id  name
        }
        topic {
         _id content
         files {
           _id  file type  fileName
         }
       }
     },
     getActivityAssignment(classSubjectId: $classSubjectId) {
        _id
        theme {
          _id  name
        }
        topic {
          _id title content links createdAt
          owner {
             _id name  image  email
           }
          files {
            _id  file type  fileName
          }
        }
      },
      getRolesUserClass(userId: $userId, objectId: $classSubjectId){
        _id
        roles
      },
      getUserByClassSucbject(classSubjectId: $classSubjectId){
        _id name image email friendList
      },
      getTeacherByClassSubject(classSubjectId: $classSubjectId){
        _id name image email friendList
      },
      getInfoClassSubject(classSubjectId:$classSubjectId) {
        _id name code
          teacher {
            _id name  image  email
          }
          accounting {
           _id
         }
        }
    }`
export default compose(
  graphql(MyQuery, {
      options: (ownProps) => ({
        variables: {userId: ownProps.users.userId,classSubjectId: ownProps.params.subjectId},
        fetchPolicy: 'cache-only'
      }),
      name: 'dataSet',
  }),
  graphql(INSERT_FORUM,{
       props:({mutate})=>({
       insertTopic : (token,info) =>mutate({variables:{token,info}})
     })
   }),
  graphql(INSERT_COMMENT,{
       props:({mutate})=>({
       insertCommentForum : (token,info) =>mutate({variables:{token,info}})
     })
   }),
  graphql(REMOVE_ACTIVITY,{
       props:({mutate})=>({
       removeActivity : (_id) =>mutate({variables:{_id}})
     })
   }),
  graphql(UPDATE_TOPIC,{
       props:({mutate})=>({
       updateTopic : (_id, info) =>mutate({variables:{_id, info}})
     })
   }),
   graphql(checkCodeUser,{
        props:({mutate})=>({
        checkCodeUser : (userId,code) =>mutate({variables:{userId, code}})
      })
    })
)(ManagerSubject)

class EditMultiForm extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    return(
      <div>
         <MultiSelectEditor value={this.props.userSubjects} data={this.props.dataUser.getAllUserFriendInClass ? this.props.dataUser.getAllUserFriendInClass : []} label={"name"} placeholder='...'
           onChangeValue={(value) => this.props.onChangeValue(value)}/>
      </div>
    )
  }
}
const QUYERYUSER = gql`
    query getAllUserFriendInClass($userIds: [String]) {
      getAllUserFriendInClass(userIds: $userIds){
        _id name image email
      }
  }`;
export const EditMulti =  graphql(QUYERYUSER, {
      options: ({userIds}) => ({variables: {
          userIds
        }, fetchPolicy: 'network-only'}),
      name: "dataUser"
  })(EditMultiForm);
