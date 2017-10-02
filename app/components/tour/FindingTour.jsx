import React from 'react';
import { Link } from 'react-router'
import TourItem from './TourItem.jsx'
// import HeaderSearch from './HeaderSearch.jsx';
export default class TourTypeFind extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    let query = this.props.location.query;
    let queryString = {
      isFinding: true,
      info: this.props.location.query
    }
    return (
      <div>
        {/* <HeaderSearch {...this.props}/> */}
        <ol className="breadcrumb" style={{marginBottom: 0, backgroundColor: 'white'}}>
          <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
          {
            query['ten-tour'] ? <li className="breadcrumb-item active" style={{textTransform: 'capitalize'}}>{`Tên: ${query['ten-tour']}`}</li>
            : null
          }
          {
            query['loai-hinh-tour'] ? <li className="breadcrumb-item active" style={{textTransform: 'capitalize'}}>{`Loại hình: ${query['loai-hinh-tour']}`}</li>
            : null
          }
          {
            query['vung-mien'] ? <li className="breadcrumb-item active" style={{textTransform: 'capitalize'}}>{`Vùng miền: ${query['vung-mien']}`}</li>
            : null
          }
          {
            query['dia-diem-du-lich'] ? <li className="breadcrumb-item active" style={{textTransform: 'capitalize'}}>{`Địa điểm: ${query['dia-diem-du-lich']}`}</li>
            : null
          }
          {
            query['ngay-khoi-hanh'] ? <li className="breadcrumb-item active" style={{textTransform: 'capitalize'}}>{`Thời gian: ${query['ngay-khoi-hanh']}`}</li>
            : null
          }
        </ol>
        <TourItem {...this.props} query={JSON.stringify(queryString)} />
      </div>
    )
  }
}
