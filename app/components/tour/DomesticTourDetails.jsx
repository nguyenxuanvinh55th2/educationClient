import React from 'react'
import {Link, browserHistory} from 'react-router';
import { graphql, compose } from 'react-apollo';
import { displayContactInfo } from '../../javascript/Popup.js';
import gql from 'graphql-tag';
import __ from 'lodash';
// import {Meteor} from 'meteor/meteor';
import { DetailPage404 } from '../wrap/Page404.jsx';
import Quill from 'quill';
class DomesticTourDetails extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    let { data } = this.props;
    if(!data.detailTour){
      if(data.loading){
        return (
          <div className="loading">
              <i className="fa fa-spinner fa-spin" style={{fontSize: 50}}></i>
          </div>
        )
      }
      else {
        return (
          <DetailPage404 />
        )
      }
    }
    else {
      let image = data.detailTour.images && data.detailTour.images[0] && data.detailTour.images[0].file ? data.detailTour.images[0].file : '/imgs/image-not-found.png'
      return (
        <div>
          <div className="banner bg" style={{
            backgroundImage: `url(${image})`
          }}>
            <div className="container">
              <div className="table-div">
                <div className="table-cell">
                  <h5>Chi tiết bảng chương trình</h5>
                  <h2 style={{textTransform: 'uppercase'}}>{data.detailTour.name}</h2>
                  <h4 style={{textTransform: 'uppercase'}}>{data.detailTour.title}</h4>
                </div>
              </div>
            </div>
            <div className="tab-tour">
              <ul >
                <li className="active" data-toggle="tooltip" title="Chương trình">
                  <a data-toggle="tab" href="#chuong-trinh">
                    <i className="fa fa-file-text-o" aria-hidden="true"></i>CHƯƠNG TRÌNH
                  </a>
                </li>
                <li data-toggle="tooltip" title="Bảng giá">
                  <a data-toggle="tab" href="#bang-gia">
                    <i className="fa fa-tag" aria-hidden="true"></i>BẢNG GIÁ
                  </a>
                </li>
                <li data-toggle="tooltip" title="Khách sạn">
                  <a data-toggle="tab" href="#khach-san">
                    <i className="fa fa-home" aria-hidden="true"></i>KHÁCH SẠN
                  </a>
                </li>
                <li data-toggle="tooltip" title="Thực đơn">
                  <a data-toggle="tab" href="#thuc-don">
                    <i className="fa fa-book" aria-hidden="true"></i>THỰC ĐƠN
                  </a>
                </li>
                <li data-toggle="tooltip" title="Điều khoản">
                  <a data-toggle="tab" href="#dieu-khoan">
                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i>ĐIỀU KHOẢN
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="tab-content container">
            <div id="chuong-trinh" className="tab-pane fade in active">
              <RenderEditor value={data.detailTour.detail.program} keyValue={'program'}/>
            </div>
            <div id="bang-gia" className="tab-pane fade">
              <RenderEditor value={data.detailTour.detail.priceTag} keyValue={'priceTag'}/>
            </div>
            <div id="khach-san" className="tab-pane fade">
              <RenderEditor value={data.detailTour.detail.hotel} keyValue={'hotel'}/>
            </div>
            <div id="thuc-don" className="tab-pane fade">
              <RenderEditor value={data.detailTour.detail.menu} keyValue={'menu'}/>
            </div>
            <div id="dieu-khoan" className="tab-pane fade">
              <RenderEditor value={data.detailTour.detail.terms} keyValue={'terms'}/>
            </div>
          </div>
          <div className="book-tour-link">
        		<Link to="" className="btn book-tour" title="book-tour" onClick={displayContactInfo}>Liên hệ đặt tour</Link>
            <div className="book-tour-contact-info">
        			<span className="email">info@trainghiemviet.com.vn</span>
        			<span className="phone">(+84) 886 526 444</span>
        		</div>
        	</div>
        </div>
      )
    }
  }
}
const QUERY = gql `
    query detailTour($slug: String){
      detailTour(slug: $slug) {
        _id code name title ceoContent
        detail { program, priceTag, hotel, menu, terms }
        images {
          _id fileName
          file
        }
      }
}`
export default compose(graphql(QUERY, {
  options: (ownProps) => {
    let query = {};
    query = {
      active: true
    };
    return {
      variables: {
        slug: ownProps.params.slug
      },
      fetchPolicy: 'cache-and-network'
    }
  }
}))(DomesticTourDetails);
class RenderEditor extends React.Component {
  constructor(props) {
    super(props)
    this.quillEditor = null;
  }
  componentDidMount() {
    let setItem = Meteor.setTimeout(() => {
      let description = document.getElementById(this.props.keyValue);
      if (description) {
        this.quillEditor = new Quill(description);
        this.quillEditor.root.innerHTML = this.props.value ? this.props.value : '';
        Meteor.clearTimeout(setItem)
      }
    }, 500)
  }
  render(){
    return (
      <div id={this.props.keyValue} ref={this.props.keyValue}>
      </div>
    )
  }
}
