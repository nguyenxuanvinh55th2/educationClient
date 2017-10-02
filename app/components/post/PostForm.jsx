import React from 'react';
;
import {AgGridReact} from 'ag-grid-react';
import { browserHistory } from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Dialog from 'material-ui/Dialog';
import accounting from 'accounting';
import QuillEditorTour from '../editor/TourEditor.jsx';
import Select, {Creatable} from 'react-select';
import 'react-select/dist/react-select.css';
import __ from 'lodash';
import CustomDatePicker from '../tool/CustomDatePicker.jsx'
import moment from 'moment';
import {handleChangeSlug} from '../tool/slug.js'
class PostForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '', content: '', image: {}, ceoContent: '', height: window.innerHeight, slug: '', active: true,
      // time: {
      //   startDate: moment().startOf('day').valueOf(),
      //   endDate: moment().endOf('day').valueOf()
      // }
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.params._id && nextProps.data.post){
      let post = __.cloneDeep(nextProps.data.post);
      this.setState({
        title: post.title, content: post.content, image: post.image, ceoContent: post.ceoContent, slug: post.slug,
        // time: {
        //   startDate: post.startDate ? post.startDate : moment().startOf('day').valueOf(),
        //   endDate: post.endDate ? post.endDate : moment().endOf('day').valueOf()
        // }
      })
    }
  }
  bpmChangeRange(value){
    this.setState({time: value})
  }
  handleAddImage(files){
    let that = this;
    if(files[0]){
      let file = files[0];
      if(file.size <= 1024*1000*2){
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            if(e.target.result){
              that.setState({image:{
                file:e.target.result,
                fileName: file.name,
                type: file.type
              }});
            }
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
      }
      else {
        alert('File nhỏ hơn 2MB!');
      }
    }
  }
  handleSave(type){
    // console.log(this.state.time);
    let info = {
      data: {
         content: this.state.content, ceoContent: this.state.ceoContent,
         active: this.state.active, title: this.state.title, isEvent: this.props.isEvent ? this.props.isEvent : false,
         isPromotion: this.props.isPromotion ? this.props.isPromotion : false, slug: this.state.slug,
         isNew: this.props.isNew ? this.props.isNew : false
      },
      image: this.state.image
    }
    if(this.props.params._id){
      if(this.props.updatePost){
        this.props.updatePost(Meteor.userId(),this.props.params._id, JSON.stringify(info)).then(({data}) => {
          this.props.addNotificationMute({fetchData: true, message: 'Cập nhật thành công', level: 'success'});
          browserHistory.push(this.props.isEvent ?  '/newEvent' : this.props.isNew ? '/newStand' : '/promotion');
        })
        .catch((error) => {
          console.log(error);
          this.props.addNotificationMute({fetchData: true, message: 'Cập nhật thất bại', level: 'error'});
        })
      }
    }
    else {
      if(this.props.insertPost){
        this.props.insertPost(Meteor.userId(), JSON.stringify(info)).then(({data}) => {
          if(data.insertPost){
            if(type){
              this.setState({
                title: '', content: '', image: {}, ceoContent: '', slug: '', active: true,
              })
              if(document.getElementById('editor') && document.getElementById('editor').firstChild){
                document.getElementById('editor').firstChild.innerHTML =''
              }
              this.props.addNotificationMute({fetchData: true, message: 'Thêm bài dăng thành công', level: 'success'});
            }
            else {
              browserHistory.push(this.props.isEvent ?  '/newEvent' : this.props.isNew ? '/newStand' : '/promotion');
            }
          }
        })
        .catch((error) =>  {
          console.log(error);
          this.props.addNotificationMute({fetchData: true, message: 'Thêm bài dăng thất bại', level: 'error'});
        })
      }
    }
  }
  render(){
    if(this.props.data.loading){
      return (
        <div className="loading">
          <i className="fa fa-spinner fa-spin" style={{
            fontSize: 50
          }}></i>
        </div>
      )
    }
    else {
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
                <a onClick={() => browserHistory.push(this.props.isEvent ?  '/newEvent' : this.props.isNew ? '/newStand' : '/promotion')}>Đăng bài</a>
              </li>
            </ol>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: 5
            }}>
            {
              !this.props.params._id &&
              <button type="button" className="btn btn-primary" disabled={!this.state.title ||  !this.state.content || !this.state.ceoContent} onClick={() => this.handleSave(true)}>Lưu và khởi tạo</button>
            }
              <button type="button" className="btn btn-primary" disabled={!this.state.title || !this.state.content || !this.state.ceoContent} style={{
                marginLeft: 10
              }} onClick={() => {
                this.handleSave()
              }}>Lưu</button>
              <button type="button" className="btn btn-danger" style={{
                margin: '0 10px'
              }} onClick={() => browserHistory.push(this.props.isEvent ?  '/newEvent' : this.props.isNew ? '/newStand' : '/promotion')}>Hủy</button>
            </div>
          </div>
          <div className="row" style={{
            padding: 10,
            backgroundColor: "rgb(204, 204, 204)",
            margin: '5px 0px 0px 0px'
          }}>
          <div className="col-sm-12 col-md-4 col-lg-3" style={{
            paddingRight: 0, paddingLeft: 2
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
                <label>Tiêu đề (*)</label>
                <input type="text" className="form-control" value={this.state.title} onChange={({target}) => {
                  this.setState((prevState) => {
                    prevState.title = target.value;
                    prevState.slug = handleChangeSlug(target.value);
                    return prevState;
                  });
                }}/>
              </div>
              <div className="form-group">
                <label>Slug(*)</label>
                <input type="text" className="form-control" disabled={true} value={this.state.slug} onChange={({target}) => {
                  this.setState((prevState) => {
                    return prevState;
                  });
                }}/>
              </div>
              {/* <div className="form-group">
                <label>Khoảng thời gian dự kiến</label>
                <CustomDatePicker bpm={this.state.time} bpmChangeRange={this.bpmChangeRange.bind(this)} handleChange={() => {}}/>
              </div> */}
              <div className="form-group">
                <label>Mô tả(CEO *)</label>
                <textarea rows="2" type="text" className="form-control" value={this.state.ceoContent} onChange={({target}) => {
                  this.setState((prevState) => {
                    prevState.ceoContent = target.value;
                    return prevState;
                  });
                }}/>
              </div>
              <div className="form-group" style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start'
              }}>
                <div className="checkbox" style={{
                  width: '50%'
                }}>
                  <label><input type="checkbox" checked={this.state.active} onChange={({target}) => {
                    this.setState((prevState) => {
                      prevState.active = !prevState.active;
                      return prevState;
                    });
                  }}/>{this.state.active ? 'Hiện thị ngay' : 'Lưu bản nháp'}</label>
                </div>
              </div>
              <div className="form-group" style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start'
              }}>
              </div>
              <div className="form-group">
                <label>Ảnh tiêu đề(*)</label>
                <input type="file" id="getDataImageProfile" accept="image/*" multiple={false} onChange={({target}) => this.handleAddImage(target.files)} />
              </div>
              {
                this.state.image && this.state.image.file &&
                <img src={this.state.image.file} style={{height: 120, width: 250}}/>
              }
            </form>
            </div>
          </div>
          <div className="col-sm-12 col-md-8 col-lg-9" style={{paddingRight: 2}}>
            <div className="column" style={{
              backgroundColor: 'white',
              height: this.state.height - 152,
              overflow: 'auto'
            }}>
              <form style={{
                padding: '2px 25px 2px 25px'
              }}>
                <div className="form-group">
                  <label>Nội dung(*)</label>
                  <QuillEditorTour height={window.innerHeight - 280} value={this.state.content} getValue={(value) => {
                    this.setState((prevState) => {
                      prevState.content = value;
                      return prevState;
                    });
                  }}/>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      )
    }
  }
}

const INSERT_POST = gql `
    mutation insertPost($userId: String!, $info: String!){
        insertPost(userId: $userId, info: $info)
}`
const UPDATE_POST = gql`
  mutation updatePost($userId: String,$_id:String,$info:String){
    updatePost(userId: $userId,_id:$_id,info:$info)
  }
`;
const STOCK_TYPE = gql `
    query post($_id: String){
        post(_id: $_id) {
        _id title  ceoContent content slug
        image {
          _id  file fileName
        }
      }
}`
export default compose(graphql(STOCK_TYPE, {
  options: (ownProps) => ({
    variables: {
      _id: ownProps.params._id ? ownProps.params._id : ''
    },
    fetchPolicy: 'network-only'
  })
}), graphql(INSERT_POST, {
  props: ({mutate}) => ({
    insertPost: (userId, info) => mutate({
      variables: {
        userId,
        info
      }
    })
  })
}),
graphql(UPDATE_POST,{
    props:({mutate})=>({
    updatePost : (userId,_id,info) =>mutate({variables:{userId,_id,info}})
  })
}),
)(PostForm);
