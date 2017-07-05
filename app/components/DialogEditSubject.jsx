import React from 'react';

import { Link, Router, browserHistory } from 'react-router'

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';

class EditThemeForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {
        _id: props.dataTheme._id,
        theme: props.dataTheme.theme,
        topic: {
          _id: props.dataTheme.topic ? props.dataTheme.topic._id : '',
          content: props.dataTheme.topic ? props.dataTheme.topic.content : '',
          files: props.dataTheme.topic ? props.dataTheme.topic.files : ''
        }
      }
    }
  }
  componentWillReceiveProps(nextProps){
    this.setState({data: __.cloneDeep(nextProps.dataTheme)})
  }
  handleSave(){
    if(this.props.updateEditThem){
      this.props.updateEditThem(localStorage.getItem(this.props.loginToken),JSON.stringify(this.state.data)).then(({data}) => {
        this.props.addNotificationMute({fetchData: true, message: 'Thành công', level:'success'});
        this.props.refreshData();
        this.props.handleClose();
      })
      .catch((error) => {
        console.log(error);
        this.props.addNotificationMute({fetchData: true, message: 'Faild', level:'error'});
      })
    }
  }
  render(){
    return (
      <div className="modal-dialog" style={{width: 'auto', margin: 0}}>
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Chỉnh sửa bài giảng</h4>
            </div>
            <div className="modal-body" style={{overflowY: 'auto', overflowX: 'hidden', overflowY: 'auto', overflowX: 'hidden'}}>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <form className="form-horizontal">
                  <div className="form-group">
                    <label className="control-label col-sm-2">Tên chủ đề</label>
                    <div className="col-sm-10">
                      <input type="text" className="form-control" value={this.state.data.theme && this.state.data.theme.name ? this.state.data.theme.name : ''} placeholder="Tên chủ đề" onChange={({target}) => {
                        this.setState((prevState) => {
                          prevState.data.theme.name = target.value;
                          return prevState;
                        });
                      }}/>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="control-label col-sm-2">Nội dung</label>
                    <div className="col-sm-10">
                      <textarea rows="2" className="form-control" value={this.state.data.topic && this.state.data.topic.content ?  this.state.data.topic.content : ''} placeholder="Thêm nội dung chủ đề" onChange={({target}) => {
                        this.setState((prevState) => {
                          prevState.data.topic.content = target.value;
                          return prevState;
                        });
                      }}/>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" onClick={() => this.props.handleClose()}>Đóng</button>
              <button type="button" className="btn btn-primary" onClick={() => this.handleSave()}>Lưu</button>
            </div>
          </div>
      </div>
    )
  }
}
const UPDATE_THEME = gql`
 mutation updateEditThem($token: String,$info: String){
   updateEditThem(token: $token ,info: $info)
 }
`;
export const EditTheme =  graphql(UPDATE_THEME,{
     props:({mutate})=>({
     updateEditThem : (token,info) =>mutate({variables:{token,info}})
   })
 })(EditThemeForm);
