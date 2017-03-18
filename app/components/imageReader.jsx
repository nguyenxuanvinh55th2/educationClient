//import { Meteor } from 'metor/meteor'
import React, { PropTypes, Component, ReactDom } from 'react';
import ReactGridLayout from 'react-grid-layout'

import { Grid, Col, Row, Button, Form, FormControl, FormGroup, Overlay, Popover, Modal, ButtonToolbar, ControlLabel } from 'react-bootstrap'


export default class ImageReader extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var reader = new FileReader();
    var parent = this;
    if(this.props.image.size > 10485760) {
    } else
        if(this.props.image.type.substring(0, 5) === 'image') {
          reader.onload = function (e) {
          // get loaded data and render thumbnail.
          if(parent.props.fileLink === '')
            document.getElementById('photo-' + parent.props.id).src = e.target.result;
        };
          // read the image file as a data URL.
        if(this.props.image) {
          reader.readAsDataURL(this.props.image);
        }
      }
  }

  render() {
    return (
      <div style={{width: 'inherit', height: 'inherit'}}>
        {this.props.image ? <img id={'photo-' + this.props.id} style={{width: 'inherit', height: 'inherit'}} src = { this.props.fileLink }/> : null }
      </div>
    )
  }
}

ImageReader.PropTypes = {
  image: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  fileLink: PropTypes.string.isRequired
}
