//import { Meteor } from 'metor/meteor'
import React, { PropTypes, Component, ReactDom } from 'react';
import ReactGridLayout from 'react-grid-layout'

import { Grid, Col, Row, Button, Form, FormControl, FormGroup, Overlay, Popover, Modal, ButtonToolbar, ControlLabel } from 'react-bootstrap'

import ImageReader from './imageReader.jsx'
import AudioReader from './audioReader.jsx'
import VideoReader from './videoReader.jsx'
import DocumentReader from './documentReader.jsx'

export default class FileReader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.file.type.substring(0, 5) === 'image') {
      return (
        <ImageReader image = { this.props.file } id = { this.props.id } fileLink = { this.props.fileLink }/>
      )
    } else
        if (this.props.file.type.substring(0, 5) === 'video') {
          return (
            <VideoReader video = { this.props.file } id = { this.props.id } fileLink = { this.props.fileLink }/>
          )
        } else
          if (this.props.file.type.substring(0, 5) === 'audio') {
            return (
              <AudioReader audio = { this.props.file } id = { this.props.id } fileLink = { this.props.fileLink }/>
            )
          } else
              if (this.props.file.type.substring(0, 11) === 'application') {
                return (
                  <DocumentReader document = { this.props.file } id = { this.props.id }/>
                )
              }
  }
}

FileReader.PropTypes = {
  file: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  fileLink: PropTypes.string.isRequired,
}
