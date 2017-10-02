import React from 'react'
import {Link, browserHistory} from 'react-router';
import {Meteor} from 'meteor/meteor';
import moment from 'moment';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import __ from 'lodash';
class HotTour extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    return (
      <div className="tour-hot">
        <h2>TOUR ĐANG HOT</h2>
        {
          !this.props.data.hotTours ?
          <div className="loading item">
              <i className="fa fa-spinner fa-spin" style={{fontSize: 20}}></i>
          </div>
          :
          <div>
            <div className="row row-1">
              {
                __.map(__.chunk(this.props.data.hotTours, 3)[0], (tour,idx) => {
                  let image = tour.images && tour.images[0] && tour.images[0].file ? tour.images[0].file  : '/imgs/image-not-found.png';
                  let locations = '';
                  __.forEach(tour.holidayDestinations, (holi, idx) => {
                    locations += holi.name;
                    if(idx < (tour.holidayDestinations.length -1)){
                      locations += ' - ';
                    }
                  })
                  return (
                    <div key={idx} className="col-sm-4" onClick={() => {
                      let info = {
                        tour: {
                          name: tour.name,
                          code: tour.code,
                          slug: tour.slug
                        },
                        type: tour.type,
                        createdAt: moment.valueOf()
                      }
                      BPMCase.insert(info)
                      browserHistory.push(`/chi-tiet-tour/${tour.slug}`);
                    }}>
                      <div className="item bg" style={{
                        backgroundImage: `url(${image})`
                      }}>
                        <div className="table-div">
                          <div className="table-cell">
                            <h3 style={{textTransform: 'uppercase'}}>{tour.name}</h3>
                            <p style={{textTransform: 'capitalize'}}>{locations}</p>
                            <p>{tour.type.name ? tour.type.name : ''}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <div className="row row-1 margin-1" onClick={() => {
              browserHistory.push(`/chi-tiet-tour/${tour.slug}`);
            }}>
              {
                __.map(__.chunk(this.props.data.hotTours, 3)[1], (tour,idx) => {
                  let image = tour.images && tour.images[0] && tour.images[0].file ? tour.images[0].file  : '/imgs/image-not-found.png';
                  let locations = '';
                  __.forEach(tour.holidayDestinations, (holi, idx) => {
                    locations += holi.name;
                    if(idx < (tour.holidayDestinations.length -1)){
                      locations += ' - ';
                    }
                  })
                  return (
                    <div key={idx} className="col-sm-4">
                      <div className="item bg" style={{
                        backgroundImage: `url(${image})`
                      }}>
                        <div className="table-div">
                          <div className="table-cell">
                            <h3 style={{textTransform: 'uppercase'}}>{tour.name}</h3>
                            <p style={{textTransform: 'capitalize'}}>{locations}</p>
                            <p>{tour.type.name ? tour.type.name : ''}</p>
                          </div>
                        </div>
                        <Link to={`/chi-tiet-tour/${tour.slug}`} className="link"></Link>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        }
      </div>
    )
  }
}
const HOT_TOURS = gql `
    query hotTours($limit: Int){
        hotTours(limit: $limit) {
          _id code name slug ceoContent  isPromotion  price saleOff type{_id code name}
          images { _id fileName file} type { _id code name} holidayDestinations { _id code name}
        }
}`

export default compose(
  graphql(HOT_TOURS, {
    options: () => ({
      variables: {limit: 3},
      fetchPolicy: 'cache-and-network'
    })
  }),
)(HotTour);
