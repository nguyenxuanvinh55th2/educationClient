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
        let refId = this.props.id?this.props.id:'datalist';
        this.setState({filterValue: val});
        if (this.refs.selectEditor.value) {
            __.forEach(this.refs[refId].options, (option) => {
                if (option.value == this.refs.selectEditor.value) {
                    this.setState({value: this.state.value.concat(option.dataset.value), filterValue: ''});
                    this.refs.selectEditor.value = '';
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
        let { keys, id } = this.props;
        if(!keys){
            keys = '_id';
        }
        let refId = id?id:'datalist';
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
                <input ref="selectEditor" placeholder={this.props.placeholder} type="text" list={refId}
                    onBlur={()=>{
                        if(this.props.onChangeValue){
                            this.props.onChangeValue(this.state.value);
                        }
                    }}
                    style={{width: '99%', border: 0, borderTop: '1px solid grey', minHeight: 20}} onChange={({target}) => this.handleOnChange(target.value)}/>
                <datalist id={refId} ref={refId}>
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
