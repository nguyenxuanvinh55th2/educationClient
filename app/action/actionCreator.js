import { createAction, handleAction, handleActions } from 'redux-actions';
import { browserHistory } from 'react-router'

import { asteroid }  from '../asteroid.js'

//action xử lý việc đăng nhập của user thông qua email và password
//---------------------------------------------------------------------------------//
export const login = createAction('LOGIN', (userInfo) => {
// asteroid.loginWithPassword({email: email, password: password}).then(result => {
//     let localToken = localStorage.getItem("ws://localhost:3000/websocket__login_token__");
//     if(localToken){
//       localStorage.setItem("userInfo",localToken);
//     }
//   })
//   .catch(error => {
//       console.log("Error");
//       console.error(error);
//   });
// if(localStorage.getItem("userInfo")) {
//   return localStorage.getItem("userInfo");
// } else {
//     return {}
//   }
return userInfo;
});

//action xử lý việc đăng nhập của user thông qua facebook
//---------------------------------------------------------------------------------//
export const loginFB = createAction('LOGINFB', (userInfo) => {
  asteroid.call("loginFbUser", userInfo).then(result => {
        console.log(result);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
    })
    .catch(error => {
        console.log("Error");
        console.error(error);
    });
  return userInfo;
});

//action xử lý việc đăng nhập của user thông qua google
//---------------------------------------------------------------------------------//
export const loginGG = createAction('LOGINGG', (userInfo) => {
  asteroid.call("loginGgUser", userInfo).then(result => {
        console.log(result);
        localStorage.setItem("userInfo", JSON.stringify(result));
    })
    .catch(error => {
        console.log("Error");
        console.error(error);
    });
  return userInfo;
});

//action xử lý việc tìm kiếm của user
//---------------------------------------------------------------------------------//
export const search = createAction('SEARCH', (keyWord) => {
return keyWord
})


export const logout = createAction('LOGOUT', () => {
  localStorage.removeItem("userInfo");
  return {}
});
