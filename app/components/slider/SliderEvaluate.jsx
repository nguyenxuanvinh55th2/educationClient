import React from 'react';
import Slider from 'react-slick';
import {Link} from 'react-router';
import { createContainer } from 'react-meteor-data';
import __ from 'lodash';

class SliderEvaluate extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    var settings = {
      arrows: true,
      dots: true,
      speed: 500,
      infinite: true,
      slidesToShow: 1,
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
    let pages = Math.ceil(this.props.feedBacks.length / 3);
    let data = []
    //__.forEach(data, item => item = ['', '', '']);
    for(let i = 0; i < pages; i++) {
      let item = [];
      for(let j = (i * 3); j < (i * 3) + 3; j++) {
        if(this.props.feedBacks[j]) {
          item.push(this.props.feedBacks[j]);
        }
      }
      data.push(item);
    }
    return (
      <div className="slider-danhgia">
        <Slider {...settings}>
          {
            data.length > 0 ?
            data.map((item, idx) => (
              <div key={idx} className="item-slider-danhgia bg" style={{
                backgroundImage: "url('/imgs/img1-slider-danhgia.jpg')"
              }}>
                <div className="container">
                  <h2>ĐÁNH GIÁ CỦA KHÁCH HÀNG</h2>
                  <div className="row">
                    {
                      item.map((subItem, id) => (
                        <div key={id} className="col-sm-4">
                          <div className="item-slider">
                            <h4>{subItem.name}
                            </h4>
                            <img src="/imgs/star.png" alt=""/>
                            <p>{subItem.feedBack}</p>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            )): <div></div>
          }
        </Slider>
      </div>
    );
  }
}

export default createContainer((ownProps) => {
  Meteor.subscribe('accountingObject');
  return {
    feedBacks: AccountingObjects.find({isFeedBack: true, status: 100}).fetch()
  }
}, SliderEvaluate);
