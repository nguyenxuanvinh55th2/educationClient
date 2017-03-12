//import { Meteor } from 'metor/meteor'
import React, { PropTypes, Component, ReactDom } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Grid, Col, Row, Button, Form, FormControl, FormGroup, Overlay, Popover, Modal, ButtonToolbar, ControlLabel } from 'react-bootstrap'

class BackgroundList extends Component {
  constructor(props) {
    super(props);
  }

  renderBackgroundList() {
    if(!this.props.data || this.props.data.loading) {
      return (
        <div className="loader"></div>
      )
    } else {
        return this.props.data.backgroundList.map ((item) => (
            <img key={ item._id } className="background-item" src = { 'http://localhost:3000/background/' + item.value } onClick={ e => { this.props.setBackgroundImage(item.value) }}/>
        ));
      }
  }

  render() {
    return (
      <div id="backgroundTool">
        <div id="backgroundList">
          {this.renderBackgroundList()}
        </div>
        <div>
          <span className="btn btn-default btn-file">
            Thêm Ảnh<input id="backgroundInput" type="file" onChange={ e => { this.props.setBackgroundForeign() } }/>
          </span>
        </div>
      </div>
    )
  }
}

BackgroundList.PropTypes = {
  data: PropTypes.object.isRequired,
  setBackgroundImage: PropTypes.func.isRequired,
  setBackgroundForeign: PropTypes.func.isRequired
}

const BACKGROUND_LIST = gql`
  query backgroundList {
    backgroundList {
      _id
      value
    },
  }`

const mapDataToProps = graphql(
  BACKGROUND_LIST
);

export default mapDataToProps(BackgroundList);
