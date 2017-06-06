import React from 'react';
var PieChart = require("react-chartjs").Pie;

export default class PieChartComp extends React.Component {
  render() {
  	let { width, height } = this.props;
    return <PieChart data={this.props.chartData} options={this.props.chartOptions} width={width} height={height}/>
  }
}
