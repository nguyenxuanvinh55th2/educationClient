import React from 'react';

import { Link, Router, browserHistory } from 'react-router'

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import LeftBar from './LeftBar_Vinh.jsx'
export default class Profile extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return(
      <div style={{flexDirection: 'column'}}>
        <div >
          <LeftBar />
        </div>
      </div>
    )
      // <div style={{flexDirection: 'column'}}>
      //   <div style={{flexDirection: 'column'}}>
      //   {React.cloneElement(<Header/>, this.props)}
      //   </div>
      //   <div style={{marginTop: 65}}>
      //     {React.cloneElement(this.props.children, this.props)}
      //   </div>
      //   {/* <NotificationSystem ref="notificationSystem" /> */}
      // </div>
  }
}
