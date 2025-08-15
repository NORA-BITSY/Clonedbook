import { Box, Stack, styled } from '@mui/material';

export const StyledContentContainer = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  height: '100%',
  padding: theme.spacing(0, 1.5),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const StyledContentSection = styled(Box)(({}) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '30%',
  height: '100%',
}));
