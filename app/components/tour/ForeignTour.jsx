import React from 'react'
import {Link} from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import __ from 'lodash';

import TourItem from './TourItem.jsx'
// import HeaderSearch from './HeaderSearch.jsx';
class ForeignTour extends React.Component {
  constructor(props) {
    super(props)
  }
  componentWillMount(){
    if(this.props.changeHeader){
      this.props.changeHeader('tour-nuoc-ngoai');
    }
  }
  render() {
    return (
      <div>
        {/* <HeaderSearch {...this.props} /> */}
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
                backgroundImage: "url('/imgs/nuocngoai.jpg')"
              }}>
              <div className="container">
                <div className="table-div">
                  <div className="table-cell">
                    <h2>TOUR NƯỚC NGOÀI
                    </h2>
                    <h4>KHÁM PHÁ THẾ GIỚI MUÔN MÀU QUA NHỮNG CHUYẾN ĐI</h4>
                  </div>
                </div>
              </div>
            </div>
          )
        }
        <TourItem {...this.props} query={JSON.stringify({active: true, isDomestic: false, isParent: true})} />
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
      type: 'foreignTour'
    },
    fetchPolicy: 'cache-and-network'
  })
}),)(ForeignTour);
