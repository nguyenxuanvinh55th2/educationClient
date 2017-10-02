import React from 'react';
import { Link, browserHistory } from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import __ from 'lodash';

import { dropdownFilter } from '../../javascript/loadMore.js'
import { closeFilter } from '../../javascript/loadMore.js';
import { checkFilter } from '../../javascript/loadMore.js'

class HeaderSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false
    }
  }
  componentDidUpdate() {
    if(this.props.data.classifies && this.props.data.classifies.length){
      let setItem = Meteor.setTimeout(() => {
        let description = document.getElementById(`render-after-class-${this.props.data.classifies.length}`);
        if (description && !this.state.isLoading) {
          dropdownFilter();
          closeFilter();
          checkFilter();
          Meteor.clearTimeout(setItem)
          this.setState({isLoading: true})
        }
      }, 500)
    }
  }
  render(){
    return (
      <div className="filter-menu container">
        {
          this.props.data.classifies ?
            <ul className="menu-dropdown list-unstyled list-inline">
              {
                __.map(this.props.data.classifies, (item, idx) => {
                  if(item.childrents[0]){
                    return (
                      <li key={idx} id={`render-after-class-${idx+1}`} className="dropdown">
                        <Link style={{textTransform: 'capitalize'}}>{item.name}</Link>
                        <ul className="col-1">
                          <li className="check-all">
                            <Link onClick={() => {
                              closeFilter();
                              let query = {};
                              query['vung-mien'] = item.name;
                              browserHistory.push(
                                  {
                                   pathname: "/tim-kiem",
                                   query: query
                                }
                              )
                            }} style={{textTransform: 'capitalize'}}>{item.name}
                            </Link>
                            <span className="close"><i className="fa fa-times-circle-o" aria-hidden="true"></i></span></li>
                          {
                            __.map(item.childrents, (child, index) => {
                              return (
                                <li key={index}>
                                  <Link onClick={() => {
                                    closeFilter();
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
                      <li key={idx} id={`render-after-class-${idx+1}`}><Link style={{textTransform: 'capitalize'}} onClick={() => {
                        closeFilter();
                        let query = {};
                        query['vung-mien'] = item.name;
                        browserHistory.push(
                            {
                             pathname: "/tim-kiem",
                             query: query
                          }
                        )
                      }}>{item.name}</Link></li>
                    )
                  }
                })
              }
            </ul>
          :
          null
        }
      </div>
    )
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
}),)(HeaderSearch);
