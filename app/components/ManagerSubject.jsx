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
import Combobox from './Combobox.jsx';
import MultiSelectEditor, {InviteUser} from './MultiSelectEditor.jsx';
const fileImageFile = 'https://i1249.photobucket.com/albums/hh508/nguyenxuanvinhict/file_zpsgm6uuyel.png'
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
      openGiveAdd: false
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
    this.props.insertTopic(localStorage.getItem('Meteor.loginToken'),JSON.stringify(info)).then(({data}) => {
      if(data){
        this.props.addNotificationMute({fetchData: true, message: 'Thêm bài viết mới thành công', level:'success'});
        this.refreshData();
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
    this.props.insertTopic(localStorage.getItem('Meteor.loginToken'),JSON.stringify(info)).then(({data}) => {
      if(data){
        this.props.addNotificationMute({fetchData: true, message: 'Thêm chủ đề mới thành công', level:'success'});
        this.refreshData();
      }
      console.log(data);
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
    this.props.insertTopic(localStorage.getItem('Meteor.loginToken'),JSON.stringify(info)).then(({data}) => {
      if(data){
        this.props.addNotificationMute({fetchData: true, message: 'Thêm bài tập mới thành công', level:'success'});
        this.refreshData();
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
        this.props.insertCommentForum(localStorage.getItem('Meteor.loginToken'),JSON.stringify(info)).then(({data}) => {
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
              <th>Tên học viên</th>
              <th>Email</th>
              <th>Số lượng tương tác Forum</th>
            </tr>
          </thead>
          <tbody>
            {
              __.map(userInClass,(userClass,idx) => {
                return (
                  <tr key={idx}>
                    <td>{userClass.name}</td>
                    <td>{userClass.email}</td>
                    <td>{userClass.forum.length}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    )
  }
  onDropGiveAdd(files){
    console.log(files);
  }
  render(){
    let { dataSet, users } = this.props;
      if(dataSet.loading && !dataSet.getActivityForum){
        return (
          <div className="spinner spinner-lg"></div>
        )
      }
      else {
        console.log(this.state.topicSelected);
        return (
          <div style={{display: 'flex', flexDirection: 'row', padding: 20, justifyContent: 'space-between'}}>
            <div style={{width: '65%'}}>
              <Tabs className="secondary" >
                <TabList className="modal-header" style={{margin: 0, backgroundColor: 'white'}}>
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
                </TabList>
                <TabPanel style={{backgroundColor: '#f0f0f0'}}>
                  <div style={{display: 'flex', flexDirection: 'column', padding: 10, backgroundColor: 'white'}}>
                    <div style={{border: '1px solid #f0f0f0', minHeight: 150, borderRadius: 10, padding: 10}}>
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
                                      //  let stringValue = 'http://docs.google.com/gview?url=';
                                      //  stringValue += "https://lookaside.fbsbx.com/file/L%E1%BB%8ACH%20THI%20%C4%90%E1%BA%A4U%20H%E1%BB%98I%20THAO%20SINH%20VI%C3%8AN%20TR%C6%AF%E1%BB%9CNG%20%C4%90%E1%BA%A0I%20H%E1%BB%8CC%20NHA%20TRANGNH%202016%20-%202017.doc?token=AWxanGnSaNn7bywJj_53qmuEcDmxwumpy67Wk7EL97aqvxtp-1pFFQevjZOGJNR2pByLZQk6fMyt09aMocVf6dtzGfA8ZgC0mYBymbLYsd7b0PDJHBJQfaZCQDuVR4uE_FYUS0Ielq33pWr82_3XkR_2q3aCowu7oQq4VKoZm1dWcE6y1lq-t2Mj97ODqwj85E8"
                                       //
                                      //  stringValue += file.file;
                                      //  stringValue += '&embedded=true';
                                       return (
                                         <div key={fileIdx} style={{padding: 5, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                                           {/* <iframe src={stringValue}></iframe> */}
                                           <img src={fileImageFile} className="img-responsive" style={{height: 85}}></img>
                                           <div style={{display: "flex", flexDirection: 'column'}}>
                                             <h3>{file.fileName}</h3>
                                             <button type="button" className="btn" style={{width: 70, backgroundColor: '#35bcbf', color: 'white', marginTop: 10}}>Download</button>
                                           </div>
                                         </div>
                                       )
                                     }
                                   })
                                 }
                               </div>
                               <button type="button" className="btn" style={{width: 70, backgroundColor: '#35bcbf', color: 'white', marginTop: 10}} onClick={() => {
                                 let dataValueForum = this.state.dataSetForum;
                                 dataValueForum[idx].openComment = dataValueForum[idx].openComment ? !dataValueForum[idx].openComment : true;
                                 this.setState({dataSetForum: dataValueForum})
                               }}>Bình luận</button>
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
                            <p>{theme.theme.name}</p>
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
                                    //   let stringValue = 'http://docs.google.com/gview?url=';
                                    //  //  stringValue += "https://lookaside.fbsbx.com/file/L%E1%BB%8ACH%20THI%20%C4%90%E1%BA%A4U%20H%E1%BB%98I%20THAO%20SINH%20VI%C3%8AN%20TR%C6%AF%E1%BB%9CNG%20%C4%90%E1%BA%A0I%20H%E1%BB%8CC%20NHA%20TRANGNH%202016%20-%202017.doc?token=AWxanGnSaNn7bywJj_53qmuEcDmxwumpy67Wk7EL97aqvxtp-1pFFQevjZOGJNR2pByLZQk6fMyt09aMocVf6dtzGfA8ZgC0mYBymbLYsd7b0PDJHBJQfaZCQDuVR4uE_FYUS0Ielq33pWr82_3XkR_2q3aCowu7oQq4VKoZm1dWcE6y1lq-t2Mj97ODqwj85E8"
                                     //
                                    //   stringValue += file.file;
                                    //   stringValue += '&embedded=true';
                                    return (
                                      <div key={fileIdx} style={{padding: 5, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                                        {/* <iframe src={stringValue}></iframe> */}
                                        <img src={fileImageFile} className="img-responsive" style={{height: 85}}></img>
                                        <div style={{display: "flex", flexDirection: 'column'}}>
                                          <h3>{file.fileName}</h3>
                                          <button type="button" className="btn" style={{width: 70, backgroundColor: '#35bcbf', color: 'white', marginTop: 10}}>Download</button>
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
                        <span className="glyphicon glyphicon-plus"></span> {this.state.dataTheme.open ? 'Hủy chủ đề' : 'Thêm chủ đề'}
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
                <TabPanel style={{backgroundColor: '#f0f0f0'}}>
                  <div style={{display: 'flex', flexDirection: 'column', padding: 20, backgroundColor: 'white'}}>
                    {
                      __.map(this.state.dataSetAss,(ass,idx) => {
                        return (
                          <div key={idx} style={{border: '1px solid #f0f0f0', minHeight: 40, padding: 10, marginTop: idx == 0 ? 0 : 10, cursor: 'pointer'}}>
                            <p style={{width: '100%', cursor: 'pointer'}} onClick={() => {
                                let dataValueAss = this.state.dataSetAss;
                                dataValueAss[idx].openDetail = dataValueAss[idx].openDetail ? !dataValueAss[idx].openDetail : true;
                                this.setState({dataSetAss: dataValueAss})
                              }}>{ass.topic.title}</p>
                            {
                              ass.openDetail &&
                              <div>
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
                                      let stringValue = 'http://docs.google.com/gview?url=';
                                     //  stringValue += "https://lookaside.fbsbx.com/file/L%E1%BB%8ACH%20THI%20%C4%90%E1%BA%A4U%20H%E1%BB%98I%20THAO%20SINH%20VI%C3%8AN%20TR%C6%AF%E1%BB%9CNG%20%C4%90%E1%BA%A0I%20H%E1%BB%8CC%20NHA%20TRANGNH%202016%20-%202017.doc?token=AWxanGnSaNn7bywJj_53qmuEcDmxwumpy67Wk7EL97aqvxtp-1pFFQevjZOGJNR2pByLZQk6fMyt09aMocVf6dtzGfA8ZgC0mYBymbLYsd7b0PDJHBJQfaZCQDuVR4uE_FYUS0Ielq33pWr82_3XkR_2q3aCowu7oQq4VKoZm1dWcE6y1lq-t2Mj97ODqwj85E8"

                                      stringValue += file.file;
                                      stringValue += '&embedded=true';
                                      return (
                                        <div key={fileIdx} style={{padding: 5, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                                          {/* <iframe src={stringValue}></iframe> */}
                                          <img src={fileImageFile} className="img-responsive" style={{height: 85}}></img>
                                          <div style={{display: "flex", flexDirection: 'column'}}>
                                            <h3>{file.fileName}</h3>
                                            <button type="button" className="btn" style={{width: 70, backgroundColor: '#35bcbf', color: 'white', marginTop: 10}}>Download</button>
                                          </div>
                                        </div>
                                      )
                                    }
                                  })
                                }
                              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                                  <button type="button" className="btn btn-warning" onClick={() => this.setState({openGiveAdd: true,topicSelected: ass.topic})} >Nộp bài</button>
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
                         <input type="text" placeholder="Tên bài tập" style={{width: '100%', height: 40, padding:10, border: '1px solid #f0f0f0'}} onChange={({target}) => {
                           let dataAssign = this.state.dataAssign;
                           dataAssign.title = target.value;
                           this.setState({dataAssign: dataAssign});
                         }}/>
                         <div style={{border: '1px solid #f0f0f0', minHeighth: 100, padding: 10, marginTop: 15}}>
                           <textarea rows="2" placeholder="Thêm nội dung câu hỏi bài tập" style={{border: 'none', height: 100, width: '100%'}} onChange={({target}) => {
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

                <TabPanel style={{backgroundColor: '#f0f0f0'}}>
                  <div style={{display: 'flex', flexDirection: 'column',}}>
                    {
                      __.map(dataSet.getTeacherByClassSubject, (infoUser,idx) => {
                        return (
                          <div key={idx} style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: '100%', border: '2px solid white', padding: 10}}>
                            <div>
                              <img src={infoUser.image ? infoUser.image : 'https://i1249.photobucket.com/albums/hh508/nguyenxuanvinhict/userImage_zpsqz3krq9r.jpg'} height="100" width="100" className="img-responsive"/>
                            </div>
                            <div style={{paddingLeft: 10}}>
                              <h3>{infoUser.name}</h3>
                              <h4>{infoUser.email}</h4>
                              <h5>Teacher</h5>
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
                              <img src={infoUser.image ? infoUser.image : 'https://i1249.photobucket.com/albums/hh508/nguyenxuanvinhict/userImage_zpsqz3krq9r.jpg'} height="100" width="100" className="img-responsive"/>
                            </div>
                            <div style={{paddingLeft: 10}}>
                              <h3>{infoUser.name}</h3>
                              <h4>{infoUser.email}</h4>
                              <h5>Student</h5>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </TabPanel>
                <TabPanel style={{backgroundColor: '#f0f0f0'}}>
                  {
                    this.renderActivityUser()
                  }
                </TabPanel>
              </Tabs>
            </div>
            <div style={{width: '35%', paddingLeft: 15}}>
              <div style={{backgroundColor: 'white', padding: 5}}>
                <h4 style={{textAlign: 'center'}}>{dataSet.getInfoClassSubject.name}</h4>
                <p>GV: {dataSet.getInfoClassSubject.teacher.name}</p>
                <p>Email: {dataSet.getInfoClassSubject.teacher.email}</p>
                <p>Code: {dataSet.getInfoClassSubject.code ? dataSet.getInfoClassSubject.code : 'XXXXX'}</p>
              </div>
              <div style={{marginTop: 10, backgroundColor: 'white', padding: 5}}>
                <h3>THÊM HỌC VIÊN</h3>
                <EditMulti value={this.state.userSubjects} userIds={this.state.userFriendsUserClass} label={"name"} placeholder='...'
                   onChangeValue={(value) => this.setState({userSubjects: value})}/>
                 <div style={{marginTop: 15}}>
                   <InviteUser userMails={this.state.userMails} onChangeValue={(value) => this.setState({userMails: value})}/>
                 </div>
                 <button className="btn" style={{width: 70, backgroundColor: '#35bcbf', color: 'white', marginTop: 10}}>Add</button>
              </div>
            </div>
            <Dialog
              modal={true}
              open={this.state.openGiveAdd}
              autoDetectWindowHeight={false}
              autoScrollBodyContent={false}
              contentStyle={{minHeight:'60%'}}
            >
              <div className="modal-dialog" style={{width: 'auto', margin: 0}}>
                  <div className="modal-content">
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f5f5f5', borderBottom: 'none', padding: '10px 18px'}}>
                      <h4 className="modal-title">Nộp bài tập: {this.state.topicSelected ? this.state.topicSelected.title : ''} - {this.state.topicSelected.owner ? this.state.topicSelected.owner.name : ''} </h4>
                      <span className="close" onClick={() => this.setState({openGiveAdd: false})}>&times;</span>
                    </div>
                    <div className="modal-body" style={{maxHeight:window.innerHeight - 300, overflowY: 'auto', overflowX: 'hidden'}}>
                      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                        <Dropzone onDrop={this.onDropGiveAdd.bind(this)} style={{height: 140, border: '1px solid gray', borderRadius: 10, padding: '13px 7px', width: 350}}>
                          <div style={{textAlign: 'center'}}>Click or Drap here to upload file</div>
                        </Dropzone>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-default" onClick={() => this.setState=({openGiveAdd: false})}>Đóng</button>
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
