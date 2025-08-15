import { Box, useTheme } from '@mui/material';

import { StyledRoot } from './styles';

import HorizontalContentDevider from '@/components/atoms/contentDeviders/HorizontalContentDevider';
import FriendRequests from './sections/FriendRequests';
import PeopleYouMayKnow from './sections/PeopleYouMayKnow';
import { HomeTabProps } from './types';

export default function HomeTab({ sx, ...rootProps }: HomeTabProps) {
  const theme = useTheme();
  return (
    <StyledRoot sx={sx} {...rootProps} spacing={4}>
      <FriendRequests />
      <Box position='relative'>
        <HorizontalContentDevider bottom={theme.spacing(1.5)} />
      </Box>
      <PeopleYouMayKnow />
    </StyledRoot>
  );
}
