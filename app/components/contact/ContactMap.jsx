import React from 'react'
import {Helmet} from "react-helmet";
export default class ContactMap extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="container">
        <div id="map"></div>
        <Helmet>
          <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC4La47OJiw4_4Osqrop3mHxOZuRfAoVuw&callback=initMap" type="text/javascript"></script>
        </Helmet>
      </div>
    )
  }
}
