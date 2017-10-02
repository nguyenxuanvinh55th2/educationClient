import React from 'react';
import {AgGridReact} from 'ag-grid-react';
import { browserHistory } from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import __ from 'lodash';
import Popover from 'material-ui/Popover';
import QuillRender from '../editor/QuillRender.jsx';
import Cleave from 'cleave.js/react';
import moment from 'moment';
;
export class HanderEditorPost extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          open: false
      };
  }
  handleTouchTap(event){
      event.preventDefault();
      this.setState({
          openTouch: true,
          anchorEl: event.currentTarget,
      });
  }
  render(){
    let {node, showImage, showDescription, deletePost, updatePost} = this.props;
    let { openTouch, anchorEl } = this.state;
      return (
        <div style={{width: '100%'}}>
          <button className="btn btn-default buton-grid" style={{borderWidth: 0, width: 56, padding: '3px 6px',color:'red'}} onClick={() => deletePost(node)}>Xóa</button>
          <button className="btn btn-default buton-grid" style={{borderWidth: 0, borderLeftWidth: 1, width: 24}} onTouchTap={this.handleTouchTap.bind(this)}><span className="fa fa-ellipsis-v" aria-hidden="true"></span></button>
          <Popover
              open={openTouch}
              anchorEl={anchorEl}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'middle', vertical: 'top'}}
              onRequestClose={()=>this.setState({openTouch: false})}
          >
            <ul style={styles.list}>
              <li className="ag-action-item" style={styles.item} onClick={() => {this.setState({openTouch: false}); updatePost(node);}}>Cập nhật</li>
              <li style={styles.divider}></li>
              <li className="ag-action-item" style={styles.item} onClick={() => {this.setState({openTouch: false}); showDescription(node)}}>Mô tả</li>
              <li style={styles.divider}></li>
              <li className="ag-action-item" style={styles.item} onClick={() => {this.setState({openTouch: false}); showImage(node)}}>Hình ảnh</li>
              <li style={styles.divider}></li>
            </ul>
          </Popover>
      </div>);
  }
}
const styles = {
    list: {
        listStyle: 'none',
        margin: 0,
        padding: '5px 0'
    },
    item: {
        padding: '1px 10px'
    },
    divider:{
        backgroundColor: '#ededed',
        margin: '4px 1px',
        height: 1
    }
};
export class RenderImage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {image: props.image}
  }
  render(){
    return(
      <div className="modal-dialog modal-lg" style={{width: 'auto', margin: 0}}>
          <div className="modal-content">
              <div className="modal-header">
                  <h4 className="modal-title">Quản lý files</h4>
              </div>
              <div className="modal-body" style={{height: this.props.heigh, overflowY: 'auto', overflowX: 'hidden'}}>
                <img src={this.state.image.file} style={{width: '100%', height: this.props.height - 20, padding:0}}/>
              </div>
              <div className="modal-footer" style={{margin: 0}}>
                  <button type="button" className="btn btn-default" onClick={() => this.props.handleClose()}>Thoát</button>
              </div>
          </div>
      </div>
    )
  }
}

export class RenderDescription extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    return(
      <div className="modal-dialog" style={{width: 'auto', margin: 0}}>
          <div className="modal-content">
              <div className="modal-header">
                  <h4 className="modal-title">Mô tả</h4>
              </div>
              <div className="modal-body" style={{height: this.props.height, overflowY: 'auto', overflowX: 'hidden'}}>
                <QuillRender value={this.props.description}/>
              </div>
              <div className="modal-footer" style={{margin: 0}}>
                  <button type="button" className="btn btn-default" onClick={() => this.props.handleClose()}>Thoát</button>
              </div>
          </div>
      </div>
    )
  }
}
