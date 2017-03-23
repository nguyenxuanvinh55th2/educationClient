import React from 'react';

import { browserHistory } from 'react-router';

import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import Drawer from 'material-ui/Drawer';
import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import FontIcon from 'material-ui/FontIcon';

import {
  blue300,
  indigo900,
  orange200,
  deepOrange300,
  pink400,
  purple500,
} from 'material-ui/styles/colors';
const style = {margin: 5};
class ChatBar extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
    <Drawer open={true} docked={true}>
      <List>
       <ListItem
         disabled={true}
         leftAvatar={
           <Avatar
           icon={<FontIcon className="muidocs-icon-communication-voicemail" />}
           color={blue300}
           backgroundColor={indigo900}
           size={30}
           style={style}
         />
         }
       >
         Image Avatar
       </ListItem>
     </List>
    </Drawer>
    )
  }
}
const USER_CHAT = gql`
  query userChat($userId: String){
    userChat(userId: $userId) {
      _id
      user {
        name
        image
        online
        lastLogin
        email
        social
      }
      contentId
      content {
        index
        userId
        user{
          _id
          name
          image
        }
        message
        read
        date
      }
    },
}`
export default compose(
graphql(USER_CHAT, {
    options: (ownProps) => ({
      variables: { userId: ownProps.users ? ownProps.users._id : null},
      forceFetch: true
    }),
    name: 'courses',
}),
)(ChatBar);
