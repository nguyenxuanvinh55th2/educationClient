import React from 'react';
import {Meteor} from 'meteor/meteor';
import {browserHistory} from 'react-router';
import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';
import Cleave from 'cleave.js/react';
import Dialog from 'material-ui/Dialog';
import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import Select, {Creatable} from 'react-select';
import 'react-select/dist/react-select.css';
import QuillEditorTour from '../editor/TourEditor.jsx';
import {handleChangeSlug} from '../tool/slug.js';
import CustomDatePicker from '../tool/CustomDatePicker.jsx';
import 'react-select/dist/react-select.css';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
class TourForm extends React.Component {
  constructor(props) {
    super(props)
    this.handleResize = this.handleResize.bind(this);
    this.state = {
      height: window.innerHeight,
      isDisableButton: false,
      loading: true,
      searchValue: '',
      data: {
        code: '',
        name: '',
        title: '',
        ceoContent: '',
        type: {},
        isDomestic: true,
        regions: [],
        trips: [],
        holidayDestinations: [],
        countAccess: 0,
        dateStart: moment().valueOf(),
        price: '',
        isSohot: false,
        isPromotion: false,
        isBooktour: false,
        saleOff: '',
        slug: '',
        active: true,
        isChildrent: true,
        tour: {
          _id: '', code: '', name: ''
        },
        detail: {
          program: '',
          priceTag: '',
          hotel: '',
          menu: '',
          terms: ''
        },
        startDate: moment().startOf('month').valueOf(),
        endDate: moment().endOf('month').valueOf()
      },
      image: {}
    }
  }
  handleResize(e) {
    this.setState({height: window.innerHeight});
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.data.tour) {
      let tour = __.cloneDeep(nextProps.data.tour);
      let image = tour.images && tour.images[0]
        ? tour.images[0]
        : {}
      this.setState({data: tour, image: image, loading: false, searchValue: tour.tour.code});
    }
  }
  bpmChangeRange(value){
    this.setState((prevState) => {
      prevState.data.startDate = value.startDate;
      prevState.data.endDate = value.endDate;
      return prevState;
    })
  }
  handleAddImage(files) {
    let that = this;
    if (files[0]) {
      let file = files[0];
      if (file.size <= 1024 * 1000 * 2) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e) {
          if (e.target.result) {
            that.setState({
              image: {
                file: e.target.result,
                fileName: file.name,
                type: file.type
              }
            });
          }
        };
        reader.onerror = function(error) {
          console.log('Error: ', error);
        };
      } else {
        alert('File nhỏ hơn 2MB!');
      }
    }
  }
  handleSave(type) {
    let {data} = this.state;
    data.price = data.price
      ? parseInt(data.price)
      : 0;
    data.saleOff = data.saleOff
      ? parseInt(data.saleOff)
      : 0;
    let info = {
      data: data,
      images: [this.state.image]
    };
    data.images = [];
    if (this.props.params._id) {
      if (this.props.updateTour) {
        this.props.updateTour(Meteor.userId(), this.props.params._id, JSON.stringify(info)).then(({data}) => {
          this.props.addNotificationMute({fetchData: true, message: 'Cập nhật thành công', level: 'success'});
          browserHistory.push('/tours');
        }).catch((error) => {
          console.log(error);
          this.props.addNotificationMute({fetchData: true, message: 'Cập nhật hàng thất bại', level: 'error'});
        })
      }
    } else {
      if (this.props.insertTour) {
        this.props.insertTour(Meteor.userId(), JSON.stringify(info)).then(({data}) => {
          if (data.insertTour) {
            this.props.addNotificationMute({fetchData: true, message: 'Thêm thành công', level: 'success'});
            if (type) {
              this.setState({
                disabledButton: false,
                data: {
                  code: '',
                  name: '',
                  title: '',
                  ceoContent: '',
                  type: {},
                  regions: [],
                  holidayDestinations: [],
                  trips: [],
                  countAccess: 0,
                  dateStart: moment().valueOf(),
                  price: '',
                  isSohot: false,
                  isPromotion: false,
                  isBooktour: false,
                  saleOff: '',
                  slug: '',
                  active: true,
                  isChildrent: true,
                  startDate: moment().startOf('month').valueOf(),
                  endDate: moment().endOf('month').valueOf(),
                  detail: {
                    program: '',
                    priceTag: '',
                    hotel: '',
                    menu: '',
                    terms: ''
                  }
                }
              });
              document.getElementById('editor').firstChild.innerHTML = ''
            } else {
              browserHistory.push('/tours');
            }
          }
        }).catch((error) => {
          console.log(error);
          this.props.addNotificationMute({fetchData: true, message: 'Thêm thất bại', level: 'error'});
        })
      }
    }
  }
  handleDisable() {
    let flat = false;
    let {data} = this.state;
    if (!data.code || !data.name || !data.ceoContent || !data.type._id || !data.slug || !data.title || !data.price) {
      return true;
    }
    return flat;
  }
  render() {
    let {data} = this.state;
    if (!this.props.data.classifies) {
      return (
        <div className="loading">
          <i className="fa fa-spinner fa-spin" style={{
            fontSize: 50
          }}></i>
        </div>
      )
    } else {
      let types = __.filter(this.props.data.classifies, {isTour: true});
      let regions = __.filter(this.props.data.classifies, {isRegion: true});
      let locations = __.filter(this.props.data.classifies, {isLocation: true});
      let trips = __.filter(this.props.data.classifies, {isTrip: true});
      let time = {
        startDate: data.startDate ? data.startDate : moment().startOf('month').valueOf(),
        endDate: data.endDate ? data.endDate : moment().endOf('month').valueOf()
      }
      return (
        <div className="column">
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
                <a onClick={() => browserHistory.push('/tours')}>Quản lý tours</a>
              </li>
            </ol>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: 5
            }}>
              {!this.props.params._id && <button type="button" className="btn btn-primary" disabled={this.handleDisable()} onClick={() => this.handleSave(true)}>Lưu và khởi tạo</button>
}
              <button type="button" disabled={this.handleDisable()} className="btn btn-primary" style={{
                marginLeft: 10
              }} onClick={() => {
                this.handleSave()
              }}>Lưu</button>
              <button type="button" className="btn btn-danger" style={{
                margin: '0 10px'
              }} onClick={() => browserHistory.push('/tours')}>Hủy</button>
            </div>
          </div>
          <div className="row" style={{
            padding: 10,
            backgroundColor: "rgb(204, 204, 204)",
            margin: '5px 0px 0px 0px'
          }}>
            <div className="col-sm-12 col-md-6" style={{
              paddingRight: 0
            }}>
              <div className="column" style={{
                backgroundColor: 'white',
                height: this.state.height - 152,
                overflow: 'auto'
              }}>
                <form className="form-horizontal" style={{
                  padding: '2px 25px 2px 25px'
                }}>
                  <div className="form-group">
                    <label>Mã tour(*)</label>
                    <AutocompleteStockModel
                      ref={ref=>this.comboboxStock=ref}
                      value={data.tour && data.tour._id ? data.tour._id : ''}
                      valueKey="_id"
                      labelKey="name"
                      cache={false}
                      searchValue={this.state.searchValue || ''}
                      placeholder="Gõ mã tour hoặc tên tour để tìm kiếm"
                      onInputChange={(searchText) => {
                        this.setState({searchValue: searchText});
                      }}
                      onChange={(st) => {
                        if(st && st._id){
                          this.setState((prevState) => {
                            prevState.data.tour = {
                              _id: st._id, code: st.code, name: st.name
                            }
                            prevState.data.regions = st.regions;
                            prevState.data.holidayDestinations = st.holidayDestinations
                            prevState.data.code = st.code;
                            prevState.data.name = st.name;
                            prevState.data.title = st.title;
                            let slug = st.name + (prevState.data.type && prevState.data.type.name ? ` ${prevState.data.type.name}` : '')
                            prevState.data.slug = handleChangeSlug(slug);
                            return prevState;
                          })
                        }
                        else {
                          this.setState((prevState) => {
                            prevState.data.tour = {
                              _id: '', code: '', name: ''
                            }
                            return prevState;
                          })
                        }
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Mã tour(*)</label>
                    <input type="text" className="form-control" disabled={true} value={data.code} onChange={({target}) => {
                      this.setState((prevState) => {
                        prevState.data.code = target.value;
                        return prevState;
                      })
                    }}/>
                  </div>
                  <div className="form-group">
                    <label>Tên tour(*)</label>
                    <input type="text" className="form-control" disabled={true} value={data.name} onChange={({target}) => {
                      this.setState((prevState) => {
                        prevState.data.name = target.value;
                        prevState.data.slug = handleChangeSlug(target.value);
                        return prevState;
                      })
                    }}/>
                  </div>
                  <div className="form-group">
                    <label>Tiêu đề(*)</label>
                    <input type="text" className="form-control" value={data.title} onChange={({target}) => {
                      this.setState((prevState) => {
                        prevState.data.title = target.value;
                        return prevState;
                      })
                    }}/>
                  </div>
                  <div className="form-group">
                    <label>Loại hình tour(*)</label>
                    <Select name="form-field-name" value={data.type && data.type._id
                      ? data.type._id
                      : ''} valueKey="_id" labelKey="name" placeholder="Chọn loại hình tour" options={types} onChange={(value) => {
                      this.setState((prevState) => {
                        prevState.data.type = value;
                        let slug = (prevState.data.tour && prevState.data.tour.name ? prevState.data.tour.name : '') + (value && value.name ? ` ${value.name}` : '')
                        prevState.data.slug = handleChangeSlug(slug);
                        return prevState;
                      })
                    }}/>
                  </div>
                  <div className="form-group">
                    <label>Loại hành trình(*)</label>
                    <Select multi={true} value={data.trips} valueKey="_id" labelKey="name" placeholder="Chọn loại hành trình" options={trips} onChange={(value) => {
                      this.setState((prevState) => {
                        prevState.data.trips = value;
                        return prevState;
                      })
                    }}/>
                  </div>
                  {/* <div className="form-group">
                    <label>Địa điểm</label>
                    <Select multi={true} value={data.holidayDestinations} valueKey="_id" labelKey="name" placeholder="Chọn địa điểm" options={locations} onChange={(value) => {
                      this.setState((prevState) => {
                        prevState.data.holidayDestinations = value;
                        return prevState;
                      })
                    }}/>
                  </div> */}
                  <div className="form-group">
                    <label>Mô tả(CEO) (*)</label>
                    <textarea cols="3" type="text" className="form-control" value={data.ceoContent} onChange={({target}) => {
                      this.setState((prevState) => {
                        prevState.data.ceoContent = target.value;
                        return prevState;
                      })
                    }}/>
                  </div>
                  <div className="form-group">
                    <label>Thời gian Tour</label>
                    <CustomDatePicker bpm={time} bpmChangeRange={this.bpmChangeRange.bind(this)} handleChange={() => {}}/>
                  </div>
                </form>
              </div>
            </div>

            <div className="col-sm-12 col-md-6" style={{
              paddingRight: 0
            }}>
              <div className="column" style={{
                backgroundColor: 'white',
                height: this.state.height - 152,
                overflow: 'auto'
              }}>
                <form className="form-horizontal" style={{
                  padding: '2px 25px 2px 25px'
                }}>
                  <div className="form-group" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start'
                  }}>
                    <div className="checkbox" style={{
                      width: '50%'
                    }}>
                      <label><input type="checkbox" checked={data.isSohot} onChange={({target}) => {
                        this.setState((prevState) => {
                          prevState.data.isSohot = !prevState.data.isSohot;
                          return prevState;
                        });
                      }}/>Tour đang hot</label>
                    </div>
                    <div className="checkbox" style={{
                      width: '50%'
                    }}>
                      <label>
                        <input type="checkbox" checked={data.isBooktour} onChange={({target}) => {
                          this.setState((prevState) => {
                            prevState.data.isBooktour = !prevState.data.isBooktour;
                            return prevState;
                          });
                        }}/>Book tour
                      </label>
                    </div>
                    <div className="checkbox" style={{
                      width: '50%'
                    }}>
                      <label>
                        <input type="checkbox" checked={data.isPromotion} onChange={({target}) => {
                          this.setState((prevState) => {
                            prevState.data.isPromotion = !prevState.data.isPromotion;
                            return prevState;
                          });
                        }}/>Tour đang giảm giá
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Giá tour(*)</label>
                    <Cleave className="form-control" style={{
                      textAlign: 'right'
                    }} value={data.price} options={{
                      numeral: true,
                      numeralThousandsGroupStyle: 'thousand'
                    }} onFocus={({target}) => {
                      if (target.value === '0') {
                        target.value = ''
                      }
                    }} onChange={({target}) => {
                      this.setState((prevState) => {
                        prevState.data.price = target.rawValue;
                        return prevState;
                      });
                    }}/>
                  </div>
                  <div className="form-group">
                    <label>Giá giảm (số tiền giảm)</label>
                    <Cleave className="form-control" disabled={!data.isPromotion} style={{
                      textAlign: 'right'
                    }} value={data.saleOff} options={{
                      numeral: true,
                      numeralThousandsGroupStyle: 'thousand'
                    }} onFocus={({target}) => {
                      if (target.value === '0') {
                        target.value = ''
                      }
                    }} onChange={({target}) => {
                      this.setState((prevState) => {
                        prevState.data.saleOff = target.rawValue;
                        return prevState;
                      });
                    }}/>
                  </div>
                  <div className="form-group">
                    <label>Slug(CEO URL)(*)</label>
                    <input type="text" className="form-control" disabled={true} value={data.slug} onChange={({target}) => {
                      this.setState((prevState) => {
                        prevState.data.slug = target.value;
                        return prevState;
                      })
                    }}/>
                  </div>
                  <div className="form-group">
                    <label>Ảnh đại diện tour</label>
                    <input type="file" id="getDataImageProfile" accept="image/*" multiple={false} onChange={({target}) => this.handleAddImage(target.files)}/>
                  </div>
                  <div style={{
                    textAlign: 'center',
                    width: '40%'
                  }}>
                    <img className="img-responsive" style={{
                      maxWidth: '90%',
                      height: 150
                    }} onClick={() => this.setState({openDialog: true})} src={this.state.image.file
                      ? this.state.image.file
                      : "/imgs/photo_not_available.png"} alt=""/>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div style={{
            backgroundColor: "rgb(204, 204, 204)"
          }}>
            <div className="column" style={{
              backgroundColor: 'white',
              height: this.state.height - 152,
              overflow: 'auto',
              padding: '2px 25px 2px 25px'
            }}>
              <ul className="nav nav-tabs">
                <li className="active">
                  <a data-toggle="tab" href="#program">Chương trình</a>
                </li>
                <li>
                  <a data-toggle="tab" href="#priceTag">Bảng giá</a>
                </li>
                <li>
                  <a data-toggle="tab" href="#hotel">Khách sạn</a>
                </li>
                <li>
                  <a data-toggle="tab" href="#menu">Thực đơn</a>
                </li>
                <li>
                  <a data-toggle="tab" href="#terms">Điều khoản</a>
                </li>
              </ul>
              <div className="tab-content">
                <div id="program" className="tab-pane fade in active">
                  <QuillEditorTour keyValue={"program"} ref="program" height={window.innerHeight - 280} value={data.detail.program} getValue={(value) => {
                    this.setState((prevState) => {
                      prevState.data.detail.program = value;
                      return prevState;
                    });
                  }}/>
                </div>
                <div id="priceTag" className="tab-pane fade">
                  <QuillEditorTour keyValue={"priceTag"} ref="priceTag" height={window.innerHeight - 280} value={data.detail.priceTag} getValue={(value) => {
                    this.setState((prevState) => {
                      prevState.data.detail.priceTag = value;
                      return prevState;
                    });
                  }}/>
                </div>
                <div id="hotel" className="tab-pane fade">
                  <QuillEditorTour keyValue={"hotel"} ref="hotel" height={window.innerHeight - 280} value={data.detail.hotel} getValue={(value) => {
                    this.setState((prevState) => {
                      prevState.data.detail.hotel = value;
                      return prevState;
                    });
                  }}/>
                </div>
                <div id="menu" className="tab-pane fade">
                  <QuillEditorTour keyValue={"menu"} ref="menu" height={window.innerHeight - 280} value={data.detail.menu} getValue={(value) => {
                    this.setState((prevState) => {
                      prevState.data.detail.menu = value;
                      return prevState;
                    });
                  }}/>
                </div>
                <div id="terms" className="tab-pane fade">
                  <QuillEditorTour keyValue={"terms"} ref="terms" height={window.innerHeight - 280} value={data.detail.terms} getValue={(value) => {
                    this.setState((prevState) => {
                      prevState.data.detail.terms = value;
                      return prevState;
                    });
                  }}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}
const UPDATE_TOUR = gql `
  mutation updateTour($userId: String,$_id:String,$info:String){
    updateTour(userId: $userId,_id:$_id,info:$info)
  }
`;
const INSERT_TOUR = gql `
    mutation insertTour($userId: String!, $info: String!){
        insertTour(userId: $userId, info: $info)
}`

const QUERY = gql `
    query classifies($query: String, $_id: String){
      classifies(query: $query) {
        _id code name slug description isTour isLocation isRegion isTrip
      }
      tour(_id: $_id) {
        _id code name title slug isDomestic ceoContent countAccess dateStart isSohot isPromotion isBooktour price saleOff isChildrent isParent
        detail { program, priceTag, hotel, menu, terms } type { _id code name description } regions { _id code name}
        holidayDestinations { _id code name}
        trips {_id code name}
        startDate endDate tour {
          _id, code , name
        }  images {
          _id fileName
          file
        }
      }
}`
export default compose(graphql(QUERY, {
  options: (ownProps) => {
    let query = {};
    query = {
      active: true,
      $or:[{isTour: true}, {isTrip: true}]
    };
    return {
      variables: {
        _id: ownProps.params._id
          ? ownProps.params._id
          : '',
        query: JSON.stringify(query)
      },
      fetchPolicy: 'network-only'
    }
  }
}), graphql(INSERT_TOUR, {
  props: ({mutate}) => ({
    insertTour: (userId, info) => mutate({
      variables: {
        userId,
        info
      }
    })
  })
}), graphql(UPDATE_TOUR, {
  props: ({mutate}) => ({
    updateTour: (userId, _id, info) => mutate({
      variables: {
        userId,
        _id,
        info
      }
    })
  })
}))(TourForm);

const SEARCH_STOCKMODEL = gql`
    query getAllStockModelSearch($keyCode:String) {
      getAllStockModelSearch(keyCode: $keyCode){
        _id name code title regions { _id code name}   holidayDestinations { _id code name}
      }
    }
`;
const AutocompleteStockModel = graphql(SEARCH_STOCKMODEL, {
    withRef: true,
    options: ({searchValue}) => ({ variables: {keyCode: searchValue},   fetchPolicy: 'network-only' }),
    props: ({ ownProps, data: { loading, getAllStockModelSearch, refetch } }) => ({
        options: getAllStockModelSearch ? getAllStockModelSearch : []
    })
})(Select);
