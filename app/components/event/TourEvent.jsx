import React from 'react';
import {Link, browserHistory} from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import __ from 'lodash';
import moment from 'moment';
class TourEvent extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    if(!this.props.data.findProduct){
      return (
        <div className="block" style={{minHeight: 300}}></div>
      )
    }
    return (
      <div className="block">
        <h2>Các tour gợi ý</h2>
        {
          __.map(this.props.data.findProduct, (tour, idx) => {
            let image = tour.images && tour.images[0] && tour.images[0].file ? tour.images[0].file : '/imgs/image-not-found.png';
            return (
              <div key={idx} className="block-content">
                <div className="img">
                  <Link to={`/chi-tiet-tour/${tour.slug}`} onClick={() => {
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
                  }}><img src={image} /></Link>
                </div>
                <div className="title">
                  <Link to={`/chi-tiet-tour/${tour.slug}`} onClick={() => {
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
                  }}>{tour.name}</Link>
                  <p style={{paddingLeft: 60, fontSize: 12, fontStyle: 'italic'}}>{tour.type.name}</p>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}
const POSTS = gql `
    query findProduct($query: String, $limit: Int) {
      findProduct(query: $query, limit: $limit){
        _id code name slug type { _id code name }
        images { _id fileName file}
      }
}`
export default compose(graphql(POSTS, {
  options: (ownProps) => {
    let query = {
      active: true,
      isChildrent: true
    };
    return {
      variables: {
        limit: 5, query: JSON.stringify(query)
      },
      fetchPolicy: 'network-only'
    }
  }
}),)(TourEvent);
