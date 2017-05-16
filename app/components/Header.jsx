import React from 'react';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { browserHistory } from 'react-router';

import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import Dialog from 'material-ui/Dialog';

import Login from './Login.jsx';
import Register from './Register.jsx';
import JoinExamDialog from './JoinExamDialog.jsx';

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.handleResize = this.handleResize.bind(this);
    this.state = {
      height: window.innerHeight,
      showModal: false,
      dialogType: ''
    }
  }
  handleResize(e) {
      this.setState({height: window.innerHeight});
  }
  componentDidMount() {
      window.addEventListener('resize', this.handleResize);
  }
  componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
  }
  handleLogout(){
    let { users, logout } = this.props;
    if(this.props.logout && users.userId){
      this.props.logout(users.userId,localStorage.getItem('Meteor.loginToken')).then(({data}) => {
        if(data.logoutUser){
          localStorage.removeItem('Meteor.loginToken');
          this.props.loginCommand({});
        }
      })
    }
  }
  render() {
    let { users } = this.props;
    let { dialogType } = this.state;
    return(
      <div style={{flexDirection:'column', width:'auto'}}>
        <nav className="navbar navbar-default navbar-fixed-top " style={{backgroundColor: '#2b3a41', border: 0}}>
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="/">
                <img src="/public/imgs/logo.png" alt="Dispute Bills" />
              </a>
            </div>
            <div className="collapse navbar-collapse" id="myNavbar">
              <ul className="nav navbar-nav navbar-right" style={{paddingRight: 20}}>
                {
                  users.userId &&
                  <li style={{display:'inline'}}><a onClick={() => browserHistory.push('/profile/'+users.userId)}>
                  <img src={users.currentUser.image ? users.currentUser.image : '/public/imgs/userImage.jpg'} alt="Nature" style={{borderRadius: '50%',width:40, height: 40}}/><span style={{paddingLeft: 10, color: 'white'}}>{users.currentUser.name}</span></a></li>
                }
                {
                  !users.userId &&
                  <li style={{marginRight: 20}}><a onClick={() => this.setState({showModal: true})} className="btn btn-sm navbar-btn" style={{color: 'white', borderColor: 'white', padding: 8, width: 90}}>Đắng nhập</a></li>
                }
                {
                  !users.userId &&
                  <li style={{marginRight: 20}}><a onClick={() => this.setState({showModal: true, dialogType: 'register'})} href="#" className="btn btn-sm navbar-btn" style={{color: 'white', borderColor: 'white', padding: 8, width: 90}}>Đắng kí</a></li>
                }
                {
                  users.userId &&
                  <li><a onClick={() => this.handleLogout()} className="btn btn-sm navbar-btn" style={{color: 'white', borderColor: 'white', padding: 8, width: 90}}>Đắng xuất</a></li>
                }
              </ul>
            </div>
          </div>
        </nav>
        <Dialog
          modal={true}
          open={this.state.showModal}
          contentStyle={{minHeight:'60%'}}
        >
          <div className="modal-dialog" style={{width: 'auto', margin: 0}}>
              <div className="modal-content">
                <div className="modal-body" style={{maxHeight:this.state.height - 300, overflowY: 'auto', overflowX: 'hidden'}}>
                  <div>
                    <span className="close" onClick={() => this.setState({showModal: false})}>&times;</span>
                  </div>
                  {
                    dialogType === 'register'  ?
                    <Register {...this.props} handleClose={() => this.setState({showModal: false})}/> :
                    <Login {...this.props} handleClose={() => this.setState({showModal: false, dialogType: ''})}/>
                  }
                </div>
              </div>
          </div>
        </Dialog>
      </div>
    )
  }
}
const LOGOUT = gql`
  mutation logout($userId: String, $token: String) {
    logoutUser(userId: $userId, token: $token)
  }
`;
export default compose(
  graphql(LOGOUT,{
      props:({mutate})=>({
      logout : (userId,token) =>mutate({variables:{userId,token}})
    })
  }),
)(Header);
