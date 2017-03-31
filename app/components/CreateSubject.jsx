import React from 'react';

import { Link, Router, browserHistory } from 'react-router'

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';
import Dialog from 'material-ui/Dialog';
class CreateSubject extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      code: '',
      name: '',
      discription: ''
    }
  }
  handleSave(type){
    if(this.props.insertClass){
      this.props.insertClass(this.props.users.userId,JSON.stringify({code: this.state.code,name: this.state.name})).then(({data}) => {
        if(data.insertClass){

        }
      })
      .catch((error) => {
        console.log(error);
      })
    }
  }
  render(){
    let { subjects } = this.props;
    if(subjects.loading){
      return (
        <div className="spinner spinner-lg"></div>
      )
    }
    else {
      return (
        <div className="row">
          <div className="col-sm-9">
            <h2>Mon hoc</h2>
            <div className="column">
              <div>
                <p>Chon mon hoc</p>
                <div>

                </div>
              </div>
              <div>
                <form className="form-horizontal">
                  <div className="form-group">
                    <label className="col-sm-3 control-label">Mã môn học</label>
                    <div className="col-sm-9">
                      <input type="text" className="form-control" value={this.state.code} onChange={({target}) => this.setState({code: target.value})} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-3 control-label">Tên môn học</label>
                    <div className="col-sm-9">
                      <input type="text" className="form-control" value={this.state.name} onChange={({target}) => this.setState({name: target.value})} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-3 control-label">Mô tả</label>
                    <div className="col-sm-9">
                      <input type="text" className="form-control" value={this.state.description} onChange={({target}) => this.setState({description: target.value})} />
                    </div>
                  </div>
                </form>
              </div>
              <div>
                <button type="button" className="btn btn-primary">Thêm chủ đề</button>
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div>
              <p>Lớp học</p>
              <input type="text" className="form-control" value={this.state.description} onChange={({target}) => this.setState({description: target.value})} />
            </div>
            <div>
              <p>Khóa học</p>
              <input type="text" className="form-control" value={this.state.description} onChange={({target}) => this.setState({description: target.value})} />
            </div>
            <div>
              <p>Thêm thành viên</p>
              <input type="text" className="form-control" value={this.state.description} onChange={({target}) => this.setState({description: target.value})} />
            </div>
            <div>
              <div className="checkbox">
                <label>
                  <input type="checkbox" /> Tham gia giảng dạy ngay
                </label>
              </div>
            </div>
            <div>
              <button type="button" className="btn btn-primary">Hoàn thành</button>
            </div>
          </div>
        </div>
      )
    }
  }
}
const INSERT_CLASS = gql`
 mutation insertClass($userId:String!,$info:String!){
   insertClass(userId:$userId,info:$info)
 }
`;
const MyQuery = gql`
    query getSubjectByUserId($userId: String){
      getSubjectByUserId(userId: $userId) {
        _id
      }
    }`
export default compose(
  graphql(MyQuery, {
      options: (ownProps) => ({
        variables: {userId: ownProps.users.userId},
        forceFetch: true
      }),
      name: 'subjects',
  }),
  graphql(INSERT_CLASS,{
       props:({mutate})=>({
       insertClass : (userId,info) =>mutate({variables:{userId,info}})
     })
   })
)(CreateSubject)
