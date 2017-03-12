import React, { PropTypes, Component, ReactDom } from 'react';
import { Link, Router, browserHistory } from 'react-router'
import fetch from 'isomorphic-fetch'
import { connect } from 'react-redux'

import Dropzone from 'react-dropzone'
import { Form,FormGroup,ControlLabel,FormControl,Button,Glyphicon,Panel,Row,Col,OverlayTrigger,Tooltip,Tabs,Tab,Modal } from 'react-bootstrap'
import { addTopic } from '../action/actionCreator.js'

import TextEditor from './textEditor.jsx'
import ExtraEditor from './extraEditor.jsx'

class ShowCurrentFile extends Component {
  constructor(props)
  {
    super(props)
  }
  render(){
    return(
      <div className="chip">
        {this.props.name}
        <span className="closebtn" onClick={e=>this.props.clickhide()}>&times;</span>
      </div>
    )
  }
}
ShowCurrentFile.PropTypes ={
  name:PropTypes.string.isRequired,
  clickhide:PropTypes.func.isRequired
}

class TopicEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {showModal: false};
    this.link ="";
    this.insertTopic = this.insertTopic.bind(this)
    this.changefile = this.changefile.bind(this)
    this.spliceList = this.spliceList.bind(this)
    this.newFile;
    Meteor.subscribe("media");
    this.listfiles =[];
    this.topicName = '';
    this.topicContent = '';
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  changefile(event) {

    var file = event.currentTarget.files;
    for(let i =0 ;i< file.length;i++)
    {
        this.listfiles.push(file[i])
    }
  }

  insertTopic(event)
  {
    var link =[];
    event.preventDefault();
    let files = this.listfiles;
    var topicType = 'lesson';

    if(files.length > 0)
    {
      var parent = this;
      Meteor._reload.onMigrate(function() {
        return [false];
      });
      files.forEach(item => {
        var ob = {
          _id: '',
          ownerId: '',
          fileName: '',
          fileType : '',
          link: '',
        }
        Medias.insert(item, function (err, fileObj) {
          if(err) {

          } else {
              let type = '';
              fileObj.original.type
              if(fileObj.original.type.indexOf("application") > -1)
                type ='application'
                else if (fileObj.original.type.indexOf("audio") > -1) {
                  type ='audio'
                }
                else if (fileObj.original.type.indexOf("image") > -1) {
                  type ='image'
                }
              ob = {
                _id: '',
                ownerId: Meteor.userId(),
                fileName:fileObj.original.name,
                fileType : type,
                link: 'public/media/' + fileObj.collectionName + '-' + fileObj._id + '-' + fileObj.original.name,
              }
              link.push(ob);
              if(JSON.stringify(item) === JSON.stringify(parent.listfiles[parent.listfiles.length - 1])) {
                let reactDom = ReactDOM.findDOMNode;
                parent.props.onAdd(parent.props.courseId, reactDom(parent.subjectName).value, reactDom(parent.dateStart).value, new Date(reactDom(parent.dateEnd).value), parent.topicContent, topicType, link);
                reactDom(parent.subjectName).value = ''
              }
            }
        });
      })
    } else {
        let reactDom = ReactDOM.findDOMNode;
        this.props.onAdd(this.props.courseId, reactDom(this.subjectName).value, reactDom(this.dateStart).value, new Date(reactDom(this.dateEnd).value), this.topicContent, topicType, link);
        reactDom(this.subjectName).value = ''
      }
    this.props.refetchData();
  }

  getTopicContent(topicContent, info) {
    if(info && info.constructor.name === 'TextEditor') {
      let div = document.createElement('div');
      let content = '<div style = "height: inherit; width: inherit; overflow: scroll">' +
                      topicContent +
                    '</div>'
      this.topicContent = content;
    } else {
        this.topicContent = topicContent;
      }
  }

  renderFile(){
      if(this.listfiles.length ===0) {
        return (<div></div>)
      }
      else {
        let file = this.listfiles
        var listItem =[]
        for(let i=0 ;i < file.length ;i++)
        {
          let ob ={
            index:i,
            name:file[i].name
          }
          listItem.push(ob)
        }
        return listItem.map((row) =>(
              <ShowCurrentFile key={row.index} name={row.name} clickhide={this.spliceList.bind(this,row.index)} />
        ))
      }
  }

  spliceList(index) {
    this.listfiles.splice(index, 1)
  }

  render() {
    const tooltip = (
      <Tooltip id="tooltip">Thêm file bài giảng</Tooltip>
    );
    return (
      <div>
        <Modal dialogClassName="custom-modal" show={this.state.showModal} onHide={this.close.bind(this)}>
          <ExtraEditor getTopicContent = {this.getTopicContent.bind(this)}/>
        </Modal>
        <div>
          <FormControl style={{marginBottom: '5px'}} type="text" placeholder="Tiêu đề" ref={node => this.subjectName=node}/>
        </div>
        <TextEditor getHtml = {this.getTopicContent.bind(this)}/>
        <div>
          <Row>
            <Col md={12}>
            {
              this.renderFile()
            }
            </Col>
          </Row>
          <FormGroup >
             <input type="file" id="uploadCaptureInputFile" onChange={this.changefile.bind(this)}  multiple style={{display:'none'}}/>
          </FormGroup>
          <Row>
            <Col md={6}>
              <FormGroup >
                <ControlLabel>ngày bắt đầu</ControlLabel>
                <FormControl placeholder="ngày bắt đầu" ref={node => this.dateStart=node} type="date"/>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup >
                <ControlLabel>ngày kết thúc</ControlLabel>
                <FormControl placeholder="ngày kết thúc" ref={node => this.dateEnd=node} type="date"/>
              </FormGroup>
            </Col>
          </Row>
          <Row style={{margin:'0 0'}}>
            <OverlayTrigger placement="bottom" overlay={tooltip}>
              <Button style={{border:'none'}} onClick={()=> document.getElementById("uploadCaptureInputFile").click()}><Glyphicon glyph="paperclip" /></Button>
            </OverlayTrigger>
            <Col mdOffset={9}>
              <Button bsStyle="primary" onClick={this.open.bind(this)}>Mở rộng</Button>
              <Button style={{float:'right'}} bsStyle="primary" type="button" onClick={this.insertTopic.bind(this)}> Tạo chủ đề</Button>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
TopicEditor.PropTypes = {
  courseId: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
  refetchData: PropTypes.func.isRequired
}

class addNewTopic extends Component {
  constructor(props){
    super(props);

  }
  render() {
    return (
      <Tabs id="add-topic-tabs" defaultActiveKey={1}>
        <Tab eventKey={1} title="Chủ đề">
          <Panel >
            <TopicEditor refetchData={this.props.refetchData} courseId={this.props.courseId} onAdd={this.props.onAdd}/>
          </Panel>
        </Tab>
        <Tab eventKey={2} title="Bài tập">
          <Panel>
            <TopicEditor refetchData={this.props.refetchData} courseId={this.props.courseId} onAdd={this.props.onAdd}/>
          </Panel>
        </Tab>
        <Tab eventKey={3} title="Bài kiểm tra">

        </Tab>
        <Tab eventKey={4} title="Khảo sát">

        </Tab>
      </Tabs>

    )
  }
}

addNewTopic.PropTypes = {
    onAdd:PropTypes.func.isRequired,
    courseId:PropTypes.string.isRequired,
    refetchData:PropTypes.func.isRequired
}

const mapStateToProps = (state,ownProps) => {
  return {
    state,
    // id:ownProps.params.id
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAdd: (courseId, title, dateStart, dateEnd, main, type, files) => {
      dispatch(addTopic(courseId, title, dateStart, dateEnd, main, type,files))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(addNewTopic)
