import React from 'react';
import Slider from 'react-slick';
import {Link} from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import __ from 'lodash';
import {heightEqua} from '../../javascript/convertHeight.js';
class SliderEvent extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidUpdate() {
    if(this.props.sliderevent.posts){
      let setItem = Meteor.setTimeout(() => {
        let description = document.getElementById(`render-after-slider-${this.props.sliderevent.posts.length}`);
        if (description) {
          heightEqua.init();
          Meteor.clearTimeout(setItem)
        }
      }, 500)
    }
  }
  render() {
    var settings = {
      arrows: true,
      dots: false,
      speed: 500,
      infinite: true,
      slidesToShow: 3,
      autoplay: true,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            arrows: true
          }
        }
      ]
    };
    return (
      <div>
        {
          this.props.sliderevent && this.props.sliderevent.posts && this.props.sliderevent.posts.length ?
          <Slider {...settings}>
            {
              __.map(this.props.sliderevent.posts, (post, idx) => {
                return (
                  <div key={idx} id={`render-after-slider-${idx+1}`} className="col-sm-4">
                    <div className="item">
                      <img src={post.image && post.image.file ? post.image.file : '/imgs/image-not-found.png'} alt=""/>
                      <div className="text-item">
                        <h3>
                          <Link to={`/chi-tiet-chuong-trinh/${post.slug}`}>{post.title}</Link>
                        </h3>
                        <p className="info-news">
                          <span>
                            <i className="fa fa-user" aria-hidden="true"></i>&nbsp;
                            Admin</span>
                          <span>
                            <i className="fa fa-calendar" aria-hidden="true"></i>&nbsp;
                            {moment(post.createdAt).format('MMMM/DD/YYYY')}</span>
                        </p>
                        <p>{post.ceoContent}</p>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </Slider>
          :
          <div></div>
        }
      </div>
    );
  }
}
const POST_QUERY = gql `
    query posts($limit: Int, $query: String){
      posts(limit: $limit, query: $query) {
      _id title  ceoContent createdAt slug
      image {
        _id  file fileName
      }
    }
}`

export default compose(graphql(POST_QUERY, {
  options: (ownProps) => {
    let query = {isEvent: true};
    return {
      variables: {
        limit: null, query: JSON.stringify(query)
      },
      fetchPolicy: 'cache-and-network'
    }
  },
  name: 'sliderevent'
}),)(SliderEvent);
