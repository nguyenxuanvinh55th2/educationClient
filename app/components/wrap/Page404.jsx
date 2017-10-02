import React from 'react';
import {Link} from 'react-router';
import Header from '../main/Header.jsx'
import Footer from '../main/Footer.jsx'
import {SetHeightPage404} from '../../javascript/convertHeight.js';
export default class Page404 extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
      open: false
    }
	}
	render() {
		return (
			<div>
				  <Header {...this.props} handleOpen={() => {this.setState({open: true});}}/>
					<DetailPage404 />
					<Footer {...this.props}/>
	        <div className="pin-top">
	          <i className="fa fa-angle-up" aria-hidden="true"></i>
	        </div>
			</div>
		)
	}
}
export class DetailPage404 extends React.Component {
	constructor(props) {
		super(props)
	}
	componentDidMount() {
		SetHeightPage404();
	}
	render(){
		return (
			<div id="Page404" className="text-center">
				<img src="/imgs/404page.jpg" alt="404Page" />
				<div className="text">
					<p className="Oop">Trang bạn truy cập không tồn tại</p>
					<p className="description">Có thể đường dẫn của bạn không đúng hoặc đã bị thay đổi</p>
					<Link to={'/'} >Quay trở lại trang chủ</Link>
				</div>
			</div>
		)
	}
}
