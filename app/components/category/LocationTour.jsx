import React from 'react';
import Category from './Category.jsx'
export default class LocationTour extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    return (
      <Category {...this.props} isLocation={true}/>
    )
  }
}
