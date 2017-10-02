import React from 'react';
import { findDOMNode } from 'react-dom';
import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import __ from 'lodash';

import Dialog from 'material-ui/Dialog';
import Quill from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Dropzone from 'react-dropzone';

let quillEditor = null;
class ImageHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {filesImage: null, image: ''};
  }

  onDropAccepted(acceptedFiles,event) {
    let that = this;
    if(acceptedFiles.length){
      __.forEach(acceptedFiles,(file,idx) =>{
        if(file.size <= 1024*1000*2){
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function (e) {
              if(e.target.result){
                that.setState({
                  filesImage: {
                    file:e.target.result,
                    fileName: file.name,
                    type: file.type
                  },
                  image: ''
                });
              }
          };
          reader.onerror = function (error) {
            console.log('Error: ', error);
          };
        }
      });
    }
  }


  onDropRejected(rejectedFiles){
    if(rejectedFiles.length && rejectedFiles[0].size > 1024*1000*2){
      alert('File nhỏ hơn 2MB!');
    }
  }

  saveImage() {
    let { filesImage, image } = this.state;
    if(filesImage) {
      let info = filesImage;
      info = JSON.stringify(info);
      this.props.insertFiles(info).then(({data}) => {
        console.log("data ", data.insertFiles);
        this.props.insertImage(data.insertFiles);
        this.props.handleClose();
      });
    } else
    if(image) {
      this.props.insertImage(image);
      this.props.handleClose();
    }
  }

  render() {
    let { data } = this.props;
    console.log('data.images ', data.images);
    return (
      <div className="modal-content" style={{border: 0}}>
        <div className="modal-header">
            <h4 className="modal-title">Lưu ảnh</h4>
        </div>
        <div className="modal-body" style={{height: 400, overflowY: 'auto', overflowX: 'hidden'}}>
          <div className="modal-body" style={{height: this.props.height, overflowY: 'auto', overflowX: 'hidden'}}>
            <span>Thêm ảnh từ máy</span>
            <div style={{display: 'flex', flexDirection:'row', height:'auto', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
              <div style={{flexDirection:'column', margin:5}}>
                <Dropzone style={{padding: 22, textAlign:'center', width: 150, height:120, border: '5px dashed #DDD', background: '#F8F8F8'}} onDropAccepted={this.onDropAccepted.bind(this)} onDropRejected={this.onDropRejected.bind(this)} accept="image/*" minSize={0} maxSize={1024*2*1000} multiple={false}>
                  <div>Kéo thả hoặc chọn ảnh</div>
                </Dropzone>
              </div>
              {
                this.state.filesImage &&
                <div style={{flexDirection:'column', margin:5,backgroundColor:'rgba(0, 0, 0, 0.4)',width: 150,height:120}}>
                  <img src={this.state.filesImage ? this.state.filesImage.file : ''} style={{width: '100%', height: 90, padding:0}}/>
                  <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', color:'rgb(255, 255, 255)'}} >
                    <h5 style={{overflow:'hidden',textOverflow:'ellipsis', width: 120, whiteSpace: 'nowrap'}}>{this.state.filesImage ? this.state.filesImage.fileName : ''}</h5>
                    <button type="button" className="btn btn-lg"
                      style={{minWidth: '30px', minHeight: '35px', height: '35px',
                        margin: 0, boxShadow:'none', background:'none', padding: 0}}
                        onClick={() => {
                          var deleteImage = confirm("Bạn có muốn xóa ảnh này?");
                          if (deleteImage == true) {
                            this.setState({filesImage: null});
                          }
                        }}>
                        <span className="glyphicon glyphicon-remove"></span>&nbsp;
                    </button>
                  </div>
                </div>
              }
            </div>
            <span>Thêm ảnh trên mạng</span>
            <div>
              <input type="text" className="form-control" value={this.state.image} onChange={({target}) => {
                if(target.value) {
                  this.setState({image: target.value, filesImage: null});
                }
              }}/>
            </div>
          </div>
          <div className="modal-body" style={{height: this.props.height, overflowY: 'auto', overflowX: 'hidden'}}>
              {
                data.images ?
                <div style={{display: 'flex', flexDirection:'row', height:'auto', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                  {
                    data.images.map((item, idx) => {
                      return (
                        <img key={idx} style={{width: '100px', height: '100px', padding: 5, cursor: 'pointer', backgroundColor: this.state.image === item.file ? 'blue' : 'white'}} src={item.file} onClick={() => this.setState({image: item.file})}/>
                      )
                    })
                  }
                </div> : <div>Không có ảnh</div>
              }
          </div>
        </div>
        <div className="modal-footer" style={{margin: 0}}>
            <button type="button" className="btn btn-default" onClick={() => this.props.handleClose()}>Thoát</button>
            <button type="button" className="btn btn-primary" onClick={() => this.saveImage()}>Lưu</button>
        </div>
      </div>
    )
  }
}

const IMAGE_QUERY = gql `
  query images {
      images {
        _id
        fileName
        file
      }
  }`

const INSERT_FILE = gql`
    mutation insertFiles($info: String){
        insertFiles(info: $info)
}`

const ImageHandlerWithMutate = compose(
  graphql(IMAGE_QUERY, {
    options: () => ({
      fetchPolicy: 'network-only'
    })
  }),
  graphql(INSERT_FILE, {
      props: ({mutate})=> ({
          insertFiles : (info) => mutate({variables:{info}})
      })
  })
)(ImageHandler);


export default class QuillEditor extends React.Component {
  constructor(props){
      super(props);
      this.quillEditor = null;
      this.state = {open: false, image: '', type: ''};
  }
  insertImage(image) {
    var index = this.quillEditor.getSelection(true).index;
    this.quillEditor.insertEmbed(index, 'image', image);
    this.handleClose();
  }
  insertTable(row, col, tabledata, cellHeight, textAlign, fontSize) {
    var index = this.quillEditor.getSelection(true).index;
    console.log("tabledata ", tabledata);
    this.quillEditor.insertEmbed(index, 'table', JSON.stringify({
      row,
      col,
      tabledata,
      cellHeight,
      fontSize,
      textAlign
    }));
    this.handleClose();
  }
  componentDidMount() {
      let that = this;
      let element = findDOMNode(this.refs.editor);
      var toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        // ['blockquote', 'code-block'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        // [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['link', 'image'],
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean'],                                         // remove formatting button
      ];
      this.quillEditor = new Quill(element, {
          theme: 'snow',
          modules: {
              toolbar: '#toolbar-container'
          }
      });
      this.quillEditor.getModule('toolbar').addHandler('image', () => {
        that.setState({open: true});
      });
      this.quillEditor.getModule('toolbar').addHandler('formula', () => {
        that.setState({open: true, type: 'table'})
      });
      document.getElementById('editor').firstChild.innerHTML = this.props.html;
      this.quillEditor.on('text-change', (delta) => {
        if(this.props.getContent){
          let content = document.getElementById('editor').firstChild.innerHTML;
          this.props.getContent(content)
        }
      });
  }

  handleClose() {
    this.setState({open: false, type: ''});
  }

  render() {
    let { height, value} = this.props;
    let { open, type } = this.state;
    return (
      <div>
        <div id="standalone-container">
          <div id="toolbar-container">
            <span className="ql-formats">
              <select className="ql-font">
                <option selected>Sans Serif</option>
                <option value="inconsolata">Inconsolata</option>
                <option value="roboto">Roboto</option>
                <option value="mirza">Mirza</option>
                <option value="arial">Arial</option>
                <option value="sedgwick">Sedgwick</option>
              </select>
              <select className="ql-size"></select>
            </span>
            <span className="ql-formats">
              <button className="ql-bold"></button>
              <button className="ql-italic"></button>
              <button className="ql-underline"></button>
              <button className="ql-strike"></button>
            </span>
            <span className="ql-formats">
              <select className="ql-color"></select>
              <select className="ql-background"></select>
            </span>
            <span className="ql-formats">
              <button className="ql-link"></button>
            </span>
            <span className="ql-formats">
              <button className="ql-header" value="1"></button>
              <button className="ql-header" value="2"></button>
            </span>
            <span className="ql-formats">
              <button className="ql-list" value="ordered"></button>
              <button className="ql-list" value="bullet"></button>
              <button className="ql-indent" value="-1"></button>
              <button className="ql-indent" value="+1"></button>
            </span>
            <span className="ql-formats">
              <button className="ql-direction" value="rtl"></button>
              <select className="ql-align"></select>
            </span>
            <button className="ql-image"></button>
          </div>
        </div>
        <div id="quilljs-container"></div>
        <div id="editor" style={{height: this.props.height}} ref="editor"></div>
          <Dialog
              open={this.state.open}
              bodyStyle={{padding: 0}}
              contentStyle={{width: 500}}
              onRequestClose={this.handleClose.bind(this)}
          >
              <div className="modal-dialog" style={{width: 'auto', margin: 0}}>
                {
                  type === 'table' ?
                  <TableHandler handleClose={this.handleClose.bind(this)} insertTable={this.insertTable.bind(this)}/> :
                  <ImageHandlerWithMutate handleClose={this.handleClose.bind(this)} insertImage={this.insertImage.bind(this)}/>
                }
              </div>
          </Dialog>
      </div>
    )
  }
}
