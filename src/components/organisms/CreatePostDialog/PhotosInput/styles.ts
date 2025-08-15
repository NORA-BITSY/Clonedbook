import { Box, ButtonBase, IconButton, darken, lighten, styled } from '@mui/material';

export const StyledRoot = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  minHeight: '240px',
  padding: theme.spacing(2),
  margin: 'auto',
  borderRadius: '6px',
  pointerEvents: 'none',
  color: theme.palette.text.primary,
}));

export const StyledBorderBox = styled(Box)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(1),
  borderRadius: '8px',
  border: `1px solid`,
}));

export const StyledPhotoAddButton = styled(ButtonBase)(({ theme }) => ({
  width: '100%',
  maxHeight: '100%',
  minHeight: '240px',
  backgroundColor: theme.palette.secondary.main,
  borderRadius: '6px',
  pointerEvents: 'all',
  position: 'relative',
  display: 'flex',

  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? darken(theme.palette.secondary.main, 0.05)
        : lighten(theme.palette.secondary.main, 0.2),
  },
  cursor: 'pointer',
}));

export const StyledPhotoDropArea = styled('label')(({}) => ({
  position: 'absolute',
  left: 0,
  top: 0,

  width: '100%',
  minHeight: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}));

export const StyledDragOverOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundColor: theme.palette.secondary.main,
  opacity: 0.3,
}));

export const StyledPhotosResetIcon = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(4.5),
  right: theme.spacing(4.5),
  width: '30px',
  height: '30px',
  backgroundColor: theme.palette.secondary.main,
  zIndex: 20,
  pointerEvents: 'all',
  boxShadow: theme.shadows[7],

  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));
