import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import __ from 'lodash';

import Drawer from 'material-ui/Drawer';

import PieChart from './PieChart.jsx';
import BarChart from './BarChart.jsx';
import QuestionReviewItem from './QuestionReviewItem.jsx';

const statisScore = (scoreArray) => {
  scoreArray.sort();
  scoreArray.push('');
  //   return (b.score - a.score)
  // });
  let countArray = [];
  let count = 1;
  let dem = 1;
  for(let i = 1; i < scoreArray.length; i++) {
    if(scoreArray[i] === scoreArray[i - 1]) {
      count ++;
    } else {
        let color = '#949FB1';
        if(dem % 5 === 1) {
            color = '#FF5A5E';
        } else
            if(dem % 5 === 2) {
              color = '#5AD3D1';
            } else
                if(dem % 5 === 3) {
                  color = '#FFC870';
                } else
                    if(dem % 5 === 4) {
                      color = '#46BFBD';
                    }
        let chartItem = {color, label: scoreArray[i - 1].toString(), value: Math.round((count / (scoreArray.length - 1)) * 100)}
        countArray.push(chartItem);
        count = 1;
        dem ++;
    }
  }
  return countArray;
}

const statisQuestion = (questionArray, correctRate) => {
  return {
      labels: questionArray.map((item, idx) => item.question.substring(0, 6) + '...'),
      datasets: [{
          label: '# of Votes',
          data: questionArray.map((item, idx) => Math.round(item[correctRate] * 100)),
          backgroundColor: questionArray.map((item, idx) => 'rgba(255, 99, 132, 0.2)'),
          borderColor: questionArray.map((item, idx) => 'rgba(255,99,132,1)'),
          borderWidth: 1
      }]
  }
}

class QuestionStatis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showQuestion: false,
      openDrawer: false,
      scoreShowAll: false,
      rateShowAll: false,
    }
  }

  showQuestion() {
    let showQuestion = this.state.showQuestion;
    this.setState({showQuestion: !showQuestion});
  }

  renderQuestionReview() {
    let { data } = this.props;
    let questionSet = __.cloneDeep(data.questionSetById.questions)
    return questionSet.map((item, idx) => {
      return <QuestionReviewItem index={parseInt(idx) + 1} getReviewFrom={'questionBank'} key={item._id} question={item}/>
    })
  }

  render() {
    let { data } = this.props;
    console.log('data ', data);
    let { openDrawer, scoreShowAll, rateShowAll, allRateShowAll } = this.state;
    if (!data.examinationByQuestionSet || !data.questionSetById) {
        return (
            <div className="spinner spinner-lg"></div>
        );
    } else {
        return (
          <div style={{padding: '10px 50px'}}>
            <h2 style={{width: '100%', textAlign: 'center', color: "#35BCBF"}}>{ data.questionSetById.title }</h2>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
              <button className="btn btn-default" style={{boxShadow: 'none'}} onClick={() => this.setState({openDrawer: true})}>Nội dung</button>
            </div>
            <div style={{width: '100%', display: '-webkit-flex', WebkitFlexWrap: 'wrap', display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
              <h3 style={{width: '100%', textAlign: 'center', color: "#35BCBF"}}>Thống kê dựa trên điểm số:</h3>
              {
                data.examinationByQuestionSet.map((item, idx) => {
                  let length = scoreShowAll ? data.examinationByQuestionSet.length : 2;
                  if(idx < length) {
                    return (
                      <div key={idx} style={{width: 300, padding: 10}}>
                        <PieChart chartData={statisScore(item.userExams.map(item => item.score))} chartOptions={{
                            animatable: true,
                          }}/>
                        <div style={{width: '100%', textAlign: 'center'}}>
                          {item.name}
                        </div>
                      </div>
                    )
                  }
                })
              }
              <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                <button className="btn btn-default" onClick={() => {
                    let scoreShowAll = !this.state.scoreShowAll;
                    this.setState({scoreShowAll});
                  }}>{scoreShowAll ? "Thu gọn" : "Hiện tất cả"}</button>
              </div>
            </div>
            <div style={{width: '100%', display: '-webkit-flex', WebkitFlexWrap: 'wrap', display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
              <h3 style={{width: '100%', textAlign: 'center', color: "#35BCBF"}}>Thống kê dựa trên tỉ lệ trả lời đúng:</h3>
              {
                data.examinationByQuestionSet.map((item, idx) => {
                  let length = rateShowAll ? data.examinationByQuestionSet.length : 2;
                  if(idx < length) {
                    return (
                      <div key={idx} style={{width: 300, padding: 10}}>
                        <BarChart chartData={statisQuestion(item.questionSet.questions, 'correctRateByExam')} chartOptions={{
                             enabled:true, scales: { xAxes: [{ stacked: true }], yAxes: [{ stacked: true }] }
                        }}/>
                        <div style={{width: '100%', textAlign: 'center'}}>
                          {item.name}
                        </div>
                      </div>
                    )
                  }
                })
              }
              <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                <button className="btn btn-default" onClick={() => {
                    let rateShowAll = !this.state.allRateShowAll;
                    this.setState({allRateShowAll});
                  }}>{rateShowAll ? "Thu gọn" : "Hiện tất cả"}</button>
              </div>
            </div>
            <div style={{width: '100%', display: '-webkit-flex', WebkitFlexWrap: 'wrap', display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
              <h3 style={{width: '100%', textAlign: 'center', color: "#35BCBF"}}>Thống kê trên toàn bộ kì thi:</h3>
              <div style={{width: 300, padding: 10}}>
                <BarChart chartData={statisQuestion(data.questionSetById.questions, 'correctRate')} chartOptions={{
                     enabled:true, scales: { xAxes: [{ stacked: true }], yAxes: [{ stacked: true }] }
                }}/>
                <div style={{width: '100%', textAlign: 'center'}}>
                  {data.questionSetById.name}
                </div>
              </div>
            </div>
            <Drawer docked={false} width={400} openSecondary={true} open={openDrawer} onRequestChange={(openDrawer) => this.setState({openDrawer})}>
              <div style={{width: '100%', padding: 20}}>
                <div style={{width: '100%'}}>
                  { this.renderQuestionReview() }
                </div>
              </div>
            </Drawer>
          </div>
        )
    }
  }
}

const QUESTION_STATIS = gql`
  query examinationByQuestionSet($_id: String!) {
    examinationByQuestionSet(_id: $_id) {
      _id
      code
      name
      description
      userExams {
        _id
        correctCount
        score
      }
      questionSet {
        _id
        title
        examId
        description
        questionCount
        questions {
          _id
          examId
          question
          correctRate
          correctRateByExam
        }
      }
    }
    questionSetById(_id: $_id) {
      _id
      title
      examId
      description
      questionCount
      questions {
        _id
        question
        answerSet
        correctAnswer
        correctRate
        file {
          link
          type
        }
      }
    }
  }`

export default compose (
    graphql(QUESTION_STATIS, {
        options: (owProps)=> ({
            variables: {_id: owProps.params.questionSetId},
            forceFetch: true
        })
    }),
)(QuestionStatis);
