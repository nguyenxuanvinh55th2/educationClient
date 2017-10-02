import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import __ from 'lodash';
import moment from 'moment';
import { browserHistory } from 'react-router';

import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import Popover from 'material-ui/Popover';
import { Print } from './printCustomer';

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

class Customer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {height: window.innerHeight, name: '', email: '', address: '', mobile: '', error: null, open: false};
        this.gridOptions = {
            doesDataFlower: () => {
                return true;
            },
            showToolPanel: false,
            onFilterChanged: () => {
                if (this.gridOptions && this.gridOptions.api) {
                    this.gridOptions.api.setFloatingBottomRowData(this.renderFooterData());
                }
            },
            floatingFilter: true,
            getContextMenuItems: (params) => {
                return [
                    {
                        name: 'Xuất Excel',
                        action: this.exportData.bind(this),
                        icon: '<i class="fa fa-file-excel-o" style="margin: 3px;"></i>'
                    }
                ];
            }
        };
    }

    componentDidUpdate() {
      if (this.gridOptions.api) {
        this.gridOptions.api.setFloatingBottomRowData(this.renderFooterData(this.props.data.invoices));
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
          this.props.data.refetch();
          this.props.addNotificationMute({fetchData: true, message: 'Xóa khách hàng thành công', level: 'success'});
          Meteor.call('sendNotification', {
            note: Meteor.user().username + ' ' + 'xóa khách hàng ' + name,
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
        this.props.data.refetch();
        this.props.addNotificationMute({fetchData: true, message: 'Duyệt khách hàng thành công', level: 'success'});
        Meteor.call('sendNotification', {
          note: Meteor.user().username + ' ' + 'duyệt khách hàng ' + name,
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

    saveCustomer() {
      let { name, email, address, mobile } = this.state;
      let customer = {
        status: 100,
        name,
        email,
        address,
        mobile
      }
      this.props.saveCustomer(Meteor.userId(), JSON.stringify(customer)).then(() => {
        this.props.data.refetch();
        this.setState({open: false, name: '', email: '', address: '', mobile: ''});
        this.props.addNotificationMute({fetchData: true, message: 'Thêm khách hàng thành công', level: 'success'});
        Meteor.call('sendNotification', {
          note: Meteor.user().username + ' ' + 'thêm khách hàng ' + name,
          isManage: true
        }, (err, res) => {
          if (err) {
            alert(err);
          } else {
            // success
          }
        });
      })
    }

    exportData(){
      if(this.gridOptions && this.gridOptions.api) {
        console.log("this.gridOptions.api ", this.gridOptions.api);
        this.gridOptions.api.exportDataAsExcel({
          fileName: 'Customer-'+moment().format('DD-MM-YYYY_HH:mm'),
          skipFooters: true,
          columnKeys: [
            'index', 'name', 'mobile', 'email'
          ]
        });
      }
    }

    print(data) {
      Print(data)
    }

    render() {
        let { data } = this.props;
        let { name, email, address, mobile, error } = this.state;
        let accountingObjects = __.cloneDeep(data.AccountingObjects);
        __.forEach(accountingObjects, (item, idx) => {
          item['index'] = idx + 1;
          item['createdAtFormat'] = moment(item.createdAt).valueOf();
        })
        if (Meteor.userId()) {
            if (data.loading) {
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
                      headerName: 'STT', field: "index", minWidth: 50, width: 50, maxWidth: 50,
                      filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']}, editable: false, filter: 'text'
                    },
                    {
                        headerName: 'Tên khách hàng', field: "name",
                        filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']}, width: 150, editable: true, filter: 'text'
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
                      headerName: 'Số  điện thoại', field: "mobile",
                      filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']}, width: 122, editable: true, filter: 'text'
                    },
                    {
                        headerName: 'Địa chỉ email', field: "email",
                        filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']}, width: this.state.width, editable: false, filter: 'text'
                    },
                ];
                return (
                    <div>
                      <div>
                          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f5f5f5'}}>
                              <ol className="breadcrumb" style={{
                                marginBottom: 0,
                                backgroundColor: 'transparent'
                              }}>
                                <li>
                                  <a onClick={() => browserHistory.push('/dashboard')}>Dashboard</a>
                                </li>
                                <li>
                                  <a onClick={() => browserHistory.push('/customer')}>Khách hàng</a>
                                </li>
                              </ol>
                              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', padding: 5}}>
                                <button className="btn btn-primary" onClick={() => this.setState({open: true})}>
                                  Thêm mới
                                </button>
                                <div style={{width: 10}}>
                                </div>
                                <button className="btn btn-primary" onClick={this.print.bind(this, accountingObjects)}>
                                  In
                                </button>
                                <div style={{width: 10}}>
                                </div>
                                <button className="btn btn-primary" onClick={this.exportData.bind(this)}>
                                  Xuất file excel
                                </button>
                              </div>
                          </div>
                          <div style={{height: this.state.height-135}} className="ag-fresh">
                              <AgGridReact
                                  gridOptions={this.gridOptions}
                                  columnDefs={columnDefs}
                                  rowData={accountingObjects}
                                  enableColResize="true"
                                  enableSorting="true"
                                  enableFilter="true"
                                  onCellValueChanged = {(params) => {
                                    let info = JSON.stringify({
                                        name: params.data.name,
                                        mobile: params.data.mobile,
                                        email: params.data.email
                                    })
                                    this.props.updateTeamBuilding(Meteor.userId(), params.data._id, info).catch((error) => {
                                        console.log('there was an error sending the query', error);
                                    });
                                  }}
                              />
                          </div>
                          <Dialog
                              modal={true}
                              open={this.state.open}
                              contentStyle={{width: 600}}
                              bodyStyle={{padding: 0}}>
                              <div className="modal-dialog" style={{width: 'auto', margin: 0}}>
                                  <div className="modal-content" style={{boxShadow: 'none', border: 'none'}}>
                                      <div className="modal-header">
                                          <h4 className="modal-title">Thêm khách hàng</h4>
                                      </div>
                                      <div className="modal-body" style={{overflowY: 'auto', overflowX: 'hidden'}}>
                                          {error?
                                              <div className="alert alert-danger">
                                                  <span className="pficon pficon-error-circle-o"></span>
                                                  <strong>{error}</strong>
                                              </div>
                                          :null}
                                          <form className="form-horizontal">
                                              <div className={name?"form-group":"form-group has-error"}>
                                                  <label className="col-sm-4 control-label">Tên khách hàng</label>
                                                  <div className="col-sm-8">
                                                      <input type="text" className="form-control" value={name} onChange={({target}) => this.setState({name: target.value})} />
                                                  </div>
                                              </div>
                                              <div className={email?"form-group":"form-group has-error"}>
                                                  <label className="col-sm-4 control-label">Email</label>
                                                  <div className="col-sm-8">
                                                      <input type="email" className="form-control" value={email} onChange={({target}) => this.setState({email: target.value})} />
                                                  </div>
                                              </div>
                                              <div className={address?"form-group":"form-group has-error"}>
                                                  <label className="col-sm-4 control-label">Địa chỉ</label>
                                                  <div className="col-sm-8">
                                                      <input type="text" className="form-control" value={address} onChange={({target}) => this.setState({address: target.value})} />
                                                  </div>
                                              </div>
                                              <div className={mobile?"form-group":"form-group has-error"}>
                                                  <label className="col-sm-4 control-label">Số điện thoại</label>
                                                  <div className="col-sm-8">
                                                      <input type="text" className="form-control" value={mobile} onChange={({target}) => this.setState({mobile: target.value})} />
                                                  </div>
                                              </div>
                                          </form>
                                      </div>
                                      <div className="modal-footer">
                                          <button type="button" className="btn btn-default" onClick={()=>this.setState({open: false, name: '', email: '', address: '', mobile: ''})}>Thoát</button>
                                          <button type="button" disabled={error || !name || !email || !address || !mobile} onTouchTap={this.saveCustomer.bind(this)} className="btn btn-primary">Thêm</button>
                                      </div>
                                  </div>
                              </div>
                          </Dialog>
                      </div>
                    </div>
                )
            }
        } else {
            return <div style={{textAlign: 'center'}}>Bạn cần đăng nhập để xem thông tin này</div>;
        }
    }
}

const TEAM_BUILDING_QUERY = gql`
    query AccountingObjects($type: String){
        AccountingObjects(type: $type){
          _id
          name
          status
          address
          mobile
          email
          feedBack
          createdAt
          verifyAt
          verifyBy {
            _id
            username
          }
        }
}`

const VERIFY = gql`
    mutation verifyAccountingObject($userId: String, $_id: String){
      verifyAccountingObject(userId: $userId, _id: $_id)
}`

const REMOVE = gql`
    mutation removeAccountingObject($userId: String, $_id: String){
        removeAccountingObject(userId: $userId, _id: $_id)
}`

const UPDATE = gql`
    mutation updateAccountingObject($userId: String, $_id: String, $info: String){
        updateAccountingObject(userId: $userId, _id: $_id, info: $info)
}`

const SAVE_CUSTOMER = gql`
    mutation saveCustomer($userId: String, $info: String){
        saveCustomer(userId: $userId, info: $info)
}`

export default compose (
    graphql(TEAM_BUILDING_QUERY, {
        options: ()=> ({
            variables: {type: 'isRegister'},
            fetchPolicy: 'network-only'
        })
    }),
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
    graphql(UPDATE, {
        props:({mutate})=>({
            updateTeamBuilding : (userId, _id, info) => mutate({variables:{userId, _id, info}})
        })
    }),
    graphql(SAVE_CUSTOMER, {
        props:({mutate})=>({
            saveCustomer : (userId, info) => mutate({variables:{userId, info}})
        })
    }),
)(Customer);
