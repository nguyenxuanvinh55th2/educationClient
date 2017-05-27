import React from 'react';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';

import TextField from 'material-ui/TextField';
import Header from './Header.jsx';

export default class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      height: window.innerHeight
    }
  }
  render() {
    let imgUrlTop = 'https://i1249.photobucket.com/albums/hh508/nguyenxuanvinhict/home-page_01_zpsty0reykt.png';
    let imgUrlCenter = 'https://i1249.photobucket.com/albums/hh508/nguyenxuanvinhict/home-page_15_zpsjp7fq1qu.png';
    return(
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <Header {...this.props}/>
        <div style={{flexDirection:'column', width:'auto'}}>
          <div style={{display: 'flex',flexDirection: 'column', alignItems: 'center',background: 'url(' + imgUrlTop + ') no-repeat', backgroundSize: 'cover', height: this.state.height - 65, paddingTop: 10}}>
            <div style={{paddingBottom: 60}}>
              <img src="https://i1249.photobucket.com/albums/hh508/nguyenxuanvinhict/text_zpsumkavrgr.png" className="img-responsive" style={{maxHeight: this.state.height - 180}} />
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <input type="text" style={{background: 'none', borderRadius: 25, color: 'white', width: 250, height: 50, textAlign: 'center'}} placeholder="NHẬP MÃ CODE" />
                <button type="button" className="btn" style={{backgroundColor: '#35bcbf', borderRadius: 25, width: 250, height: 45, color: 'white', marginTop: 15}}>THAM GIA THI</button>
              </div>
            </div>
          </div>
          <div  className="row" style={{margin: 0,padding: 50}}>
            <div className="col-sm-12 col-md-6 col-lg-6">
              <h2>TUIELEARNING dành cho những ai?</h2>
              <p style={{paddingRight: 50}}>
                - Đội ngủ giáo viên tham gia giảng dạy và trao đổi học tập với sinh viên một cách đơn giản, thuận tiện.
              </p>
              <p>
                - Sinh viên được học tập trong môi trường chủ động.
              </p>
              <p>
                - Một nhóm sinh viên có thể trao đổi việc học và thi với nhau.
              </p>
              <p>
                - Tất cả sinh viên có thể tham gian các trò chơi, trả lời câu hỏi một cách vui nhộn, vừa học vừa chơi.
              </p>
              <p>
                Phụ huynh có thể theo dõi việc học tập của con em mình
              </p>
            </div>
            <div className="col-sm-12 col-md-6 col-lg-6">
              <img src="https://i1249.photobucket.com/albums/hh508/nguyenxuanvinhict/anh1_zpsgftsjtdy.png" className="img-responsive" />
              <img src="https://i1249.photobucket.com/albums/hh508/nguyenxuanvinhict/anh2New_zpsp9haf4py.png" className="img-responsive" />
            </div>
          </div>
          <div className="row" style={{margin: 40}}>
            <div className="col-sm-12 col-md-4 col-lg-4">
              <div className="row">
                <div className="col-sm-2">
                  <span className="glyphicon glyphicon-home pull-left" style={{fontSize: 50}}>
                  </span>
                </div>
                <div className="col-sm-6">
                  <p>
                    - Tính năng đơn giản
                  </p>
                  <p>
                    - Thích hợp cho mọi đối tượng sử dụng
                  </p>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-4 col-lg-4">
              <div className="row">
                <div className="col-sm-2">
                  <span  className="glyphicon glyphicon-ok pull-left" style={{fontSize: 50}}>
                  </span>
                </div>
                <div className="col-sm-6">
                  <p>
                    - Vừa học vừa chơi.
                  </p>
                  <p>
                    - Học ở bất cứ đâu chỉ cần kết nối internet.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-4 col-lg-4">
              <div className="row">
                <div className="col-sm-2 ">
                  <span className="glyphicon glyphicon-cog pull-left" style={{fontSize: 50}}>
                  </span>
                </div>
                <div className="col-sm-6">
                  <p>
                    - Sử dụng mà không cần cài đặt.
                  </p>
                  <p>
                    - Giao diện dễ sử dụng.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div  className="row" style={{margin: 0,padding: 50}}>
            <div className="col-sm-12 col-md-6 col-lg-6">
              <img src="https://i1249.photobucket.com/albums/hh508/nguyenxuanvinhict/anh3_zpsksmg5fvi.png" className="img-responsive" />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-6">
              <h3>Rèn luyện tính tự lập cho sinh viên</h3>
              <p style={{paddingRight: 50}}>
                Sinh viên có thể quản lý thời gian học tập một cách chủ động bằng cách lập thời gian biểu cho từng bài học hoặc bài tập của minh.
              </p>
              <p style={{paddingRight: 50}}>
                Chương trình ôn luyện phù hợp với nhiều mức học đối với mỗi sinh viên khác nhau.
              </p>
            </div>
          </div>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', background: 'url(' + imgUrlCenter + ') no-repeat', backgroundSize: 'cover', minHeight: 454}}>
            <div className="col-sm-12 col-md-7 col-lg-5" style={{flex: 'left',color: 'white'}}>
              <div style={{padding: 50, marginRight: 20, backgroundColor: 'rgba(12,0,0,0.5)'}}>
                <p>Tính năng đơn giản, thích hợp cho mọi đối tượng sử dụng</p>
                <p>Vừa học vừa chơi, học ở bất cứ đâu chỉ cần laptop kết nối internet</p>
                <p>Sử dụng mà không cần cài đặt, giao diện dễ sử dụng</p>
                <p>Quản lý việc học tập một cách đơn giản và hiệu quả</p>
                <p>Đánh giá khả năng học tập của sinh viên một cách đơn giản và nhanh chóng</p>
                <p>Phụ huynh có thể theo dõi việc học tập của con em mình</p>
              </div>
            </div>
          </div>
          <div className="row" style={{margin: 0}}>
            <div className="col-sm-2 col-md-5 col-lg-6">
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                  <div className="col-sm-6" style={{height: 100, width: 120, backgroundColor: 'blue', margin: 10}}>

                  </div>
                  <div className="col-sm-6" style={{height: 100, width: 120, backgroundColor: 'red', margin: 10}}>

                  </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                  <div className="col-sm-6" style={{height: 100, width: 120, backgroundColor: 'blue', margin: 10}}>

                  </div>
                  <div className="col-sm-6" style={{height: 100, width: 120, backgroundColor: 'red', margin: 10}}>

                  </div>
                </div>
            </div>
            <div className="col-sm-10 col-md-7 col-lg-4">
              <h2 style={{textAlign: 'center'}}>Nguyễn Xuân Vinh</h2>
              <p>Là một developer tôi mong muốn tạo ra một sản phẩm có ích đối với bản thân tôi khi đang ngồi trên ghế nhà trương cũng như các bạn sinh viên có thể cảm thấy hứng thú hơn đối với việc học ở trên lới và trao đổi nhiều hơn đối với
              giáo viên để tăng thêm nhiều kiến thức hơn việc học thụ động trên lớp</p>
            </div>
          </div>
          <div className="row" style={{margin: 0, backgroundColor: '#2b3a41', color: 'white', padding: 15}}>
            <div className="col-sm-12 col-md-5 col-lg-4 col-md-offset-1 col-lg-offset-1" style={{flexDirection: 'column', alignItems: 'center'}}>
              <img src="https://i1249.photobucket.com/albums/hh508/nguyenxuanvinhict/logo_zps0osdqorj.png" alt="Dispute Bills" style={{height: 40}} />
              <div>
                <p>LIÊN HỆ</p>
                <p>Tuielearning.com.vn <span className="glyphicon glyphicon-home pull-left" style={{paddingRight: 10, top: 3}}></span></p>
                <p>0166xxxx770 <span className="glyphicon glyphicon-earphone pull-left" style={{paddingRight: 10, top: 3}}></span></p>
                <p>tuielearning@gmail.com <span className="glyphicon glyphicon-envelope pull-left" style={{paddingRight: 10, top: 3}}></span></p>
                <p>Nha Trang, Khánh Hòa <span className="glyphicon glyphicon-map-marker pull-left" style={{paddingRight: 10, top: 3}}></span></p>
              </div>
            </div>
            <div className="col-sm-12 col-md-6 col-lg-7" style={{border: '2px solid white', padding: 30}}>
              <h3>GỬI Ý KIẾN ĐÓNG GÓP</h3>
              <div style={{flexDirection: 'column'}}>
                <TextField fullWidth={true} inputStyle={{color: 'white'}} hintStyle={{color: 'white'}}
                  hintText="Họ tên" />
                <TextField fullWidth={true} inputStyle={{color: 'white'}} hintStyle={{color: 'white'}}
                  hintText="Địa chỉ email" />
                <TextField fullWidth={true} inputStyle={{color: 'white'}} hintStyle={{color: 'white'}}
                  hintText="Tiêu đề" />
                <TextField fullWidth={true} inputStyle={{color: 'white'}} hintStyle={{color: 'white'}}
                  hintText="Nội dung đóng góp" />
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                  <button type="button" className="btn btn-default">
                    <span className="glyphicon glyphicon-send pull-right" style={{paddingLeft: 5, top: 3}}></span> Gửi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
