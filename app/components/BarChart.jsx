import React from 'react';
var BarChart = require("react-chartjs").Bar;

export default class BarChartComp extends React.Component {
  render() {
    let { width, height } = this.props;
    return <BarChart data={this.props.chartData} options={this.props.chartOptions}  width={width} height={height}/>
  }
}
