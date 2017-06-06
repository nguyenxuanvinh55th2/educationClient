import React from 'react';

import { Link, Router, browserHistory } from 'react-router'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {AgGridReact} from 'ag-grid-react';
import Dropzone from 'react-dropzone';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Dialog from 'material-ui/Dialog';
import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';

export class GiveAssignment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      file: {}
    }
  }
  onDropAccepted(acceptedFiles,event) {
    console.log(acceptedFiles);
    let that = this;
    if(acceptedFiles.length){
      let file = acceptedFiles[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (e) {
          if(e.target.result){
            that.setState({file:{
              file:e.target.result,
              fileName: file.name,
              type: file.type
            }});
          }
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    }
  }
  onDropRejected(rejectedFiles){
    if(rejectedFiles.length && rejectedFiles[0].size > 1024*1000*2){
      alert('File nhỏ hơn 2MB!');
    }
  }
  render(){
    return (
      <div className="modal-dialog" style={{width: 'auto', margin: 0}}>
          <div className="modal-content">
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f5f5f5', borderBottom: 'none', padding: '10px 18px'}}>
              <h4 className="modal-title">Nộp bài tập: {this.props.topicSelected ? this.props.topicSelected.title : ''} - {this.props.topicSelected.owner ? this.props.topicSelected.owner.name : ''} </h4>
              <span className="close" onClick={() => this.setState({openGiveAdd: false})}>&times;</span>
            </div>
            <div className="modal-body" style={{maxHeight:window.innerHeight - 300, overflowY: 'auto', overflowX: 'hidden'}}>
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                <Dropzone onDropAccepted={this.onDropAccepted} onDropRejected={this.onDropRejected} multiple={false} style={{height: 140, border: '1px solid gray', borderRadius: 10, padding: '13px 7px', width: 350}} minSize={0} maxSize={1024*20*1000} multiple={false} >
                  <div style={{textAlign: 'center'}}>Click or Drap here to upload file</div>
                </Dropzone>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" onClick={() => this.props.handleClose()}>Đóng</button>
              <button type="button" className="btn btn-primary">Nộp</button>
            </div>
          </div>
      </div>
    )
  }
}