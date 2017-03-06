const account = (state = {}, action) => {
  switch (action.type) {
    case 'REGISTER':
      return action.payload;

    case 'AUTHENTICATE':
      //Meteor.call('updateUser', action.userCode);
      return 'authenticated'

    case 'LOGIN':
      return action.payload;

    case 'LOGINFB':
      return action.payload;

    case 'LOGINGG':
      return action.payload;

    case 'LOGOUT':
      return action.payload;

    default:
      return state;
  }
}

export default account
