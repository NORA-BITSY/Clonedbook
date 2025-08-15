import getAcceptedFriends from '@/common/friendsManage/getAcceptedFriends';
import { useGetLoggedUserQuery } from '@/redux/services/loggedUserAPI';
import useGetUsersPublicFriends from '../misc/userDataManagment/useGetUsersPublicFriends';

export default function useGetMutualFriends(friendId: string) {
  const { data: loggedUser } = useGetLoggedUserQuery({});
  const userFriends = useGetUsersPublicFriends(friendId);
  if (!userFriends || !loggedUser) return [];
  const loggedUserFriends = getAcceptedFriends(loggedUser) || [];
  const mutualFriends =
    Object.values(loggedUserFriends)
      .filter((friend) => {
        return userFriends[friend.id];
      })
      .sort((b, a) => b?.acceptedAt?.seconds - a?.acceptedAt?.seconds) || [];
  return mutualFriends;
}
