import React, { PropTypes, Component } from 'react'
import { Link, Router, browserHistory } from 'react-router'
import ReactDOM from 'react-dom'
import { Button, Form, FormControl, ControlLabel, InputGroup, FormGroup, Glyphicon, Row, Col, Grid, Navbar  } from 'react-bootstrap'
import Notification from '../notification/notification.js'

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

UserImage.PropTypes = {
  userImage: PropTypes.string.isRequired,
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

NoteNotificate.PropTypes = {
  show: PropTypes.bool.isRequired,
  number: PropTypes.number.isRequired,
}

class UserMenu extends Component {
  render() {
    return (
      <div id="userMenu">
        <Row style={{marginBottom: '18px'}} onClick={e => {
            document.getElementById('userMenu').style.display = 'inline';
          }}>
          <Col md={5}>
              <img style={{width: '80px', height: '80px'}} src={ this.props.image }></img>
          </Col>
          <Col md={7}>
              <h4 style={{width: '100%'}}><b>{ this.props.name }</b></h4>
          </Col>
        </Row>
        <Row>
          <Col md={7}>
            <Link to={"/profile/" + this.props.userId + "/wall" } className="btn btn-success" onClick={e => {
                document.getElementById('userMenu').style.display = 'none';
              }}>
              Trang cá nhân
            </Link>
          </Col>
          <Col md={5}>
            <Button bsStyle="primary" onClick={e => {
                this.props.onLogout();
                document.getElementById('userMenu').style.display = 'none';
                browserHistory.push('/');
              }}>Đăng xuất</Button>
          </Col>
        </Row>
      </div>
    )
  }
}

UserMenu.PropTypes = {
  userId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired
}

export default class Header extends Component {
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
            <Notification noteList={ this.props.data }/>
            <UserMenu image={ image } name={ name } userId={ userId } onLogout={ this.props.onLogout }/>
            <Form inline style={{width:'100%'}} onSubmit ={e => {
                e.preventDefault();
                let keyWord = ReactDOM.findDOMNode(this.keyWord).value;
                this.props.search(keyWord);
                browserHistory.push('/search/' + keyWord);
              }}>

              <FormGroup style={{marginLeft: '20px'}}>
                <Link to="/" className="btn btn-success header-button">
                  <Glyphicon glyph="home"></Glyphicon>
                </Link>
              </FormGroup>

              <FormGroup style={{marginLeft: '20px'}}>
                <Link to="/" className="btn btn-success header-button">
                  <Glyphicon glyph="home"></Glyphicon>
                </Link>
              </FormGroup>

              <FormGroup style={{width: '60%', marginLeft: '20px'}}>
                <InputGroup style={{width: '100%'}}>
                  <FormControl type="text" ref={node => this.keyWord=node}/>
                  <InputGroup.Addon style={{width: '20px'}}><Glyphicon glyph="search" /></InputGroup.Addon>
                </InputGroup>
              </FormGroup>

              <FormGroup style={{marginLeft: '20px'}}>
                <Button bsStyle="success"  className="header-button" onClick = {e => {
                    document.getElementById('notification').style.display = 'inline'
                }}>
                  { this.renderNotificateIcon() }
                  <Glyphicon glyph="bell"></Glyphicon>
                </Button>
              </FormGroup>

              { localStorage.getItem("userInfo") ? <UserImage userImage={image}/> : null }

            </Form>
          </div>
        </div>
      )
    }
}

Header.PropTypes = {
  data: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired,
  search: PropTypes.object.isRequired,
}
