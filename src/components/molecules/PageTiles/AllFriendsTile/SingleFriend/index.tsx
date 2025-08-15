import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';

import { StyledRoot } from './styles';

import useGetMutualFriends from '@/common/friendsManage/useGetMutualFriends';
import useGetUserBasicInfo from '@/common/misc/userDataManagment/useGetUsersPublicData';
import UserLink from '@/components/atoms/UserLink';
import UserPicture from '@/components/atoms/UserPicture';
import AddFriendButton from '@/components/atoms/friendActionButtons/AddFriendButton';
import { SingleFriendProps } from './types';

export default function SingleFriend({ friendId, sx, ...rootProps }: SingleFriendProps) {
  const theme = useTheme();
  const friend = useGetUserBasicInfo(friendId);
  const mutualFrineds = useGetMutualFriends(friendId);
  const smallScreen = useMediaQuery(theme.breakpoints.down('xs'));
  if (!friend) return null;
  return (
    <StyledRoot
      sx={sx}
      {...rootProps}
      direction='row'
      alignItems='center'
      justifyContent='space-between'>
      <Stack direction='row' alignItems='center' height='100%' spacing={2}>
        <UserPicture
          sizes='150px'
          userId={friendId}
          sx={{
            height: smallScreen ? '80%' : '100%',
          }}
        />
        <Stack spacing={smallScreen ? 1 : 0}>
          <Box>
            <UserLink
              userId={friendId}
              usePopper
              lineHeight='1rem'
              variant='subtitle1'
              fontWeight={550}
            />
            <Typography color={theme.palette.text.secondary} fontWeight={400}>
              {mutualFrineds?.length} mutual friends
            </Typography>
          </Box>
          {smallScreen && (
            <AddFriendButton friendId={friendId} sx={{ minHeight: '36px' }} allowMenu />
          )}
        </Stack>
      </Stack>
      {!smallScreen && <AddFriendButton friendId={friendId} sx={{ height: '36px' }} allowMenu />}
    </StyledRoot>
  );
}
