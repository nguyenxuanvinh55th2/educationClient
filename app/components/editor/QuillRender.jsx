import React from 'react';
export default class QuillRender extends React.Component {
  constructor(props) {
    super()
  }
  componentDidMount(){
    let description = document.getElementById(this.props.keyValue ? this.props.keyValue : 'description');
    if(description) {
      description.innerHTML = this.props.value;
    }
  }
  render(){
    return (
      <div id={this.props.keyValue ? this.props.keyValue : 'description'}></div>
    )
  }
}
