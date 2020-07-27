import React from 'react';

import AppLayout from '../components/AppLayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';

const Profile = () => {
    const followingList = [{ nickname: '홍길동' }, { nickname: '임꺽정' }, { nickname: '박기홍' }];
    const followerList = [{ nickname: '홍길동' }, { nickname: '임꺽정' }, { nickname: '박기홍' }];

    return (
        <AppLayout>
            <NicknameEditForm />
            <FollowList header='팔로잉 목록' data={followingList} />
            <FollowList header='팔로워 목록' data={followerList} />
        </AppLayout>
    )
};

export default Profile;