import React from 'react';
import __ from 'lodash';
import moment from 'moment';
import gql from 'graphql-tag';
import Webcam from 'react-webcam';
var PieChart = require("react-chartjs").Pie;
import Drawer from 'material-ui/Drawer';

import { graphql, compose } from 'react-apollo';
import { createContainer } from 'react-meteor-data';
import printExamResult from './printExamResult';

import  { UserExams } from 'educationServer/userExam'
import  { Questions } from 'educationServer/question'
import  { Examinations } from 'educationServer/examination'

import PlayerImage from './PlayerImage.jsx';

import { Meteor } from 'meteor/meteor';

class ScoreChat extends React.Component {
  render() {
    return <PieChart data={chartData} options={chartOptions}/>
  }
}


class QuestionContent extends React.Component {
  render() {
    let { question, data, examId, getNextQuestion, getPreviosQuestion, questionSetId, isClassStyle, index } = this.props;
    let userResults = {};
    if(data.playerResultByUser && data.playerResultByUser.length > 0) {
      __.forEach(data.playerResultByUser, item => {
        userResults[item.question._id] = {
          answer: item.answer,
          score: item.score
        }
      });
    }
    return (
      <div style={{backgroundColor: '#F1F1F1', padding: 15}}>
        <div>
          {
            !isClassStyle &&
            <h3 style={{marginTop: 0, marginBottom: 15}}>{ 'Câu ' + index + ': ' + question.question }</h3>
          }
        </div>
        {
          question.file && (
            question.file.type.includes('image') ?
            <img style={{height: 300, margin: 15, marginLeft: 0, marginTop: 0}} src={question.file.link}/> :
            question.file.type.includes('video') ?
            <video height="300" style={{margin: 15}} controls>
              <source src={question.file.link} type={question.file.type}/>
              Your browser does not support the video tag.
            </video> :
            question.file.type.includes('audio') ?
            <audio style={{margin: 15}} controls>
              <source src={question.file.link} type={question.file.type}/>
              Your browser does not support the audio tag.
            </audio> : null
          )
        }
        <div style={{display: '-webkit-flex', WebkitFlexWrap: 'wrap', display: 'flex', flexWrap: 'wrap'}}>
          {
            question.answerSet.map((item, idx) => (
              <label key={idx} style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                <input checked={userResults[question._id] && (userResults[question._id].answer.indexOf(item) > -1 && 'checked')} type="radio" name="optradio" onChange={({target}) => {
                    let token = localStorage.getItem('Meteor.loginTokenFacebook') ? localStorage.getItem('Meteor.loginTokenFacebook') : localStorage.getItem('Meteor.loginTokenGoogle') ? localStorage.getItem('Meteor.loginTokenGoogle') : localStorage.getItem('Meteor.loginToken')
                    this.props.answerQuestion(token, examId, questionSetId, question._id, item).then(() => {
                      this.props.data.refetch()
                    }).catch((err) => {
                    });
                  }}/>
                <div style={{width: 300, marginRight: 50, marginBottom: 10, marginLeft: 10, height: 50, backgroundColor: 'white', padding: 15, fontWeight: 'lighter', borderRadius: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>{ item }</div>
              </label>
            ))
          }
          {
            !isClassStyle &&
            <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '0px 35%'}}>
              <button className="btn" style={{backgroundColor: '#35bcbf', color: 'white', width: 100}} onClick={() => getPreviosQuestion(__.cloneDeep(question))}>Trước</button>
              <button className="btn" style={{backgroundColor: '#35bcbf', color: 'white', width: 100}} onClick={() => getNextQuestion(__.cloneDeep(question))}>Tiếp</button>
            </div>
          }
        </div>
      </div>
    )
  }
}

const PLAYER_RESULT_BY_USER = gql`
    query playerResultByUser($token: String!, $examId: String!) {
        playerResultByUser(token: $token, examId: $examId) {
          _id
          question {
            _id
            question
          }
          answer
          score
        }
}`

const ANSWER_QUESTION = gql`
    mutation answerQuestion ($token: String!, $examId: String!, $questionSetId: String!, $questionId: String!, $answer: String!) {
      answerQuestion(token: $token, examId: $examId, questionSetId: $questionSetId, questionId: $questionId, answer: $answer)
}`

const QuestionContentWithData = compose (
    graphql(PLAYER_RESULT_BY_USER, {
        options: (ownProps)=> ({
            variables: {token: localStorage.getItem('Meteor.loginTokenFacebook') ? localStorage.getItem('Meteor.loginTokenFacebook') : localStorage.getItem('Meteor.loginTokenGoogle') ? localStorage.getItem('Meteor.loginTokenGoogle') : localStorage.getItem('Meteor.loginToken'), examId: ownProps.examId},
            forceFetch: true
        })
    }),
    graphql(ANSWER_QUESTION, {
        props: ({mutate})=> ({
          answerQuestion : (token, examId, questionSetId, questionId, answer) => mutate({variables: {token, examId, questionSetId, questionId, answer}})
        })
    }),
)(QuestionContent);


class StartedExam extends React.Component {
  constructor(props) {
    super(props);
    this.state =  {currentQuestion: null, userExams: null, startCountDown: false, questionSet: null, timeString: null, openDrawer: false, currentPlayerCheckoutImage: [], questionCountDown: 0, index: 1, firstRender: true};
    this.interval = null;
  }

  componentDidUpdate() {
    let { data, finishExamination, screenShot } = this.props;
    let { startCountDown } = this.state;
    let token = localStorage.getItem('Meteor.loginTokenFacebook') ? localStorage.getItem('Meteor.loginTokenFacebook') : localStorage.getItem('Meteor.loginTokenGoogle') ? localStorage.getItem('Meteor.loginTokenGoogle') : localStorage.getItem('Meteor.loginToken')
    let randomNuber = Math.floor((Math.random() * 10) + 40);
    // if(this.interval) {
    //   clearInterval(this.interval);
    // }
    let that = this;
    if(!startCountDown && data.examById && !data.examById.isClassStyle) {
      let timeLeft = moment().valueOf() - data.examById.timeStart;
      let time = (data.examById.time * 60 * 1000) - timeLeft;
      let countDown = time
      let token = localStorage.getItem('Meteor.loginTokenFacebook') ? localStorage.getItem('Meteor.loginTokenFacebook') : localStorage.getItem('Meteor.loginTokenGoogle') ? localStorage.getItem('Meteor.loginTokenGoogle') : localStorage.getItem('Meteor.loginToken')
      if(data.examById.status === 99) {
        this.interval = setInterval(() => {
          countDown -= 1000;
          if(countDown % randomNuber === 0 && data.examById.createdBy._id !== Meteor.userId() && that.refs.webcam) {
            let playerImage = that.refs.webcam.getScreenshot();
            screenShot(token, playerImage);
          }
          //data.refetch();
          let time = countDown / 1000;
          let hour = Math.floor(time / 3600);
          let minute = Math.floor((time - hour * 3600) / 60);
          let second = Math.floor(time - hour * 3600 - minute * 60);
          this.setState({timeString: hour.toString() + ': ' + minute.toString() + ': ' + second.toString()});
          if(countDown <= 0 && Meteor.userId() === data.examById.createdBy._id) {
            finishExamination(token, data.examById._id).then(() => {
              that.props.data.refetch();
              clearInterval(this.interval);
            }).catch((err) => {
              console.log("error ", err);
            });
          }
        }, 1000);
      }

      // if(data.examById.isClassStyle) {
      //   let time1 = (data.examById.time * 60 * 1000);
      //   let questionCount = data.examById.questionSet.questions.length;
      //   let timePerQuestion = time1 / questionCount;
      //   let currentTime = moment().valueOf()
      //   let index = Math.floor((currentTime - data.examById.timeStart) / timePerQuestion);
      //   let timeDiff = currentTime - data.examById.timeStart - (index * timePerQuestion);
      //   this.setState({questionCountDown: (timePerQuestion - timeDiff)});
      //   this.setState({currentQuestion: data.examById.questionSet.questions[index]});
      //   // setTimeout(() => {
      //     let interval1 = setInterval(() => {
      //       if(index >= questionCount) {
      //         clearInterval(interval1);
      //       } else {
      //           index ++;
      //           this.setState({currentQuestion: data.examById.questionSet.questions[index]});
      //           this.setState({questionCountDown: timePerQuestion});
      //       }
      //       timeDiff = 0;
      //       timePerQuestion = time1 / questionCount;
      //     }, (timePerQuestion - timeDiff));
      //   // }, timePerQuestion - timeDiff);
      //   let interval2 = setInterval(() => {
      //     let countDown1 = this.state.questionCountDown;
      //     countDown1 -= 1000;
      //     this.setState({questionCountDown: countDown1});
      //   }, 1000);
      // }
      this.setState({startCountDown: true});
    }
  }

  getNextQuestion(question) {
    let { questionSet, index } = this.state;
    let { updateCurrentQuestion, data, users } = this.props;
    let currentQuestion;
    if(index < questionSet.length) {
      currentQuestion = questionSet[index];
      index ++;
      this.setState({currentQuestion, index});
    } else {
        currentQuestion = questionSet[0];
        let index = 1;
        this.setState({currentQuestion, index});
    }
    if(data.examById.isClassStyle) {
      let token = localStorage.getItem('Meteor.loginTokenFacebook') ? localStorage.getItem('Meteor.loginTokenFacebook') : localStorage.getItem('Meteor.loginTokenGoogle') ? localStorage.getItem('Meteor.loginTokenGoogle') : localStorage.getItem('Meteor.loginToken')
      currentQuestion['index'] = question.index;
      currentQuestion = JSON.stringify(currentQuestion);
      updateCurrentQuestion(token, currentQuestion)
    }
  }

  getPreviosQuestion(question) {
    let { questionSet, index } = this.state;
    let { updateCurrentQuestion, data, users } = this.props;
    let currentQuestion;
    if(index >= 2) {
      currentQuestion = questionSet[index - 2];
      index --;
      this.setState({currentQuestion, index});
    } else {
        let index = questionSet.length;
        currentQuestion = questionSet[questionSet.length - 1];
        this.setState({currentQuestion, index});
    }
    if(data.examById.isClassStyle) {
      let token = localStorage.getItem('Meteor.loginTokenFacebook') ? localStorage.getItem('Meteor.loginTokenFacebook') : localStorage.getItem('Meteor.loginTokenGoogle') ? localStorage.getItem('Meteor.loginTokenGoogle') : localStorage.getItem('Meteor.loginToken')
      currentQuestion['index'] = question.index - 2;
      currentQuestion = JSON.stringify(currentQuestion);
      updateCurrentQuestion(token, currentQuestion)
    }
  }

  componentWillReceiveProps(nextProps) {
    let { userExams } = this.state;
    let { data }= nextProps;
    if(data.examById)  {
      if(!this.state.currentQuestion) {
        let currentQuestion = data.examById.questionSet.questions[0];
        this.setState({currentQuestion, index: 1});
      }
      let questionSet = __.cloneDeep(data.examById.questionSet.questions);
      __.forEach(questionSet, (item, idx) => {
        item['index'] = idx + 1;
      });
      this.setState({questionSet});
      if(data.examById.createdBy._id != Meteor.userId()) {
        if(this.props.currentQuestion && nextProps.currentQuestion.questionId !== this.props.currentQuestion.questionId) {
          let currentQuestion = __.find(data.examById.questionSet.questions, {_id: nextProps.currentQuestion.questionId});
          this.setState({currentQuestion});
        }
      }
    }
    if(JSON.stringify(nextProps.userExams) !== JSON.stringify(this.props.userExams)) {
      this.props.data.refetch();
      this.setState({userExams: nextProps.userExams});
    }
    if(nextProps.status === 100) {
      this.props.data.refetch();
    }
  }

  renderPlayerList(playerList) {
    let { data } = this.props;
    return playerList.map((item, idx) => (
      <tbody key = {idx} style={{borderTop: '1px solid #EEEEEE', paddingTop: 5, paddingBottom: 5}}>
        <tr>
          <td rowSpan="2" style={{textAlign: 'center', fontSize: 14}}>
            { idx + 1 }
          </td>
          <td rowSpan="2">
            <PlayerImage imageStyle={{marginTop: 5, width: 40, height: 40, borderRadius: '100%'}} checkOutImage = {item.player.user.checkOutImage[0].link}/>
          </td>
          <td onClick={() => {
              this.setState({openDrawer: true, currentPlayerCheckoutImage: item.player.user.checkOutImage});
            }}>
            <p style={{fontSize: 16}}>{item.player.user.name}</p>
          </td>
          <td>
            <p style={{fontSize: 14}}>{item.player.user.email}</p>
          </td>
          <td rowSpan="2" style={{textAlign: 'center'}}>
            <p style={{fontSize: 14}}>{item.totalScore}</p>
          </td>
          <td rowSpan="2" style={{textAlign: 'center'}}>
            {
              data.examById.status === 100 && <button className="btn" style={{backgroundColor: '#35bcbf', color: 'white'}} onClick={() => printExamResult(data.examById, item.player, item.results, item.totalScore)}>Kết quả</button>
            }
          </td>
        </tr>
        <tr>
          <td colSpan="2">
            <div className="progress" style={{width: '100%', height: 5, marginTop: -12}}>
              <div className="progress-bar" role="progressbar" aria-valuenow={item.process.toString()}
               aria-valuemin="0" aria-valuemax="100" style={{backgroundColor: '#68C0BC', width: item.process.toString() + '%'}}>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    ));
  }

  renderTeacherClassStyle(data) {
    let { currentQuestion, timeString, questionCountDown } = this.state;
    let { finishExamination } = this.props;
    let time = questionCountDown / 1000;
    let hour = Math.floor(time / 3600);
    let minute = Math.floor((time - hour * 3600) / 60);
    let second = Math.floor(time - hour * 3600 - minute * 60);
    if(!currentQuestion && data.examById.status !== 100) {
      return (
        <div className="spinner spinner-lg"></div>
      );
    } else {
        return (
          <div style={{backgroundColor: 'white'}}>
            <a className="navbar-brand" href="/" style={{backgroundColor: 'black', position: 'absolute', top: 0, left: 0}}>
              <img src="https://i1249.photobucket.com/albums/hh508/nguyenxuanvinhict/logo_zps0osdqorj.png" alt="Dispute Bills" />
            </a>
            <div style={{textAlign: 'center', paddingBottom: 20}}>
              <h1 style={{color: '#68C0BC'}}>{ data.examById.name.toUpperCase() }</h1>
              <h3 style={{color: '#68C0BC'}}>{'Mã: ' + data.examById.code}</h3>
              <p style={{fontSize: 14}}>Số lượng tham gia thi: <font style={{fontSize: 16, color: '#68C0BC'}}> { data.examById.userExams.length } </font></p>
            </div>
            <div className="col-sm-12">
              <h3 style={{textAlign: 'center'}}>
              </h3>
            </div>
            <div className="col-sm-12" style={{paddingLeft: (window.innerWidth - 525) / 2, paddingRight: (window.innerWidth - 525) / 2}}>
              <h3>{ 'Câu ' + this.state.index + ' ' + currentQuestion.question }</h3>
            </div>
            <div className="col-sm-12" style={{height: 120}}>
            </div>
            {
              data.examById.status !== 100 ?
              <div style={{paddingLeft: (window.innerWidth - 300) / 2, paddingRight: (window.innerWidth - 300) / 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <button className="btn" style={{width: 80, border: 'none', fontSize: 14, backgroundColor: '#35bcbf', color: 'white'}} onClick={this.getPreviosQuestion.bind(this, __.cloneDeep(currentQuestion))}>
                  Trước
                </button>
                <button className="btn" style={{width: 80, border: 'none', fontSize: 14, backgroundColor: '#35bcbf', color: 'white'}} onClick={() => {
                    var submit = confirm('Bạn có muốn dừng bài kiểm tra?');
                    if(submit) {
                      let token = localStorage.getItem('Meteor.loginTokenFacebook') ? localStorage.getItem('Meteor.loginTokenFacebook') : localStorage.getItem('Meteor.loginTokenGoogle') ? localStorage.getItem('Meteor.loginTokenGoogle') : localStorage.getItem('Meteor.loginToken')
                      finishExamination(token, data.examById._id).then(() => {
                      }).catch((err) => {
                        console.log("error ", err);
                      });
                    }
                  }}>
                  Dừng
                </button>
                <button className="btn" style={{width: 80, border: 'none', fontSize: 14, backgroundColor: '#35bcbf', color: 'white'}} onClick={this.getNextQuestion.bind(this, __.cloneDeep(currentQuestion))}>
                  Tiếp
                </button>
              </div> : null
            }
          </div>
        )
      }
  }

  renderTeacherHomeStyle(data, playerList) {
    let { openDrawer, timeString, currentPlayerCheckoutImage, questionCountDown } = this.state;
    return (
      <div style={{backgroundColor: 'white'}}>
        <a className="navbar-brand" href="/" style={{backgroundColor: 'black', position: 'absolute', top: 0, left: 0}}>
          <img src="https://i1249.photobucket.com/albums/hh508/nguyenxuanvinhict/logo_zps0osdqorj.png" alt="Dispute Bills" />
        </a>
        <div style={{textAlign: 'center', paddingBottom: 20}}>
          <h1 style={{color: '#68C0BC'}}>{ data.examById.name.toUpperCase() }</h1>
          <h3 style={{color: '#68C0BC'}}>{'Mã: ' + data.examById.code}</h3>
          <p style={{fontSize: 14}}>Số lượng tham gia thi: <font style={{fontSize: 16, color: '#68C0BC'}}> { data.examById.userExams.length } </font></p>
        </div>
        <div className="col-sm-12" style={{paddingLeft: 350, paddingRight: 350}}>
          <table>
            <thead>
              <th style={{width: 50, color: '#68C0BC', fontSize: 14, fontWeight: 'lighter'}}>
                STT
              </th>
              <th style={{width: 300, color: '#68C0BC', fontSize: 14, fontWeight: 'lighter'}}>
              </th>
              <th style={{width: 200, color: '#68C0BC', fontSize: 14, textAlign: 'left', fontWeight: 'lighter'}}>
                Tên người dùng
              </th>
              <th style={{width: 200, color: '#68C0BC', fontSize: 14, textAlign: 'left', fontWeight: 'lighter'}}>
                Email
              </th>
              <th style={{width: 200, color: '#68C0BC', fontSize: 14, textAlign: 'center', fontWeight: 'lighter'}}>
                Điểm
              </th>
              <th>
              </th>
            </thead>
            { this.renderPlayerList(playerList) }
          </table>
        </div>
        <div className="col-sm-12" style={{height: 120}}>
        </div>
        {
          data.examById.status !== 100 ?
          <div style={{paddingLeft: (window.innerWidth - 300) / 2, paddingRight: (window.innerWidth - 300) / 2}}>
            <button className="btn" style={{backgroundColor: '#35bcbf', color: 'white', width: '100%', border: 'none', fontSize: 14, height: 40}}>
              { 'Thời gian còn lại: ' + timeString }
            </button>
          </div> : null
        }
        <Drawer docked={false} width={300} openSecondary={true} open={openDrawer} onRequestChange={(openDrawer) => this.setState({openDrawer})}>
          {
            currentPlayerCheckoutImage.map((item, idx) => <img key={idx} style={{width: '100%', padding: '30px 30px 0px 30px'}} src={item.link}/>)
          }
        </Drawer>
      </div>
    )
  }

  renderStudentView(data) {
    let { questionSet, currentQuestion, timeString, questionCountDown } = this.state;
    let { params } = this.props;
    let time = questionCountDown / 1000;
    let hour = Math.floor(time / 3600);
    let minute = Math.floor((time - hour * 3600) / 60);
    let second = Math.floor(time - hour * 3600 - minute * 60);
    return (
      <div>
        <a className="navbar-brand" href="/" style={{backgroundColor: 'black', position: 'absolute', top: 0, left: 0}}>
          <img src="https://i1249.photobucket.com/albums/hh508/nguyenxuanvinhict/logo_zps0osdqorj.png" alt="Dispute Bills" />
        </a>
        <div style={{textAlign: 'center', paddingBottom: 20}}>
          <h1 style={{color: '#68C0BC'}}>{ data.examById.name.toUpperCase() }</h1>
          <p style={{fontSize: 14}}>Số lượng tham gia thi: <font style={{fontSize: 16, color: '#68C0BC'}}> { data.examById.userExams.length } </font></p>
        </div>
        {
          data.examById.isClassStyle &&
          <div className="col-sm-12">
            <h3 style={{textAlign: 'center'}}>
            </h3>
          </div>
        }
        <div className="col-sm-12">
          <div className="col-sm-3" style={{display: '-webkit-flex', WebkitFlexWrap: 'wrap', display: 'flex', flexWrap: 'wrap'}}>
            {
              questionSet.map((item, idx) => (
                <button key={idx} style={{borderRadius: '100%', width: 30, height: 30, margin: 10}} className={item._id === currentQuestion._id ? 'btn btn-primary' : 'btn btn-default'} onClick={() => {
                  if(!data.examById.isClassStyle) {
                    this.setState({currentQuestion: item, index: item.index});
                  }
                }}>{item.index}</button>
              ))
            }
            </div>
            <div className="col-sm-9">
              <QuestionContentWithData
                question={currentQuestion}
                index={this.state.index}
                questionSetId={data.examById.questionSet._id}
                getNextQuestion={this.getNextQuestion.bind(this)}
                getPreviosQuestion={this.getPreviosQuestion.bind(this)}
                examId={params.id}
                isClassStyle={data.examById.isClassStyle}
              />
            </div>
          </div>
          <div className="col-sm-12" style={{height: 250}}>
          </div>
          {
            !data.examById.isClassStyle &&
            <div style={{paddingLeft: (window.innerWidth - 300) / 2, paddingRight: (window.innerWidth - 300) / 2}}>
              <button className="byn btn-primary" style={{width: '100%', border: 'none', fontSize: 14, height: 40}}>
                { 'Thời gian còn lại: ' + timeString }
              </button>
            </div>
          }
          {
            !data.examById.isClassStyle &&
            <div style={{position: 'absolute', right: 20, bottom: 20}}>
              <Webcam ref="webcam" audio={false} screenshotFormat="image/webp" height={200} width={200}/>
            </div>
          }
      </div>
    )
  }

  render() {
    let { data, params } = this.props;
    let { currentQuestion, questionSet, questionCountDown } = this.state;
    if(!data.examById) {
      return (
        <div className="spinner spinner-lg"></div>
      )
    } else {
        if(data.examById.createdBy._id === Meteor.userId() || data.examById.status === 100) {
          let questionCount = data.examById.questionSet.questions.length;
          let playerList = __.cloneDeep(data.examById.userExams);
          __.forEach(playerList, item => {
            let resultCount = item.results.length;
            item['process'] = ( resultCount / questionCount ) * 100;
            let totalScore = 0;
            __.forEach(item.results, item => totalScore += item.score);
            item['totalScore'] = totalScore;
          });
          playerList.sort((a, b) => {
            if (a.totalScore < b.totalScore)
              return 1;
            if (a.totalScore > b.totalScore)
              return -1;
            return 0;
          });
          return data.examById.status === 100 ? this.renderTeacherHomeStyle(data, playerList) : data.examById.isClassStyle ? this.renderTeacherClassStyle(data) : this.renderTeacherHomeStyle(data, playerList);
        } else {
            return this.renderStudentView(data);
        }
    }
  }
}

const QUESTION_BY_EXAM = gql`
  query examById($examId: String!) {
    examById(_id: $examId) {
      _id
      code
      timeStart
      createdBy {
        _id
        name
      }
      name
      description
      userCount
      time
      createdAt
      status
      isClassStyle
      questionSet {
        _id
        title
        description
        questionCount
        questions {
          _id
          question
          answerSet
          file {
            link
            type
          }
          correctAnswer
          correctRate
        }
      }
      userExams {
        _id
        correctCount
        player {
          _id
          isUser
          user {
            _id
            name
            image
            email
            social
            online
            lastLogin
            checkOutImage {
              link
              time
            }
          }
        }
        results {
          _id
          question {
            _id
            question
            answerSet
            correctAnswer
          }
          answer
          score
          isCorrect
        }
      }
    }
  }`

const FINISH_EXAMINATION = gql`
    mutation finishExamination ($token: String!, $_id: String!) {
      finishExamination(token: $token, _id: $_id)
}`

const UPDATE_CURRENT_QUESTION = gql`
    mutation updateCurrentQuestion ($token: String!, $info: String) {
      updateCurrentQuestion(token: $token, info: $info)
}`

const SCREEN_SHOT = gql`
    mutation screenShot($token: String!, $link: String!) {
      screenShot(token: $token, link: $link)
}`

const StartedExamWithData = compose (
    graphql(QUESTION_BY_EXAM, {
        options: (owProps)=> ({
            variables: {examId: owProps.params.id},
            forceFetch: true
        })
    }),
    graphql(FINISH_EXAMINATION, {
        props: ({mutate})=> ({
            finishExamination : (token, _id) => mutate({variables:{token, _id}})
        })
    }),
    graphql(UPDATE_CURRENT_QUESTION, {
        props: ({mutate})=> ({
            updateCurrentQuestion : (token, info) => mutate({variables:{token, info}})
        })
    }),
    graphql(SCREEN_SHOT, {
        props: ({mutate})=> ({
            screenShot : (token, link) => mutate({variables:{token, link}})
        })
    }),
)(StartedExam);

export default createContainer((ownProps) => {
  Meteor.subscribe("userExams");
  Meteor.subscribe("questions");
  Meteor.subscribe("examinations");
  let examId = ownProps.params.id;
  let userExams = UserExams.find({examId}).fetch();
  let currentQuestion = Questions.findOne({_id: 'currentQuestion'});
  let examination = Examinations.findOne({_id:examId});
  return {
    userExams,
    currentQuestion,
    status: examination ? examination.status : 99
  };
}, StartedExamWithData);
