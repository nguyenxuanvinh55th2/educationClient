import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import __ from 'lodash';
import moment from 'moment';
//import { Meteor } from 'metor/meteor';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import { search } from '../action/actionCreator.js';

//import {Meteor} from 'meteor/meteor'
import { Link, Router, browserHistory } from 'react-router';
import { Grid, Col, Row, Button, FormGroup, FormControl, Dropdown, MenuItem, InputGroup, Glyphicon, Modal, ControlLabel, Tab, Tabs } from 'react-bootstrap';

var Cryptr = require('cryptr'),
cryptr = new Cryptr('ntuquiz123');

import { asteroid } from '../asteroid';

import SearchResult from './searchResult.jsx';
import Combobox from './Combobox.jsx';

// //Meteor.subscribe("user");


class SubjectItem extends Component {
  render () {
    let classInfo = JSON.stringify({
      classId: this.props.classId,
      userId: this.props.userId,
      courseId: this.props.courseId,
      role: this.props.role
    })
    let encryptedString = cryptr.encrypt(classInfo);
    return (
      <div>
        <Button href={"/profile/"+'gtez6BH4qdjmsFsQ3'+"/dashboard/"+encryptedString}>
          { this.props.subjectName }
        </Button>
      </div>
    )
  }
}
SubjectItem.PropTypes = {
  classId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  subjectName: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
}


  //hiển thị các elemnt trong danh sách lớp học
//--------------------------------------------------------------------------------//
class ClassItem extends Component {
  renderSubject() {
    return this.props.courses.map(item => (
      <SubjectItem key={item._id} classId={this.props.classId} courseId={item._id} subjectName={item.subjectName} userId={this.props.userId} role={this.props.role}/>
    ))
  }
  render() {
    console.log("message class List", this.props);
    return (
        <li>
          <Row>
            <Col md={8}>
              <Button bsStyle="success" style={{width: "100%"}}> { this.props.className } </Button>
            </Col>
            <Col md={4}>
              <Button style={{background: 'transparent'}}>
                <Glyphicon glyph="glyphicon glyphicon-triangle-bottom" />
              </Button>
              { this.renderSubject() }
            </Col>
          </Row>
        </li>
    )
  }
}
ClassItem.PropTypes = {
  className: PropTypes.string.isRequired,
  classId: PropTypes.string.isRequired,
  courses: PropTypes.array.isRequired,
  userId: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
}

class SearchItem extends Component {
  render() {
    return (
      <div>
        <div id={'searchItem' + this.props.id} style={{display: 'none', float: 'left'}}>
          <div className="chip" style={{height: '30px', fontSize: '12px', marginBottom: '5px', marginTop: '0px', lineHeight: '32px'}}>
            {this.props.name}
            <span className="closebtn" onClick={e=>{
                alert(this.props.id);
                document.getElementById('searchItem' + this.props.id).style.display = 'none';
                this.props.popUser(this.props.id);
              }}>&times;</span>
          </div>
        </div>
        <div className="searchItem" onClick={e=>{
            item = document.getElementById('searchItem' + this.props.id);
            item.style.display = 'inline';
            document.getElementById('searchResult').appendChild(item);
            document.getElementById('searchTool').style.display = 'none';
            this.props.pushUser(this.props.id);
          }}>
          <Row style={{marginBottom: '10px', marginLeft: '10px'}}>
            <Col md= {1}>
              <img style={{height: '30px', width: '30px'}} src={this.props.image}/>
            </Col>
            <Col md={5}>
              <p><b>{this.props.name}</b></p>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
SearchItem.PropTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  pushUser: PropTypes.func.isRequired,
  popUser: PropTypes.func.isRequired
}

class SearchTool extends Component {
  renderResult() {
    return this.props.searchList.map((item) => (
      <SearchItem key={item._id} id={item._id} image={item.image} name={item.name} pushUser={this.props.pushUser} popUser={this.props.popUser}/>
    ))
  }
  render(){
    return (
      <div id="searchTool">
        {this.renderResult()}
      </div>
    )
  }
}
SearchTool.PropTypes = {
  searchList: PropTypes.array.isRequired,
  pushUser: PropTypes.func.isRequired,
  popUser: PropTypes.func.isRequired
}

  //hiển thị các elemnt trong danh sách môn học
//--------------------------------------------------------------------------------//
class SubjectOption extends Component {
  render() {
    return (
      <option value={ this.props.subject.name }>{ this.props.subject.name }</option>
    )
  }
}
SubjectOption.PropTypes = {
  subject: PropTypes.object.isRequired
}

  //hiển thị các ducument tương ứng với môn học đã chọn
//--------------------------------------------------------------------------------//
class SubjectDocument extends Component {
  render() {
    return (
      <Row>
        <Col md={3}>
          <div>
            {this.props.document.owner}
          </div>
        </Col>
        <Col md={3}>
          <div>
            {this.props.document.createAt}
          </div>
        </Col>
      </Row>
    )
  }
}
SubjectDocument.PropTypes = {
  document: PropTypes.object.isRequired
}

  //hiển thị các friend tương ứng với user
//--------------------------------------------------------------------------------//
class FriendItem extends Component {

  render() {
    return (
      <Col md={3}>
        <Row>
          <div id={'classList-friend' + this.props.friend._id} className="chip" onClick={e => {
              var component = document.getElementById('classList-friend' + this.props.friend._id);
              if(component.style.backgroundColor !== 'green'){
                component.style.backgroundColor = 'green';
                component.style.color = 'white';
                this.props.pushFriend(this.props.friend._id);
              } else {
                component.style.backgroundColor = '#f1f1f1';
                component.style.color = 'black';
                this.props.popFriend(this.props.friend._id);
              }
            }}>
            <Row>
              <Col md={4}>
                <img src={this.props.friend.image} alt="Person" width="96" height="96"/>
              </Col>
              <Col md={8}>
                <marquee direction="left">{this.props.friend.name}</marquee>
              </Col>
            </Row>
          </div>
        </Row>
      </Col>
    )
  }
}
FriendItem.PropTypes = {
  friend: PropTypes.object.isRequired,
  pushFriend: PropTypes.func.isRequired,
  popFriend: PropTypes.func.isRequired
}

  //Danh sách các lớp học
//--------------------------------------------------------------------------------//
class ClassList extends Component {
  constructor(props) {
    super(props);
    this.classMembers = [];
    this.state = { showModal: false, className: '', semeter: '', subjectId: '', tabKey: 1, keyWord: '', subjectId: null, subjectName: null, classMembers: this.classMembers, dateStart: '', dateEnd: '', courseId: null, courseName: null };
	  this.className = {};
    this.keyWord = {};
    this.classCode = {};
  }

  //Sử dụng để đóng modal addClass
  close() {
    this.setState({ showModal: false });
  }

  //sử dụng để mở modal addClass
  open() {
    this.setState({ showModal: true });
    this.setState({ tabKey: 1});
  }

  spliceDuplicate(array) {
    for(let i = 1; i < array.length; i++){
      if(array[i]._id === array[i - 1]._id)
        array.splice(i, 1)
    }
  }

  //sử dụng để thêm mem
  pushMemberToClass(member) {
    if(this.classMembers.indexOf(member) === -1)
      this.classMembers.push(member);
    this.setState({classMembers: this.classMembers});
  }

  popMemberFromClass(member) {
    if(this.classMembers.indexOf(member) !== -1)
      for(i = 0; i < this.classMembers.length; i++)
        if(this.classMembers[i] === member)
          this.classMembers.splice(i, 1)
    this.setState({classMembers: this.classMembers});
  }

  //sử dụng để xử lý ngoại lệ cho input className
  getNameValidation() {
    if(!this.state.className || this.state.className.length < 6)
      return 'error';
    else
      return 'success';
  }

  getDataCombobox(type, value, label) {
    let { data } = this.props;
    console.log("data courseThemes ", data.courseThemes);
    switch (type) {
      case 'course':
        this.setState({courseId: value ? value : null});
        this.setState({courseName: !value ? (label ? label : null) : null});
        if(value) {
          let course = __.find(data.courseThemes, {_id: value});
          this.setState({dateStart: moment(course.dateStart).format('YYYY-MM-DD'), dateEnd: moment(course.dateEnd).format('YYYYY-MM-DD')});
        }
        break;
      case 'subject':
        this.setState({subjectId: value ? value : null});
        this.setState({subjectName: !value ? (label ? label : null) : null});
        break;
      default:
    }
  }

  //sử dụng để xử lý ngoại lệ cho input semeter
  getSemeterValidation() {
    if(!this.state.semeter || this.state.semeter.length < 6)
      return 'error';
    else
      return 'success';
  }

  //hàm xử lý ngoại lệ onChange cho các trường input
  handleChange(e) {
    if(e.target.id === 'className')
      this.setState({ className: e.target.value });
    else
      if(e.target.id === 'semeter')
        this.setState({ semeter: e.target.value });
      // else
      //   if(e.target.id === 'addSubject')
      //     this.setState({ subject: e.target.value });
  }

  //trả về danh sách bạn bè của user
  renderFriendList() {
    if(!this.props.friendList || this.props.friendList.loading)
      return (
        <div className="loader"></div>
      )
    else
      return this.props.friendList.friendList.map((item) => (
          <FriendItem key={item._id} friend={{_id: item._id, image: item.user.image, name: item.user.name}} pushFriend={this.pushMemberToClass.bind(this)} popFriend={this.popMemberFromClass.bind(this)}/>
        )
      )
  }

  //trả về danh sách môn học cho propdown button lự chọn tên môn học
  renderSubjectData(){
    if(!this.props.data || this.props.data.loading)
      return null;
    else {
      let result = [];
      let subjects = __.cloneDeep(this.props.data.subjects);

      //sắp xếp phần tử trong querySubject theo tên
      subjects.sort((a, b) => {
        if(a.name < b.name)
          return -1;
        if(a.name > b.name)
          return 1;
        return 0;
      });

      //lọc các phần tử không trùng lặp và thêm vào mảng subject
      for(let i = 0; i < subjects.length; i++){
        if( i === 0 || subjects[i].name !== this.props.data.subjects[i - 1].name ) {
          result.push(this.props.data.subjects[i]);
        }
      }
      return result;
    }
  }

  renderCourseThemeData() {
    if(!this.props.data || this.props.data.loading)
      return null;
    else {
      console.log("courseThemes ", this.props.data.courseThemes);
      return this.props.data.courseThemes;
    }
  }

  //trả về danh sách dữ liệu tương ứng với tên môn học được lựa chọn
  renderSubjectDocument() {
    if(!this.props.data || this.props.data.loading)
      return (
        <div className="loader"></div>
      )
    else {
      var documents = [];

      for(let i = 0; i < this.props.data.subjects.length; i++)
        if(this.props.data.subjects[i].name === this.state.subjectName)
          documents.push(this.props.data.subjects[i]);
      if(documents.length === 0)
        return (
          <div>Môn học này hiện chưa có tài liệu nào bạn có thể thêm tài liệu sau trong quá trình giảng dạy</div>
        )
      return documents.map((item) => (
        <SubjectDocument key={item._id} document={item}/>
      ))
    }
  }

  //trả về dữ liệu trong classList tương ứng những lớp học mà user là teacher
  renderTeacherRole() {
    if(!this.props.data || this.props.data.loading)
      return (
        <div className="loader"></div>
      )
    else {
      var teacherRole = this.props.data.userClass.teacherOf;
      let teacherOf = this.spliceDuplicate(teacherRole);
      return teacherRole.map((item, idx) => (
        <ClassItem key={idx} className={item.name} classId={item._id} courses={item.courses} role={item.role} userId={item.currentUserId}/>
      ));
    }
  }

  // //trả về dữ liệu trong classList tương ứng những lớp học mà user là student
  renderStudentRole() {
    if(!this.props.data || this.props.data.loading)
      return (
        <div className="loader"></div>
      )
    else {
      var studentRole = this.props.data.userClass.studentOf;
      let studentOf = this.spliceDuplicate(studentRole);
      return studentRole.map((item, idx) => (
        <ClassItem key={idx} className={item.className} classId={item._id} courses={item.course} role={item.role} userId={item.currentUserId}/>
      ));
    }
  }

  renderSearchTool(){
    if(!this.props.data || this.props.data.loading)
      return (
        <div className="loader"></div>
      )
    else {
      var searchList = [];
      for(let i = 0; i < this.props.data.users.length; i++) {
        if(this.state.keyWord !== '' && !(/^\s*$/.test(this.state.keyWord)))
          if(this.props.data.users[i].email === this.state.keyWord)
            searchList.push(this.props.data.users[i])
      }
      return (
        <SearchTool searchList={searchList} pushUser={this.pushMemberToClass.bind(this)} popUser={this.popMemberFromClass.bind(this)}/>
      )
    }
  }

  //hàm render chính
  render() {
    console.log("this.props.data ", this.props.data);
    if(!this.props.data || this.props.data.loading) {
      return (
        <div className="loader"></div>
      )
    } else {
        return (
          <div className="classList">
            <Modal show={this.state.showModal} onHide={this.close.bind(this)} enforceFocus={true}>
              <Modal.Header closeButton>
                <Modal.Title>Thêm lớp học</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Tabs activeKey={this.state.tabKey} onSelect={e=>{}} id="addClassTab">

                  {/*Tab 1 */}
                  <Tab eventKey={1} title="Tab 1" style={{height: '75vh'}}>
                    <form>
                      <p style={{marginLeft: '10%', marginTop: '10px'}}><b>Nhập thông tin lớp học</b></p>

                      <FormGroup validationState={this.getNameValidation()} style={{
                          width: '80%',
                          marginLeft: '10%'
                        }}>
                        <FormControl id='className' type="text" placeholder="Tên lớp" ref={node => this.className = node }  onChange={this.handleChange.bind(this)}/>
                        <FormControl.Feedback />
                      </FormGroup>

                      <FormGroup controlId="formControlsSelect" style={{
                          width: '80%',
                          marginLeft: '10%'
                        }}>
                        <ControlLabel>Chọn hoặc thêm khóa học</ControlLabel>
                        <Combobox name="course" data={this.renderCourseThemeData()} label="name" datalistName="courseThemes"
                            placeholder="Chọn hoặc thêm khóa học" getValue={this.getDataCombobox.bind(this, 'course')} />
                        <br/>
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        Từ ngày
                        <FormControl value={this.state.dateStart} type="date" style={{width: 150}}/>
                        Đến ngày
                        <FormControl value={this.state.dateEnd} type="date" style={{width: 150}}/>
                        </div>
                      </FormGroup>

                      <FormGroup controlId="formControlsSelect" style={{
                          width: '80%',
                          marginLeft: '10%'
                        }}>
                        <ControlLabel>Chọn hoặc thêm môn học</ControlLabel>
                        <Combobox name="subject" data={this.renderSubjectData()} label="name" datalistName="subjects"
                            placeholder="Chọn hoặc thêm moon học" getValue={this.getDataCombobox.bind(this, 'subject')} />
                      </FormGroup>
                    </form>
                    <Row>
                      <Col mdOffset={9}>
                        <Button bsStyle="primary" onClick={e=>{
                            if(this.getNameValidation() === 'success') {
                              var key = this.state.tabKey;
                              if(key < 3) {
                                key ++;
                                this.setState({tabKey: key});
                              }
                            }
                          }}>Tiếp tục</Button>
                      </Col>
                    </Row>
                  </Tab>

                  {/*Tab 2*/}
                  <Tab eventKey={2} title="Tab 2" style={{height: '75vh'}}>
                    <p style={{marginTop: '10px'}}><b>Chọn các tài liệu được chia sẽ</b></p>
                    <div className="documentSet">
                      {/* this.renderSubjectDocument() */}
                    </div>
                    <Row>
                      <Col mdOffset={9}>
                        <Button bsStyle="primary" onClick={e=>{
                            var key = this.state.tabKey;
                            if(key < 3){
                              key ++;
                              this.setState({tabKey: key});
                            }
                          }}>Tiếp tục</Button>
                      </Col>
                    </Row>
                  </Tab>

                  {/*Tab 3*/}
                  <Tab eventKey={3} title="Tab 3" style={{height: '75vh'}}>
                    <p style={{marginTop: '10px'}}><b>Tìm kiếm thành viên từ địa chỉ mail</b></p>
                    <FormGroup style={{width: '80%'}}>
                        <SearchResult searchResult={this.state.classMembers} pushUser={this.pushMemberToClass.bind(this)} popUser={this.popMemberFromClass.bind(this)}/>
                        <form onSubmit={e=>{
                            e.preventDefault();
                            let keyWord = ReactDOM.findDOMNode(this.keyWord).value;
                            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
                            if(re.test(keyWord)) {
                              this.pushMemberToClass(keyWord);
                            }else
                              alert('Địa chỉ email không đúng');
                          }}>
                          <FormControl ref={node => this.keyWord = node} type="text" onChange={e=>{
                              e.preventDefault();
                              let keyWord = ReactDOM.findDOMNode(this.keyWord).value;
                              this.setState({keyWord: keyWord});
                              document.getElementById('searchTool').style.display ='inline';
                           }}/>
                           <input type="submit" style={{display: 'none'}}/>
                        </form>
                        <FormControl.Feedback />
                        { this.renderSearchTool() }
                    </FormGroup>
                    <p style={{marginTop: '10px'}}><b>Chọn thành viên từ friendList của bạn</b></p>
                    <div className="documentSet">
                      {this.renderFriendList()}
                    </div>
                    <Row>
                      <Col mdOffset={9}>
                        <Button bsStyle="primary" onClick={e=>{
                            e.preventDefault();
                            if(this.getNameValidation() === 'success' && this.getSemeterValidation() === 'success') {
                                let name = ReactDOM.findDOMNode(this.className).value;
                                let userId = 'gtez6BH4qdjmsFsQ3';
                                let code = (Math.floor(Math.random()*90000) + 10000).toString();
                                let dateStart = moment(new Date(this.state.dateStart)).valueOf();
                                let dateEnd = moment(new Date(this.state.dateEnd)).valueOf();

                                let classItem = JSON.stringify({
                                  name,
                                  code,
                                  students: this.state.classMembers
                                });

                                let subject = JSON.stringify({
                                  _id: this.state.subjectId,
                                  name: this.state.subjectName,
                                });

                                let courseTheme = JSON.stringify({
                                  _id: this.state.courseId,
                                  name: this.state.courseName,
                                  dateStart,
                                  dateEnd
                                });

                                for(let i = 0; i < this.state.classMembers.length; i ++) {
                                    var note = {
                                      userId: this.state.classMembers[i],
                                      type: 'add-class-note',
                                      sendId: ownerId,
                                      sendname: ownerName,
                                      sendimage: ownerPicture,
                                      note: 'Đã thêm bạn vào lớp ' + className + 'với mã ' + classCode,
                                      read: false,
                                      classCode: classCode,
                                      date: new Date()
                                    }
                                }
                                console.log('ClassItem ', classItem);
                                console.log('subject ', subject);
                                console.log('courseTheme ', courseTheme);

                                this.props.addClass(userId, classItem, subject, courseTheme).then(() => {
                                    this.props.data.refetch();
                                }).catch((error) => {
                                    console.log('there was an error sending the query', error);
                                });
                                ReactDOM.findDOMNode(this.className).value = '';
                              }
                            this.setState({ showModal: false });
                          }}>Hoàn tất</Button>
                      </Col>
                    </Row>
                  </Tab>
                </Tabs>
              </Modal.Body>
              <Modal.Footer>
                {/*<Button onClick=this.close.bind(this)}>Close</Button>*/}
              </Modal.Footer>
            </Modal>
            <Row>
              <Button bsStyle="primary" onClick={e => {
                  var item = document.getElementById('teacher-class-list');
                  if(item.style.display === 'none')
                    item.style.display = 'inline';
                  else
                    item.style.display = 'none';
                }}>Vai trò giáo viên</Button>
              <ul id="teacher-class-list">
                { this.renderTeacherRole() }
              </ul>
            </Row>
            <Row>
              <Button bsStyle="primary" onClick={e=>{
                  var item = document.getElementById('student-class-list');
                  if(item.style.display === 'none')
                    item.style.display = 'inline';
                  else
                    item.style.display = 'none';
              }}>Vai trò sinh viên</Button>
            <ul id="student-class-list">
                { this.renderStudentRole() }
              </ul>
            </Row>
            <Row>
              <Button bsStyle="primary" onClick={this.open.bind(this)}>
                Thêm lớp học
              </Button>
            </Row>
            <Row>
              <InputGroup style={{width: '80%'}}>
                <FormControl type="text" ref={node => this.classCode = node}/>
                <InputGroup.Addon><Glyphicon glyph="search" /></InputGroup.Addon>
              </InputGroup>
              <Button bsStyle="primary" onClick={e => {
                  var code = ReactDOM.findDOMNode(this.classCode).value;
                  Meteor.call("userJoinClass", code, function(err, result){
                    if(result)
                      alert('yêu cầu của bạn đã được gửi đi');
                    else
                      alert('mã lớp không tồn tại');
                  })
                  ReactDOM.findDOMNode(this.classCode).value = '';
                }}>
                Tham gia lớp
              </Button>
            </Row>
          </div>
        )
    }
  }
}

const CLASS_LIST = gql`
  query UserClass($userId: String){
    userClass(userId: $userId) {
  		teacherOf {
        _id
        code
        name
        createAt
        createrId
        courses {
          _id
        	subjectName
        	dateStart
        	dateEnd
        	isOpen
        	publicActivity
        }
      }
  		studentOf {
        _id
        code
        name
        createAt
        createrId
      }
    },
    subjects {
      _id
    	name
    	owner {
        _id
        image
        name
        email
      }
    	createAt
    	courses {
        activity {
          _id
          topicId
          topic {
            _id
            type
            ownerId
            owner {
              name
              image
            }
            title
            content
            createAt
            dateStart
            dateEnd
            index
            files {
              index
              ownerId
              filename
              filetype
              link
            }
          }
        }
      }
    },
    users {
      _id
      image
      name
      email
    },
    courseThemes {
      _id
      name
      dateStart
      dateEnd
    }
  }`

  const ADD_CLASS = gql`
      mutation addClass($userId: String!, $classItem: String!, $subject: String!, $courseTheme: String!){
          addClass(userId: $userId, classItem: $classItem, subject: $subject, courseTheme: $courseTheme)
  }`

  export default compose (
      graphql(CLASS_LIST,
      {
        options: () => ({ variables: { userId: JSON.parse(localStorage.getItem("userInfo")) ? JSON.parse(localStorage.getItem("userInfo"))._id : '' } }),
        forceFetch: true
      }),
      graphql(ADD_CLASS, {
          props: ({mutate})=> ({
              addClass : (userId, classItem, subject, courseTheme) => mutate({variables:{userId, classItem, subject, courseTheme}})
          })
      }),
  )(ClassList);


// const ClassListContain = connect(
//   (state) => ({ }),
//   (dispatch) => ({
//     search: (keyWord) => {
//       dispatch(search(keyWord))
//     }
//   }),
// )(ClassList);
