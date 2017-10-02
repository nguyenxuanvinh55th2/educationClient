import React from 'react';
import Category from './Category.jsx'
export default class Trips extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    return (
      <Category {...this.props} isTrip={true}/>
    )
  }
}
