import { useGetLoggedUserQuery } from '@/redux/services/loggedUserAPI';
import { TFriendStatus } from '@/types/firend';

export default function useGetFriendshipStatus(userId: string) {
  const { data: loggedUser } = useGetLoggedUserQuery({});
  if (!loggedUser) return null;
  const friendsMap = loggedUser.friends || {};
  const friendshipStatus: TFriendStatus | null = friendsMap[userId]?.status || null;
  return friendshipStatus;
}
