import React from 'react';
import { AgGridReact } from 'ag-grid-react';
;
import __ from 'lodash';
import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import { browserHistory } from 'react-router';

import Dialog from 'material-ui/Dialog';

class DeleteAditorRender extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    return (
        <div style={{width: '100%'}}>
          <button className="btn btn-default" disabled={this.props.data._id === '0' || this.props.data._id === '1'} style={{borderWidth: 0, width: 56, color:'red'}}>Xóa</button>
        </div>
    )
  }
}

class User extends React.Component {
  constructor(props) {
    super(props);
    this.data = [];
    this.state = {
        height: window.innerHeight,
        open: false, name: '',
        userId: null,
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        receivedNote: false,
        error: null
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
      username: 'Total: ' +  data.length,
    }];
  }

  handleResize(e) {
      this.setState({width: this.width, height: window.innerHeight});
  }

  componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize.bind(this));
  }

  checkPassword(){
      let { password, confirmPassword } = this.state;
      if(password!==confirmPassword){
          this.setState({error: 'Password not match!'});
      } else {
          this.setState({error: ''});
      }
  }

  componentDidUpdate(){
    if(this.gridOptions.api){
      this.gridOptions.api.showLoadingOverlay();
      this.gridOptions.api.setFloatingBottomRowData(this.renderFooterData(this.props.data.users));
      this.gridOptions.api.hideOverlay();
    }
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  saveUser(){
      let { userId, username, email, firstName, lastName, password, receivedNote } = this.state;
      let { saveUser, data } = this.props;
      saveUser({
          token: localStorage.getItem('Meteor.loginToken'),
          info: JSON.stringify({
              _id: userId,
              username,
              email,
              password,
              firstName,
              lastName,
              receivedNote
          })
          }).then(({data})=>{
            if(data.saveUser === 'userNameExist') {
              this.props.addNotificationMute({fetchData: true, message: 'Trùng tên người dùng', level: 'error'});
            }
            else if(data.saveUser === 'emailExist') {
              this.props.addNotificationMute({fetchData: true, message: 'Trùng địa chỉ mail', level: 'error'});
            } else {
                this.props.addNotificationMute({fetchData: true, message: 'Cập nhật thành công', level: 'success'});
                this.setState({
                  open:false,
                  userId: null,
                  username: '',
                  email: '',
                  password: '',
                  confirmPassword: '',
                  firstName: '',
                  lastName: '',
                  error: null
                }, ()=>this.props.data.refetch());
            }
          })
          .catch((err)=>{
            this.props.addNotificationMute({fetchData: true, message: 'Cập nhật thất bại', level: 'error'});
            this.setState({open:false}, ()=>this.props.data.refetch());
          });
  }

  render(){
    let data = __.cloneDeep(this.props.data);
    let { gridOptions, columnDefs, open, userId, username, email, password, confirmPassword, firstName, lastName, error, receivedNote } = this.state;
    if(Meteor.userId()){
      if(!data.users){
        return (
          <div className="loading">
              <i className="fa fa-spinner fa-spin" style={{fontSize: 50}}></i>
          </div>
        )
      }
      else {
        let columnDefs= [
           {
               headerName: "", field:'delete', minWidth: 56, width: 56, cellClass: 'agaction', pinned: 'left', filter: '',
                 cellRendererFramework:DeleteAditorRender,
                cellStyle: (params) => {
                    if (params.node.data.gridType == 'footer') {
                        return {display: 'none'};
                    }
                },
                onCellClicked: (params) => {
                  if(params.data && params.data._id){
                    let token = localStorage.getItem('Meteor.loginToken');
                    var remove = confirm('Bạn có thực sự muốn xóa');
                    if (remove) {
                      this.props.removeUser({token, id: params.data._id}).then(({data}) => {
                        if(data){
                          this.props.data.refetch();
                        }
                      })
                    }
                  }
                }
           },
           {
               headerName: "Tên đăng nhập", field: "username", width: 130, minWidth: 130, cellStyle: function(params) {
                       if (params.node.data.gridType == 'footer') {
                           return {fontWeight: 'bold'};
                       } else {
                           return null;
                       }
               }, filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']}, filter: 'text', suppressMenu: true,
           },
           {
               headerName: "Họ", field: "lastName", width: 150, minWidth: 150, cellStyle: function(params) {
                       if (params.node.data.gridType == 'footer') {
                           return {fontWeight: 'bold'};
                       } else {
                           return null;
                       }
               }, filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']}, filter: 'text', suppressMenu: true,
               editable: (params) => {
                   if (params.node.data.gridType == 'footer') {
                       return false;
                   } else {
                       return true;
                   }
               },
           },
           {
               headerName: "Tên", field: "firstName", width: 130, minWidth: 130, cellStyle: function(params) {
                       if (params.node.data.gridType == 'footer') {
                           return {fontWeight: 'bold'};
                       } else {
                           return null;
                       }
               }, filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']}, filter: 'text', suppressMenu: true,
               editable: (params) => {
                   if (params.node.data.gridType == 'footer') {
                       return false;
                   } else {
                       return true;
                   }
               },
           },
           {
               headerName: "Email", field: "email", width: 230, maxWidth: 230, cellStyle: function(params) {
                       if (params.node.data.gridType == 'footer') {
                           return {fontWeight: 'bold'};
                       } else {
                           return null;
                       }
               }, filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']}, filter: 'text', suppressMenu: true,
               editable: (params) => {
                   if (params.node.data.gridType == 'footer') {
                       return false;
                   } else {
                       return true;
                   }
               },
           },
           {
               headerName: "Nhận thông báo", field: "receivedNote", width: 135, minWidth: 135, cellStyle: function(params) {
                       if (params.node.data.gridType == 'footer') {
                           return {fontWeight: 'bold'};
                       } else {
                           return null;
                       }
               }, filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']}, filter: 'text', suppressMenu: true,
               editable: (params) => {
                   if (params.node.data.gridType == 'footer') {
                       return false;
                   } else {
                       return true;
                   }
               },
               cellRenderer: (params)=>{
                 if (params.node.data.gridType === 'footer') {
                   return ''
                 } else {
                     return params.value ? params.value.toString() : 'false';
                 }
               }
           },
          //  {
          //      headerName: "Ngày sinh", field: "dateOfBirth", width: 320, cellStyle: function(params) {
          //              if (params.node.data.gridType == 'footer') {
          //                  return {fontWeight: 'bold'};
          //              } else {
          //                  return null;
          //              }
          //      }, filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']}, filter: 'text', suppressMenu: true,
          //  },
          //  {
          //      headerName: "Giới tinh", field: "gender", width: 320, cellStyle: function(params) {
          //              if (params.node.data.gridType == 'footer') {
          //                  return {fontWeight: 'bold'};
          //              } else {
          //                  return null;
          //              }
          //      }, filterParams: {filterOptions: ['contains', 'notContains', 'startsWith', 'endsWith']}, filter: 'text', suppressMenu: true,
          //  }
       ];
       return (
         <div>
           <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f5f5f5'}}>
             <ol className="breadcrumb" style={{marginBottom: 0}}>
               <li>
                 <a onClick={() => browserHistory.push('/dashboard')}>Dashboard</a>
               </li>
               <li>
                 <a onClick={() => browserHistory.push('/stockType')}>Người dùng</a>
               </li>
             </ol>
             <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', padding: 5}}>
               <button type="button" className="btn btn-primary" onClick={() => {
                 this.setState({open: true})
               }}>Thêm mới</button>
             </div>
           </div>
           <div style={{height: this.state.height - 135}} className="ag-fresh">
                 <AgGridReact
                     gridOptions={this.gridOptions}
                     columnDefs={columnDefs}
                     rowData={data.users}
                     enableColResize="true"
                     enableSorting="true"
                     enableFilter="true"
                     onCellValueChanged={(params) => {
                       let { data, saveUser } = this.props;
                       saveUser({
                           token: localStorage.getItem('Meteor.loginToken'),
                           info: JSON.stringify({
                               _id: params.data._id,
                               username: params.data.username,
                               email: params.data.email,
                               firstName: params.data.firstName,
                               lastName: params.data.lastName,
                               receivedNote: (params.data.receivedNote === 'true' || params.data.receivedNote === 't' || params.data.receivedNote === 'tr' || params.data.receivedNote === 'tru')
                           })
                       }).then(({data})=>{
                         if(data.saveUser === 'userNameExist') {
                           this.props.addNotificationMute({fetchData: true, message: 'Trùng tên người dùng', level: 'error'});
                         }
                        else if(data.saveUser === 'emailExist') {
                           this.props.addNotificationMute({fetchData: true, message: 'Trùng địa chỉ mail', level: 'error'});
                         } else {
                             this.props.addNotificationMute({fetchData: true, message: 'Cập nhật thành công', level: 'success'});
                             this.setState({open:false}, ()=>this.props.data.refetch());
                         }
                       })
                       .catch((err)=>{
                         this.props.addNotificationMute({fetchData: true, message: 'Cập nhật thất bại', level: 'error'});
                         this.setState({
                           open:false,
                           userId: null,
                           username: '',
                           email: '',
                           password: '',
                           confirmPassword: '',
                           firstName: '',
                           lastName: '',
                           error: null
                         }, ()=>this.props.data.refetch());
                       });
                     }}
                 />
           </div>
           <Dialog
               modal={true}
               open={open}
               contentStyle={{width: 600}}
               bodyStyle={{padding: 0}}>
               <div className="modal-dialog" style={{width: 'auto', margin: 0}}>
                   <div className="modal-content" style={{boxShadow: 'none', border: 'none'}}>
                       <div className="modal-header">
                           <h4 className="modal-title">Thêm người dùng</h4>
                       </div>
                       <div className="modal-body" style={{overflowY: 'auto', overflowX: 'hidden'}}>
                           {error?
                               <div className="alert alert-danger">
                                   <span className="pficon pficon-error-circle-o"></span>
                                   <strong>{error}</strong>
                               </div>
                           :null}
                           <form className="form-horizontal">
                               <div className={username?"form-group":"form-group has-error"}>
                                   <label className="col-sm-4 control-label">Tên người dùng</label>
                                   <div className="col-sm-8">
                                       <input disabled={userId?true:false} type="text" className="form-control" value={username} onChange={({target}) => this.setState({username: target.value})} />
                                   </div>
                               </div>
                               <div className={email?"form-group":"form-group has-error"}>
                                   <label className="col-sm-4 control-label">Email</label>
                                   <div className="col-sm-8">
                                       <input disabled={userId?true:false} type="email" className="form-control" value={email} onChange={({target}) => this.setState({email: target.value})} />
                                   </div>
                               </div>
                               <div className="form-group">
                                   <label className="col-sm-4 control-label">Tên</label>
                                   <div className="col-sm-8">
                                       <input type="text" className="form-control" value={firstName} onChange={({target}) => this.setState({firstName: target.value})} />
                                   </div>
                               </div>
                               <div className="form-group">
                                   <label className="col-sm-4 control-label">Họ</label>
                                   <div className="col-sm-8">
                                       <input type="text" className="form-control" value={lastName} onChange={({target}) => this.setState({lastName: target.value})} />
                                   </div>
                               </div>
                               <div className={password?"form-group":"form-group has-error"}>
                                   <label className="col-sm-4 control-label">Mật khẩu</label>
                                   <div className="col-sm-8">
                                       <input type="password" className="form-control" value={password} onChange={({target}) => this.setState({password: target.value})} onBlur={()=>this.checkPassword()} />
                                   </div>
                               </div>
                               <div className={confirmPassword && password===confirmPassword?"form-group":"form-group has-error"}>
                                   <label className="col-sm-4 control-label">Nhập lại mật khẩu</label>
                                   <div className="col-sm-8">
                                       <input type="password" className="form-control" value={confirmPassword} onChange={({target}) => this.setState({confirmPassword: target.value}, ()=>this.checkPassword())} />
                                   </div>
                               </div>
                               <div className={password?"form-group":"form-group has-error"}>
                                   <label className="col-sm-4 control-label">Nhận thông báo</label>
                                   <div className="col-sm-8" style={{paddingTop: 7}}>
                                       <input type="checkbox" checked={receivedNote} onChange={({target}) => this.setState({receivedNote: !receivedNote})} />
                                   </div>
                               </div>
                           </form>
                       </div>
                       <div className="modal-footer">
                           <button type="button" className="btn btn-default" onClick={()=>this.setState({open: false})}>Close</button>
                           <button type="button" disabled={error||!password || !confirmPassword?true:false} onTouchTap={this.saveUser.bind(this)} className="btn btn-primary">{userId?'Save':'Add'}</button>
                       </div>
                   </div>
               </div>
           </Dialog>
         </div>
       )
      }
    }
    else {
      return <div style={{textAlign: 'center'}}>{'Vui lòng đăng nhập'}</div>;
    }
  }
}

const USER = gql `
    query users {
      users {
        _id
        email
        username
        fullName
        firstName
        lastName
        dateOfBirth
        gender
        receivedNote
    }
}`

const SAVE_USER = gql`
    mutation saveUser($token: String!, $info: String) {
      saveUser(token: $token, info: $info)
    }
`;

const REMOVE_USER = gql`
    mutation removeUser($token: String!, $id: String) {
      removeUser(token: $token, id: $id)
    }
`;

export default compose(
  graphql(USER, {
    options: (ownProps) => ({
      fetchPolicy: 'network-only'
    })
  }),
  graphql(SAVE_USER, {
    props: ({mutate})=>({
        saveUser: ({token, info}) => mutate({
            variables: {token, info}
        })
    })
  }),
  graphql(REMOVE_USER, {
    props: ({mutate})=>({
        removeUser: ({token, id}) => mutate({
            variables: {token, id}
        })
    })
  })
)(User);
