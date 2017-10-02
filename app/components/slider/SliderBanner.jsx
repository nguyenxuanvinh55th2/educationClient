import React from 'react';
import Slider from 'react-slick';
import {Link, browserHistory} from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import __ from 'lodash';

class SliderBanner extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    var settings = {
      arrows: true,
      dots: false,
      speed: 500,
      infinite: true,
      slidesToShow: 1,
      autoplay: false,
      slidesToScroll: 1,
      swipeToSlide: false,
      draggable: false
    };
    let { data } = this.props;
    return (
      <div className="banner-home">
        {
          data.sliders && data.sliders.length ?
          <Slider {...settings}>
          {
            data.sliders.map(item => (
              <div onClick={() => {
                  if(item.link) {
                    let link = JSON.parse(item.link);
                    browserHistory.push('/chi-tiet-chuong-trinh/' + link.slug)
                  }
                }} key={item._id} className="bg item-banner-home" style={{
                  cursor: 'pointer',
                  backgroundImage: "url('" + item.image.file + "')"
              }}>
                <div className="container">
                  <div className="table-div">
                    <div className="table-cell">
                      <h1>{item.name}</h1>
                      <p style={{textAlign: 'center'}}>{item.title}</p>
                    </div>
                  </div>
                </div>
                <div className="text-bottom">
                  <div className="container">
                    <p>{item.description}</p>
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
          isShow
          link
        }
}`

export default compose(
  graphql(ADVERTISEMENT_QUERY, {
    options: () => ({
      variables: { type: 'top' },
      fetchPolicy: 'cache-and-network'
    })
  }),
)(SliderBanner);
