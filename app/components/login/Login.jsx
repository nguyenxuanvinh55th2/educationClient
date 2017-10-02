import React from 'react';
import { Meteor } from 'meteor/meteor';
import { browserHistory, Link} from 'react-router';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
  }
  handleLogin(){
    Meteor.loginWithPassword(this.state.email, this.state.password, (err)=>{
      if(err){
        this.props.addNotificationMute({fetchData: true, message: 'Đăng nhập thất bại', level:'error'});
      }
      else {
        this.props.addNotificationMute({fetchData: true, message: 'Đăng nhập thành công', level:'success'});
        Meteor.call('sendNotification', {
          note: Meteor.user().username + ' ' + 'đăng nhập hệ thống',
          isManage: true
        }, (err, res) => {
          if (err) {
            alert(err);
          } else {
            // success
          }
        });
        browserHistory.push('/dashboard');
      }
    });
  }
  render(){
    return(
      <div className="login-page">
        <div className="login-area">
          <Link to={'/'}>
            <img src="/imgs/logo.png" alt="" />
          </Link>
          <form style={{marginTop: 20, padding: '26px 24px 46px'}}>
            <div className="form-group">
              <label>Tên đăng nhập</label>
              <div >
                <input type="text" className="form-control" value={this.state.email} onChange={({target}) => this.setState({email: target.value})}/>
              </div>
            </div>
            <div className="form-group">
              <label >Mật khẩu</label>
              <div>
                <input type="password" className="form-control" value={this.state.password} onChange={({target}) => this.setState({password: target.value})}/>
              </div>
            </div>
            <div className="form-group">
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <div className="checkbox">
                  <label><input type="checkbox" name="remember" />Ghi nhớ tôi</label>
                </div>
                  <button type="button" className="btn btn-primary" disabled={!this.state.email || !this.state.password} style={{height: 30, padding: '0 12px 2px'}}
                    onClick={() => this.handleLogin()}>Đăng nhập</button>
              </div>
            </div>
          </form>
          <p className="back-to-home-page"><Link to={'/'}>Quay trở lại trainghiemviet.com.vn</Link></p>
        </div>
      </div>
    )
  }
}
