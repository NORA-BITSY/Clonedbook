import { ITimestamp } from './timestamp';
import { IUserBasicInfo } from './user';

export interface IFriend {
  id: string;
  chatId: string;
  status: TFriendStatus;
  acceptedAt: ITimestamp;
}

export interface IFriendWithBasicInfo extends IFriend {
  basicInfo: IUserBasicInfo;
}

export interface IFriendsMap {
  [key: string]: IFriend;
}

//Format of the firebase all public friends document
export interface IPublicFriendsMap {
  [key: string]: ITimestamp;
}

export interface IPublicFriend {
  id: string;
  timestamp: ITimestamp;
}

export type TFriendStatus = 'accepted' | 'req_sent' | 'req_received';
