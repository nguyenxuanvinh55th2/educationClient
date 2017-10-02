import React from 'react';
import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import Quill from 'quill';
class Terms extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      height: window.innerHeight,
      content: '',
      loading: true
    }
    this.quillEditor = null;
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.data.setting){
      this.setState({content: nextProps.data.setting.insurance ? nextProps.data.setting.insurance : '', loading: false})
    }
  }
  componentDidUpdate(){
    let description = document.getElementById('description');
    if(description) {
      this.quillEditor = new Quill(description);
      this.quillEditor.root.innerHTML = this.props.data.setting && this.props.data.setting.terms ? this.props.data.setting.terms : '';
    }
  }
  render(){
    if(!this.props.data.setting || this.state.loading){
      return (
        <div className="loading">
          <i className="fa fa-spinner fa-spin" style={{
            fontSize: 50
          }}></i>
        </div>
      )
    }
    else {
      return (
        <div>
          <div id="description"></div>
        </div>
      )
    }
  }
}
const QUERY = gql `
    query setting{
      setting {
      _id insurance terms
    }
}`
export default compose(graphql(QUERY, {
  options: (ownProps) => {
    return {
      variables: {},
      fetchPolicy: 'cache-and-network'
    }
  }
}))(Terms);
