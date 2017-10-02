import React from 'react'
import {Link, browserHistory} from 'react-router';
import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import __ from 'lodash';
import { loadMore} from '../../javascript/loadMore.js';
import {heightEqua} from '../../javascript/convertHeight.js';
import DomesticTourPopup from './DomesticTourPopup.jsx';
class TourItem extends React.Component {
  constructor(props) {
    super(props)
    this.isShow = false;
    this.resize = false;
    this.state = {
      length: -1,
      tour: {},
      open: false
    }
  }
  componentDidUpdate() {
    if(this.props.findProduct.tours){
      let setItemTour = Meteor.setTimeout(() => {
        let description = document.getElementById(`render-after-tour-${this.props.findProduct.tours.length}`);
        if (description && !this.resize) {
          Meteor.clearTimeout(setItemTour);
          this.resize = true;
          heightEqua.init();
        }
      }, 500)
    }
    if(this.props.findProduct.tours){
      let setItem = Meteor.setTimeout(() => {
        let scroll = document.getElementById('scroll-to');
        if (scroll) {
          scroll.innerHTML = 'Loading....';
          loadMore(this.loadMoreEntries.bind(this))
          Meteor.clearTimeout(setItem)
        }
      }, 500)
    }
  }
  loadMoreEntries(){
    if(this.props.findProduct){
      if(this.state.length != __.uniqBy(this.props.findProduct.tours, '_id').length && this.props.findProduct.tours){
        this.setState({length: __.uniqBy(this.props.findProduct.tours, '_id').length}, () => {
          this.props.findProduct.loadMoreEntries();
          this.resize = false;
          let scroll = document.getElementById('scroll-to');
          if (scroll) {
            scroll.innerHTML = '';
          }
        })
      }
      else {
        let scroll = document.getElementById('scroll-to');
        if (scroll) {
          scroll.innerHTML = '';
        }
      }
    }
  }
  handleOnClick(tour){
    this.isShow = true;
    this.setState({tour, open: !this.state.open})
  }
  handleClose(){
    this.setState({tour: {}, open: false})
  }
  render() {
    if(!this.props.findProduct.tours){
      return (
        <div className="loading">
            <i className="fa fa-spinner fa-spin" style={{fontSize: 40}}></i>
        </div>
      )
    }
    else {
      if(this.props.findProduct.tours.length > 0){
        let data = __.uniqBy(this.props.findProduct.tours, '_id')
        return (
          <div className="DomesticTour-group">
            <div className="container">
              <div className="row">
                {
                  __.map(data,(tour, idx) => {
                    return (
                      <div key={idx} className="col-sm-4 DomesticTour-block" id={`render-after-tour-${idx+1}`}>
                        <div className="image">
                          <img src={tour.images && tour.images[0] && tour.images[0].file ? tour.images[0].file : '/imgs/image-not-found.png'} alt="Thông báo tour trong nước" className="img"/>
                          {
                            tour.isPromotion ? <span className="">Khuyến mãi</span> : null
                          }
                          <h3>{tour.name}</h3>
                        </div>
                        <div className="content">
                          <p>{tour.ceoContent}</p>
                        </div>
                        <div className="readmore">
                          <Link onClick={() => this.handleOnClick(tour)} className="btn btn-tour btn-readmore" data-toggle="tooltip" title="Xem thêm">Xem thêm</Link>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
              {
                this.props.findProduct.tours.length ?
                <div className="book-tour-link readmore">
                  <div id="scroll-to" style={{textAlign: 'right'}}></div>
                </div> : null
              }
            </div>
            {
              this.state.tour && this.state.tour._id && this.state.open ?
              <div id="PopupTour">
                <DomesticTourPopup {...this.props} open={this.state.open} keyValue={this.state.tour._id} handleClose={this.handleClose.bind(this)} parentTourId={this.state.tour._id}/>
              </div>
              : null
            }
          </div>
        )
      }
      else {
        return (
          <div className="content-nuocngoai">
            <div className="container">
              <h4>
                Chúng tôi đang trong quá trình hoàn thiện và bổ sung các tour du lịch
                <br/>
                Cảm ơn bạn đã ghé thăm!
              </h4>
              <img src="/imgs/tks.png" alt=""/>
            </div>
          </div>
        )
      }
    }
  }
}
const ITEMS_PER_PAGE = 12;

const POSTS = gql `
    query findProduct($query: String, $offset: Int, $limit: Int) {
      findProduct(query: $query, offset: $offset, limit: $limit){
        _id code name slug ceoContent  isPromotion  price saleOff
        images { _id fileName file}
      }
}`

export default compose (
  graphql(POSTS, {
    options: (ownProps) => {
      return {
        variables: {
          query: ownProps.query,
          offset: 0,
          limit: ITEMS_PER_PAGE
        },
        fetchPolicy: 'cache-and-network'
      }
    },
    props: ({ ownProps, data: { loading, findProduct, refetch, subscribeToMore, fetchMore} }) => {
      return {
       findProduct: {
         tours: findProduct,
         loading: loading,
         refetch: refetch,
         subscribeToMore: subscribeToMore,
         loadMoreEntries: () => {
           return fetchMore({
             variables: {
               query: ownProps.query,
               offset: findProduct.length
             },
             updateQuery: (previousResult, { fetchMoreResult }) => {
               if (!fetchMoreResult) { return previousResult; }
               return Object.assign({}, previousResult, {
                 findProduct:  [...previousResult.findProduct, ...fetchMoreResult.findProduct],
               });
             },
           });
         }
       },
      }
    },
  })
)(TourItem);
