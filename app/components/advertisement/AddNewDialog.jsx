import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import __ from 'lodash';

import Dropzone from 'react-dropzone';

class AddNew extends React.Component {
  constructor(props) {
    super(props);
    if(props.type === 'update') {
      this.state = props.updateItem;
    } else {
        this.state = {image: null, name: '', type: 'popup', _id: '', isShow: false, time: 5}
    }
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
    delete info._id;
    info = JSON.stringify(info);
    this.props.insertOrUpdateAdvertise(Meteor.userId(), _id , info).then(() => {
      this.props.handleClose();
      this.props.refetch();
      this.props.addNotificationMute({fetchData: true, message: 'Lưu quảng cáo thành công', level: 'success'});
      if(!_id) {
        Meteor.call('sendNotification', {
          note: Meteor.user().username + ' ' + 'tạo quảng cáo ' + this.state.name,
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
            note: Meteor.user().username + ' ' + 'sửa quảng cáo ' + this.state.name,
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

  render() {
    let { name, type, isShow, time } = this.state;
    let { height } = this.props;
    return (
      <div>
          <div className="modal-dialog" style={{width: 'auto', margin: 0}}>
              <div className="modal-content" style={{border: 0}}>
                  <div className="modal-header">
                      <h4 className="modal-title">Thêm quảng cáo</h4>
                  </div>
                  <div className="modal-body" style={{height: height, overflowY: 'auto', overflowX: 'hidden'}}>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                      <div style={{width: '100%'}}>
                        <div className={name ? "form-group" : "form-group has-error"} style={{width: '100%', margin: 0, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                          <label style={{width: '20%', paddingLeft: 0, textAlign: 'right', paddingRight: 10}}>
                            Tên
                          </label>
                          <div style={{width: '80%'}}>
                            <input type="text" className="form-control" value={name} style={{width: '100%'}} placeholder={'Nhập tên quảng cáo'} onChange={({target}) => {
                              this.setState({name: target.value});
                            }}/>
                            <span style={{height: 25, margin: 0}} className="help-block">
                            {
                              !name && 'Tên quảng cáo là bắt buộc'
                            }
                            </span>
                          </div>
                        </div>
                        <div className={type ? "form-group" : "form-group has-error"} style={{width: '100%', margin: '0px 0px 15px 0px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                          <label style={{width: '20%', paddingLeft: 0, textAlign: 'right', paddingRight: 10}}>
                            Loại
                          </label>
                          <select value={this.state.type} className="form-control custom" style={{width: '80%'}} onChange={({target}) => {
                              this.setState({type: target.value});
                            }}>
                            <option value="popup">Pop up quảng cáo</option>
                            <option value="header">Slider quảng cáo</option>
                          </select>
                        </div>
                        {
                          type === 'popup' &&
                          <div className={time ? "form-group" : "form-group has-error"} style={{width: '100%', margin: 0, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                            <label style={{width: '20%', paddingLeft: 0, textAlign: 'right', paddingRight: 10}}>
                              Thời gian (s)
                            </label>
                            <div style={{width: '80%'}}>
                              <input type="number" className="form-control" value={time} style={{width: '100%'}} placeholder={'Nhập thời gian hiển thị'} onChange={({target}) => {
                                this.setState({time: parseInt(target.value)});
                              }}/>
                              <span style={{height: 25, margin: 0}} className="help-block">
                                {
                                  !time && 'Thời gian hiển thị là bắt buộc'
                                }
                              </span>
                            </div>
                          </div>
                        }
                        <div className={type ? "form-group" : "form-group has-error"} style={{width: '100%', margin: '0px 0px 15px 0px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                          <label style={{width: '20%', paddingLeft: 0, textAlign: 'right', paddingRight: 10}}>
                            Hiển thị
                          </label>
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
                        <div className={type ? "form-group" : "form-group has-error"} style={{width: '100%', margin: '0px 0px 15px 0px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                          <label style={{width: '20%', paddingLeft: 0, textAlign: 'right', paddingRight: 10}}>
                            Hình ảnh
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
                    </div>
                  </div>
                  <div className="modal-footer" style={{margin: 0}}>
                      <button type="button" className="btn btn-default" onClick={() => this.props.handleClose()}>Hủy</button>
                      <button type="button" className="btn btn-primary" onClick={() => this.insertNew()} disabled={!(this.state.name && this.state.type && this.state.image)}>Lưu</button>
                  </div>
              </div>
          </div>
        </div>
      )
  }
}


const INSERT_OR_UPDATE = gql`
    mutation insertOrUpdateAdvertise($userId: String!, $_id: String, $info: String){
        insertOrUpdateAdvertise(userId: $userId, _id: $_id, info: $info)
}`

export default compose (
    graphql(INSERT_OR_UPDATE, {
        props:({mutate})=>({
            insertOrUpdateAdvertise : (userId, _id, info) => mutate({variables:{userId, _id, info}})
        })
    })
)(AddNew);
