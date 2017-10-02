import React from 'react'
import {Link, browserHistory} from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import __ from 'lodash';
import moment from 'moment';

class TeamBuilding extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      place: '',
      peopleCount: '',
      dateStart: '',
      dateEnd: '',
      address: '',
      hotelStar: '',
      mobile: '',
      email: '',
      emailError: null,
			nameError: null,
			mobileError: null,
			addressError: null,
    }
    this.allowClick = false;
  }
  componentWillMount(){
    if(this.props.changeHeader){
      this.props.changeHeader('team-building');
    }
  }
  insertTeamBuilding() {
    let { name, place, hotelStar, mobile, address, peopleCount, dateStart, dateEnd } = this.state;
    if(name && place && hotelStar && mobile && address && peopleCount && dateStart && dateEnd) {
      if(!this.allowClick) {
        this.allowClick = true;
        let info = this.state;
        info.dateStart = moment(moment(info.dateStart).valueOf()).format('DD/MM/YYYY');
        info.dateEnd = moment(moment(info.dateEnd).valueOf()).format('DD/MM/YYYY');
        this.props.insertTeamBuildings(JSON.stringify(this.state)).then(() => {
          this.props.addNotificationMute({fetchData: true, message: 'Bạn đã gửi yêu cầu thành công', level: 'success'});
          browserHistory.goBack();
          Meteor.call('sendMailNotification', {
            content: name + ' ' + 'đăng ký dịch vụ Team building',
            title: 'Thông báo'
          }, (err, res) => {
            if (err) {
              alert(err);
            } else {
              // success
            }
          });
          Meteor.call('sendNotification', {
            note: 'khách hàng ' + name + ' ' + 'vừa đăng ký dịch vụ Team building',
            link: '/teamBuilding',
          }, (err, res) => {
            if (err) {
              alert(err);
            } else {
              // success
            }
          });
          this.setState({
            name: '',
            place: '',
            peopleCount: '',
            dateStart: '',
            dateEnd: '',
            address: '',
            hotelStar: '',
            mobile: '',
            email: '',
            /////////////////////////
            nameError: null,
            placeError: null,
            peopleCountError: null,
            dateStartError: null,
            dateEndError: null,
            addressError: null,
            hotelStarError: null,
            emailError: null,
            mobileError: null,
          });
          this.allowClick = false;
        }).catch(err => {
          console.log("err ", err);
        })
      }
    }
  }

  render() {
    let {
      name,
      place,
      peopleCount,
      dateStart,
      dateEnd,
      address,
      hotelStar,
      mobile,
      email,
      /////////////////////////
      nameError,
      placeError,
      peopleCountError,
      dateStartError,
      dateEndError,
      addressError,
      hotelStarError,
      emailError,
      mobileError
    } = this.state;
    return (
      <div>
        {
          (this.props.data.advertisements && this.props.data.advertisements.length) ?  (
            <div className="banner bg" style={{
              backgroundImage: "url('" + this.props.data.advertisements[0].image.file + "')"
            }}>
              <div className="container">
                <div className="table-div">
                  <div className="table-cell">
                    <h2>{this.props.data.advertisements[0].name}</h2>
                    <h4>{this.props.data.advertisements[0].title}</h4>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="banner bg" style={{
                backgroundImage: "url('/imgs/Teambuilding-banner.jpg')"
              }}>
              <div className="container">
                <div className="table-div">
                  <div className="table-cell">
                    <h2>TEAMBUILDING</h2>
                    <h4>TẠI ĐÂY BẠN TẠO RA HÀNH TRÌNH CHO CHÍNH MÌNH</h4>
                  </div>
                </div>
              </div>
            </div>
          )
        }
        <div className="teambuilding">
          <div className="container">
            <div className="teambuilding-form">
              <h3>BƯỚC ĐẦU TIÊN ĐỂ TẠO RA HÀNH TRÌNH CỦA BẠN, VUI LÒNG ĐIỀN VÀO MẪU SAU</h3>
              <div className="form-group">
                <div className="col-sm-5 form-label">
                  <p>Bạn muốn đi đâu? (*)</p>
                </div>
                <div className="col-sm-7 input">
                  <input type="text" style={{marginBottom: 0}} value={place} className="form-control" onChange={({target}) => {
                      this.setState({place: target.value})
                    }} onBlur={() => {
                      if(place === '') {
                        this.setState({placeError: 'Trường này không được để trống'});
                      } else {
                          this.setState({placeError: null});
                        }
                    }}/>
                  <span style={{height: 15}} className="help-block">{placeError ? <font style={{color: 'red'}}>{placeError}</font> : null}</span>
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-5 form-label">
                  <p>Bạn đi bao nhiêu người? (*)</p>
                </div>
                <div className="col-sm-7 input">
                  <input type="number" style={{marginBottom: 0}} value={peopleCount} className="form-control" onChange={({target}) => {
                      if(target.value) {
                        this.setState({peopleCount: parseInt(target.value)})
                      } else {
                          this.setState({peopleCount: 0});
                      }
                    }} onBlur={() => {
                      if(peopleCount === '') {
                        this.setState({peopleCountError: 'Trường này không được để trống'});
                      } else {
                          this.setState({peopleCountError: null});
                        }
                    }}/>
                  <span style={{height: 15}} className="help-block">{peopleCountError ? <font style={{color: 'red'}}>{peopleCountError}</font> : null}</span>
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-5 form-label">
                  <p>Vui lòng chọn thời gian đi và thời gian về (*)</p>
                </div>
                <div className="col-sm-7 input">
                  <div className="row">
                    <div className="col-sm-6">
                      <input type="date" style={{marginBottom: 0}} value={dateStart} className="form-control" placeholder="Ngày đi" onChange={({target}) => {
                          this.setState({dateStart: target.value})
                        }} onBlur={() => {
                          if(dateStart === '' || dateEnd === '') {
                            this.setState({dateStartError: 'Trường này không được để trống'});
                          } else {
                              this.setState({dateStartError: null});
                            }
                        }}/>
                    </div>
                    <div className="col-sm-6">
                      <input type="date" style={{marginBottom: 0}} value={dateEnd} className="form-control" placeholder="Ngày về" onChange={({target}) => {
                          this.setState({dateEnd: target.value})
                        }} onBlur={() => {
                          if(dateEnd === '' || dateStart === '') {
                            this.setState({dateStartError: 'Trường này không được để trống'});
                          } else {
                              this.setState({dateStartError: null});
                            }
                        }}/>
                    </div>
                  </div>
                  <span style={{height: 15}} className="help-block">{dateStartError ? <font style={{color: 'red'}}>{dateStartError}</font> : null}</span>
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-5 form-label">
                  <p>Bạn hiện đang ở đâu? (*)</p>
                </div>
                <div className="col-sm-7 input">
                  <input type="text" style={{marginBottom: 0}} value={address} className="form-control" onChange={({target}) => {
                      this.setState({address: target.value})
                    }} onBlur={() => {
                      if(address === '') {
                        this.setState({addressError: 'Trường này không được để trống'});
                      } else {
                          this.setState({addressError: null});
                        }
                    }}/>
                  <span style={{height: 15}} className="help-block">{addressError ? <font style={{color: 'red'}}>{addressError}</font> : null}</span>
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-5 form-label">
                  <p>Bạn muốn ở khách sạn mấy sao? (*)</p>
                </div>
                <div className="col-sm-7 input">
                  <input type="number" style={{marginBottom: 0}} value={hotelStar} className="form-control" onChange={({target}) => {
                      if(target.value) {
                        this.setState({hotelStar: parseInt(target.value)});
                      } else {
                          this.setState({hotelStar: 0});
                      }
                    }} onBlur={() => {
                      if(hotelStar === '') {
                        this.setState({hotelStarError: 'Trường này không được để trống'});
                      } else {
                          this.setState({hotelStarError: null});
                        }
                    }}/>
                  <span style={{height: 15}} className="help-block">{hotelStarError ? <font style={{color: 'red'}}>{hotelStarError}</font> : null}</span>
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-5 form-label">
                  <p>Vui lòng nhập tên của bạn (*)</p>
                </div>
                <div className="col-sm-7 input">
                  <input type="text" style={{marginBottom: 0}} value={name} className="form-control" onChange={({target}) => {
                      this.setState({name: target.value})
                    }} onBlur={() => {
                      if(name === '') {
                        this.setState({nameError: 'Trường này không được để trống'});
                      } else {
                          this.setState({nameError: null});
                        }
                    }}/>
                  <span style={{height: 15}} className="help-block">{nameError ? <font style={{color: 'red'}}>{nameError}</font> : null}</span>
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-5 form-label">
                  <p>Vui lòng nhập số điện thoại của bạn (*)</p>
                </div>
                <div className="col-sm-7 input">
                  <input type="text" style={{marginBottom: 0}} value={mobile} className="form-control" onChange={({target}) => {
                      this.setState({mobile: target.value})
                    }} onBlur={() => {
                      if(mobile === '') {
                        this.setState({mobileError: 'Trường này không được để trống'});
                      } else {
                          this.setState({mobileError: null});
                        }
                    }}/>
                  <span style={{height: 15}} className="help-block">{mobileError ? <font style={{color: 'red'}}>{mobileError}</font> : null}</span>
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-5 form-label">
                  <p>Vui lòng nhập địa chỉ email của bạn</p>
                </div>
                <div className="col-sm-7 input">
                  <input type="text" style={{marginBottom: 0}} value={email} className="form-control" onChange={({target}) => {
                      this.setState({email: target.value})
                    }}/>
                </div>
              </div>
            </div>
            <p className="submit">
              <Link to={''} className="btn btn-tour" disabled={!(name && place && hotelStar && mobile && address && peopleCount && dateStart && dateEnd)} onClick={this.insertTeamBuilding.bind(this)}>Gửi yêu cầu</Link>
            </p>
          </div>
        </div>
      </div>
    )
  }
}

const ADVERTISEMENT_QUERY = gql `
    query advertisements($type: String) {
        advertisements(type: $type) {
          _id
          name
          title
          image {
            _id
            file
          }
          type
          createdAt
          createdBy {
            _id
            username
          }
          isShow
        }
}`

const CHANGE_PASSWORD = gql`
  mutation insertTeamBuildings($info: String) {
    insertTeamBuildings(info: $info)
  }
`;
export default compose(
  graphql(ADVERTISEMENT_QUERY, {
    options: () => ({
      variables: {
        type: 'teamBuilding'
      },
      fetchPolicy: 'cache-and-network'
    })
  }),
  graphql(CHANGE_PASSWORD, {
    props:({mutate})=>({
        insertTeamBuildings : (info) => mutate({variables:{info}})
    })
  })
)(TeamBuilding);
