import { configureStore } from '@reduxjs/toolkit';
import instituteReducer from '../reducers/instituteReducer';

const store = configureStore({
  reducer: {
    institute: instituteReducer,
  },
});

export default store;
