//import { Meteor } from 'metor/meteor'
import React, { PropTypes, Component, ReactDom } from 'react';
import ReactGridLayout from 'react-grid-layout'

import { Grid, Col, Row, Button, Form, FormControl, FormGroup, Overlay, Popover, Modal, ButtonToolbar, ControlLabel } from 'react-bootstrap'


export default class VideoReader extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var reader = new FileReader();
    var parent = this;
    if(this.props.video.size > 10485760) {
    } else
        if(this.props.video.type.substring(0, 5) === 'video') {
          let clip = document.getElementById('video-' + this.props.id);
          reader.onload = (function(video) {return function(e) {
              if(this.props.fileLink === '')
                video.src = e.target.result;
            };
          })(clip);
          // read the image file as a data URL.
          if(parent.props.video) {
            reader.readAsDataURL(this.props.video);
          }
      }
  }

  render() {
    return (
      <div style={{width: 'inherit', height: 'inherit'}}>
        { this.props.video ?
            <video id = { 'video-' + this.props.id } style = {{ width: 'inherit', height: 'inherit' }} controls src = { this.props.fileLink }>
            </video> : null }
      </div>
    )
  }
}

VideoReader.PropTypes = {
  video: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  fileLink: PropTypes.string.isRequired
}
