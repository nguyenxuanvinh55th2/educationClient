import React, { PropTypes, Component, ReactDom } from 'react';
import { SketchPicker } from 'react-color';

export default class ColorPicker extends Component {

  constructor(props) {
    super(props);
    this.state = {
      background: '#fff',
    };
  }

  handleChangeComplete(color) {
    this.setState({ background: color.hex });
    this.props.getColorCode(color)
  };

  render() {
    return (
      <SketchPicker
        color={ this.state.background }
        onChangeComplete={ this.handleChangeComplete.bind(this) }
      />
    );
  }
}
ColorPicker.PropTypes = {
  getColorCode: PropTypes.func.isRequired
}
