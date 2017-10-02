import React from 'react';
import Slider from 'react-slick';
import {Link} from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import __ from 'lodash';
import ReactPaginate from 'react-paginate';
import PaginationEvent from './PaginationEvent.jsx';
class AllItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      offset: 0,
      pageCount: 25
    }
  }
  handlePageClick(data){
    let element = document.getElementById("header-event")
    let alignWithTop = true;
    element.scrollIntoView(alignWithTop);
    this.props.findPost.loadMoreEntries(data.selected);
  }
  render(){
    return (
      <div className="tintuc-nong" id="header-event">
        {this.props.isNew ? <h2>TIN TỨC NÓNG HỔI</h2> : null}
        {
          this.props.findPost.posts ?
          <div>
            {
              __.map(this.props.findPost.posts, (post, idx) => {
                return (
                  <div key={idx} className="item">
                    <div className="row">
                      <div className="col-sm-3">
                        <img src={post.image && post.image.file ? post.image.file : '/imgs/image-not-found.png'} alt=""/>
                      </div>
                      <div className="col-sm-9">
                        <div className="text-item">
                          <h3>
                            <Link to={`/chi-tiet-chuong-trinh/${post.slug}`}>{post.title}</Link>
                          </h3>
                          <p className="info-news">
                            <span>
                              <i className="fa fa-user" aria-hidden="true"></i> &nbsp;
                              Admin</span>
                            <span>
                              <i className="fa fa-calendar" aria-hidden="true"></i> &nbsp;
                              {moment(post.createdAt).format('MMMM/DD/YYYY')}</span>
                          </p>
                          <p>{post.ceoContent}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            }
            <PaginationEvent {...this.props} handlePageClick={this.handlePageClick.bind(this)} query={this.props.findPost.variables.query}/>
          </div>
          : null
        }
      </div>
    )
  }
}
const ITEMS_PER_PAGE = 4;

const POSTS = gql `
    query findPost($query: String, $offset: Int, $limit: Int) {
      findPost(query: $query, offset: $offset, limit: $limit){
        _id title  ceoContent slug
        image {
          _id  file fileName
        }
      }
}`

export default compose (
  graphql(POSTS, {
    options: (ownProps) => {
      let query = {};
      if(ownProps.isNew){
        query = {
          active: true, isNew: true
        }
      }
      else if (ownProps.isPromotion) {
        query = {
          active: true, isPromotion: true
        }
      }
      return {
        variables: {
          query: JSON.stringify(query),
          offset: 0,
          limit: ITEMS_PER_PAGE
        },
        fetchPolicy: 'network-only'
      }
    },
    props: ({ ownProps, data: { loading, findPost, refetch, subscribeToMore, fetchMore, variables} }) => ({
     findPost: {
       posts: findPost,
       loading: loading,
       refetch: refetch,
       subscribeToMore: subscribeToMore,
       variables: variables,
       loadMoreEntries: (doubleIndex) => {
         return fetchMore({
           variables: {
             offset: doubleIndex * ITEMS_PER_PAGE
           },
           updateQuery: (previousResult, { fetchMoreResult }) => {
             if (!fetchMoreResult) { return previousResult; }
             return Object.assign({}, previousResult, {
               findPost:  fetchMoreResult.findPost,
             });
           },
         });
       }
     },
    }),
  })
)(AllItem);
