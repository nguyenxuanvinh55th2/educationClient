import React, { Component, PropTypes } from 'react';
import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import __ from 'lodash';

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

  saveImage() {
    let { filesImage, image } = this.state;
    if(filesImage) {
      let info = filesImage;
      info = JSON.stringify(info);
      this.props.insertFiles(info).then(({data}) => {
        this.props.insertImage(data.insertFiles);
        this.props.handleClose();
      });
    } else
        if(image) {
          this.props.insertImage(image);
          this.props.handleClose();
        }
  }

  onDropRejected(rejectedFiles){
    if(rejectedFiles.length && rejectedFiles[0].size > 1024*1000*2){
      alert('File nhỏ hơn 2MB!');
    }
  }

  render() {
    let { data } = this.props;
    return (
      <div className="modal-content" style={{border: 0}}>
        <div className="modal-header">
            <h4 className="modal-title">Lưu ảnh</h4>
        </div>
        <div className="modal-body" style={{height: 300, overflowY: 'auto', overflowX: 'hidden'}}>
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
        </div>
        <div className="modal-footer" style={{margin: 0}}>
            <button type="button" className="btn btn-default" onClick={() => this.props.handleClose()}>Thoát</button>
            <button type="button" className="btn btn-primary" onClick={() => this.saveImage()}>Lưu</button>
        </div>
      </div>
    )
  }
}

// const IMAGE_QUERY = gql `
//   query images {
//       images {
//         _id
//         fileName
//         file
//       }
//   }`
//
// const INSERT_FILE = gql`
//     mutation insertFiles($info: String){
//         insertFiles(info: $info)
// }`
//
// const ImageHandlerWithMutate = compose(
//   graphql(IMAGE_QUERY, {
//     options: () => ({
//       fetchPolicy: 'network-only'
//     })
//   }),
//   graphql(INSERT_FILE, {
//       props: ({mutate})=> ({
//           insertFiles : (info) => mutate({variables:{info}})
//       })
//   })
// )(ImageHandler);
const ImageHandlerWithMutate = ImageHandler;

export default class CkEditor extends React.Component {
  constructor(props) {
        super(props);
        this.state = {
        content: '',
        }
    }

  updateContent(value) {
      this.setState({content:value})
      this.props.getContent(value);
  }

  componentDidMount() {
    CKEDITOR.replace('editor1', {
      // Define the toolbar groups as it is a more accessible solution.
			toolbarGroups: [
				{"name":"basicstyles","groups":["basicstyles"]},
				{"name":"links","groups":["links"]},
				{"name":"paragraph","groups":["list","blocks"]},
				{"name":"document","groups":["mode"]},
				{"name":"insert","groups":["insert"]},
				{"name":"styles","groups":["styles"]},
				{"name":"about","groups":["about"]}
			],
			// Remove the redundant buttons from toolbar groups defined above.
			removeButtons: 'Underline,Strike,Subscript,Superscript,Anchor,Styles,Specialchar'
    });
    // CKEDITOR.editorConfig = function( config ) {
    //   // config.extraPlugins = "imageresize";
    //   // config.imageResize.maxWidth = 800;
    //   // config.imageResize.maxHeight = 800;
    //   config.toolbarGroups: [
		// 		{"name":"basicstyles","groups":["basicstyles"]},
		// 		{"name":"links","groups":["links"]},
		// 		{"name":"paragraph","groups":["list","blocks"]},
		// 		{"name":"document","groups":["mode"]},
		// 		{"name":"insert","groups":["insert"]},
		// 		{"name":"styles","groups":["styles"]},
		// 		{"name":"about","groups":["about"]}
		// 	],
		// 	// Remove the redundant buttons from toolbar groups defined above.
		// 	config.removeButtons: 'Underline,Strike,Subscript,Superscript,Anchor,Styles,Specialchar'
    //}

    // CKEDITOR.instances.editor1.on('change', function() {
    //   console.log("instances ");
    // });
    // CKEDITOR.plugins.add( 'simpleImageUpload', {
    //   init: function( editor ) {
    //     var fileDialog = $('<input type="file">');
    //
    //     fileDialog.on('change', function (e) {
    //         var uploadUrl = editor.config.uploadUrl;
    //   			var file = fileDialog[0].files[0];
    //   			var imageData = new FormData();
    //   			imageData.append('file', file);
    //
    //   			$.ajax({
    //   				url: uploadUrl,
    //   				type: 'POST',
    //   				contentType: false,
    //   				processData: false,
    //   				data: imageData,
    //   			}).done(function(done) {
    //   				var ele = editor.document.createElement('img');
    //   				ele.setAttribute('src', done);
    //   				editor.insertElement(ele);
    //   			});
    //
    //           })
    //           editor.ui.addButton( 'Image', {
    //               label: 'Insert Image',
    //               command: 'openDialog',
    //               toolbar: 'insert'
    //           });
    //           editor.addCommand('openDialog', {
    //               exec: function(editor) {
    //                   fileDialog.click();
    //               }
    //           })
    //   }
    // });
  }

  render() {
    return (
      <textarea name="editor1" id="editor1" rows="10" cols="80">
        This is my textarea to be replaced with CKEditor.
      </textarea>
    )
  }
}
