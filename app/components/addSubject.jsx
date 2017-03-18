import React, { PropTypes, Component, ReactDom } from 'react';
import { Link, Router, browserHistory } from 'react-router'

//import { Meteor } from 'metor/meteor';
import { Form,FormGroup,ControlLabel,FormControl,Button } from 'react-bootstrap'
export default class addSubjectForm extends Component {
  constructor(props){
    super(props);

  }
  render() {
    return (
            <Form
              onSubmit={e =>
              {
                e.preventDefault()
                let reactDom = ReactDOM.findDOMNode;
                let subjectName = reactDom(this.subjectName).value;
                let note = reactDom(this.note).value;
                this.props.onAdd(subjectName,note)
                reactDom(this.subjectName).value= ' ';
                reactDom(this.note).value =' ';

              }}
              >

                {/* {this.props.valuesend} */}
                  <FormGroup >
                    <ControlLabel>Tên môn học</ControlLabel>
                    {' '}
                    <FormControl type="text" placeholder="Vui lòng nhập tên môn học" ref={node => this.subjectName=node}/>
                  </FormGroup>
                  {' '}
                  <FormGroup >
                    <ControlLabel>Tiêu đề môn học</ControlLabel>
                    {' '}
                    <FormControl componentClass="textarea" style={{resize: 'vertical'}} placeholder="Vui lòng nhập tiêu đề cho môn học " ref={node => this.note=node}/>
                  </FormGroup>
                  {' '}
                  <Button type="submit">
                    Tạo môn học
                  </Button>
              </Form>
    )
  }
}
