import React from 'react'
import {Helmet} from "react-helmet";
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import __ from 'lodash';

import {loadHomePopup} from '../../javascript/Popup.js';
import {hideHomePopup} from '../../javascript/Popup.js';

export default class AdvertisePopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {contact: ''};
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.time <= 1 || session.get('closeAdvertise')) {
      $('#HomePopup').modal('hide');
    }
  }
  render() {
    let { data } = this.props;
    let { contact } = this.state;
    return (
      <div id="HomePopup" ref="HomePopup" className="modal fade" role="dialog" data-backdrop="static" data-keyboard="false">
        <div className="modal-dialog">
          <div className="modal-content" style={{padding: 15}}>
            <div className="container-Home-popup">
              {
                this.props.advertisements ?
                <img style={{height: '100%', width: '100%'}} src={this.props.advertisements[0].image.file}/> :
                <div></div>
              }
              <div style={{height: 14}}>
              </div>
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: 32}}>
                <div className="form-group" style={{marginBottom: 16}} onKeyDown={(e) => {
                    let flat = false;
                    var keyCode = e.keyCode;
                    if(keyCode == 13) {
                      if(this.props.advertisements) {
                        Meteor.call('updateAdvertiseUser', {
                          _id: this.props.advertisements[0]._id,
                          customer: {
                            contact: this.state.contact,
                            createdAt: moment().valueOf()
                          }
                        }, (err, res) => {
                          if (err) {
                            alert(err);
                          } else {
                              $('#HomePopup').modal('hide');
                              Session.set('closeAdvertise', true);
                          }
                        });
                      }
                    }
                  }}>
                  <input type="text" className="form-control" style={{border: '1px solid #9c9c9c', width: 300}} value={contact} placeholder="Nhập email hoặc số điện thoại của bạn" onChange={({target}) => {
                    this.setState({contact: target.value})
                  }}
                  onFocus={() => this.props.setFocus(true)}
                  onBlur={() => this.props.setFocus(false)}
                />
                </div>
                <div style={{textAlign: 'right', color: 'red'}}>
                  {'Quảng cáo sẽ đóng trong ' + this.props.time}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Helmet>
          <script type="text/javascript">
              $('#HomePopup').modal('show');
          </script>
        </Helmet>
      </div>
    )
  }
}
