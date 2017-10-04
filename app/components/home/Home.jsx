import React from 'react'
import {Link} from 'react-router';
import moment from 'moment';
import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';

import SliderBanner from '../slider/SliderBanner.jsx';
import SliderInter from '../slider/SliderInter.jsx';
import SliderEvaluate from '../slider/SliderEvaluate.jsx';
import SliderAds from '../slider/SliderAds.jsx';
import HomePopup from './HomePopup.jsx';
import AdvertisePopup from './AdvertisePopup.jsx';

import HotTour from './HotTour.jsx';
import BookTour from './BookTour.jsx';
import EventInfo from './Event.jsx';
import FindingType from './FindingType.jsx';
import { Settings } from 'collections-root/setting';
const TIME = 300000;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refetch: false,
      showAdvertise: true,
      time: 6,
      focus: false
    };
  }
  componentWillMount() {
    if (!localStorage.getItem('TIME_VISIT') || (moment().valueOf() - parseFloat(localStorage.getItem('TIME_VISIT')) > TIME)) {
      Settings.update({
        _id: 'buildmodify'
      }, {
        $inc: {
          accessCount: 1
        }
      });
      localStorage.setItem('TIME_VISIT', moment().valueOf());
    }
    if (this.props.changeHeader) {
      this.props.changeHeader('home');
    }
  }

  refetch() {
    let refetch = !this.state.refetch;
    this.setState({refetch});
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.data.advertisements && !this.props.data.advertisements && nextProps.data.advertisements[0]) {
      if (localStorage.getItem('REGION') && !session.get('closeAdvertise')) {
        this.setState({time: nextProps.data.advertisements[0].time});
        this.interval = setInterval(() => {
          if(!this.state.focus) {
            let time = this.state.time - 1;
            this.setState({time});
            if (time < 0) {
              session.set('closeAdvertise', true);
              clearInterval(this.interval);
            }
          }
        }, 1000);
      }
    }
  }

  setFocus(value) {
    this.setState({focus: value});
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let {data} = this.props;
    return (
      <div>
        {!localStorage.getItem('REGION') && window.innerWidth > 767
          ? <HomePopup refetch={this.refetch.bind(this)}/>
          : (data.advertisements && data.advertisements.length && this.state.showAdvertise && this.state.time > 0 && !Session.get('closeAdvertise'))
            ? <AdvertisePopup advertisements={data.advertisements} time={this.state.time} hideAdvertise={() => this.setState({showAdvertise: false})} setFocus={this.setFocus.bind(this)}/>
            : null
        }
        <SliderAds/>
        <SliderBanner/>
        <FindingType {...this.props} />

        <BookTour {...this.props}/>

        <HotTour {...this.props}/>
        <EventInfo {...this.props}/>
        <SliderInter/>
        <SliderEvaluate/>

      </div>
    )
  }
}

const ADVERTISEMENT_QUERY = gql `
    query advertisements($type: String) {
        advertisements(type: $type) {
          _id
          name
          image {
            _id
            file
          }
          type
          time
          createdAt
          createdBy {
            _id
            username
          }
          isShow
        }
}`

export default compose(graphql(ADVERTISEMENT_QUERY, {
  options: () => ({
    variables: {
      type: 'popup'
    },
    fetchPolicy: 'cache-and-network'
  })
}),)(Home);
