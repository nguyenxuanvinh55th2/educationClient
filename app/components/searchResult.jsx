//import { Meteor } from 'metor/meteor'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import React, { PropTypes, Component, ReactDom } from 'react';
import ReactGridLayout from 'react-grid-layout'

import { Grid, Col, Row, Button, Form, FormControl, FormGroup, Overlay, Popover, Modal, ButtonToolbar, ControlLabel } from 'react-bootstrap'

class SearchResultItem extends Component {
  render() {
    return (
      <div>
        <div id={'searchItem' + this.props.email} style={{float: 'left'}}>
          <div className="chip" style={{height: '30px', fontSize: '12px', marginBottom: '5px', marginTop: '0px', lineHeight: '32px'}}>
            {this.props.email}
            <span className="closebtn" onClick={e=>{
                document.getElementById('searchItem' + this.props.email).style.display = 'none';
                this.props.popUser(this.props.email);
              }}>&times;</span>
          </div>
        </div>
      </div>
    )
  }
}

SearchResultItem.PropTypes = {
  email: PropTypes.string.isRequired,
  popUser: PropTypes.func.isRequired
}


class SearchResult extends Component {
  renderResult(){
    if(this.props.searchResult) {
      let result = [];
      for(let i = 0; i < this.props.searchResult.length; i++) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
        if(re.test(this.props.searchResult[i])) {
          var item = {
            index:  this.props.searchResult[i],
            email: this.props.searchResult[i]
          }
          result.push(item)
        }
      }
      return result.map((item) => (
        <SearchResultItem key={item.index} popUser={this.props.popUser} email ={item.email}/>
      ))
    }
  }
  render() {
    return (
      <Row id="searchResult" style={{height: '35px', overflow: 'scroll', overflowX: 'hidden'}}>
        {this.renderResult()}
      </Row>
    )
  }
}

SearchResult.PropTypes = {
  searchResult: PropTypes.array.isRequired,
  pushUser: PropTypes.func.isRequired,
  popUser: PropTypes.func.isRequired
}

const SEARCH = gql`
  query search($userId: String, $keyWord: String){
    search(userId: $userId, keyWord: $keyWord) {
      _id
      type
      name
      semeter
      teacher
      subject
      image
      email
      social
      relative
    },
  }`

var keyWord = '';

let userInfo = JSON.parse(localStorage.getItem("userInfo"));

// let unsubscribe = store.subscribe(() =>
//    keyWord = store.getState().search
// )

const mapDataToProps = graphql(
  SEARCH,
  {
    options: () => ({ variables: { userId: userInfo ? userInfo._id : '', keyWord: keyWord } })
  }
);

export default  mapDataToProps(SearchResult);
