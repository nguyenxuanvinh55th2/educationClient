import React from 'react';
import {AgGridReact} from 'ag-grid-react';
import { browserHistory } from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Dialog from 'material-ui/Dialog';
import accounting from 'accounting';
import __ from 'lodash'
import {HanderEditor} from './ChildTour.jsx';
import moment from 'moment';
class ListTours extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: window.innerHeight,
      open: false,
      name: '',
      dialogType: '',
      stockModelSelect: {}
    }
    this.gridOptions = {
    floatingFilter: true,
    onFilterChanged: () => {
        let data = [], models = this.gridOptions.api.getModel().rowsToDisplay;
        __.forEach(models, (model) => {
            data.push(model.data);
        });
        this.gridOptions.api.setFloatingBottomRowData(this.renderFooterData(data));
        this.saveFilter = this.gridOptions.api.getFilterModel();
      }
    };
  }
  renderFooterData(data) {
  return [
    {
      gridType: 'footer',
      code: 'Total: ' +  data.length,
    }];
  }
  componentDidUpdate() {
    if (this.gridOptions.api) {
      this.gridOptions.api.showLoadingOverlay();
      this.gridOptions.api.setRowData(__.map(__.cloneDeep(this.props.data.tours), (tour) => {
        tour.regionString = __.map(tour.regions, (re) => re.name);
        tour.holidayDestinationsString = __.map(tour.holidayDestinations, (re) => re.name);
        return tour;
      }));
      this.gridOptions.api.setFloatingBottomRowData(this.renderFooterData(this.props.data.tours));
      this.gridOptions.api.hideOverlay();
    }
  }
  deleteStockModel(node){
    var deleteImage = confirm("Bạn có muốn kiểu hàng này?");
    if (deleteImage == true) {
      Tours.update({_id: node.data._id},{$set: {active: false}},(error) => {
        if(error){
          throw error;
           this.props.addNotificationMute({fetchData: true, message: 'Xóa hàng thất bại', level:'error'});
        }
        else {
          this.props.addNotificationMute({fetchData: true, message: 'Xóa hàng thành công', level:'success'});
          this.props.data.refetch();
        }
      });
    }
  }
  updateTour(node){
    browserHistory.push(`/tourForm/${node.data._id}`);
  }
  deleteTour(node){
    var deleteImage = confirm("Bạn có muốn tour này?");
    if (deleteImage == true) {
      Tours.update({_id: node.data._id},{$set: {active: false}},(error) => {
        if(error){
          throw error;
           this.props.addNotificationMute({fetchData: true, message: 'Xóa thất bại', level:'error'});
        }
        else {
          this.props.addNotificationMute({fetchData: true, message: 'Xóa thành công', level:'success'});
          this.props.data.refetch();
        }
      });
    }
  }
  render(){
    if(!this.props.data.tours){
      return (
        <div className="loading">
            <i className="fa fa-spinner fa-spin" style={{fontSize: 50}}></i>
        </div>
      )
    }
    else {
      let columnDefs = [
        {
          headerName: "", field: 'delete',  minWidth: 80, width: 80,  pinned: 'left', filter: '',
          cellRendererFramework: HanderEditor ,
          cellRendererParams: {
            updateTour: this.updateTour.bind(this), deleteTour: this.deleteTour.bind(this)
            },
          cellStyle: (params) => {
            if (params.node.data.gridType == 'footer') {
              return {display: 'none'};
            }
          }
        },
        {
          headerName: "Mã tour",  field: "code", pinned: 'left',  width: 150, filter: 'text', filterParams: {
            filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']
          },   suppressMenu: true,
          cellStyle: function(params) {
            if (params.node.data.gridType == 'footer') {
              return {fontWeight: 'bold'};
            } else {
              return null;
            }
          }
        },
        {
          headerName: "Tên tour",  field: "name", width: 150, filter: 'text', filterParams: {
          filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']
          },   suppressMenu: true,
          cellStyle: function(params) {
            if (params.node.data.gridType == 'footer') {
              return {fontWeight: 'bold'};
            } else {
              return null;
            }
          }
        },
        {
          headerName: "Loại hình tour",  field: "type.name", width: 150, filter: 'text', filterParams: {
          filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']
          },   suppressMenu: true,
          cellStyle: function(params) {
            if (params.node.data.gridType == 'footer') {
              return {fontWeight: 'bold'};
            } else {
              return null;
            }
          }
        },
        {
          headerName: "Vùng miền",  field: "regionString", width: 150, filter: 'text', filterParams: {
          filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']
          },   suppressMenu: true,
          cellStyle: function(params) {
            if (params.node.data.gridType == 'footer') {
              return {fontWeight: 'bold'};
            } else {
              return null;
            }
          },
          cellRenderer: (params)=> {
            return params.value ? params.value.toString(): '';
          }
        },
        {
          headerName: "Địa điểm",  field: "holidayDestinationsString", width: 150, filter: 'text', filterParams: {
          filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']
          },   suppressMenu: true,
          cellStyle: function(params) {
            if (params.node.data.gridType == 'footer') {
              return {fontWeight: 'bold'};
            } else {
              return null;
            }
          },
          cellRenderer: (params)=> {
            return params.value ? params.value.toString(): '';
          }
        },
        {
          headerName: "Slug",  field: "slug", width: 150, filter: 'text', filterParams: {
            filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']
          },   suppressMenu: true,
          cellStyle: function(params) {
            if (params.node.data.gridType == 'footer') {
              return {fontWeight: 'bold'};
            } else {
              return null;
            }
          }
        },
        {
          headerName: "Nội dung(CEO)",  field: "ceoContent", width: 150, filter: 'text', filterParams: {
            filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']
          },   suppressMenu: true,
          cellStyle: function(params) {
            if (params.node.data.gridType == 'footer') {
              return {fontWeight: 'bold'};
            } else {
              return null;
            }
          }
        },
        {
          headerName: "Số lần truy cập",  field: "countAccess", width: 150, filter: 'text', filterParams: {
            filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']
          },   suppressMenu: true,
          cellStyle: function(params) {
            if (params.node.data.gridType == 'footer') {
              return {fontWeight: 'bold'};
            } else {
              return null;
            }
          }
        },
    {
      headerName: "Tour đang hot",  field: "isSohot", width: 150, filter: 'text', filterParams: {
        filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']
      },   suppressMenu: true,
      cellStyle: function(params) {
        if (params.node.data.gridType == 'footer') {
          return {fontWeight: 'bold'};
        } else {
          return null;
        }
      },
    },
    {
      headerName: "Book tour",  field: "isBooktour", width: 150, filter: 'text', filterParams: {
        filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']
      },   suppressMenu: true,
      cellStyle: function(params) {
        if (params.node.data.gridType == 'footer') {
          return {fontWeight: 'bold'};
        } else {
          return null;
        }
      },
    },
    {
      headerName: "Giá tour",  field: "price", width: 150, filter: 'text', filterParams: {
        filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']
      },   suppressMenu: true,
      cellStyle: function(params) {
        if (params.node.data.gridType == 'footer') {
          return {fontWeight: 'bold'};
        } else {
          return null;
        }
      },
    },
    {
      headerName: "Tour đang giảm giá",  field: "isPromotion", width: 150, filter: 'text', filterParams: {
        filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']
      },   suppressMenu: true,
      cellStyle: function(params) {
        if (params.node.data.gridType == 'footer') {
          return {fontWeight: 'bold'};
        } else {
          return null;
        }
      },
    },
    {
      headerName: "Giá giảm (VND)",  field: "saleOff", width: 150, filter: 'text', filterParams: {
        filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']
      },   suppressMenu: true,
      cellStyle: function(params) {
        if (params.node.data.gridType == 'footer') {
          return {fontWeight: 'bold'};
        } else {
          return null;
        }
      },
    },
    {
      headerName: 'Thời gian bắt đầu' ,field: 'startDate', width: 200, enableRowGroup: true,suppressSizeToFit: true, filter: 'date',
      filterParams: {
          comparator: (filterLocalDateAtMidnight, cellValue) => {
              if (cellValue) {
                  let dateParts = moment(cellValue).format('DD/MM/YYYY').split("/");
                  let day = Number(dateParts[2]);
                  let month = Number(dateParts[1]) - 1;
                  let year = Number(dateParts[0]);
                  let cellDate = new Date(day, month, year);
                  if (cellDate < filterLocalDateAtMidnight) {
                      return -1;
                  } else if (cellDate > filterLocalDateAtMidnight) {
                      return 1;
                  } else {
                      return 0;
                  }
              } else {
                  return -1;
              }
          }
        },
        cellStyle: (params) => {
            if (params.node.data.gridType == 'footer') {
                return {fontWeight: 'bold'};
            }
        },
        cellRendererFramework: (params) => {
          if (params.node.data.gridType == 'footer') {
            return (
              <div></div>
            )
          }
          else {
            return (
              <div>{moment(params.value).format('DD/MM/YYYY')}</div>
            )
          }
        }
    },
    {
      headerName: 'Thời gian kết thúc',field: 'endDate' , width: 200, enableRowGroup: true,suppressSizeToFit: true, filter: 'date',
      filterParams: {
          comparator: (filterLocalDateAtMidnight, cellValue) => {
              if (cellValue) {
                  let dateParts = moment(cellValue).format('DD/MM/YYYY').split("/");
                  let day = Number(dateParts[2]);
                  let month = Number(dateParts[1]) - 1;
                  let year = Number(dateParts[0]);
                  let cellDate = new Date(day, month, year);
                  if (cellDate < filterLocalDateAtMidnight) {
                      return -1;
                  } else if (cellDate > filterLocalDateAtMidnight) {
                      return 1;
                  } else {
                      return 0;
                  }
              } else {
                  return -1;
              }
          }
      },
      cellStyle: (params) => {
          if (params.node.data.gridType == 'footer') {
              return {fontWeight: 'bold'};
          }
      },
      cellRendererFramework: (params) => {
        if (params.node.data.gridType == 'footer') {
          return (
            <div></div>
          )
        }
        else {
          return (
            <div>{moment(params.value).format('DD/MM/YYYY')}</div>
          )
        }
      }
    },
      ];
      return(
        <div>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <ol className="breadcrumb" style={{marginBottom: 0, backgroundColor: 'white'}}>
              <li>
                <a onClick={() => browserHistory.push('/dashboard')}>Dashboard</a>
              </li>
              <li>
                <a onClick={() => browserHistory.push('/stockModels')}>Danh sách tour</a>
              </li>
            </ol>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5, marginRight: 10, paddingBottom: 10}}>
              <button type="button" className="btn btn-primary" onClick={() => browserHistory.push('/tourForm')}>Tạo mới</button>
            </div>
          </div>
          <div style={{  height: this.state.height - 136}} className="ag-fresh">
            <AgGridReact gridOptions={this.gridOptions} columnDefs={columnDefs} rowData={this.data} enableColResize="true" enableSorting="true" enableFilter="true"/>
          </div>
        </div>
      )
    }
  }
}
const TOUR_QUERY = gql `
    query tours($query: String,$limit: Int){
        tours(query: $query,limit: $limit) {
          _id code name slug ceoContent countAccess dateStart isSohot isPromotion isBooktour price saleOff
          startDate endDate
          type { _id code name } regions { _id code name} holidayDestinations { _id code name}
        }
}`

export default compose(graphql(TOUR_QUERY, {
  options: (ownProps) => {
    let query = {};
    query = {
      active: true,
      isChildrent: true
    };
    return {
      variables: {
        query: JSON.stringify(query)
      },
      fetchPolicy: 'network-only'
    }
  }
}),)(ListTours);
