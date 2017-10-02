import React from 'react';
import {AgGridReact} from 'ag-grid-react';
import {Meteor} from 'meteor/meteor';
import { createContainer } from 'react-meteor-data';
import __ from 'lodash';
import Dialog from 'material-ui/Dialog';
import {browserHistory} from 'react-router';
import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import CustomDatePicker from '../tool/CustomDatePicker.jsx';

class DataGrid extends React.Component {
  constructor(props){
    super(props);
    this.state = {refetch: false};
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
      this.gridOptions.api.setFloatingBottomRowData(this.renderFooterData(this.gridOptions));
    }
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
        note: 'Total: ' +  totalStt,
        option: ''
    }];
  }

  render() {
    return (
      <AgGridReact
          gridOptions={this.gridOptions}
          columnDefs={this.props.columnDefs}
          rowData={__.cloneDeep(this.props.data)}
          enableColResize="true"
          enableSorting="true"
          enableFilter="true"
          onCellClicked={(params) => {
            Notifications.update({_id: params.data._id}, {
              $set: {
                isRead: true
            }});
            browserHistory.push(params.data.link);
          }}
      />
    )
  }
}

const DataGridLeft = createContainer((ownProps) => {
  Meteor.subscribe("notifications", false);
  let toId = Meteor.userId();
  return {
    data: Notifications.find({isManage: {$ne: true}}, {sort: {createdAt: -1}}).fetch()
  }
}, DataGrid);

const DataGridRight = createContainer((ownProps) => {
  Meteor.subscribe("notificationsManage", true, ownProps.dateStart, ownProps.dateEnd);
  let toId = Meteor.userId();
  return {
    data: Notifications.find({
      $and: [
          {createdAt: {$gte: ownProps.dateStart}},
          {createdAt: {$lte: ownProps.dateEnd}}
      ],
      isManage: true,
    }, {sort: {createdAt: -1}}).fetch()
  }
}, DataGrid);

class Bell extends React.Component {
  render() {
    let { data } = this.props;
    return (
      <div style={{width: '100%'}}>
        <i className="fa fa-bell" aria-hidden="true" style={{color: !data.isRead ? 'red' : 'gray', fontSize: 14, margin: '5px 5px'}}></i>
      </div>
    );
  }
}

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
  render() {
    let { removeRow } = this.props;
    return (
      <div style={{width: '100%'}}>
        <button className="btn btn-primary" disabled={this.props.data.status === 100} style={{margin: 0, width: '100%'}} onClick={() => removeRow(this.props.data._id)}>Xóa</button>
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

class Dashboard extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        height: window.innerHeight,
        data: {
          startDate: moment().startOf('month').valueOf(),
          endDate: moment().endOf('month').valueOf()
        },
        refetch: false
      };
  }

  handleResize(e) {
      this.setState({height: window.innerHeight});
  }

  componentDidMount() {
      window.addEventListener('resize', this.handleResize.bind(this));
      this.setState({refetch: false});
  }

  componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize.bind(this));
  }

  bpmChangeRange(value){
    this.setState((prevState) => {
      prevState.data.startDate = value.startDate;
      prevState.data.endDate = value.endDate;
      return prevState;
    })
  }

  removeRow(_id) {
    var remove = confirm('Bạn có thực sự muốn xóa');
    if (remove) {
      Notifications.remove({_id}, (err) => {
        if(err) {
            console.log("err ", err);
        } else {
            this.props.addNotificationMute({fetchData: true, message: 'Xóa thành công', level: 'success'});
        }
      });
    }
  }

  render() {
      let { teamBuildings } = this.props;
      let {data} = this.state;
      if (Meteor.userId()) {
          if (!this.props.accessCount || !this.props.regions) {
              return (
                  <div className="spinner spinner-lg"></div>
              );
          } else {
              let time = {
                startDate: data.startDate ? data.startDate : moment().startOf('month').valueOf(),
                endDate: data.endDate ? data.endDate : moment().endOf('month').valueOf()
              }
              let columnDefs= [
                  {
                    headerName: '', field:'option', minWidth: 50, width: 50, maxWidth: 50, cellClass: 'agaction', pinned: 'left', filter: '',
                    cellRendererFramework: HanderEditor,
                    cellRendererParams: {removeRow: this.removeRow.bind(this)},
                    cellStyle: (params) => {
                      if (params.node.data.gridType == 'footer') {
                        return {display: 'none'};
                      }
                    },
                  },
                  {
                    headerName: '', field:'option', minWidth: 25, width: 25, maxWidth: 25, cellClass: 'agaction', pinned: 'left', filter: '',
                    cellRendererFramework: Bell,
                    cellStyle: (params) => {
                      if (params.node.data.gridType == 'footer') {
                        return {display: 'none'};
                      }
                    },
                  },
                  {
                      headerName: 'Thông báo', field: "note",
                      filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']}, width: 400, minWidth: 400, editable: false, filter: 'text'
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
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: this.state.height - 480}}>
                      <div style={{width: '50%', borderRight: '1px solid rgb(209, 209, 209)', padding: 10}}>
                        <p>{'Tổng lượt truy cập: ' + this.props.accessCount}</p>
                        {
                          this.props.regions.map((item, idx) => (
                            <p key={idx}>{'Số lượng truy cập ở ' + item.name + ': ' + item.accessToken.length}</p>
                          ))
                        }
                      </div>
                      <div style={{width: '50%'}}>
                      </div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                      <div style={{width: '50%'}}>
                          <div style={{height: this.state.height-291}} className="ag-fresh">
                            <DataGridLeft columnDefs={columnDefs} isManage={false}/>
                          </div>
                      </div>
                      <div style={{width: '50%'}}>
                          <div className="form-group" style={{margin: 0}}>
                            <CustomDatePicker bpm={time} bpmChangeRange={this.bpmChangeRange.bind(this)} handleChange={() => {}}/>
                          </div>
                          <div style={{height: this.state.height-325}} className="ag-fresh">
                            <DataGridRight columnDefs={__.filter(columnDefs, item => item.field !== 'option')} isManage={true} dateStart={time.startDate} dateEnd={time.endDate}/>
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
  Meteor.subscribe("settings");
  Meteor.subscribe("regions");
  let toId = Meteor.userId();
  let setting = Settings.findOne({_id: 'buildmodify'});
  return {
    accessCount: setting ? setting.accessCount : 0,
    regions: Regions.find({}).fetch()
  }
}, Dashboard);
