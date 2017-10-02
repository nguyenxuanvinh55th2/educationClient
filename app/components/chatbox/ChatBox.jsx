import React from 'react'
import {Link} from 'react-router';
import { createContainer } from 'react-meteor-data';

import InfoChatBox from './InfoChatBox.jsx';
import ContentChatBox from './ContentChatBox.jsx';

import {showChatBox} from '../../javascript/ChatBox.js';
import {hideChatBox} from '../../javascript/ChatBox.js';

class ChatBox extends React.Component{
	constructor(props) {
		super(props);
		if(!localStorage.getItem('chatToken')) {
			this.state = {showChatContent: false};
		} else {
				this.state = {showChatContent: true};
		}
	}
	componentWillMount() {
		showChatBox();
		hideChatBox();
	}

	showChatContent() {
		this.setState({showChatContent: true});
	}

	hideChatContent() {
		this.setState({showChatContent: false});
	}

	render(){
		let { users } = this.props;
		return(
			<div>
				<div>
					<div className="showchatbox" style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}} onClick={showChatBox}>
						<i className="fa fa-circle" aria-hidden="true" style={{color: users.length ? 'green' : 'gray', marginLeft: -12, marginTop: 5, paddingRight: 5, fontSize: 12}}></i>
						<p>Nói chuyện với tư vấn viên</p>
						<span className="show-chat-box"><i className="fa fa-commenting" aria-hidden="true"></i></span>
					</div>
					<div className="chatbox">
						<div className="chat-overlay-text header" onClick={hideChatBox} style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
							<i className="fa fa-circle" aria-hidden="true" style={{color: users.length ? 'green' : 'gray', marginLeft: -12, marginTop: 7, paddingRight: 5, fontSize: 12}}></i>
							<p>Nói chuyện với tư vấn viên</p>
							<span className="close-chat-box">-</span>
						</div>
						{
							this.state.showChatContent ?
							<ContentChatBox users={users} hideChatContent={this.hideChatContent.bind(this)}/> :
							<InfoChatBox showChatContent={this.showChatContent.bind(this)}/>
						}
						<div className="chat-overlay-text footer">
							<Link to={'https://lokatech.net/'} target="_blank">Lokatech.net</Link>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default createContainer((ownProps) => {
	Meteor.subscribe('users');
	return {
		users: Meteor.users.find({'status.online': true}).fetch()
	}
}, ChatBox);
