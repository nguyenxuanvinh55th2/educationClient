import React from 'react';
import __ from 'lodash';
import gql from 'graphql-tag';

import { graphql, compose } from 'react-apollo';
import { createContainer } from 'react-meteor-data';

import  { UserExams } from 'educationServer/userExam'

class QuestionContent extends React.Component {
  render() {
    let { question, data, examId } = this.props;
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
      <div>
        <div>
          <h3>{ question.question }</h3>
        </div>
        <div style={{display: '-webkit-flex', WebkitFlexWrap: 'wrap', display: 'flex', flexWrap: 'wrap'}}>
          {
            question.answerSet.map((item, idx) => (
              <label key={idx} style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                <input checked={userResults[question._id] && (userResults[question._id].answer.indexOf(item) > -1 && 'checked')} type="radio" name="optradio" onChange={({target}) => {
                    let token = localStorage.getItem('Meteor.loginToken');
                    this.props.answerQuestion(token, examId, question._id, item).then(() => {
                      this.props.data.refetch()
                    }).catch((err) => {

                    });
                  }}/>
                <button className="btn btn-default" style={{width: 300, marginRight: 50, marginBottom: 10}}>{ item }</button>
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
    mutation answerQuestion ($token: String!, $examId: String!, $questionId: String!, $answer: String!) {
      answerQuestion(token: $token, examId: $examId, questionId: $questionId, answer: $answer)
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
          answerQuestion : (token, examId, questionId, answer) => mutate({variables: {token, examId, questionId, answer}})
        })
    }),
)(QuestionContent);


class StartedExam extends React.Component {
  constructor(props) {
    super(props);
    this.state =  {currentQuestion: null, userExams: null, startCountDown: false};
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
            countDown -= 1000
            console.log('time ', countDown.toString());
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

  componentWillReceiveProps(nextProps) {
    let { data }= nextProps;
    if(data.examById)  {
      let currentQuestion = data.examById.questionSet.questions[0];
      this.setState({currentQuestion});
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
      <tr key={idx}>
        <td rowspan="2">
          { idx + 1 }
        </td>
        <td rowspan="2">
          <img style={{width: 47, height: 50, borderRadius: '100%'}} src={item.player.user.checkOutImage[0].link}/>
        </td>
        <td>
          <p>{item.player.user.name}</p>
        </td>
        <td>
          <p>{item.player.user.email}</p>
        </td>
      </tr>
      <tr>
        <td rowspan="2">
          { idx + 1 }
        </td>
        <td rowspan="2">
          <img style={{width: 47, height: 50, borderRadius: '100%'}} src={item.player.user.checkOutImage[0].link}/>
        </td>
        <td>
          <div className="progress" style={{width: 200, height: 15, marginTop: 3}}>
            <div className="progress-bar" role="progressbar" aria-valuenow={item.process.toString()}
             aria-valuemin="0" aria-valuemax="100" style={{backgroundColor: '#fcb826', width: item.process.toString() + '%'}}>
            </div>
          </div>
        </td>
      </tr>
    ));
  }

  render() {
    let { data, params, users } = this.props;
    let { currentQuestion } = this.state;
    if(data.loading) {
      return (
        <div className="loader"></div>
      )
    } else {
        if(data.examById.createdBy._id === users.userId) {
          let questionCount = data.examById.questionSet.questions.length;
          let playerList = __.cloneDeep(data.examById.userExams);
          __.forEach(playerList, item => {
            let resultCount = item.results.length;
            item['process'] = ( resultCount / questionCount ) * 100;
          })
          return (
            <div style={{backgroundColor: 'white'}}>
              <div style={{textAlign: 'center', paddingBottom: 20}}>
                <h1 style={{color: '#68C0BC'}}>{ data.examById.name.toUpperCase() }</h1>
                <p style={{fontSize: 14}}>Số lượng tham gia thi: <font style={{fontSize: 16, color: '#68C0BC'}}> { data.examById.userCount } </font></p>
              </div>
              <div className="col-sm-12" style={{padding: '0px 20%'}}>
                <table style={{width: '100%'}}>
                  <thead>
                    <th>
                      STT
                    </th>
                    <th>
                    </th>
                    <th>
                      Tên người dùng
                    </th>
                    <th>
                      Email
                    </th>
                  </thead>
                  <tbody>
                    { this.renderPlayerList(playerList) }
                  </tbody>
                </table>
              </div>
            </div>
          )
        } else {
            return (
              <div>
                <div className="col-sm-12">
                  <div className="col-sm-3" style={{display: '-webkit-flex', WebkitFlexWrap: 'wrap', display: 'flex', flexWrap: 'wrap'}}>
                    {
                      data.examById.questionSet.questions.map((item, idx) => (
                        <button key={idx} style={{borderRadius: '100%', width: 30, height: 30, margin: 10}} className={item._id === currentQuestion._id ? 'btn btn-primary' : 'btn btn-default'} onClick={() => {
                            this.setState({currentQuestion: item})
                          }}>{(idx + 1).toString()}</button>
                        ))
                      }
                    </div>
                    <div className="col-sm-9">
                      <QuestionContentWithData question={currentQuestion} examId={params.id}/>
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
