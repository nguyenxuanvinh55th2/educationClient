import React from 'react';
import Slider from 'react-slick';
import {Link, browserHistory} from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import __ from 'lodash';

class SliderInter extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { data } = this.props;
    var settings = {
      arrows: true,
      dots: true,
      speed: 500,
      infinite: true,
      slidesToShow: 1,
      autoplay: true,
      slidesToScroll: 1,
      swipeToSlide: false,
      draggable: false
    };
    return (
      <div className="banner-inter">
        {
          data.sliders && data.sliders.length ?
          <Slider {...settings}>
          {
            data.sliders.map(item => (
              <div key={item._id} className="item-banner-inter bg" style={{
                backgroundImage: "url('" + item.image.file + "')"
              }}>
                <div className="container">
                  <div className="table-div">
                    <div className="table-cell">
                      <h1>{item.title}</h1>
                      <h3>{item.description}</h3>
                      <p><Link to={item.link ? item.link : ''} target="_blank" className="btn-search-tour">LIÊN HỆ</Link></p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
          </Slider> :
          <div style={{height: 123, textAlign: 'center'}}></div>
        }
      </div>
    );
  }
}

const ADVERTISEMENT_QUERY = gql `
    query sliders($type: String) {
        sliders(type: $type) {
          _id
          name
          title
          description
          image {
            _id
            file
          }
          type
          createdAt
          createdBy {
            _id
            username
          }
          link
          isShow
        }
}`

export default compose(
  graphql(ADVERTISEMENT_QUERY, {
    options: () => ({
      variables: { type: 'bottom' },
      fetchPolicy: 'cache-and-network'
    })
  }),
)(SliderInter);
