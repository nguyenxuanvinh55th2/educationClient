import React from 'react';
;
import { Link, browserHistory } from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import __ from 'lodash';

class ChildHeader extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    if(!this.props.data.classifies){
      return (
        <div></div>
      )
    }
    else {
      return (
        <ul className="menu-child">
          {
              __.map(this.props.data.classifies, (item, idx) => {
                if(item.childrents[0]){
                  return (
                    <li key={idx} style={{cursor: 'pointer'}} onClick={() => {
                      let query = {};
                      query['dia-diem-du-lich'] = item.name;
                      browserHistory.push(
                          {
                           pathname: "/tim-kiem",
                           query: query
                        }
                      )
                    }}>
                      {item.name}
                      <ul className="list-unstyled">
                        {
                          __.map(item.childrents, (child, index) => {
                            return (
                              <li key={index}>
                                <Link onClick={() => {
                                  let query = {};
                                  query['dia-diem-du-lich'] = child.name;
                                  browserHistory.push(
                                      {
                                       pathname: "/tim-kiem",
                                       query: query
                                    }
                                  )
                                }} style={{textTransform: 'capitalize'}}>{child.name}</Link>
                              </li>
                            )
                          })
                        }
                      </ul>
                    </li>
                  )
                }
                else {
                  return (
                    <li key={idx} style={{cursor: 'pointer'}} onClick={() => {
                      let query = {};
                      query['dia-diem-du-lich'] = item.name;
                      browserHistory.push(
                          {
                           pathname: "/tim-kiem",
                           query: query
                        }
                      )
                    }} >{item.name}</li>
                  )
                }
              })
          }
        </ul>
      )
    }
  }
}
const SEARCH_QUERY = gql `
    query classifies($query: String) {
      classifies(query: $query) {
      _id code name slug
      childrents {_id code name slug}
    }
}`

export default compose(graphql(SEARCH_QUERY, {
  options: () => ({
    variables: {
      query: JSON.stringify({
        active: true,
        isRegion: true
      })
    },
    fetchPolicy: 'cache-and-network'
  })
}),)(ChildHeader);
