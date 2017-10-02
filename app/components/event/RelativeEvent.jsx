import React from 'react';
import {Link, browserHistory} from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import __ from 'lodash';
class RelativeEvent extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    if(!this.props.data.posts){
      return (
        <div className="block" style={{minHeight: 300}}></div>
      )
    }
    else {
      return (
        <div className="block">
          <h2>Có thể bạn quan tâm</h2>
          {
            __.map(this.props.data.posts,(post, idx) => {
              return (
                <div key={idx} className="block-content">
                  <div className="img">
                    <Link to={`/chi-tiet-chuong-trinh/${post.slug}`} ><img src={post.image && post.image.file ? post.image.file : '/imgs/image-not-found.png'} /></Link>
                  </div>
                  <div className="title">
                    <Link to={`/chi-tiet-chuong-trinh/${post.slug}`} >{post.title}</Link>
                  </div>
                </div>
              )
            })
          }
        </div>
      )
    }
  }
}
const POST_QUERY = gql `
    query posts($limit: Int, $query: String){
      posts(limit: $limit, query: $query) {
      _id title slug
      image {
        _id  file fileName
      }
    }
}`

export default compose(graphql(POST_QUERY, {
  options: (ownProps) => {
    let query = {
      active: true,
      _id: {$ne: ownProps._id},
      // $or: [{isNew: true}, {isEvent: true}]
    };
    return {
      variables: {
        limit: 5, query: JSON.stringify(query)
      },
      fetchPolicy: 'network-only'
    }
  }
}),)(RelativeEvent);
