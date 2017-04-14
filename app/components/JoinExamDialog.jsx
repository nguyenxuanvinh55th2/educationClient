import React from 'react';
import __ from 'lodash';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Webcam from 'react-webcam';

class JoinExamDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {examCode: '', name: '', email: '', disableButton: true, disableCode: true};
    this.playerImage = null;
    this.xhr = new XMLHttpRequest();
  }

  insertUserToExam() {
    let token = localStorage.getItem('Meteor.loginToken');
    let { insertUserToExam } = this.props;
    let { examCode } = this.state;
    this.playerImage = this.refs.webcam.getScreenshot();
    insertUserToExam(token, examCode, this.playerImage).then(({data}) => {
      if(data.insertUserToExam === 'notFound') {
        console.log("kì thi không tòn tại");
      } else
          if(data.insertUserToExam === 'canNotJoin') {
            console.log("kì thi này hiện chưa bắt đầu hoặc đã kết thúc");
          }
    }).catch((err) => {

    });
  }

  render() {
    let { users } = this.props;
    let { examCode, disableButton, disableCode } = this.state;
    if(users.userId) {
      return (
        <div>
          <h3 style={{textAlign: 'center'}}>Tham gia kì thi</h3>
          <div style={{paddingLeft: '35%', paddingRight: '35%'}}>
            <Webcam ref="webcam" audio={false} screenshotFormat="image/webp" height={200} width={200}/>
          </div>
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
          <div style={{width: '100%', paddingLeft: '40%', paddingRight: '40%', paddingTop: 15}} className="form-group">
              <button style={{width: '100%'}} onClick={this.insertUserToExam.bind(this)} className="btn btn-primary" disabled={disableButton}>
                Tham gia
              </button>
          </div>
        </div>
      )
    } else {
        return (
          <div>
            <h3 style={{textAlign: 'center'}}>Tham gia kì thi</h3>
            <div style={{paddingLeft: '35%', paddingRight: '35%'}}>
              <Webcam ref="webcam" audio={false} screenshotFormat="image/webp" height={200} width={200}/>
            </div>
            <div style={{width: '100%', padding: '0px 20% 10px'}} className="form-group col-sm-12">
                <label className="col-sm-3 control-label">Nhập tên của bạn</label>
                <div className="col-sm-9">
                    <input style={{width: '80%'}} type="text" className="form-control" value={this.state.name} onChange={({target}) => {
                      if(target.value && target.value !== '' && this.state.email && this.state.email !== '') {
                        this.setState({disableCode: false});
                      }
                      this.setState({name: target.value});
                    }}/>
                </div>
            </div>
            <div style={{width: '100%', padding: '0px 20% 10px'}} className="form-group col-sm-12">
                <label className="col-sm-3 control-label">Nhập email hoặc số điện thoại</label>
                <div className="col-sm-9">
                    <input style={{width: '80%'}} type="text" className="form-control" value={this.state.email} onChange={({target}) => {
                      if(target.value && target.value !== '' && this.state.name && this.state.name !== '') {
                        this.setState({disableCode: false});
                      }
                      this.setState({email: target.value});
                    }}/>
                </div>
            </div>
            <div style={{width: '100%', padding: '0px 20% 10px'}} className="form-group col-sm-12">
                <label className="col-sm-3 control-label">Nhập mã kì thi</label>
                <div className="col-sm-9">
                    <input style={{width: '80%'}} type="text" className="form-control" value={this.state.examCode} disabled={disableCode} onChange={({target}) => {
                        this.setState({examCode: target.value});
                        if(target.value && target.value !== '') {
                          this.setState({disableButton: false});
                        }
                    }}/>
                </div>
            </div>
            <div style={{width: '100%', paddingLeft: '40%', paddingRight: '40%', paddingTop: 15}} className="form-group">
                <button style={{width: '100%'}} onClick={this.insertUserToExam.bind(this)} className="btn btn-primary" disabled={disableButton}>
                  Tham gia
                </button>
            </div>
          </div>
      )
    }
  }
}

const INSERT_USER_TO_EXAM = gql`
    mutation insertUserToExam ($token: String!, $examCode: String!, $link: String!) {
        insertUserToExam(token: $token, examCode: $examCode, link: $link)
}`

export default compose (
    graphql(INSERT_USER_TO_EXAM, {
        props: ({mutate})=> ({
            insertUserToExam : (token, examCode, link) => mutate({variables:{token, examCode, link}})
        })
    }),
)(JoinExamDialog);
