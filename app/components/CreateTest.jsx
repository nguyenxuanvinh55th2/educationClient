import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import Slider from 'material-ui/Slider';
import { Step, Stepper, StepButton, StepContent, StepLabel } from 'material-ui/Stepper';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import AddQuestion from './AddQuestion.jsx';
import QuestionBank from './QuestionBank.jsx';

class CreateTest extends  React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name:'',
      code:'',
      rate:'',
      _id:'',
      tabActive:'insert',
      description: '',
      time: 60,
      userCount: 50,
      questionSetId: null,
      getQuestionFrom: null,
      stepIndex: 0,
      isTest: false,
      isClassStyle: true,
      openTest: false,
    };
    this.code = (Math.floor(Math.random()*99999) + 10000).toString();
  }

  getQuestionSetId(questionSetId) {
    this.setState({questionSetId});
  }

  handleNext() {
    const {stepIndex} = this.state;
    if (stepIndex < 2) {
      this.setState({stepIndex: stepIndex + 1});
    }
  }

  handlePrev() {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  }

  increaseStepIndex() {
    console.log("message increaseStepIndex");
    this.setState({ stepIndex: 2 });
  }

  renderStepActions(stepIndex) {
    let { time, userCount, getQuestionFrom, isTest, isClassStyle, openTest } = this.state;
    switch (stepIndex) {
      case 0:
        return (
          <div style={{width: '100%'}}>
              <form className="form-horizontal" style={{width: '90%', marginLeft: '5%'}}>
                <div style={{width: '100%', paddingTop: 15, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                  <div style={{width: '70%'}}>
                    <div style={{width: '100%'}} className="form-group">
                      <label className="col-sm-3 control-label" style={{paddingRight: 0, textAlign: 'left'}}>Mã kì thi</label>
                      <div className="col-sm-9" style={{paddingRight: 0}}>
                        <input style={{width: '100%', margin: 0}} type="text" className="form-control" value={this.code} disabled={true}/>
                      </div>
                    </div>
                    <div style={{width: '100%'}} className={this.state.name ? 'form-group' : 'form-group has-error'}>
                      <label className="col-sm-3 control-label" style={{paddingRight: 0, textAlign: 'left'}}>Tên kì thi</label>
                      <div className="col-sm-9" style={{paddingRight: 0}}>
                        <input style={{width: '100%', margin: 0}} type="text" className="form-control" value={this.state.name} onChange={({target}) => this.setState({name: target.value.toUpperCase()})}/>
                        <span className="help-block">{this.state.name ? null : 'tên kì thi là bắt buộc'}</span>
                      </div>
                    </div>
                    <div style={{width: '100%'}} className={this.state.description ? 'form-group' : 'form-group has-error'}>
                      <label className="col-sm-3 control-label" style={{paddingRight: 0, textAlign: 'left'}}>Mô tả</label>
                      <div className="col-sm-9" style={{paddingRight: 0}}>
                        <textarea style={{width: '100%', margin: 0}} className="form-control" onChange={({target}) => this.setState({description: target.value})}>
                        </textarea>
                        <span className="help-block">{this.state.description ? null : 'mô tả là bắt buộc'}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{width: '30%'}}>
                      <button type="button" className="btn btn-primary" style={{width: '100%'}} disabled={!this.state.name} onClick={() => {
                          this.setState({getQuestionFrom: 'questionBank', stepIndex: 1})
                        }}>Ngân hàng câu hỏi</button>
                      <div style={{height: 10}}>
                      </div>
                      <button type="button" className="btn btn-primary" style={{width: '100%'}} disabled={!this.state.name} onClick={() => {
                          this.setState({getQuestionFrom: 'questionCreater', stepIndex: 1})
                        }}>Câu hỏi tự tạo</button>
                  </div>
                </div>
              </form>
          </div>
        );
      case 1:
        if(getQuestionFrom === 'questionCreater') {
          return (
            <AddQuestion { ...this.props } increaseStepIndex={this.increaseStepIndex.bind(this)} getQuestionSetId={this.getQuestionSetId.bind(this)}/>
          )
        } else {
          return (
            <QuestionBank { ...this.props } increaseStepIndex={this.increaseStepIndex.bind(this)} getQuestionSetId={this.getQuestionSetId.bind(this)}/>
          )
        }
      case 2:
        return (
          <div style={{width: '100%'}}>
              <form className="form-horizontal" style={{width: '90%', marginLeft: '5%'}}>
                <div style={{width: '100%', paddingTop: 15}}>
                  <label className="col-sm-12" style={{paddingLeft: 0}}>Tổng thời gian cho kì thi</label>
                  <div className="col-sm-12" style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 0, paddingRight: 20}}>
                      <Slider defaultValue={time} step={1} value={time} min={15} max={120} style={{width: '80%'}} onChange={(_, newValue) => {
                          this.setState({time: newValue});
                        }}/>
                      <input style={{width: '10%', marginTop: 20, marginLeft: 20}} type="text" className="form-control" value={time} onChange={({target}) => {
                          this.setState({time: target.value});
                        }}/>
                      <p style={{marginLeft: 20, marginTop: 20}}>Phút</p>
                  </div>
                  <label className="col-sm-12" style={{paddingLeft: 0}}>Số lượng thí sinh tối đa</label>
                  <div className="col-sm-12" style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 0, paddingRight: 20}}>
                      <Slider defaultValue={userCount} step={1} value={userCount} min={1} max={100} style={{width: '80%'}} onChange={(_, newValue) => {
                          this.setState({userCount: newValue});
                        }}/>
                      <input style={{width: '10%', marginTop: 20, marginLeft: 20}} type="text" className="form-control" value={userCount} onChange={({target}) => {
                          this.setState({userCount: target.value});
                        }}/>
                      <p style={{marginLeft: 20, marginTop: 20}}>SV</p>
                  </div>
                  <label className="col-sm-12" style={{paddingLeft: 0}}>Đề thi của bạn được dùng để</label>
                  <div className="col-sm-12" style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', marginTop: 25}}>
                    <label style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                      <input checked={!isTest && 'checked'} type="radio" name="optradio" onChange={({target}) => {
                          if(isTest) {
                            this.setState({isTest: false})
                          }
                        }}/><p style={{color: '#818181', width: 100}}>&nbsp;&nbsp;&nbsp;Ôn tập</p>
                    </label>
                    <label style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                      <input checked={isTest && 'checked'} type="radio" name="optradio" onChange={({target}) => {
                          if(!isTest) {
                            this.setState({isTest: true});
                          }
                        }}/><p style={{color: '#818181', width: 100}}>&nbsp;&nbsp;&nbsp;Kiểm tra</p>
                    </label>
                  </div>
                  <label className="col-sm-12" style={{paddingLeft: 0}}>Hình thức thi</label>
                  <div className="col-sm-12" style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', marginTop: 25}}>
                    <label style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                      <input checked={isClassStyle && 'checked'} type="radio" name="optradio1" onChange={({target}) => {
                          if(!isClassStyle) {
                            this.setState({isClassStyle: true})
                          }
                        }}/><p style={{color: '#818181', width: 100}}>&nbsp;&nbsp;&nbsp;Trên lớp</p>
                    </label>
                    <label style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                      <input checked={!isClassStyle && 'checked'} type="radio" name="optradio1" onChange={({target}) => {
                          if(isClassStyle) {
                            this.setState({isClassStyle: false});
                          }
                        }}/><p style={{color: '#818181', width: 100}}>&nbsp;&nbsp;&nbsp;Tại nhà</p>
                    </label>
                  </div>
                  <label className="col-sm-12" style={{paddingLeft: 0}}>Được sử dụng tài liệu?</label>
                  <div className="col-sm-12" style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', marginTop: 25}}>
                    <label style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                      <input checked={!openTest && 'checked'} type="radio" name="optradio2" onChange={({target}) => {
                          if(openTest) {
                            this.setState({openTest: false})
                          }
                        }}/><p style={{color: '#818181', width: 100}}>&nbsp;&nbsp;&nbsp;Không</p>
                    </label>
                    <label style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                      <input checked={openTest && 'checked'} type="radio" name="optradio2" onChange={({target}) => {
                          if(!openTest) {
                            this.setState({openTest: true});
                          }
                        }}/><p style={{color: '#818181', width: 100}}>&nbsp;&nbsp;&nbsp;Có</p>
                    </label>
                  </div>
                  <div style={{width: '100%', paddingBottom: 10,  display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: '25%', paddingRight: '25%'}}>
                      <button type="button" className="btn btn-primary" style={{width: '100%'}} onClick={this.saveTest.bind(this)}>HOÀN TẤT</button>
                  </div>
                </div>
              </form>
          </div>
        )
      default:
        return null;
    }
  }

  saveTest() {
    let { insertExamination, users } = this.props;
    let { isClassStyle } = this.state;
    let newTest = {
      code: this.code,
      name: this.state.name,
      description: this.state.description,
      isTest: this.state.isTest,
      openTest: this.state.openTest,
      questionSetId: this.state.questionSetId,
      userCount: this.state.userCount,
      time: this.state.time
    }

    let testStyle = isClassStyle ? 'isClassStyle' : 'isHomeStyle';
    newTest[testStyle] = true;

    let info = JSON.stringify(newTest);
    insertExamination(users.userId, info).then(({data}) => {
      let _id = data.insertExamination;
      browserHistory.push('/waitExam/' + _id);
    }).catch((err) => {

    });
  }

  render() {
    let { stepIndex } = this.state;
    let { users } = this.props;
    return (
      <div style={{width: window.innerWidth - (2 * 256), marginLeft: 256}}>
        <div style={{width: '60%', backgroundColor: 'white', paddingTop: 10}}>
          <h3 style={{width: '100%', textAlign: 'center', color: '#00BCD4', marginBottom: 0}}>TẠO KÌ THI</h3>
          <Stepper orientation="vertical" linear={false} activeStep={stepIndex}>
            <Step>
              <StepLabel style={{color: '#00BCD4', fontSize: 13, fontWeight: 550}}>
                Tạo kì thi
              </StepLabel>
              <StepContent style={{paddingLeft: 0}}>
                {this.renderStepActions(0)}
              </StepContent>
            </Step>
            <Step>
              <StepLabel style={{color: '#00BCD4', fontSize: 13, fontWeight: 550}}>
                Thêm câu hỏi
              </StepLabel>
              <StepContent>
                {this.renderStepActions(1)}
              </StepContent>
            </Step>
            <Step>
              <StepLabel style={{color: '#00BCD4', fontSize: 13, fontWeight: 550}}>
                Hoàn tất
              </StepLabel>
              <StepContent style={{paddingLeft: 0}}>
                {this.renderStepActions(2)}
              </StepContent>
            </Step>
          </Stepper>
        </div>
      </div>
    )
  }
}

const INSERT_TEST = gql`
    mutation insertExamination($userId: String!, $info: String!) {
        insertExamination(userId: $userId, info: $info)
}`

export default compose (
    graphql(INSERT_TEST, {
        props: ({mutate})=> ({
            insertExamination : (userId, info) => mutate({variables:{userId, info}})
        })
    }),
)(CreateTest);
