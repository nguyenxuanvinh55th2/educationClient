import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as actionCreator from "../action/actionCreator"
import React from 'react'

import ComponentRender from './componentRender.jsx';
import Profile from './profile.jsx';

function mapStateToProps(state){
  return {
      isLogin:state.login,
      salary:state.salary,
      userInfo: state.account,
  }
}

function mapDispathToProps(dispatch) {
  return bindActionCreators(actionCreator, dispatch);
}

class Main extends React.Component {
  render(){
    console.log("main props ", this.props);
    return (
      <div>
        {/*<div>
          <Header/>
        </div>*/}
        <div  style={{marginTop: '39px'}}>
          {React.cloneElement(<Profile/>, this.props)}
        </div>
      </div>
    )
  }
}

const App = connect (mapStateToProps,mapDispathToProps)(Main);

export default App;
