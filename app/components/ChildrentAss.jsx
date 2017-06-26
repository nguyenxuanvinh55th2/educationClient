import React from 'react';

import { Link, Router, browserHistory } from 'react-router'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {AgGridReact} from 'ag-grid-react';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Dialog from 'material-ui/Dialog';
import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';

class  ChildrentAss extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      listAss: []
    }
    this.data = [
      {
        name: 'Bài tập tự ôn trước khi thi',
        date: '03/2/2017',
        point: '7.5'
      },
      {
        name: 'Bài tập chương 2 tổng quan PHP',
        date: '09/3/2017',
        point: 'Chưa nộp'
      },
      {
        name: 'Bài tập tổng hợp kiến thức',
        date: '10/04/2017',
        point: '9'
      },
      {
        name: 'Bài tập kiểm tra giữa kì',
        date: '1/5/2017',
        point: '4.5'
      },
      {
        name: 'Bài tập luyện tập',
        date: '9/7/2017',
        point: 'Chưa nộp'
      },
      {
        name: 'Kiểm tra kết thúc môn học',
        date: '03/8/2017',
        point: 'Chưa nộp'
      }
    ]
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.dataSet.getActivityAssignment){
      this.setState({listAss: __.cloneDeep(nextProps.dataSet.getActivityAssignment)});
    }
  }
  render(){
    return (
      <div className="modal-dialog" style={{width: 'auto', margin: 0}}>
          <div className="modal-content">
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f5f5f5', borderBottom: 'none', padding: '10px 18px'}}>
              <h4 className="modal-title">Danh sách tất cả các bài tập</h4>
              <span className="close" onClick={() => this.props.handleClose()}>&times;</span>
            </div>
            <div className="modal-body" style={{maxHeight:window.innerHeight - 300, overflowY: 'auto', overflowX: 'hidden'}}>
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tên bài tập</th>
                    <th>Hạn nộp</th>
                    <th>Điểm số / trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    __.map(this.state.listAss,(ass,idx) => {
                      let indexUser = __.findIndex(ass.topic.memberReply,(mem) => {
                        return mem.owner._id == this.props.childrenId;
                      });
                      let point = 'Chưa nộp';
                      if(indexUser > -1){
                        point = ass.topic.memberReply[indexUser].point;
                      }
                      return(
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{ass.topic.title}</td>
                          <td>{moment(ass.topic.deadline ? ass.topic.deadline : moment().valueOf()).format('DD/MM/YYYY')}</td>
                          <td>{point}</td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" onClick={() => this.props.handleClose()}>Đóng</button>
            </div>
          </div>
      </div>
    )
  }
}

const MyQuery = gql`
    query getData($classSubjectId: String!){
     getActivityAssignment(classSubjectId: $classSubjectId) {
        _id
        topic {
          _id title createdAt deadline
          owner {
             _id name  image  email
           }
             memberReply {
             _id point
             owner {
               _id name image email
             }
           }
        }
      }
    }`
export default compose(
  graphql(MyQuery, {
      options: (ownProps) => ({
        variables: {classSubjectId: ownProps.classSubjectId},
        fetchPolicy: 'cache-only'
      }),
      name: 'dataSet',
  })
)(ChildrentAss)
