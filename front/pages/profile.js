import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import { END } from 'redux-saga';
import axios from 'axios';
import useSWR from 'swr';

import AppLayout from '../components/AppLayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';
import { backUrl } from '../config/config';

const fetcher = (url) => axios.get(url, { withCredentials: true })
  .then((result) => result.data);

const Profile = () => {
  const { me } = useSelector((state) => state.user);
  const [followingsLimit, setFollowingsLimit] = useState(3);
  const [followersLimit, setFollowersLimit] = useState(3);

  // swr에서 3번째 인자로 데이터를 넣어 ssr로 사용 가능하다
  // const { data: followersData, error: followerError } = useSWR(`http://localhost:3065/user/followers?limit=${followersLimit}`, fetcher, { initialData });
  const { data: followersData, error: followerError } = useSWR(`${backUrl}/user/followers?limit=${followersLimit}`, fetcher);
  const { data: followingsData, error: followingError } = useSWR(`${backUrl}/user/followings?limit=${followingsLimit}`, fetcher);

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push('/');
    }
  }, [me && me.id]);

  if (!me) {
    return '내 정보 로딩 중..';
  }

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => prev + 3);
  }, []);
  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 3);
  }, []);

  // 리턴은 모든 훅스보다 나중에 와야함
  if (followerError || followingError) {
    console.error(followingError || followingError);
    return <div>팔로잉/팔로워 로딩 중 에러가 발생합니다.</div>;
  }

  return (
    <AppLayout>
      <NicknameEditForm />
      <FollowList header="팔로잉" data={followingsData} onClickMore={loadMoreFollowings} loading={!followingError && !followingsData} />
      <FollowList header="팔로워" data={followersData} onClickMore={loadMoreFollowers} loading={!followerError && !followersData} />
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  console.log('getServerSideProps start');
  console.log(context.req.headers);
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch(END);
  console.log('getServerSideProps end');
  await context.store.sagaTask.toPromise();

  // 서버에서 받은 데이터를 props에 넣어 리턴하면
  // 컴포넌트에서 props로 받을 수 있다
  // 이를 이용해서 swr에서도 ssr이 가능하다
  // return {props: { data: 123 }};
});

export default Profile;
