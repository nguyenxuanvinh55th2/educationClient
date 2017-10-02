import React from 'react';
import { browserHistory } from 'react-router';
import __ from 'lodash';
import HeaderManager from './HeaderManager.jsx';
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/ag-grid/dist/styles/ag-grid.css';
import '/node_modules/ag-grid/dist/styles/theme-fresh.css';
import '../../stylesheet/recss/chatbox.scss';
import '../../stylesheet/recss/ag-pattern.css';
import '../../stylesheet/recss/main.scss';
import '../../stylesheet/recss/react-select.css';
import '../../stylesheet/recss/react-tab.css';
export default class Manager extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount(){
    var sheet = document.getElementById('font-end');
    if(sheet){
      sheet.disabled = true;
      sheet.parentNode.removeChild(sheet);
    }
  }
  render(){
    let childProps = __.cloneDeep(this.props);
    delete childProps.children;
    return (
      <div>
        <HeaderManager {...this.props} />
        {React.cloneElement(this.props.children, childProps)}
      </div>
    )
  }
}
