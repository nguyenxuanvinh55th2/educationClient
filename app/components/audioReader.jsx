//import { Meteor } from 'metor/meteor'
import React, { PropTypes, Component, ReactDom } from 'react';
import ReactGridLayout from 'react-grid-layout'

import { Grid, Col, Row, Button, Form, FormControl, FormGroup, Overlay, Popover, Modal, ButtonToolbar, ControlLabel } from 'react-bootstrap'


export default class AudioReader extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var reader = new FileReader();
    var parent = this;

    if(this.props.audio.size > 10485760) {
    } else
        if(this.props.audio.type.substring(0, 5) === 'audio') {
          let sound = document.getElementById('audio-' + this.props.id);
          reader.onload = (function(audio) {return function(e) {
              if(parent.props.fileLink === '')
                audio.src = e.target.result;
            };
          })(sound);
          // read the image file as a data URL.
          if(this.props.audio) {
            reader.readAsDataURL(this.props.audio);
          }
      }
  }

  render() {
    return (
      <div style={{width: 'inherit', height: 'inherit'}}>
        { this.props.audio ?
            <audio id = { 'audio-' + this.props.id } style = {{ width: 'inherit', height: 'inherit' }} controls src = { this.props.fileLink }>
            </audio> : null }
      </div>
    )
  }
}

AudioReader.PropTypes = {
  audio: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  fileLink: PropTypes.string.isRequired
}
