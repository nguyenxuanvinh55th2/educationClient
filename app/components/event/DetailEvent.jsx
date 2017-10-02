import React from 'react';
import Slider from 'react-slick';
import {Link, browserHistory} from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import __ from 'lodash';
import { DetailPage404 } from '../wrap/Page404.jsx';
import TourEvent from './TourEvent.jsx';
import RelativeEvent from './RelativeEvent.jsx';
class DetailEvent extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidUpdate(){
    let description = document.getElementById('description');
    if(description) {
      description.innerHTML = this.props.detailEvent.postDetail && this.props.detailEvent.postDetail.content ? this.props.detailEvent.postDetail.content : '';
    }
  }
  render(){
    if(!this.props.detailEvent.postDetail){
      if(this.props.detailEvent.loading){
        return (
          <div className="loading">
              <i className="fa fa-spinner fa-spin" style={{fontSize: 50}}></i>
          </div>
        )
      }
      else {
        return (
          <DetailPage404 />
        )
      }
    }
    else {
      return (
        <div id="event-detail" className="container">
          <div className="main-content col-md-9">
            <div className="header">
              <img src={this.props.detailEvent.postDetail.image && this.props.detailEvent.postDetail.image.file ? this.props.detailEvent.postDetail.image.file : '/imgs/image-not-found.png'} alt="img1" />
              <div className="title">
                <h1>{this.props.detailEvent.postDetail.title}</h1>
                <span className="date-created">Viết ngày: {moment(this.props.detailEvent.postDetail.title.createdAt).format('MMMM/DD/YYYY')}</span>
              </div>
            </div>
            <div className="content">
              <div id="description"></div>
            </div>
          </div>
          <div className="sidebar col-md-3">
            <RelativeEvent {...this.props} _id={this.props.detailEvent.postDetail._id}/>
            <TourEvent {...this.props} />
          </div>
        </div>
      )
    }
  }
}
const POST = gql `
    query postDetail($slug: String){
        postDetail(slug: $slug) {
        _id title  ceoContent content createdAt
        image {
          _id  file fileName
        }
      }
}`
export default compose(graphql(POST, {
  options: (ownProps) => ({
    variables: {
      slug: ownProps.params.slug ? ownProps.params.slug : ''
    },
    fetchPolicy: 'network-only'
  }),
  name: 'detailEvent'
})
)(DetailEvent);
