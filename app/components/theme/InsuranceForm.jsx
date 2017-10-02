import React from 'react';
;
import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import QuillEditorTour from '../editor/TourEditor.jsx';
class InsuranceForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      height: window.innerHeight,
      content: '',
      loading: true
    }
  }
  handleSave(){
    Settings.update({_id: 'buildmodify'}, {$set: {insurance: this.state.content}});
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.data.setting){
      this.setState({content: nextProps.data.setting.insurance ? nextProps.data.setting.insurance : '', loading: false})
    }
  }
  render(){
    if(!this.props.data.setting || this.state.loading){
      return (
        <div className="loading">
          <i className="fa fa-spinner fa-spin" style={{
            fontSize: 50
          }}></i>
        </div>
      )
    }
    else {
      return (
        <div>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
            <ol className="breadcrumb" style={{
              marginBottom: 0,
              backgroundColor: 'white'
            }}>
              <li>
                <a onClick={() => browserHistory.push('/dashboard')}>Dashboard</a>
              </li>
              <li>
                <a onClick={() => browserHistory.push('/insuranceForm')}>Bảo hiểm du lịch</a>
              </li>
            </ol>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: 5
            }}>
              <button type="button" className="btn btn-primary" disabled={!this.state.content} style={{
                marginLeft: 10
              }} onClick={() => {
                this.handleSave()
              }}>Lưu</button>
              <button type="button" className="btn btn-danger" style={{
                margin: '0 10px'
              }} onClick={() => browserHistory.push('/dashboard')}>Hủy</button>
            </div>
          </div>
          <div className="row" style={{
            padding: 10, margin: 0,
            backgroundColor: "rgb(204, 204, 204)",
            marginTop: 5, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'
          }}>
            <div className="col-sm-12 col-md-10 col-lg-8" style={{
              backgroundColor: 'white',
              height: this.state.height - 160,
              overflow: 'auto'
            }}>
            <QuillEditorTour keyValue={"insurance"} ref="insurance" height={window.innerHeight - 230} value={this.state.content} getValue={(value) => {
              this.setState((prevState) => {
                prevState.content = value;
                return prevState;
              });
            }}/>
            </div>
          </div>
        </div>
      )
    }
  }
}
const QUERY = gql `
    query setting{
      setting {
      _id insurance terms
    }
}`
export default compose(graphql(QUERY, {
  options: (ownProps) => {
    return {
      variables: {},
      fetchPolicy: 'cache-and-network'
    }
  }
}))(InsuranceForm);
