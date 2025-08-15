import ScrollableBox from '@/components/atoms/scrollables/ScrollableBox';
import { Button, IconButton, Stack, darken, lighten, styled } from '@mui/material';

export const StyledRoot = styled(ScrollableBox)(({ theme }) => ({
  position: 'relative',
  width: 'min(96vw, 500px)',
  maxHeight: 'min(96vh, 760px)',
  color: theme.palette.text.primary,
  overflowY: 'auto',
}));

export const DialogCloseIconButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1.5),
  right: theme.spacing(2),
  width: '36px',
  height: '36px',
}));

export const StyledMainContentStack = styled(Stack)(({}) => ({
  maxHeight: '100%',
}));

export const PostSubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(1.1, 2),
  color: theme.palette.common.white,
  transition: 'all 0.1s ease-out',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? darken(theme.palette.primary.main, 0.1)
        : lighten(theme.palette.primary.main, 0.1),
  },
}));
