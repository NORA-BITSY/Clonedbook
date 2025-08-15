import { IUser } from '@/types/user';
import { StackProps } from '@mui/material';

export interface AllPicturesTileProps extends StackProps {
  profileData: IUser;
}
