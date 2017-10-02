import React from 'react';
import moment from 'moment';
import { Calendar, DateRange } from 'react-date-range';

import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';

const defaultRanges = {
    'Hôm nay': {
        startDate: function startDate(now) {
          return now.startOf('day');
        },
        endDate: function endDate(now) {
          return now.endOf('day');
        }
    },

    'Tuần này': {
        startDate: function startDate(now) {
          return now.startOf('week');
        },
        endDate: function endDate(now) {
          return now.endOf('week');
        }
    },

    'Tháng trước': {
        startDate: function startDate(now) {
          return now.add(-1, 'month').startOf('month');
        },
        endDate: function endDate(now) {
          return now.add(-1, 'month').endOf('month');
        }
    },

    'Tháng này': {
        startDate: function startDate(now) {
          return now.startOf('month');
        },
        endDate: function endDate(now) {
          return now.endOf('month');
        }
    },

    'Năm nay': {
        startDate: function startDate(now) {
          return now.startOf('year');
        },
        endDate: function endDate(now) {
          return now.endOf('year');
        }
    }
};
export default class CustomDatePicker extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            open: false,
            startDate: props.bpm?props.bpm.startDate:moment().startOf('month').valueOf(),
            endDate: props.bpm?props.bpm.endDate:moment().endOf('month').valueOf(),
            selectDate: props.selectDate?props.selectDate:moment().valueOf()
        };
    }
    componentWillReceiveProps(props) {
        if(props.bpm){
            this.setState({
                startDate: props.bpm.startDate,
                endDate: props.bpm.endDate
            });
        }
    }
    handleTouchTap(event){
        event.preventDefault();
        this.setState({
          open: true,
          anchorEl: event.currentTarget,
        });
    }
    handleRequestClose(){
        this.setState({
          open: false,
        });
    }
    handleChangeDate(val, a){
        if(a){
            if(a.defaultProps.format){
                this.setState({
                    startDate: val.startDate,
                    endDate: val.endDate
                });
            } else {
                this.SubmitDate(val);
            }
        }
    }
    SubmitDate(val){
        let { bpmChangeRange, handleChange } = this.props;
        this.setState({
            startDate: val.startDate,
            endDate: val.endDate,
            open: false
        });
        bpmChangeRange({
            startDate: val.startDate.valueOf(),
            endDate: val.endDate.endOf('day').valueOf()
        });
        if(handleChange){
            handleChange([val.startDate.valueOf(), val.endDate.endOf('day').valueOf()]);
        }
    }
    SubmitSingleDate(val){
        this.setState({open: false, selectDate: val.valueOf()});
        this.props.handleChange(val.valueOf());
    }
    render(){
        let { bpm, flat, single, anchorOriginVer, targetOriginVer, disabled, month, year } = this.props;
        let { startDate, endDate, selectDate } = this.state;
        if(single){
            return (
                <div>
                    <button disabled={disabled} className="btn" onClick={this.handleTouchTap.bind(this)} style={{fontSize: 14}}>
                        {month ? moment(selectDate).format('MM/YYYY') : year ? moment(selectDate).format('YYYY')  :moment(selectDate).format('DD/MM/YYYY')}
                    </button>
                    <Popover
                        open={this.state.open}
                        anchorEl={this.state.anchorEl}
                        anchorOrigin={{horizontal: 'left', vertical: anchorOriginVer}}
                        targetOrigin={{horizontal: 'left', vertical: targetOriginVer}}
                        onRequestClose={this.handleRequestClose.bind(this)}
                    >
                        <div style={{display: 'flex', flexDirection: 'column', position: 'relative'}}>
                            <Calendar
                                onChange={(val)=>this.SubmitSingleDate(val)}
                                date={moment(selectDate)}
                            />
                        </div>
                    </Popover>
                </div>
            );
        } else {
            return (
                <div>
                    {flat?
                        <FlatButton
                            disabled={disabled}
                            style={{border: '1px solid #ccc'}}
                            onTouchTap={this.handleTouchTap.bind(this)}
                            label={moment(startDate).format('DD/MM/YYYY')+' - '+moment(endDate).format('DD/MM/YYYY')} />
                    :
                    <button className="btn btn-primary" onClick={this.handleTouchTap.bind(this)} style={{fontSize: 14}}>
                        {moment(startDate).format('DD/MM/YYYY')+' - '+moment(endDate).format('DD/MM/YYYY')}
                    </button>
                    }
                    <Popover
                        open={this.state.open}
                        anchorEl={this.state.anchorEl}
                        anchorOrigin={{horizontal: 'left', vertical: anchorOriginVer}}
                        targetOrigin={{horizontal: 'left', vertical: targetOriginVer}}
                        onRequestClose={this.handleRequestClose.bind(this)}
                    >
                        <DateRange
                          format="MM/YYYY"
                            startDate={moment(startDate)}
                            endDate={moment(endDate)}
                            firstDayOfWeek={ 1 }
                            linkedCalendars={ true }
                            ranges={ defaultRanges }
                            onChange={(value, a)=>this.handleChangeDate(value, a)}
                            theme={{
                                Calendar : { width: 260 },
                                PredefinedRanges : { marginLeft: 10, marginTop: 10 }
                            }}
                        />
                        <div style={{display: 'flex', flexDirection: 'row', marginTop: -20, paddingBottom: 10, paddingLeft: 10}}>
                            <button className="btn btn-success" disabled={startDate&&moment(startDate).isSame(moment(endDate))} onClick={()=>this.SubmitDate(this.state)}>Apply</button>
                            <button className="btn btn-danger" onClick={this.handleRequestClose.bind(this)} style={{marginLeft: 5}}>Cancel</button>
                        </div>
                    </Popover>
                </div>
            );
        }
    }
}
CustomDatePicker.defaultProps = {
    anchorOriginVer: 'bottom',
    targetOriginVer: 'top',
    disabled: false
}
