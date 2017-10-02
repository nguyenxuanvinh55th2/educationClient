import React from 'react';
import TourItem from './TourItem.jsx';
import { Link } from 'react-router';
import {createContainer} from 'react-meteor-data';
class TourType extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    let query = {};
    if(this.props.params.slug){
      query = {
        slug: this.props.params.slug,
        isType : true
      }
    }
    else {
      query = {active: true};
    }
    return (
      <div>
        <ol className="breadcrumb" style={{marginBottom: 0}}>
          <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
          <li className="breadcrumb-item active" style={{textTransform: 'capitalize'}}>{this.props.category && this.props.category.name ? this.props.category.name : ''}</li>
        </ol>
        <TourItem {...this.props} query={JSON.stringify(query)} />
      </div>
    )
  }
}
export default createContainer((ownProps) => {
  Meteor.subscribe('classifies');
  return {
    category: Classifies.findOne({slug: ownProps.params.slug})
  }
}, TourType);
