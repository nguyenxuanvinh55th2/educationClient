import React from 'react';
import __ from 'lodash';

import Checkbox from 'material-ui/Checkbox';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';

class AnswerCreateItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {checked: false};
  }

  render() {
    let { answer, checked } = this.props;
    return (
      <div style = {{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: '80%', paddingBottom: 10}}>
        <textarea value={ answer.answer } className="col-sm-10" className="form-control" onChange={({target}) => this.props.setAnswer(target.value)}>
        </textarea>
        <div className="col-sm-1">
          <Checkbox
            checkedIcon={<ActionFavorite />}
            checked={checked}
            uncheckedIcon={<ActionFavoriteBorder />}
            onCheck={(_, isInputChecked) => {
              this.setState({checked: isInputChecked})
              if(isInputChecked) {
                this.props.addCorrectAnswer(answer);
              } else {
                  this.props.removeCorrectAnswer(answer);
              }
            }}
          />
        </div>
        <div className="col-sm-1">
          <button className="btn btn-danger" onClick={() => this.props.removeAnswer()}>
            <i className="fa fa-times" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    )
  }
}

export default class QuestionCreateItem extends React.Component {
  constructor(props) {
    super(props);
    //this.state = {answerList: ['0']};
  }

  renderAnswer() {
    let { question } = this.props;
    return question.answerSet.map((item, idx) => {
      let checked = false;
      if(__.find(question.correctAnswer, answer => answer._id === item._id)) {
        checked = true;
      }
      return <AnswerCreateItem
        key={item._id}
        removeAnswer={this.removeAnswer.bind(this, item._id)}
        setAnswer={this.setAnswer.bind(this, item._id)}
        addCorrectAnswer={this.addCorrectAnswer.bind(this)}
        removeCorrectAnswer={this.removeCorrectAnswer.bind(this, item._id)}
        answer={item}
        checked={checked}/>
    });
  }

  addNewAnswer() {
    let { question } = this.props;
    let answerSet = question.answerSet;
    let item = {
      _id: (Math.floor(Math.random()*99999) + 10000).toString(),
      answer: '',
    };
    answerSet.push(item);
    this.props.setAnswerSet(answerSet);
  }

  addCorrectAnswer(answer) {
    let { question } = this.props;
    let correctAnswer = question.correctAnswer;
    correctAnswer.push(answer);
    this.props.setCorrectAnswer(correctAnswer);
  }

  removeCorrectAnswer(_id, value) {
    let { question } = this.props;
    let correctAnswer = question.correctAnswer;
    for(let i = 0; i < correctAnswer.length; i++) {
      if(correctAnswer[i]._id === _id) {
        correctAnswer.splice(i, 1)
      }
    }
    this.props.setCorrectAnswer(correctAnswer);
  }

  setAnswer(_id, value) {
    let { question } = this.props;
    let answerList = question.answerSet;
    for(let i = 0; i < answerList.length; i++) {
      if(answerList[i]._id === _id) {
        answerList[i].answer = value;
      }
    }
    this.props.setAnswerSet(answerList);
  }

  removeAnswer(_id) {
    let { question } = this.props;
    let answerList = question.answerSet;
    for(let i = 0; i < answerList.length; i++) {
      if(answerList[i]._id === _id) {
        answerList.splice(i, 1);
      }
    }
    this.props.setAnswerSet(answerList);
  }

  render() {
    let { question }= this.props;
    return (
      <div style={{width: '100%', paddingLeft: '10%'}}>
        <div style={{marginBottom: 10}}>
          <textarea style={{width: '80%'}} value={ question.question } className="form-control" onChange={({target}) => this.props.setQuestionValue(target.value)}>
          </textarea>
        </div>
        <div>
          {
            this.renderAnswer()
          }
        </div>
        <div>
          <input value={question.score} style={{width: 75}} type="number" className="form-control" onChange={({target}) => this.props.setScoreValue(target.value)}/>
        </div>
        <div style={{width: '100%', paddingBottom: 10,  display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
          <button type="button" className="btn btn-primary" style={{width: 150, marginRight:  20}} onClick={this.addNewAnswer.bind(this)}>Thêm lựa chọn</button>
          <button type="button" className="btn btn-primary" style={{width: 150, marginRight:  20}}>Thêm media</button>
          <button type="button" className="btn btn-danger" style={{width: 150, marginRight:  20}} onClick={() => this.props.removeQuestion()}>Xóa câu hỏi</button>
        </div>
      </div>
    )
  }
}
