import React from 'react';
import {Link} from 'react-router';
import { Session } from 'meteor/session';
import { createContainer } from 'react-meteor-data';
import moment from 'moment';

class ContentChatBox extends React.Component{
	constructor(props) {
		super(props);
		this.state = {message: ''};
		this.flat = false;
	}

	render(){
		let { message } = this.state;
		let { users } = this.props;
		return(
			<div className="chat-content">
				<div className="support-staff">
					<div className="avatar-support-staff">
						<img src="https://cdn3.iconfinder.com/data/icons/service-staff/788/reception_administrator_staff_hotel_front_avatar_profile-512.png" className="img" />
					</div>
					<div className="info-support-staff">
						{/*<p className="name">Nguyễn Ngọc Ánh</p>*/}
						<p className="duty">Tư vấn viên</p>
						<ul className="option list-inline list-unstyled">
							<li><Link onClick={() => {
									let _id = localStorage.getItem('chatToken');
									localStorage.removeItem('chatToken');
									Chats.remove({_id});
									this.props.hideChatContent();
								}}>Kết thúc</Link></li>
						</ul>
					</div>
				</div>
				<div className="chat-data-form-content">
					{
						this.props.chat &&
						<div>
							<p className="text-center"><b>{ users.length ? 'Bộ phận khách hàng đang online!' : 'Bộ phận khách hàng đang offline!'}</b></p>
							<p className="text-center">{ users.length ? 'Vui lòng gửi tin nhắn để được hỗ trợ ...' : 'Tin nhắn của quý khách sẽ được phản hồi trong thời gian sớm nhất' }</p>
						</div>
					}
					{
						this.props.chat ?
						this.props.chat.content.map((item, idx) => {
							if(item.isCustomer) {
								return (
									<div key={idx} className="chatblock me">
										<p className="send-at">{ moment(item.createdAt).format('HH:mm') }</p>
										<p className="chat-name">Bạn</p>
										<p className="content"><span>{item.message}</span></p>
									</div>
								)
							} else {
									return (
										<div key={idx} className="chatblock support">
											<p className="send-at">{ moment(item.createdAt).format('HH:mm') }</p>
											<p className="chat-name">{this.props.chat.username}</p>
											<p className="content"><span>{item.message}</span></p>
										</div>
									)
							}
						}) : <div></div>
					}
				</div>
				<div className="form-group chat-form">
					<textarea className="form-control" value={this.state.message} placeholder="Nội dung chat" onKeyDown={(e) => {
						let token = localStorage.getItem('chatToken');
						var keyCode = e.keyCode;
						if(message && keyCode == 13) {
							Chats.update({_id: token}, {$push: {
								content: {
									isCustomer: true,
									message,
									createdAt: moment().valueOf()
								}
							}});
							Chats.update({_id: token}, {$set: {
								haveNew: true,
								updatedAt: moment().valueOf()
							}});
							this.setState({message: ''});
							e.target.value = '';
						}
					}}
					onChange={({target}) => {
							this.setState({message: target.value});
					}}>
						{ message }
					</textarea>
				</div>
			</div>
		)
	}
}

export default createContainer((ownProps) => {
  Meteor.subscribe('chats');
	let chatToken = localStorage.getItem('chatToken');
	return {
		chat: chatToken ? Chats.findOne({_id: chatToken}) : null,
	}
}, ContentChatBox);
