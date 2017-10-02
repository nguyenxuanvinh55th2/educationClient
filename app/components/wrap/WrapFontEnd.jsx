import React from 'react';
import __ from 'lodash';
import Header from '../main/Header.jsx'
import Footer from '../main/Footer.jsx'
import {Link} from 'react-router';
import FindTourHome from './FindTourHome.jsx';
export default class WrapFontEnd extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
  }
  render() {
    let childProps = __.cloneDeep(this.props);
    delete childProps.children;
    return (
      <div className="font-end">
        <Header {...this.props} handleOpen={() => {this.setState({open: true});}}/>
        <div className="main-content">
          <FindTourHome {...this.props} open={this.state.open} />
          {React.cloneElement(this.props.children, childProps)}
        </div>
        <Footer {...this.props}/>
        <div className="pin-top">
          <i className="fa fa-angle-up" aria-hidden="true"></i>
        </div>
      </div>
    )
  }
}
