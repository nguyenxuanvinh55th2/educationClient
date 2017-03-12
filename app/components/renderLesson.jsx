//import { Meteor } from 'metor/meteor'

import React, {PropTypes,Component} from 'react'
ReactDom = require('react-dom')
import {Link,browserHistory} from 'react-router'
import {Panel,Row,Col,FormControl,FormGroup,ControlLabel,Button,Glyphicon,Collapse,HelpBlock} from 'react-bootstrap'

import { Medias } from '../../api/media.js'
import { Topics } from '../../api/topic'
import { Activity } from '../../api/activity'

import ShowFile from '../showFile/showFile.js'
import AddTopic from '../../containers/addTopic'

import TextEditor from '../textEditor/textEditor.js'

Meteor.subscribe('activity');

toggleFullScreen = (elem) => {
    // ## The below if statement seems to work better ## if ((document.fullScreenElement && document.fullScreenElement !== null) || (document.msfullscreenElement && document.msfullscreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
        elem.style.width = '100%';
        elem.style.height = '100vh';
        elem.lastChild.style.height = '100%';
        if (elem.requestFullScreen) {
            elem.requestFullScreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
            elm.lastChild.style.height = '410px';
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
            elm.lastChild.style.height = '410px';
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
            elm.lastChild.style.height = '410px';
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
            elm.lastChild.style.height = '410px';
        }
    }
}

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
ShowCurrentFile.PropTypes={
  name:PropTypes.string.isRequired,
  clickhide:PropTypes.func.isRequired
}

class ShowReply extends Component {
  renderFile(){
    return(
      <Row >
        {
          this.props.member.files.map(file => (
           <ShowFile key={file.index} link={file.link} filetype={file.filetype} filename={file.filename} />
         ))
        }
      </Row>
    )
  }
  componentDidMount() {
    let div = document.createElement('div');
    let content = document.getElementById('memberReply-' + this.props.memberReply._id);
    div.style.cssText = ' width: 100%;';
    div.innerHTML = this.props.memberReply.content;
    content.appendChild(div);
  }
  render(){
    return (
      <div>
        <hr/>
          <Row style={{padding:'0 2%'}}>
            <Col md={1}>
              <img width={64} height={64} src={this.props.memberReply.owner.image} alt="Image" />
            </Col>
            <Col md={11} style={{padding:'1% 4% 2%'}}>
              <p>{this.props.memberReply.owner.name}</p>
              <p style={{fontSize:'12px'}}>{this.props.memberReply.createAt}</p>
              <Row style={{padding:'2% 2%'}}>
                  <div id={'memberReply-' + this.props.memberReply._id}></div>
                  {/*this.renderFile()*/}
              </Row>
            </Col>
          </Row>
      </div>
    )
  }
}
ShowReply.PropTypes = {
  memberReply: PropTypes.object.isRequired
}

export default class RenderLesson extends Component {
  constructor(props)
  {
    super(props);
    this.state=({listfile:[],disable:true,open:false,openreply:false,click: 'unclink'});
    this.focus=this.focus.bind(this);
    this.reply=this.reply.bind(this);
    this.spliceList = this.spliceList.bind(this);
    this.changefile = this.changefile.bind(this);
    this.rendercurrentFile = this.rendercurrentFile.bind(this);
    this.change = this.changeinput.bind(this);
    this.replyContent = '';
    Meteor.subscribe("media");
  }
  changefile(event){
    let file = event.target.files
    let array =[]
    for(let i =0 ;i< file.length;i++)
    {
        array.push(file[i])
    }
    this.setState({listfile:array})
  }
  deleteTopic() {
    let topicId = this.props.topic._id;
    Topics.remove({_id: topicId});
    activityId = Activity.findOne({topicId: topicId})._id;
    Activity.remove({_id: activityId});
    this.props.refetchData();
  }
  renderReply(){
    return (
      this.props.topic.memberReply.sort(function(a, b){return b.index-a.index}).map((item) => (
        <ShowReply key={item.index} memberReply={item} />
      ))
    )
  }
  renderFile(){
        return(
          <Row >
            {
              this.props.topic.files.map(file => (
               <ShowFile key={file.index} link={file.link} filetype={file.filetype} filename={file.filename} />
             ))
            }
          </Row>
        )
      }
  focus(event){
    this.setState({disable:event.target.value})
  }
  spliceList(indexelement){
    let arr =[]
    arr = this.state.listfile
    if(arr.length === indexelement){
      arr.splice(indexelement, 1)
      this.setState({listfile:[]})
    }
    else {
      arr.splice(indexelement, 1)
      this.setState({listfile:arr})
    }
  }
  rendercurrentFile(event){
    let currentfile =this.state.listfile
      if(!currentfile) {
        return (<div></div>)
      }
      else {
        var listItem =[]
        for(let i=0 ;i < currentfile.length ;i++)
        {
          let ob ={
            index:i,
            name:currentfile[i].name
          }
          listItem.push(ob)
        }
        return listItem.map((row) =>(
              <ShowCurrentFile key={row.index} name={row.name} clickhide={this.spliceList.bind(this,row.index)} />
        ))
      }
  }
  async reply(event){
      event.preventDefault()
      let file = this.state.listfile;
      let link =[]
      if(file.length > 0)
      {
        Meteor._reload.onMigrate(function() {
          return [false];
        });
        for(let i= 0 ;i < file.length ;i++)
              {
              let fileObj = await new Promise(function (resolve, reject) {
                Medias.insert(file[i], function (err, fileObj) {
                  if(err) {

                  } else {
                      resolve(fileObj);
                    }
                });
              });
              var intervalHandle = Meteor.setInterval(function () {
                                              let checkUpdate = Medias.findOne({_id:fileObj._id});
                                              if(checkUpdate)
                                              {
                                                // document.getElementById("uploadCaptureInputFile").value = "";
                                                Meteor.clearInterval(intervalHandle)
                                              }
                                              else {

                                              }
                                          }, 1000);
              let type ='';
              fileObj.original.type
              if(fileObj.original.type.indexOf("application") > -1)
                type ='application'
                else if (fileObj.original.type.indexOf("audio") > -1) {
                  type ='audio'
                }
                else if (fileObj.original.type.indexOf("image") > -1) {
                  type ='image'
                }

              var ob ={
                filename:fileObj.original.name,
                filetype : type,
                link: 'public/media/' + fileObj.collectionName + '-' + fileObj._id + '-' + fileObj.original.name
            }
            link.push(ob);
        }
      }
      this.props.onAdd(this.props.topic._id, this.replyContent,link);
      this.setState({listfile:[]});
      this.props.refetchData();
  }
  changeinput(event){
    if(ReactDOM.findDOMNode(this.contentForum).value !== "")
      this.setState({disable:false})
      else {
        this.setState({disable:true})
      }
  }
  componentDidMount() {
    let div = document.createElement('div');
    let content = document.getElementById('content-' + this.props.topic._id);
    div.style.cssText = 'height: 100vh; width: 100%;';
    div.innerHTML = this.props.topic.content;
    content.appendChild(div);
  }

  getReplyContent(replyContent, info) {
    this.setState({disable: false})
    if(info && info.constructor.name === 'TextEditor') {
      let div = document.createElement('div');
      let content = '<div style = "height: inherit; width: inherit; overflow: scroll">' +
                      replyContent +
                    '</div>'
      this.replyContent = content;
    } else {
        this.replyContent = replyContent;
      }
  }

  renderTopic() {
      return (
        <div >
          <Row style={{padding:'0 2%'}}>
            <Col md={1}>
              <img width={64} height={64} src={this.props.topic.owner.image} alt="Image" />
            </Col>
            <Col md={11} style={{padding:'1% 4% 2%'}}>
                <p>{this.props.topic.owner.name} đã tạo một chủ đề mới</p>
                <p style={{fontSize:'12px'}}>{this.props.topic.dateStart}</p>
            </Col>
          </Row>
          <Button onClick={e=>{
                let elm = document.getElementById('content-' + this.props.topic._id);
                toggleFullScreen(elm);
            }}>Phóng to</Button>
          <Button onClick={this.deleteTopic.bind(this)}>Xóa</Button>
          <Row style={{padding:'0 4%'}}>
              <p>Tên chủ đề: {this.props.topic.title}</p>
              <div id={'content-' + this.props.topic._id}></div>
              {this.renderFile()}
          </Row>
          <hr></hr>
          <Row style={{padding:'0 4%'}}>
              <a onClick={() => this.setState({open:!this.state.open})}>
                 Xem bình luận
               </a>
               <Collapse in={this.state.open} style={{padding:'1% 2%'}}>
                 <Row>
                   <div style={{padding:'0 4%'}}>
                       <form>
                         <FormGroup onClick={e => {this.setState({openreply:true})}}>
                           <TextEditor getHtml = {this.getReplyContent.bind(this)} />
                         </FormGroup>
                         {' '}
                         <FormGroup >
                           <FormControl type="file" id={this.props.index} ref={node =>this.file=node} onChange={this.changefile.bind(this)} style={{display:'none'}} multiple />
                         </FormGroup>
                         {' '}
                       </form>
                       <div>
                         {/*this.rendercurrentFile()*/}
                       </div>
                       <Collapse in={this.state.openreply}>
                           <Row style={{margin:'0 0'}}>
                             <Button  onClick={()=> document.getElementById(this.props.index).click()}><Glyphicon glyph="paperclip" /></Button>
                             <Button style={{float:'right'}} bsStyle="primary" type="button" onClick={this.reply.bind(this)} disabled={this.state.disable} > Phản hồi</Button>
                           </Row>
                       </Collapse>
                   </div>
                   <div>
                        {this.renderReply()}
                   </div>
                 </Row>
               </Collapse>
          </Row>
        </div>
      )
  }
  render() {
    return (
        <div style={{padding:'20px 0px'}} className="panelforum" >
            {this.renderTopic()}
       </div>
    )
  }
}
RenderLesson.PropTypes = {
  topic:PropTypes.object.isRequired,
  index:PropTypes.number.isRequired,
  onAdd:PropTypes.func.isRequired,
  refetchData:PropTypes.func.isRequired
}
