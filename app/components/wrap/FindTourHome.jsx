import React from 'react';
import { browserHistory } from 'react-router';

export default class FindTourHome extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '', locations: '', category: '',
      date: ''
    }
  }
  handleFind(){
    if(this.state.name || this.state.locations || this.state.category){
      document.getElementById('box-search').style.display = 'none';
      let query = {};
      if(this.state.name){
        query['ten-tour'] = this.state.name
      }
      if(this.state.locations){
        query['dia-diem-du-lich'] = this.state.locations;
      }
      if(this.state.category){
        query['loai-hinh-tour'] = this.state.category;
      }
      if(this.state.date){
        query['ngay-khoi-hanh'] = this.state.date;
      }
      browserHistory.push(
          {
           pathname: "/tim-kiem",
           query: query
        }
      )
    }
  }
  render(){
    return (
      <div id="box-search" className={this.props.open
        ? "box-search remove"
        : "box-search"}>
        <h2>TÌM KIẾM</h2>
        <div className="text-search">
          <p>Tìm để bắt đầu hành trình của bạn</p>
        </div>
        <div className="form-group">
          <input type="text" className="form-control" placeholder="Tìm kiếm theo tên tour" value={this.state.name}
            onChange={({target}) => {
              this.setState((prevState) => {
                prevState.name = target.value;
                return prevState;
              })
            }}/>
          <a href="">
            <i className="fa fa-search" aria-hidden="true"></i>
          </a>
        </div>
        <div className="form-group">
          <input type="text" className="form-control" value={this.state.locations} placeholder="Tìm kiếm theo điểm đến" onChange={({target}) => {
            this.setState((prevState) => {
              prevState.locations = target.value;
              return prevState;
            })
          }}/>
          <a href="">
            <i className="fa fa-plane" aria-hidden="true"></i>
          </a>
        </div>
        <div className="form-group">
          <input type="text" className="form-control" placeholder="Tìm kiếm theo kiểu tour" value={this.state.category} onChange={({target}) => {
            this.setState((prevState) => {
              prevState.category = target.value;
              return prevState;
            })
          }}/>
          <a href="">
            <i className="fa fa-bed" aria-hidden="true"></i>
          </a>
        </div>
        <div className="form-group">
          <input type="date" className="form-control" value={this.state.date} placeholder="Tìm theo ngày khởi hành" onChange={({target}) => {
            this.setState((prevState) => {
              prevState.date = target.value;
              return prevState;
            })
          }}/>
          <a href="">
            <i className="fa fa-calendar" aria-hidden="true"></i>
          </a>
        </div>
        <p>
          <a className="btn btn-tour" onClick={() => {this.handleFind(); document.getElementById('box-search').style.display = 'none';}}>TÌM NGAY</a>
        </p>
        <div className="close" onClick={() => document.getElementById('box-search').style.display = 'none'}>
          <i className="fa fa-times" aria-hidden="true"></i>
        </div>
      </div>
    )
  }
}
