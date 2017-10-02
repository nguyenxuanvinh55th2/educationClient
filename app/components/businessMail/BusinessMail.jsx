import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import __ from 'lodash';
import moment from 'moment';
import { browserHistory } from 'react-router';

import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import Popover from 'material-ui/Popover';
import Select, {Creatable} from 'react-select';
import QuillEditor from '../editor/QuillEditor.jsx';

class BusinessMail extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        customerArray: [],
        title: '',
        height: window.innerHeight,
        html: '',
        disabled: false
      };
      this.allowClick = false;
  }

  getContent(html) {
    this.setState({html})
  }

  handleResize(e) {
      this.setState({height: window.innerHeight});
  }

  componentDidMount() {
      window.addEventListener('resize', this.handleResize.bind(this));
      this.setState({refetch: false});
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    let { data } = this.props;
    let { html } = this.state;
    let AccountingObjects;
    if(data.AccountingObjects) {
       AccountingObjects = __.cloneDeep(data.AccountingObjects);
       __.forEach(AccountingObjects, item => {
         item.name = item.email + ' - ' + item.name;
       })
    }
    return (
      <div className="column">
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          <ol className="breadcrumb" style={{
            marginBottom: 0,
            backgroundColor: 'transparent'
          }}>
            <li>
              <a onClick={() => browserHistory.push('/dashboard')}>Dashboard</a>
            </li>
            <li>
              <a onClick={() => browserHistory.push('/businessMail')}>Quảng lý mail</a>
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
                  <label>Tiêu đề(*)
                  </label>
                  <input type="text" className="form-control" placeholder="Enter name" value={this.state.title} onChange={({target}) => {
                      this.setState({title: target.value});
                    }}/>
                </div>
                <div className="form-group">
                  <label>Khách hàng
                  </label>
                  <Select multi={true} value={this.state.customerArray} valueKey="_id" labelKey="name" placeholder="Chọn khách hàng" options={AccountingObjects} onChange={(value) => {
                    if(value) {
                      this.setState({customerArray: value});
                    }
                  }}/>
                </div>
              </form>
            </div>
          </div>
          <div className="col-sm-12 col-md-7">
            <div style={{width: '100%', backgroundColor: 'white'}}>
              <QuillEditor getContent={this.getContent.bind(this)} html={html} height={this.state.height - 255}/>
            </div>
            <div style={{width: '100%', height: 40, paddingTop: 5, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
              <button className="btn btn-primary" disabled={!this.state.html || !this.state.customerArray || !this.state.customerArray.length || !this.state.title || this.state.disabled} style={{height: 35}} onClick={() => {
                if(!this.allowClick) {
                  this.setState({disabled: true});
                  Meteor.call('sendMail', {
                    email: this.state.customerArray.map(item => item.email),
                    html,
                    title: this.state.title,
                    sentMail: 'evitour.info@gmail.com'
                  }, (err, res) => {
                    if (err) {
                      alert(err);
                    } else {
                        this.allowClick = false;
                        this.setState({disabled: false});
                        this.props.addNotificationMute({fetchData: true, message: 'Bạn đã gửi mail thành công', level: 'success'});
                        Meteor.call('sendNotification', {
                          note: Meteor.user().username + ' ' + 'gửi business email ',
                          isManage: true
                        }, (err, res) => {
                          if (err) {
                            alert(err);
                          } else {
                            // success
                          }
                        });
                    }
                  });
                }
                }}>Gửi mail</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const TEAM_BUILDING_QUERY = gql`
    query AccountingObjects {
        AccountingObjects {
          _id
          name
          status
          address
          mobile
          email
          feedBack
          createdAt
          verifyAt
          verifyBy {
            _id
            username
          }
        }
}`

// const VERIFY = gql`
//     mutation verifyAccountingObject($userId: String, $_id: String){
//       verifyAccountingObject(userId: $userId, _id: $_id)
// }`
//
// const REMOVE = gql`
//     mutation removeAccountingObject($userId: String, $_id: String){
//         removeAccountingObject(userId: $userId, _id: $_id)
// }`
//
// const UPDATE = gql`
//     mutation updateAccountingObject($userId: String, $_id: String, $info: String){
//         updateAccountingObject(userId: $userId, _id: $_id, info: $info)
// }`

export default compose (
    graphql(TEAM_BUILDING_QUERY, {
        options: ()=> ({
            variables: {},
            fetchPolicy: 'network-only'
        })
    }),
)(BusinessMail);
