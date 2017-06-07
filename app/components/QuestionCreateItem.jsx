import React from 'react';
import __ from 'lodash';

import Checkbox from 'material-ui/Checkbox';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import Dropzone from 'react-dropzone';

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
        <div className="col-sm-1" style={{paddingLeft: 12}}>
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
        <div className="col-sm-1" style={{paddingLeft: 12}}>
          <button className="btn" style={{backgroundColor: '#A30000', color: 'white'}} onClick={() => this.props.removeAnswer()}>
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

  onDropAccepted(acceptedFiles,event) {
    let that = this;
    if(acceptedFiles.length){
        let reader = new FileReader();
        let file = acceptedFiles[0];
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            if(reader.result) {
              that.props.getFile(reader.result, file.type);
            }
        }
        reader.onerror = function (error) {
          console.log('Error: ', error);
        }
    }
  }

  onDropRejected(rejectedFiles){
    if(rejectedFiles.length && rejectedFiles[0].size > 1024*1000*8){
      alert('File nhỏ hơn 2MB!');
    }
  }

  render() {
    let { question }= this.props;
    return (
      <div style={{width: '100%', paddingLeft: '10%'}}>
        <div style={{marginBottom: 10}}>
          <textarea style={{width: '80%'}} value={ question.question } className="form-control" onChange={({target}) => this.props.setQuestionValue(target.value)}>
          </textarea>
        </div>
        {
          question.file && (
            question.file.type.includes('image') ?
            <img style={{height: 300, maxWidth: '100%', margin: 15, marginLeft: 0, marginTop: 0}} src={question.file.link}/> :
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
        <div>
          {
            this.renderAnswer()
          }
        </div>
        <div>
          <input value={question.score} style={{width: 75}} type="number" className="form-control" onChange={({target}) => this.props.setScoreValue(target.value)}/>
        </div>
        <div style={{width: '100%', paddingBottom: 10, paddingTop: 15,  display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
          <button type="button" className="btn" style={{width: 125, marginRight:  20, backgroundColor: '#35bcbf', color: 'white'}} onClick={this.addNewAnswer.bind(this)}>Thêm lựa chọn</button>
            <Dropzone style={{padiing: 0, textAlign:'center', width: 125, height: 25, marginRight:  20, backgroundColor: '#35bcbf', color: 'white' }} onDropAccepted={this.onDropAccepted.bind(this)} onDropRejected={this.onDropRejected} accept="audio/*,video/*,image/*" maxSize={1024*8*1000} multiple={false}>
              <div style={{paddingTop: 2}}>
                <p style={{color: 'white', fontWeight: 'bold'}}>Chọn file</p>
              </div>
            </Dropzone>
          <button type="button" className="btn" style={{width: 125, marginRight:  20,backgroundColor: '#A30000', color: 'white'}} onClick={() => this.props.removeQuestion()}>Xóa câu hỏi</button>
        </div>
      </div>
    )
  }
}
