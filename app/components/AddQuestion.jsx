import React from 'react';
import __ from 'lodash';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Checkbox from 'material-ui/Checkbox';
import Drawer from 'material-ui/Drawer';
import Combobox from './Combobox.jsx';
import Dropzone from 'react-dropzone';

import QuestionCreateItem from './QuestionCreateItem.jsx';
import QuestionReviewItem from './QuestionReviewItem.jsx';

class AddQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {title: '', description: '', questionCount: '', score: '', isPublic: false, questionList: [{
      _id: (Math.floor(Math.random()*99999) + 10000).toString(),
      question: '',
      answerSet: [{
        _id: (Math.floor(Math.random()*99999) + 10000).toString(),
        answer: '',
      }],
      correctAnswer: [],
      score: 0,
      isPublic: false,
      subjectId: '',
    }], openDrawer: false, subjectId: '', showReview: false, questionFile: null};
    this.code = (Math.floor(Math.random()*99999) + 10000).toString();
  }

  addQuestionFromFile() {
    let { questionList, title, description, isPublic, subjectId, questionFile, score } = this.state;
    let {  getQuestionSetId, users } = this.props;
    let questionSet = {
      title,
      description,
      questionCount: questionList.length,
      isPublic,
      subjectId
    }
    let questionFromFile = [];
    let array = questionFile.split(/\r?\n/);
    __.forEach(array, (item, idx) => {
      if(item === '') {
        array.splice(idx, 1);
      }
    })
    for(let i = 0; i < array.length - 1; i++) {
      if(array[i].indexOf('Câu') > -1) {
        let question = {
          _id: (Math.floor(Math.random()*99999) + 10000).toString(),
          question: array[i],
          answerSet: [],
          correctAnswer: [],
          score,
          isPublic: false,
          subjectId: '',
        }
        let j = i + 1;
        while(array[j].indexOf('Câu') < 0 && j < array.length - 1) {
          let answerId = (Math.floor(Math.random()*99999) + 10000).toString();
          let answer = {
            _id: answerId,
            answer: array[j].replace(/(dapan)/gi, '')
          }
          question.answerSet.push(answer);
          if(array[j].toLowerCase().indexOf('dapan') > -1 || array[j].toLowerCase().indexOf('dapan') > -1) {
            question.correctAnswer.push(answer);
          }
          j++;
        }
        questionFromFile.push(question);
      }
    }
    console.log('questionFromFile ', questionFromFile);
    this.setState({questionList: questionFromFile, openDrawer: true});
  }

  drawerContent() {
    let { showReview } = this.state;
    return (
      <Tabs className="secondary">
        <TabList className="modal-header" style={{margin: 0, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <Tab>
                <h4 className="modal-title">THÊM NỘI DUNG</h4>
            </Tab>
            <Tab style={{float: 'right'}}>
              <button className="btn btn-primary" onClick={() => {
                  this.setState({showReview: true})
                }}>XEM LẠI</button>
            </Tab>
        </TabList>
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
          {
            showReview ?
            <div style={{width: '100%', paddingLeft: '10%', paddingRight: '10%'}}>
              <div style={{width: '100%'}}>
                { this.renderQuestionReview() }
              </div>
              <div style={{width: '100%'}}>
                <Checkbox
                  label="Public bộ câu hỏi"
                  onCheck={(_, isInputChecked) => {
                    this.setState({isPublic: isInputChecked});
                  }}
                  style={{marginLeft: '35%', width: '30%'}}
                />
              </div>
              <button className="btn btn-primary" style={{marginLeft: '35%', width: '30%'}} onClick={this.saveQuestion.bind(this)}>Lưu câu hỏi</button>
            </div> : null
          }
        </TabPanel>
      </Tabs>
    )
  }

  getFiles(files){
    console.log('file ', files);
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
      <QuestionReviewItem getReviewFrom={'questionCreater'} key={item._id} question={item} publicQuestion={this.publicQuestion.bind(this, item._id)}/>
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
    let { score } = this.state;
    let questionList = this.state.questionList;
    let item = {
      _id: (Math.floor(Math.random()*99999) + 10000).toString(),
      question: '',
      answerSet: [{
        _id: (Math.floor(Math.random()*99999) + 10000).toString(),
        answer: '',
      }],
      correctAnswer: [],
      score,
      isPublic: false
    };
    questionList.push(item);
    this.setState({questionList});
  }

  getSubject(value) {
    this.setState({subjectId: value});
  }

  onDrop(files) {
    let file = files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    let that = this;

    reader.onload = function () {
      let content = reader.result;
      that.setState({questionFile: content});
    };

    reader.onerror = function (error) {
     console.log('Error: ', error);
    };
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
    let { questionList, title, description, isPublic, subjectId, score } = this.state;
    let {  getQuestionSetId, users, increaseStepIndex } = this.props;
    let questionSet = {
      title,
      description,
      questionCount: questionList.length,
      isPublic,
      subjectId
    }
    let questionSetString = [];
    questionSet = JSON.stringify(questionSet);
    __.forEach(questionList, item => {
      if(!item.score || item.score === '' || item.score === '0') {
        item.score = score;
      } else {
          item.score = parseInt(item.score);
      }
      item.answerSet = item.answerSet.map(item => item.answer);
      item.correctAnswer = item.correctAnswer.map(item => item.answer);
      item.subjectId = subjectId;
      questionSetString.push(JSON.stringify(item));
    });
    this.props.insertQuestionSet(users.userId, questionSet, questionSetString).then(({data}) => {
      getQuestionSetId(data.insertQuestionSet);
      increaseStepIndex();
    }).catch((error) => {
        console.log('there was an error sending the query', error);
    });
  }

  render() {
    let { openDrawer, questionFile } = this.state;
    return (
      <div style={{width: '100%'}}>
        <form className="form-horizontal" style={{width: '90%', marginLeft: '5%'}}>
          <div style={{width: '100%', paddingTop: 15, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <div style={{width: '70%'}}>
              <div style={{width: '100%'}} className={this.state.title ? 'form-group' : 'form-group has-error'}>
                  <label style={{paddingRight: 0, textAlign: 'left'}} className="col-sm-3 control-label">Tiêu đề</label>
                  <div className="col-sm-9">
                      <input style={{width: '100%', margin: 0}} type="text" className="form-control" value={this.state.title} onChange={({target}) => this.setState({title: target.value.toUpperCase()})}/>
                      <span className="help-block">{this.state.title ? null : 'tiêu đề câu hỏi là bắt buộc'}</span>
                  </div>
              </div>
              <div style={{width: '100%'}} className={this.state.description ? 'form-group' : 'form-group has-error'}>
                  <label style={{paddingRight: 0, textAlign: 'left'}} className="col-sm-3 control-label">Mô tả</label>
                  <div className="col-sm-9">
                      <textarea style={{width: '100%', margin: 0}} type="text" className="form-control" value={this.state.description} onChange={({target}) => this.setState({description: target.value})}>
                      </textarea>
                      <span className="help-block">{this.state.description ? null : 'tiêu đề câu hỏi là bắt buộc'}</span>
                  </div>
              </div>
              <div style={{width: '100%'}} className={this.state.score ? 'form-group' : 'form-group has-error'}>
                  <label style={{paddingRight: 0, textAlign: 'left'}} className="col-sm-3 control-label">Điểm số</label>
                  <div className="col-sm-9">
                      <input style={{width: '100%', margin: 0}} type="number" className="form-control" value={this.state.score} onChange={({target}) => {
                          let questionList = this.state.questionList;
                          questionList[0].score = target.value;
                          this.setState({score: target.value, questionList});
                        }}/>
                      <span className="help-block">{this.state.score ? null : 'điểm số là bắt buộc'}</span>
                  </div>
              </div>
              <div style={{width: '100%'}} className="form-group">
                  <label style={{paddingRight: 0, textAlign: 'left'}} className="col-sm-3 control-label">Môn học</label>
                  <div className="col-sm-9">
                    <Combobox
                      name="subjectss"
                      data={this.props.data.subjectByUser}
                      datalistName="subjectsDatalists"
                      label="name"
                      placeholder="Chọn môn học"
                      value={this.state.subjectId}
                      getValue={this.getSubject.bind(this)}/>
                  </div>
              </div>
              <div style={{width: '100%'}} className="form-group">
                <div className="col-sm-9 col-sm-offset-3">
                  <Dropzone onDrop={this.onDrop.bind(this)} style={{height: 50, border: '1px solid gray', borderRadius: 10, padding: '13px 7px'}}>
                    <div style={{textAlign: 'center'}}>Thêm câu hỏi từ file của bạn</div>
                  </Dropzone>
                </div>
              </div>
            </div>
            <div style={{width: '30%'}}>
            {
              questionFile ?
              <button type="button" className="btn btn-primary" style={{width: '100%'}} disabled={!this.state.title} onClick={this.addQuestionFromFile.bind(this)}>Xem lại</button> :
              <button type="button" className="btn btn-primary" style={{width: '100%'}} disabled={!this.state.title} onClick={() => this.setState({openDrawer: true})}>Thêm nội dung</button>
            }
            </div>
          </div>
        </form>
        <Drawer docked={false} width={800} openSecondary={true} open={openDrawer} onRequestChange={(openDrawer) => this.setState({openDrawer})}>
          {
            this.drawerContent()
          }
        </Drawer>
      </div>
    )
  }
}

const ADD_QUESTION_QUERY = gql`
    query subjectByUser($token: String!) {
        subjectByUser(token: $token) {
          _id
          name
        }
}`

const INSERT_QUESTION_SET = gql`
    mutation insertQuestionSet ($userId: String!, $questionSet: String!, $questions: [String]!) {
        insertQuestionSet(userId: $userId, questionSet: $questionSet, questions: $questions)
}`

const ADD_QUESTION_FROM_FILE = gql`
    mutation addQuestionFromFile ($token: String!, $questionSet: String!, $questionFile: String!) {
        addQuestionFromFile(token: $token, questionSet: $questionSet, questionFile: $questionFile)
}`

export default compose (
    graphql(ADD_QUESTION_QUERY, {
        options: (owProps)=> ({
            variables: {userId: owProps.users.userId, token: localStorage.getItem('Meteor.loginToken')},
            forceFetch: true
        })
    }),
    graphql(INSERT_QUESTION_SET, {
        props: ({mutate})=> ({
            insertQuestionSet : (userId, questionSet, questions) => mutate({variables:{userId, questionSet, questions}})
        })
    }),
    graphql(ADD_QUESTION_FROM_FILE, {
        props: ({mutate})=> ({
            addQuestionFromFile : (token, questionSet, questionFile) => mutate({variables:{token, questionSet, questionFile}})
        })
    }),
)(AddQuestion);
