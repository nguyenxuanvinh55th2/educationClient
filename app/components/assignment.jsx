import React, { PropTypes, Component, ReactDom } from 'react';
import { Link, Router, browserHistory } from 'react-router'
import {Medias} from '../../api/media.js'
 
import {Panel,Row,Col,ButtonGroup,Button,Modal,FormGroup,FormControl,ControlLabel} from 'react-bootstrap'
import ShowFile from '../showFile/showFile.js'
class ViewShowMember extends Component{
      render(){
        return (
          <Row style={{paddingTop:'10px'}}>
            <Col md={2}>
            <img width={64} height={64} src={this.props.image} alt="Image" />
            </Col>
            <Col md={10}>
              <p>{this.props.userName}</p>
              <p>{this.props.main}</p>
              {
                this.props.files.map(item =>
                  <ShowFile key={item.index} link={item.link} filetype={item.filetype} filename={item.filename} />
                )
              }
            </Col>
          </Row>
        )
      }
}
ViewShowMember.PropTypes ={
  main:PropTypes.string.isRequired,
  userId:PropTypes.string.isRequired,
  userName:PropTypes.string.isRequired,
  image:PropTypes.string.isRequired,
  files:PropTypes.array.isRequired
}

export default class AssignmentForm extends Component {
    constructor(props){
      super(props)
      this.state={showModal:false}
      this.state={showAdd:false}
    }

    close() {
      this.setState({ showModal: false });
      this.setState({showAdd:false})
    }

    open() {
      this.setState({ showModal: true });
    }
    openAdd(){
      this.setState({showAdd:true})
    }
  renderFile(){
  }
  render(){
    return (
      <Panel>
        <Row>
            <p>{this.props.title}</p>
            <p>{this.props.main}</p>
            {
              this.props.files.map(item =>
                <ShowFile key={item.index} link={item.link} filetype={item.filetype} filename={item.filename} />
              )
            }
        </Row>
            <Row >
                <Button  bsStyle="primary"onClick={this.open.bind(this)}>
                  Danh sách sinh viên nộp bài
                </Button>
                <Button  bsStyle="primary"onClick={this.openAdd.bind(this)} style={{float:'right'}}>
                  Danh sách sinh viên nộp bài
                </Button>
            </Row>
                       <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
                         <Modal.Header closeButton>
                           <Modal.Title>Danh sách sinh viên nộp bài</Modal.Title>
                         </Modal.Header>
                         <Modal.Body>
                          {
                            this.props.member.map((item) =>
                              <ViewShowMember key={item.index} id={item.id} main={item.main} userId={item.userId} userName={item.userName} image={item.image} files={item.files}/>
                            )
                          }
                         </Modal.Body>
                         <Modal.Footer>
                           <Button onClick={this.close.bind(this)}>Close</Button>
                         </Modal.Footer>
                       </Modal>

               <Modal show={this.state.showAdd} onHide={this.close.bind(this)}>
                 <Modal.Header closeButton>

                 </Modal.Header>
                 <Modal.Body>
                 <form>
                   <FormGroup >
                     <ControlLabel style={{fontSize:'x-small'}}>Nội dung </ControlLabel>
                     {' '}
                     <FormControl componentClass="textarea" style={{resize: 'vertical'}} placeholder="Vui lòng nhập nội dung  " ref={node => this.content=node}/>
                   </FormGroup>
                   {' '}
                   <FormGroup >
                    <ControlLabel style={{fontSize:'x-small'}}>File đính kèm</ControlLabel>
                     {' '}
                     <input type="file" id="uploadCaptureInputFile"   multiple style={{display:'none'}}/>
                   </FormGroup>
                   {' '}

                 </form>
                 </Modal.Body>
                 <Modal.Footer>
                   <Button onClick={this.close.bind(this)}>Close</Button>
                 </Modal.Footer>
               </Modal>

        </Panel>

    )
  }
}
AssignmentForm.PropTypes={
  _id:PropTypes.string.isRequired,
  main:PropTypes.string.isRequired,
  owner:PropTypes.string.isRequired,
  title:PropTypes.string.isRequired,
  member:PropTypes.array.isRequired,
  files:PropTypes.array.isRequired
}
