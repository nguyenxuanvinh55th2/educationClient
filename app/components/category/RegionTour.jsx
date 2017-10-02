import React from 'react';
import Category from './Category.jsx'
export default class RegionTour extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    return (
      <Category {...this.props} isRegion={true}/>
    )
  }
}
