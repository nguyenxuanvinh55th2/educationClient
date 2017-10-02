import React from 'react';
import Category from './Category.jsx'
export default class TourType extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    return (
      <Category {...this.props} isTour={true}/>
    )
  }
}
