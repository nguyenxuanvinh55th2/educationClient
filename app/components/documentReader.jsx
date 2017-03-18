//import { Meteor } from 'metor/meteor'
import React, { PropTypes, Component, ReactDom } from 'react';
import ReactGridLayout from 'react-grid-layout'

import { Grid, Col, Row, Button, Form, FormControl, FormGroup, ButtonGroup, Overlay, Popover, Modal, ButtonToolbar, ControlLabel } from 'react-bootstrap'


export default class DocumentReader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{minWidth: '400px'}}>
        <ButtonGroup>
          <Button bsStyle="default" target="_blank">
            { this.props.document.name }
          </Button>
          <Button bsStyle="default" target="_blank">
            Tải về
          </Button>
        </ButtonGroup>
      </div>
    )
  }
}

DocumentReader.PropTypes = {
  document: PropTypes.object.isRequired,
}
