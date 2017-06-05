import React from 'react';
var PieChart = require("react-chartjs").Pie;

export default class PieChartComp extends React.Component {
  render() {
    return <PieChart data={this.props.chartData} options={this.props.chartOptions} width="500" height="300"/>
  }
}
