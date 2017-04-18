function subjectClass(state = [], action) {
    switch (action.type) {
        case 'SUBJECT_CLASS_MUTATION':
            return Object.assign({}, state, action.detail);
        default:
            return state;
    }
}

export default subjectClass;
