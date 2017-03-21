import React from 'react';
import __ from 'lodash';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import QuestionCreateItem from './QuestionCreateItem.jsx';
import QuestionReviewItem from './QuestionReviewItem.jsx';

class AddQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {title: '', description: '', questionCount: '', totalScore: '', questionList: [{
      _id: (Math.floor(Math.random()*99999) + 10000).toString(),
      question: '',
      answerSet: [{
        _id: (Math.floor(Math.random()*99999) + 10000).toString(),
        answer: '',
      }],
      correctAnswer: [],
      score: 0,
      isPublic: false
    }]};
    this.code = (Math.floor(Math.random()*99999) + 10000).toString();
  }

  renderQuestionCreate() {
    let { questionList } = this.state;
    return questionList.map((item, idx) =>  (
      <QuestionCreateItem
        key = { idx }
        index = { item }
        removeQuestion = { this.removeQuestion.bind(this, item) }
        setQuestionValue = { this.setQuestionValue.bind(this, item._id) }
        setScoreValue = { this.setScoreValue.bind(this, item._id) }
        setCorrectAnswer = { this.setCorrectAnswer.bind(this, item._id) }
        setAnswerSet = { this.setAnswerSet.bind(this, item._id)}
        question = { item }/>
    ))
  }

  renderQuestionReview() {
    let { questionList } = this.state;
    return questionList.map((item, idx) => (
      <QuestionReviewItem key={item._id} question={item} publicQuestion={this.publicQuestion.bind(this, item._id)}/>
    ))
  }

  setQuestionValue(_id, value) {
    let questionList = this.state.questionList;
    for(let i = 0; i < questionList.length; i++) {
      if(questionList[i]._id  === _id) {
        questionList[i].question = value;
        break;
      }
    }
    this.setState({questionList});
  }

  setScoreValue(_id, value) {
    let questionList = this.state.questionList;
    for(let i = 0; i < questionList.length; i++) {
      if(questionList[i]._id  === _id) {
        questionList[i].score = value;
        break;
      }
    }
    this.setState({questionList});
  }

  publicQuestion(_id, value) {
    let questionList = this.state.questionList;
    for(let i = 0; i < questionList.length; i++) {
      if(questionList[i]._id  === _id) {
        questionList[i].isPublic = value;
        break;
      }
    }
    this.setState({questionList});
  }

  setAnswerSet(_id, answerSet) {
    let questionList = this.state.questionList;
    for(let i = 0; i < questionList.length; i++) {
      if(questionList[i]._id  === _id) {
        questionList[i].answerSet = answerSet;
        break;
      }
    }
    this.setState({questionList});
  }

  setCorrectAnswer(_id, correctAnswer) {
    let questionList = this.state.questionList;
    for(let i = 0; i < questionList.length; i++) {
      if(questionList[i]._id  === _id) {
        questionList[i].correctAnswer = correctAnswer;
        break;
      }
    }
    this.setState({questionList});
  }

  addNewQuestion() {
    let questionList = this.state.questionList;
    let item = {
      _id: (Math.floor(Math.random()*99999) + 10000).toString(),
      question: '',
      answerSet: [{
        _id: (Math.floor(Math.random()*99999) + 10000).toString(),
        answer: '',
      }],
      correctAnswer: [],
      score: 0,
      isPublic: false
    };
    questionList.push(item);
    this.setState({questionList});
  }

  removeQuestion(index) {
    let questionList = this.state.questionList;
    for(let i = 0; i < questionList.length; i++) {
      if(questionList[i] === index) {
        for(let j = i; j < questionList.length; j++) {
          questionList[j] = questionList[j + 1];
        }
      }
    }
    questionList.splice(questionList.length - 1, 1);
    this.setState({questionList});
  }

  saveQuestion() {
    let { questionList, title, description } = this.state;
    let {  getQuestionSetId } = this.props;
    let questionSet = {
      title,
      description,
      questionCount: questionList.length
    }
    let questionSetString = [];
    questionSet = JSON.stringify(questionSet);
    __.forEach(questionList, item => {
      item.answerSet = item.answerSet.map(item => item.answer);
      item.correctAnswer = item.correctAnswer.map(item => item.answer);
      questionSetString.push(JSON.stringify(item));
    });
    this.props.insertQuestionSet('abc', questionSet,  questionSetString).then(({data}) => {
      getQuestionSetId(data.insertQuestionSet);
    }).catch((error) => {
        console.log('there was an error sending the query', error);
    });
  }

  render() {
    return (
      <Tabs className="secondary">
        <TabList className="modal-header" style={{margin: 0}}>
            <Tab>
                <h4 className="modal-title">BẮT ĐẦU</h4>
            </Tab>
            <Tab>
                <h4 className="modal-title">THÊM NỘI DUNG</h4>
            </Tab>
            <Tab>
                <h4 className="modal-title">XEM LẠI</h4>
            </Tab>
        </TabList>
        <TabPanel>
          <div style={{width: '60%', marginLeft: '20%'}}>
              <form className="form-horizontal" style={{width: '90%', marginLeft: '5%'}}>
                <div style={{width: '100%', border: '1px solid gray', paddingTop: 50, paddingBottom: 30}}>
                  <div style={{width: '100%', paddingBottom: 10}} className={this.state.name ? 'form-group' : 'form-group has-error'}>
                      <label className="col-sm-3 control-label">Tiêu đề câu hỏi</label>
                      <div className="col-sm-9">
                          <input style={{width: '80%'}} type="text" className="form-control" value={this.state.title} onChange={({target}) => this.setState({title: target.value.toUpperCase()})}/>
                          <span className="help-block">{this.state.title ? null : 'tiêu đề câu hỏi là bắt buộc'}</span>
                      </div>
                  </div>
                  <div style={{width: '100%', paddingBottom: 10}} className={this.state.description ? 'form-group' : 'form-group has-error'}>
                      <label className="col-sm-3 control-label">Mô tả</label>
                      <div className="col-sm-9">
                          <textarea style={{width: '80%'}} type="text" className="form-control" value={this.state.description} onChange={({target}) => this.setState({description: target.value})}>
                          </textarea>
                          <span className="help-block">{this.state.description ? null : 'tiêu đề câu hỏi là bắt buộc'}</span>
                      </div>
                  </div>
                  <div style={{width: '100%', paddingBottom: 10}} className={this.state.questionCount ? 'form-group' : 'form-group has-error'}>
                      <label className="col-sm-3 control-label">Số lượng câu hỏi</label>
                      <div className="col-sm-9">
                          <input style={{width: '80%'}} type="number" className="form-control" value={this.state.questionCount} onChange={({target}) => this.setState({questionCount: target.value})}/>
                          <span className="help-block">{this.state.questionCount ? null : 'số lượng câu hỏi là bắt buộc'}</span>
                      </div>
                  </div>
                  <div style={{width: '100%', paddingBottom: 10}} className={this.state.totalScore ? 'form-group' : 'form-group has-error'}>
                      <label className="col-sm-3 control-label">Tổng số điểm</label>
                      <div className="col-sm-9">
                          <input style={{width: '80%'}} type="number" className="form-control" value={this.state.totalScore} onChange={({target}) => this.setState({totalScore: target.value})}/>
                          <span className="help-block">{this.state.totalScore ? null : 'tổng số điểm là bắt buộc'}</span>
                      </div>
                  </div>
                  <div style={{width: '100%', paddingBottom: 10,  display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: '25%', paddingRight: '25%'}}>
                      <button type="button" className="btn btn-primary" style={{width: 150}} disabled={!this.state.name}>THÊM NỘI DUNG</button>
                  </div>
                </div>
              </form>
          </div>
        </TabPanel>
        <TabPanel>
          <div style={{width: '100%', paddingLeft: '10%'}}>
            <div style={{width: '80%'}}>
              { this.renderQuestionCreate() }
            </div>
            <div style={{width: '80%', paddingLeft: '35%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'center'}}>
              <button className="btn btn-primary" style={{width: '30%'}} onClick={this.addNewQuestion.bind(this)}>
                Thêm câu hỏi
              </button>
              <span style={{height: 10}}>
              </span>
              <button className="btn btn-primary" style={{width: '30%'}}>
                Hoàn thành
              </button>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div style={{width: '100%', paddingLeft: '10%', paddingRight: '10%'}}>
            <div style={{width: '100%'}}>
              { this.renderQuestionReview() }
            </div>
            <button className="btn btn-primary" style={{marginLeft: '35%', width: '30%'}} onClick={this.saveQuestion.bind(this)}>Lưu câu hỏi</button>
          </div>
        </TabPanel>
      </Tabs>
    )
  }
}

const INSERT_QUESTION_SET = gql`
    mutation insertQuestionSet ($userId: String!, $questionSet: String!, $questions: [String]!) {
        insertQuestionSet(userId: $userId, questionSet: $questionSet, questions: $questions)
}`

export default compose (
    graphql(INSERT_QUESTION_SET, {
        props: ({mutate})=> ({
            insertQuestionSet : (userId, questionSet, questions) => mutate({variables:{userId, questionSet, questions}})
        })
    }),
)(AddQuestion);
