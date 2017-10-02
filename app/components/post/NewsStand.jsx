import React from 'react';
import Post from './Post.jsx';
import PostForm from './PostForm.jsx'
export default class NewsStand extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    return (
      <Post {...this.props} isNew={true}/>
    )
  }
}
export class NewsStandFrom extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    return (
      <PostForm {...this.props} isNew={true}/>
    )
  }
}
