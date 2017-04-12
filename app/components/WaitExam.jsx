import React from 'react';
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
// import  { UserExams } from 'educationServer/userExam'
// import  { Players } from 'educationServer/player'
// import  { GroupPlayers } from 'educationServer/groupPlayer'
// import  { PersonalPlayers } from 'educationServer/personalPlayer'

import { browserHistory } from 'react-router';

import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';

import { graphql, compose } from 'react-apollo';
import { AgGridReact } from 'ag-grid-react';
import gql from 'graphql-tag';

import {List, ListItem} from 'material-ui/List';

import { createContainer } from 'react-meteor-data';

class WaitExam extends React.Component {
  constructor(props){
    super(props);
    this.rows = 2;
    this.width = Math.floor((window.innerWidth - 158) / this.rows);
    this.state = {height: window.innerHeight, width: this.width, open: false, refetch: false};

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
        }
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
          code: 'Total: ' +  data.length,
          option: ''
      }];
  }

  render(){
    console.log('Meteor inside', this.props.Meteor);
    let { users, players } = this.props;
    if (!players || players.length === 0) {
        return (
            <div className="spinner spinner-lg"></div>
        );
    } else {
        let index = 1;
        __.forEach(players, item => {
            item['index'] = index;
            index ++;
        });
        let columnDefs= [
            {
                headerName: 'STT', field: "index", width: 150, editable: (params) => {
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
    }
  }
}

export default createContainer((ownProps) => {
  // Meteor.subscribe("userExams");
  // Meteor.subscribe("players");
  // Meteor.subscribe("groupPlayers");
  // Meteor.subscribe("personalPlayers");
  // Meteor.subscribe("users");

  // let examId = ownProps.params.id;
  // let playerIds = UserExams.find({examId}).map(item => item.playerId);
  // let userIds = Players.find({_id: {$in: playerIds}, isUser: true}).map(item => item.userId);
  // let groupIds = Players.find({_id: {$in: playerIds}, isGroup: true}).map(item => item.userId);
  // let personalIds = Players.find({_id: {$in: playerIds}, isPersonal: true}).map(item => item.userId);
  //
  // let userList = Meteor.users.find({_id: {$in: userIds}}).fetch();
  //let personalList = PersonalPlayers.find({_id: {$in: personalIds}}).fetch();

  return {
    //players: __.concat(userList, personalList),
    Meteor
  };
}, WaitExam);
