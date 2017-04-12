import React from 'react';
import __ from 'lodash';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

class JoinExamDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {examCode: '', disableButton: true};
  }

  insertUserToExam() {
    let token = localStorage.getItem('Meteor.loginToken');
    let { insertUserToExam } = this.props;
    let { examCode } = this.state;
    insertUserToExam(token, examCode).then(() => {

    }).catch((err) => {

    })
  }

  render() {
    let { users } = this.props;
    let { examCode, disableButton } = this.state;
    if(users.userId) {
      return (
        <div>
          <h3 style={{textAlign: 'center'}}>Tham gia kì thi</h3>
          <div style={{width: '100%', padding: '0px 20% 10px'}} className="form-group">
              <label className="col-sm-3 control-label">Nhập mã kì thi</label>
              <div className="col-sm-9">
                  <input style={{width: '80%'}} type="text" className="form-control" value={this.state.examCode} onChange={({target}) => {
                      this.setState({examCode: target.value});
                      if(target.value && target.value !== '') {
                        this.setState({disableButton: false});
                      }
                  }}/>
              </div>
          </div>
          <div style={{width: '100%', paddingLeft: '40%', paddingRight: '40%'}} className="form-group">
              <button style={{width: '100%'}} onClick={this.insertUserToExam.bind(this)} className="btn btn-primary" disabled={disableButton}>
                Tham gia
              </button>
          </div>
        </div>
      )
    } else {
        return (
          <div></div>
        )
    }
  }
}

const INSERT_USER_TO_EXAM = gql`
    mutation insertUserToExam ($token: String!, $examCode: String!) {
        insertUserToExam(token: $token, examCode: $examCode)
}`

export default compose (
    graphql(INSERT_USER_TO_EXAM, {
        props: ({mutate})=> ({
            insertUserToExam : (token, examCode) => mutate({variables:{token, examCode}})
        })
    }),
)(JoinExamDialog);
