import React from 'react';
import Slider from 'react-slick';
import {Link} from 'react-router';
import { createContainer } from 'react-meteor-data';
import __ from 'lodash';
import ReactPaginate from 'react-paginate';
class PaginationEvent extends React.Component {
  constructor(props) {
    super(props)
  }
  handlePageClick(data){
    if(this.props.handlePageClick){
      this.props.handlePageClick(data);
    }
  }
  render(){
    if(this.props.posts.length){
      return (
        <ReactPaginate previousLabel={<span aria-hidden="true">&laquo;</span>}
                   nextLabel={<span aria-hidden="true">&raquo;</span>}
                   breakLabel={<a>...</a>}
                   breakClassName={"break-me"}
                   pageCount={Math.ceil(this.props.posts.length / 4)}
                   marginPagesDisplayed={2}
                   pageRangeDisplayed={5}
                   onPageChange={this.handlePageClick.bind(this)}
                   containerClassName={"paginations"}
                   subContainerClassName={"pages paginations"}
                   activeClassName={"active"} />
      )
    }
    else {
      return <div></div>
    }
  }
}
export default createContainer((ownProps) => {
  Meteor.subscribe('posts');
  let query = {active: true}
  if(ownProps.query){
    if(typeof ownProps.query == 'string'){
      query = JSON.parse(ownProps.query);
    }
    else {
      query = ownProps.query
    }
  }
  return {
    posts: Posts.find(query, {_id: 1}).fetch()
  }
}, PaginationEvent);
