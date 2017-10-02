import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { browserHistory } from 'react-router';
import Dialog from 'material-ui/Dialog';

import AddNewDialog from './AddNewDialog.jsx';
import CustomerInfo from './CustomerInfo.jsx';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

class Advertisements extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false, type: '', height: window.innerHeight, openReview: false, openCustomer: false};
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

  handleClose() {
    this.setState({open: false, type: '', updateItem: null});
  }

  handleCloseCustomer() {
    this.setState({openCustomer: false, updateItem: null});
  }

  addNewRow(info) {
  }

  render() {
    if(this.props.data.loading) {
      return (
        <div className="spinner spinner-lg"></div>
      )
    } else {
        return (
          <div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
              <ol className="breadcrumb" style={{marginBottom: 0, backgroundColor: 'white'}}>
                <li>
                  <a onClick={() => browserHistory.push('/dashboard')}>Dashboard</a>
                </li>
                <li>
                  <a onClick={() => browserHistory.push('/advertisement')}>Quảng cáo</a>
                </li>
              </ol>
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5, marginRight: 10, paddingBottom: 10}}>
                <button type="button" className="btn btn-primary" onClick={() => this.setState({open: true})}>Tạo mới</button>
              </div>
            </div>
            <div style={{height: this.state.height - 140, overflowY: 'auto', overflowX: 'none'}}>
              {
                this.props.data.advertisements.map((item, idx) => (
                  <div key={idx} className="col-sm-4" style={{padding: "0px 5px 10px 5px"}}>
                    <Card>
                      <CardMedia style={{height: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'black'}}
                        overlay = {
                          <CardTitle title={'Tên: ' + item.name} subtitle={(
                              <div>
                                { 'Loại: ' + (item.type === 'popup' ? 'Pop up quảng cáo' : 'Slider quảng cáo') }
                                <br/>
                                {'Trạng thái: ' + (item.isShow ? 'hiện' : 'ẩn') }
                              </div>
                          )}/>
                        }>
                        <img style={{maxHeight:300}} src={item.image.file} alt="" />
                      </CardMedia>
                      <CardActions style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <button className="btn btn-danger" onClick={() => {
                          var remove = confirm('Bạn có thực sự muốn xóa');
                          if (remove) {
                            this.props.removeAdvertise(Meteor.userId(), item._id).then(() => {
                              this.props.data.refetch();
                              this.props.addNotificationMute({fetchData: true, message: 'Xóa quảng cáo thành công', level: 'success'});
                              Meteor.call('sendNotification', {
                                note: Meteor.user().username + ' ' + 'xóa quảng cáo ' + item.name,
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
                        }}>
                          Xóa
                        </button>
                        <button className="btn btn-primary" onClick={() => {
                          this.setState({selectImage: item.image.file, openReview: true});
                        }}>
                          Xem ảnh
                        </button>
                        <button className="btn btn-primary" onClick={() => {
                          this.setState({updateItem: item, openCustomer: true});
                        }}>
                          Xem khách hàng
                        </button>
                        <button className="btn btn-primary" onClick={() => this.setState({open: true, type: 'update', updateItem: item})}>
                          Sửa
                        </button>
                      </CardActions>
                    </Card>
                  </div>
                ))
              }
            </div>
            <Dialog modal={true}
                open={this.state.open}
                contentStyle={{width: 600}}
                bodyStyle={{padding: 0}}
              >
                {
                  <AddNewDialog {...this.props} insertNew={this.addNewRow.bind(this)} handleClose={this.handleClose.bind(this)} refetch={this.props.data.refetch} height={this.state.height - 250} type={this.state.type} updateItem={this.state.updateItem}/>
                }
            </Dialog>
            <Dialog modal={true}
                open={this.state.openCustomer}
                contentStyle={{width: 600}}
                bodyStyle={{padding: 0}}
              >
                {
                  <CustomerInfo {...this.props} handleClose={this.handleCloseCustomer.bind(this)} height={this.state.height - 250} updateItem={this.state.updateItem}/>
                }
            </Dialog>
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
        )
    }
  }
}


const ADVERTISEMENT_QUERY = gql `
    query advertisements($type: String) {
        advertisements(type: $type) {
          _id
          name
          time
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
          isShow
        }
}`

const REMOVE = gql`
    mutation removeAdvertise($userId: String!, $_id: String){
        removeAdvertise(userId: $userId, _id: $_id)
}`

const SELECT = gql`
    mutation selectAdvertise($userId: String!, $_id: String){
        selectAdvertise(userId: $userId, _id: $_id)
}`

export default compose(
  graphql(ADVERTISEMENT_QUERY, {
    options: () => ({
      variables: {type: 'advertise'},
      fetchPolicy: 'cache-and-network'
    })
  }),
  graphql(REMOVE, {
      props:({mutate})=>({
          removeAdvertise : (userId, _id) => mutate({variables:{userId, _id}})
      })
  }),
  graphql(SELECT, {
      props:({mutate})=>({
          selectAdvertise : (userId, _id) => mutate({variables:{userId, _id}})
      })
  })
)(Advertisements);
