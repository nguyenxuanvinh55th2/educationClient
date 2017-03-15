import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import __ from 'lodash'
import * as actionCreator from "../action/actionCreator"
import React from 'react'


import Profile from './profile.jsx';
import Header from './Header.jsx';

function mapStateToProps(state){
  return {
      isLogin:state.login,
      salary:state.salary
  }
}

function mapDispathToProps(dispatch) {
  return bindActionCreators(actionCreator, dispatch);
}


class Main extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    let childProps = __.cloneDeep(this.props);
    delete childProps.children;
    return (
      <div style={{flexDirection: 'column'}}>
        <div style={{flexDirection: 'column'}}>
        {React.cloneElement(<Header/>, this.props)}
        </div>
        <div style={{marginTop: 65}}>
          {React.cloneElement(this.props.children, childProps)}
        </div>
      </div>
    )
  }
}

const App = connect (mapStateToProps,mapDispathToProps)(Main);

export default App;
