import { createAction, handleAction, handleActions } from 'redux-actions';
import { browserHistory } from 'react-router'

import { asteroid }  from '../asteroid.js'

export function loginCommand(user){
  console.log(user);
    return {
        type: 'LOGIN_COMMAND',
        user,
    }
}

//action xử lý việc tìm kiếm của user
//---------------------------------------------------------------------------------//
export const search = createAction('SEARCH', (keyWord) => {
  return keyWord
})


export const logout = createAction('LOGOUT', () => {
  localStorage.removeItem("userInfo");
  return {}
});

//action xử lý việc thêm topic của user
//---------------------------------------------------------------------------------//
export const addTopic = createAction('ADD_TOPIC', (courseId,title, dateStart, dateEnd, main,type,files) => {
  let topic ={
    type: type,
    courseId:courseId,
    owner:asteroid.userId(),
    title:title,
    main:main,
    files:files,
    dateStart: dateStart,
    dateEnd: dateEnd
  };
  console.log(topic);
return topic;
});

//reply topic
export const replytopic = createAction('REPLY_TOPIC', (topicId,message,files) => {
let ob ={
  topicId:topicId,
  userId:asteroid.userId(),
  content:message,
  files:files
}
return ob;
});

//add forum
export const addForum = createAction('ADD_CHAT_FORUM', (subjectId,main,files) => {
  let member ={
    subjectId:subjectId,
    owner :asteroid.userId(),
    main:main,
    files:files,
    memberReply:[]
  };
  return member;
});


export const replyforum = createAction('REPLY_FORUM', (forumId,message,files) => {
let ob ={
  forumId:forumId,
  userId:asteroid.userId(),
  message:message,
  files:files
}
return ob;
});

//action xử lý việc gửi tin nhắn trong chat room của user
//---------------------------------------------------------------------------------//
export const sendMessage = createAction('SENDMESSAGE', (index, userName, userImage, message, date, userId) => {
content = {
  index: index,
  userName: userName,
  userImage: userImage,
  message: message,
  date: date,
  userId: userId
}
return content
})


export const changeMission = createAction('CHANGEMESSION', (value) => {
return value
})

//action xử lý việc chuyển step của trang register
//---------------------------------------------------------------------------------//
export const changeRegister = createAction('REGISTERSTATE', (step) => {
step ++;
return step
})

//them bai tap
export const addAssignment = createAction('ADDASSIGNMENT',(subjectId,owner,title,main,files) =>{
let ob ={
  subjectId:subjectId,
  assign:{
    owner:owner,
    title:title,
    main:main,
    files:files
  }
}
return ob;
})
