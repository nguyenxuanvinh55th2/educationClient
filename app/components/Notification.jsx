import React, { PropTypes, Component, ReactDom } from 'react';
import { Link, Router, browserHistory } from 'react-router'
import { graphql, compose } from 'react-apollo';

import gql from 'graphql-tag';

//Meteor.subscribe("user");

class AcceptButton extends Component {
  render() {
    if(this.props.note.type === 'add-friend-note')
      return (
        <button className="btn btn-primary" style={{marginTop: '50px', float: 'right'}} onClick={e => {

        }}>Xác nhận</button>
      )
    else
      if(this.props.note.type === 'add-class-note')
        return (
          <button className="btn btn-primary" style={{marginTop: '50px', float: 'right'}} onClick={e => {
            let token = localStorage.getItem(this.props.loginToken);
            this.props.insertUserClass(token, this.props.note.classInfo._id);
          }}>Tham gia</button>
        )
      else(this.props.note.type === 'request-class-note')
        return (
          <button className="btn btn-primary" style={{marginTop: '50px', float: 'right'}} onClick={e => {

          }}>Chấp nhận</button>
        )
  }
}

const INSERT_USER_CLASS = gql`
  mutation insertUserClass($token: String!, $classId: String!) {
    insertUserClass(token: $token, classId: $classId)
  }
`;

const AcceptButtonWithMutate = compose(
  graphql(
    INSERT_USER_CLASS,
    {
      props: ({ mutate }) => ({
        insertUserClass: (token, classId) => mutate({ variables: { token, classId } }),
      }),
  })
)(AcceptButton);

class Note extends Component {
  render() {
    return (
      <div style={{borderBottom: '1px solid #EBEBEB', paddingTop: '10px', paddingBottom: '8px', width: '285px', marginLeft: '0px', height: 120}} onClick={e => {
          document.getElementById('notification').style.display = 'inline';
        }}>
        <div className="col-sm-3">
            <img className="img-note" src={ this.props.note.createdBy.image }></img>
        </div>
        <div className="col-sm-6">
          <span style={{width: '100%', height: '100%'}}>
            <h5><b>{ this.props.note.createdBy.name }</b></h5>
            {
              this.props.note.type === 'add-class-note' ?
              <p>{this.props.note.note + ' vào lớp ' + this.props.note.classInfo.code}</p> :
              <p>{this.props.note.note}</p>
            }

            <p>{this.props.note.createdAt}</p>
          </span>
        </div>
        <div className="col-sm-3">
          <div style={{position: 'absolute', top: '0px', right: '10px'}}>
            <button className='btn btn-danger' style={{float: 'right'}} onClick = { e => {
                this.props.removeNotification(this.props.note._id)
            }}>X</button>
          <AcceptButtonWithMutate note={this.props.note}/>
          </div>
        </div>
      </div>
    )
  }
}

class Notification extends Component {
  constructor(props) {
      super(props);
  }

  componentDidMount() {
    window.addEventListener('mouseup', function(event) {
      var modal;

      var note = document.getElementById('notification');
      //var menu = document.getElementById('userMenu');

      if(note && event.target !== note && note.style && note.style.display) {
        note.style.display = 'none';
      }

      // if(event.target !== menu) {
      //   menu.style.display = 'none';
      // }
    })
  }

  removeNotification(noteId) {
    this.props.remove(noteId).then(() => {
      this.props.data.refetch();
    }).catch((err) => {

    });
  }

  renderNote() {
    if(!this.props.data.notification || this.props.data.loading) {
      return (
        <div>loading</div>
      )
    } else
        if(this.props.data.notification.length === 0) {
          return (
            <div style={{marginTop: '20px', marginLeft: '55px'}}>bạn không có thông báo nào</div>
          )
        } else {
            return this.props.data.notification.map((note, idx) => (
              <Note key={idx} note={note} remove={this.props.removeNotification.bind(this)}/>
            ))
          }
  }

  render() {
    return (
      <div id="notification">
        {this.renderNote()}
      </div>
    )
  }
}

const NOTIFICATION = gql`
  query notification($token: String!){
    notification(token: $token) {
      _id
    	user {
        _id
        name
        image
      }
      classInfo {
        _id
        code
        name
      }
    	type
    	createdBy {
        _id
        name
        image
      }
    	note
      read
    	createdAt
    },
  }`

const DELETE_NOTIFICATION = gql`
  mutation deleteNotification($noteId: String!) {
    deleteNotification(noteId: $noteId)
  }
`;

export default compose(
  graphql(NOTIFICATION, {
      options: (ownProps) => ({
        variables: { token: localStorage.getItem('Meteor.loginTokenFacebook') ? localStorage.getItem('Meteor.loginTokenFacebook') : localStorage.getItem('Meteor.loginTokenGoogle') ? localStorage.getItem('Meteor.loginTokenGoogle') : localStorage.getItem('Meteor.loginToken')  },
        forceFetch: true
      })
  }),
  graphql(
    DELETE_NOTIFICATION,
    {
      props: ({ mutate }) => ({
        remove: (noteId) => mutate({ variables: { noteId } }),
      }),
  })
)(Notification);
