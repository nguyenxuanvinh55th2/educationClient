import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import Checkbox from 'material-ui/Checkbox';

import QuestionReviewItem from './QuestionReviewItem.jsx';

class AnswerItem extends React.Component {
  render() {
    let { answer } = this.props;
    return (
      <div style={{width: '100%'}}>
        { answer }
      </div>
    )
  }
}

class QuestionItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showAnswer: false, checked: false};
  }

  renderAnswerSet(question) {
    return question.answerSet.map((item, idx) => (
      <AnswerItem key={idx} answer={item}/>
    ));
  }

  renderCorrectAnswer(question) {
    return question.correctAnswer.map((item, idx) => (
      <AnswerItem key={idx} answer={item}/>
    ));
  }

  showAnswer() {
    let showAnswer = this.state.showAnswer;
    this.setState({showAnswer: !showAnswer});
  }

  render() {
    let { question } = this.props;
    let { showAnswer } = this.state;
    return (
      <div style={{width: '100%', paddingLeft: '20%', paddingRight: '20%'}}>
        <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
          <button className="col-sm-10" style={{width: '100%',marginBottom: 15, marginRight: 10}} className="btn btn-default" onClick={this.showAnswer.bind(this)}>
            {question.question}
          </button>
          <Checkbox
            label="Chọn câu hỏi"
            checked={this.state.checked}
            onCheck={(_, isInputChecked) => {
              if(isInputChecked) {
                this.props.addQuestion(question)
              } else {
                  this.props.removeQuestion(question)
              }
              this.setState({checked: isInputChecked})
            }}
            style={{width: 180}}
          />
        </div>
        {
          showAnswer ?
          <div style={{width: '60%', marginBottom: 15}}>
            <font style={{color: 'blue', fontWeight: 'bold'}}>Câu hỏi:</font>
            <div style={{width: '100%'}}>
              {question.question}
            </div>
            <font style={{color: 'blue', fontWeight: 'bold'}}>Câu trả lời:</font>
            { this.renderAnswerSet(question) }
            <font style={{color: 'blue', fontWeight: 'bold'}}>Câu trả đúng:</font>
            { this.renderCorrectAnswer(question) }
            <font style={{color: 'blue', fontWeight: 'bold'}}>Điểm số: </font>
            <div style={{width: '100%'}}>
              { question.score }
            </div>
          </div> : null
        }
      </div>
    )
  }
}

class QuestionSetItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showQuestion: false};
  }

  renderQuestionSet(questionSet) {
    return questionSet.questions.map(item => (
      <QuestionItem key={item._id} question={item} addQuestion={this.props.addQuestion} removeQuestion={this.props.removeQuestion}/>
    ));
  }

  showQuestion() {
    let showQuestion = this.state.showQuestion;
    this.setState({showQuestion: !showQuestion});
  }

  render() {
    let { questionSet, getQuestionSet } = this.props;
    let { showQuestion } = this.state;
    return (
      <div style={{width: '100%', paddingLeft: '20%', paddingRight: '20%'}}>
        <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
          <div className="col-sm-9" style={{padding: '5px 5px 0px 0px'}}>
            <button className="btn btn-default" style={{width: '100%'}} onClick={this.showQuestion.bind(this)}>
              {questionSet.title}
            </button>
          </div>
          <div className="col-sm-2" style={{padding: '5px 5px 0px 0px'}}>
            <button className="btn btn-primary" style={{width: '100%'}} onClick={() => getQuestionSet(questionSet)}>Chọn bộ câu hỏi</button>
          </div>
          <div className="col-sm-1" style={{padding: '5px 5px 0px 0px'}}>
            <button className="btn btn-danger" style={{width: '100%'}}>
              <i className="fa fa-times" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        {
          showQuestion ?
          <div style={{width: '60%', marginBottom: 15}}>
            { this.renderQuestionSet(questionSet) }
          </div> : null
        }
      </div>
    )
  }
}

class QuesionBank extends React.Component {
  constructor(props) {
    super(props);
    this.state = {questionList: [], questionSet: null, questionType: null};
  }

  addQuestion(question) {
    let questionList = this.state.questionList;
    questionList.push(question);
    this.setState({questionList});
    this.setState({questionType: 'question'});
  }

  getQuestionSet(questionSet) {
    if(questionSet) {
      this.setState({questionSet});
      this.setState({questionType: 'questionSet'});
    }
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
    this.setState({questionType: 'question'});
  }

  renderQuestionReview() {
    let { questionList, questionSet, questionType } = this.state;
    let questionReviewList = questionType === 'questionSet' ? questionSet.questions : questionList;
    console.log("questionReviewList ", questionReviewList);
    return questionReviewList.map((item, idx) => (
      <QuestionReviewItem key={item._id} question={item} publicQuestion={this.publicQuestion.bind(this, item._id)}/>
    ))
  }

  saveQuestion() {
    let { questionSet } = this.state;
    this.props.getQuestionSetId(questionSet._id);
  }

  render() {
    let { data, getQuestionSetId } = this.props;
    console.log("questionSet ", this.state);
    if(data.loading) {
        return (
            <div className="spinner spinner-lg"></div>
        );
    } else {
      console.log("message ", data);

      return(
        <Tabs className="secondary">
          <TabList className="modal-header" style={{margin: 0}}>
              <Tab>
                  <h4 className="modal-title">CÁ NHÂN</h4>
              </Tab>
              <Tab>
                  <h4 className="modal-title">CỘNG ĐỒNG</h4>
              </Tab>
              <Tab>
                  <h4 className="modal-title">XEM LẠI</h4>
              </Tab>
          </TabList>
          <TabPanel>
            <Tabs className="secondary">
              <TabList className="modal-header" style={{margin: 0}}>
                  <Tab>
                      <h4 className="modal-title">LẦN LƯỢT</h4>
                  </Tab>
                  <Tab>
                      <h4 className="modal-title">NGẪU NHIÊN</h4>
                  </Tab>
              </TabList>
              <TabPanel>
                <div style={{width: '100%', paddingLeft: '10%'}}>
                  {
                    data.questionSetBankUser.map(item => (
                      <QuestionSetItem
                        key={item._id}
                        questionSet={item}
                        getQuestionSet={this.getQuestionSet.bind(this)}
                        addQuestion={this.addQuestion.bind(this)}
                        removeQuestion={this.removeQuestion.bind(this)}/>
                    ))
                  }
                </div>
              </TabPanel>
              <TabPanel>
                <div style={{width: '100%', paddingLeft: '10%'}}>
                  ngẫu nhiên
                </div>
              </TabPanel>
            </Tabs>
          </TabPanel>
          <TabPanel>
            <div style={{width: '100%', paddingLeft: '10%'}}>

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
}

const QUESTION_SET_QUERY = gql`
    query questionSetBankUser($userId: String!) {
        questionSetBankUser(userId: $userId) {
          _id
          title
          description
          questionCount
          questions {
            _id
            question
            answerSet
            correctAnswer
            correctRate
          }
        }
}`

export default compose (
    graphql(QUESTION_SET_QUERY, {
        options: (owProps)=> ({
            variables: {userId: owProps.users.userId},
            forceFetch: true
        })
    }),
)(QuesionBank);
