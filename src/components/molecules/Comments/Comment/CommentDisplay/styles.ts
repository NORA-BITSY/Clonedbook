import { Stack, styled } from '@mui/material';

export const StyledTextContent = styled(Stack)(({ theme }) => ({
  position: 'relative',
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.secondary.main,
  padding: theme.spacing(1, 1.5),
  borderRadius: '18px',
}));
