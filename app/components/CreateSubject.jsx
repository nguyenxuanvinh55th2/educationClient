import React from 'react';

import { Link, Router, browserHistory } from 'react-router'

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';
import Dialog from 'material-ui/Dialog';
class CreateSubject extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      code: '',
      name: '',
    }
  }
  handleSave(type){
    if(this.props.insertClass){
      this.props.insertClass(this.props.users.userId,JSON.stringify({code: this.state.code,name: this.state.name})).then(({data}) => {
        if(data.insertClass){

        }
      })
      .catch((error) => {
        console.log(error);
      })
    }
  }
  render(){
    return (
      <div className="row">
        <div className="col-sm-9">
          
        </div>
        <div className="col-sm-3">

        </div>
      </div>
    )
  }
}
const INSERT_CLASS = gql`
 mutation insertClass($userId:String!,$info:String!){
   insertClass(userId:$userId,info:$info)
 }
`;
export default compose(
  graphql(INSERT_CLASS,{
       props:({mutate})=>({
       insertClass : (userId,info) =>mutate({variables:{userId,info}})
     })
   })
)(CreateSubject)
