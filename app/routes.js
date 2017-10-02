import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { history } from './store.js';
import { client } from './reducers/index'
import { Provider } from 'react-redux'
//font-end
import App from './components/App.jsx'
import Home from './components/home/Home.jsx';
import DomesticTour from './components/tour/DomesticTour.jsx';
import DomesticTourDetails from './components/tour/DomesticTourDetails.jsx';
import ForeignTour from './components/tour/ForeignTour.jsx';
import FindingTour from './components/tour/FindingTour.jsx';
import TourTypeFind from './components/tour/TourTypeFind.jsx';
import Event, {PromotionEvent} from './components/event/Event.jsx';
import Contact from './components/contact/Contact.jsx';
import Teambuilding from './components/teambuilding/Teambuilding.jsx';
import WrapFontEnd from './components/wrap/WrapFontEnd.jsx';
import DetailEvent from './components/event/DetailEvent.jsx';
import Insurance from './components/theme/Insurance.jsx';
import Terms from './components/theme/Terms.jsx';
import Page404 from './components/wrap/Page404.jsx'
//back-end
import Login from './components/login/Login.jsx';
import Manager from './components/manager/Manager.jsx';
import Dashboard from './components/dashboard/Dashboard.jsx';

import ListTours from './components/managerTour/Tours.jsx';
import TourForm from './components/managerTour/TourForm.jsx';
import TourType from './components/category/TourType.jsx';
import RegionTour from './components/category/RegionTour.jsx';
import LocationTour from './components/category/LocationTour.jsx';
import Trips from './components/category/Trips.jsx';
import Advertisement from './components/advertisement/Advertisement.jsx';
import TopSlider from './components/managerSlider/topSlider.jsx'
import ChatManagement from './components/chatManagement/ChatManagement.jsx';
import TeamBuilding from './components/teamBuilding.jsx';
import FeedBack from './components/FeedBack.jsx';
import Customer from './components/Customer.jsx';
import BusinessMail from './components/businessMail/BusinessMail.jsx';
import User from './components/user/User.jsx';
import Promotion, {PromotionFrom} from './components/post/Promotion.jsx';
import NewEvent, {NewEventFrom} from './components/post/NewEvent.jsx';
import NewsStand, {NewsStandFrom} from './components/post/NewsStand.jsx';
import PostForm from './components/post/PostForm.jsx';
import InsuranceForm from './components/theme/InsuranceForm.jsx';
import TermsForm from './components/theme/TermsForm.jsx';
import ImageManager from './components/imageManager/ImageManager.jsx';
import StockModels from './components/stockModels/StockModels.jsx';
import StockModelForm from './components/stockModels/StockModelForm.jsx';

function requireAuth(nextState, replace){
  if (!Meteor.userId()) {
    replace({
      pathname: '/login'
    })
  }
}

function requireLoginForm(nextState, replace){
  if (Meteor.userId() !== '0' && Meteor.userId() !== '1') {
    alert('Bạn không có quyền xem trang này');
    replace({
      pathname: '/'
    })
  }
}

function loadCss(){
  // import './stylesheet/setting.scss';
 let setting = require('./stylesheet/setting.scss');
}
function loadFileCss(){
  // import './stylesheet/login.scss';
 let setting = require('./stylesheet/setting.scss');
}
export const renderRoutes = () => (
  <Router onUpdate={() => window.scrollTo(0, 0)} history={browserHistory} >
    <Route path="/" component={App} >
      <Route component={WrapFontEnd} onEnter={loadCss}>
          <IndexRoute component={Home}/>
          <Route path="/tour-trong-nuoc" component={DomesticTour}/>
          <Route path="/chi-tiet-tour-trong-nuoc" component={DomesticTourDetails} />
          <Route path="/tour-nuoc-ngoai" component={ForeignTour} />
          <Route path="/team-building" component={Teambuilding}/>
          <Route path="/tin-tuc-su-kien" component={Event} />
          <Route path="/lien-he" component={Contact}/>
          <Route path="/chi-tiet-tour/:slug" component={DomesticTourDetails}/>
          <Route path="/chi-tiet-chuong-trinh/:slug" component={DetailEvent}/>
          <Route path="/chuong-trinh-khuyen-mai" component={PromotionEvent}/>
          <Route path="/bao-hiem-du-lich" component={Insurance}/>
          <Route path="/dieu-khoan-chung" component={Terms}/>
          <Route path="/loai-hinh-tour/:slug" component={TourTypeFind}/>
          <Route path="/tim-kiem" component={FindingTour}/>
      </Route>
      <Route path="login" component={Login} onEnter={loadFileCss}/>
      <Route path="dashboard" component={Manager} onEnter={requireAuth}>
        <IndexRoute component={Dashboard}/>
        <Route path="/advertisement" component={Advertisement}/>
        <Route path="/tours" component={ListTours}/>
        <Route path="/tourForm" component={TourForm}/>
        <Route path="/tourType" component={TourType} />
        <Route path="/trips" component={Trips} />
        <Route path="/regions" component={RegionTour} />
        <Route path="/locations" component={LocationTour} />
        <Route path="/advertisement" component={Advertisement}/>
        <Route path="/topSlider" component={TopSlider}/>
        <Route path="/chatMangement" component={ChatManagement}/>
        <Route path="/teamBuilding" component={TeamBuilding}/>
        <Route path="/feedBack" component={FeedBack}/>
        <Route path="/customer" component={Customer}/>
        <Route path="/businessMail" component={BusinessMail}/>
        <Route path="/tourForm/:_id" component={TourForm}/>
        <Route path="/user" component={User} onEnter={requireLoginForm}/>
        <Route path="/newStand" component={NewsStand}/>
        <Route path="/newEvent" component={NewEvent}/>
        <Route path="/promotion" component={Promotion}/>
        <Route path="/newEventFrom" component={NewEventFrom}/>
        <Route path="/newEventFrom/:_id" component={NewEventFrom}/>
        <Route path="/promotionFrom" component={PromotionFrom}/>
        <Route path="/promotionFrom/:_id" component={PromotionFrom}/>
        <Route path="/newsStandFrom" component={NewsStandFrom}/>
        <Route path="/newsStandFrom/:_id" component={NewsStandFrom}/>
        <Route path="/termsForm" component={TermsForm}/>
        <Route path="/insuranceForm" component={InsuranceForm}/>
        <Route path="/imageManager" component={ImageManager}/>
        <Route path="/stockModels" component={StockModels}/>
        <Route path="/stockModelForm" component={StockModelForm}/>
        <Route path="/stockModelForm/:_id" component={StockModelForm}/>
        <Route />
        <Route />
        <Route />
      </Route>
      <Route path="*" component={Page404} onEnter={loadCss}/>
    </Route>
  </Router>
)
