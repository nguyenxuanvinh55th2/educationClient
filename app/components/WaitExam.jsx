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

import PlayerImage from './PlayerImage.jsx';

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

  shouldComponentUpdate(nextProps, nextState){
    let { params } = this.props;
    if(nextProps.examination && nextProps.examination.status >= 99) {
      browserHistory.push('/startedExam/' + params.id);
      return false
    }
    return true;
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

  renderPlayerList(playerList) {
    return playerList.map((item, idx) => (
      <tbody key = {idx} style={{borderTop: '1px solid gray'}}>
        <tr>
          <td>
            { idx + 1 }
          </td>
          <td>
            <PlayerImage checkOutImage = {item.checkOutImage}/>
          </td>
          <td>
            <p>{item.profileObj ? item.profileObj.name : item.name ? item.name : item.username}</p>
          </td>
          <td>
            <p>{item.profileObj ? item.profileObj.email : item.email ? item.email : item.emails[0].address}</p>
          </td>
        </tr>
      </tbody>
    ));
  }

  render(){
    let { users, examination, startExamination, params, data } = this.props;
    let { players } = this.state;
    console.log('players ', players);
    if (!players || !data.examById) {
        return (
            <div className="spinner spinner-lg"></div>
        );
    } else {
        return (
          <div style={{backgroundColor: 'white'}}>
            <div style={{textAlign: 'center', paddingBottom: 20}}>
              <h1 style={{color: '#68C0BC'}}>{ data.examById.name.toUpperCase() }</h1>
              <p style={{fontSize: 14}}>Số lượng tham gia thi: <font style={{fontSize: 16, color: '#68C0BC'}}> { data.examById.userExams.length } </font></p>
            </div>
            <div className="col-sm-12" style={{paddingLeft: (window.innerWidth - 525) / 2, paddingRight: (window.innerWidth - 525) / 2}}>
              <table>
                <thead>
                  <th style={{width: 50, color: '#68C0BC', fontSize: 14}}>
                    STT
                  </th>
                  <th style={{width: 75, color: '#68C0BC', fontSize: 14}}>
                  </th>
                  <th style={{width: 200, color: '#68C0BC', fontSize: 14}}>
                    Tên người dùng
                  </th>
                  <th style={{width: 200, color: '#68C0BC', fontSize: 14}}>
                    Email
                  </th>
                </thead>
                { this.renderPlayerList(players) }
              </table>
            </div>
            <div className="col-sm-12" style={{height: 120}}>
            </div>
            <div style={{paddingLeft: (window.innerWidth - 300) / 2, paddingRight: (window.innerWidth - 300) / 2}}>
              {
                users.userId === data.examById.createdBy._id ?
                <button className="btn btn-primary" style={{width: '100%'}} onClick={() => {
                    let token= localStorage.getItem('Meteor.loginToken');
                    let _id = params.id;
                    startExamination(token, _id);
                  }}>
                  Bắt đầu
                </button> : null
              }
            </div>
          </div>
        )
    }
  }
}

const QUESTION_BY_EXAM = gql`
  query examById($examId: String!) {
    examById(_id: $examId) {
      _id
      code
      name
      description
      createdBy {
        _id
        name
      }
      userExams {
        _id
      }
    }
  }`

const START_EXAMINATION = gql`
    mutation startExamination ($token: String!, $_id: String!) {
      startExamination(token: $token, _id: $_id)
}`

const WaitExamWithMutaion = compose (
    graphql(QUESTION_BY_EXAM, {
        options: (owProps)=> ({
            variables: {examId: owProps.params.id},
            forceFetch: true
        })
    }),
    graphql(START_EXAMINATION, {
        props: ({mutate})=> ({
          startExamination : (token, _id) => mutate({variables: {token, _id}})
        })
    }),
)(WaitExam);

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
}, WaitExamWithMutaion);
