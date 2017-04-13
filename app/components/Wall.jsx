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
        <div style={{flexDirection: 'column', padding: 20}}>
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Search for..." style={{height: 35, borderRadius: 5}} />
            <span className="input-group-btn">
              <button className="btn btn-secondary" type="button" style={{backgroundColor: '#35bcbf', color: 'white', height: 35, width: 50, borderRadius: 5, left: -10, zIndex: 50}}><span className="glyphicon glyphicon-search"></span></button>
            </span>
          </div>
          {/* <List>
            {
              __.map(courses.coursesActive,(course,idx) => {
                  return (
                    <ListItem key={idx}
                      primaryText={course.name}
                      initiallyOpen={false}
                      primaryTogglesNestedList={true}
                      nestedItems={
                        __.map(course.classSubjects, (childClass,index) => {
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
          </List> */}
        </div>
      )
    }
  }
}

const MyQuery = gql`
    query courses{
      coursesActive {
       _id
       name
       dateStart
       dateEnd
       classSubjects {
         _id
         name
         dateStart
         dateEnd
         isOpen
         publicActivity
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
