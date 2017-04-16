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
    this.state =  {currentQuestion: null, userExams: null};
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
        <td>
          <img style={{width: 75, height: 75}} src={item.player.user.checkOutImage[0].link}/>
        </td>
        <td>
          <p>{item.player.user.name}</p>
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
            <div>
              <table>
                <tbody>
                  { this.renderPlayerList(playerList) }
                </tbody>
              </table>
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

const StartedExamWithData = compose (
    graphql(QUESTION_BY_EXAM, {
        options: (owProps)=> ({
            variables: {examId: owProps.params.id},
            forceFetch: true
        })
    })
)(StartedExam);

export default createContainer((ownProps) => {
  Meteor.subscribe("userExams");
  let examId = ownProps.params.id;
  let userExams = UserExams.find({examId}).fetch();

  return {
    userExams
  };
}, StartedExamWithData);
