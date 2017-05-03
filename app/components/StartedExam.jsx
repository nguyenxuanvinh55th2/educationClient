import React from 'react';
import __ from 'lodash';
import moment from 'moment';
import gql from 'graphql-tag';
import Webcam from 'react-webcam';

import Drawer from 'material-ui/Drawer';

import { graphql, compose } from 'react-apollo';
import { createContainer } from 'react-meteor-data';
import printExamResult from './printExamResult';

import  { UserExams } from 'educationServer/userExam'

import PlayerImage from './PlayerImage.jsx';

class QuestionContent extends React.Component {
  render() {
    let { question, data, examId, getNextQuestion, getPreviosQuestion, questionSetId, isClassStyle } = this.props;
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
            <h3 style={{marginTop: 0, marginBottom: 15}}>{ question.question }</h3>
          }
        </div>
        <div style={{display: '-webkit-flex', WebkitFlexWrap: 'wrap', display: 'flex', flexWrap: 'wrap'}}>
          {
            question.answerSet.map((item, idx) => (
              <label key={idx} style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                <input checked={userResults[question._id] && (userResults[question._id].answer.indexOf(item) > -1 && 'checked')} type="radio" name="optradio" onChange={({target}) => {
                    let token = localStorage.getItem('Meteor.loginToken');
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
              <button className="btn btn-primary" style={{width: 100}} onClick={() => getPreviosQuestion(question)}>Trước</button>
              <button className="btn btn-primary" style={{width: 100}} onClick={() => getNextQuestion(question)}>Tiếp</button>
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
            variables: {token: localStorage.getItem('Meteor.loginToken'), examId: ownProps.examId},
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
    this.state =  {currentQuestion: null, userExams: null, startCountDown: false, questionSet: null, timeString: null, openDrawer: false, currentPlayerCheckoutImage: [], questionCountDown: 0};
  }

  componentDidUpdate() {
    let { data, users, finishExamination, screenShot } = this.props;
    let { startCountDown } = this.state;
    let token = localStorage.getItem('Meteor.loginToken');
    let randomNuber = Math.floor((Math.random() * 10) + 40);
    let that = this;
    if(!startCountDown && data.examById) {
      let timeLeft = moment().valueOf() - data.examById.timeStart;
      let time = (data.examById.time * 60 * 1000) - timeLeft;
      let countDown = time
      let token = localStorage.getItem('Meteor.loginToken');
      if(data.examById.status === 99) {
        let interval = setInterval(() => {
          countDown -= 1000;
          if(countDown % randomNuber === 0) {
            playerImage = that.refs.webcam.getScreenshot();
            screenShot(token, playerImage);
          }
          data.refetch();
          let time = countDown / 1000;
          let hour = Math.floor(time / 3600);
          let minute = Math.floor((time - hour * 3600) / 60);
          let second = Math.floor(time - hour * 3600 - minute * 60);
          this.setState({timeString: hour.toString() + ': ' + minute.toString() + ': ' + second.toString()});
          if(countDown <= 0 && users.userId === data.examById.createdBy._id) {
            finishExamination(token, data.examById._id).then(() => {
              console.log("ki thi da ket thuc");
              clearInterval(interval);
            }).catch((err) => {
              console.log("error ", err);
            });
          }
        }, 1000);
      }
      if(data.examById.isClassStyle) {
        let time1 = (data.examById.time * 60 * 1000);
        let questionCount = data.examById.questionSet.questions.length;
        let timePerQuestion = time1 / questionCount;
        let currentTime = moment().valueOf()
        let index = Math.floor((currentTime - data.examById.timeStart) / timePerQuestion);
        let timeDiff = currentTime - data.examById.timeStart - (index * timePerQuestion);
        this.setState({questionCountDown: (timePerQuestion - timeDiff)});
        this.setState({currentQuestion: data.examById.questionSet.questions[index]});
        // setTimeout(() => {
          let interval1 = setInterval(() => {
            if(index >= questionCount) {
              clearInterval(interval1);
            } else {
                index ++;
                this.setState({currentQuestion: data.examById.questionSet.questions[index]});
                this.setState({questionCountDown: timePerQuestion});
            }
            timeDiff = 0;
            timePerQuestion = time1 / questionCount;
          }, (timePerQuestion - timeDiff));
        // }, timePerQuestion - timeDiff);
        let interval2 = setInterval(() => {
          let countDown1 = this.state.questionCountDown;
          countDown1 -= 1000;
          this.setState({questionCountDown: countDown1});
        }, 1000);
      }
      this.setState({startCountDown: true});
    }
  }

  getNextQuestion(question) {
    let { questionSet } = this.state;
    if(question.index < questionSet.length) {
      let currentQuestion = questionSet[question.index];
      this.setState({currentQuestion});
    } else {
        let currentQuestion = questionSet[0];
        this.setState({currentQuestion});
    }
  }

  getPreviosQuestion(question) {
    let { questionSet } = this.state;
    if(question.index >= 2) {
      let currentQuestion = questionSet[question.index - 2];
      this.setState({currentQuestion});
    } else {
        let currentQuestion = questionSet[questionSet.length - 1];
        this.setState({currentQuestion});
    }
  }

  componentWillReceiveProps(nextProps) {
    let { data }= nextProps;
    if(data.examById)  {
      if(!data.examById.isClassStyle) {
        let currentQuestion = data.examById.questionSet.questions[0];
        this.setState({currentQuestion});
      }
      let questionSet = __.cloneDeep(data.examById.questionSet.questions);
      __.forEach(questionSet, (item, idx) => {
        item['index'] = idx + 1;
      });
      this.setState({questionSet});
    }
  }

  componentWillUpdate(nextProps, nextState) {
    let { userExams } = this.state;
    if(nextProps.userExams !== userExams) {
      this.props.data.refetch();
      this.setState({userExams: nextProps.userExams});
    }
  }

  renderPlayerList(playerList) {
    let { data } = this.props;
    return playerList.map((item, idx) => (
      <tbody key = {idx} style={{borderTop: '1px solid gray'}}>
        <tr style={{height: 15, borderTop: '1px solid gray'}}>
        </tr>
        <tr>
          <td rowSpan="2">
            { idx + 1 }
          </td>
          <td rowSpan="2">
            <PlayerImage checkOutImage = {item.player.user.checkOutImage[0].link}/>
          </td>
          <td style={{textAlign: 'center'}} onClick={() => {
              this.setState({openDrawer: true, currentPlayerCheckoutImage: item.player.user.checkOutImage});
            }}>
            <p>{item.player.user.name}</p>
          </td>
          <td>
            <p>{item.player.user.email}</p>
          </td>
          <td rowSpan="2" style={{textAlign: 'center'}}>
            <p>{item.totalScore}</p>
          </td>
          <td rowSpan="2" style={{textAlign: 'center'}}>
            {
              data.examById.status === 100 && <button className="btn btn-primary" onClick={() => printExamResult(data.examById, item.player, item.results, item.totalScore)}>Kết quả</button>
            }
          </td>
        </tr>
        <tr>
          <td colSpan="2">
            <div className="progress" style={{width: '100%', height: 10, marginTop: 3}}>
              <div className="progress-bar" role="progressbar" aria-valuenow={item.process.toString()}
               aria-valuemin="0" aria-valuemax="100" style={{backgroundColor: '#68C0BC', width: item.process.toString() + '%'}}>
              </div>
            </div>
          </td>
        </tr>
        <tr style={{height: 15, borderBottom: '1px solid gray'}}>
        </tr>
      </tbody>
    ));
  }

  renderTeacherClassStyle(data) {
    let { currentQuestion, timeString, questionCountDown } = this.state;
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
            <div style={{textAlign: 'center', paddingBottom: 20}}>
              <h1 style={{color: '#68C0BC'}}>{ data.examById.name.toUpperCase() }</h1>
              <p style={{fontSize: 14}}>Số lượng tham gia thi: <font style={{fontSize: 16, color: '#68C0BC'}}> { data.examById.userExams.length } </font></p>
            </div>
            <div className="col-sm-12">
              <h3 style={{textAlign: 'center'}}>
                { hour.toString() + ': ' + minute.toString() + ': ' + second.toString() }
              </h3>
            </div>
            <div className="col-sm-12" style={{paddingLeft: (window.innerWidth - 525) / 2, paddingRight: (window.innerWidth - 525) / 2}}>
              <h3>{ currentQuestion.question }</h3>
            </div>
            <div className="col-sm-12" style={{height: 120}}>
            </div>
            {
              data.examById.status !== 100 ?
              <div style={{paddingLeft: (window.innerWidth - 300) / 2, paddingRight: (window.innerWidth - 300) / 2}}>
                <button className="byn btn-primary" style={{width: '100%', border: 'none', fontSize: 14, height: 40}}>
                  { 'Thời gian còn lại: ' + timeString }
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
        <div style={{textAlign: 'center', paddingBottom: 20}}>
          <h1 style={{color: '#68C0BC'}}>{ data.examById.name.toUpperCase() }</h1>
          <p style={{fontSize: 14}}>Số lượng tham gia thi: <font style={{fontSize: 16, color: '#68C0BC'}}> { data.examById.userExams.length } </font></p>
        </div>
        <div className="col-sm-12" style={{paddingLeft: (window.innerWidth - 525) / 2, paddingRight: (window.innerWidth - 525) / 2}}>
          <table>
            <thead>
              <th style={{width: 50, color: '#68C0BC', fontSize: 14}}>
                STT
              </th>
              <th style={{width: 75, color: '#68C0BC', fontSize: 14}}>
              </th>
              <th style={{width: 200, color: '#68C0BC', fontSize: 14}}>
                Tên người dùng
              </th>
              <th style={{width: 200, color: '#68C0BC', fontSize: 14, textAlign: 'center'}}>
                Email
              </th>
              <th style={{width: 200, color: '#68C0BC', fontSize: 14, textAlign: 'center'}}>
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
            <button className="byn btn-primary" style={{width: '100%', border: 'none', fontSize: 14, height: 40}}>
              { 'Thời gian còn lại: ' + timeString }
            </button>
          </div> : null
        }
        <Drawer docked={false} width={300} openSecondary={true} open={openDrawer} onRequestChange={(openDrawer) => this.setState({openDrawer})}>
          {
            currentPlayerCheckoutImage.map(item => <img style={{width: '100%', padding: '30px 30px 0px 30px'}} src={item.link}/>)
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
        <div style={{textAlign: 'center', paddingBottom: 20}}>
          <h1 style={{color: '#68C0BC'}}>{ data.examById.name.toUpperCase() }</h1>
          <p style={{fontSize: 14}}>Số lượng tham gia thi: <font style={{fontSize: 16, color: '#68C0BC'}}> { data.examById.userExams.length } </font></p>
        </div>
        {
          data.examById.isClassStyle &&
          <div className="col-sm-12">
            <h3 style={{textAlign: 'center'}}>
              { hour.toString() + ': ' + minute.toString() + ': ' + second.toString() }
            </h3>
          </div>
        }
        <div className="col-sm-12">
          <div className="col-sm-3" style={{display: '-webkit-flex', WebkitFlexWrap: 'wrap', display: 'flex', flexWrap: 'wrap'}}>
            {
              !data.examById.isClassStyle &&
              questionSet.map((item, idx) => (
                <button key={idx} style={{borderRadius: '100%', width: 30, height: 30, margin: 10}} className={item._id === currentQuestion._id ? 'btn btn-primary' : 'btn btn-default'} onClick={() => {
                    this.setState({currentQuestion: item})
                  }}>{item.index}</button>
                ))
              }
            </div>
            <div className="col-sm-9">
              <QuestionContentWithData
                question={currentQuestion}
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
          <div style={{paddingLeft: (window.innerWidth - 300) / 2, paddingRight: (window.innerWidth - 300) / 2}}>
            <button className="byn btn-primary" style={{width: '100%', border: 'none', fontSize: 14, height: 40}}>
              { 'Thời gian còn lại: ' + timeString }
            </button>
          </div>
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
    let { data, params, users } = this.props;
    let { currentQuestion, questionSet, questionCountDown } = this.state;
    if(data.loading) {
      return (
        <div className="loader"></div>
      )
    } else {
        if(data.examById.createdBy._id === users.userId || data.examById.status === 100) {
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
    graphql(SCREEN_SHOT, {
        props: ({mutate})=> ({
            screenShot : (token, link) => mutate({variables:{token, link}})
        })
    }),
)(StartedExam);

export default createContainer((ownProps) => {
  Meteor.subscribe("userExams");
  let examId = ownProps.params.id;
  let userExams = UserExams.find({examId}).fetch();

  return {
    userExams
  };
}, StartedExamWithData);
