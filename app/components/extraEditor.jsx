//import { Meteor } from 'metor/meteor'
import React, { PropTypes, Component } from 'react';
import ReactGridLayout from 'react-grid-layout'

import { Grid, Col, Row, Button, Form, FormControl, FormGroup, Overlay, Popover, Modal, ButtonToolbar, ControlLabel } from 'react-bootstrap'

import '../../node_modules/react-grid-layout/css/styles.css'

import TextEditor from './textEditor.jsx';
import FileReader from './fileReader.jsx';
import BackgroundListContain from './backgroundList.jsx';

// Meteor._reload.onMigrate(function() {
//   return [false];
// });

export default class ExtraEditor extends Component {

  constructor(props) {
    super(props);
    this.editorList = [];
    this.state = { show: true, directorClass: 'left', editorList: [], background: '', showModal: false, overFlow: 'scroll' };
    this.layout = [
      {i: 'tool', x: 0, y: 0, w: 3, h: 14, static: true},
      {i: 'editor', x: 4, y: 0, w: 9, h: 14, static: true}
    ];
    this.sublayout = [];
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  renderEditor() {
    let list = this.editorList.filter(item => item.key !== '');
    return list.map((item) => (
      <div className="extraTextContent" style={{margin: '0 auto'}} id = { 'extraTextContent' + item.id } style={{minWidth: '320px'}} key={item.key}>
          <div style={{minHeight: '20px'}} onMouseOver={this.enableTool.bind(this, item)} onMouseLeave={this.disableTool.bind(this, item)}>
            {item.toolshow ?
            <Row>
              {item.type === 'text' ? <Col md={9}><Button bsStyle="primary" onClick={this.setupTextContent.bind(this, item)}>{ item.show ? 'Lưu' : 'Sửa'}</Button></Col> : null}
              <Col md={2}><Button bsStyle="primary" onClick={this.removeTextEditor.bind(this, item)}>X</Button></Col>
            </Row> : null}
          </div>
          {item.type === 'text' ?
            <div>
              {item.show ? <TextEditor key={item.key} show={item.show} getHtml={this.getHtml.bind(this, item)} html={item.html}/> : null}
            </div> :
            <div style={{height: 'inherit', width: 'inherit'}}>
              <FileReader file = {item.file} id = { item.id } fileLink = { item.fileLink }/>
            </div>
          }
      </div>
    ))
  }

  enableTool(item) {
    let index = parseInt(item.key);
    if(this.editorList[index]) {
      this.editorList[index].toolshow = true;
      this.setState({editorList: this.editorList});
    }
  }

  disableTool(item) {
    let index = parseInt(item.key);
    if(this.editorList[index]) {
      this.editorList[index].toolshow = false;
      this.setState({editorList: this.editorList});
    }
  }

  addNewEditor(type) {
    let indexId = (Math.floor(Math.random()*90000) + 10000).toString() + this.editorList.length.toString();
    let index = this.editorList.length.toString();
    let fileInput;
    if(type === 'text') {
      this.editorList.push({key: index, id: indexId, type: 'text', toolshow: true, show: true, html: ''});
    } else
        if(type === 'link') {

          this.editorList.push({key: index, id: indexId, type: 'link'});
        } else {
            fileInput = document.getElementById(type + 'Input');
            let file = fileInput ? fileInput.files[0] : {};
            this.editorList.push({key: index, id: indexId, type: type, file: file, fileLink: ''});
          }
    this.sublayout.push({i: index, x: 0, y: 0, w: 5, h: 5, minW: 3, minH: 2});
    this.setState({editorList: this.editorList});
  }

  setBackgroundForeign() {
    let imageInput = document.getElementById('backgroundInput');
    let image = imageInput ? imageInput.files[0] : {};
    var parent = this;
    var reader = new FileReader();
    if(image.size > 10485760) {
    } else
        if(image.type.substring(0, 5) === 'image') {
          reader.onload = function (e) {
          parent.setState({ background: "url('" + e.target.result + "')" });
        };
          // read the image file as a data URL.
        if(image) {
          reader.readAsDataURL(image);
        }
      }
  }

  setBackgroundImage(image) {
    this.setState({background: "url('" + "http://localhost:3000/background/" + image + "')"});
  }

  getHtml(item, html) {
    let index = parseInt(item.key);
    if(this.editorList[index]) {
      this.editorList[index].html = html;
      this.setState({editorList: this.editorList});
    }
  }

  removeTextEditor(item) {
    let index = parseInt(item.key);
    if(this.editorList[index]) {
      this.editorList[index].key = '';
      this.editorList[index].indexId = '';
      this.sublayout.splice(index, 1);
      this.setState({editorList: this.editorList});
    }
  }

  setupTextContent(item) {
    let index = parseInt(item.key)
    if(this.editorList[index] && this.editorList[index].show) {
      let div = document.createElement('div');
      div.style.cssText = 'height: inherit; width: inherit';
      div.innerHTML = this.editorList[index].html;
      document.getElementById('extraTextContent' + item.id).appendChild(div);
      this.editorList[index].show = false;
    } else {
        let content = document.getElementById('extraTextContent' + item.id).lastChild
        document.getElementById('extraTextContent' + item.id).removeChild(content);
        this.editorList[index].show = true;
    }
    this.setState({editorList: this.editorList});
  }

  saveHtmlForm() {
    let editorLength = this.editorList.length;
    var parent = this;
    this.setState({overFlow: 'none'});
    this.editorList.forEach(item => {
        if(item.type === 'image' || item.type === 'audio' || item.type === 'video') {
          Medias.insert(item.file, function (err, fileObj) {
            if(err) {

            } else {
                item.fileLink = 'http://localhost:3000/media/' + fileObj.collectionName + '-' + fileObj._id + '-' + fileObj.original.name ;
                parent.setState({editorList: parent.editorList});
                if (JSON.stringify(item) === JSON.stringify(parent.editorList[parent.editorList.length - 1])) {
                  let content = document.getElementById('textEditor');
                  let htmlContent = content.innerHTML
                  while(htmlContent.indexOf('react-grid-item') > -1) {
                    console.log("message");
                    htmlContent = htmlContent.replace('react-grid-item', '');
                  }
                  parent.props.getTopicContent(htmlContent, parent);
                }
              }
          })
        }
        else {
          if (JSON.stringify(item) === JSON.stringify(this.editorList[this.editorList.length - 1])) {
            let content = document.getElementById('textEditor');
            let htmlContent = content.innerHTML;
            while(htmlContent.indexOf('react-grid-item') > -1) {
              console.log("message");
              htmlContent = htmlContent.replace('react-grid-item', '');
            }
            this.props.getTopicContent(htmlContent, this);
          }
        }
    })
  }


  render() {
    //alert(this.state.overFlow);
      return (
        <div style={{height: '100%', width: '100%'}}>
          <Modal dialogClassName="background-modal" show={this.state.showModal} onHide={this.close.bind(this)}>
            <BackgroundListContain setBackgroundImage={this.setBackgroundImage.bind(this)} setBackgroundForeign={this.setBackgroundForeign.bind(this)} />
          </Modal>
          <Row style={{width: '100%', height: '85%', marginLeft: '0px'}}>
            <Col md={2} style={{backgroundColor: 'green', height: '100%', }}>
              <Button onClick={this.addNewEditor.bind(this, 'text')}>Text</Button>
              <span className="btn btn-default btn-file">
                Hình ảnh<input id="imageInput" className="form-control" type="file" accept="image/*" onChange={this.addNewEditor.bind(this, 'image')}/>
              </span>
              <span className="btn btn-default btn-file">
                Video<input id="videoInput" className="form-control" type="file" accept="video/*" onChange={this.addNewEditor.bind(this, 'video')}/>
              </span>
              <span className="btn btn-default btn-file">
                Âm thanh<input id="audioInput" className="form-control" type="file" accept="audio/*" onChange={this.addNewEditor.bind(this, 'audio')}/>
              </span>
              <Button onClick={this.addNewEditor.bind(this, 'link')}>Link Media</Button>
              <span className="btn btn-default btn-file">
                Tài liệu<input id="documentInput" type="file" accept=".pdf, .doc, .docx, .ppt" onChange={this.addNewEditor.bind(this, 'document')}/>
              </span>
              <Button onClick={this.open.bind(this)} style={{marginTop: '5px'}} bsStyle="primary">Hình nền</Button>
            </Col>
            <Col md={10} id="textEditor" style={{height: '100%'}}>
              <div style={{ backgroundImage: this.state.background, backgroundRepeat: 'no-repeat', backgroundColor: 'white', backgroundSize: '100% 100%', backgroundAttachment: 'fixed', height: '100%', width: '100%', overflow: 'scroll'}}>
                <ReactGridLayout className="layout" layout={this.sublayout} cols={12} rowHeight={90} width={1024}>
                  {this.renderEditor()}
                </ReactGridLayout>
              </div>
            </Col>
          </Row>
          <Button onClick={ this.saveHtmlForm.bind(this) }>Lưu lại</Button>
        </div>
      )
    }
}

ExtraEditor.PropTypes = {
  getTopicContent: PropTypes.func.isRequired
}
