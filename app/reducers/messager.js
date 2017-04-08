const messager = (state = {}, action) => {
  switch (action.type) {
    case 'SENDMESSAGE':
      return action.payload;
    default:
      return state;
  }
}

export default messager
