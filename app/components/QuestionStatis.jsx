import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import __ from 'lodash';

import Drawer from 'material-ui/Drawer';
import Dialog from 'material-ui/Dialog';

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

const statisQuestion = (questionArray, correctRate, type) => {
  return {
      labels: questionArray.map((item, idx) => {
        if(type === 'full') {
          return 'Câu ' + (idx + 1).toString()
        } else {
            return ''
        }
      }),
      datasets: [{
          label: '# of Votes',
          data: questionArray.map((item, idx) => Math.round(item[correctRate] * 100)),
          fillColor: questionArray.map((item, idx) => 'rgba(53, 188, 191, 0.2)'),
          strokeColor: questionArray.map((item, idx) => 'rgba(53, 188, 191, 0.8)')
      }]
  }
}

class DialogBarChat extends React.Component {
  render() {
    let { chartData, name } = this.props;
    return (
      <div className="modal-dialog" style={{width: 'auto', margin: 0}}>
        <div className="modal-content">
          <div className="modal-header" style={{display: 'flex', flexDirection: 'column',alignItems: 'center'}}>
            <h4>THỐNG KÊ BỘ CÂU HỎI</h4>
          </div>
          <div className="modal-body" style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
            <BarChart width={'750'} height={'400'} chartData={chartData} chartOptions={{
                       enabled:true, scales: { xAxes: [{ stacked: true }], yAxes: [{ stacked: true }] }
                  }}/>
            <div style={{width: '100%', textAlign: 'center'}}>
              {name}
            </div>
          </div>
        </div>
      </div>
    )
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
      showDialog: false,
      data: null,
      name: null
    }
  }

  showChartDialog(data, name) {
    this.setState({showDialog: true, data, name});
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
              <button className="btn" style={{backgroundColor: '#35bcbf', color: 'white'}} onClick={() => this.setState({openDrawer: true})}>Nội dung</button>
            </div>
            <div style={{width: '100%', display: '-webkit-flex', WebkitFlexWrap: 'wrap', display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
              <h3 style={{width: '100%', textAlign: 'center', color: "#35BCBF"}}>Thống kê dựa trên điểm số:</h3>
              {
                data.examinationByQuestionSet.map((item, idx) => {
                  let length = scoreShowAll ? data.examinationByQuestionSet.length : 3;
                  if(idx < length) {
                    return (
                      <div key={idx} style={{width: 250, padding: '10px 25px 25px'}}>
                        <PieChart width={'200'} height={'200'} chartData={statisScore(item.userExams.map(item => item.score))} chartOptions={{
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
                <button className="btn" style={{backgroundColor: '#35bcbf', color: 'white'}} onClick={() => {
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
                      <div key={idx} style={{width: 400, padding: 10}} onClick={() => {
                        this.showChartDialog(statisQuestion(item.questionSet.questions, 'correctRateByExam', 'full'), item.name)
                      }}>
                        <BarChart width={'400'} height={'200'} chartData={statisQuestion(item.questionSet.questions, 'correctRateByExam', 'mini')} chartOptions={{
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
                <button className="btn" style={{backgroundColor: '#35bcbf', color: 'white'}} onClick={() => {
                    let rateShowAll = !this.state.rateShowAll;
                    this.setState({rateShowAll});
                  }}>{rateShowAll ? "Thu gọn" : "Hiện tất cả"}</button>
              </div>
            </div>
            <div style={{width: '100%', display: '-webkit-flex', WebkitFlexWrap: 'wrap', display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
              <h3 style={{width: '100%', textAlign: 'center', color: "#35BCBF"}}>Thống kê trên toàn bộ kì thi:</h3>
              <div style={{width: 400, padding: 10}} onClick={() => {
                this.showChartDialog(statisQuestion(data.questionSetById.questions, 'correctRate', 'full'), data.questionSetById.name)
              }}>
                <BarChart width={'400'} height={'200'} chartData={statisQuestion(data.questionSetById.questions, 'correctRate', 'mini')} chartOptions={{
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
            <Dialog
              modal={false}
              open={this.state.showDialog}
              onRequestClose={() => this.setState({showDialog: false})}
              autoDetectWindowHeight={false}
              autoScrollBodyContent={false}
              bodyStyle={{padding: 0}}
              contentStyle={{minHeight:'60%'}}
            >
              <DialogBarChat chartData={this.state.data} name={this.state.name}/>
            </Dialog>
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
