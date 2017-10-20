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
      height: window.innerHeight,
      pictureSelect: 0
    }
  }
  render() {
    let imgUrlTop = 'https://sv1.upsieutoc.com/2017/10/12/home-page_01.png';
    let imgUrlCenter = 'https://sv1.upsieutoc.com/2017/10/12/home-page_15.png';
    return(
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div style={{height: 40}}>
          <Header {...this.props}/>
        </div>
        <div style={{flexDirection:'column', width:'auto', marginTop: 30}}>
          <div style={{display: 'flex',flexDirection: 'column', alignItems: 'center',background: 'url(' + imgUrlTop + ') no-repeat', backgroundSize: 'cover', height: this.state.height - 65, paddingTop: 10}}>
            <div style={{paddingBottom: 60, marginTop: 40, }}>
              <img src="https://sv1.upsieutoc.com/2017/10/12/sologan.png" className="img-responsive" style={{maxHeight: this.state.height - 180}} />
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <input type="text" style={{background: 'none', borderRadius: 25, color: 'white', width: 250, height: 50, textAlign: 'center'}} placeholder="NHẬP MÃ CODE" />
                <button type="button" className="btn" style={{backgroundColor: '#35bcbf', borderRadius: 25, width: 250, height: 45, color: 'white', marginTop: 15}}>THAM GIA THI</button>
              </div>
            </div>
          </div>
          <div  className="row" style={{margin: '50px 100px'}}>
            <div className="col-sm-12 col-md-4 col-lg-5" style={{ fontSize: 15, lineHeight: '40px'}}>
              <h2>TUIELEARNING DÀNH CHO NHỮNG AI?</h2>
              <p style={{paddingRight: 50}}>
                - Đội ngũ giáo viên tham gia giảng dạy và trao đổi học tập với sinh viên một cách đơn giản, thuận tiện.
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
              <img src="https://sv1.upsieutoc.com/2017/10/12/anh1.png" className="img-responsive" style={{height: 200}}/>
              <img src="https://sv1.upsieutoc.com/2017/10/12/anh2.png" className="img-responsive" style={{marginTop: 15, height: 200}}/>
            </div>
          </div>
          <div className="row" style={{margin: 40}}>
            <div className="col-sm-12 col-md-4 col-lg-4">
              <div className="row">
                <div className="col-sm-2">
                  <span className="glyphicon glyphicon-home pull-left" style={{fontSize: 40}}>
                  </span>
                </div>
                <div className="col-sm-6" style={{ fontSize:  15}}>
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
                  <span  className="glyphicon glyphicon-ok pull-left" style={{fontSize: 40}}>
                  </span>
                </div>
                <div className="col-sm-6" style={{ fontSize:  15}}>
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
                  <span className="glyphicon glyphicon-cog pull-left" style={{fontSize: 40}}>
                  </span>
                </div>
                <div className="col-sm-6" style={{ fontSize:  15}}>
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
              <img src="https://sv1.upsieutoc.com/2017/10/12/anh3.png" className="img-responsive" style={{height: 230, width: 420}}/>
            </div>
            <div className="col-sm-12 col-md-6 col-lg-6">
              <h2>Rèn luyện tính tự lập cho sinh viên</h2>
              <p style={{paddingRight: 50, fontSize: 17}}>
                Sinh viên có thể quản lý thời gian học tập một cách chủ động bằng cách lập thời gian biểu cho từng bài học hoặc bài tập của minh.
              </p>
              <p style={{paddingRight: 50, fontSize: 17}}>
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
                  <div className="col-sm-6" style={{height: 100, width: 120, backgroundColor: 'blue', margin: 10, paddingLeft: 0, paddingRight: 0}}>
                    <img src="https://scontent.fdad2-1.fna.fbcdn.net/v/t1.0-9/18301853_474450599568708_293956610097321619_n.jpg?oh=5a1d51e8ef46e79681bff3d75ac1cccd&oe=599FB7A4" style={{height: 100, width: 120}} onClick={() => this.setState({pictureSelect: 0})}></img>
                  </div>
                  <div className="col-sm-6" style={{height: 100, width: 120, backgroundColor: 'red', margin: 10, paddingLeft: 0, paddingRight: 0}}>
                    <img src="https://scontent.fdad2-1.fna.fbcdn.net/v/t1.0-1/18301520_1895134390728456_2770252754714215340_n.jpg?oh=f2b8dfcab5fa2c3d7c63bf8276f18c6a&oe=59B20E53" style={{height: 100, width: 120}} onClick={() => this.setState({pictureSelect: 1})}></img>
                  </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                  <div className="col-sm-6" style={{height: 100, width: 120, backgroundColor: 'blue', margin: 10, paddingLeft: 0, paddingRight: 0}}>
                    <img src="https://scontent.fdad2-1.fna.fbcdn.net/v/t1.0-9/13619965_1737051969868065_1863773849078891223_n.jpg?oh=47e1f56f1215e278ed569abef416ea62&oe=59E2156B" style={{height: 100, width: 120}} onClick={() => this.setState({pictureSelect: 2})}></img>
                  </div>
                  <div className="col-sm-6" style={{height: 100, width: 120, backgroundColor: 'red', margin: 10, paddingLeft: 0, paddingRight: 0}}>
                    <img src="https://scontent.fdad2-1.fna.fbcdn.net/v/t1.0-9/18268374_474450206235414_2328779912435889820_n.jpg?oh=e53992444a19fd253b28240c6c58d011&oe=59AE8B94" style={{height: 100, width: 120}} onClick={() => this.setState({pictureSelect: 3})}></img>
                  </div>
                </div>
            </div>
            {
              this.state.pictureSelect == 0 ?
              <div className="col-sm-10 col-md-7 col-lg-4">
                <h2 style={{textAlign: 'center'}}>Nguyễn Xuân Vinh</h2>
                <p style={{fontSize: 15}}>Là một developer tôi mong muốn tạo ra một sản phẩm có ích đối với bản thân tôi khi đang ngồi trên ghế nhà trương cũng như các bạn sinh viên có thể cảm thấy hứng thú hơn đối với việc học ở trên lớp và trao đổi nhiều hơn đối với
                giáo viên để tăng thêm nhiều kiến thức hơn việc học thụ động trên lớp</p>
              </div> :
              this.state. pictureSelect == 1 ?
              <div className="col-sm-10 col-md-7 col-lg-4">
                <h2 style={{textAlign: 'center'}}>Nguyễn Thị Bích Thuận</h2>
                <p style={{fontSize: 15}}>Là một developer tôi mong muốn tạo ra một sản phẩm có ích đối với bản thân tôi khi đang ngồi trên ghế nhà trương cũng như các bạn sinh viên có thể cảm thấy hứng thú hơn đối với việc học ở trên lớp và trao đổi nhiều hơn đối với
                giáo viên để tăng thêm nhiều kiến thức hơn việc học thụ động trên lớp</p>
              </div> :
              this.state.pictureSelect == 2 ?
              <div className="col-sm-10 col-md-7 col-lg-4">
                <h2 style={{textAlign: 'center'}}>Huỳnh Ngọc Sáng</h2>
                <p style={{fontSize: 15}}>Là một developer tôi mong muốn tạo ra một sản phẩm có ích đối với bản thân tôi khi đang ngồi trên ghế nhà trương cũng như các bạn sinh viên có thể cảm thấy hứng thú hơn đối với việc học ở trên lớp và trao đổi nhiều hơn đối với
                giáo viên để tăng thêm nhiều kiến thức hơn việc học thụ động trên lớp</p>
              </div>
              :
              <div className="col-sm-10 col-md-7 col-lg-4">
                <h2 style={{textAlign: 'center'}}>Đội ngũ phát triển</h2>
                <p style={{fontSize: 15}}>Là một đội ngũ phát triển phần mềm, chúng tôi mong muốn tạo ra một sản phẩm có ích đối với các sinh viên khi đang ngồi trên ghế nhà trương cũng như các bạn sinh viên có thể cảm thấy hứng thú hơn đối với việc học ở trên lớp và trao đổi nhiều hơn đối với
                giáo viên để tăng thêm nhiều kiến thức hơn việc học thụ động trên lớp</p>
              </div>
            }
          </div>
          <div className="row" style={{margin: 0, backgroundColor: '#2b3a41', color: 'white', padding: 15}}>
            <div className="col-sm-12 col-md-5 col-lg-4 col-md-offset-1 col-lg-offset-1" style={{flexDirection: 'column', alignItems: 'center'}}>
              <img src="https://sv1.upsieutoc.com/2017/10/12/logofn1.png" alt="Dispute Bills" style={{height: 40}} />
              <div style={{ fontSize: 15 }}>
                <h2>LIÊN HỆ</h2>
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
                  <button type="button" className="btn btn-default" style={{width: 80}}>
                    <span className="glyphicon glyphicon-send pull-right" style={{fontSize: 24}}></span> Gửi
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
