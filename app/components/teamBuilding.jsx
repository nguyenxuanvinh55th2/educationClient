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
        this.state = {height: window.innerHeight};
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
          name: 'Total: ' +  totalStt,
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
        let { teamBuildings } = this.props;
        if (Meteor.userId()) {
            if (!teamBuildings) {
                return (
                    <div className="spinner spinner-lg"></div>
                );
            } else {
                let columnDefs= [
                    {
                      headerName: '', field:'option', minWidth: 75, width: 75, maxWidth: 75, cellClass: 'agaction', pinned: 'left', filter: '',
                      cellRendererFramework: HanderEditor,
                      cellRendererParams: {removeRow: this.removeRow.bind(this), verifyRow: this.verifyRow.bind(this)},
                      cellStyle: (params) => {
                          if (params.node.data.gridType == 'footer') {
                              return {display: 'none'};
                          }
                      },
                    },
                    {
                        headerName: 'Tên khách hàng', field: "name",
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
                    },
                    {
                        headerName: 'Địa điểm', field: "place",
                        filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']}, width: 132, editable: false, filter: 'text'
                    },
                    {
                        headerName: 'Số người', field: "peopleCount",
                        filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']}, width: 100, editable: false, filter: 'text'
                    },
                    {
                        headerName: 'Ngày bắt đầu', field: "dateStart",
                        filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']}, width: 127, editable: false, filter: 'text'
                    },
                    {
                        headerName: 'Ngày kết thúc', field: "dateEnd",
                        filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']}, width: 127, editable: false, filter: 'text'
                    },
                    {
                        headerName: 'Địa chỉ', field: "address",
                        filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']}, width: this.state.width, editable: false, filter: 'text'
                    },
                    {
                        headerName: 'Số sao khách sạn', field: "hotelStar",
                        filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']}, width: 152, editable: false, filter: 'text'
                    },
                    {
                        headerName: 'Số điện thoại', field: "mobile",
                        filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']}, width: 123, editable: false, filter: 'text'
                    },
                    {
                        headerName: 'Địa chỉ email', field: "email",
                        filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']}, width: this.state.width, editable: false, filter: 'text'
                    },
                    {
                        headerName: 'Trạng thái', field: "status",
                        filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']}, width: 104, editable: false, filter: 'text',
                        cellRenderer: (params)=> {
                          if (params.node.data.gridType == 'footer') {
                            return ''
                          } else {
                              if(params.value === 0) {
                                return 'Đang xử  lý';
                              } else
                                  if(params.value === 100) {
                                    return 'Đã duyệt';
                                  }
                          }
                        },
                    },
                    {
                        headerName: 'Ngày duyệt', field: "verifyAt",
                        filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']}, width: 135, editable: false, filter: 'text',
                        cellRenderer: (params)=> {
                          if (params.node.data.gridType == 'footer') {
                            return ''
                          } else {
                              return params.value ? moment(params.value).format('DD/MM/YYYY HH:mm') : ''
                          }
                        },
                    },
                    {
                        headerName: 'Người duyệt', field: "verifyBy.username",
                        filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']}, width: 120, editable: false, filter: 'text',
                    },
                ];
                return (
                    <div>
                      <div>
                          <div style={{height: 36, display: 'flex', flexDirection: 'row', backgroundColor: '#f5f5f5', border: '1px solid #d1d1d1', borderBottom: 'none', padding: 5, position: 'relative', justifyContent: 'space-between'}}>
                              <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                              }}>
                                <ol className="breadcrumb" style={{
                                  marginBottom: 0,
                                  backgroundColor: 'transparent'
                                }}>
                                  <li>
                                    <a onClick={() => browserHistory.push('/dashboard')}>Dashboard</a>
                                  </li>
                                  <li>
                                    <a onClick={() => browserHistory.push('/teamBuilding')}>Team building</a>
                                  </li>
                                </ol>
                              </div>
                              <div>
                                  <i className="fa fa-refresh" aria-hidden="true" style={{fontSize: 22, cursor: 'pointer'}}
                                      onClick={() => this.RefreshData()}></i>
                              </div>
                          </div>
                          <div style={{height: this.state.height-130}} className="ag-fresh">
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
                    </div>
                )
            }
        } else {
            return <div style={{textAlign: 'center'}}>Bạn cần đăng nhập để xem thông tin này</div>;
        }
    }
}

const VERIFY = gql`
    mutation verifyTeamBuilding($userId: String, $_id: String){
      verifyTeamBuilding(userId: $userId, _id: $_id)
}`

const REMOVE = gql`
    mutation removeTeamBuilding($userId: String, $_id: String){
        removeTeamBuilding(userId: $userId, _id: $_id)
}`

const TeamBuildingWithData = compose (
    graphql(VERIFY, {
        props:({mutate})=>({
            verifyTeamBuilding : (userId, _id) => mutate({variables:{userId, _id}})
        })
    }),
    graphql(REMOVE, {
        props:({mutate})=>({
            removeTeamBuilding : (userId, _id) => mutate({variables:{userId, _id}})
        })
    }),
)(TeamBuilding);

export default createContainer((ownProps) => {
  Meteor.subscribe('teamBuilding');
  return {
    teamBuildings: TeamBuildings.find({}, {sort: {createdAt: -1}}).fetch()
  }
}, TeamBuildingWithData);
