import React from 'react';
import {AgGridReact} from 'ag-grid-react';
import { browserHistory } from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import __ from 'lodash';
import Popover from 'material-ui/Popover';
import Cleave from 'cleave.js/react';
import moment from 'moment';
;

export class HanderEditor extends React.Component {
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
    let {node, deleteTour, updateTour} = this.props;
    let { openTouch, anchorEl } = this.state;
      return (
        <div style={{width: '100%'}}>
          <button className="btn btn-default buton-grid" style={{borderWidth: 0, width: 56, padding: '3px 6px',color:'blue'}} onClick={() => {updateTour(node);}}>Sửa</button>
          <button className="btn btn-default buton-grid" style={{borderWidth: 0, borderLeftWidth: 1, width: 24}} onTouchTap={this.handleTouchTap.bind(this)}><span className="fa fa-ellipsis-v" aria-hidden="true"></span></button>
          <Popover
              open={openTouch}
              anchorEl={anchorEl}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'middle', vertical: 'top'}}
              onRequestClose={()=>this.setState({openTouch: false})}
          >
            <ul style={styles.list}>
              <li className="ag-action-item" style={styles.item} onClick={() => {this.setState({openTouch: false}); deleteTour(node);}}>Xóa tour</li>
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
