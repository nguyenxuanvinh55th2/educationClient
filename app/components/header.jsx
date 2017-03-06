import React, { PropTypes, Component } from 'react'
import { Link, Router, browserHistory } from 'react-router'
import ReactDOM from 'react-dom'
import Notification from '../notification/notification.js'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

class UserImage extends Component {
  render() {
    return (
      <FormGroup style={{marginLeft: '20px'}}>
        <Button bsStyle="success" className="header-button" onClick={e =>{
            document.getElementById('userMenu').style.display = 'inline';
          }}>
          <img className="login-image" src={ this.props.userImage } />
        </Button>
      </FormGroup>
    )
  }
}

class NoteNotificate extends Component {
  render() {
    if(!this.props.show) {
      return (
        <div></div>
      )
    } else {
      return (
        <div className="noteNotificate">{ this.props.number }</div>
      )
    }
  }
}

class UserMenu extends Component {
  render() {
    return (
      <div id="userMenu">
        <div style={{marginBottom: '18px'}} onClick={e => {
            document.getElementById('userMenu').style.display = 'inline';
          }}>
          <div className="col-sm-5">
              <img style={{width: '80px', height: '80px'}} src={ this.props.image }></img>
          </div>
          <div className="col-sm-7">
              <h4 style={{width: '100%'}}><b>{ this.props.name }</b></h4>
          </div>
        </div>
        <div>
          <div className="col-sm-7">
            <Link to={"/profile/" + this.props.userId + "/wall" } className="btn btn-success" onClick={e => {
                document.getElementById('userMenu').style.display = 'none';
              }}>
              Trang cá nhân
            </Link>
          </div>
          <div className="col-sm-5">
            <Button bsStyle="primary" onClick={e => {
                this.props.onLogout();
                document.getElementById('userMenu').style.display = 'none';
                browserHistory.push('/');
              }}>Đăng xuất</Button>
          </div>
        </div>
      </div>
    )
  }
}

class Header extends Component {
  constructor(props) {
      super(props);
      this.state = {reRender: false};

      // parent = this;
      // Meteor.setTimeout(function(){
      //    parent.setState({
      //      rerender: true
      //    });
      // }, 1000);

      parent = this;
      this.keyWord = {
        value: null
      };
  }

  renderNotificateIcon(){
    // var number = 0;
    // var show = false;
    // if(this.props.data && !this.props.data.loading) {
    //   number = this.props.data.notification.filter(note => !note.read).length;
    //   if(number > 0)
    //     show = true
    // }
    // return (<NoteNotificate show={ show } number={ number }/>)
  }

  render() {
      console.log("this props ", this.props);
      let userId = '';
      let name = '';
      let image = '';
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      console.log(userInfo);
      if(userInfo) {
        userId = userInfo._id;
        name = userInfo.profileObj? userInfo.profileObj.name : userInfo.name;
        //image = userInfo.profileObj? userInfo.profileObj.imageUrl : userInfo.picture.data.url;
      }
      return (
        <div style={{width:'100%'}}>
          <div style={{width:'100%'}} className="header">
            {/*<Notification noteList={ this.props.data }/>*/}
            <UserMenu image={ image } name={ name } userId={ userId } onLogout={ this.props.logout }/>
            <form inline style={{width:'100%'}} onSubmit ={e => {
                e.preventDefault();
                let keyWord = ReactDOM.findDOMNode(this.keyWord).value;
                this.props.search(keyWord);
                browserHistory.push('/search/' + keyWord);
              }}>

              <IconButton style={{color: info.labelColor, width: buttonWidth, backgroundColor: info.backgroundColor}} iconStyle={{fontSize: iconSize, color: info.labelColor, marginTop: info.top, marginBottom: info.bottom, marginRight: info.right, marginLeft: info.left}} tooltip={info.tooltip?info.tooltip:"Tooltip"} onClick={this.buttonCommand.bind(this)}>
                <FontIcon style={{color, marginLeft: 3}} className="material-icons fa-2x">home</FontIcon>
              </IconButton>

              <IconButton style={{color: info.labelColor, width: buttonWidth, backgroundColor: info.backgroundColor}} iconStyle={{fontSize: iconSize, color: info.labelColor, marginTop: info.top, marginBottom: info.bottom, marginRight: info.right, marginLeft: info.left}} tooltip={info.tooltip?info.tooltip:"Tooltip"} onClick={this.buttonCommand.bind(this)}>
                <FontIcon style={{color, marginLeft: 3}} className="material-icons fa-2x">home</FontIcon>
              </IconButton>

              {/*<FormGroup style={{width: '60%', marginLeft: '20px'}}>
                <InputGroup style={{width: '100%'}}>
                  <FormControl type="text" ref={node => this.keyWord=node}/>
                    <IconButton style={{color: info.labelColor, width: buttonWidth, backgroundColor: info.backgroundColor}} iconStyle={{fontSize: iconSize, color: info.labelColor, marginTop: info.top, marginBottom: info.bottom, marginRight: info.right, marginLeft: info.left}} tooltip={info.tooltip?info.tooltip:"Tooltip"} onClick={this.buttonCommand.bind(this)}>
                      <FontIcon style={{color, marginLeft: 3}} className="material-icons fa-2x">home</FontIcon>
                    </IconButton>
                </InputGroup>
              </FormGroup>

              <FormGroup style={{marginLeft: '20px'}}>
                <Button bsStyle="success"  className="header-button" onClick = {e => {
                    document.getElementById('notification').style.display = 'inline'
                }}>
                  { this.renderNotificateIcon() }
                  <Glyphicon glyph="bell"></Glyphicon>
                </Button>
              </FormGroup>*/}

              { localStorage.getItem("userInfo") ? <UserImage userImage={image}/> : null }

            </form>
          </div>
        </div>
      )
    }
}

const NOTIFICATION = gql`
  query notification($userId: String){
    notification(userId: $userId) {
      _id
    	userId
      classCode
    	type
    	sendId
    	sendname
    	sendimage
    	note
      read
    	date
    },
  }`

export default compose(
  graphql(NOTIFICATION, {
    options: () => ({ variables: { userId: 'GCid2Yid7YoDC9Atj' },  pollInterval: 1000 })
  })
)
