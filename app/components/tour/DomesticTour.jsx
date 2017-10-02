import React from 'react'
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import __ from 'lodash';
import {Link} from 'react-router';
import {Helmet} from "react-helmet";

import TourItem from './TourItem.jsx'
import DomesticTourPopup from './DomesticTourPopup.jsx';
// import HeaderSearch from './HeaderSearch.jsx';
class DomesticTour extends React.Component {
  constructor(props) {
    super(props)
  }
  componentWillMount(){
    if(this.props.changeHeader){
      this.props.changeHeader('tour-trong-nuoc');
    }
  }
  render() {
    return (
      <div>
        {/* <HeaderSearch {...this.props}/> */}
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
                backgroundImage: "url('/imgs/beach_fun.jpg')"
              }}>
              <div className="container">
                <div className="table-div">
                  <div className="table-cell">
                    <h2>TOUR TRONG NƯỚC</h2>
                    <h4>GIỚI THIỆU CÁC TOUR DU LỊCH HIỆN ĐANG CÓ</h4>
                  </div>
                </div>
              </div>
            </div>
          )
        }
        <TourItem {...this.props} query={JSON.stringify({active: true, isDomestic: true, isParent: true})}/>
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
        }
}`

export default compose(graphql(ADVERTISEMENT_QUERY, {
  options: () => ({
    variables: {
      type: 'countryTour'
    },
    fetchPolicy: 'cache-and-network'
  })
}),)(DomesticTour);
