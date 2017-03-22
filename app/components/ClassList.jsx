import React from 'react';

import { Link, Router, browserHistory } from 'react-router'

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';
import Dialog from 'material-ui/Dialog';
export default class ClassList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      code: '',
      name: '',
    }
  }
  render(){
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <form className="form-horizontal">
          <div className="form-group">
            <label className="col-sm-3 control-label" >Mã lớp học</label>
            <div className="col-sm-9">
              <input type="text" className="form-control" value={this.state.code} onChange={({target}) => this.setState({code: target.value})}/></div>
          </div>
          <div className="form-group">
            <label className="col-sm-3 control-label" >Tên lớp học</label>
            <div className="col-sm-9">
              <button>Tiep tuc</button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}
