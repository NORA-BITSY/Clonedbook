import { Box, BoxProps, Typography } from '@mui/material';

import useGetFriendRequests from '@/common/friendsManage/useGetUsersFriendRequests';
import { StyledFriendTilesWrapper } from '../../../styles';
import FriendTile from '../../FriendTile';

export default function FriendRequests({ sx, ...rootProps }: BoxProps) {
  const friendRequests = useGetFriendRequests();
  return (
    <Box sx={sx} {...rootProps} position='relative'>
      <Typography textTransform='capitalize' variant='h4' fontWeight={650}>
        friend requests
      </Typography>
      <StyledFriendTilesWrapper>
        {friendRequests.map(([userId]) => (
          <FriendTile key={userId} userId={userId} />
        ))}
      </StyledFriendTilesWrapper>
    </Box>
  );
}
