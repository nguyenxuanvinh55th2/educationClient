import React from 'react'
import {Link, browserHistory} from 'react-router';
import moment from 'moment';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import __ from 'lodash';

class FindingType extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    if(!this.props.data.classifies){
      return (
        <div className="sec-timkiem-loaihinh bg" style={{
          backgroundImage: "url('/imgs/bg_timkiem_loaihinh.png')"
        }}>
          <div className="container">
            <h2>TÌM KIẾM THEO LOẠI HÌNH TOUR</h2>
            <p>
              Là một trong những đơn vị hoạt động kinh doanh du lịch tại Việt Nam, EVi Tour cung cấp những loại hình dịch vụ du lịch đa dạng đáp ứng nhiều đối tượng khách hàng trong và ngoài nước</p>
            <ul className="list-item">
              <li>
                <Link className="bg" style={{
                  backgroundImage: "url('/imgs/white.png')"
                }}>Sinh thái</Link>
              </li>
              <li>
                <Link className="bg" style={{
                  backgroundImage: "url('/imgs/white.png')"
                }}>Biển đảo</Link>
              </li>
              <li>
                <Link className="bg" style={{
                  backgroundImage: "url('/imgs/white.png')"
                }}>Tour mice</Link>
              </li>
              <li>
                <Link className="bg" style={{
                  backgroundImage: "url('/imgs/white.png')"
                }}>Picnic</Link>
              </li>
            </ul>
          </div>
        </div>
      )
    }else {
      return (
        <div className="sec-timkiem-loaihinh bg" style={{
          backgroundImage: "url('/imgs/bg_timkiem_loaihinh.png')"
        }}>
          <div className="container">
            <h2>TÌM KIẾM THEO LOẠI HÌNH TOUR</h2>
            <p>
              Là một trong những đơn vị hoạt động kinh doanh du lịch tại Việt Nam, EVi Tour cung cấp những loại hình dịch vụ du lịch đa dạng đáp ứng nhiều đối tượng khách hàng trong và ngoài nước</p>
            <ul className="list-item">
              {
                __.map(this.props.data.classifies, (category, idx) => {
                  let image = category.image && category.image.file ? category.image.file : '/imgs/image-not-found.png';
                  return (
                    <li key={idx}>
                      <Link to={`/loai-hinh-tour/${category.slug}`} className="bg" style={{
                        backgroundImage: `url(${image})`
                      }}>{category.name}</Link>
                    </li>
                  )
                })
              }
            </ul>
          </div>
        </div>
      )
    }
  }
}
const QUERY = gql `
    query classifies($query: String, $limit: Int){
      classifies(query: $query, limit: $limit) {
      _id  name slug
      image {
        _id  file fileName
      }
    }
}`
export default compose(graphql(QUERY, {
  options: (ownProps) => {
    let query = {
      active: true, isFinding: true
    };
    return {
      variables: {
        query: JSON.stringify(query),
        limit: 4
      },
      fetchPolicy: 'cache-and-network'
    }
  },
})
)(FindingType);
