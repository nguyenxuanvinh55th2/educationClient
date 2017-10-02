import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import __ from 'lodash';
import moment from 'moment';
import { createContainer } from 'react-meteor-data';
import { browserHistory } from 'react-router';

import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import Popover from 'material-ui/Popover';

class HanderEditor extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          open: false
      };
  }
  handleTouchTap(event){
      event.preventDefault();
      this.setState({
          open: true,
          anchorEl: event.currentTarget,
      });
  }
  render(){
    let { removeRow, verifyRow } = this.props;
      let { open, anchorEl } = this.state;
      return (
        <div style={{width: '100%'}}>
          <button className="btn btn-primary" disabled={this.props.data.status === 100} style={{margin: '-6px 5px 0px 0px'}} onClick={() => verifyRow(Meteor.userId(), this.props.data._id, this.props.data.name)}>Duyệt</button>
          <i className="fa fa-ellipsis-v" aria-hidden="true"
              style={{fontSize: 17, margin: 4, cursor: 'pointer'}}
              onClick={this.handleTouchTap.bind(this)}></i>
          <Popover
              open={open}
              anchorEl={anchorEl}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={()=>this.setState({open: false})}
          >
            <ul style={styles.list}>
                <li className="ag-action-item" style={styles.item} onClick={() => {this.setState({open: false}); removeRow(Meteor.userId(), this.props.data._id, this.props.data.name);}}>Xóa</li>
            </ul>
          </Popover>
      </div>
    );
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

class TeamBuilding extends React.Component {
    constructor(props) {
        super(props);
        this.state = {height: props.height};
        this.gridOptions = {
            doesDataFlower: () => {
                return true;
            },
            onFilterChanged: () => {
                if (this.gridOptions && this.gridOptions.api) {
                    this.gridOptions.api.setFloatingBottomRowData(this.renderFooterData());
                }
            },
            floatingFilter: true
        };
    }

    componentDidUpdate() {
      if (this.gridOptions.api) {
        this.gridOptions.api.setFloatingBottomRowData(this.renderFooterData(this.props.teamBuildings));
      }
    }

    handleResize(e) {
        this.setState({height: window.innerHeight});
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize.bind(this));
        this.setState({refetch: false});
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
    }

    renderFooterData() {
      let totalAmount = 0, totalStt = 0;

      if (this.gridOptions && this.gridOptions.api) {
          let data = [], models;
          models = this.gridOptions.api.getModel().rowsToDisplay;
          __.forEach(models, (model) => {
              data.push(model.data);
          });
          __.forEach(data, (tran)=>{
              totalStt++;
          });
      }

      return [{
          gridType: 'footer',
          contact: 'Total: ' +  totalStt,
          option: ''
      }];
    }

    removeRow(userId, _id, name) {
      var remove = confirm('Bạn có thực sự muốn xóa');
      if (remove) {
        this.props.removeTeamBuilding(userId, _id).then(() => {
          this.props.addNotificationMute({fetchData: true, message: 'Xóa thành công', level: 'success'});
          Meteor.call('sendNotification', {
            note: Meteor.user().username + ' ' + 'xóa team building của khách hàng ' + name,
            isManage: true
          }, (err, res) => {
            if (err) {
              alert(err);
            } else {
              // success
            }
          });
        });
      }
    }

    verifyRow(userId, _id, name) {
      this.props.verifyTeamBuilding(userId, _id).then(() => {
        this.props.addNotificationMute({fetchData: true, message: 'Duyệt thành công', level: 'success'});
        Meteor.call('sendNotification', {
          note: Meteor.user().username + ' ' + 'duyệt team building của khách hàng ' + name,
          isManage: true
        }, (err, res) => {
          if (err) {
            alert(err);
          } else {
            // success
          }
        });
      });
    }

    render() {
        let { height } = this.props;
        let teamBuildings = __.cloneDeep(this.props.teamBuildings);
        __.forEach(teamBuildings, (item, idx) => {
          item.index = idx + 1;
        })
        if (Meteor.userId()) {
            if (!teamBuildings) {
                return (
                    <div className="spinner spinner-lg"></div>
                );
            } else {
                let columnDefs= [
                    {
                      headerName: 'STT', field: "index",
                      filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']}, width: 75, minWidth:75, maxWidth: 75, editable: false, filter: 'text'
                    },
                    {
                        headerName: 'Thông tin liên lạc', field: "contact",
                        filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']}, width: 150, editable: false, filter: 'text'
                    },
                    {
                        headerName: 'Ngày tạo', field: "createdAt",
                        filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']}, width: 127, editable: false, filter: 'text',
                        cellRenderer: (params)=> {
                          if (params.node.data.gridType == 'footer') {
                            return ''
                          } else {
                              return moment(params.value).format('DD/MM/YYYY HH:mm')
                          }
                        },
                    }
                ];
                return (
                    <div>
                      <div className="modal-dialog" style={{width: 'auto', margin: 0}}>
                          <div className="modal-content" style={{border: 0}}>
                              <div className="modal-header">
                                  <h4 className="modal-title">Danh sách khách hàng</h4>
                              </div>
                              <div className="modal-body" style={{height: height, overflowY: 'auto', overflowX: 'hidden', padding: 0}}>
                                <div style={{height: height}} className="ag-fresh">
                                    <AgGridReact
                                        gridOptions={this.gridOptions}
                                        columnDefs={columnDefs}
                                        rowData={__.cloneDeep(teamBuildings)}
                                        enableColResize="true"
                                        enableSorting="true"
                                        enableFilter="true"
                                    />
                                </div>
                              </div>
                              <div className="modal-footer" style={{margin: 0}}>
                                <button type="button" className="btn btn-default" onClick={() => this.props.handleClose()}>Hủy</button>
                              </div>
                          </div>
                      </div>
                    </div>
                )
            }
        } else {
            return <div style={{textAlign: 'center'}}>Bạn cần đăng nhập để xem thông tin này</div>;
        }
    }
}

export default createContainer((ownProps) => {
  Meteor.subscribe('advertisements');
  console.log("ownProps.updateItem._id ", ownProps.updateItem._id);
  let advertise = Advertisements.findOne({_id: ownProps.updateItem._id});
  return {
    teamBuildings: (advertise && advertise.customers) ? advertise.customers.sort((a,b) => {
      return (b.createdAt - a.createdAt);
    }) : []
  }
}, TeamBuilding);
