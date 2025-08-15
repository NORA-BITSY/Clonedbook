import { BoxProps, Stack } from '@mui/material';

import { StyledPostContentWrapper, StyledRoot } from '../../styles';
import { StyledHorizontalHole, StyledRoundHole } from './styles';

export default function LoadingPostPlaceholder({ sx, ...rootProps }: BoxProps) {
  return (
    <StyledRoot sx={sx} {...rootProps}>
      <StyledPostContentWrapper height={300} position='relative' overflow='hidden'>
        <Stack width='100%' height='100%' pt={1} pb={2} justifyContent='space-between'>
          <Stack direction='row' spacing={2}>
            <StyledRoundHole />
            <Stack spacing={0.5} pt={1}>
              <StyledHorizontalHole width='80px' />
              <StyledHorizontalHole width='100px' />
            </Stack>
          </Stack>
          <Stack direction='row' width='100%' justifyContent='space-around'>
            <StyledHorizontalHole width='min(70px, 30%)' />
            <StyledHorizontalHole width='min(70px, 30%)' />
            <StyledHorizontalHole width='min(70px, 30%)' />
          </Stack>
        </Stack>
      </StyledPostContentWrapper>
    </StyledRoot>
  );
}
