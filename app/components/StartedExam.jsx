import React from 'react';
import __ from 'lodash';
import gql from 'graphql-tag';

import { graphql, compose } from 'react-apollo';
import { createContainer } from 'react-meteor-data';

import  { UserExams } from 'educationServer/userExam'

class QuestionContent extends React.Component {
  render() {
    let { question, data, examId, getCurrentQuestion, questionSetId } = this.props;
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
      <div style={{backgroundColor: '#F1F1F1'}}>
        <div>
          <h3>{ question.question }</h3>
        </div>
        <div style={{display: '-webkit-flex', WebkitFlexWrap: 'wrap', display: 'flex', flexWrap: 'wrap'}}>
          {
            question.answerSet.map((item, idx) => (
              <label key={idx} style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                <input checked={userResults[question._id] && (userResults[question._id].answer.indexOf(item) > -1 && 'checked')} type="radio" name="optradio" onChange={({target}) => {
                    let token = localStorage.getItem('Meteor.loginToken');
                    this.props.answerQuestion(token, examId, questionSetId, question._id, item).then(() => {
                      getCurrentQuestion(question);
                      this.props.data.refetch()
                    }).catch((err) => {

                    });
                  }}/>
                <div style={{width: 300, marginRight: 50, marginBottom: 10, marginLeft: 10, height: 50, backgroundColor: 'white', padding: 15, fontWeight: 'lighter'}}>{ item }</div>
              </label>
            ))
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
    this.state =  {currentQuestion: null, userExams: null, startCountDown: false, questionSet: null, timeString: null};
  }

  componentDidUpdate() {
    let { data, users, finishExamination } = this.props;
    let { startCountDown } = this.state;
    if(!startCountDown && data.examById) {
      if(data.examById.createdBy._id === users.userId) {
        console.log("message");
        let time = data.examById.time * 60 * 1000;
        let countDown = time
        let token = localStorage.getItem('Meteor.loginToken');
        if(data.examById.status === 99) {
          let interval = setInterval(() => {
            countDown -= 1000;
            let time = countDown / 1000;
            let hour = Math.floor(time / 3600);
            let minute = Math.floor((time - hour * 3600) / 60);
            let second = Math.floor(time - hour * 3600 - minute * 60);
            this.setState({timeString: hour.toString() + ': ' + minute.toString() + ': ' + second.toString()})
          }, 1000);
          setTimeout(() => {
            finishExamination(token, data.examById._id).then(() => {
              console.log("ki thi da ket thuc");
              clearInterval(interval);
            }).catch((err) => {
              console.log("error ", err);
            });
          }, time);
        }
      }
      this.setState({startCountDown: true});
    }
  }

  getCurrentQuestion(question) {
    let { questionSet } = this.state;
    let currentQuestion = questionSet[question.index];
    this.setState({currentQuestion});
  }

  componentWillReceiveProps(nextProps) {
    let { data }= nextProps;
    if(data.examById)  {
      let currentQuestion = data.examById.questionSet.questions[0];
      this.setState({currentQuestion});
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
    return playerList.map((item, idx) => (
      <tbody key = {idx} style={{borderTop: '1px solid gray'}}>
        <tr style={{height: 15, borderTop: '1px solid gray'}}>
        </tr>
        <tr>
          <td rowSpan="2">
            { idx + 1 }
          </td>
          <td rowSpan="2">
            <img style={{width: 47, height: 50, borderRadius: '100%'}} src={item.player.user.checkOutImage[0].link}/>
          </td>
          <td>
            <p>{item.player.user.name}</p>
          </td>
          <td>
            <p>{item.player.user.email}</p>
          </td>
          <td rowSpan="2">
            <p>{item.totalScore}</p>
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

  render() {
    let { data, params, users } = this.props;
    let { currentQuestion, questionSet, timeString } = this.state;
    if(data.loading) {
      return (
        <div className="loader"></div>
      )
    } else {
        console.log('user exam ', data.examById.userExams);
        if(data.examById.createdBy._id === users.userId) {
          let questionCount = data.examById.questionSet.questions.length;
          let playerList = __.cloneDeep(data.examById.userExams);
          __.forEach(playerList, item => {
            let resultCount = item.results.length;
            item['process'] = ( resultCount / questionCount ) * 100;
            let totalScore = 0;
            __.forEach(item.results, item => totalScore += item.score);
            item['totalScore'] = totalScore;
          });
          return (
            <div style={{backgroundColor: 'white'}}>
              <div style={{textAlign: 'center', paddingBottom: 20}}>
                <h1 style={{color: '#68C0BC'}}>{ data.examById.name.toUpperCase() }</h1>
                <p style={{fontSize: 14}}>Số lượng tham gia thi: <font style={{fontSize: 16, color: '#68C0BC'}}> { data.examById.userCount } </font></p>
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
                    <th style={{width: 200, color: '#68C0BC', fontSize: 14}}>
                      Email
                    </th>
                    <th style={{width: 200, color: '#68C0BC', fontSize: 14}}>
                      Điểm
                    </th>
                  </thead>
                  { this.renderPlayerList(playerList) }
                </table>
              </div>
              <div className="col-sm-12" style={{height: 120}}>
              </div>
              <div style={{paddingLeft: (window.innerWidth - 300) / 2, paddingRight: (window.innerWidth - 300) / 2}}>
                <button className="byn btn-primary" style={{width: '100%', border: 'none', fontSize: 14, height: 40}}>
                  { 'Thời gian còn lại: ' + timeString }
                </button>
              </div>
            </div>
          )
        } else {
            return (
              <div>
                <div className="col-sm-12">
                  <div className="col-sm-3" style={{display: '-webkit-flex', WebkitFlexWrap: 'wrap', display: 'flex', flexWrap: 'wrap'}}>
                    {
                      questionSet.map((item, idx) => (
                        <button key={idx} style={{borderRadius: '100%', width: 30, height: 30, margin: 10}} className={item._id === currentQuestion._id ? 'btn btn-primary' : 'btn btn-default'} onClick={() => {
                            this.setState({currentQuestion: item})
                          }}>{item.index}</button>
                        ))
                      }
                    </div>
                    <div className="col-sm-9">
                      <QuestionContentWithData question={currentQuestion} questionSetId={data.examById.questionSet._id} getCurrentQuestion={this.getCurrentQuestion.bind(this)} examId={params.id}/>
                    </div>
                  </div>
              </div>
            )
        }
    }
  }
}

const QUESTION_BY_EXAM = gql`
  query examById($examId: String!) {
    examById(_id: $examId) {
      _id
      code
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
)(StartedExam);

export default createContainer((ownProps) => {
  Meteor.subscribe("userExams");
  let examId = ownProps.params.id;
  let userExams = UserExams.find({examId}).fetch();

  return {
    userExams
  };
}, StartedExamWithData);
