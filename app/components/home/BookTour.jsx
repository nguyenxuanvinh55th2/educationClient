import React from 'react'
import {Link} from 'react-router';
import moment from 'moment';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import __ from 'lodash';
import accounting from 'accounting';
import {heightEqua} from '../../javascript/convertHeight.js';
class BookTour extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidUpdate() {
    if(this.props.data.bookTours){
      let setItem = Meteor.setTimeout(() => {
        let description = document.getElementById(`render-after-${this.props.data.bookTours.length}`);
        if (description) {
          heightEqua.init();
          Meteor.clearTimeout(setItem)
        }
      }, 500)
    }
  }
  render(){
    return (
      <div className="sec-book-tour bg" style={{
        backgroundImage: "url('/imgs/bg-book-tour.jpg')"
      }}>
        <div className="container">
          <h2>BOOK TOUR LIỀN TAY ĐƯỢC NGAY GIÁ TỐT</h2>
          {
            !this.props.data.bookTours ?
            <div className="loading item">
                <i className="fa fa-spinner fa-spin" style={{fontSize: 20}}></i>
            </div> :
            <div className="row">
              {
                __.map(this.props.data.bookTours, (tour, idx) => {
                  return (
                    <div key={idx} id={`render-after-${idx+1}`} className="col-sm-4">
                      <div className="item">
                        <div className="top-item">
                          <img src={tour.images && tour.images[0] && tour.images[0].file ? tour.images[0].file : '/imgs/image-not-found.png'} alt=""/>
                          <p className="box-rate">
                            <span></span>{accounting.formatNumber(tour.price) + ' ' + 'VND'}
                          </p>
                        </div>
                        <div className="text-item">
                          <h3>
                            <Link to={`/chi-tiet-tour/${tour.slug}`}>{tour.name}</Link>
                          </h3>
                          <p>{tour.ceoContent}</p>
                        </div>
                        <p>
                          <Link to={'/lien-he'} className="btn btn-tour" onClick={() => {
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
                          }}>ĐẶT TOUR NGAY</Link>
                        </p>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          }
        </div>
      </div>
    )
  }
}
const BOOK_TOURS = gql `
    query bookTours($limit: Int){
        bookTours(limit: $limit) {
          _id code name slug ceoContent  isPromotion  price saleOff type {_id code name}
          images { _id fileName file}
        }
}`

export default compose(
  graphql(BOOK_TOURS, {
    options: () => ({
      variables: {limit: 3},
      fetchPolicy: 'cache-and-network'
    })
  }),
)(BookTour);
