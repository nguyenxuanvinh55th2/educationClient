import React from 'react';
import {Link} from 'react-router';
import moment from 'moment';

export default class InfoChatBox extends React.Component{
	constructor(props) {
		super(props);
		this.state = {showChatContent: false, name: '', mobile: '', placeError: ''};
		if(!localStorage.getItem('chatToken')) {
			this._id = Math.floor(Math.random()*89999+10000).toString();
		} else {
				this._id = localStorage.getItem('chatToken');
		}
	}
	render(){
		let { name, mobile, placeError } = this.state;
		return (
			<div className="chat-data-form">
				<p className="chat-data-form-header-text">Chào mừng bạn đến với hỗ trợ online</p>
				<div className="chat-data-form-input">
					<div className="form-group" style={{margin: 0}}>
						<input type="text" className="form-control" value={name} placeholder="Họ tên (*)" onChange={({target}) => {
								this.setState({name: target.value})
							}}
							onBlur={() => {
								if(!name) {
									this.setState({placeError: 'Trường này không được để trống'});
								} else {
										this.setState({placeError: null});
									}
							}}/>
					</div>
					<span style={{height: 25, margin: 0}} className="help-block">{placeError ? <font style={{color: 'red', fontSize: 14}}>{placeError}</font> : null}</span>
					<div className="form-group" style={{margin: 0}}>
						<input type="text" className="form-control" value={mobile} placeholder="Điện thoại" onChange={({target}) => {
								this.setState({mobile: target.value})
							}}/>
					</div>
					<span style={{height: 25, margin: 0}} className="help-block"></span>
					<p className="submit"><Link className="btn btn-tour" disabled={!name} onClick={() => {
							if(name) {
								Chats.insert({
									_id: this._id,
									user: {
										username: name,
										mobile
									},
									manager: {
										_id: '',
										username: ''
									},
									haveNew: true,
									content: [
									],
									updatedAt: moment().valueOf()
								});
								localStorage.setItem('chatToken', this._id)
								this.props.showChatContent();
								Meteor.call('sendMailNotification', {
				          content: name + ' ' + 'đã gửi tin nhắn',
				          title: 'Thông báo'
				        }, (err, res) => {
				          if (err) {
				            alert(err);
				          } else {
				            // success
				          }
				        });
								Meteor.call('sendNotification', {
			            note: 'khách hàng ' + name + ' ' + 'vừa gửi tin nhắn',
			            link: '/chatMangement',
			          }, (err, res) => {
			            if (err) {
			              alert(err);
			            } else {
			              // success
			            }
			          });
							}
						}}>Bắt đầu trò chuyện</Link></p>
				</div>
			</div>
		)
	}
}
