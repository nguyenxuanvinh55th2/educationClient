import React from 'react';
var BarChart = require("react-chartjs").Bar;

export default class BarChartComp extends React.Component {
  render() {
    console.log('this.props.chartData ', this.props.chartData);
    return <BarChart data={this.props.chartData} options={this.props.chartOptions}/>
  }
}
