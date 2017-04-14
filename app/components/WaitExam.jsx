import React from 'react';
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import  { UserExams } from 'educationServer/userExam'
import  { Players } from 'educationServer/player'
import  { GroupPlayers } from 'educationServer/groupPlayer'
import  { PersonalPlayers } from 'educationServer/personalPlayer'
import  { Examinations } from 'educationServer/examination'

import { browserHistory } from 'react-router';

import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';

import { graphql, compose } from 'react-apollo';
import { AgGridReact } from 'ag-grid-react';
import gql from 'graphql-tag';

import { List, ListItem } from 'material-ui/List';
import Dialog from 'material-ui/Dialog';

import { createContainer } from 'react-meteor-data';

class PlayerImage extends React.Component {
    constructor(props) {
      super(props);
      this.state = { showModal: false };
    }

    render() {
      let { checkOutImage } = this.props.data;
      return (
        <div style={{width: 50, height: 50}}>
          <img style={{height: 50, width: 50, maxWidth: '100%', maxHeight: '100%'}} src={checkOutImage} onClick={() => {
              this.setState({showModal: true});
            }}/>
          <Dialog
            modal={true}
            open={this.state.showModal}
            contentStyle={{height: 300, width: 245}}
          >
            <div className="modal-dialog" style={{width: 'auto', margin: 0}}>
                <div className="modal-content">
                  <div className="modal-body" style={{overflowY: 'auto', overflowX: 'hidden'}}>
                    <div>
                      <span className="close" onClick={() => this.setState({showModal: false})}>&times;</span>
                    </div>
                      <img style={{height: 200, width: 200, maxWidth: '100%', maxHeight: '100%'}} src={checkOutImage}/>
                  </div>
                </div>
            </div>
          </Dialog>
        </div>
      )
    }
}


class WaitExam extends React.Component {
  constructor(props){
    super(props);
    this.rows = 2;
    this.width = Math.floor((window.innerWidth - 83) / this.rows);
    this.state = {height: window.innerHeight, width: this.width, open: false, refetch: false, players: []};
    this.gridOptions = {
        suppressHorizontalScroll: true,
        doesDataFlower: () => {
            return true;
        },
        onAfterFilterChanged: () => {
            let data = [], models = this.gridOptions.api.getModel().rowsToDisplay;
            __.forEach(models, (model) => {
                data.push(model.data);
            });
            this.gridOptionFooter.api.setRowData(this.renderFooterData(data));
        },
        rowHeight: 50
    };

    this.gridOptionFooter = {
        rowData: null,
        rowClass: 'bold-row',
        headerHeight: 0,
        slaveGrids: []
    };
  }

  handleResize(e) {
      this.setState({height: window.innerHeight});
      this.state.width = Math.floor((window.innerWidth - 158) / this.rows);
      this.setState({width: this.state.width})
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.userIds) {
      let userIds = nextProps.userIds;
      Meteor.call('getUserExam', userIds, (err, result) => {
        if(err) {
          console.log("lay du lieu loi ", err);
        } else {
            __.forEach(result, item => {
              item['name'] = item.profileObj ? item.profileObj.name : item.name ? item.name : item.username;
              item['email'] = item.profileObj ? item.profileObj.email : item.email ? item.email : item.emails[0].address;
              item['checkOutImage'] = item.checkOutImage[0].link;
            })
            let players = result;
            this.setState({players});
        }
      })
    }
  }

  componentDidMount() {
      window.addEventListener('resize', this.handleResize.bind(this));
      this.setState({refetch: false});
  }

  componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize.bind(this));
  }

  renderFooterData(data) {
      return [{
          gridType: 'footer',
          index: 'Total: ' +  data.length,
          option: ''
      }];
  }

  showPlayerImage(playerImage) {
    this.setState({playerImage, showModal: true})
  }

  render(){
    let { users, examination } = this.props;
    let { players } = this.state;
    // if (!players || players.length === 0) {
    //     return (
    //         <div className="spinner spinner-lg"></div>
    //     );
    // } else {
        let index = 1;
        __.forEach(players, item => {
            item['index'] = index;
            index ++;
        });
        let columnDefs= [
            {
                headerName: 'STT', field: "index", width: 75, editable: (params) => {
                    if (params.node.data.gridType == 'footer') {
                        return false;
                    } else {
                        return true;
                    }
                },  cellStyle: function(params) {
                        if (params.node.data.gridType == 'footer') {
                            //mark police cells as red
                            return {fontWeight: 'bold'};
                        } else {
                            return null;
                        }
                    }, suppressMenu: true, required: true
            },
            {
                cellRendererFramework: PlayerImage, headerName: "hình ảnh", field: "checkOutImage", cellClass: 'agaction',
                minWidth: 50, width: 50, maxWidth: 50, editable: false, suppressMenu: true
            },
            {
                headerName: 'Tên thí sinh', field: "name", width: this.state.width, editable: (params) => {
                    if (params.node.data.gridType == 'footer') {
                        return false;
                    } else {
                        return true;
                    }
                }, suppressMenu: true, required: true
            },
            {
                headerName: 'địa chỉ email', field: "email", width: this.state.width, editable: (params) => {
                    if (params.node.data.gridType == 'footer') {
                        return false;
                    } else {
                        return true;
                    }
                }, suppressMenu: true, required: false
            },
            {
                headerName: 'trạng thái', field: "status", width: this.state.width, editable: (params) => {
                    if (params.node.data.gridType == 'footer') {
                        return false;
                    } else {
                        return true;
                    }
                }, suppressMenu: true, required: false
            },
        ];
        return (
          <div style={{flexDirection: 'column'}}>
            {
              examination && examination.createdById === users.userId ?
              <div style={{width: '100%', paddingRight: 10, paddingLeft: 10, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                <div className="col-sm-6" style={{paddingRight: 5}}>
                  <button className="btn btn-primary" style={{width: '100%'}}>
                    Xem điểm
                  </button>
                </div>
                <div className="col-sm-6" style={{paddingLeft: 5}}>
                  <button className="btn btn-primary" style={{width: '100%'}}>
                    Bắt đầu
                  </button>
                </div>
              </div> : null
            }
            <div style={{height: this.state.height-275}} className="ag-fresh">
                <AgGridReact
                    gridOptions={this.gridOptions}
                    columnDefs={columnDefs}
                    rowData={players}
                    enableColResize="true"
                    enableSorting="true"
                    enableFilter="true"
                />
            </div>
            <div style={{height: 45}} className="ag-fresh">
                <AgGridReact
                    rowClass="grid-bottom"
                    gridOptions={this.gridOptionFooter}
                    columnDefs={columnDefs}
                    rowData={this.renderFooterData(players)}
                    enableColResize="true"
                />
            </div>
          </div>
      )
    //}
  }
}

export default createContainer((ownProps) => {
  Meteor.subscribe("userExams");
  Meteor.subscribe("players");
  Meteor.subscribe("groupPlayers");
  Meteor.subscribe("personalPlayers");
  Meteor.subscribe("users");
  Meteor.subscribe("examinations");

  let examId = ownProps.params.id;
  let examination = Examinations.findOne({_id: examId});
  let playerIds = UserExams.find({examId}).map(item => item.playerId);
  let userIds = Players.find({_id: {$in: playerIds}, isUser: true}).map(item => item.userId);
  // let groupIds = Players.find({_id: {$in: playerIds}, isGroup: true}).map(item => item.userId);
  // let personalIds = Players.find({_id: {$in: playerIds}, isPersonal: true}).map(item => item.userId);

  // let userList = Meteor.users.find({_id: {$in: userIds}}).fetch();
  // let personalList = PersonalPlayers.find({_id: {$in: personalIds}}).fetch();
  return {
    userIds,
    examination
  };
}, WaitExam);
