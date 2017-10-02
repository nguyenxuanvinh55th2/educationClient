import React from 'react'
import {Helmet} from "react-helmet";
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import __ from 'lodash';
import {Link} from 'react-router';
class EventInfo extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    return (
      <div className="tintuc-and-sukien tintuc-and-sukien-home">
        <div className="container">
          <h2>TIN TỨC VÀ SỰ KIỆN</h2>
          <div className="info-title">
            <p>Liên tục cập nhật tin tức về những điểm đến thú vị, những chương trình giảm giá nóng hổi.
              <br/>Tổ chức những sự kiện uy tín, chất lượng.</p>
          </div>
          {
            this.props.data.posts ?
            <div className="row">
              {
                __.map(this.props.data.posts, (post, idx) => {
                  return (
                    <div key={idx} className="col-sm-4">
                      <div className="item">
                        <img src={post.image && post.image.file ? post.image.file : '/imgs/image-not-found.png'} alt=""/>
                        <div className="text-item">
                          <h3>
                            <Link to={`/chi-tiet-chuong-trinh/${post.slug}`}>{post.title}</Link>
                          </h3>
                          <p className="info-news">
                            <span>
                              <i className="fa fa-user" aria-hidden="true"></i>&nbsp;
                              Admin</span>
                            <span>
                              <i className="fa fa-calendar" aria-hidden="true"></i>&nbsp;
                              {moment(post.createdAt).format('MMMM/DD/YYYY')}</span>
                          </p>
                          <p>{post.ceoContent}</p>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            :
            <div className="loading item">
                <i className="fa fa-spinner fa-spin" style={{fontSize: 20}}></i>
            </div>
          }
        </div>
      </div>
    )
  }
}

const POST_QUERY = gql `
    query posts($limit: Int, $query: String){
      posts(limit: $limit, query: $query) {
      _id title  ceoContent createdAt slug
      image {
        _id  file fileName
      }
    }
}`

export default compose(graphql(POST_QUERY, {
  options: (ownProps) => {
    let query = {
      $or: [{isEvent: true},{isNew: true}]
    };
    return {
      variables: {
        limit: 3, query: JSON.stringify(query)
      },
      fetchPolicy: 'cache-and-network'
    }
  }
}),)(EventInfo);
