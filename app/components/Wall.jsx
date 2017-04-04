import React from 'react';

import { browserHistory } from 'react-router';

import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import {List, ListItem} from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';

class Wall extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    let { courses } = this.props;
    if(courses.loading && courses.error){
      return (
          <div className="spinner spinner-lg"></div>
      );
    }
    else {
      return (
        <div style={{flexDirection: 'column'}}>
          <List>
            {
              __.map(courses.courses,(course,idx) => {
                  return (
                    <ListItem key={idx}
                      primaryText={course.name}
                      initiallyOpen={false}
                      primaryTogglesNestedList={true}
                      nestedItems={
                        __.map(course.classes, (childClass,index) => {
                          return (
                            <ListItem
                               key={index}
                               primaryText={childClass.name}
                               leftIcon={<ContentInbox />}
                             />
                          )
                        })
                      }
                    />
                  )
              })
            }
          </List>
        </div>
      )
    }
  }
}

const MyQuery = gql`
    query courses{
      courses {
       _id
       name
       dateStart
       dateEnd
       classes {
         _id
         code
         name
         currentUserId
         role
         createAt
         createrId
         classSubjects {
           _id
           subjectName
           dateStart
           dateEnd
           isOpen
           publicActivity
         }
       }
     }
    }`
export default compose(
graphql(MyQuery, {
    options: (ownProps) => ({
      forceFetch: true
    }),
    name: 'courses',
}),
)(Wall);
