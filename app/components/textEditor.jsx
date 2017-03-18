import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom'
import '../../node_modules/quill/dist/quill.snow.css'

import  Quill  from 'quill'

import { Grid, Col, Row, Button, Form, FormControl, FormGroup, Overlay, Popover, Modal, ButtonToolbar, ControlLabel } from 'react-bootstrap'

import ColorPicker from './colorPicker.jsx'

// var editor = new Quill('#editor', {
//     modules: { toolbar: '#toolbar' },
//     theme: 'snow'
//   });

export default class TextEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      html: '',
      quillEditor: null
    };
    this.editor;
  }

  componentDidMount() {
    if(this.refs.editor) {
      let { data, handleSaveContent } = this.props;
      let element = ReactDOM.findDOMNode(this.refs.editor);
      this.editor = new Quill(element, {
          theme: 'snow',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'align': [] }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6] }],
              [{ 'color': [] }, { 'background': [] }],
              ['link', 'image', 'video'],
              ['clean']
            ]
          }
        });
        var parent = this;
        if(this.props.html) {
          this.editor.root.innerHTML = this.props.html;
        }
        // editor.pasteHTML(0, this.state.html);
        this.editor.on('text-change', function(delta, oldDelta, source) {
          parent.props.getHtml(parent.editor.root.innerHTML, parent);
        });
        // this.setState({quillEditor: editor});
    }
  }



  render() {
    return (
      <div>
        <div ref="editor" style={{height: 'auto', width: 'inherit', minWidth: '320px'}}>
        </div>
      </div>
    )
  }
}

TextEditor.PropTypes = {
  show: PropTypes.bool.isRequired,
  getHtml: PropTypes.func.isRequired,
  html: PropTypes.string.isRequired
}
