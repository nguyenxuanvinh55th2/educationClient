import React from 'react';

import { Link, Router, browserHistory } from 'react-router'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';

class ManagerSubject extends React.Component {
  constructor(props) {
    super(props)
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
      }
    }
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
      console.log(data);
    })
  }
  handleAddTheme(){
    let info = {
      data: {
        isTheme: true,
        title: this.state.dataTheme.title,
        content: this.state.dataTheme.content,
      },
      classSubjectId: this.state.subjectId
    }
    this.props.insertTopic(localStorage.getItem('Meteor.loginToken'),JSON.stringify(info)).then(({data}) => {
      console.log(data);
    })
  }
  handleAddAss(){
    let info = {
      data: {
        isAssignment: true,
        title: this.state.dataAssign.title,
        content: this.state.dataAssign.content,
      },
      classSubjectId: this.state.subjectId,
    }
    this.props.insertTopic(localStorage.getItem('Meteor.loginToken'),JSON.stringify(info)).then(({data}) => {
      console.log(data);
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
  render(){
    // console.log(this.props.dataSet);
    return (
      <div style={{display: 'flex', flexDirection: 'column', padding: 20}}>
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
              <Tab>
                  <h4 className="modal-title" style={{color: '#35bcbf'}}>Khảo sát</h4>
              </Tab>
              <Tab>
                  <h4 className="modal-title" style={{color: '#35bcbf'}}>Thành viên</h4>
              </Tab>
              <Tab>
                  <h4 className="modal-title" style={{color: '#35bcbf'}}>Hoạt động</h4>
              </Tab>
          </TabList>
          <TabPanel style={{backgroundColor: '#f0f0f0'}}>
            <div style={{display: 'flex', flexDirection: 'column', padding: 10, backgroundColor: 'white'}}>
              <div style={{border: '1px solid #f0f0f0', height: 150, borderRadius: 10, padding: 10}}>
                <textarea rows="5" placeholder="Bạn có điều gì muốn hỏi" style={{border: 'none', height: 100, width: '100%'}} value={this.state.dataForum.content} onChange={({target}) => {
                  let dataForum = this.state.dataForum;
                  dataForum.content = target.value;
                  this.setState({dataForum: dataForum})
                }}/>
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
              <div style={{backgroundColor: 'white'}}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </div>
            </div>
          </TabPanel>
          <TabPanel style={{backgroundColor: '#f0f0f0'}}>
            <div style={{display: 'flex', flexDirection: 'column', padding: 20, backgroundColor: 'white'}}>
              <div style={{border: '1px solid #f0f0f0', height: 40, padding: 10}}>
                <p>Chu de 1</p>
              </div>
              <div style={{border: '1px solid #f0f0f0', height: 40, padding: 10, marginTop: 10}}>
                <p>Chu de 2</p>
              </div>
              <button type="button" className="btn" style={{backgroundColor: 'white', border: '1px dotted #35bcbf', color: '#35bcbf', marginTop: 5, height: 40}}
                 onClick={() => {
                   let dataTheme = this.state.dataTheme;
                   dataTheme.open = !this.state.dataTheme.open;
                   this.setState({dataTheme: dataTheme});
                 }}>
                <span className="glyphicon glyphicon-plus"></span> {this.state.dataTheme.open ? 'Hủy chủ đề' : 'Thêm chủ đề'}
              </button>
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
                  <div style={{border: '1px solid #f0f0f0', height: 100, padding: 10, marginTop: 15}}>
                    <textarea rows="2" placeholder="Thêm nội dung chủ đề" style={{border: 'none', height: 55, width: '100%'}} onChange={({target}) => {
                      let dataTheme = this.state.dataTheme;
                      dataTheme.content = target.value;
                      this.setState({dataTheme: dataTheme});
                    }}/>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                      <button type="button" className="btn btn-link" style={{color: '#35bcbf'}}>Mở rộng</button>
                    </div>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10}}>
                    <button type="button" className="btn" style={{backgroundColor: '#35bcbf', color: 'white', width: 100}} disabled={!this.state.dataTheme.title || !this.state.dataTheme.content} onClick={() => this.handleAddTheme()}>Thêm chủ đề</button>
                  </div>
                </div>
              </div>
            }
          </TabPanel>
          <TabPanel style={{backgroundColor: '#f0f0f0'}}>
            <div style={{display: 'flex', flexDirection: 'column', padding: 20, backgroundColor: 'white'}}>
              <div style={{border: '1px solid #f0f0f0', height: 40, padding: 10}}>
                <p>Bài tập chủ đề 1</p>
              </div>
              <div style={{border: '1px solid #f0f0f0', height: 40, padding: 10, marginTop: 10}}>
                <p>Bài tập chủ đề 1</p>
              </div>
              <button type="button" className="btn" style={{backgroundColor: 'white', border: '1px dotted #35bcbf', color: '#35bcbf', marginTop: 5, height: 40}}
                 onClick={() => this.handleAddTheme()}>
                <span className="glyphicon glyphicon-plus"></span> Tải file bài tập
              </button>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', marginTop: 10}}>
              <div style={{backgroundColor: 'white', padding: 20}}>
                <button type="button" className="btn btn-link" style={{color: '#35bcbf'}}>Tạo mới bài tập tự luận</button>
                <input type="text" placeholder="Tên bài tập" style={{width: '100%', height: 40, padding:10, border: '1px solid #f0f0f0'}} onChange={({target}) => {
                  let dataAssign = this.state.dataAssign;
                  dataAssign.title = target.value;
                  this.setState({dataAssign: dataAssign});
                }}/>
                <div style={{border: '1px solid #f0f0f0', height: 100, padding: 10, marginTop: 15}}>
                  <textarea rows="2" placeholder="Thêm nội dung câu hỏi bài tập" style={{border: 'none', height: 55, width: '100%'}} onChange={({target}) => {
                    let dataAssign = this.state.dataAssign;
                    dataAssign.content = target.value;
                    this.setState({dataAssign: dataAssign});
                  }}/>
                  <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <button type="button" className="btn btn-link" style={{color: '#35bcbf'}}>Mở rộng</button>
                  </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10}}>
                  <button type="button" className="btn" style={{backgroundColor: '#35bcbf', color: 'white', width: 100}} disabled={!this.state.dataAssign.title || !this.state.dataAssign.content} onClick={() => this.handleAddAss()}>Thêm bài tập</button>
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            3
          </TabPanel>
          <TabPanel>
            3
          </TabPanel>
          <TabPanel>
            4
          </TabPanel>
        </Tabs>
      </div>
    )
  }
}
const INSERT_FORUM = gql`
 mutation insertTopic($token:String!,$info:String){
   insertTopic(token:$token,info:$info)
 }
`;
const MyQuery = gql`
    query getData($subjectId: String!){
      getForumBySubject(subjectId: $subjectId) {
         _id
         memberReply {
          _id
          owner {
            _id name  image email
          }
          files {
            _id filename  filetype  link
          }
          content
        }
       }
    }`
export default compose(
  graphql(MyQuery, {
      options: (ownProps) => ({
        variables: {subjectId: ownProps.params.subjectId},
        forceFetch: true
      }),
      name: 'dataSet',
  }),
  graphql(INSERT_FORUM,{
       props:({mutate})=>({
       insertTopic : (token,info) =>mutate({variables:{token,info}})
     })
   })
)(ManagerSubject)
