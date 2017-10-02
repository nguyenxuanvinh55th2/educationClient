import React from 'react';
import Slider from 'react-slick';
import {Link} from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

class SliderAds extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { data } = this.props;
    var settings = {
      dots: false,
      speed: 500,
      infinite: true,
      slidesToShow: 1,
      autoplay: true,
      vertical: true,
      slidesToScroll: 1
    };
    return (
      <div className="slider-ads">
        {
          (data.advertisements && data.advertisements.length) ?
          <Slider {...settings}>
            {
              data.advertisements.map((item, idx) => (
                <div key={idx} className="item-slider-ads bg" style={{
                  backgroundImage: "url('" + item.image.file + "')",
                  height: 123
                }}>
                  <a href="#" className="link"></a>
                </div>
              ))
            }
          </Slider> : <div></div>
        }
      </div>
    );
  }
}

const ADVERTISEMENT_QUERY = gql `
    query advertisements($type: String) {
        advertisements(type: $type) {
          _id
          name
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
          isShow
        }
}`

export default compose(
  graphql(ADVERTISEMENT_QUERY, {
    options: () => ({
      variables: { type: 'header' },
      fetchPolicy: 'cache-and-network'
    })
  }),
)(SliderAds);
