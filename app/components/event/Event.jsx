import React from 'react'
import {Link} from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import __ from 'lodash';

import SliderEvent from '../slider/SliderEvent.jsx';
import AllItem from './AllItem.jsx'
class Event extends React.Component {
  constructor(props) {
    super(props)
  }
  componentWillMount() {
    if (this.props.changeHeader) {
      this.props.changeHeader('event');
    }
  }
  render() {
    return (
      <div>
        {
          (this.props.data.advertisements && this.props.data.advertisements.length) ?  (
            <div className="banner bg" style={{
              backgroundImage: "url('" + this.props.data.advertisements[0].image.file + "')"
            }}>
              <div className="container">
                <div className="table-div">
                  <div className="table-cell">
                    <h2>{this.props.data.advertisements[0].name}</h2>
                    <h4>{this.props.data.advertisements[0].title}</h4>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="banner bg" style={{
              backgroundImage: "url('/imgs/tintuc.jpg')"
            }}>
              <div className="container">
                <div className="table-div">
                  <div className="table-cell">
                    <h2>Tin tức và Sự kiện</h2>
                    <h4>Liên tục cập nhật tin tức về những điểm đến thú vị, những chương trình giảm giá nóng hổi.
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          )
        }
        <div className="sec-tintuc tintuc-and-sukien">
          <div className="container">
            <h2>SỰ KIỆN SẮP DIỄN RA</h2>
            <div className="slider-tintuc">
              <div className="row">
                <SliderEvent/>
              </div>
            </div>
            <AllItem {...this.props} isNew={true}/>
          </div>
        </div>
      </div>
    )
  }
}

class PromotionEventForm extends React.Component {
  constructor(props) {
    super(props)
  }
  componentWillMount() {
    if (this.props.changeHeader) {
      this.props.changeHeader('promotion');
    }
  }
  render(){
    return (
      <div>
        {
          (this.props.data.advertisements && this.props.data.advertisements.length) ?  (
            <div className="banner bg" style={{
              backgroundImage: "url('" + this.props.data.advertisements[0].image.file + "')"
            }}>
              <div className="container">
                <div className="table-div">
                  <div className="table-cell">
                    <h2>{this.props.data.advertisements[0].name}</h2>
                    <h4>{this.props.data.advertisements[0].title}</h4>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="banner bg" style={{
              backgroundImage: "url('/imgs/promotion.jpg')"
            }}>
              <div className="container">
                <div className="table-div">
                  <div className="table-cell">
                    <h2>Khuyến mãi</h2>
                    <h4>Liên tục cập nhật những chương trình khuyến mãi.
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          )
        }
        <div className="sec-tintuc tintuc-and-sukien">
          <div className="container">
            <h2>CHƯƠNG TRÌNH KHUYẾN MÃI</h2>
            <AllItem {...this.props} isPromotion={true}/>
          </div>
        </div>
      </div>
    )
  }
}

const ADVERTISEMENT_QUERY = gql `
    query advertisements($type: String) {
        advertisements(type: $type) {
          _id
          name
          title
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

export default compose(graphql(ADVERTISEMENT_QUERY, {
  options: () => ({
    variables: {
      type: 'event'
    },
    fetchPolicy: 'network-only'
  })
}),)(Event);

export const PromotionEvent = graphql(ADVERTISEMENT_QUERY, {
  options: () => ({
    variables: {
      type: 'promotion'
    },
    fetchPolicy: 'network-only'
  })
})(PromotionEventForm);
