import React from 'react';
import {AgGridReact} from 'ag-grid-react';
import {Meteor} from 'meteor/meteor';
import {browserHistory} from 'react-router';
import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';
import Cleave from 'cleave.js/react';
import Dialog from 'material-ui/Dialog';
import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import Select, {Creatable} from 'react-select';
import 'react-select/dist/react-select.css';
import Dropzone from 'react-dropzone';
class  HanderEditor extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    let { node, removeClassify, updateClassify } = this.props;
    return (
      <div className="btn-group">
        <button type="button" className="btn btn-danger" onClick={()=> removeClassify(node.data._id)}>Xóa</button>
        <button type="button" className="btn btn-primary" onClick={() => updateClassify(node)}>Sửa</button>
      </div>
    )
  }
}
class Category extends React.Component {
  constructor(props) {
    super(props);
    this.handleResize = this.handleResize.bind(this);
    this.data = [];
    this.state = {
      height: window.innerHeight,
      data: {
        _id: '', code: '', name: '', slug: '', description: '', isDomestic: true, stockType: {}
      },
      openAdvance: false,
      isPopup: false, isFinding: false,
      image: {}
    }
    this.gridOptions = {
      floatingFilter: true,
      onFilterChanged: () => {
        let data = [],
          models = this.gridOptions.api.getModel().rowsToDisplay;
        __.forEach(models, (model) => {
          data.push(model.data);
        });
        this.gridOptions.api.setFloatingBottomRowData(this.renderFooterData(data));
        this.saveFilter = this.gridOptions.api.getFilterModel();
      }
    };
  }
  handleResize(e) {
    this.setState({height: window.innerHeight});
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  renderFooterData(data) {
    return [
      {
        gridType: 'footer',
        code: 'Total: ' + data.length
      }
    ];
  }
  handleChangeSlug(value){
    var title, slug;

    //Lấy text từ thẻ input title
    title = value;

    //Đổi chữ hoa thành chữ thường
    slug = title.toLowerCase();

    //Đổi ký tự có dấu thành không dấu
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');
    //Xóa các ký tự đặt biệt
    slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
    //Đổi khoảng trắng thành ký tự gạch ngang
    slug = slug.replace(/ /gi, "-");
    //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
    //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
    slug = slug.replace(/\-\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-/gi, '-');
    slug = slug.replace(/\-\-/gi, '-');
    //Xóa các ký tự gạch ngang ở đầu và cuối
    slug = '@' + slug + '@';
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');
    return slug;
  }
  refeshDataState(){
    this.setState((prevState) => {
      prevState.data = {
        _id: '', code: '', name: '', slug: '', description: '', stockType: {}, isDomestic: true
      };
      prevState.isPopup = false;
      prevState.isFinding = false;
      prevState.image = {};
      return prevState;
    });
    this.props.data.refetch();
  }
  handleSave(){
    if(this.state.data.code && this.state.data.name && this.state.data.slug){
      let info = {
        code: this.state.data.code,
        name: this.state.data.name,
        description: this.state.data.description,
        slug: this.state.data.slug,
        active: true,
        isPopup: this.state.isPopup,
        isFinding: this.state.isFinding,
        stockType: this.state.data.stockType,
        isDomestic: this.state.data.isDomestic
      }
      if(this.props.isTour){
        info.isTour = true;
      }
      else if (this.props.isRegion) {
        info.isRegion = true;
      }
      else if (this.props.isLocation) {
        info.isLocation = true;
      }
      else if (this.props.isTrip) {
        info.isTrip = true;
      }
      if(this.state.data._id){
        this.handleUpdate(this.state.data._id, info);
      }
      else {
        if(this.props.insertClassify){
          this.props.insertClassify(Meteor.userId(), JSON.stringify(info), JSON.stringify(this.state.image)).then(({data}) => {
            if(data){
              this.props.addNotificationMute({fetchData: true, message: 'Thêm thành công', level: 'success'});
              this.props.data.refetch();
              this.refeshDataState();
              Meteor.call('sendNotification', {
                note: Meteor.user().username + ' ' + 'thêm Category',
                isManage: true
              }, (err, res) => {
                if (err) {
                  alert(err);
                } else {
                  // success
                }
              });
            }
          })
          .catch((error) => {
            console.log(error);
            this.props.addNotificationMute({fetchData: true, message: 'Thêm thất bại', level: 'error'});
            this.refeshDataState();
          })
        }
      }
    }
  }
  componentWillReceiveProps(nextProps){
    let { data } = nextProps;
    if(this.gridOptions.api){
        if(data.loading){
          this.gridOptions.api.showLoadingOverlay();
        } else {
          this.gridOptions.api.hideOverlay();
        }
        if(data.classifies){
            this.data = __.cloneDeep(data.classifies);
            this.gridOptions.api.setRowData(this.data);
            this.gridOptions.api.setFloatingBottomRowData(this.renderFooterData(this.data));
        }
    }
  }
  handleUpdate(_id, info){
    if(this.props.updateClassify){
      this.props.updateClassify(Meteor.userId(), _id, JSON.stringify(info)).then(({data}) => {
        if(data){
          this.props.addNotificationMute({fetchData: true, message: 'Thành công', level: 'success'});
          this.props.data.refetch();
          this.refeshDataState();
        }
      })
      .catch((error) => {
        console.log(error);
        this.props.addNotificationMute({fetchData: true, message: 'Thất bại', level: 'error'});
        this.refeshDataState();
      })
    }
  }
  removeClassify(_id){
    var del = confirm("Bạn có muốn loại này?");
    if (del == true && _id) {
      this.handleUpdate(_id, {active: false})
    }
  }
  updateClassify(node){
    this.setState((prevState) => {
      prevState.data = node.data;
      prevState.isPopup = node.data.isPopup;
      prevState.isFinding = node.data.isFinding;
      prevState.image = node.data.image;
      prevState.data.stockType = node.data.stockType ? node.data.stockType : {};
      return prevState;
    })
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
  render() {
    let {data} = this.state;
    let columnDefs = [
      {
        headerName: "",
        field: 'delete',
        minWidth: 80,
        width: 80,
        cellClass: 'agaction',
        pinned: 'left',
        filter: '',
        cellRendererFramework: HanderEditor ,
        cellRendererParams: {
          removeClassify: this.removeClassify.bind(this), updateClassify: this.updateClassify.bind(this)
          },
        cellStyle: (params) => {
          if (params.node.data.gridType == 'footer') {
            return {display: 'none'};
          }
        },
      }, {
        headerName: "Mã",
        field: "code",
        width: 150,
        cellStyle: function(params) {
          if (params.node.data.gridType == 'footer') {
            return {fontWeight: 'bold'};
          } else {
            return null;
          }
        },
        filterParams: {
          filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']
        },
        filter: 'text',
        suppressMenu: true
      },
      {
        headerName: "Tên",
        field: "name",
        width: 150,
        cellStyle: function(params) {
          if (params.node.data.gridType == 'footer') {
            return {fontWeight: 'bold'};
          } else {
            return null;
          }
        },
        filterParams: {
          filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']
        },
        filter: 'text',
        suppressMenu: true
      },
      {
        headerName: "Slug",
        field: "slug",
        width: 200,
        cellStyle: function(params) {
          if (params.node.data.gridType == 'footer') {
            return {fontWeight: 'bold'};
          } else {
            return null;
          }
        },
        filterParams: {
          filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']
        },
        filter: 'text',
        suppressMenu: true
      },
      {
        headerName: "Mô tả",
        field: "description",
        width: 300,
        cellStyle: function(params) {
          if (params.node.data.gridType == 'footer') {
            return {fontWeight: 'bold'};
          } else {
            return null;
          }
        },
        filterParams: {
          filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']
        },
        filter: 'text',
        suppressMenu: true
      }
    ];
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
              <a onClick={() => browserHistory.push('/category')}>Loại hình</a>
            </li>
          </ol>
        </div>
        <div className="row" style={{
          padding: 10,
          backgroundColor: "rgb(204, 204, 204)",
          margin: '5px 0px 0px 0px'
        }}>
          <div className="col-sm-12 col-md-5" style={{
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
                <div className="form-group">
                  <label>Mã(*)
                  </label>
                  <input type="text" className="form-control" placeholder="Enter name" value={data.code} onChange={({target}) => {
                    this.setState((prevState) => {
                      prevState.data.code = target.value;
                      return prevState;
                    })
                  }}/>
                </div>
                <div className="form-group">
                  <label>Tên(*)
                  </label>
                  <input type="text" className="form-control" placeholder="Enter name" value={data.name} onChange={({target}) => {
                    this.setState((prevState) => {
                      prevState.data.name = target.value;
                      prevState.data.slug = this.handleChangeSlug(target.value);
                      return prevState;
                    })
                  }}/>
                </div>
                <div className="form-group">
                  <label>Slug(*)
                  </label>
                  <input type="text" disabled={true} className="form-control" placeholder="Enter slug" value={data.slug} onChange={({target}) => {
                    this.setState((prevState) => {
                      prevState.data.slug = target.value;
                      return prevState;
                    })
                  }}/>
                </div>
                {
                  this.props.isLocation ?
                  <div className="form-group">
                    <label>Chọn vùng miền
                    </label>
                    <Select name="parent-category" value={data.stockType._id
                      ? data.stockType._id
                      : ''} valueKey="_id" labelKey="name"
                       options={this.props.data.regionsClassSifies ? this.props.data.regionsClassSifies : []}
                        placeholder="Gõ để tìm vùng miền" onChange={(value) => {
                          if(value){
                            this.setState((prevState) => {
                              prevState.data.stockType = value;
                              return prevState;
                            })
                          }
                          else {
                            this.setState((prevState) => {
                              prevState.data.stockType = {};
                              return prevState;
                            })
                          }
                    }}/>
                  </div>
                  : null
                }
                <div className="form-group">
                  <label>Mô tả
                  </label>
                  <textarea cols="3" type="text" className="form-control" placeholder="Enter description" value={data.description} onChange={({target}) => {
                    this.setState((prevState) => {
                      prevState.data.description = target.value;
                      return prevState;
                    })
                  }}/>
                </div>
                {
                  this.props.isRegion ?
                  <div className="form-group" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start'
                  }}>
                    <div className="checkbox" style={{
                      width: '50%'
                    }}>
                      <label><input type="checkbox" checked={data.isDomestic} onChange={({target}) => {
                        this.setState((prevState) => {
                          prevState.data.isDomestic = !prevState.data.isDomestic;
                          return prevState;
                        });
                      }}/>{data.isDomestic ? 'Vùng trong nước' : 'Vùng nước ngoài'}</label>
                    </div>
                  </div>
                  : null
                }
                {
                  this.props.isTour ?
                  <div>
                    <a onClick={() => {
                      this.setState((prevState) => {
                        prevState.openAdvance = !this.state.openAdvance;
                        return prevState;
                      })
                    }}>Hiện thị nâng cao</a>
                    {
                      this.state.openAdvance ?
                      <div>
                        <div className="form-group" style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'flex-start'
                        }}>
                          {/* <div className="checkbox" style={{
                            width: '50%'
                          }}>
                            <label><input type="checkbox" checked={this.state.isPopup}  onChange={({target}) => {
                              this.setState((prevState) => {
                                prevState.isPopup = !this.state.isPopup;
                                return prevState;
                              });
                            }}/>Popup loại hình tour</label>
                          </div> */}
                          <div className="checkbox" style={{
                            width: '50%'
                          }}>
                            <label><input type="checkbox" checked={this.state.isFinding} onChange={({target}) => {
                              this.setState((prevState) => {
                                prevState.isFinding = !this.state.isFinding;
                                return prevState;
                              });
                            }}/>Đặt làm loại tour tìm kiếm</label>
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Hình ảnh
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
                      </div>
                      : null
                    }
                  </div>
                  : null
                }
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginTop: 5
                }}>
                  <button type="button" className="btn btn-primary" disabled={!data.code || !data.name || !data.slug || (this.props.isLocation && !this.state.data.stockType._id)} style={{
                    marginLeft: 10
                  }} onClick={() => {
                    this.handleSave()
                  }}>Lưu</button>
                  <button type="button" className="btn btn-danger" style={{
                    margin: '0 10px'
                  }} onClick={() => this.refeshDataState()}>Hủy</button>
                </div>
              </form>
            </div>
          </div>
          <div className="col-sm-12 col-md-7" style={{
            paddingRight: 0
          }}>
          <div style={{
            height: this.state.height - 152
          }} className="ag-fresh">
            <AgGridReact gridOptions={this.gridOptions} columnDefs={columnDefs} rowData={this.data} enableColResize="true" enableSorting="true" enableFilter="true"/>
          </div>
        </div>
        </div>
      </div>
    );
  }
}

const QUERY = gql `
    query classifies($query: String){
      classifies(query: $query) {
      _id code name slug description isPopup isFinding isDomestic
      stockType {_id code name slug}
      childrents {_id code name slug}
      image {
        _id  file fileName
      }
    }
    regionsClassSifies {
      _id code name slug
    }
}`

const INSERT_CLASSIFY = gql `
    mutation insertClassify($userId: String!, $info: String!, $image: String){
        insertClassify(userId: $userId, info: $info, image: $image)
}`
const UPDATE_CLASSIFY = gql `
    mutation updateClassify($userId: String!, $_id: String!, $info: String!, $image: String){
        updateClassify(userId: $userId, _id: $_id , info: $info, image: $image)
}`
export default compose(graphql(QUERY, {
  options: (ownProps) => {
    let query = {};
    if(ownProps.isTour){
      query = {
        active: true,
        isTour: true
      };
    }
    else if (ownProps.isLocation) {
      query = {
        active: true,
        isLocation: true
      };
    }
    else if (ownProps.isRegion) {
      query = {
        active: true,
        isRegion: true
      };
    }
    else if (ownProps.isTrip) {
      query = {
        active: true,
        isTrip: true
      }
    }
    else {
      query = {
        active: true
      };
    }
    return {
      variables: {
        query: JSON.stringify(query)
      },
      fetchPolicy: 'network-only'
    }
  },
}),
 graphql(INSERT_CLASSIFY, {
  props: ({mutate}) => ({
    insertClassify: (userId, info, image) => mutate({
      variables: {
        userId,
        info, image
      }
    })
  })
}),
 graphql(UPDATE_CLASSIFY, {
  props: ({mutate}) => ({
    updateClassify: (userId, _id, info, image) => mutate({
      variables: {
        userId,
        _id,
        info, image
      }
    })
  })
})
)(Category);
