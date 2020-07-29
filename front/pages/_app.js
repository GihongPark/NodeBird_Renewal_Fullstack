// 페이지들의 공통적이 작업 처리
import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import 'antd/dist/antd.css';

import withReduxSaga from 'next-redux-saga';
import wrapper from '../store/configureStore';

const App = ({ Component }) => (
  // next 6버전 이후로는
  // 리덕스 사용시 알아서 provider로 감싸주기 때문에 감싸줄 필요없음
  <>
    <Head>
      <title>NodeBird</title>
    </Head>
    <Component />
  </>
);

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(withReduxSaga(App));
