import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import __ from 'lodash';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import Checkbox from 'material-ui/Checkbox';
import Drawer from 'material-ui/Drawer';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

import QuestionReviewItem from './QuestionReviewItem.jsx';

import '../react_tabs_custom.css'

import Combobox from './Combobox.jsx';

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

class SelectQuestionInputForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {easyQuestionCount: 0, normalQuestionCount: 0, hardQuestionCount: 0, getNew: false};
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.data.questionBySubject && nextProps.data.questionBySubject.length > 0 && !this.state.getNew) {
      this.props.getQuestionBySubject(nextProps.data.questionBySubject);
      this.setState({getNew: true});
    }
  }

  render() {
    let { data, getQuestionTypeCount } = this.props
    let hardQuestionCount = __.filter(data.questionBySubject, item => item.correctRate && item.correctRate <= 0.3).length;
    let normalQuestionCount = __.filter(data.questionBySubject, item => item.correctRate && item.correctRate > 0.3 && item.correctRate <= 0.6).length;
    let easyQuestionCount = __.filter(data.questionBySubject, item => item.correctRate && item.correctRate > 0.6).length;
    return (
      <div style={{width: '100%'}}>
        <p className="col-sm-9 col-sm-offset-2">{'Số lượng câu hỏi dễ: ' + easyQuestionCount}</p>
        <p className="col-sm-9 col-sm-offset-2">{'Số lượng câu trung bình: ' + normalQuestionCount}</p>
        <p className="col-sm-9 col-sm-offset-2">{'Số lượng câu hỏi khó: ' + hardQuestionCount}</p>
        <div style={{width: '100%', paddingBottom: 10, margin: 0}} className={this.props.easyQuestionCount ? 'form-group' : 'form-group has-error'}>
            <label className="col-sm-2 control-label" style={{paddingRight: 0, paddingLeft: 10, textAlign: 'left'}}>Nhập số lượng câu hỏi dễ</label>
            <div className="col-sm-9">
                <input style={{width: '80%'}} type="number" className="form-control" min="0" max={easyQuestionCount.toString()} value={this.props.easyQuestionCount} onChange={({target}) => getQuestionTypeCount('easyQuestionCount', target.value)}/>
                <span className="help-block">{this.props.easyQuestionCount ? null : 'Thông tin này là bắt buộc'}</span>
            </div>
        </div>
        <div style={{width: '100%', paddingBottom: 10, margin: 0}} className={this.props.normalQuestionCount ? 'form-group' : 'form-group has-error'}>
            <label className="col-sm-2 control-label" style={{paddingRight: 0, paddingLeft: 10, textAlign: 'left'}}>Số lượng câu hỏi trung bình</label>
            <div className="col-sm-9">
                <input style={{width: '80%'}} type="number" className="form-control" min="0" max={normalQuestionCount.toString()} value={this.props.normalQuestionCount} onChange={({target}) => getQuestionTypeCount('normalQuestionCount', target.value)}/>
                <span className="help-block">{this.props.normalQuestionCount ? null : 'Thông tin này là bắt buộcc'}</span>
            </div>
        </div>
        <div style={{width: '100%', paddingBottom: 10, margin: 0}} className={this.props.hardQuestionCount ? 'form-group' : 'form-group has-error'}>
            <label className="col-sm-2 control-label" style={{paddingRight: 0, paddingLeft: 10, textAlign: 'left'}}>Nhập số lượng câu hỏi khó</label>
            <div className="col-sm-9">
                <input style={{width: '80%'}} type="number" className="form-control" min="0" max={hardQuestionCount.toString()} value={this.props.hardQuestionCount} onChange={({target}) => getQuestionTypeCount('hardQuestionCount', target.value)}/>
                <span className="help-block">{this.props.hardQuestionCount ? null : 'Thông tin này là bắt buộc'}</span>
            </div>
        </div>
      </div>
    )
  }
}

const QUESTION_BY_SUBJECT = gql`
    query questionBySubject($token: String, $subjectId: String!, $type: String!) {
        questionBySubject(token: $token, subjectId: $subjectId, type: $type) {
            _id
            question
            questionSetId
            answerSet
            correctAnswer
            correctRate
        }
}`

const SelectQuestionInputFormWithData = compose (
    graphql(QUESTION_BY_SUBJECT, {
        options: (owProps)=> ({
            variables: {token: localStorage.getItem('Meteor.loginTokenFacebook') ? localStorage.getItem('Meteor.loginTokenFacebook') : localStorage.getItem('Meteor.loginTokenGoogle') ? localStorage.getItem('Meteor.loginTokenGoogle') : localStorage.getItem('Meteor.loginToken'), subjectId: owProps.subjectId, type: owProps.type},
            forceFetch: true
        })
    }),
)(SelectQuestionInputForm);



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

  componentWillMount() {
    let { questionList, question } = this.props;
    if(__.find(questionList, item => item._id === question._id)) {
      this.setState({checked: true});
    } else {
        this.setState({checked: false});
    }
  }

  renderCorrectAnswer(question) {
    return question.correctAnswer.map((item, idx) => (
      <AnswerItem key={idx} answer={item}/>
    ));
  }ta

  showAnswer() {
    let showAnswer = this.state.showAnswer;
    this.setState({showAnswer: !showAnswer});
  }

  render() {
    let { question } = this.props;
    let { showAnswer } = this.state;
    return (
      <div style={{width: '100%', paddingLeft: 0, paddingRight: '20%'}}>
        <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
          <div className="col-sm-10" style={{width: '100%',marginBottom: 10, marginRight: 10, padding: 5, border: '1px solid gray', borderRadius: 10}} onClick={this.showAnswer.bind(this)}>
            {question.question}
       ta   </div>
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
          <div style={{width: '100%', marginBottom: 15}}>
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
    let { questionList } = this.props;
    return questionSet.questions.map(item => (
      <QuestionItem key={item._id} question={item} addQuestion={this.props.addQuestion} removeQuestion={this.props.removeQuestion} questionList={questionList}/>
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
      <div style={{width: '100%', paddingLeft: 15, paddingRight: 15, paddingTop: 3}}>
        <div style={{width: '70%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
          <div className="col-sm-9" style={{padding: '5px 11px 0px 0px'}}>
            <button className="btn" style={{width: '100%', backgroundColor: '#D7DCDC'}} onClick={this.showQuestion.bind(this)}>
              {questionSet.title}
            </button>
          </div>
          <div className="col-sm-2" style={{padding: '5px 0px 0px 0px'}}>
            <button className="btn" style={{width: '100%', backgroundColor: '#35bcbf', color: 'white'}} onClick={() => getQuestionSet(questionSet)}>Chọn</button>
          </div>
          <div className="col-sm-1" style={{padding: '5px 5px 0px 0px'}}>
            <button className="btn" style={{width: '100%', backgroundColor: 'white', color: '#35bcbf', padding: 0}} onClick={() => {
                let remove = confirm('Bạn thật sự muốn xóa bộ câu hỏi này?');
                if(remove) {
                  let token = localStorage.getItem('Meteor.loginTokenFacebook') ? localStorage.getItem('Meteor.loginTokenFacebook') : localStorage.getItem('Meteor.loginTokenGoogle') ? localStorage.getItem('Meteor.loginTokenGoogle') : localStorage.getItem('Meteor.loginToken')
                  this.props.removeQuestionSet(token, questionSet._id).then(() => {
                    this.props.refetch();
                  });
                }
              }}>
              <i style={{fontSize: 19, paddingTop: 6, paddingBottom: 0}} className="fa fa-trash" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        {
          showQuestion ?
          <div style={{width: '80%', marginTop: 15}}>
            { this.renderQuestionSet(questionSet) }
          </div> : null
        }
      </div>
    )
  }
}

const REMOVE_QUESTION_SET = gql`
    mutation removeQuestionSet ($token: String!, $_id: String!) {
      removeQuestionSet(token: $token, _id: $_id)
}`

const QuestionSetItemMutate = compose (
    graphql(REMOVE_QUESTION_SET, {
        props: ({mutate})=> ({
            removeQuestionSet : (token, _id) => mutate({variables:{token, _id}})
        })
    }),
)(QuestionSetItem);



class QuesionBank extends React.Component {
  constructor(props) {
    super(props);
    this.state = {questionList: [], questionSet: null, questionType: null, subjectId: null, easyQuestionCount: 0, normalQuestionCount: 0, hardQuestionCount: 0, questionBySubject: null, showQuestionBank: 'personal', openDrawer: true, showReview: false, bankType: 'sequence'};
  }

  addQuestion(question) {
    question = __.cloneDeep(question);
    question['score'] = 1;
    let questionList = this.state.questionList;
    questionList.push(question);
    this.setState({questionList});
    this.setState({questionType: 'question'});
    this.props.addNotificationMute({fetchData: true, message: 'Thêm câu hỏi thành công', level:'success'});
  }

  componentWillReceiveProps(nextProps) {
    let { data } = nextProps;
    if(data.subjectByUser && data.subjectByUser.legth) {
      let subject = data.subjectByUser[0];
      this.setState({subjectId: subject._id})
    } else {
        this.setState({subjectId: 'other'})
    }
  }

  componentDidMount() {
    Tabs.setUseDefaultStyles(false);
  }

  getQuestionSet(questionSet) {
    questionSet = __.cloneDeep(questionSet);
    __.forEach(questionSet.questions, item => item['score'] = 1)
    if(questionSet) {
      this.setState({questionSet});
      this.setState({questionType: 'questionSet'});
      this.props.addNotificationMute({fetchData: true, message: 'Thêm bộ câu hỏi thành công', level:'success'});
    }
  }

  getQuestionBySubject(questionBySubject) {
    this.setState({questionBySubject});
  }

  getQuestionTypeCount(type, value) {
    if(type === 'easyQuestionCount') {
      this.setState({easyQuestionCount: value});
    } else
        if(type === 'normalQuestionCount') {
          this.setState({normalQuestionCount: value});
        } else {
            this.setState({hardQuestionCount: value});
        }
  }

  removeAllQuestion() {
    this.setState({questionList: []});
  }

  getQuestionListByRate(type) {
    let { questionBySubject } = this.state;
    let questionList = []
    questionBySubject = __.cloneDeep(questionBySubject);
    if(questionBySubject) {
      let easyQuestionSet = __.filter(questionBySubject, item => item.correctRate && item.correctRate > 0.6);
      for(let i = 0; i < easyQuestionSet.length; i++) {
        let randomNumber = Math.floor(Math.random() * easyQuestionSet.length) + 0;
        if(i > 0 && randomNumber === easyQuestionSet[i - 1].randomNumber) {
          easyQuestionSet[i]['randomNumber'] = randomNumber + i;
          // i --;
        } else {
            easyQuestionSet[i]['randomNumber'] = randomNumber;
        }
        easyQuestionSet[i]['score'] = 1;
      }
      easyQuestionSet.sort((a, b) => a.randomNumber - b.randomNumber);
      for(let i = 0; i < this.state.easyQuestionCount; i++) {
        questionList.push(easyQuestionSet[i]);
      }

      let normalQuestionSet = __.filter(questionBySubject, item => item.correctRate && item.correctRate > 0.3 && item.correctRate <= 0.6);
      for(let i = 0; i < normalQuestionSet.length; i++) {
        let randomNumber = Math.floor(Math.random() * normalQuestionSet.length) + 0;
        if(i > 0 && randomNumber === normalQuestionSet[i - 1].randomNumber) {
          normalQuestionSet[i]['randomNumber'] = randomNumber + i;
          // i --;
        } else {
            normalQuestionSet[i]['randomNumber'] = randomNumber;
        }
        normalQuestionSet[i]['score'] = 1;
      }
      normalQuestionSet.sort((a, b) => a.randomNumber - b.randomNumber);
      for(let i = 0; i < this.state.normalQuestionCount; i++) {
        questionList.push(normalQuestionSet[i]);
      }

      let hardQuestionSet = __.filter(questionBySubject, item => item.correctRate && item.correctRate <= 0.3);
      for(let i = 0; i < hardQuestionSet.length; i++) {
        let randomNumber = Math.floor(Math.random() * hardQuestionSet.length) + 0;
        if(i > 0 && randomNumber === hardQuestionSet[i - 1].randomNumber) {
          hardQuestionSet[i]['randomNumber'] = randomNumber + i;
          // i --;
        } else {
            hardQuestionSet[i]['randomNumber'] = randomNumber;
        }
        hardQuestionSet[i]['score'] = 1;
      }
      hardQuestionSet.sort((a, b) => a.randomNumber - b.randomNumber);
      for(let i = 0; i < this.state.hardQuestionCount; i++) {
        questionList.push(hardQuestionSet[i]);
      }
    }
    this.setState({questionList, questionType: type});
    this.props.addNotificationMute({fetchData: true, message: 'Thêm bộ câu hỏi thành công', level:'success'});
  }

  getSubject(value) {
    this.setState({subjectId: value});
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

  getScore(_id, score) {
    let { questionList, questionType } = this.state;
    if(questionType === 'questionSet') {
      let questionSet = this.state.questionSet;
      for(let i = 0; i < questionSet.questions.length; i++) {
        if(questionSet.questions[i]._id  === _id) {
          questionSet.questions[i].score = parseInt(score);
          break;
        }
      }
      this.setState({questionSet});
    } else {
        for(let i = 0; i < questionList.length; i++) {
          if(questionList[i]._id  === _id) {
            questionList[i].score = parseInt(score);
            break;
          }
        }
    }
    this.setState({questionList});
  }

  renderQuestionReview() {
    let { questionList, questionSet, questionType } = this.state;
    let questionReviewList = questionType === 'questionSet' ? questionSet.questions : questionList;
    return questionReviewList.map((item, idx) => (
      <QuestionReviewItem index={parseInt(idx) + 1} getReviewFrom={'questionBank'} key={item._id + idx} question={item} publicQuestion={this.publicQuestion.bind(this, item._id)} questionType={questionType} getScore={this.getScore.bind(this)} correctRate={item.correctRate}/>
    ))
  }

  saveQuestion() {
    let { questionType, subjectId, questionList, questionSet } = this.state;
    let { getQuestionSetId, increaseStepIndex } = this.props;
    if(questionType === 'questionSet') {
      getQuestionSetId(questionSet._id);
      increaseStepIndex();
    } else {
        let questionSet = {
          title: 'câu hỏi từ ngân hàng',
          description: 'mô tả',
          questionCount: questionList.length,
          isPublic: false,
          subjectId
        }
        let questionSetString = [];
        questionSet = JSON.stringify(questionSet);
        questionList = __.cloneDeep(questionList);
        __.forEach(questionList, item => {
          item.answerSet = item.answerSet;
          item.correctAnswer = item.correctAnswer;
          item.subjectId = subjectId;
          questionSetString.push(JSON.stringify(item));
        });
        this.props.insertQuestionFromBank(localStorage.getItem('Meteor.loginTokenFacebook') ? localStorage.getItem('Meteor.loginTokenFacebook') : localStorage.getItem('Meteor.loginTokenGoogle') ? localStorage.getItem('Meteor.loginTokenGoogle') : localStorage.getItem('Meteor.loginToken'), questionSet,  questionSetString).then(({data}) => {
          this.props.addNotificationMute({fetchData: true, message: 'Tạo câu hỏi thành công', level:'success'});
          getQuestionSetId(data.insertQuestionSet);
          increaseStepIndex();
        }).catch((error) => {
            console.log('there was an error sending the query', error);
        });
    }
  }

  drawerContent() {
    let { showQuestionBank, showReview, bankType } = this.state;
    let data = __.cloneDeep(this.props.data);
    data.subjectByUser.push({
      _id: 'other',
      name: 'Khác'
    })
    if(showQuestionBank === 'personal') {
      return (
        <div>
          <h4 style={{color: '#35bcbf', paddingLeft: 30, marginBottom: 0}}>Thêm câu hỏi từ cá nhân</h4>
          <Tabs className="secondary" style={{paddingTop: 7}}>
          <TabList style={{margin: 0, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 40, paddingRight: 40, backgroundColor: 'white', border: 'none'}}>
              <Tab style = {{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', border: 'none'}} onClick={() => {
                if(bankType !== 'sequence') {
                  this.setState({bankType: 'sequence'})
                }
              }}>
                <input checked={bankType === 'sequence' && 'checked'} type="radio" name="uBankType" onChange={({target}) => {
                    if(bankType !== 'sequence') {
                      this.setState({bankType: 'sequence'})
                    }
                  }}/><p style={{color: '#818181', width: 100}}>&nbsp;&nbsp;&nbsp;Lần lượt</p>
              </Tab>
              <Tab style = {{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', border: 'none'}}  onClick={() => {
                if(bankType !== 'random') {
                  this.setState({bankType: 'random'})
                }
              }}>
                <input checked={bankType === 'random' && 'checked'} type="radio" name="uBankType" onChange={({target}) => {
                    if(bankType !== 'random') {
                      this.setState({bankType: 'random'})
                    }
                  }}/><p style={{color: '#818181', width: 100}}>&nbsp;&nbsp;&nbsp;Ngẫu nhiên</p>
              </Tab>
              <Tab style={{float: 'right', width: '70%', paddingLeft: 15, border: 'none'}}>
                <button className="btn" style={{backgroundColor: '#35bcbf', color: 'white', float: 'right', border: 'none', marginTop: -3}} onClick={() => {
                    this.setState({showReview: true, bankType: ''})
                  }}>XEM LẠI</button>
              </Tab>
          </TabList>
          <TabPanel>
            <div style={{width: '100%', paddingLeft: '10%'}}>
              {
                data.questionSetBankUser.map(item => (
                  <QuestionSetItemMutate
                    key={item._id}
                    questionSet={item}
                    getQuestionSet={this.getQuestionSet.bind(this)}
                    addQuestion={this.addQuestion.bind(this)}
                    removeQuestion={this.removeQuestion.bind(this)}
                    questionList={this.state.questionList}
                    refetch={this.props.data.refetch}/>
                ))
              }
            </div>
          </TabPanel>
          <TabPanel>
            <div style={{width: '80%', marginLeft: 35}}>
                <div className="form-horizontal" style={{width: '90%', marginLeft: '5%'}}>
                  <div style={{width: '100%', paddingTop: 10, paddingBottom: 30}}>
                    {
                      data.subjectByUser ?
                      <div style={{width: '100%'}}>
                        <div style={{width: '100%', paddingBottom: 10, paddingLeft: 19, paddingRight: 0, marginBottom: 0}} className="form-group">
                            <label className="col-sm-2 control-label" style={{paddingRight: 5, paddingLeft: 10, textAlign: 'left', whiteSpace: 'nowrap'}}>Chọn môn học</label>
                            <div className="col-sm-9" style={{paddingLeft: 24, paddingRight: 78}}>
                              <Combobox
                                name="subject"
                                data={data.subjectByUser}
                                datalistName="subjectDatalist"
                                label="name"
                                placeholder="Chọn môn học"
                                value={this.state.subjectId}
                                getValue={this.getSubject.bind(this)}/>
                            </div>
                        </div>
                        <SelectQuestionInputFormWithData
                          subjectId={this.state.subjectId}
                          easyQuestionCount={this.state.easyQuestionCount}
                          normalQuestionCount={this.state.normalQuestionCount}
                          hardQuestionCount={this.state.hardQuestionCount}
                          getQuestionTypeCount={this.getQuestionTypeCount.bind(this)}
                          getQuestionBySubject={this.getQuestionBySubject.bind(this)}
                          questionBySubject={this.state.questionBySubject}
                          type={'personal'}/>
                      </div> : null
                    }
                  </div>
                  <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                    <button className="btn" style={{backgroundColor: '#35bcbf', color: 'white'}} onClick={() => this.getQuestionListByRate('question')}>Lưu câu hỏi</button>
                  </div>
                </div>
            </div>
          </TabPanel>
          <TabPanel>
          {
            showReview ?
            <div style={{width: '100%', paddingLeft: '10%', paddingRight: '10%'}}>
              <div style={{width: '100%', paddingLeft: '20%', paddingRight: '20%'}}>
                { this.renderQuestionReview() }
              </div>
              <button className="btn" style={{marginLeft: '35%', width: '30%', backgroundColor: '#35bcbf', color: 'white'}} onClick={this.saveQuestion.bind(this)}>Lưu câu hỏi</button>
            </div> : null
          }
          </TabPanel>
        </Tabs>
        </div>
      )
    } else
        if(showQuestionBank === 'public') {
          return (
            <div>
              <h4 style={{color: '#35bcbf', paddingLeft: 30, marginBottom: 0}}>Thêm câu hỏi từ cộng đồng</h4>
             <Tabs className="secondary" style={{paddingTop: 7}}>
              <TabList style={{margin: 0, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 40, paddingRight: 40, backgroundColor: 'white', border: 'none'}}>
                  <Tab style = {{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', border: 'none'}}>
                    <input checked={bankType === 'sequence' && 'checked'} type="radio" name="pBankType" onChange={({target}) => {
                        if(bankType !== 'sequence') {
                          this.setState({bankType: 'sequence'})
                        }
                      }}/><p style={{color: '#818181', width: 100}}>&nbsp;&nbsp;&nbsp;Lần lượt</p>
                  </Tab>
                  <Tab style = {{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', border: 'none'}}>
                    <input checked={bankType === 'random' && 'checked'} type="radio" name="pBankType" onChange={({target}) => {
                        if(bankType !== 'random') {
                          this.setState({bankType: 'random'})
                        }
                      }}/><p style={{color: '#818181', width: 100}}>&nbsp;&nbsp;&nbsp;Ngẫu nhiên</p>
                  </Tab>
                  <Tab style={{float: 'right', width: '70%', paddingLeft: 15, border: 'none'}}>
                    <button className="btn" style={{backgroundColor: '#35bcbf', color: 'white', float: 'right', marginTop: -3}} onClick={() => {
                        this.setState({showReview: true, bankType: ''})
                      }}>XEM LẠI</button>
                  </Tab>
              </TabList>
              <TabPanel>
                <div style={{width: '100%', paddingLeft: '10%'}}>
                  {
                    data.questionSetBankPublic.map(item => (
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
                <div style={{width: '80%', marginLeft: 35}}>
                    <div className="form-horizontal" style={{width: '90%', marginLeft: '5%'}}>
                      <div style={{width: '100%', paddingTop: 10, paddingBottom: 30}}>
                        {
                          data.subjects ?
                          <div style={{width: '100%'}}>
                            <div style={{width: '100%', paddingBottom: 10, paddingLeft: 19, paddingRight: 0, marginBottom: 0}} className="form-group">
                                <label className="col-sm-2 control-label" style={{paddingRight: 5, paddingLeft: 10, textAlign: 'left', whiteSpace: 'nowrap'}}>Chọn môn học</label>
                                <div className="col-sm-9" style={{paddingLeft: 24, paddingRight: 78}}>
                                  <Combobox
                                    name="subjects"
                                    data={data.subjects}
                                    datalistName="subjectsDatalist"
                                    label="name"
                                    placeholder="Chọn môn học"
                                    value={this.state.subjectId}
                                    getValue={this.getSubject.bind(this)}/>
                                </div>
                            </div>
                            <SelectQuestionInputFormWithData
                              subjectId={this.state.subjectId}
                              easyQuestionCount={this.state.easyQuestionCount}
                              normalQuestionCount={this.state.normalQuestionCount}
                              hardQuestionCount={this.state.hardQuestionCount}
                              getQuestionTypeCount={this.getQuestionTypeCount.bind(this)}
                              getQuestionBySubject={this.getQuestionBySubject.bind(this)}
                              questionBySubject={this.state.questionBySubject}
                              type={'public'}/>
                          </div> : null
                        }
                      </div>
                      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                        <button className="btn" style={{backgroundColor: '#35bcbf', color: 'white'}} onClick={() => this.getQuestionListByRate('question')}>Lưu câu hỏi</button>
                      </div>
                    </div>
                </div>
              </TabPanel>
              <TabPanel>
              {
                showReview ?
                <div style={{width: '100%', paddingLeft: '10%', paddingRight: '10%'}}>
                  <div style={{width: '100%', paddingLeft: '20%', paddingRight: '20%'}}>
                    { this.renderQuestionReview() }
                  </div>
                  <button className="btn" style={{marginLeft: '35%', width: '30%', }} onClick={this.saveQuestion.bind(this)}>Lưu câu hỏi</button>
                </div> : null
              }
              </TabPanel>
            </Tabs>
            </div>
          )
        }
  }

  render() {
    let { data, getQuestionSetId } = this.props;
    let { openDrawer, showQuestionBank } = this.state;
    console.log('show review ', this.state.showReview);
    if(data.loading) {
        return (
            <div className="spinner spinner-lg"></div>
        );
    } else {
      return(
        <div>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', marginTop: 25}}>
            <label style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
              <input checked={showQuestionBank === 'personal' && 'checked'} type="radio" name="optradio" onChange={({target}) => {
                  if(showQuestionBank === 'public') {
                    this.setState({showQuestionBank: 'personal', openDrawer: true});
                  }
                }}/><p style={{color: '#818181', width: 100}}>&nbsp;&nbsp;&nbsp;Cá nhân</p>
            </label>
            <label style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
              <input checked={showQuestionBank === 'public' && 'checked'} type="radio" name="optradio" onChange={({target}) => {
                  if(showQuestionBank === 'personal') {
                    this.setState({showQuestionBank: 'public', openDrawer: true});
                  }
                }}/><p style={{color: '#818181', width: 100}}>&nbsp;&nbsp;&nbsp;Cộng đồng</p>
            </label>
          </div>
          <button type="button" className="btn" style={{width: 90, backgroundColor: '#35bcbf', color: 'white'}} onClick={() => this.props.decreaseStepIndex()}>Quay lại</button>
          <Drawer docked={false} width={800} openSecondary={true} open={openDrawer} onRequestChange={(openDrawer) => this.setState({openDrawer})}>
            {
              this.drawerContent()
            }
          </Drawer>
        </div>
      )
    }
  }
}

const QUESTION_SET_QUERY = gql`
    query questionSetBank($userId: String!, $token: String!) {
        questionSetBankUser(userId: $userId) {
          _id
          title
          description
          examId
          questionCount
          questions {
            _id
            question
            answerSet
            correctAnswer
            correctRate
            file {
              link
              type
            }
          }
        }
        questionSetBankPublic {
          _id
          title
          description
          examId
          questionCount
          questions {
            _id
            question
            answerSet
            correctAnswer
            correctRate
            file {
              link
              type
            }
          }
        }
        subjectByUser(token: $token) {
          _id
          name
        }
        subjects {
          _id
          name
        }
}`

const INSERT_QUESTION_SET = gql`
    mutation insertQuestionFromBank ($token: String!, $questionSet: String!, $questions: [String]!) {
        insertQuestionFromBank(token: $token, questionSet: $questionSet, questions: $questions)
}`

export default compose (
    graphql(QUESTION_SET_QUERY, {
        options: (owProps)=> ({
            variables: {userId: owProps.users.userId, token: localStorage.getItem('Meteor.loginTokenFacebook') ? localStorage.getItem('Meteor.loginTokenFacebook') : localStorage.getItem('Meteor.loginTokenGoogle') ? localStorage.getItem('Meteor.loginTokenGoogle') : localStorage.getItem('Meteor.loginToken')},
            forceFetch: true
        })
    }),
    graphql(INSERT_QUESTION_SET, {
        props: ({mutate})=> ({
            insertQuestionFromBank : (token, questionSet, questions) => mutate({variables:{token, questionSet, questions}})
        })
    }),
)(QuesionBank);
