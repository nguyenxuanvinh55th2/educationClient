import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import Slider from 'material-ui/Slider';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

import AddQuestion from './AddQuestion.jsx';
import QuestionBank from './QuestionBank.jsx';

class CreateTest extends  React.Component {
  constructor(props) {
    super(props);
    this.state ={name:'',code:'',rate:'',_id:'',tabActive:'insert', description: '', time: 60, userCount: 50, questionSetId: null, getQuestionFrom: null};
    this.code = (Math.floor(Math.random()*99999) + 10000).toString();
    this.isTest = false;
  }

  getQuestionSetId(questionSetId) {
    this.setState({questionSetId});
  }

  saveTest() {
    let { insertExamination, users } = this.props;
    let newTest = {
      code: this.code,
      name: this.state.name,
      description: this.state.description,
      isTest: this.isTest,
      questionSetId: this.state.questionSetId,
      userCount: this.state.userCount,
      time: this.state.time
    }
    let info = JSON.stringify(newTest);
    insertExamination(users.userId, info);
  }

  render() {
    let { time, userCount, getQuestionFrom } = this.state;
    let { users } = this.props;
    return (
      <Tabs className="secondary">
        <TabList className="modal-header" style={{margin: 0}}>
            <Tab>
                <h4 className="modal-title">TẠO KÌ THI</h4>
            </Tab>
            <Tab>
                <h4 className="modal-title">THÊM CÂU HỎI</h4>
            </Tab>
            <Tab>
                <h4 className="modal-title">HOÀN TẤT</h4>
            </Tab>
        </TabList>
        <TabPanel>
          <div style={{width: '60%', marginLeft: '20%'}}>
              <form className="form-horizontal" style={{width: '90%', marginLeft: '5%'}}>
                <div style={{width: '100%', border: '1px solid gray', paddingTop: 50, paddingBottom: 30}}>
                  <div style={{width: '100%', paddingBottom: 10}} className="form-group">
                      <label className="col-sm-3 control-label">Mã kì thi</label>
                      <div className="col-sm-9">
                          <input style={{width: '80%'}} type="text" className="form-control" value={this.code} disabled={true}/>
                      </div>
                  </div>
                  <div style={{width: '100%', paddingBottom: 10}} className={this.state.name ? 'form-group' : 'form-group has-error'}>
                      <label className="col-sm-3 control-label">Tên kì thi</label>
                      <div className="col-sm-9">
                          <input style={{width: '80%'}} type="text" className="form-control" value={this.state.name} onChange={({target}) => this.setState({name: target.value.toUpperCase()})}/>
                          <span className="help-block">{this.state.name ? null : 'tên kì thi là bắt buộc'}</span>
                      </div>
                  </div>
                  <div style={{width: '100%', paddingBottom: 10}} className={this.state.description ? 'form-group' : 'form-group has-error'}>
                      <label className="col-sm-3 control-label">Mô tả</label>
                      <div className="col-sm-9">
                          <textarea style={{width: '80%'}} className="form-control" onChange={({target}) => this.setState({description: target.value})}>
                          </textarea>
                          <span className="help-block">{this.state.description ? null : 'mô tả là bắt buộc'}</span>
                      </div>
                  </div>
                  <div style={{width: '100%', paddingBottom: 10,  display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: '25%', paddingRight: '25%'}}>
                      <button type="button" className="btn btn-primary" style={{width: 150}} disabled={!this.state.name} onClick={() => {
                          this.setState({getQuestionFrom: 'questionBank'})
                        }}>NGÂN HÀNG CÂU HỎI</button>
                      <button type="button" className="btn btn-primary" style={{width: 150}} disabled={!this.state.name} onClick={() => {
                          this.setState({getQuestionFrom: 'questionCreater'})
                        }}>CÂU HỎI TỰ TẠO</button>
                  </div>
                </div>
              </form>
          </div>
        </TabPanel>
        <TabPanel>
          {
            getQuestionFrom === 'questionCreater' ?
            <AddQuestion { ...this.props } getQuestionSetId={this.getQuestionSetId.bind(this)}/> :
            <QuestionBank { ...this.props } getQuestionSetId={this.getQuestionSetId.bind(this)}/>
          }
        </TabPanel>
        <TabPanel>
          <div style={{width: '60%', marginLeft: '20%'}}>
              <form className="form-horizontal" style={{width: '90%', marginLeft: '5%'}}>
                <div style={{width: '100%', border: '1px solid gray', paddingTop: 50, paddingBottom: 30}}>
                  <label className="col-sm-12">Tổng thời gian cho kì thi</label>
                  <div className="col-sm-12" style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 20, paddingRight: 20}}>
                      <Slider defaultValue={time} step={1} value={time} min={15} max={120} style={{width: '80%'}} onChange={(_, newValue) => {
                          this.setState({time: newValue});
                        }}/>
                      <input style={{width: '20%'}} type="text" className="form-control" value={time} onChange={({target}) => {
                          this.setState({time: target.value});
                        }}/>
                  </div>
                  <label className="col-sm-12">Số lượng thí sinh tối đa</label>
                  <div className="col-sm-12" style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 20, paddingRight: 20}}>
                      <Slider defaultValue={userCount} step={1} value={userCount} min={1} max={100} style={{width: '80%'}} onChange={(_, newValue) => {
                          this.setState({userCount: newValue});
                        }}/>
                      <input style={{width: '20%'}} type="text" className="form-control" value={userCount} onChange={({target}) => {
                          this.setState({userCount: target.value});
                        }}/>
                  </div>
                  <label className="col-sm-12">Đề thi của bạn được dùng để</label>
                  <RadioButtonGroup name="shipSpeed" defaultSelected="not_light" style={{paddingLeft: 20}} onChange={(_, value) => {
                      if(value === 'practice') {
                        this.isTest = false;
                      } else {
                          this.isTest = true;
                      }
                    }}>
                    <RadioButton
                      value="practice"
                      label="Ôn tập"
                    />
                    <RadioButton
                      value="test"
                      label="Kiểm tra"
                    />
                  </RadioButtonGroup>
                  <div style={{width: '100%', paddingBottom: 10,  display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: '25%', paddingRight: '25%'}}>
                      <button type="button" className="btn btn-primary" style={{width: '100%'}} onClick={this.saveTest.bind(this)}>HOÀN TẤT</button>
                  </div>
                </div>
              </form>
          </div>
        </TabPanel>
      </Tabs>
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
