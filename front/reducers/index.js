import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';

import user from './user';
import post from './post';

const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE: // next에서 페이지 열때 getServerSideProps 정보를 담아줌
      console.log('HYDRAYE', action);
      return action.payload;
    default: {
      const combinedReducer = combineReducers({
        user,
        post,
      });
      return combinedReducer(state, action);
    }
  }
};

export default rootReducer;
