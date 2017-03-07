import React, { PropTypes, Component, ReactDom } from 'react';

import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

//import {Meteor} from 'meteor/meteor'
import { Link, Router, browserHistory } from 'react-router';

var Cryptr = require('cryptr'),
cryptr = new Cryptr('ntuquiz123');

import { asteroid } from '../asteroid';

//import SearchResult from '../mailSearchResult/searchResult.js';

// //Meteor.subscribe("user");


class SubjectItem extends Component {
  render () {
    let classInfo = JSON.stringify({
      classId: this.props.classId,
      userId: this.props.userId,
      courseId: this.props.courseId,
      role: this.props.role
    })
    let encryptedString = '';//= cryptr.encrypt(classInfo);
    return (
      <div>
        <button href={"/profile/"+this.props.userId+"/dashboard/"+encryptedString}>
          { this.props.subjectName }
        </button>
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
          <div>
            <div className="col-sm-8">
              <Button bsStyle="success" style={{width: "100%"}}> { this.props.className } </Button>
            </div>
            <div className="col-sm-4">
              <IconButton style={{color: info.labelColor, width: buttonWidth, backgroundColor: info.backgroundColor}} iconStyle={{fontSize: iconSize, color: info.labelColor, marginTop: info.top, marginBottom: info.bottom, marginRight: info.right, marginLeft: info.left}} tooltip={info.tooltip?info.tooltip:"Tooltip"} onClick={this.buttonCommand.bind(this)}>
                <FontIcon style={{color, marginLeft: 3}} className="material-icons fa-2x">home</FontIcon>
              </IconButton>
              { this.renderSubject() }
            </div>
          </div>
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
export default class ClassList extends Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false };
	  this.className = {};
    this.keyWord = {};
    this.classCode = {};
    this.state = {className: '', semeter: '', subjectId: ''};
    this.state = {tabKey: 1};
    this.state = {keyWord: ''};

    //state chứa id của môn học cần lấy tài liệu
    this.state = {subjectName: ''};
    this.classMembers = []
    this.state = {classMembers: this.classMembers};
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
  renderSubjectSelect(){
    if(!this.props.data || this.props.data.loading)
      return (
        <div className="loader"></div>
      )
    else {
      var subjects = [];
      console.log("message classList", this.props.data);


      //sắp xếp phần tử trong querySubject theo tên
      this.props.data.subjects.sort((a, b) => {
        if(a.name < b.name)
          return -1;
        if(a.name > b.name)
          return 1;
        return 0;
      });

      //lọc các phần tử không trùng lặp và thêm vào mảng subject
      for(let i = 0; i < this.props.data.subjects.length; i++){
        if( i === 0 || this.props.data.subjects[i].name !== this.props.data.subjects[i - 1].name ) {
          subjects.push(this.props.data.subjects[i]);
        }
      }

      return subjects.map((item) => (
        <SubjectOption key={item._id} subject={item}/>
      ))
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
        <ClassItem key={idx} className={item.className} classId={item._id} courses={item.course} role={item.role} userId={item.currentUserId}/>
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
    console.log(this.props.data);
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
                    <ControlLabel>Chọn môn học</ControlLabel>
                    <FormControl componentClass="select" placeholder="select" ref={ node => this.currentSubject = node} onChange={e=>{
                        this.setState({subjectName: e.target.value})
                      }}>
                      { this.renderSubjectSelect() }
                    </FormControl>
                  </FormGroup>

                  <p style={{marginLeft: '10%'}}><b>Hoặc thêm môn học mới</b></p>
                  <FormGroup style={{
                      width: '80%',
                      marginLeft: '10%'
                    }}>
                    <FormControl id="addSubject" type="text" placeholder="Tên môn học" ref={ node => this.newSubject = node }/>
                    <FormControl.Feedback />
                  </FormGroup>
                </form>
                <Row>
                  <Col mdOffset={9}>
                    <Button bsStyle="primary" onClick={e=>{
                        if(this.getNameValidation() === 'success') {
                          let currentSubject = ReactDOM.findDOMNode(this.currentSubject).value;
                          let newSubject = ReactDOM.findDOMNode(this.newSubject).value;
                          this.setState({subjectName: newSubject ? newSubject : currentSubject})
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
                  { this.renderSubjectDocument() }
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
                            let className = ReactDOM.findDOMNode(this.className).value;
                            let currentSubject = ReactDOM.findDOMNode(this.currentSubject).value;
                            let newSubject = ReactDOM.findDOMNode(this.newSubject).value;
                            let ownerId = Meteor.userId();
                            let ownerName = Meteor.user().profile ? Meteor.user().profile.name : Meteor.user().services.google.name;
                            let ownerPicture = Meteor.user().profile ? Meteor.user().profile.picture : Meteor.user().services.google.picture;
                            let classCode = (Math.floor(Math.random()*90000) + 10000).toString();
                            let documentId = (Math.floor(Math.random()*90000000) + 10000000).toString();

                            var classItem = {
                              className: className,
                              classCode: classCode,
                              ownerId: ownerId,
                              ownerName: ownerName,
                              ownerPicture: ownerPicture,
                              students: [],
                              subjectName: currentSubject ? currentSubject : newSubject,
                              documentId: documentId,
                              createAt: new Date()
                            }

                            asteroid.call('insertClasses', classItem);

                            var subjectItem = {
                              _id: documentId,
                            	name: currentSubject ? currentSubject : newSubject,
                            	owner: ownerName,
                            	coppier: '',
                            	date: new Date(),
                            	public: false,
                            	origin: true,
                              activity: []
                            }

                          asteroid.call('insertSubjects', subjectItem);

                            for(i = 0; i < this.state.classMembers.length; i ++) {
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
                                asteroid.call('insertNotification', note);
                            }



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

ClassList.PropTypes = {
  data: PropTypes.object.isRequired,
  friendList: PropTypes.object.isRequired,
  search: PropTypes.func.isRequired
}
