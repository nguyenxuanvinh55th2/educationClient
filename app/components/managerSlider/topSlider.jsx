import React from 'react';
import {AgGridReact} from 'ag-grid-react';
import {browserHistory} from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Dropzone from 'react-dropzone';
import __ from 'lodash';

import Popover from 'material-ui/Popover';
import CircularProgress from 'material-ui/CircularProgress';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/theme-fresh.css';
import Select, {Creatable} from 'react-select';
import Dialog from 'material-ui/Dialog';

const style = {
  marginRight: 20,
};

class ImageRender extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
        if(this.props.data.gridType === 'footer') {
            return(
                <div></div>
            )
        } else {
            return (
              <div id={"image" + this.props.data._id}
                style={{padding:0, backgroundImage: 'url("' + this.props.data.image.file + '")', backgroundPosition: 'center center', backgroundSize: '120% auto', width: '120%', height: 60, marginLeft: -5}}>
              </div>
            )
        }
    }
}

class topSlider extends React.Component {
  constructor(props) {
    super(props)
    this.data = [];
    this.state = {
      height: window.innerHeight,
      image: null,
      name: '',
      title: '',
      description: '',
      type: 'top',
      _id: '',
      isShow: true,
      openReview: false
    }
    this.gridOptions = {
          columnDefs: [{
              headerName: '', name: 'option', pinned: 'left', width: 60, suppressNavigable: true,
              cellClass: 'agaction',
              suppressMenu: true, suppressFilter: true, suppressSizeToFit: true,
              cellRendererFramework: GridActions,
              cellRendererParams: {props: props, addNotification: props.addNotification, EditInfo: this.editInfo.bind(this), RemoveEmp: this.removeRow.bind(this)},
              cellStyle: function(params) {
                      if (params.node.data.gridType == 'footer') {
                          //mark police cells as red
                          return {display: 'none'};
                      } else {
                          return null;
                      }
                  },
          },
          {
              cellRendererFramework: ImageRender, headerName: "", field: "image", cellClass: 'agaction',
              minWidth: 60, width: 60, maxWidth: 60, editable: false, suppressMenu: true,
          },
          {
              headerName: 'Tên', field: 'name', suppressMenu: true, filter: 'text', width: 245, minWidth: 245,
              filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']},
              cellStyle: function(params) {
                      if (params.node.data.gridType == 'footer') {
                          //mark police cells as red
                          return {fontWeight: 'bold'};
                      } else {
                          return null;
                      }
                  },
          },{
              headerName: 'Tiêu đề', field: 'title', suppressMenu: true, filter: 'text', width: 250, minWidth: 250,
              filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']},
              cellStyle: function(params) {
                return {whiteSpace: 'normal', overflowY: 'auto', overflowX: 'hidden'};
              },
          },{
              headerName: 'Mô tả', field: 'description', suppressMenu: true, filter: 'text', width: 300, minWidth: 300,
              filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']},
              cellStyle: function(params) {
                return {whiteSpace: 'normal', overflowY: 'auto', overflowX: 'hidden'};
              },
          },{
              headerName: 'Loại', field: 'type', suppressMenu: true, filter: 'text',
              filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']},
          },{
              headerName: 'Điều hướng', field: 'link', suppressMenu: true, filter: 'text',
              filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']},
          },{
              headerName: 'Trạng thái', field: 'isShow', suppressMenu: true, filter: 'text', minWidth: 100, width: 100, maxWidth: 100,
              filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']},
          }],
          floatingFilter: true,
          showToolPanel: false,
          onFilterChanged: () => {
              if(this.gridOptions.api){
                this.gridOptions.api.setFloatingBottomRowData(this.renderFooterData());
              }
              this.saveFilter = this.gridOptions.api.getFilterModel();
          },
          getRowHeight: function(params) {
              if (params.node.floating) {
                  return 25;
              } else {
                  return 60;
              }
          }
      };
  }

  handleResize(e) {
      this.setState({height: window.innerHeight});
  }

  setStateToDefault() {
    this.setState({
      height: window.innerHeight,
      image: null,
      name: '',
      title: '',
      description: '',
      type: 'top',
      _id: '',
      isShow: true,
      link: ''
    })
  }

  componentDidUpdate() {
      if(this.gridOptions.api) {
        this.gridOptions.api.setFloatingBottomRowData(this.renderFooterData());
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
            totalAmount += tran.amount;
        });
    }

    let { priceTypes } = this.props.data;
    return [{
        gridType: 'footer',
        option: '',
        name: 'Total: ' +  totalStt,
    }];
  }

  editInfo(data) {
    this.setState({
      image: data.image,
      name: data.name,
      title: data.title,
      description: data.description,
      type: data.type,
      _id: data._id,
      isShow: data.isShow,
      link: data.link
    })
  }

  componentDidMount() {
      window.addEventListener('resize', this.handleResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  onDropAccepted(acceptedFiles,event) {
    let that = this;
    if(acceptedFiles.length){
      __.forEach(acceptedFiles,(file,idx) =>{
        if(file.size <= 1024*1000*2){
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function (e) {
              if(e.target.result){
                that.setState({
                  image: {
                    file:e.target.result,
                    fileName: file.name,
                    type: file.type
                  },
                });
              }
          };
          reader.onerror = function (error) {
            console.log('Error: ', error);
          };
        }
      });
    }
  }

  onDropRejected(rejectedFiles){
    if(rejectedFiles.length && rejectedFiles[0].size > 1024*1000*2){
      alert('File nhỏ hơn 2MB!');
    }
  }

  insertNew() {
    let info = this.state;
    let _id = this.state._id;
    let name = this.state.name
    delete info._id;
    delete info.height;
    info = JSON.stringify(info);
    this.props.insertOrUpdateSlider(Meteor.userId(), _id , info).then(() => {
      this.props.data.refetch();
      this.setStateToDefault();
      this.props.addNotificationMute({fetchData: true, message: 'Lưu slider thành công', level: 'success'});
      if(!_id) {
        Meteor.call('sendNotification', {
          note: Meteor.user().username + ' ' + 'tạo slider ' + name,
          isManage: true
        }, (err, res) => {
          if (err) {
            alert(err);
          } else {
            // success
          }
        });
      } else {
          Meteor.call('sendNotification', {
            note: Meteor.user().username + ' ' + 'sửa slider ' + name,
            isManage: true
          }, (err, res) => {
            if (err) {
              alert(err);
            } else {
              // success
            }
          });
      }
    }).catch(err => {
      console.log("err ", err);
    })
  }

  removeRow(_id, name) {
    var remove = confirm('Bạn có thực sự muốn xóa');
    if (remove) {
      this.props.removeSlider(Meteor.userId(), _id).then(() => {
        this.props.data.refetch();
        this.props.addNotificationMute({fetchData: true, message: 'Xóa slider thành công', level: 'success'});
        Meteor.call('sendNotification', {
          note: Meteor.user().username + ' ' + 'xóa slider ' + name,
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

  render() {
    let {height, image, name, title, description, type, _id, isShow, link} = this.state;
    if(this.props.data.loading) {
      return (
        <div className="loading item">
            <i className="fa fa-spinner fa-spin" style={{fontSize: 20}}></i>
        </div>
      )
    } else {
        let sliders = __.cloneDeep(this.props.data.sliders);
        __.forEach(sliders, item => {
          item.type = (item.type === 'top' ? 'Tin tức & sự kiện, khuyến mãi' : 'Đối tác kinh doanh');
          item.isShow = (item.isShow ? 'hiện' : 'ẩn');
        })
        return (
            <div className="column">
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
                <ol className="breadcrumb" style={{
                  marginBottom: 0,
                  backgroundColor: 'white'
                }}>
                  <li>
                    <a onClick={() => browserHistory.push('/dashboard')}>Dashboard</a>
                  </li>
                  <li>
                    <a onClick={() => browserHistory.push('/topSlider')}>Slider</a>
                  </li>
                </ol>
              </div>
              <div className="row" style={{
                padding: 10,
                backgroundColor: "rgb(204, 204, 204)",
                margin: '5px 0px 0px 0px'
              }}>
                <div className="col-sm-12 col-md-4" style={{
                  paddingRight: 0
                }}>
                  <div className="column" style={{
                    backgroundColor: 'white',
                    height: this.state.height - 152,
                    overflow: 'auto'
                  }}>
                    <form className="form-horizontal" style={{
                      padding: '2px 25px 2px 25px'
                    }}>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        marginTop: 5
                      }}>
                        <button type="button" className="btn btn-primary" disabled={!image || !name || !title} style={{
                          marginLeft: 10
                        }} onClick={this.insertNew.bind(this)}>Lưu</button>
                        <button type="button" className="btn btn-danger" style={{
                          margin: '0 10px'
                        }} onClick={this.setStateToDefault.bind(this)}>Hủy</button>
                      </div>

                      <div className="form-group">
                        <label>Tên(*)
                        </label>
                        <input type="text" value={name} className="form-control" placeholder="Nhập tên" onChange={({target}) => {
                          this.setState({name: target.value});
                        }}/>
                      </div>
                      <div className="form-group">
                        <label>Tiêu đề(*)
                        </label>
                        <input type="text" value={title} className="form-control" placeholder="Nhập tiêu đề" onChange={({target}) => {
                          this.setState({title: target.value});
                        }}/>
                      </div>
                      <div className="form-group">
                        <label>Mô tả
                        </label>
                        <input type="text" value={description} className="form-control" placeholder="Nhập mô tả" onChange={({target}) => {
                          this.setState({description: target.value});
                        }}/>
                      </div>
                      <div className={type ? "form-group" : "form-group has-error"} >
                        <label>
                          Loại
                        </label>
                        <select value={this.state.type} className="form-control custom" style={{width: '100%'}} onChange={({target}) => {
                            this.setState({type: target.value});
                          }}>
                          <option value="top">Tin tức & sự kiện, khuyến mãi</option>
                          <option value="bottom">Đối tác kinh doanh</option>
                        </select>
                      </div>
                      <div className="form-group" >
                        <label>
                          Điều hướng
                        </label>
                        {
                          type === 'bottom' ?
                          <input type="text" value={link} className="form-control" placeholder="Nhập điều hướng" onChange={({target}) => {
                            this.setState({link: target.value});
                          }}/> :
                          <Select multi={false} value={this.state.link} valueKey="_id" labelKey="title" placeholder="Chọn tin tức" options={this.props.data.posts} onChange={(value) => {
                            if(value) {
                              this.setState({link: value});
                            }
                          }}/>
                        }
                      </div>
                      <div className={type ? "form-group" : "form-group has-error"}>
                        <label>
                          Hiển thị
                        </label>
                        &nbsp;
                        {
                          isShow ?
                          <input key="on" type="checkbox" checked onChange={() => {
                              let isShow = !this.state.isShow;
                              this.setState({isShow});
                            }}/>:
                          <input key="off" type="checkbox" onChange={() => {
                              let isShow = !this.state.isShow;
                              this.setState({isShow});
                            }}/>
                        }
                      </div>
                      {/*<div className="form-group">
                        <label>Trạng thái(*)
                        </label>
                        <input type="text" value={description} className="form-control" placeholder="Nhập mô tả" onChange={({target}) => {
                          this.setState({description: target.value});
                        }}/>
                      </div>*/}
                      <div className="form-group">
                        <label>Hình ảnh(*)
                        </label>
                        <div style={{display: 'flex', flexDirection:'row', height:'auto', flexWrap: 'wrap', justifyContent: 'flex-start', width: '80%' }}>
                          <div style={{flexDirection:'column', margin:5}}>
                            <Dropzone style={{padding: 22, textAlign:'center', width: 150, height:120, border: '5px dashed #DDD', background: '#F8F8F8'}} onDropAccepted={this.onDropAccepted.bind(this)} onDropRejected={this.onDropRejected.bind(this)} accept="image/*" minSize={0} maxSize={1024*2*1000} multiple={false}>
                              <div>Kéo thả hoặc chọn ảnh</div>
                            </Dropzone>
                          </div>
                          {
                            this.state.image &&
                            <div style={{flexDirection:'column', margin:5,backgroundColor:'rgba(0, 0, 0, 0.4)',width: 150,height:120}}>
                              <img src={this.state.image ? this.state.image.file : ''} style={{width: '100%', height: 90, padding:0}}/>
                              <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', color:'rgb(255, 255, 255)'}} >
                                <h5 style={{overflow:'hidden',textOverflow:'ellipsis', width: 120, whiteSpace: 'nowrap'}}>{this.state.image ? this.state.image.fileName : ''}</h5>
                                <button type="button" className="btn btn-lg"
                                  style={{minWidth: '30px', minHeight: '35px', height: '35px',
                                    margin: 0, boxShadow:'none', background:'none', padding: 0}}
                                    onClick={() => {
                                      var deleteImage = confirm("Bạn có muốn xóa ảnh này?");
                                      if (deleteImage == true) {
                                        this.setState({image: null});
                                      }
                                    }}>
                                    <span className="glyphicon glyphicon-remove"></span>&nbsp;
                                </button>
                              </div>
                            </div>
                          }
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="col-sm-12 col-md-8" style={{
                  paddingRight: 0
                }}>
                  <div style={{height: this.state.height - 152}} className="ag-fresh">
                    <AgGridReact
                        gridOptions={this.gridOptions}
                        rowData={sliders}
                        enableColResize="true"
                        enableSorting="true"
                        onCellClicked={(params) => {
                          if(params.colDef.field === 'image') {
                            this.setState({selectImage: params.data.image.file, openReview: true});
                          }
                        }}
                    />
                  </div>
                </div>
              </div>
              <Dialog modal={true}
                open={this.state.openReview}
                contentStyle={{width: 600}}
                bodyStyle={{padding: 0}}
                >
                  <div className="modal-dialog" style={{width: 'auto', margin: 0}}>
                    <div className="modal-content" style={{border: 0}}>
                      <div className="modal-header">
                        <h4 className="modal-title">Xem hình ảnh</h4>
                      </div>
                      <div className="modal-body" style={{height: window.innerHeight - 300, overflowX: 'auto', overflowY: 'hidden', padding: 0,  display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'black'}}>
                        <img src={this.state.selectImage} style={{width: '100%', maxHeight: '100%'}}/>
                      </div>
                      <div className="modal-footer" style={{margin: 0}}>
                        <button type="button" className="btn btn-default" onClick={() => this.setState({openReview: false})}>Hủy</button>
                      </div>
                    </div>
                  </div>
                </Dialog>
            </div>
        );
      }
  }
}

class GridActions extends React.Component{
    constructor(props){
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
    ViewLink(data){
        prompt("Link to view", location.host+"/studentInfo/"+data._id);
        this.setState({open: false})
    }
    render(){
        let { data, props, EditInfo, RemoveEmp } = this.props;
        let { open, anchorEl } = this.state;
        return (<div style={{width: '100%'}}>
            <button className="btn btn-default" style={{borderWidth: 0, padding: '3px 6px', width: 35, height: 50}} onTouchTap={()=>EditInfo(data)}>Sửa </button>
            <button className="btn btn-default" style={{borderWidth: 0, borderLeftWidth: 1, width: 24, padding: '3px 6px', height: 50}} onTouchTap={this.handleTouchTap.bind(this)}><span className="fa fa-ellipsis-v" aria-hidden="true"></span></button>
            <Popover
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'middle', vertical: 'top'}}
                onRequestClose={()=>this.setState({open: false})}
            >
                <ul style={styles.list}>
                    <li className="ag-action-item" style={styles.item} onClick={() => RemoveEmp(data._id, data.name)}>Xóa</li>
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


const SLIDER_QUERY = gql `
    query sliders($query: String) {
        sliders {
          _id
          name
          title
          description
          image {
            _id
            file
          }
          type
          createdAt
          createdBy {
            _id
            username
          }
          link
          isShow
        }
        posts(query: $query) {
          _id title slug
        }
}`

const REMOVE = gql`
    mutation removeSlider($userId: String!, $_id: String){
        removeSlider(userId: $userId, _id: $_id)
}`

const INSERT_OR_UPDATE = gql`
    mutation insertOrUpdateSlider($userId: String!, $_id: String, $info: String){
        insertOrUpdateSlider(userId: $userId, _id: $_id, info: $info)
}`

export default compose(
  graphql(SLIDER_QUERY, {
    options: () => ({
      variables: {query: JSON.stringify({active: true})},
      fetchPolicy: 'network-only'
    })
  }),
  graphql(REMOVE, {
      props:({mutate})=>({
          removeSlider : (userId, _id) => mutate({variables:{userId, _id}})
      })
  }),
  graphql(INSERT_OR_UPDATE, {
      props:({mutate})=>({
          insertOrUpdateSlider : (userId, _id, info) => mutate({variables:{userId, _id, info}})
      })
  })
)(topSlider);
