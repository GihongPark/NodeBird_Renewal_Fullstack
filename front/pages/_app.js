// 페이지들의 공통적이 작업 처리
import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import 'antd/dist/antd.css';

const App = ({ Component }) => {
    return (
        <>
            <Head>
                <title>NodeBird</title>
            </Head>
            <Component />
        </>
    )
};

App.propTypes = {
    component: PropTypes.elementType.isRequired,
}

export default App;