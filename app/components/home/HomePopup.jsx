import React from 'react'
import {Helmet} from "react-helmet";
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import __ from 'lodash';

import {loadHomePopup} from '../../javascript/Popup.js';
import {hideHomePopup} from '../../javascript/Popup.js';

class HomePopup extends React.Component {
  constructor(props) {
    super(props);
    this.images = [
      "url('/imgs/item_timkiem.png')",
      "url('/imgs/item2_timkiem.png')",
      "url('/imgs/item3_timkiem.png')"
    ]
  }
  updateRegionView(_id) {
    $('#HomePopup').modal('hide');
    if(!localStorage.getItem('REGION')) {
      let token = Math.floor(Math.random()*89999+10000).toString();
      this.props.updateRegionView(_id, token).then(() => {
        localStorage.setItem('REGION', token);
        this.props.refetch();
      });
    }
  }
  render() {
    let { data } = this.props;
    return (
      <div id="HomePopup" ref="HomePopup" className="modal fade" role="dialog" data-backdrop="static" data-keyboard="false">
        <div className="modal-dialog">
          <div className="modal-content">
            <h2>Chào mừng bạn đến với công ty TNHH thương mại dịch vụ và du lịch trải nghiệm việt</h2>
            <div className="container-Home-popup">
              <ul className="list-unstyled list-inline">
                {
                  data.region &&
                  data.region.map((item, idx) => (
                    <li key={idx} className="Home-schedule">
                      <a className="bg" href="#" style={{
                        backgroundImage: this.images[idx]
                      }} onClick={this.updateRegionView.bind(this, item._id)}>{item.name.toUpperCase()}</a>
                    </li>
                  ))
                }
              </ul>
              <div className="row select">
                <p>Bạn vui lòng chọn vùng miền để chúng tôi gợi ý các tour phù hợp cho bạn</p>
              </div>
            </div>
          </div>
        </div>
        <Helmet>
          <script type="text/javascript">
              $('#HomePopup').modal('show');
          </script>
        </Helmet>
      </div>
    )
  }
}

const REGION_QUERY = gql `
  query region {
      region {
        _id
        code
        name
      }
  }`

const UPDATE_REGION_VIEW = gql`
    mutation updateRegionView($_id: String, $token: String){
        updateRegionView(_id: $_id, token: $token)
}`

export default compose(
  graphql(REGION_QUERY, {
    options: () => ({
      fetchPolicy: 'cache-and-network'
    })
  }),
  graphql(UPDATE_REGION_VIEW, {
      props: ({mutate})=> ({
          updateRegionView : (_id, token) => mutate({variables:{_id, token}})
      })
  })
)(HomePopup);
