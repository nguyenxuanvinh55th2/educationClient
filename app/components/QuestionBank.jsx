import React from 'react';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

class QuestionSetItem extends React.Component {
  render() {
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

export default class QuesionBank extends React.Component {
  // renderQuestionSetList() {
  //
  // }
  render() {
    return(
      <Tabs className="secondary">
        <TabList className="modal-header" style={{margin: 0}}>
            <Tab>
                <h4 className="modal-title">CÁ NHÂN</h4>
            </Tab>
            <Tab>
                <h4 className="modal-title">CỘNG ĐỒNG</h4>
            </Tab>
            <Tab>
                <h4 className="modal-title">XEM LẠI</h4>
            </Tab>
        </TabList>
        <TabPanel>
          <div style={{width: '60%', marginLeft: '20%'}}>

          </div>
        </TabPanel>
        <TabPanel>
          <div style={{width: '100%', paddingLeft: '10%'}}>

          </div>
        </TabPanel>
        <TabPanel>
          <div style={{width: '100%', paddingLeft: '10%', paddingRight: '10%'}}>

          </div>
        </TabPanel>
      </Tabs>
    )
  }
}

// const QUESTION_SET_QUERY = gql`
//     query questionBankUser($userId: String!) {
//         questionBankUser(userId: $userId) {
//           _id
//           title
//           description
//           questionCount
//           questions: {
//             _id
//             question
//             answerSet
//             correctAnswer
//             correctRate
//           }
//         }
// }`
//
// export default compose (
//     graphql(QUESTION_SET_QUERY, {
//         options: ()=> ({
//             variables: {},
//             forceFetch: true
//         })
//     }),
// )(QuesionBank);
