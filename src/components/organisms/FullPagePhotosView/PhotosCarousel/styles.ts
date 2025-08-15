import { Box, ButtonBase, styled } from '@mui/material';

export const StyledRoot = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  backgroundColor: theme.palette.common.black,

  '&:hover': {
    '& .MuiIconButton-root': {
      backgroundColor: theme.palette.common.white,
      opacity: '0.55',
    },
  },

  [theme.breakpoints.down('lg')]: {
    minHeight: 'min(70vh, 600px)',
  },
}));

export const StyledPhotosWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  padding: theme.spacing(0, 16),

  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(0, 10),
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0, 5),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(8, 0),
  },
}));

export const StyledSwitchAreaButton = styled(ButtonBase)(({ theme }) => ({
  position: 'absolute',
  width: '80px',
  height: '100%',
  '&:hover': {
    '& .icon': {
      backgroundColor: theme.palette.mode === 'light' ? theme.palette.common.white : 'transparent',
      opacity: '1 !important',
    },
    '& .rightIcon': {
      transform: 'translateY(-50%) translateX(5px)',
    },
    '& .leftIcon': {
      transform: 'translateY(-50%) translateX(-5px)',
    },
  },

  '& .MuiTouchRipple-child': {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },

  [theme.breakpoints.down('sm')]: {
    '& .icon': { opacity: '1 !important' },
  },
}));

export const StyledButtonIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '50%',
  width: '48px',
  height: '48px',
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '28px',

  opacity: '0',

  transition: [
    'opacity 0.1s cubic-bezier(0, 0, 1, 1)',
    'transform 0.15s cubic-bezier(0, 0, 1, 1)',
  ].join(', '),

  '&.rightIcon': {
    right: theme.spacing(2),
  },
  '&.leftIcon': {
    left: theme.spacing(2),
  },

  [theme.breakpoints.down('sm')]: {
    width: '38px',
    height: '38px',
    fontSize: '22px',
    opacity: '1',
    '&.rightIcon': {
      right: theme.spacing(1),
    },
    '&.leftIcon': {
      left: theme.spacing(1),
    },
    backgroundColor: `${theme.palette.common.black} !important`,
  },
}));
