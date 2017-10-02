import React from 'react'
import {Helmet} from "react-helmet";
import {hideDomesticTourPopup, loadDomesticTourPopup} from '../../javascript/Popup.js';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import __ from 'lodash';
import {Link, browserHistory} from 'react-router'
import Dialog from 'material-ui/Dialog';
import moment from 'moment';
const customContentStyle = {
  width: window.innerWidth <= 768 ? 700 : window.innerWidth > 768 && window.innerWidth <= 992 ? 900 : 1100,
  maxWidth: 'none'
};

class PopupTrongnuoc extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: true
    }
  }
  handleClose(){
    this.setState({
      open: true
    })
    this.props.handleClose();
  }
  handleClose(){
    this.setState({open: false});
    this.props.handleClose();
  }
  render() {
    return (
      <Dialog
        modal={false}
        contentStyle={customContentStyle}
        open={this.props.open}
         onRequestClose={this.handleClose.bind(this)}
         autoScrollBodyContent={true}
      >
        <div id="PopupTOur">
          <h2>CHỌN LỊCH TRÌNH PHÙ HỢP</h2>
           <div className="container-DomesticTour-popup">
             {
               this.props.data.tours ?
               <div className="row">
                 {
                  __.map(this.props.data.tours, (tour, idx) => {
                    return (
                      <div key={idx} className="col-sm-12 col-md-4 DomesticTour-schedule">
                        <div className="header">
                          <div className="img">
                            <img src={tour.images && tour.images[0] && tour.images[0].file ? tour.images[0].file : '/imgs/image-not-found.png'} className="img-full"/>
                          </div>
                          <Link  data-toggle="tooltip" onClick={() => {
                            hideDomesticTourPopup();
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
                            browserHistory.push(`/chi-tiet-tour/${tour.slug}`)
                          }}>{tour.type.name}</Link>
                        </div>
                        <div className="content">
                          <p>{tour.type.description}</p>
                        </div>
                      </div>
                    )
                  })
                }
               </div>
               :
               <div className="loading">
                   <i className="fa fa-spinner fa-spin" style={{fontSize: 20}}></i>
               </div>
             }
            <div className="row refer">
              <p>Bạn có nhu cầu đặt tour theo lịch trình khác? Bạn cảm thấy lịch trình này chưa đủ thú vị?</p>
              <p>Truy cập ngay team building để tạo lịch trình cho chính bạn!</p>
              <Link to={"/team-building"} className="btn" data-toggle="tooltip" title="Teambuilding">TEAMBUILDING</Link>
            </div>
          </div>
        </div>
      </Dialog>
    )
  }
}
const TOUR_QUERY = gql `
    query tours($query: String,$limit: Int){
        tours(query: $query,limit: $limit) {
          _id code name slug ceoContent
          type { _id code name description}
          images {
            _id
            file
          }
        }
}`

export default compose(graphql(TOUR_QUERY, {
  withRef: true,
  options: (ownProps) => {
    let query = {};
    query = {
      active: true,
      isChildrent: true,
      "tour._id": ownProps.parentTourId
    };
    return {
      variables: {
        query: JSON.stringify(query)
      },
      fetchPolicy: 'cache-and-network'
    }
  }
}),)(PopupTrongnuoc);
