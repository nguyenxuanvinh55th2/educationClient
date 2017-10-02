import React from 'react'
import Post from './Post.jsx'
import PostForm from './PostForm.jsx'
export default class Promotion extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    return (
      <Post {...this.props} isPromotion={true}/>
    )
  }
}
export class PromotionFrom extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    return (
      <PostForm {...this.props} isPromotion={true}/>
    )
  }
}
