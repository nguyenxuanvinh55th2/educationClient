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
    let { getReviewFrom } = this.props;
    return question.answerSet.map((item, idx) => (
      <AnswerReviewItem key={item + idx} answer={getReviewFrom === 'questionBank' ? item : item.answer}/>
    ));
  }

  renderCorrectAnswer(question) {
    let { getReviewFrom } = this.props;
    return question.correctAnswer.map((item, idx) => (
      <AnswerReviewItem key={item + idx} answer={getReviewFrom === 'questionBank' ? item : item.answer}/>
    ));
  }

  showAnswer() {
    let value = !this.state.showAnswer;
    this.setState({showAnswer: value});
  }

  render() {
    let { question, publicQuestion, questionType, getReviewFrom, getScore } = this.props;
    console.log('question ', question);
    let { showAnswer } = this.state;
    return (
      <div style={{width: '100%'}}>
        <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
          <div className="col-sm-10" style={{width: '100%',marginBottom: 15, marginRight: 10, padding: 5, border: '1px solid gray', borderRadius: 10}} onClick={this.showAnswer.bind(this)}>
            {'Câu ' + this.props.index + ': ' + question.question}
          </div>
          {
            questionType !== 'publicQuestion' ?
            <Checkbox
              label="Public"
              checked={question.isPublic}
              onCheck={(_, isInputChecked) => {
                publicQuestion(isInputChecked)
              }}
              style={{width: 75}}
            /> : null
          }
        </div>
        {
          showAnswer ?
          <div style={{width: '60%', marginBottom: 15}}>
            <font style={{color: 'blue', fontWeight: 'bold'}}>Câu hỏi:</font>
            <div style={{width: '100%'}}>
              {'Câu ' + this.props.index + ': ' + question.question}
            </div>
            {
              question.file && (
                question.file.type.includes('image') ?
                <img style={{height: 250, margin: 15, marginLeft: 0, marginTop: 0}} src={question.file.link}/> :
                question.file.type.includes('video') ?
                <video width="100%" height="300" controls>
                  <source src={question.file.link} type={question.file.type}/>
                  Your browser does not support the video tag.
                </video> :
                question.file.type.includes('audio') ?
                <audio controls>
                  <source src={question.file.link} type={question.file.type}/>
                  Your browser does not support the audio tag.
                </audio> : null
              )
            }

            <font style={{color: 'blue', fontWeight: 'bold'}}>Câu trả lời:</font>
            { this.renderAnswerSet(question) }
            <font style={{color: 'blue', fontWeight: 'bold'}}>Câu trả đúng:</font>
            { this.renderCorrectAnswer(question) }
            <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
              <font style={{color: 'blue', fontWeight: 'bold', paddingRight: 10}}>Điểm số: </font>
              <input style={{width: 50, borderRadius: 3, border: 0, marginTop: -5}} type="number" value={ question.score } onChange={({target}) => getScore(question._id, target.value)}/>
            </div>
          </div> : null
        }
      </div>
    )
  }
}
