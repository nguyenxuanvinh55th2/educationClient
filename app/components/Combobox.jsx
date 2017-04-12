import React from 'react';
import __ from 'lodash';

/**
 * Props
 * - data: array or object data to select
 * - label: key of data to search and show info
 * - placeholder: placeholder of input
 * - value: value of input from parent components
 * - getValue: function return value to parent component
 **/

class Combobox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: props.value, filterValue: ''};
    }
    componentDidMount() {
        if (this.props.value) {
            __.forEach(this.props.data, (item) => {
                if (item._id == this.props.value) {
                    this.refs[this.props.name].value = item[this.props.label];
                    this.setState({filterValue: item[this.props.label]});
                }
            });
        }
    }
    componentWillReceiveProps({value, data, name, label}) {
        if (value) {
            __.forEach(data, (item) => {
                if (item._id == value) {
                    this.refs[name].value = item[label];
                    this.setState({filterValue: item[label]});
                }
            });
        }
    }
    handleOnChange(value) {
        if(value){
            this.setState({filterValue: value});
            if (this.refs[this.props.name].value) {
                __.forEach(this.refs[this.props.datalistName].options, (option) => {
                    if (option.value == this.refs[this.props.name].value) {
                        this.setState({value: option.dataset.value, filterValue: ''});
                        this.props.getValue(option.dataset.value);
                    }
                });
            }
        } else {
            this.props.getValue('');
        }
    }
    render() {
        console.log('tasks ', this.props.tasks);
        let { data, label } = this.props;
        let filterData = [], i;
        for (i in data) {
            if(data[i][label]){
                if (data[i][label].toLowerCase().indexOf(this.state.filterValue.toLowerCase()) !== -1) {
                    filterData.push(this.props.data[i]);
                }
                if (filterData.length > 20) {
                    break;
                }
            }
        }
        return (
            <div style={{width: '100%'}}>
                <input ref={this.props.name} className="combobox form-control" placeholder={this.props.placeholder} type="text" list={this.props.datalistName}
                        style={{width: '80%'}} onChange={({target}) => this.handleOnChange(target.value)}/>
                <datalist id={this.props.datalistName} ref={this.props.datalistName}>
                    {
                        filterData.map((item) => {
                            return <option key={item._id} data-value={item._id} value={item[this.props.label]} />;
                        })
                    }
                </datalist>
            </div>
        );
    }
}

export default Combobox;
