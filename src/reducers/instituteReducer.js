const initialState = {
    institute: null,
  };
  
  const instituteReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_INSTITUTE_DETAILS':
        return {
          ...state,
          institute: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default instituteReducer;
  