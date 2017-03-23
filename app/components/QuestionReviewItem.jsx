import React from 'react';

import Checkbox from 'material-ui/Checkbox';

class AnswerReviewItem extends React.Component {
  render() {
    let { answer } = this.props;
    return (
      <div style={{width: '100%'}}>
        { answer }
      </div>
    )
  }
}

export default class QuestionReviewItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showAnswer: false};
  }

  renderAnswerSet(question) {
    return question.answerSet.map((item, idx) => (
      <AnswerReviewItem key={item._id + idx} answer={item.answer}/>
    ));
  }

  renderCorrectAnswer(question) {
    return question.correctAnswer.map((item, idx) => (
      <AnswerReviewItem key={item._id + idx} answer={item.answer}/>
    ));
  }

  showAnswer() {
    let value = !this.state.showAnswer;
    this.setState({showAnswer: value});
  }

  render() {
    let { question, publicQuestion } = this.props;
    let { showAnswer } = this.state;
    return (
      <div style={{width: '100%', paddingLeft: '20%', paddingRight: '20%'}}>
        <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
          <button className="col-sm-10" style={{width: '100%',marginBottom: 15, marginRight: 10}} className="btn btn-default" onClick={this.showAnswer.bind(this)}>
            {question.question}
          </button>
          <Checkbox
            label="Public"
            checked={question.isPublic}
            onCheck={(_, isInputChecked) => {
              publicQuestion(isInputChecked)
            }}
            style={{width: 75}}
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
