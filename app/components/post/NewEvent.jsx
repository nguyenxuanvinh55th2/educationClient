import React from 'react';
import Post from './Post.jsx';
import PostForm from './PostForm.jsx'
export default class NewEvent extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    return (
      <Post {...this.props} isEvent={true}/>
    )
  }
}
export class NewEventFrom extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    return (
      <PostForm {...this.props} isEvent={true}/>
    )
  }
}
