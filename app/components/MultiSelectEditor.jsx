import React from 'react';
import {AgGridReact} from 'ag-grid-react';

import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';


export default class MultiSelectEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: props.value || [], filterValue: ''};
    }
    componentDidMount() {
        let that = this;
        setTimeout(() => {
            that.refs.selectEditor.focus();
        }, 10);
    }
    getValue() {
        return this.state.value;
    }
    isPopup() {
        return true;
    }
    handleOnChange(val) {
        this.setState({filterValue: val});
        if (this.refs.selectEditor.value) {
          __.forEach(this.refs.datalist.options, (option) => {
            if(option.value == this.refs.selectEditor.value){
              let catFound = this.state.value.filter((value) => {
                return value === option.dataset.value;
              });
              if(!catFound.length){
                this.setState({value: this.state.value.concat(option.dataset.value), filterValue: ''});
                this.refs.selectEditor.value = '';
              }
            }
          });
        }
    }
    handleRequestDelete(id) {
      this.setState({value: __.pull(this.state.value, id)});
      if(this.props.onChangeValue){
          this.props.onChangeValue(__.pull(this.state.value, id));
      }
    }
    renderChip(id) {
        let { keys } = this.props;
        if(!keys){
            keys = '_id';
        }
        let chip = __.find(this.props.data, {[keys]: id});
        if(!chip){
            chip = {[keys]: id, [this.props.label]: id};
        }
        return (
            <div key={chip[keys]} style={{border: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'row',
                cursor: 'default', textDecoration: 'none', margin: 2, padding: 0, outline: 'none',
                fontSize: 'inherit', fontWeight: 'inherit', backgroundColor: 'rgb(224, 224, 224)',
            borderRadius: 16, whiteSpace: 'nowrap', width: 'fit-content'}}>
                <span style={{color: 'rgba(0, 0, 0, 0.870588)', fontSize: 10, fontWeight: 400, lineHeight: '22px',
                paddingLeft: 5, marginRight: 10, userSelect: 'none', whiteSpace: 'nowrap'}}>
                    {chip[this.props.label]}
                </span>
                <i className="material-icons remove-chip" onClick={() => this.handleRequestDelete(chip[keys])}
                    style={{display: 'inline-block', margin: '3px 3px 0px -8px', cursor: 'pointer',
                            fontSize: 16, borderRadius: '100%', userSelect: 'none', height: 16,
                            color: 'rgba(0, 0, 0, 0.258824)', fill: 'rgba(0, 0, 0, 0.258824)'}}>
                    close
                </i>
            </div>
        );
    }
    render() {
        let { keys } = this.props;
        if(!keys){
            keys = '_id';
        }
        let filterData = [], i, that = this;
        for (i = 0; i < this.props.data.length; i++) {
            if (this.props.data[i][this.props.label] && this.props.data[i][this.props.label].toLowerCase().indexOf(this.state.filterValue.toLowerCase()) !== -1) {
                filterData.push(this.props.data[i]);
            }
            if (filterData.length > 20) {
                break;
            }
        }
        return (
            <div style={{display: 'flex', flexDirection: 'column', backgroundColor: 'white', height: 'inherit', border: '1px solid grey'}}>
                <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
                    {__.map(this.state.value, (val)=>{
                        return that.renderChip(val);
                    })}
                </div>
                <input ref="selectEditor" placeholder={this.props.placeholder} type="text" list="datalist" onBlur={()=>{
                        if(this.props.onChangeValue){
                            this.props.onChangeValue(this.state.value);
                        }
                    }}
                    style={{width: '100%', border: 0, borderTop: this.state.value.length ? '1px solid grey': 0 , minHeight: 20}} onChange={({target}) => this.handleOnChange(target.value)}/>
                <datalist id="datalist" ref="datalist">
                    {
                        filterData.map((item) => {
                            return <option key={item[keys]} data-value={item[keys]} value={item[this.props.label]} />;
                        })
                    }
                </datalist>
            </div>
        );
    }
}

export class InviteUser extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userMails: props.userMails ? props.userMails : []
    }
  }
  checkEmail(value){
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
     if (!filter.test(value)) {
       return false;
    }
    else {
      return true;
    }
  }
  handleRequestDelete(index) {
    let userMails = this.state.userMails;
    userMails.splice(index,1);
    this.setState({userMails:userMails});
  }
  handleKeyPress(event){
    if(this.checkEmail(event.target.value) && (event.charCode === 13 || event.keyCode === 13)){
      let catFound = this.state.userMails.filter((value) =>
        value.toLowerCase() === event.target.value
      );
      if(!catFound.length){
        this.setState({userMails: this.state.userMails.concat(event.target.value)});
        this.refs.userMails.value = ''
      }
    }
  }
  renderChip(value,index) {
       return (
           <div key={index} style={{border: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'row',
               cursor: 'default', textDecoration: 'none', margin: 2, padding: 0, outline: 'none',
               fontSize: 'inherit', fontWeight: 'inherit', backgroundColor: 'rgb(224, 224, 224)',
           borderRadius: 16, whiteSpace: 'nowrap', width: 'fit-content'}}>
               <span style={{color: 'rgba(0, 0, 0, 0.870588)', fontSize: 10, fontWeight: 400, lineHeight: '22px',
               paddingLeft: 5, marginRight: 10, userSelect: 'none', whiteSpace: 'nowrap'}}>
                   {value}
               </span>
               <i className="material-icons remove-chip" onClick={() => this.handleRequestDelete(index)}
                   style={{display: 'inline-block', margin: '3px 3px 0px -8px', cursor: 'pointer',
                           fontSize: 16, borderRadius: '100%', userSelect: 'none', height: 16,
                           color: 'rgba(0, 0, 0, 0.258824)', fill: 'rgba(0, 0, 0, 0.258824)'}}>
                   close
               </i>
           </div>
       );
   }
  render(){
    let that = this;
    return (
      <div style={{display: 'flex', flexDirection: 'column', backgroundColor: 'white', height: 'inherit', border: '1px solid grey'}}>
        <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
            {__.map(this.state.userMails, (val, idx)=>{
                return that.renderChip(val,idx);
            })}
        </div>
        <input ref="userMails" type="text" placeholder="Nhập email và nhấn enter để gửi mail mới sinh viên"
          onBlur={() => that.props.onChangeValue(this.state.userMails)}
          onKeyPress={(event)=>this.handleKeyPress(event)}
            style={{width: '100%', border: 0, borderTop: this.state.userMails.length ? '1px solid grey': 0 , minHeight: 70, padding: 5}}/>
      </div>
    )
  }
}
